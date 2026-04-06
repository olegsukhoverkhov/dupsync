import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Music2, ArrowRight, Upload, Languages, Download } from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Dobla Videos de TikTok con IA — Viralízate Globalmente | DubSync",
    description:
      "Traduce y dobla tus TikToks en más de 30 idiomas con clonación de voz con IA. Lip sync automático. Hazte viral en todo el mundo.",
    h1: "Dobla videos de TikTok — viralízate globalmente",
    subtitle:
      "Traduce tus TikToks a cualquier idioma con tu propia voz clonada. Lip sync perfecto para formato vertical.",
    ctaText: "Doblar mi TikTok",
    statBadge: "Formato vertical optimizado",
    steps: ["Sube tu TikTok", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿DubSync optimiza para formato vertical de TikTok?", a: "Sí. DubSync procesa videos en cualquier formato, incluido el vertical 9:16 de TikTok, manteniendo la calidad visual." },
      { q: "¿Cuánto tarda doblar un TikTok?", a: "Los TikToks cortos (15-60 segundos) se procesan en menos de 2 minutos." },
      { q: "¿Se mantiene la música de fondo?", a: "Sí. DubSync separa la voz de la música y efectos, reemplazando solo la voz con la versión clonada traducida." },
      { q: "¿Puedo doblar videos de TikTok de otros creadores?", a: "Solo puedes doblar contenido que posees o para el que tienes derechos explícitos de doblaje." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbTikTok: "TikTok",
    ctaTitle: "Haz viral tu contenido en todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  pt: {
    title: "Duble Vídeos do TikTok com IA — Viralize Globalmente | DubSync",
    description:
      "Traduza e duble seus TikToks em mais de 30 idiomas com clonagem de voz com IA. Lip sync automático. Viralize no mundo todo.",
    h1: "Duble vídeos do TikTok — viralize globalmente",
    subtitle:
      "Traduza seus TikToks para qualquer idioma com sua própria voz clonada. Lip sync perfeito para formato vertical.",
    ctaText: "Dublar meu TikTok",
    statBadge: "Formato vertical otimizado",
    steps: ["Envie seu TikTok", "Escolha os idiomas", "Baixe o resultado"],
    faqTitle: "Perguntas frequentes",
    faqs: [
      { q: "O DubSync otimiza para formato vertical do TikTok?", a: "Sim. O DubSync processa vídeos em qualquer formato, incluindo o vertical 9:16 do TikTok, mantendo a qualidade visual." },
      { q: "Quanto tempo leva para dublar um TikTok?", a: "TikToks curtos (15-60 segundos) são processados em menos de 2 minutos." },
      { q: "A música de fundo é mantida?", a: "Sim. O DubSync separa a voz da música e efeitos, substituindo apenas a voz pela versão clonada traduzida." },
      { q: "Posso dublar TikToks de outros criadores?", a: "Você só pode dublar conteúdo que possui ou para o qual tem direitos explícitos de dublagem." },
    ],
    alsoWorksWith: "Também funciona com",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbTikTok: "TikTok",
    ctaTitle: "Viralize seu conteúdo no mundo todo",
    ctaSubtitle: "Comece com 5 minutos grátis. Sem cartão de crédito.",
    ctaButton: "Começar grátis",
  },
  de: {
    title: "TikTok-Videos mit KI synchronisieren — Weltweit Viral | DubSync",
    description:
      "Übersetzen und synchronisieren Sie TikToks in über 30 Sprachen mit KI-Stimmklonen. Automatischer Lip Sync. Weltweit viral gehen.",
    h1: "TikTok-Videos synchronisieren — weltweit viral",
    subtitle:
      "Übersetzen Sie Ihre TikToks in jede Sprache mit Ihrer geklonten Stimme. Perfekter Lip Sync für vertikales Format.",
    ctaText: "Mein TikTok synchronisieren",
    statBadge: "Vertikales Format optimiert",
    steps: ["TikTok hochladen", "Sprachen auswählen", "Ergebnis herunterladen"],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      { q: "Optimiert DubSync für das vertikale TikTok-Format?", a: "Ja. DubSync verarbeitet Videos in jedem Format, einschließlich des vertikalen 9:16-Formats von TikTok, bei voller visueller Qualität." },
      { q: "Wie lange dauert die Synchronisation eines TikToks?", a: "Kurze TikToks (15-60 Sekunden) werden in weniger als 2 Minuten verarbeitet." },
      { q: "Bleibt die Hintergrundmusik erhalten?", a: "Ja. DubSync trennt Stimme von Musik und Effekten und ersetzt nur die Stimme durch die geklonte übersetzte Version." },
      { q: "Kann ich TikToks anderer Creator synchronisieren?", a: "Sie können nur Inhalte synchronisieren, die Sie besitzen oder für die Sie ausdrückliche Synchronisationsrechte haben." },
    ],
    alsoWorksWith: "Funktioniert auch mit",
    breadcrumbPlatforms: "Plattformen",
    breadcrumbTikTok: "TikTok",
    ctaTitle: "Machen Sie Ihren Content weltweit viral",
    ctaSubtitle: "Starten Sie mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
  },
  fr: {
    title: "Doublez vos TikToks avec l'IA — Devenez Viral Partout | DubSync",
    description:
      "Traduisez et doublez vos TikToks dans plus de 30 langues avec clonage vocal IA. Lip sync automatique. Devenez viral dans le monde entier.",
    h1: "Doublez vos TikToks — devenez viral partout",
    subtitle:
      "Traduisez vos TikToks dans n'importe quelle langue avec votre propre voix clonée. Lip sync parfait pour le format vertical.",
    ctaText: "Doubler mon TikTok",
    statBadge: "Format vertical optimisé",
    steps: ["Téléchargez votre TikTok", "Choisissez les langues", "Téléchargez le résultat"],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "DubSync optimise-t-il pour le format vertical de TikTok ?", a: "Oui. DubSync traite les vidéos dans tous les formats, y compris le format vertical 9:16 de TikTok, en conservant la qualité visuelle." },
      { q: "Combien de temps faut-il pour doubler un TikTok ?", a: "Les TikToks courts (15-60 secondes) sont traités en moins de 2 minutes." },
      { q: "La musique de fond est-elle conservée ?", a: "Oui. DubSync sépare la voix de la musique et des effets, remplaçant uniquement la voix par la version clonée traduite." },
      { q: "Puis-je doubler des TikToks d'autres créateurs ?", a: "Vous ne pouvez doubler que le contenu que vous possédez ou pour lequel vous avez des droits explicites de doublage." },
    ],
    alsoWorksWith: "Fonctionne aussi avec",
    breadcrumbPlatforms: "Plateformes",
    breadcrumbTikTok: "TikTok",
    ctaTitle: "Faites devenir votre contenu viral dans le monde entier",
    ctaSubtitle: "Commencez avec 5 minutes gratuites. Aucune carte de crédit requise.",
    ctaButton: "Commencer gratuitement",
  },
  ja: {
    title: "TikTok動画をAIで吹き替え — 世界中でバイラルに | DubSync",
    description:
      "TikTok動画を30以上の言語にAI音声クローンで翻訳・吹き替え。自動リップシンク。世界中でバイラルに。",
    h1: "TikTok動画を吹き替え — 世界中でバイラルに",
    subtitle:
      "クローンされた自分の声でTikTokをあらゆる言語に翻訳。縦型フォーマットに完璧なリップシンク。",
    ctaText: "TikTokを吹き替える",
    statBadge: "縦型フォーマット最適化",
    steps: ["TikTokをアップロード", "言語を選択", "結果をダウンロード"],
    faqTitle: "よくある質問",
    faqs: [
      { q: "DubSyncはTikTokの縦型フォーマットに最適化されていますか？", a: "はい。DubSyncはTikTokの9:16縦型を含むあらゆるフォーマットの動画を視覚品質を保ちながら処理します。" },
      { q: "TikTokの吹き替えにどのくらいかかりますか？", a: "短いTikTok（15-60秒）は2分未満で処理されます。" },
      { q: "BGMは維持されますか？", a: "はい。DubSyncは音声を音楽やエフェクトから分離し、音声のみをクローンされた翻訳版に置き換えます。" },
      { q: "他のクリエイターのTikTokを吹き替えできますか？", a: "所有または明示的な吹き替え権利を持つコンテンツのみ吹き替え可能です。" },
    ],
    alsoWorksWith: "他のプラットフォームでも利用可能",
    breadcrumbPlatforms: "プラットフォーム",
    breadcrumbTikTok: "TikTok",
    ctaTitle: "コンテンツを世界中でバイラルにしよう",
    ctaSubtitle: "5分間の無料吹き替えで始めましょう。クレジットカード不要。",
    ctaButton: "無料で始める",
  },
};

type Lang = keyof typeof TRANSLATIONS;
const STEP_ICONS = [Upload, Languages, Download];

const OTHER_PLATFORMS = [
  { slug: "youtube", name: "YouTube" },
  { slug: "instagram", name: "Instagram" },
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
        ? "https://dubsync.app/platforms/tiktok"
        : `https://dubsync.app/${l}/platforms/tiktok`;
  }
  langAlternates["x-default"] = "https://dubsync.app/platforms/tiktok";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/platforms/tiktok`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/platforms/tiktok`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedTikTokPage({
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
          { name: t.breadcrumbTikTok, url: `https://dubsync.app/${lang}/platforms/tiktok` },
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-400">
            <Music2 className="h-3.5 w-3.5" /> {t.statBadge}
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
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-sm font-medium text-white">{step}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-pink-600/10 p-10">
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
