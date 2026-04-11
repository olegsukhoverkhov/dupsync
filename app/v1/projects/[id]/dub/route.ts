import { NextResponse, type NextRequest } from "next/server";
import { authenticateApiRequest, apiError } from "@/lib/api-auth";
import { enforceRateLimit } from "@/lib/api-ratelimit";
import { createServiceClient } from "@/lib/supabase/server";
import { runDubbing } from "@/lib/pipeline";
import { PLAN_LIMITS, SUPPORTED_LANGUAGES } from "@/lib/supabase/constants";
import type { Profile } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const VALID_LANG_CODES: Set<string> = new Set(
  SUPPORTED_LANGUAGES.map((l) => l.code)
);

/**
 * POST /v1/projects/:id/dub — start dubbing a project into one or more
 * target languages.
 *
 * Request body:
 *   { "languages": ["es", "fr", "ja"] }
 *
 * Response (202):
 *   {
 *     dubs: [
 *       { id: "...", target_language: "es", status: "..." },
 *       ...
 *     ],
 *     credits_charged: 15
 *   }
 *
 * Synchronously kicks off each dub (Stage 1: TTS + audio upload), then
 * returns. Stage 2 (lip sync via fal.ai) runs asynchronously via
 * webhook — clients poll `GET /v1/projects/:id/dubs` until every
 * `status === "done"` to collect final video URLs.
 *
 * Credit math mirrors the dashboard route:
 *   credits = ceil(duration_seconds / 60) * languages.length
 *
 * Plan credits consumed first, top-up credits second. 403 on
 * insufficient balance. Same billing semantics as the web app.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) return auth;

  const limit = await enforceRateLimit(auth.apiKeyId, auth.profile.plan);
  if (limit.deny) return limit.deny;

  const { id: projectId } = await params;

  // Body parse + validation
  let body: { languages?: unknown };
  try {
    body = (await request.json()) as { languages?: unknown };
  } catch {
    return limit.applyHeaders(apiError("invalid_request", "Invalid JSON body.", 400));
  }
  if (!Array.isArray(body.languages) || body.languages.length === 0) {
    return limit.applyHeaders(
      apiError("invalid_request", "`languages` must be a non-empty array of ISO codes.", 400)
    );
  }
  const languages: string[] = [];
  for (const l of body.languages) {
    if (typeof l !== "string" || !VALID_LANG_CODES.has(l)) {
      return limit.applyHeaders(
        apiError(
          "invalid_request",
          `Unknown language code: ${String(l)}. Call GET /v1/languages for the supported list.`,
          400
        )
      );
    }
    languages.push(l);
  }
  // Dedupe in case the client passes the same code twice
  const uniqueLangs = Array.from(new Set(languages));

  const service = await createServiceClient();

  // Load project — must belong to caller, must be ready to dub
  const { data: project } = await service
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", auth.userId)
    .maybeSingle();
  if (!project) {
    return limit.applyHeaders(apiError("not_found", "Project not found.", 404));
  }
  if (project.status === "transcribing") {
    return limit.applyHeaders(
      apiError(
        "project_not_ready",
        "Project is still being transcribed. Poll GET /v1/projects/:id until status is 'ready' or 'done'.",
        409
      )
    );
  }
  if (project.status === "error") {
    return limit.applyHeaders(
      apiError(
        "project_failed",
        project.error_message ||
          "Project transcription failed. Upload a new video.",
        409
      )
    );
  }

  // Plan limits
  const planLimits = PLAN_LIMITS[auth.profile.plan];
  if (uniqueLangs.length > planLimits.maxLanguages) {
    return limit.applyHeaders(
      apiError(
        "plan_limit_exceeded",
        `Your ${planLimits.name} plan allows max ${planLimits.maxLanguages} languages per dub request.`,
        403
      )
    );
  }

  // Credit math
  const durationSec = project.duration_seconds || 0;
  const durationMin = Math.ceil(durationSec / 60);
  const requiredCredits = durationMin * uniqueLangs.length;

  const freshProfile = auth.profile as Profile;
  const planCredits = Number(freshProfile.credits_remaining) || 0;
  const topupCredits = Number(freshProfile.topup_credits) || 0;
  const effectiveBalance =
    planLimits.credits === -1 ? Infinity : planCredits + topupCredits;

  if (planLimits.credits !== -1 && effectiveBalance < requiredCredits) {
    return limit.applyHeaders(
      apiError(
        "insufficient_credits",
        `Need ${requiredCredits} credits, have ${Math.floor(effectiveBalance)} (${Math.floor(planCredits)} plan + ${Math.floor(topupCredits)} top-up).`,
        402
      )
    );
  }

  // Reject if there are already active dubs for the same languages — avoid
  // duplicate charges. Caller can delete existing dubs first if they want
  // to re-run, same contract as the dashboard.
  const { data: existingDubs } = await service
    .from("dubs")
    .select("target_language, status")
    .eq("project_id", projectId)
    .in("target_language", uniqueLangs);
  const alreadyInProgress = (existingDubs || []).filter((d) =>
    ["pending", "translating", "generating_voice", "lip_syncing", "audio_ready", "done"].includes(
      d.status
    )
  );
  if (alreadyInProgress.length > 0) {
    return limit.applyHeaders(
      apiError(
        "conflict",
        `Dubs already exist for languages: ${alreadyInProgress.map((d) => d.target_language).join(", ")}. List them via GET /v1/projects/:id/dubs.`,
        409
      )
    );
  }

  // Mark project as dubbing (idempotent)
  await service.from("projects").update({ status: "dubbing" }).eq("id", projectId);

  // Create dub rows in one insert
  const { data: dubs, error: dubInsertError } = await service
    .from("dubs")
    .insert(
      uniqueLangs.map((lang) => ({
        project_id: projectId,
        target_language: lang,
        status: "pending" as const,
      }))
    )
    .select();
  if (dubInsertError || !dubs) {
    return limit.applyHeaders(
      apiError("db_error", dubInsertError?.message || "Failed to create dubs", 500)
    );
  }

  // Deduct credits: plan first, then top-up
  if (planLimits.credits !== -1 && requiredCredits > 0) {
    const fromPlan = Math.min(planCredits, requiredCredits);
    const fromTopup = requiredCredits - fromPlan;
    await service
      .from("profiles")
      .update({
        credits_remaining: Math.max(0, planCredits - fromPlan),
        topup_credits: Math.max(0, topupCredits - fromTopup),
      })
      .eq("id", auth.userId);

    // Usage log per language
    await service.from("credit_usage").insert(
      uniqueLangs.map((lang) => ({
        user_id: auth.userId,
        project_id: projectId,
        project_title: project.title,
        dub_language: lang,
        credits_used: durationMin,
        video_seconds: durationSec,
      }))
    );
  }

  // Kick off Stage 1 synchronously per dub. Stage 2 (lip sync) is
  // async via fal.ai webhook, so clients should poll the dubs list
  // until every status is "done".
  for (const dub of dubs) {
    try {
      await runDubbing(dub.id);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[API v1/dub] Stage 1 failed for ${dub.id}:`, errMsg);
      await service
        .from("dubs")
        .update({
          status: "error",
          error_message: errMsg.slice(0, 500),
        })
        .eq("id", dub.id);
    }
  }

  // Re-fetch dubs so the response reflects current statuses (some may
  // already be in "audio_ready" / "lip_syncing" / "done").
  const { data: fresh } = await service
    .from("dubs")
    .select("id, target_language, status, progress, error_message, created_at")
    .eq("project_id", projectId)
    .in(
      "id",
      dubs.map((d) => d.id)
    );

  const res = NextResponse.json(
    {
      dubs: fresh || [],
      credits_charged: requiredCredits,
    },
    { status: 202 }
  );
  return limit.applyHeaders(res);
}
