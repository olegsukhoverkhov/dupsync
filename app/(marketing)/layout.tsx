import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { trackVisit } from "@/lib/analytics";

/**
 * Marketing route group layout.
 *
 * Two responsibilities:
 *
 *  1. Opt every page under `(marketing)` out of Next's static
 *     prerendering by touching `cookies()`. Dynamic rendering is
 *     required so `proxy.ts` actually runs on every request and
 *     can do the geo-based locale auto-redirect with the full path
 *     (`/pricing` → `/es/pricing`) instead of a coarse `/es`.
 *
 *  2. Fire the visit tracker via `after()` so the upsert into
 *     `site_visits` runs AFTER the response is sent. The tracker
 *     never blocks first byte, never throws back into render, and
 *     only touches the DB via the service-role client — see
 *     `lib/analytics.ts`.
 *
 * The cost is one extra edge invocation per cold navigation (tiny).
 * Subsequent navigations with the locale cookie set skip the proxy's
 * country-lookup branch entirely.
 */
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Touching cookies() forces this layout (and every child page) to
  // render dynamically. The returned value is unused here on purpose —
  // the geo logic lives in proxy.ts which executes before this layout.
  await cookies();

  // Read the request context eagerly. Next disallows calling headers()
  // inside an after() callback, so we have to pluck values here and
  // close over them. See the runtime error shape in the Next docs:
  // https://nextjs.org/docs/app/api-reference/functions/after
  const h = await headers();
  const ip =
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";
  const userAgent = h.get("user-agent") || null;
  const country =
    h.get("cf-ipcountry") || h.get("x-vercel-ip-country") || null;
  const path =
    h.get("x-invoke-path") ||
    h.get("x-pathname") ||
    h.get("next-url") ||
    "/";

  console.log(`[marketing-layout] scheduling trackVisit ip=${ip?.slice(0, 12)} path=${path}`);
  // Fire-and-forget — runs AFTER the response is streamed to the
  // browser, so page render is not blocked by the tracking insert.
  after(() => trackVisit({ ip, userAgent, country, path }));

  return <>{children}</>;
}
