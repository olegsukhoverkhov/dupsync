import { NextRequest, NextResponse } from "next/server";
import {
  completeBurnSubtitlesFromWebhook,
  handleBurnSubtitlesFailureFromWebhook,
} from "@/lib/pipeline";
import { extractVideoUrlFromWebhook } from "@/lib/ai";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Webhook receiver for fal.ai `auto-caption` subtitle burn jobs.
 *
 * Submitted from `runBurnSubtitles()` via `submitBurnSubtitlesJob()`.
 * fal.ai POSTs here when the burn finishes (or fails).
 *
 * URL format: /api/webhooks/fal-subs?dubId=<uuid>
 *
 * The `dubId` is in the query string so we can correlate without a
 * lookup by request_id. The handler is idempotent — re-deliveries
 * on already-done dubs return 200 without mutating anything.
 *
 * Failure contract: if burn-in fails at any step we DO NOT error out
 * the dub. The lip-synced video was already persisted in Stage 2,
 * so the user still has a working result; we just record the reason
 * on `error_message` and mark the dub as done.
 */
export async function POST(req: NextRequest) {
  const dubId = req.nextUrl.searchParams.get("dubId");
  if (!dubId) {
    console.error("[FAL_SUBS_WEBHOOK] Missing dubId query param");
    return NextResponse.json({ error: "Missing dubId" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (err) {
    console.error(`[FAL_SUBS_WEBHOOK] Invalid JSON for dub ${dubId}:`, err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = (body.status as string | undefined)?.toUpperCase();
  const requestId = body.request_id as string | undefined;
  console.log(
    `[FAL_SUBS_WEBHOOK] dubId=${dubId} status=${status} request_id=${requestId}`
  );

  // Idempotency — if the dub is already done with a subs URL, ignore
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("id, status, subs_fal_request_id, dubbed_video_with_subs_url")
    .eq("id", dubId)
    .single();
  if (!dub) {
    console.warn(`[FAL_SUBS_WEBHOOK] Dub ${dubId} not found, ignoring webhook`);
    return NextResponse.json({ ok: true });
  }
  if (dub.status === "done" && dub.dubbed_video_with_subs_url) {
    console.log(
      `[FAL_SUBS_WEBHOOK] Dub ${dubId} already has subs, ignoring re-delivery`
    );
    return NextResponse.json({ ok: true });
  }
  if (
    requestId &&
    dub.subs_fal_request_id &&
    requestId !== dub.subs_fal_request_id
  ) {
    console.warn(
      `[FAL_SUBS_WEBHOOK] Stale webhook for dub ${dubId}: got ${requestId}, expected ${dub.subs_fal_request_id} — ignoring`
    );
    return NextResponse.json({ ok: true });
  }

  if (status === "OK") {
    const videoUrl = extractVideoUrlFromWebhook(body.payload);
    if (!videoUrl) {
      console.error(
        `[FAL_SUBS_WEBHOOK] OK status but no video URL in payload for dub ${dubId}:`,
        JSON.stringify(body.payload).slice(0, 500)
      );
      await handleBurnSubtitlesFailureFromWebhook(
        dubId,
        "Webhook OK but no video URL in payload"
      );
      return NextResponse.json({ ok: true });
    }
    await completeBurnSubtitlesFromWebhook(dubId, videoUrl);
    return NextResponse.json({ ok: true });
  }

  let errorMsg: string;
  if (typeof body.error === "string") {
    errorMsg = body.error;
  } else if (body.payload != null) {
    errorMsg = JSON.stringify(body.payload).slice(0, 300);
  } else {
    errorMsg = `Unknown fal.ai error (status=${status})`;
  }
  await handleBurnSubtitlesFailureFromWebhook(dubId, errorMsg);
  return NextResponse.json({ ok: true });
}
