import { NextResponse, after } from "next/server";
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
  const { projectId, languages } = body as {
    projectId: string;
    languages: string[];
  };

  if (!projectId || !languages?.length) {
    return NextResponse.json(
      { error: "projectId and languages are required" },
      { status: 400 }
    );
  }

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

  // 1 second of video = 5 credits per language
  const durationSec = project.duration_seconds || 0;
  const requiredCredits = durationSec * 5 * languages.length;

  if (
    planLimits.credits !== -1 &&
    typedProfile.credits_remaining < requiredCredits
  ) {
    return NextResponse.json(
      { error: `Insufficient credits. You need ${requiredCredits} credits but have ${Math.floor(typedProfile.credits_remaining)} remaining. Upgrade your plan for more credits.` },
      { status: 403 }
    );
  }

  // Update project status
  await supabase
    .from("projects")
    .update({ status: "dubbing" })
    .eq("id", projectId);

  // Create dub records
  const dubInserts = languages.map((lang) => ({
    project_id: projectId,
    target_language: lang,
    status: "pending" as const,
  }));

  const { data: dubs, error } = await supabase
    .from("dubs")
    .insert(dubInserts)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Pre-deduct credits immediately to prevent over-spending
  if (planLimits.credits !== -1 && requiredCredits > 0) {
    await supabase
      .from("profiles")
      .update({
        credits_remaining: Math.max(0, typedProfile.credits_remaining - requiredCredits),
      })
      .eq("id", user.id);
  }

  // Start dubbing pipelines after response is sent
  after(async () => {
    for (const dub of dubs || []) {
      try {
        await runDubbing(dub.id);
      } catch (err) {
        console.error(`Dubbing failed for ${dub.id}:`, err);
      }
    }
  });

  return NextResponse.json(dubs, { status: 201 });
}
