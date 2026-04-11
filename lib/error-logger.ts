/**
 * Server-side error logger. Records 4xx/5xx errors to the error_logs
 * table for the admin Errors dashboard. Fire-and-forget — never blocks
 * the response.
 */
import { createHash } from "crypto";

type ErrorLogEntry = {
  statusCode: number;
  method: string;
  path: string;
  errorMessage: string;
  userId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  country?: string | null;
};

/**
 * Log an API error to the database. Non-blocking.
 */
export async function logError(entry: ErrorLogEntry): Promise<void> {
  try {
    const { createServiceClient } = await import("./supabase/server");
    const supabase = await createServiceClient();

    const salt = process.env.SITE_VISIT_SALT || "default";
    const ipHash = entry.ip
      ? createHash("sha256").update(salt + entry.ip).digest("hex")
      : null;

    await supabase.from("error_logs").insert({
      status_code: entry.statusCode,
      method: entry.method,
      path: entry.path,
      error_message: entry.errorMessage?.slice(0, 1000),
      user_id: entry.userId || null,
      ip_hash: ipHash,
      user_agent: entry.userAgent?.slice(0, 500),
      country: entry.country,
    });
  } catch (err) {
    // Never throw from the logger itself
    console.error("[ERROR_LOGGER] Failed to log error:", err);
  }
}

/**
 * Extract request context from a NextRequest for error logging.
 */
export function extractRequestContext(req: {
  method: string;
  url: string;
  headers: { get: (name: string) => string | null };
}): {
  method: string;
  path: string;
  ip: string | null;
  userAgent: string | null;
  country: string | null;
} {
  const url = new URL(req.url);
  return {
    method: req.method,
    path: url.pathname,
    ip:
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      null,
    userAgent: req.headers.get("user-agent"),
    country:
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      null,
  };
}
