import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mic, ArrowRight, Upload, Languages, Download } from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Dobla tu Podcast a Cualquier Idioma con IA — Clonación de Voz | DubSync",
    description:
      "Traduce y dobla episodios de podcast en más de 30 idiomas con clonación de voz con IA. Mantén tu voz auténtica en cada idioma.",
    h1: "Dobla tu podcast a cualquier idioma",
    subtitle:
      "Traduce tus episodios de podcast a cualquier idioma con tu voz clonada. Expande tu audiencia sin perder autenticidad.",
    ctaText: "Doblar mi podcast",
    statBadge: "Audio optimizado",
    steps: ["Sube tu episodio", "Elige los idiomas", "Descarga el audio"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿DubSync funciona solo con audio?", a: "Sí. DubSync procesa tanto video como audio puro, lo que lo hace perfecto para podcasts." },
      { q: "¿Se mantiene la calidad del audio?", a: "Sí. La salida es audio de alta calidad listo para distribución en plataformas de podcast." },
      { q: "¿Funciona con podcasts de múltiples participantes?", a: "Sí. DubSync detecta y separa cada hablante, clonando cada voz de forma independiente." },
      { q: "¿Qué formatos de audio soporta?", a: "DubSync soporta MP3, WAV, M4A, FLAC y OGG. La salida está disponible en MP3 y WAV." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbPodcasts: "Podcasts",
    ctaTitle: "Lleva tu podcast a oyentes de todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  pt: {
    title: "Duble seu Podcast em Qualquer Idioma com IA — Clonagem de Voz | DubSync",
    description:
      "Traduza e duble episódios de podcast em mais de 30 idiomas com clonagem de voz com IA. Mantenha sua voz autêntica em cada idioma.",
    h1: "Duble seu podcast em qualquer idioma",
    subtitle:
      "Traduza seus episódios de podcast para qualquer idioma com sua voz clonada. Expanda sua audiência sem perder autenticidade.",
    ctaText: "Dublar meu podcast",
    statBadge: "Áudio otimizado",
    steps: ["Envie seu episódio", "Escolha os idiomas", "Baixe o áudio"],
    faqTitle: "Perguntas frequentes",
    faqs: [
      { q: "O DubSync funciona apenas com áudio?", a: "Sim. O DubSync processa tanto vídeo quanto áudio puro, sendo perfeito para podcasts." },
      { q: "A qualidade do áudio é mantida?", a: "Sim. A saída é áudio de alta qualidade pronto para distribuição em plataformas de podcast." },
      { q: "Funciona com podcasts de múltiplos participantes?", a: "Sim. O DubSync detecta e separa cada falante, clonando cada voz de forma independente." },
      { q: "Quais formatos de áudio são suportados?", a: "O DubSync suporta MP3, WAV, M4A, FLAC e OGG. A saída está disponível em MP3 e WAV." },
    ],
    alsoWorksWith: "Também funciona com",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbPodcasts: "Podcasts",
    ctaTitle: "Leve seu podcast para ouvintes de todo o mundo",
    ctaSubtitle: "Comece com 5 minutos grátis. Sem cartão de crédito.",
    ctaButton: "Começar grátis",
  },
  de: {
    title: "Podcast in Jede Sprache mit KI Synchronisieren — Stimmklonen | DubSync",
    description:
      "Übersetzen und synchronisieren Sie Podcast-Episoden in über 30 Sprachen mit KI-Stimmklonen. Bewahren Sie Ihre authentische Stimme.",
    h1: "Podcast in jede Sprache synchronisieren",
    subtitle:
      "Übersetzen Sie Ihre Podcast-Episoden in jede Sprache mit Ihrer geklonten Stimme. Erweitern Sie Ihr Publikum ohne Authentizitätsverlust.",
    ctaText: "Meinen Podcast synchronisieren",
    statBadge: "Audio optimiert",
    steps: ["Episode hochladen", "Sprachen auswählen", "Audio herunterladen"],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      { q: "Funktioniert DubSync nur mit Audio?", a: "Ja. DubSync verarbeitet sowohl Video als auch reines Audio, was es perfekt für Podcasts macht." },
      { q: "Bleibt die Audioqualität erhalten?", a: "Ja. Die Ausgabe ist hochwertiges Audio, das für die Verteilung auf Podcast-Plattformen bereit ist." },
      { q: "Funktioniert es mit Podcasts mit mehreren Teilnehmern?", a: "Ja. DubSync erkennt und trennt jeden Sprecher und klont jede Stimme unabhängig." },
      { q: "Welche Audioformate werden unterstützt?", a: "DubSync unterstützt MP3, WAV, M4A, FLAC und OGG. Die Ausgabe ist in MP3 und WAV verfügbar." },
    ],
    alsoWorksWith: "Funktioniert auch mit",
    breadcrumbPlatforms: "Plattformen",
    breadcrumbPodcasts: "Podcasts",
    ctaTitle: "Bringen Sie Ihren Podcast zu Hörern weltweit",
    ctaSubtitle: "Starten Sie mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
  },
  fr: {
    title: "Doublez votre Podcast dans N'importe Quelle Langue avec l'IA | DubSync",
    description:
      "Traduisez et doublez vos épisodes de podcast dans plus de 30 langues avec clonage vocal IA. Gardez votre voix authentique.",
    h1: "Doublez votre podcast dans n'importe quelle langue",
    subtitle:
      "Traduisez vos épisodes de podcast dans n'importe quelle langue avec votre voix clonée. Élargissez votre audience sans perdre en authenticité.",
    ctaText: "Doubler mon podcast",
    statBadge: "Audio optimisé",
    steps: ["Téléchargez votre épisode", "Choisissez les langues", "Téléchargez l'audio"],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "DubSync fonctionne-t-il uniquement avec l'audio ?", a: "Oui. DubSync traite aussi bien la vidéo que l'audio pur, ce qui le rend parfait pour les podcasts." },
      { q: "La qualité audio est-elle conservée ?", a: "Oui. La sortie est un audio haute qualité prêt pour la distribution sur les plateformes de podcast." },
      { q: "Fonctionne-t-il avec des podcasts à plusieurs participants ?", a: "Oui. DubSync détecte et sépare chaque intervenant, clonant chaque voix indépendamment." },
      { q: "Quels formats audio sont pris en charge ?", a: "DubSync prend en charge MP3, WAV, M4A, FLAC et OGG. La sortie est disponible en MP3 et WAV." },
    ],
    alsoWorksWith: "Fonctionne aussi avec",
    breadcrumbPlatforms: "Plateformes",
    breadcrumbPodcasts: "Podcasts",
    ctaTitle: "Portez votre podcast aux auditeurs du monde entier",
    ctaSubtitle: "Commencez avec 5 minutes gratuites. Aucune carte de crédit requise.",
    ctaButton: "Commencer gratuitement",
  },
  ja: {
    title: "ポッドキャストをAIであらゆる言語に吹き替え — 音声クローン | DubSync",
    description:
      "ポッドキャストのエピソードを30以上の言語にAI音声クローンで翻訳・吹き替え。本物の声を維持。",
    h1: "ポッドキャストをあらゆる言語に吹き替え",
    subtitle:
      "クローンされた自分の声でポッドキャストエピソードをあらゆる言語に翻訳。真正性を失わずにリスナーを拡大。",
    ctaText: "ポッドキャストを吹き替える",
    statBadge: "オーディオ最適化",
    steps: ["エピソードをアップロード", "言語を選択", "オーディオをダウンロード"],
    faqTitle: "よくある質問",
    faqs: [
      { q: "DubSyncはオーディオのみでも動作しますか？", a: "はい。DubSyncは動画と純粋なオーディオの両方を処理でき、ポッドキャストに最適です。" },
      { q: "音声品質は維持されますか？", a: "はい。出力はポッドキャストプラットフォームでの配信に対応した高品質オーディオです。" },
      { q: "複数の参加者がいるポッドキャストに対応していますか？", a: "はい。DubSyncは各話者を検出・分離し、それぞれの声を独立してクローンします。" },
      { q: "対応しているオーディオフォーマットは？", a: "DubSyncはMP3、WAV、M4A、FLAC、OGGに対応しています。出力はMP3とWAVで利用可能です。" },
    ],
    alsoWorksWith: "他のプラットフォームでも利用可能",
    breadcrumbPlatforms: "プラットフォーム",
    breadcrumbPodcasts: "ポッドキャスト",
    ctaTitle: "ポッドキャストを世界中のリスナーに届けよう",
    ctaSubtitle: "5分間の無料吹き替えで始めましょう。クレジットカード不要。",
    ctaButton: "無料で始める",
  },
};

