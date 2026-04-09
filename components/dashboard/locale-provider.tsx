"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

/**
 * Dashboard locale context — the single source of truth for every client
 * component in `(dashboard)/*`. Wired up in `(dashboard)/layout.tsx`:
 * the server layout resolves the user's locale + loads the dictionary,
 * then passes them as plain props to this provider.
 *
 * Every dashboard page/component reads strings via `useDashboardT(key)`.
 * Missing keys fall back to the provided default (so partially-translated
 * locales still render something sane instead of raw key paths).
 */

type DashboardLocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
};

const DashboardLocaleContext = createContext<DashboardLocaleContextValue | null>(
  null
);

export function DashboardLocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  // Stable identity so context consumers don't re-render on every parent
  // render — the locale/dict only change when the user logs out/in or
  // switches language.
  const value = useMemo<DashboardLocaleContextValue>(
    () => ({ locale, dict }),
    [locale, dict]
  );
  return (
    <DashboardLocaleContext.Provider value={value}>
      {children}
    </DashboardLocaleContext.Provider>
  );
}

export function useDashboardLocale(): DashboardLocaleContextValue {
  const ctx = useContext(DashboardLocaleContext);
  if (!ctx) {
    throw new Error(
      "useDashboardLocale must be used inside DashboardLocaleProvider"
    );
  }
  return ctx;
}

/**
 * Translation hook for client components.
 *
 * Usage:
 *   const t = useDashboardT();
 *   <h1>{t("home.projects", "Projects")}</h1>
 *
 * The second argument is the English fallback text: if a locale is
 * missing the key (for example because it wasn't translated yet), the
 * hook returns the fallback instead of a raw `home.projects` string.
 * This lets us ship partial translations incrementally without a page
 * looking broken.
 *
 * Dot-path lookup supports `{placeholder}` interpolation via the third
 * argument, e.g. `t("credits.buyButton", "Buy {n} credits — {price}",
 * { n: "50", price: "$50" })`.
 */
export function useDashboardT() {
  const { dict } = useDashboardLocale();

  return function t(
    path: string,
    fallback: string,
    vars?: Record<string, string | number>
  ): string {
    // Walk the dict via the dot path, e.g. "home.projects".
    // We intentionally use `any` because Dictionary is the typeof en.json
    // and TypeScript can't prove an arbitrary string is a valid path.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = dict;
    for (const segment of path.split(".")) {
      if (node && typeof node === "object" && segment in node) {
        node = node[segment];
      } else {
        node = undefined;
        break;
      }
    }
    const raw = typeof node === "string" ? node : fallback;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, k) =>
      k in vars ? String(vars[k]) : `{${k}}`
    );
  };
}
