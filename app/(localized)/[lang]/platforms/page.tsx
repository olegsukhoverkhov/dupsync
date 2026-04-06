import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  Mic,
} from "lucide-react";
import {
  YouTubeIcon,
  TikTokIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/platforms/icons";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram y Más",
    description:
      "Dobla videos para YouTube, TikTok, Instagram, Facebook, e-learning y podcasts. Clonación de voz y lip sync con IA para cada plataforma.",
    h1: "Doblaje con IA para cada plataforma",
    subtitle:
      "Contenido optimizado para cada plataforma. Clonación de voz, lip sync y traducción automática adaptados a las especificaciones de cada canal.",
    cta: "Empezar gratis",
    breadcrumbPlatforms: "Plataformas",
  },
  pt: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram e Mais",
    description:
      "Duble vídeos para YouTube, TikTok, Instagram, Facebook, e-learning e podcasts. Clonagem de voz e lip sync com IA para cada plataforma.",
    h1: "Dublagem com IA para cada plataforma",
    subtitle:
      "Conteúdo otimizado para cada plataforma. Clonagem de voz, lip sync e tradução automática adaptados às especificações de cada canal.",
    cta: "Começar grátis",
    breadcrumbPlatforms: "Plataformas",
  },
  de: {
    title: "DubSync für Jede Plattform — YouTube, TikTok, Instagram & Mehr",
    description:
      "Synchronisiere Videos für YouTube, TikTok, Instagram, Facebook, E-Learning und Podcasts. KI-Stimmklonen und Lip Sync für jede Plattform.",
    h1: "KI-Synchronisation für jede Plattform",
    subtitle:
      "Inhalte für jede Plattform optimiert. Stimmklonen, Lip Sync und automatische Übersetzung, angepasst an die Spezifikationen jedes Kanals.",
    cta: "Kostenlos starten",
    breadcrumbPlatforms: "Plattformen",
  },
  fr: {
    title: "DubSync pour Chaque Plateforme — YouTube, TikTok, Instagram et Plus",
    description:
      "Doublez vos vidéos pour YouTube, TikTok, Instagram, Facebook, e-learning et podcasts. Clonage vocal IA et lip sync pour chaque plateforme.",
    h1: "Doublage IA pour chaque plateforme",
    subtitle:
      "Contenu optimisé pour chaque plateforme. Clonage vocal, lip sync et traduction automatique adaptés aux spécifications de chaque canal.",
    cta: "Commencer gratuitement",
    breadcrumbPlatforms: "Plateformes",
  },
  ja: {
    title: "DubSync — YouTube、TikTok、Instagramなど全プラットフォーム対応",
    description:
      "YouTube、TikTok、Instagram、Facebook、eラーニング、ポッドキャスト向けに動画を吹き替え。AI音声クローンとリップシンク。",
    h1: "すべてのプラットフォーム向けAI吹き替え",
    subtitle:
      "各プラットフォームに最適化されたコンテンツ。音声クローン、リップシンク、自動翻訳を各チャンネルの仕様に合わせて提供。",
    cta: "無料で始める",
    breadcrumbPlatforms: "プラットフォーム",
  },
};

type Lang = keyof typeof TRANSLATIONS;

const PLATFORMS = [
  { slug: "youtube", icon: YouTubeIcon, color: "from-red-500/20 to-red-600/20", textColor: "text-red-400" },
  { slug: "tiktok", icon: TikTokIcon, color: "from-cyan-500/20 to-pink-500/20", textColor: "text-cyan-400" },
  { slug: "instagram", icon: InstagramIcon, color: "from-purple-500/20 to-pink-500/20", textColor: "text-purple-400" },
  { slug: "facebook", icon: FacebookIcon, color: "from-blue-500/20 to-blue-600/20", textColor: "text-blue-400" },
  { slug: "elearning", icon: GraduationCap, color: "from-green-500/20 to-emerald-600/20", textColor: "text-green-400" },
  { slug: "podcasts", icon: Mic, color: "from-orange-500/20 to-amber-500/20", textColor: "text-orange-400" },
];

