import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runDubbing } from "@/lib/pipeline";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { Profile } from "@/lib/supabase/types";

export const maxDuration = 300;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectId, languages, burnSubs } = body as {
    projectId: string;
    languages: string[];
    burnSubs?: boolean;
  };

  if (!projectId || !languages?.length) {
    return NextResponse.json(
      { error: "projectId and languages are required" },
      { status: 400 }
    );
  }

  // Burn-in subtitles cost a flat +1 credit per output video (per
  // language). If the user opts in we need to reserve those credits
  // up front alongside the base dubbing cost, and persist the flag
  // on each dub row so Stage 3 knows to run.
  const wantsBurnedSubs = Boolean(burnSubs);

  // Check plan limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const typedProfile = profile as Profile;
  // Ensure credits_remaining is a number (DB returns string for numeric type)
  typedProfile.credits_remaining = Number(typedProfile.credits_remaining) || 0;
  typedProfile.topup_credits = Number(typedProfile.topup_credits) || 0;
  const planLimits = PLAN_LIMITS[typedProfile.plan];

  // Check concurrent project limit
  const { data: activeProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id)
    .in("status", ["dubbing", "transcribing"]);

  if (activeProjects && activeProjects.length >= planLimits.maxProjects) {
    return NextResponse.json(
      { error: `Your ${planLimits.name} plan allows max ${planLimits.maxProjects} concurrent project(s). Wait for current projects to finish or upgrade your plan.` },
      { status: 403 }
    );
  }

  if (languages.length > planLimits.maxLanguages) {
    return NextResponse.json(
      {
        error: `Your ${planLimits.name} plan allows max ${planLimits.maxLanguages} languages`,
      },
      { status: 403 }
    );
  }

  // Voice cloning pre-flight was removed intentionally. We used to
  // 503 here when the ElevenLabs monthly voice_add_edit_counter hit
  // its cap, but blocking every dub (even short ones that might not
  // need a fresh clone, or ones where the user is OK with a generic
  // voice fallback) felt too strict. The pipeline still detects the
  // quota error during Stage 1 and falls back to the multilingual
  // pre-made voice, marking the dub with a visible warning so the
  // user knows the result is not voice-cloned. See
  // runDubbingAudioOnce in lib/pipeline.ts.

  // Check credits
  const { data: project } = await supabase
    .from("projects")
    .select("duration_seconds")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // 1 credit = 1 minute of dubbed video in 1 language
  // + 1 credit per output video if the user opted into burned subs
  const durationSec = project.duration_seconds || 0;
  const durationMin = Math.ceil(durationSec / 60);
  const baseCredits = durationMin * languages.length;
  const subsCredits = wantsBurnedSubs ? languages.length : 0;
  const requiredCredits = baseCredits + subsCredits;

  // Effective balance = plan credits + one-time top-up credits.
  // Plan credits are spent first so the user never loses top-up credits
  // to a plan renewal, then any remainder comes from the top-up pool.
  const effectiveBalance =
    planLimits.credits === -1
      ? Infinity
      : typedProfile.credits_remaining + typedProfile.topup_credits;

  if (planLimits.credits !== -1 && effectiveBalance < requiredCredits) {
    // Client detects this exact prefix ("Insufficient credits.") to
    // swap the modal title from "Dubbing Error" to "Insufficient
    // credits" and to render the "Buy credits" CTA. Keep the phrase
    // stable when translating.
    return NextResponse.json(
      {
        error: `Insufficient credits. You need ${requiredCredits} credits but have ${Math.floor(
          effectiveBalance
        )} remaining.`,
        code: "insufficient_credits",
        required: requiredCredits,
        remaining: Math.floor(effectiveBalance),
      },
      { status: 403 }
    );
  }

  // Update project status
  await supabase
    .from("projects")
    .update({ status: "dubbing" })
    .eq("id", projectId);

  // Create dub records. `has_burned_subs` flips on the optional
  // Stage 3 (fal.ai auto-caption burn-in) that fires after lip sync
  // completes. Stored per-dub so the webhook handler can decide
  // without a project-level lookup.
  const dubInserts = languages.map((lang) => ({
    project_id: projectId,
    target_language: lang,
    status: "pending" as const,
    has_burned_subs: wantsBurnedSubs,
  }));

  const { data: dubs, error } = await supabase
    .from("dubs")
    .insert(dubInserts)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Pre-deduct credits immediately to prevent over-spending.
  // Drain plan credits first, then fall back to the top-up pool for any
  // remainder. Example: need 15, plan has 10, top-up has 20 →
  // plan goes to 0, top-up goes to 15.
  if (planLimits.credits !== -1 && requiredCredits > 0) {
    const fromPlan = Math.min(typedProfile.credits_remaining, requiredCredits);
    const fromTopup = requiredCredits - fromPlan;
    await supabase
      .from("profiles")
      .update({
        credits_remaining: Math.max(
          0,
          typedProfile.credits_remaining - fromPlan
        ),
        topup_credits: Math.max(0, typedProfile.topup_credits - fromTopup),
      })
      .eq("id", user.id);

    // Record usage per language
    const { data: projData } = await supabase
      .from("projects")
      .select("title")
      .eq("id", projectId)
      .single();

    // Each language costs `durationMin` base credits + 1 extra
    // for the optional burn-in pass. Spread evenly so the per-dub
    // usage row reflects what the user actually pays per language.
    const perLangCredits = durationMin + (wantsBurnedSubs ? 1 : 0);
    const usageInserts = languages.map((lang) => ({
      user_id: user.id,
      project_id: projectId,
      project_title: projData?.title || "Untitled",
      dub_language: lang,
      credits_used: perLangCredits,
      video_seconds: durationSec,
    }));

    // Surface any error instead of swallowing it. Historical bug: the
    // credit_usage table had RLS enabled but no INSERT policy, so
    // inserts were silently denied and the dashboard showed 0 credits
    // used for every project. An INSERT policy has since been added,
    // but we keep the logging so a future regression is immediately
    // visible in Vercel logs instead of hiding for weeks.
    const { error: usageError } = await supabase
      .from("credit_usage")
      .insert(usageInserts);
    if (usageError) {
      console.error(
        `[DUB] credit_usage insert failed for user=${user.id} project=${projectId}:`,
        usageError
      );
    }
  }

  // Run dubbing synchronously — client polls for status
  // after() was unreliable (timeout kills long-running lip sync)
  for (const dub of dubs || []) {
    try {
      await runDubbing(dub.id);
    } catch (err) {
      // Capture full error details (stack, name, message) so we can debug
      // mysterious failures from prod logs.
      const errInfo = {
        dubId: dub.id,
        target: dub.target_language,
        name: err instanceof Error ? err.name : typeof err,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack?.slice(0, 1500) : undefined,
      };
      console.error(`[DUB] Stage 1 failed:`, JSON.stringify(errInfo, null, 2));
      // Persist a clear error message on the dub itself so the UI can show it
      try {
        await supabase
          .from("dubs")
          .update({
            status: "error",
            error_message: `${errInfo.name}: ${errInfo.message}`.slice(0, 500),
          })
          .eq("id", dub.id);
      } catch {
        // ignore — DB update errors will surface elsewhere
      }
    }
  }

  return NextResponse.json(dubs, { status: 201 });
}
