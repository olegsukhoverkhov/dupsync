import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { LOCALES } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/track-login
 *
 * Marks `profiles.last_login_at = now()` for the currently authenticated
 * user and, if the user has no `locale` stamped yet, stamps it from the
 * `dubsync_locale` cookie set by the geo proxy. Called from:
 *
 *   1. `/callback` after OAuth `exchangeCodeForSession` succeeds (server-side)
 *   2. The email/password login form after `signInWithPassword` succeeds
 *      (client-side fetch)
 *
 * No request body needed — the user id is read from the Supabase session
 * cookie. The write itself uses the service-role client so it doesn't
 * depend on whatever RLS policy is applied to `profiles`.
 *
 * Returns `{ ok: true }` on success, `{ error }` otherwise. Clients
 * should treat a failure as non-fatal — a missed last_login_at row is
 * cosmetic, not blocking.
 */
export async function POST() {
  // Who is logging in? Read from the session cookie set by Supabase.
  const clientWithUserSession = await createClient();
  const {
    data: { user },
  } = await clientWithUserSession.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Pull the visitor's current locale choice from the cookie the proxy
  // set earlier via geo detection (or that the localized layout set on
  // direct navigation). Validated against the supported list so we
  // never stamp a bogus value onto the profile.
  const cookieStore = await cookies();
  const cookieLocaleRaw = cookieStore.get("dubsync_locale")?.value ?? null;
  const cookieLocale =
    cookieLocaleRaw && (LOCALES as readonly string[]).includes(cookieLocaleRaw)
      ? cookieLocaleRaw
      : null;

  // Write via service client so we sidestep RLS concerns on profiles.
  const service = await createServiceClient();

  // Check whether the user already has a locale — we want to stamp
  // `locale` ONCE at first login, not overwrite a choice the user has
  // already made via the language switcher.
  const { data: existing } = await service
    .from("profiles")
    .select("locale")
    .eq("id", user.id)
    .single();

  const updates: Record<string, string> = {
    last_login_at: new Date().toISOString(),
  };
  if (!existing?.locale && cookieLocale) {
    updates.locale = cookieLocale;
  }

  const { error } = await service
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.warn(
      `[TRACK_LOGIN] Failed to update profile for ${user.id}:`,
      error
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
