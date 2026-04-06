import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Upload, Languages, Download } from "lucide-react";
import { FacebookIcon } from "@/components/platforms/icons";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Dobla Anuncios de Video y Contenido de Facebook con IA | DubSync",
    description:
      "Traduce y dobla anuncios de video y contenido de Facebook en más de 30 idiomas con clonación de voz con IA y lip sync automático.",
    h1: "Dobla anuncios de video y contenido de Facebook",
    subtitle:
      "Localiza tus anuncios de video y contenido de Facebook para audiencias globales. Clonación de voz y lip sync con IA.",
    ctaText: "Doblar mi video de Facebook",
    statBadge: "Anuncios y contenido optimizados",
    steps: ["Sube tu video", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿DubSync funciona con anuncios de Facebook?", a: "Sí. DubSync procesa videos de cualquier duración, incluidos anuncios cortos de 15-30 segundos optimizados para Facebook Ads." },
      { q: "¿Puedo doblar Facebook Lives grabados?", a: "Sí. Puedes subir grabaciones de Facebook Live y doblarlas a múltiples idiomas." },
      { q: "¿Mejora el rendimiento de mis anuncios?", a: "Los anuncios localizados en el idioma nativo de la audiencia suelen tener mejor CTR y menor costo por conversión." },
      { q: "¿Qué formatos de video soporta?", a: "DubSync soporta MP4, MOV, AVI y WebM en formatos horizontal, vertical y cuadrado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbFacebook: "Facebook",
    ctaTitle: "Localiza tu presencia en Facebook globalmente",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  pt: {
    title: "Duble Anúncios em Vídeo e Conteúdo do Facebook com IA | DubSync",
    description:
      "Traduza e duble anúncios em vídeo e conteúdo do Facebook em mais de 30 idiomas com clonagem de voz com IA e lip sync automático.",
    h1: "Duble anúncios em vídeo e conteúdo do Facebook",
    subtitle:
      "Localize seus anúncios em vídeo e conteúdo do Facebook para audiências globais. Clonagem de voz e lip sync com IA.",
    ctaText: "Dublar meu vídeo do Facebook",
    statBadge: "Anúncios e conteúdo otimizados",
    steps: ["Envie seu vídeo", "Escolha os idiomas", "Baixe o resultado"],
    faqTitle: "Perguntas frequentes",
    faqs: [
      { q: "O DubSync funciona com anúncios do Facebook?", a: "Sim. O DubSync processa vídeos de qualquer duração, incluindo anúncios curtos de 15-30 segundos otimizados para Facebook Ads." },
      { q: "Posso dublar Facebook Lives gravados?", a: "Sim. Você pode enviar gravações de Facebook Live e dublá-las em múltiplos idiomas." },
      { q: "Melhora o desempenho dos meus anúncios?", a: "Anúncios localizados no idioma nativo da audiência geralmente têm melhor CTR e menor custo por conversão." },
      { q: "Quais formatos de vídeo são suportados?", a: "O DubSync suporta MP4, MOV, AVI e WebM em formatos horizontal, vertical e quadrado." },
    ],
    alsoWorksWith: "Também funciona com",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbFacebook: "Facebook",
    ctaTitle: "Localize sua presença no Facebook globalmente",
    ctaSubtitle: "Comece com 5 minutos grátis. Sem cartão de crédito.",
    ctaButton: "Começar grátis",
  },
  de: {
    title: "Facebook-Videoanzeigen und Inhalte mit KI synchronisieren | DubSync",
    description:
      "Übersetzen und synchronisieren Sie Facebook-Videoanzeigen und Inhalte in über 30 Sprachen mit KI-Stimmklonen und automatischem Lip Sync.",
    h1: "Facebook-Videoanzeigen und Inhalte synchronisieren",
    subtitle:
      "Lokalisieren Sie Ihre Facebook-Videoanzeigen und Inhalte für globale Zielgruppen. KI-Stimmklonen und Lip Sync.",
    ctaText: "Mein Facebook-Video synchronisieren",
    statBadge: "Anzeigen und Inhalte optimiert",
    steps: ["Video hochladen", "Sprachen auswählen", "Ergebnis herunterladen"],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      { q: "Funktioniert DubSync mit Facebook-Anzeigen?", a: "Ja. DubSync verarbeitet Videos jeder Länge, einschließlich kurzer 15-30-Sekunden-Anzeigen, die für Facebook Ads optimiert sind." },
      { q: "Kann ich aufgezeichnete Facebook Lives synchronisieren?", a: "Ja. Sie können Facebook-Live-Aufnahmen hochladen und in mehrere Sprachen synchronisieren." },
      { q: "Verbessert es die Leistung meiner Anzeigen?", a: "Lokalisierte Anzeigen in der Muttersprache der Zielgruppe erzielen in der Regel bessere CTR und niedrigere Kosten pro Konversion." },
      { q: "Welche Videoformate werden unterstützt?", a: "DubSync unterstützt MP4, MOV, AVI und WebM in horizontalem, vertikalem und quadratischem Format." },
    ],
    alsoWorksWith: "Funktioniert auch mit",
    breadcrumbPlatforms: "Plattformen",
    breadcrumbFacebook: "Facebook",
    ctaTitle: "Lokalisieren Sie Ihre Facebook-Präsenz weltweit",
    ctaSubtitle: "Starten Sie mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
  },
  fr: {
    title: "Doublez vos Publicités Vidéo et Contenu Facebook avec l'IA | DubSync",
    description:
      "Traduisez et doublez vos publicités vidéo et contenu Facebook dans plus de 30 langues avec clonage vocal IA et lip sync automatique.",
    h1: "Doublez vos publicités vidéo Facebook",
    subtitle:
      "Localisez vos publicités vidéo et contenu Facebook pour des audiences mondiales. Clonage vocal et lip sync IA.",
    ctaText: "Doubler ma vidéo Facebook",
    statBadge: "Publicités et contenu optimisés",
    steps: ["Téléchargez votre vidéo", "Choisissez les langues", "Téléchargez le résultat"],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "DubSync fonctionne-t-il avec les publicités Facebook ?", a: "Oui. DubSync traite les vidéos de toute durée, y compris les publicités courtes de 15-30 secondes optimisées pour Facebook Ads." },
      { q: "Puis-je doubler des Facebook Lives enregistrés ?", a: "Oui. Vous pouvez télécharger des enregistrements de Facebook Live et les doubler dans plusieurs langues." },
      { q: "Cela améliore-t-il les performances de mes publicités ?", a: "Les publicités localisées dans la langue maternelle de l'audience obtiennent généralement un meilleur CTR et un coût par conversion inférieur." },
      { q: "Quels formats vidéo sont pris en charge ?", a: "DubSync prend en charge MP4, MOV, AVI et WebM en formats horizontal, vertical et carré." },
    ],
    alsoWorksWith: "Fonctionne aussi avec",
    breadcrumbPlatforms: "Plateformes",
    breadcrumbFacebook: "Facebook",
    ctaTitle: "Localisez votre présence Facebook dans le monde entier",
    ctaSubtitle: "Commencez avec 5 minutes gratuites. Aucune carte de crédit requise.",
    ctaButton: "Commencer gratuitement",
  },
  ja: {
    title: "Facebook動画広告とコンテンツをAIで吹き替え | DubSync",
    description:
      "Facebook動画広告とコンテンツを30以上の言語にAI音声クローンと自動リップシンクで翻訳・吹き替え。",
    h1: "Facebook動画広告とコンテンツを吹き替え",
    subtitle:
      "Facebook動画広告とコンテンツをグローバルな視聴者向けにローカライズ。AI音声クローンとリップシンク。",
    ctaText: "Facebook動画を吹き替える",
    statBadge: "広告とコンテンツ最適化",
    steps: ["動画をアップロード", "言語を選択", "結果をダウンロード"],
    faqTitle: "よくある質問",
    faqs: [
      { q: "DubSyncはFacebook広告に対応していますか？", a: "はい。DubSyncはFacebook Ads向けに最適化された15-30秒の短い広告を含む、あらゆる長さの動画を処理します。" },
      { q: "録画したFacebook Liveを吹き替えできますか？", a: "はい。Facebook Liveの録画をアップロードして複数の言語に吹き替えできます。" },
      { q: "広告のパフォーマンスは向上しますか？", a: "視聴者の母国語にローカライズされた広告は、通常より高いCTRと低いコンバージョンコストを実現します。" },
      { q: "対応している動画フォーマットは？", a: "DubSyncはMP4、MOV、AVI、WebMを横型、縦型、正方形フォーマットで対応しています。" },
    ],
    alsoWorksWith: "他のプラットフォームでも利用可能",
    breadcrumbPlatforms: "プラットフォーム",
    breadcrumbFacebook: "Facebook",
    ctaTitle: "Facebookのプレゼンスをグローバルにローカライズ",
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
  { slug: "elearning", name: "E-Learning" },
  { slug: "podcasts", name: "Podcasts" },
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
        ? "https://dubsync.app/platforms/facebook"
        : `https://dubsync.app/${l}/platforms/facebook`;
  }
  langAlternates["x-default"] = "https://dubsync.app/platforms/facebook";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/platforms/facebook`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/platforms/facebook`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedFacebookPage({
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
          { name: t.breadcrumbFacebook, url: `https://dubsync.app/${lang}/platforms/facebook` },
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
            <FacebookIcon className="h-3.5 w-3.5" /> {t.statBadge}
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
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-sm font-medium text-white">{step}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-10">
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
