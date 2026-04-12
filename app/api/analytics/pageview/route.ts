import { NextRequest, NextResponse } from "next/server";
import { trackVisit, isBot } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/**
 * POST /api/analytics/pageview
 * Called from client-side after user interaction (scroll/click/mousemove).
 * Only records visit if: not a bot + has interaction confirmation.
 */
export async function POST(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";

  // Server-side bot check
  if (isBot(userAgent)) {
    return NextResponse.json({ ok: false, reason: "bot" });
  }

  let body: { path?: string; hasInteraction?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  // Must have interaction confirmation from client
  if (!body.hasInteraction) {
    return NextResponse.json({ ok: false, reason: "no_interaction" });
  }

  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";
  const country =
    req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || null;
  const path = body.path || "/";

  await trackVisit({ ip, userAgent, country, path });

  return NextResponse.json({ ok: true });
}
