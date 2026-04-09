export const LOCALES = [
  "en",
  "es",
  "pt",
  "de",
  "fr",
  "ja",
  // 2026-04 expansion: Hindi, Arabic (RTL), Indonesian, Turkish, Korean.
  // Arabic is the only RTL locale; the localized layout flips
  // `dir="rtl"` when `lang === "ar"`.
  "hi",
  "ar",
  "id",
  "tr",
  "ko",
] as const;
export type Locale = (typeof LOCALES)[number];

/** Locales that render right-to-left. Used by the layout to set
 *  `dir="rtl"` and by CSS utility helpers. */
export const RTL_LOCALES: readonly Locale[] = ["ar"];
export function isRtlLocale(lang: string): boolean {
  return RTL_LOCALES.includes(lang as Locale);
}

export const LOCALE_INFO: Record<Locale, { name: string; flag: string; nativeName: string }> = {
  en: { name: "English", flag: "🇺🇸", nativeName: "English" },
  es: { name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  pt: { name: "Portuguese", flag: "🇧🇷", nativeName: "Português" },
  de: { name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  fr: { name: "French", flag: "🇫🇷", nativeName: "Français" },
  ja: { name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  hi: { name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
  ar: { name: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
  id: { name: "Indonesian", flag: "🇮🇩", nativeName: "Bahasa Indonesia" },
  tr: { name: "Turkish", flag: "🇹🇷", nativeName: "Türkçe" },
  ko: { name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
};

export type Dictionary = typeof import("./en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en.json").then((m) => m.default),
  es: () => import("./es.json").then((m) => m.default),
  pt: () => import("./pt.json").then((m) => m.default),
  de: () => import("./de.json").then((m) => m.default),
  fr: () => import("./fr.json").then((m) => m.default),
  ja: () => import("./ja.json").then((m) => m.default),
  hi: () => import("./hi.json").then((m) => m.default),
  ar: () => import("./ar.json").then((m) => m.default),
  id: () => import("./id.json").then((m) => m.default),
  tr: () => import("./tr.json").then((m) => m.default),
  ko: () => import("./ko.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function isValidLocale(lang: string): lang is Locale {
  return LOCALES.includes(lang as Locale);
}
