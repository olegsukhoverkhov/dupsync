import { NextRequest, NextResponse } from "next/server";
import {
  completeBurnSubtitlesFromWebhook,
  handleBurnSubtitlesFailureFromWebhook,
} from "@/lib/pipeline";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Webhook receiver for Shotstack render callbacks. Replaces the old
 * /api/webhooks/fal-subs flow that used fal-ai/auto-caption. See
 * `submitShotstackBurnJob` in lib/ai.ts for the rationale.
 *
 * Shotstack callback payload shape:
 *   {
 *     "type": "edit",
 *     "action": "render",
 *     "id": "<render-id>",
 *     "owner": "<shotstack-owner-id>",
 *     "status": "done" | "failed" | "rendering" | ...,
 *     "url": "https://shotstack-output.../<id>.mp4",
 *     "error": null | "<reason>",
 *     "completed": "2026-04-09T20:00:00.000Z"
 *   }
 *
 * URL format: /api/webhooks/shotstack-subs?dubId=<uuid>
 *
 * The handler is idempotent — Shotstack may send the callback twice
 * in rare cases. We key off `dubs.dubbed_video_with_subs_url` being
 * already populated to ignore re-deliveries.
 */
export async function POST(req: NextRequest) {
  const dubId = req.nextUrl.searchParams.get("dubId");
  if (!dubId) {
    console.error("[SHOTSTACK_WEBHOOK] Missing dubId query param");
    return NextResponse.json({ error: "Missing dubId" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (err) {
    console.error(`[SHOTSTACK_WEBHOOK] Invalid JSON for dub ${dubId}:`, err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = (body.status as string | undefined)?.toLowerCase();
  const renderId = body.id as string | undefined;
  console.log(
    `[SHOTSTACK_WEBHOOK] dubId=${dubId} status=${status} render_id=${renderId}`
  );

  // Idempotency — if the dub already has a burned-subs URL, ignore
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("id, status, subs_fal_request_id, dubbed_video_with_subs_url")
    .eq("id", dubId)
    .single();
  if (!dub) {
    console.warn(`[SHOTSTACK_WEBHOOK] Dub ${dubId} not found, ignoring`);
    return NextResponse.json({ ok: true });
  }
  if (dub.status === "done" && dub.dubbed_video_with_subs_url) {
    console.log(
      `[SHOTSTACK_WEBHOOK] Dub ${dubId} already has subs, ignoring re-delivery`
    );
    return NextResponse.json({ ok: true });
  }
  if (
    renderId &&
    dub.subs_fal_request_id &&
    renderId !== dub.subs_fal_request_id
  ) {
    console.warn(
      `[SHOTSTACK_WEBHOOK] Stale webhook for dub ${dubId}: got ${renderId}, expected ${dub.subs_fal_request_id} — ignoring`
    );
    return NextResponse.json({ ok: true });
  }

  // Shotstack sends intermediate status updates (queued / fetching
  // / rendering / saving) before the final done/failed. We only care
  // about terminal states — acknowledge anything else and move on.
  if (status !== "done" && status !== "failed") {
    console.log(
      `[SHOTSTACK_WEBHOOK] Intermediate status=${status} for dub ${dubId}, ignoring`
    );
    return NextResponse.json({ ok: true });
  }

  if (status === "done") {
    const videoUrl = body.url as string | undefined;
    if (!videoUrl) {
      console.error(
        `[SHOTSTACK_WEBHOOK] done status but no url in payload for dub ${dubId}:`,
        JSON.stringify(body).slice(0, 500)
      );
      await handleBurnSubtitlesFailureFromWebhook(
        dubId,
        "Shotstack done but no url in callback body"
      );
      return NextResponse.json({ ok: true });
    }
    await completeBurnSubtitlesFromWebhook(dubId, videoUrl);
    return NextResponse.json({ ok: true });
  }

  // status === "failed"
  const errorMsg =
    (body.error as string | undefined) ||
    `Shotstack render failed (status=${status})`;
  await handleBurnSubtitlesFailureFromWebhook(dubId, errorMsg);
  return NextResponse.json({ ok: true });
}
