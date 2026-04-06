import type { Locale } from "../dictionaries";

export interface ArticleTranslation {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  content: string; // HTML content
}

export const TRANSLATED_SLUGS: Record<string, string> = {
  "best-ai-dubbing-tools": "best-ai-dubbing-tools",
  "what-is-ai-video-dubbing": "what-is-ai-video-dubbing",
  "how-to-dub-youtube-video": "how-to-dub-youtube-video",
  "ai-dubbing-vs-traditional": "ai-dubbing-vs-traditional",
  "ai-dubbing-for-youtube": "ai-dubbing-for-youtube",
  "voice-cloning-video-translation": "voice-cloning-video-translation",
  "how-to-clone-voice-for-video": "how-to-clone-voice-for-video",
  "ai-dubbing-pricing-comparison-2026": "ai-dubbing-pricing-comparison-2026",
  "how-to-dub-instagram-reels": "how-to-dub-instagram-reels",
  "social-media-video-localization-guide": "social-media-video-localization-guide",
};

type TranslationModule = { default: ArticleTranslation[] };

const translationLoaders: Record<string, () => Promise<TranslationModule>> = {
  es: () => import("./es.json") as unknown as Promise<TranslationModule>,
  pt: () => import("./pt.json") as unknown as Promise<TranslationModule>,
  de: () => import("./de.json") as unknown as Promise<TranslationModule>,
  fr: () => import("./fr.json") as unknown as Promise<TranslationModule>,
  ja: () => import("./ja.json") as unknown as Promise<TranslationModule>,
};

export async function getArticleTranslation(
  lang: string,
  slug: string
): Promise<ArticleTranslation | null> {
  if (lang === "en" || !translationLoaders[lang]) return null;
  const mod = await translationLoaders[lang]();
  const articles = mod.default;
  return articles.find((a) => a.slug === slug) || null;
}

export async function getArticlesList(
  lang: string
): Promise<ArticleTranslation[]> {
  if (lang === "en" || !translationLoaders[lang]) return [];
  const mod = await translationLoaders[lang]();
  return mod.default;
}
