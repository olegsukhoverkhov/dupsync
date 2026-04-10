import { NextRequest, NextResponse } from "next/server";
import {
  completeLipSyncFromWebhook,
  handleLipSyncFailureFromWebhook,
} from "@/lib/pipeline";
import { extractVideoUrlFromWebhook } from "@/lib/ai";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // retries with delays + upload can take several minutes

/**
 * Webhook receiver for fal.ai lip sync jobs.
 *
 * fal.ai POSTs to this endpoint when a job submitted via
 * `/api/dub/lipsync` (which calls `submitLipSyncJob`) completes — either
 * successfully or with a failure.
 *
 * Expected URL format:
 *   /api/webhooks/fal-lipsync?dubId=<uuid>&attempt=<1|2>
 *
 * The dubId is in the query string so we don't need to look it up by
 * fal_request_id (faster, fewer round trips). The `attempt` is logged
 * for observability.
 *
 * Webhook body shapes (per fal.ai docs):
 *   Success: { request_id, status: "OK", payload: { video: { url } } }
 *   Failure: { request_id, status: "ERROR", error, payload: {...} }
 *
 * fal.ai retries the webhook up to 10 times over 2 hours if we don't
 * return 2xx, so this handler must be idempotent. We achieve idempotency
 * by checking dub.status: if already "done", we return 200 without doing
 * anything.
 */
export async function POST(req: NextRequest) {
  const dubId = req.nextUrl.searchParams.get("dubId");
  const attempt = req.nextUrl.searchParams.get("attempt") || "1";

  if (!dubId) {
    console.error("[FAL_WEBHOOK] Missing dubId query param");
    return NextResponse.json({ error: "Missing dubId" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (err) {
    console.error(`[FAL_WEBHOOK] Invalid JSON for dub ${dubId}:`, err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = (body.status as string | undefined)?.toUpperCase();
  const requestId = body.request_id as string | undefined;
  console.log(
    `[FAL_WEBHOOK] dubId=${dubId} attempt=${attempt} status=${status} request_id=${requestId}`
  );

  // Idempotency: if the dub is already done, ignore re-deliveries
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("id, status, fal_request_id")
    .eq("id", dubId)
    .single();
  if (!dub) {
    console.warn(`[FAL_WEBHOOK] Dub ${dubId} not found, ignoring webhook`);
    return NextResponse.json({ ok: true });
  }
  if (dub.status === "done" || dub.status === "error") {
    console.log(`[FAL_WEBHOOK] Dub ${dubId} already ${dub.status}, ignoring re-delivery`);
    return NextResponse.json({ ok: true });
  }
  // Optional sanity check: request_id should match what we stored
  if (requestId && dub.fal_request_id && requestId !== dub.fal_request_id) {
    console.warn(
      `[FAL_WEBHOOK] Stale webhook for dub ${dubId}: got ${requestId}, expected ${dub.fal_request_id} — ignoring`
    );
    return NextResponse.json({ ok: true });
  }

  if (status === "OK") {
    // Extract the synced video URL from the payload
    const videoUrl = extractVideoUrlFromWebhook(body.payload);
    if (!videoUrl) {
      console.error(
        `[FAL_WEBHOOK] OK status but no video URL in payload for dub ${dubId}:`,
        JSON.stringify(body.payload).slice(0, 500)
      );
      // Treat as failure so we can try the fallback model
      await handleLipSyncFailureFromWebhook(
        dubId,
        "Webhook OK but no video URL in payload"
      );
      return NextResponse.json({ ok: true });
    }
    await completeLipSyncFromWebhook(dubId, videoUrl);
    return NextResponse.json({ ok: true });
  }

  // status === "ERROR" or unknown — treat as failure
  let errorMsg: string;
  if (typeof body.error === "string") {
    errorMsg = body.error;
  } else if (body.payload != null) {
    errorMsg = JSON.stringify(body.payload).slice(0, 300);
  } else {
    errorMsg = `Unknown fal.ai error (status=${status})`;
  }
  await handleLipSyncFailureFromWebhook(dubId, errorMsg);
  return NextResponse.json({ ok: true });
}
