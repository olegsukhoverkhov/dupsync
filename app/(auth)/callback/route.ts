import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { LOCALES } from "@/lib/i18n/dictionaries";
import { createDemoProject } from "@/lib/demo-project";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Stamp last_login_at and (on first login) stamp profiles.locale.
      // This is the only reliable hook for OAuth — the client never
      // sees the exchange. Failure here is non-fatal (cosmetic columns)
      // so we never block the redirect on it.
      //
      // Locale resolution order (first valid wins):
      //   1. `user.user_metadata.locale` — set at signUp() from the
      //      visitor's `dubsync_locale` cookie. This is the most robust
      //      source because it's carried through email confirmation
      //      even if the confirm link is opened in a different browser.
      //   2. `dubsync_locale` cookie — set by the geo proxy on first
      //      marketing visit. Works for OAuth flows where user_metadata
      //      doesn't carry locale (we don't control Google's consent).
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const validLocale = (l: unknown): string | null => {
            if (typeof l !== "string") return null;
            return (LOCALES as readonly string[]).includes(l) ? l : null;
          };

          const metadataLocale =
            validLocale((user.user_metadata as { locale?: unknown })?.locale);

          let resolvedLocale: string | null = metadataLocale;
          if (!resolvedLocale) {
            const cookieStore = await cookies();
            resolvedLocale = validLocale(
              cookieStore.get("dubsync_locale")?.value
            );
          }

          // Resolve country from Cloudflare/Vercel headers
          const reqHeaders = await headers();
          const country = reqHeaders.get("cf-ipcountry")
            || reqHeaders.get("x-vercel-ip-country")
            || null;

          const service = await createServiceClient();
          const { data: existing } = await service
            .from("profiles")
            .select("locale, country")
            .eq("id", user.id)
            .single();

          const updates: Record<string, string> = {
            last_login_at: new Date().toISOString(),
          };
          if (!existing?.locale && resolvedLocale) {
            updates.locale = resolvedLocale;
          }
          if (!existing?.country && country) {
            updates.country = country;
          }
          await service.from("profiles").update(updates).eq("id", user.id);

          // Create demo project on first login (non-blocking)
          if (!existing?.locale) {
            createDemoProject(user.id).catch((e) =>
              console.warn("[CALLBACK] Demo project creation failed:", e)
            );
          }
        }
      } catch (e) {
        console.warn("[CALLBACK] Failed to stamp login metadata:", e);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
