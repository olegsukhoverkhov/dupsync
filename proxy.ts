import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { LOCALES, type Locale } from "@/lib/i18n/dictionaries";
import { countryToLocale } from "@/lib/i18n/country-locale";

/**
 * Name of the cookie that records the user's effective locale choice.
 *
 * Set whenever the user lands on any localized path (explicit navigation
 * or via the geo auto-redirect below). Once present, proxy.ts NEVER again
 * tries to rewrite the URL based on geo — the user is in control of
 * their locale from that point forward via the language switcher.
 */
const LOCALE_COOKIE = "dubsync_locale";
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Non-localizable path prefixes. We never attempt a geo redirect when the
 * request is for an API route, auth callback, dashboard, static asset, etc.
 * The marketing site is the only surface that benefits from localization.
 */
const NON_LOCALIZABLE_PREFIXES = [
  "/api",
  "/v1", // public REST API — stays en-US, never geo-redirected
  "/callback",
  "/dashboard",
  "/admin", // private admin stats — never geo-redirected or indexed
  "/login",
  "/signup",
  "/settings",
  "/credits",
  "/projects",
  "/_next",
  "/favicon",
];

/**
 * Resolve the visitor's preferred locale from request headers.
 *
 * Resolution order (first non-`en` match wins):
 *
 *   1. `cf-ipcountry` — Cloudflare sets this to the **real** client
 *      country when it proxies traffic to Vercel. On dubsync.app CF
 *      sits in front of Vercel, which means `x-vercel-ip-country` at
 *      the origin reflects the geolocation of the CF edge node (e.g.
 *      Warsaw/PL), NOT the actual visitor. Prefer CF when present.
 *   2. `x-vercel-ip-country` — fallback for direct-to-Vercel traffic
 *      (no CF in front, e.g. preview deploys or future rollback).
 *   3. `accept-language` — browser preference, a comma-separated list
 *      of tags like `es-ES,es;q=0.9,en;q=0.8`. First tag wins.
 *
 * If a higher-priority source yields `en` (unknown country → default),
 * we fall through to the next source instead of returning immediately
 * — e.g. a visitor from Ukraine on `accept-language: es-ES` should
 * still land on `/es` because their browser is Spanish. Only when ALL
 * sources yield `en` do we return `en`.
 */
function resolveLocaleFromHeaders(request: NextRequest): Locale {
  const tryResolve = (raw: string | null | undefined): Locale | null => {
    if (!raw || raw === "XX") return null;
    const mapped = countryToLocale(raw);
    return mapped === "en" ? null : mapped;
  };

  // 1. Cloudflare (primary when CF fronts the origin)
  const cfLocale = tryResolve(request.headers.get("cf-ipcountry"));
  if (cfLocale) return cfLocale;

  // 2. Vercel (primary when no CF fronts the origin)
  const vercelLocale = tryResolve(request.headers.get("x-vercel-ip-country"));
  if (vercelLocale) return vercelLocale;

  // 3. Accept-Language browser preference
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const firstTag = acceptLanguage.split(",")[0]?.trim() ?? "";
    const lang = firstTag.toLowerCase().split(/[-_]/)[0];
    if ((LOCALES as readonly string[]).includes(lang) && lang !== "en") {
      return lang as Locale;
    }
  }

  return "en";
}

function isLocalePathSegment(seg: string): boolean {
  return (LOCALES as readonly string[]).includes(seg);
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — redirect to login if not authenticated.
  // /admin is included so scanners hitting /admin/stats while logged
  // out get bounced to /login instead of seeing the React 404 page.
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from login/signup to dashboard
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ── Geo-based locale auto-redirect ──────────────────────────────────
  //
  // On a visitor's first landing on any marketing URL, look at their
  // country (via Vercel/Cloudflare headers) and — if it maps to one of
  // our supported locales — rewrite the URL to the localized variant
  // while preserving the path. Example:
  //
  //   visitor from Spain → GET /pricing → 308 → /es/pricing
  //
  // A cookie is then set so subsequent requests never re-trigger the
  // redirect. The user can always switch locales via the language
  // switcher in the site header, which updates the cookie.
  //
  // Guard conditions:
  //   1. Only GET requests (not API / POST / preflight).
  //   2. Skipped when the URL already starts with a locale segment
  //      (those are handled by the (localized) route group).
  //   3. Skipped for non-localizable paths (auth, dashboard, static).
  //   4. Skipped when LOCALE_COOKIE is already set.
  //   5. Skipped when mapped locale is `en` (no rewrite needed). We
  //      still stamp the cookie so we don't keep re-running this check.
  //
  // NOTE: This proxy would normally be short-circuited by Vercel's CDN
  // for prerendered marketing pages. To avoid that, the marketing layout
  // (`app/(marketing)/layout.tsx`) calls `cookies()` which opts the whole
  // marketing subtree into dynamic rendering, ensuring this proxy
  // actually runs on every request.
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const alreadyLocalized = isLocalePathSegment(firstSegment);

  // If the user is already on a localized URL (e.g. clicked the language
  // switcher), remember their choice so future geo checks are skipped.
  if (alreadyLocalized && !request.cookies.get(LOCALE_COOKIE)) {
    supabaseResponse.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  const isNonLocalizable = NON_LOCALIZABLE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Only run the geo redirect for safe navigation methods. Accept both
  // GET and HEAD so curl -I testing, link preview bots, and prefetchers
  // all see the same redirect behavior.
  const isNavigation =
    request.method === "GET" || request.method === "HEAD";

  if (
    isNavigation &&
    !alreadyLocalized &&
    !isNonLocalizable &&
    !request.cookies.get(LOCALE_COOKIE)
  ) {
    const mapped = resolveLocaleFromHeaders(request);
    if (mapped !== "en") {
      const url = request.nextUrl.clone();
      // Path-preserving: `/` → `/es`, `/pricing` → `/es/pricing`,
      // `/features/lip-sync` → `/es/features/lip-sync`.
      url.pathname = pathname === "/" ? `/${mapped}` : `/${mapped}${pathname}`;
      const redirect = NextResponse.redirect(url, 308);
      redirect.cookies.set(LOCALE_COOKIE, mapped, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
      return redirect;
    }
    // Stamp EN as the preference so the next navigation skips the
    // whole country-lookup branch.
    supabaseResponse.cookies.set(LOCALE_COOKIE, "en", {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
