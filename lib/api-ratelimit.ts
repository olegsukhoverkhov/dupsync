import { NextResponse } from "next/server";
import { apiError } from "./api-auth";
import type { PlanType } from "./supabase/types";

/**
 * API rate limiter.
 *
 * Policy
 * ------
 * Per-API-key sliding window by minute:
 *   - Pro        → 60  req/min
 *   - Enterprise → 300 req/min
 *
 * The limit is keyed on the `api_key.id`, not the user — this means
 * generating a second key doesn't get a user extra capacity (users
 * could game it otherwise).
 *
 * Backends
 * --------
 * Two implementations behind one interface:
 *
 *   1. **Upstash Redis** (preferred for production). Requires env:
 *        - UPSTASH_REDIS_REST_URL
 *        - UPSTASH_REDIS_REST_TOKEN
 *      Uses an atomic INCR + EXPIRE pattern. Accurate across the
 *      whole fleet of Vercel functions.
 *
 *   2. **In-memory Map** (fallback when Upstash env is missing).
 *      Each Vercel instance keeps its own counter, so a user who
 *      happens to hit different instances can exceed the limit by up
 *      to a factor of N (where N = active instances). Acceptable for
 *      MVP and solo developer use; Upstash should be wired before
 *      rolling out to production-scale customers.
 *
 * Response headers (both backends)
 * --------------------------------
 * Every `/v1/*` response — allowed or denied — includes:
 *
 *   X-RateLimit-Limit     — total allowed per window
 *   X-RateLimit-Remaining — approximate remaining
 *   X-RateLimit-Reset     — unix timestamp when the window resets
 *
 * On 429 we also send `Retry-After` in seconds.
 */

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetUnix: number;
};

/** Requests per minute by plan. */
function limitForPlan(plan: PlanType): number {
  switch (plan) {
    case "enterprise":
      return 300;
    case "pro":
      return 60;
    default:
      return 0; // should never reach rate limiter — auth blocks first
  }
}

// ── In-memory fallback ───────────────────────────────────────────────
const memoryBuckets = new Map<
  string,
  { count: number; resetAt: number }
>();

// Prevent unbounded growth of the Map on long-running instances.
// Cheap sweep: every few thousand requests, drop expired buckets.
let sweepCounter = 0;
function sweepIfNeeded(now: number) {
  sweepCounter++;
  if (sweepCounter < 5000) return;
  sweepCounter = 0;
  for (const [k, v] of memoryBuckets.entries()) {
    if (v.resetAt <= now) memoryBuckets.delete(k);
  }
}

async function checkMemory(
  key: string,
  limit: number
): Promise<RateLimitResult> {
  const now = Date.now();
  sweepIfNeeded(now);
  const windowMs = 60 * 1000;
  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetUnix: Math.ceil((now + windowMs) / 1000),
    };
  }
  bucket.count++;
  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetUnix: Math.ceil(bucket.resetAt / 1000),
  };
}

// ── Upstash Redis backend ────────────────────────────────────────────
async function checkUpstash(
  key: string,
  limit: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  // Bucket key includes the minute so the counter naturally resets.
  const minuteBucket = Math.floor(Date.now() / 60_000);
  const redisKey = `ratelimit:${key}:${minuteBucket}`;

  // Atomic INCR + EXPIRE via the Upstash REST pipeline.
  const pipelineRes = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["EXPIRE", redisKey, "65"], // slack > 60s so counters don't vanish mid-request
    ]),
    // Don't cache — these are hot counters that change every request
    cache: "no-store",
  });

  if (!pipelineRes.ok) {
    // Network or Redis outage — fail open to memory backend so we
    // don't take the whole API down on an infra hiccup.
    console.warn("[RATELIMIT] Upstash unavailable, falling back to memory");
    return checkMemory(key, limit);
  }

  const body = (await pipelineRes.json()) as Array<{ result: unknown }>;
  const count = Number(body?.[0]?.result ?? 1);
  const windowEndUnix = (minuteBucket + 1) * 60;

  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    resetUnix: windowEndUnix,
  };
}

/**
 * Run the rate limit check for a given API key + plan. Returns the
 * result; caller is responsible for setting headers and optionally
 * short-circuiting with a 429 response.
 */
export async function checkRateLimit(
  apiKeyId: string,
  plan: PlanType
): Promise<RateLimitResult> {
  const limit = limitForPlan(plan);
  if (limit === 0) {
    return { allowed: false, limit: 0, remaining: 0, resetUnix: 0 };
  }

  const useUpstash =
    Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
    Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  return useUpstash
    ? checkUpstash(apiKeyId, limit)
    : checkMemory(apiKeyId, limit);
}

/**
 * Convenience: convert a successful result into the standard headers
 * block that every response should carry.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetUnix),
  };
}

/**
 * If the result says denied, build a 429 response. Otherwise return
 * null so the caller can proceed with its own response.
 */
export function rateLimitDenyResponse(
  result: RateLimitResult
): NextResponse | null {
  if (result.allowed) return null;
  const retryAfter = Math.max(
    1,
    result.resetUnix - Math.floor(Date.now() / 1000)
  );
  const res = apiError(
    "rate_limit_exceeded",
    `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
    429,
    { retry_after: retryAfter }
  );
  res.headers.set("Retry-After", String(retryAfter));
  for (const [k, v] of Object.entries(rateLimitHeaders(result))) {
    res.headers.set(k, v);
  }
  return res;
}

/**
 * One-shot helper used by every `/v1/*` route: authenticate rate
 * limit + return 429 response if denied. Pattern:
 *
 *   const limit = await enforceRateLimit(auth.apiKeyId, auth.profile.plan);
 *   if (limit.deny) return limit.deny;
 *   const res = NextResponse.json(...);
 *   limit.applyHeaders(res);
 *   return res;
 */
export async function enforceRateLimit(
  apiKeyId: string,
  plan: PlanType
): Promise<{
  deny: NextResponse | null;
  applyHeaders: (res: NextResponse) => NextResponse;
}> {
  const result = await checkRateLimit(apiKeyId, plan);
  const headers = rateLimitHeaders(result);
  return {
    deny: rateLimitDenyResponse(result),
    applyHeaders: (res: NextResponse) => {
      for (const [k, v] of Object.entries(headers)) {
        res.headers.set(k, v);
      }
      return res;
    },
  };
}
