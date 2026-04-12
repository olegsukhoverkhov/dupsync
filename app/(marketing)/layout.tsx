import { cookies } from "next/headers";
import { InteractionTracker } from "@/components/marketing/interaction-tracker";
import { ErrorReporter as MarketingErrorReporter } from "@/components/dashboard/error-reporter";

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

  return (
    <>
      {children}
      <InteractionTracker />
      <MarketingErrorReporter />
    </>
  );
}