const PLATFORM_NAMES: Record<Lang, Record<string, { name: string; desc: string }>> = {
  es: {
    youtube: { name: "YouTube", desc: "Dobla videos de YouTube en 30+ idiomas con clonación de voz." },
    tiktok: { name: "TikTok", desc: "Viralízate globalmente con doblaje de TikTok con IA." },
    instagram: { name: "Instagram", desc: "Dobla Reels y Stories para audiencias globales." },
    facebook: { name: "Facebook", desc: "Localiza anuncios de video y contenido de Facebook." },
    elearning: { name: "E-Learning", desc: "Traduce cursos online para estudiantes de todo el mundo." },
    podcasts: { name: "Podcasts", desc: "Dobla tu podcast a cualquier idioma con IA." },
  },
  pt: {
    youtube: { name: "YouTube", desc: "Duble vídeos do YouTube em 30+ idiomas com clonagem de voz." },
    tiktok: { name: "TikTok", desc: "Viralize globalmente com dublagem de TikTok com IA." },
    instagram: { name: "Instagram", desc: "Duble Reels e Stories para audiências globais." },
    facebook: { name: "Facebook", desc: "Localize anúncios em vídeo e conteúdo do Facebook." },
    elearning: { name: "E-Learning", desc: "Traduza cursos online para alunos de todo o mundo." },
    podcasts: { name: "Podcasts", desc: "Duble seu podcast em qualquer idioma com IA." },
  },
  de: {
    youtube: { name: "YouTube", desc: "YouTube-Videos in 30+ Sprachen mit Stimmklonen synchronisieren." },
    tiktok: { name: "TikTok", desc: "Weltweit viral mit KI-TikTok-Synchronisation." },
    instagram: { name: "Instagram", desc: "Reels und Stories für globale Zielgruppen synchronisieren." },
    facebook: { name: "Facebook", desc: "Facebook-Videoanzeigen und Inhalte lokalisieren." },
    elearning: { name: "E-Learning", desc: "Online-Kurse für Lernende weltweit übersetzen." },
    podcasts: { name: "Podcasts", desc: "Podcast in jede Sprache mit KI synchronisieren." },
  },
  fr: {
    youtube: { name: "YouTube", desc: "Doublez vos vidéos YouTube en 30+ langues avec clonage vocal." },
    tiktok: { name: "TikTok", desc: "Devenez viral partout avec le doublage TikTok IA." },
    instagram: { name: "Instagram", desc: "Doublez Reels et Stories pour un public mondial." },
    facebook: { name: "Facebook", desc: "Localisez vos publicités vidéo et contenu Facebook." },
    elearning: { name: "E-Learning", desc: "Traduisez vos cours en ligne pour le monde entier." },
    podcasts: { name: "Podcasts", desc: "Doublez votre podcast dans n'importe quelle langue." },
  },
  ja: {
    youtube: { name: "YouTube", desc: "YouTube動画を30以上の言語に音声クローンで吹き替え。" },
    tiktok: { name: "TikTok", desc: "AITikTok吹き替えで世界中でバイラルに。" },
    instagram: { name: "Instagram", desc: "ReelsとStoriesをグローバルな視聴者向けに吹き替え。" },
    facebook: { name: "Facebook", desc: "Facebook動画広告とコンテンツをローカライズ。" },
    elearning: { name: "eラーニング", desc: "オンラインコースを世界中の学習者向けに翻訳。" },
    podcasts: { name: "ポッドキャスト", desc: "ポッドキャストをAIであらゆる言語に吹き替え。" },
  },
};

export function generateStaticParams() {
  return LOCALES.filter((l) => l !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") return {};
  const t = TRANSLATIONS[lang as Lang];
  if (!t) return {};

  const langAlternates: Record<string, string> = {};
  for (const l of LOCALES) {
    langAlternates[l] =
      l === "en"
        ? "https://dubsync.app/platforms"
        : `https://dubsync.app/${l}/platforms`;
  }
  langAlternates["x-default"] = "https://dubsync.app/platforms";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/platforms`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/platforms`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedPlatformsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();
  const t = TRANSLATIONS[lang as Lang];
  if (!t) notFound();
  const platformInfo = PLATFORM_NAMES[lang as Lang];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t.breadcrumbPlatforms, url: `https://dubsync.app/${lang}/platforms` },
        ]}
      />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t.h1}
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium"
            >
              {t.cta}
            </Link>
          </div>
        </section>

        {/* Platform grid */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const info = platformInfo[platform.slug];
              return (
                <Link
                  key={platform.slug}
                  href={`/${lang}/platforms/${platform.slug}`}
                  className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 hover:border-pink-500/30 transition-colors"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${platform.color}`}>
                    <Icon className={`h-6 w-6 ${platform.textColor}`} />
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    {info.name}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {info.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-pink-400 group-hover:gap-2 transition-all">
                    {t.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

    </>
  );
}
