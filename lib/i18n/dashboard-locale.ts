import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  LOCALES,
  type Locale,
  getDictionary,
  type Dictionary,
} from "./dictionaries";

/**
 * Resolve which locale the dashboard UI should render for the current
 * request, in priority order:
 *
 *   1. `profiles.locale`  — the authoritative choice stored in the DB.
 *      Set at signup/first-login from the geo cookie and can be
 *      overridden by the user from Settings. Once this is set we
 *      always respect it.
 *
 *   2. `dubsync_locale` cookie — the transient choice set by `proxy.ts`
 *      before the user is even authenticated. Used when the profile
 *      row doesn't yet have a locale stamp (legacy users).
 *
 *   3. Hardcoded fallback `"en"`.
 *
 * Returns both the resolved locale and the loaded dictionary so the
 * caller can pass a single object to the client provider without
 * fetching the dictionary twice.
 */
export async function resolveDashboardLocale(): Promise<{
  locale: Locale;
  dict: Dictionary;
}> {
  // 1. Try the profile column
  let locale: Locale = "en";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("locale")
        .eq("id", user.id)
        .single();
      const profileLocale = profile?.locale as string | null | undefined;
      if (
        profileLocale &&
        (LOCALES as readonly string[]).includes(profileLocale)
      ) {
        locale = profileLocale as Locale;
      }
    }
  } catch {
    // Profile lookup failed — fall through to cookie/default
  }

  // 2. Cookie fallback (only if profile didn't give us a value)
  if (locale === "en") {
    try {
      const cookieStore = await cookies();
      const cookieLocale = cookieStore.get("dubsync_locale")?.value;
      if (
        cookieLocale &&
        (LOCALES as readonly string[]).includes(cookieLocale)
      ) {
        locale = cookieLocale as Locale;
      }
    } catch {
      // cookies() failure is fine — default stays "en"
    }
  }

  const dict = await getDictionary(locale);
  return { locale, dict };
}
