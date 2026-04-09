import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { LOCALES } from "@/lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/profile/locale
 *
 * Updates `profiles.locale` for the authenticated user AND refreshes the
 * `dubsync_locale` cookie so server components (dashboard layout, proxy
 * geo check) pick up the new preference on the next navigation.
 *
 * Request body:  { locale: "en" | "es" | "fr" | "de" | "pt" | "ja" }
 * Response:      { ok: true } | { error }
 *
 * Client should call `router.refresh()` after a successful PATCH so the
 * server layout re-runs and re-loads the translated dictionary.
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { locale?: unknown };
  try {
    body = (await request.json()) as { locale?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const locale = body.locale;
  if (
    typeof locale !== "string" ||
    !(LOCALES as readonly string[]).includes(locale)
  ) {
    return NextResponse.json(
      { error: `locale must be one of: ${LOCALES.join(", ")}` },
      { status: 400 }
    );
  }

  // Service client sidesteps any RLS policy on profiles.
  const service = await createServiceClient();
  const { error } = await service
    .from("profiles")
    .update({ locale })
    .eq("id", user.id);

  if (error) {
    console.warn(
      `[PROFILE_LOCALE] Failed to update for ${user.id}:`,
      error
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also refresh the cookie so the next request (including the immediate
  // `router.refresh()` the client calls) sees the new value without a
  // round-trip to the profiles table.
  const res = NextResponse.json({ ok: true });
  res.cookies.set("dubsync_locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return res;
}
