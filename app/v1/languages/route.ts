import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LANGUAGES } from "@/lib/supabase/constants";
import { authenticateApiRequest } from "@/lib/api-auth";
import { enforceRateLimit } from "@/lib/api-ratelimit";

export const dynamic = "force-dynamic";

/**
 * GET /v1/languages
 *
 * Returns the static list of languages DubSync can transcribe/dub into.
 * Useful for clients that want to render a language picker.
 *
 * Authentication: required (so crawlers / probes don't get a free
 * public endpoint, and so every 200 bumps `last_used_at`).
 */
export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) return auth;

  const limit = await enforceRateLimit(auth.apiKeyId, auth.profile.plan);
  if (limit.deny) return limit.deny;

  const res = NextResponse.json({
    languages: SUPPORTED_LANGUAGES.map((l) => ({
      code: l.code,
      name: l.name,
      region: l.region,
    })),
  });
  return limit.applyHeaders(res);
}
