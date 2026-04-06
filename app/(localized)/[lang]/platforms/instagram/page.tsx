import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Upload, Languages, Download } from "lucide-react";
import { InstagramIcon } from "@/components/platforms/icons";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Dobla Reels y Stories de Instagram con IA — Clonación de Voz | DubSync",
    description:
      "Traduce y dobla tus Instagram Reels y Stories en más de 30 idiomas con clonación de voz con IA y lip sync automático.",
    h1: "Dobla Reels y Stories de Instagram",
    subtitle:
      "Traduce tus Reels y Stories de Instagram a cualquier idioma con tu voz clonada. Lip sync y formatos optimizados para Instagram.",
    ctaText: "Doblar mi Reel",
    statBadge: "Reels y Stories optimizados",
    steps: ["Sube tu Reel o Story", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿DubSync soporta formato vertical de Instagram?", a: "Sí. DubSync procesa formatos 9:16 (Reels/Stories) y 1:1 (feed) manteniendo la calidad visual." },
      { q: "¿Puedo doblar Reels con música de fondo?", a: "Sí. DubSync separa la voz de la música y efectos sonoros, reemplazando solo la narración." },
      { q: "¿Cuánto tarda doblar un Reel de Instagram?", a: "Los Reels de 30-90 segundos se procesan en aproximadamente 1-2 minutos." },
      { q: "¿Se mantienen los subtítulos originales?", a: "DubSync genera nuevos subtítulos traducidos que puedes descargar por separado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbInstagram: "Instagram",
    ctaTitle: "Conquista Instagram en todos los idiomas",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  pt: {
    title: "Duble Reels e Stories do Instagram com IA — Clonagem de Voz | DubSync",
    description:
      "Traduza e duble seus Instagram Reels e Stories em mais de 30 idiomas com clonagem de voz com IA e lip sync automático.",
    h1: "Duble Reels e Stories do Instagram",
    subtitle:
      "Traduza seus Reels e Stories do Instagram para qualquer idioma com sua voz clonada. Lip sync e formatos otimizados para Instagram.",
    ctaText: "Dublar meu Reel",
    statBadge: "Reels e Stories otimizados",
    steps: ["Envie seu Reel ou Story", "Escolha os idiomas", "Baixe o resultado"],
    faqTitle: "Perguntas frequentes",
    faqs: [
      { q: "O DubSync suporta formato vertical do Instagram?", a: "Sim. O DubSync processa formatos 9:16 (Reels/Stories) e 1:1 (feed) mantendo a qualidade visual." },
      { q: "Posso dublar Reels com música de fundo?", a: "Sim. O DubSync separa a voz da música e efeitos sonoros, substituindo apenas a narração." },
      { q: "Quanto tempo leva para dublar um Reel do Instagram?", a: "Reels de 30-90 segundos são processados em aproximadamente 1-2 minutos." },
      { q: "As legendas originais são mantidas?", a: "O DubSync gera novas legendas traduzidas que você pode baixar separadamente." },
    ],
    alsoWorksWith: "Também funciona com",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbInstagram: "Instagram",
    ctaTitle: "Conquiste o Instagram em todos os idiomas",
    ctaSubtitle: "Comece com 5 minutos grátis. Sem cartão de crédito.",
    ctaButton: "Começar grátis",
  },
  de: {
    title: "Instagram Reels und Stories mit KI synchronisieren — Stimmklonen | DubSync",
    description:
      "Übersetzen und synchronisieren Sie Instagram Reels und Stories in über 30 Sprachen mit KI-Stimmklonen und automatischem Lip Sync.",
    h1: "Instagram Reels und Stories synchronisieren",
    subtitle:
      "Übersetzen Sie Ihre Instagram Reels und Stories in jede Sprache mit Ihrer geklonten Stimme. Lip Sync und optimierte Formate für Instagram.",
    ctaText: "Mein Reel synchronisieren",
    statBadge: "Reels und Stories optimiert",
    steps: ["Reel oder Story hochladen", "Sprachen auswählen", "Ergebnis herunterladen"],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      { q: "Unterstützt DubSync das vertikale Instagram-Format?", a: "Ja. DubSync verarbeitet 9:16-Formate (Reels/Stories) und 1:1-Formate (Feed) bei voller visueller Qualität." },
      { q: "Kann ich Reels mit Hintergrundmusik synchronisieren?", a: "Ja. DubSync trennt Stimme von Musik und Soundeffekten und ersetzt nur die Narration." },
      { q: "Wie lange dauert die Synchronisation eines Instagram Reels?", a: "Reels von 30-90 Sekunden werden in etwa 1-2 Minuten verarbeitet." },
      { q: "Bleiben die Original-Untertitel erhalten?", a: "DubSync generiert neue übersetzte Untertitel, die Sie separat herunterladen können." },
    ],
    alsoWorksWith: "Funktioniert auch mit",
    breadcrumbPlatforms: "Plattformen",
    breadcrumbInstagram: "Instagram",
    ctaTitle: "Erobern Sie Instagram in allen Sprachen",
    ctaSubtitle: "Starten Sie mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
  },
  fr: {
    title: "Doublez vos Reels et Stories Instagram avec l'IA — Clonage Vocal | DubSync",
    description:
      "Traduisez et doublez vos Instagram Reels et Stories dans plus de 30 langues avec clonage vocal IA et lip sync automatique.",
    h1: "Doublez vos Reels et Stories Instagram",
    subtitle:
      "Traduisez vos Reels et Stories Instagram dans n'importe quelle langue avec votre voix clonée. Lip sync et formats optimisés pour Instagram.",
    ctaText: "Doubler mon Reel",
    statBadge: "Reels et Stories optimisés",
    steps: ["Téléchargez votre Reel ou Story", "Choisissez les langues", "Téléchargez le résultat"],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "DubSync prend-il en charge le format vertical d'Instagram ?", a: "Oui. DubSync traite les formats 9:16 (Reels/Stories) et 1:1 (feed) en conservant la qualité visuelle." },
      { q: "Puis-je doubler des Reels avec de la musique de fond ?", a: "Oui. DubSync sépare la voix de la musique et des effets sonores, ne remplaçant que la narration." },
      { q: "Combien de temps faut-il pour doubler un Reel Instagram ?", a: "Les Reels de 30-90 secondes sont traités en environ 1-2 minutes." },
      { q: "Les sous-titres originaux sont-ils conservés ?", a: "DubSync génère de nouveaux sous-titres traduits que vous pouvez télécharger séparément." },
    ],
    alsoWorksWith: "Fonctionne aussi avec",
    breadcrumbPlatforms: "Plateformes",
    breadcrumbInstagram: "Instagram",
    ctaTitle: "Conquérez Instagram dans toutes les langues",
    ctaSubtitle: "Commencez avec 5 minutes gratuites. Aucune carte de crédit requise.",
    ctaButton: "Commencer gratuitement",
  },
  ja: {
    title: "Instagram ReelsとStoriesをAIで吹き替え — 音声クローン | DubSync",
    description:
      "Instagram ReelsとStoriesを30以上の言語にAI音声クローンと自動リップシンクで翻訳・吹き替え。",
    h1: "Instagram ReelsとStoriesを吹き替え",
    subtitle:
      "クローンされた自分の声でInstagram ReelsとStoriesをあらゆる言語に翻訳。Instagram向けに最適化されたリップシンクとフォーマット。",
    ctaText: "Reelを吹き替える",
    statBadge: "ReelsとStories最適化",
    steps: ["ReelまたはStoryをアップロード", "言語を選択", "結果をダウンロード"],
    faqTitle: "よくある質問",
    faqs: [
      { q: "DubSyncはInstagramの縦型フォーマットに対応していますか？", a: "はい。DubSyncは9:16（Reels/Stories）と1:1（フィード）フォーマットを視覚品質を保ちながら処理します。" },
      { q: "BGM付きのReelsを吹き替えできますか？", a: "はい。DubSyncは音声を音楽やサウンドエフェクトから分離し、ナレーションのみを置き換えます。" },
      { q: "Instagram Reelの吹き替えにどのくらいかかりますか？", a: "30-90秒のReelsは約1-2分で処理されます。" },
      { q: "元の字幕は維持されますか？", a: "DubSyncは新しい翻訳字幕を生成し、別途ダウンロードできます。" },
    ],
    alsoWorksWith: "他のプラットフォームでも利用可能",
    breadcrumbPlatforms: "プラットフォーム",
    breadcrumbInstagram: "Instagram",
    ctaTitle: "Instagramをすべての言語で制覇しよう",
    ctaSubtitle: "5分間の無料吹き替えで始めましょう。クレジットカード不要。",
    ctaButton: "無料で始める",
  },
};

type Lang = keyof typeof TRANSLATIONS;
const STEP_ICONS = [Upload, Languages, Download];

const OTHER_PLATFORMS = [
  { slug: "youtube", name: "YouTube" },
  { slug: "tiktok", name: "TikTok" },
  { slug: "facebook", name: "Facebook" },
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
        ? "https://dubsync.app/platforms/instagram"
        : `https://dubsync.app/${l}/platforms/instagram`;
  }
  langAlternates["x-default"] = "https://dubsync.app/platforms/instagram";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/platforms/instagram`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/platforms/instagram`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedInstagramPage({
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
      <BreadcrumbSchema
        items={[
          { name: t.breadcrumbPlatforms, url: `https://dubsync.app/${lang}/platforms` },
          { name: t.breadcrumbInstagram, url: `https://dubsync.app/${lang}/platforms/instagram` },
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-400">
            <InstagramIcon className="h-3.5 w-3.5" /> {t.statBadge}
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
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-sm font-medium text-white">{step}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-10">
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

    </>
  );
}
