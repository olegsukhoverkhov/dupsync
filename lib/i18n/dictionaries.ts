export const LOCALES = ["en", "es", "pt", "de", "fr", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_INFO: Record<Locale, { name: string; flag: string; nativeName: string }> = {
  en: { name: "English", flag: "🇺🇸", nativeName: "English" },
  es: { name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  pt: { name: "Portuguese", flag: "🇧🇷", nativeName: "Português" },
  de: { name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  fr: { name: "French", flag: "🇫🇷", nativeName: "Français" },
  ja: { name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
};

export type Dictionary = typeof import("./en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en.json").then((m) => m.default),
  es: () => import("./es.json").then((m) => m.default),
  pt: () => import("./pt.json").then((m) => m.default),
  de: () => import("./de.json").then((m) => m.default),
  fr: () => import("./fr.json").then((m) => m.default),
  ja: () => import("./ja.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function isValidLocale(lang: string): lang is Locale {
  return LOCALES.includes(lang as Locale);
}
