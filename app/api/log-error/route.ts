import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/lib/error-logger";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/log-error — client-side error reporting endpoint.
 * Called from the dashboard error boundary and fetch interceptor.
 * Body: { statusCode, method, path, errorMessage }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      statusCode?: number;
      method?: string;
      path?: string;
      errorMessage?: string;
    };

    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id || null;
    } catch {}

    const ip = req.headers.get("cf-connecting-ip")
      || req.headers.get("x-real-ip")
      || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || null;

    await logError({
      statusCode: body.statusCode || 500,
      method: body.method || "UNKNOWN",
      path: body.path || "/unknown",
      errorMessage: body.errorMessage || "Client-reported error",
      userId,
      ip,
      userAgent: req.headers.get("user-agent"),
      country: req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