type Lang = keyof typeof TRANSLATIONS;
const STEP_ICONS = [Upload, Languages, Download];

const OTHER_PLATFORMS = [
  { slug: "youtube", name: "YouTube" },
  { slug: "tiktok", name: "TikTok" },
  { slug: "instagram", name: "Instagram" },
  { slug: "facebook", name: "Facebook" },
  { slug: "elearning", name: "E-Learning" },
];

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
        ? "https://dubsync.app/platforms/podcasts"
        : `https://dubsync.app/${l}/platforms/podcasts`;
  }
  langAlternates["x-default"] = "https://dubsync.app/platforms/podcasts";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/platforms/podcasts`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/platforms/podcasts`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedPodcastsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();
  const t = TRANSLATIONS[lang as Lang];
  if (!t) notFound();

  return (
    <>
      <Header />
      <BreadcrumbSchema
        items={[
          { name: t.breadcrumbPlatforms, url: `https://dubsync.app/${lang}/platforms` },
          { name: t.breadcrumbPodcasts, url: `https://dubsync.app/${lang}/platforms/podcasts` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      <main className="pt-24 pb-16">
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-400">
            <Mic className="h-3.5 w-3.5" /> {t.statBadge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{t.h1}</h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">{t.subtitle}</p>
          <div className="mt-8">
            <Link href="/signup" className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium">{t.ctaText}</Link>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={i} className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                    <Icon className="h-6 w-6 text-orange-400" />
                  </div>
                  <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-sm font-medium text-white">{step}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.ctaTitle}</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">{t.ctaSubtitle}</p>
            <Link href="/signup" className="gradient-button inline-block rounded-lg px-8 py-3 text-sm font-medium">{t.ctaButton}</Link>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">{t.faqTitle}</h2>
          <div className="space-y-4">
            {t.faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl border border-white/10 bg-slate-800/30">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-white">
                  {faq.q}
                  <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-4 text-sm text-zinc-400 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">{t.alsoWorksWith}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {OTHER_PLATFORMS.map((p) => (
              <Link key={p.slug} href={`/${lang}/platforms/${p.slug}`} className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors">{p.name}</Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
