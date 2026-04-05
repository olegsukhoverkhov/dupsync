import { LOCALES } from "@/lib/i18n/dictionaries";

export function getBlogHreflang(slug: string) {
  const languages: Record<string, string> = {};
  for (const lang of LOCALES) {
    languages[lang] =
      lang === "en"
        ? `https://dubsync.app/blog/${slug}`
        : `https://dubsync.app/${lang}/blog/${slug}`;
  }
  languages["x-default"] = `https://dubsync.app/blog/${slug}`;
  return languages;
}
