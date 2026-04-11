import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { hashApiKey, looksLikeApiKey } from "@/lib/api-keys";
import type { Profile, PlanType } from "@/lib/supabase/types";

/**
 * Error envelope used by every `/v1/*` route.
 *
 * Shape intentionally matches Stripe/Linear API conventions so SDK
 * authors don't have to invent a new parser:
 *
 *   { "error": { "code": "insufficient_credits", "message": "..." } }
 */
export function apiError(
  code: string,
  message: string,
  status: number,
  extras?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    { error: { code, message, ...extras } },
    { status }
  );
}

export type AuthedContext = {
  /** The authenticated user (via Supabase auth.users). */
  userId: string;
  /** Full profile row — plan, credits, locale, etc. */
  profile: Profile;
  /** The `api_keys` row that authenticated this request. */
  apiKeyId: string;
};

/**
 * Authenticate an incoming `/v1/*` request.
 *
 * Flow:
 *   1. Extract `Authorization: Bearer <token>` from headers.
 *   2. Pre-filter with `looksLikeApiKey()` to avoid a DB roundtrip on
 *      obviously-garbage tokens.
 *   3. Hash the token and look it up in `api_keys` (only active rows,
 *      thanks to the partial index).
 *   4. Fetch the owning profile and enforce the plan gate
 *      (`pro` or `enterprise` required).
 *   5. Best-effort `last_used_at` / `last_used_ip` bump (non-blocking).
 *
 * Returns either a `NextResponse` (error) OR a `AuthedContext` on
 * success. Callers pattern-match:
 *
 *   const auth = await authenticateApiRequest(request);
 *   if (auth instanceof NextResponse) return auth;
 *   const { profile, apiKeyId } = auth;
 */
export async function authenticateApiRequest(
  request: NextRequest
): Promise<NextResponse | AuthedContext> {
  const header = request.headers.get("authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return apiError(
      "unauthorized",
      "Missing Authorization header. Expected `Authorization: Bearer <key>`.",
      401
    );
  }

  const token = header.slice(7).trim();
  if (!token || !looksLikeApiKey(token)) {
    return apiError("unauthorized", "Invalid API key format.", 401);
  }

  const keyHash = hashApiKey(token);
  const service = await createServiceClient();

  const { data: keyRow } = await service
    .from("api_keys")
    .select("id, user_id, expires_at, revoked_at")
    .eq("key_hash", keyHash)
    .is("revoked_at", null)
    .maybeSingle();

  if (!keyRow) {
    return apiError("unauthorized", "Invalid or revoked API key.", 401);
  }

  if (keyRow.expires_at && new Date(keyRow.expires_at) < new Date()) {
    return apiError("unauthorized", "API key has expired.", 401);
  }

  // Fetch the user's profile for plan gating and downstream logic
  const { data: profile } = await service
    .from("profiles")
    .select("*")
    .eq("id", keyRow.user_id)
    .single();

  if (!profile) {
    return apiError("unauthorized", "User profile not found.", 401);
  }

  const plan = (profile.plan as PlanType) || "free";
  if (plan !== "pro" && plan !== "enterprise") {
    return apiError(
      "plan_required",
      "API access requires a Pro or Business plan. Upgrade at https://dubsync.app/settings.",
      403
    );
  }

  // Best-effort last-used tracking. Don't block on it — we have the
  // answer the caller needs, and the auditing column is cosmetic.
  const rawIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  void service
    .from("api_keys")
    .update({
      last_used_at: new Date().toISOString(),
      last_used_ip: rawIp,
    })
    .eq("id", keyRow.id)
    .then(({ error }) => {
      if (error) {
        console.warn(
          `[API_AUTH] last_used_at bump failed for ${keyRow.id}:`,
          error.message
        );
      }
    });

  return {
    userId: keyRow.user_id,
    profile: profile as Profile,
    apiKeyId: keyRow.id,
  };
}
