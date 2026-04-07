import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { runLipSync } from "@/lib/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Vercel Cron job — runs every 5 minutes to retry dubs whose lip sync
 * failed due to transient fal.ai errors.
 *
 * A dub is a retry candidate when:
 *   - status = "done" (Stage 2 finished... but with audio-only)
 *   - dubbed_video_url ends with `.wav` (no video file produced)
 *   - error_message starts with "Lip sync" (we know it was a lip sync failure)
 *   - cron_retried_at IS NULL (we haven't tried via cron yet)
 *   - updated_at > now() - 6 hours (don't keep trying old dubs forever)
 *
 * For each candidate we:
 *   1. Stamp cron_retried_at so we never retry the same dub twice
 *   2. Reset status back to audio_ready and clear error_message
 *   3. Call runLipSync(dubId) which submits a fresh fal.ai job via webhook
 *
 * The webhook handler then drives the dub to completion exactly like a
 * normal Stage 2 run. The whole cron job exits in <10 seconds because
 * runLipSync only submits — it doesn't wait for the webhook.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically
 * when CRON_SECRET is set as an env var.
 */
export async function GET(req: NextRequest) {
  // Auth check — only Vercel Cron should be able to hit this
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    console.warn("[CRON_RETRY] Unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

  // Find candidates
  const { data: candidates, error: queryErr } = await supabase
    .from("dubs")
    .select("id, project_id, target_language, dubbed_video_url, error_message, updated_at")
    .eq("status", "done")
    .like("dubbed_video_url", "%.wav")
    .ilike("error_message", "%lip sync%")
    .is("cron_retried_at", null)
    .gt("updated_at", sixHoursAgo)
    .limit(20);

  if (queryErr) {
    console.error("[CRON_RETRY] Query failed:", queryErr);
    return NextResponse.json({ error: queryErr.message }, { status: 500 });
  }

  if (!candidates || candidates.length === 0) {
    console.log("[CRON_RETRY] No failed dubs to retry");
    return NextResponse.json({ retried: 0 });
  }

  console.log(`[CRON_RETRY] Found ${candidates.length} failed dubs to retry`);

  let succeeded = 0;
  let failed = 0;

  for (const dub of candidates) {
    try {
      // Stamp cron_retried_at FIRST so a parallel cron run can't pick the
      // same dub. Also reset status + clear error so the new lip sync run
      // can drive the dub forward through audio_ready → lip_syncing → done.
      const { error: updateErr } = await supabase
        .from("dubs")
        .update({
          status: "audio_ready",
          progress: 80,
          error_message: null,
          cron_retried_at: new Date().toISOString(),
          fal_request_id: null,
          fal_model: null,
          fal_attempt: 0,
        })
        .eq("id", dub.id)
        .is("cron_retried_at", null); // double-check no race

      if (updateErr) {
        console.warn(`[CRON_RETRY] Failed to claim dub ${dub.id}:`, updateErr.message);
        failed++;
        continue;
      }

      // Also bump the parent project back to "dubbing" so the dashboard
      // shows it as in-progress again.
      await supabase
        .from("projects")
        .update({ status: "dubbing" })
        .eq("id", dub.project_id);

      console.log(`[CRON_RETRY] Submitting lip sync for dub ${dub.id} (${dub.target_language})`);
      // Submit Stage 2 — this returns quickly (just submits the fal.ai job
      // with webhook URL). The webhook drives completion.
      await runLipSync(dub.id);
      succeeded++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      console.error(`[CRON_RETRY] Retry failed for dub ${dub.id}: ${msg}`);
      failed++;
      // The dub already has cron_retried_at set, so we won't try again.
      // Mark it back as done with a "cron retry failed" marker so the
      // dashboard reflects the final state.
      await supabase
        .from("dubs")
        .update({
          status: "done",
          progress: 100,
          error_message: `Cron retry failed: ${msg.slice(0, 400)}`,
        })
        .eq("id", dub.id);
    }
  }

  return NextResponse.json({
    retried: candidates.length,
    succeeded,
    failed,
  });
}
