import { LOCALES } from "@/lib/i18n/dictionaries";

export function getPlatformHreflang(path: string) {
  const languages: Record<string, string> = {};
  for (const lang of LOCALES) {
    languages[lang] =
      lang === "en"
        ? `https://dubsync.app${path}`
        : `https://dubsync.app/${lang}${path}`;
  }
  languages["x-default"] = `https://dubsync.app${path}`;
  return languages;
}
