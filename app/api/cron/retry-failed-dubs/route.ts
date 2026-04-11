import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { runLipSync, completeLipSyncFromWebhook } from "@/lib/pipeline";
import { extractVideoUrlFromWebhook } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Cron job — runs every 1 minute. Recovers stuck dubs automatically
 * so the pipeline never depends on the user having a browser tab open.
 *
 * Cases handled:
 *   A. audio_ready + no fal_request_id + stuck > 2 min → start lip sync
 *   B. lip_syncing + fal_request_id + stuck > 2 min → poll fal.ai status
 *   C. done + .wav URL + lip sync error → re-submit lip sync
 *
 * No single-retry lock — dubs can be retried multiple times until they
 * succeed or hit the max attempt limit in handleLipSyncFailureFromWebhook.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

  let recovered = 0;
  let polled = 0;

  // ── CASE A: audio_ready but lip sync never started ─────────
  {
    const { data: stuck } = await supabase
      .from("dubs")
      .select("id, project_id, target_language")
      .eq("status", "audio_ready")
      .lt("updated_at", twoMinAgo)
      .gt("updated_at", sixHoursAgo)
      .limit(10);

    for (const dub of stuck || []) {
      try {
        console.log(`[CRON] Case A: starting lip sync for ${dub.id} (${dub.target_language})`);
        await supabase.from("projects").update({ status: "dubbing" }).eq("id", dub.project_id);
        await runLipSync(dub.id);
        recovered++;
      } catch (err) {
        console.error(`[CRON] Case A failed for ${dub.id}:`, err instanceof Error ? err.message : err);
      }
    }
  }

  // ── CASE B: lip_syncing but webhook never arrived ──────────
  {
    const { data: stuck } = await supabase
      .from("dubs")
      .select("id, project_id, target_language, fal_request_id, fal_model, fal_attempt")
      .eq("status", "lip_syncing")
      .not("fal_request_id", "is", null)
      .lt("updated_at", twoMinAgo)
      .gt("updated_at", sixHoursAgo)
      .limit(10);

    for (const dub of stuck || []) {
      try {
        const model = dub.fal_model || "fal-ai/latentsync";
        const statusRes = await fetch(
          `https://queue.fal.run/${model}/requests/${dub.fal_request_id}/status`,
          { headers: { Authorization: `Key ${process.env.FAL_KEY}` } }
        );
        if (!statusRes.ok) continue;

        const statusBody = (await statusRes.json()) as { status?: string };
        console.log(`[CRON] Case B: ${dub.id} (${dub.target_language}) fal=${statusBody.status}`);

        if (statusBody.status === "COMPLETED") {
          const resultRes = await fetch(
            `https://queue.fal.run/${model}/requests/${dub.fal_request_id}`,
            { headers: { Authorization: `Key ${process.env.FAL_KEY}` } }
          );
          if (!resultRes.ok) continue;
          const result = await resultRes.json();
          const videoUrl = extractVideoUrlFromWebhook(result);
          if (videoUrl) {
            await completeLipSyncFromWebhook(dub.id, videoUrl);
            recovered++;
          }
        } else if (statusBody.status === "FAILED" || statusBody.status === "ERROR") {
          // Reset to audio_ready so it re-submits on next tick
          await supabase.from("dubs").update({
            status: "audio_ready",
            fal_request_id: null,
            fal_model: null,
            fal_attempt: (dub.fal_attempt || 0) + 1,
            error_message: null,
          }).eq("id", dub.id);
          polled++;
        }
        // IN_PROGRESS / IN_QUEUE — leave it, check again next tick
      } catch (err) {
        console.error(`[CRON] Case B failed for ${dub.id}:`, err instanceof Error ? err.message : err);
      }
    }
  }

  // ── CASE C: marked done but only has .wav (lip sync error) ─
  {
    const { data: stuck } = await supabase
      .from("dubs")
      .select("id, project_id, target_language, fal_attempt")
      .eq("status", "done")
      .like("dubbed_video_url", "%.wav")
      .gt("updated_at", sixHoursAgo)
      .limit(10);

    for (const dub of stuck || []) {
      // Don't retry forever — respect max attempts
      if ((dub.fal_attempt || 0) >= 4) continue;
      try {
        console.log(`[CRON] Case C: re-submitting lip sync for ${dub.id} (${dub.target_language})`);
        await supabase.from("dubs").update({
          status: "audio_ready",
          error_message: null,
          fal_request_id: null,
          fal_model: null,
        }).eq("id", dub.id);
        await supabase.from("projects").update({ status: "dubbing" }).eq("id", dub.project_id);
        await runLipSync(dub.id);
        recovered++;
      } catch (err) {
        console.error(`[CRON] Case C failed for ${dub.id}:`, err instanceof Error ? err.message : err);
      }
    }
  }

  console.log(`[CRON] Done: recovered=${recovered}, polled=${polled}`);
  return NextResponse.json({ recovered, polled });
}
