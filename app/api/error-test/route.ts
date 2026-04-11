import { NextResponse } from "next/server";
import { logError, extractRequestContext } from "@/lib/error-logger";
import { NextRequest } from "next/server";

/** GET /api/error-test — test error logging (admin only, remove later) */
export async function GET(req: NextRequest) {
  const ctx = extractRequestContext(req);
  await logError({ statusCode: 500, ...ctx, errorMessage: "Test error log entry" });
  return NextResponse.json({ ok: true, logged: true });
}
