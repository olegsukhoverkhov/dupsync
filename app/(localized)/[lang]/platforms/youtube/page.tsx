import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Upload, Languages, Download } from "lucide-react";
import { YouTubeIcon } from "@/components/platforms/icons";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Dobla Videos de YouTube con IA — Clonación de Voz en 30+ Idiomas | DubSync",
    description:
      "Traduce y dobla videos de YouTube en más de 30 idiomas con clonación de voz con IA y lip sync. Mantén tu voz original. Crece globalmente.",
    h1: "Dobla videos de YouTube en 30+ idiomas",
    subtitle:
      "Traduce automáticamente tus videos de YouTube conservando tu voz, tono y personalidad. Lip sync perfecto en cada idioma.",
    ctaText: "Doblar mi video de YouTube",
    statBadge: "30+ idiomas disponibles",
    steps: ["Sube tu video", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cuánto tarda doblar un video de YouTube?", a: "Un video de 10 minutos se procesa en aproximadamente 5-8 minutos. La duración varía según la cantidad de idiomas seleccionados." },
      { q: "¿Se mantiene la calidad del audio original?", a: "Sí. DubSync clona tu voz con alta fidelidad y sincroniza los labios automáticamente." },
      { q: "¿Puedo doblar videos con múltiples hablantes?", a: "Sí. DubSync detecta y separa automáticamente cada hablante, clonando cada voz de forma independiente." },
      { q: "¿Necesito descargar algún software?", a: "No. DubSync funciona completamente en la nube. Solo sube tu video y recibe el resultado doblado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Lleva tu canal de YouTube al mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  pt: {
    title: "Duble Vídeos do YouTube com IA — Clonagem de Voz em 30+ Idiomas | DubSync",
    description:
      "Traduza e duble vídeos do YouTube em mais de 30 idiomas com clonagem de voz com IA e lip sync. Mantenha sua voz original. Cresça globalmente.",
    h1: "Duble vídeos do YouTube em 30+ idiomas",
    subtitle:
      "Traduza automaticamente seus vídeos do YouTube preservando sua voz, tom e personalidade. Lip sync perfeito em cada idioma.",
    ctaText: "Dublar meu vídeo do YouTube",
    statBadge: "30+ idiomas disponíveis",
    steps: ["Envie seu vídeo", "Escolha os idiomas", "Baixe o resultado"],
    faqTitle: "Perguntas frequentes",
    faqs: [
      { q: "Quanto tempo leva para dublar um vídeo do YouTube?", a: "Um vídeo de 10 minutos é processado em aproximadamente 5-8 minutos. O tempo varia conforme a quantidade de idiomas selecionados." },
      { q: "A qualidade do áudio original é mantida?", a: "Sim. O DubSync clona sua voz com alta fidelidade e sincroniza os lábios automaticamente." },
      { q: "Posso dublar vídeos com múltiplos falantes?", a: "Sim. O DubSync detecta e separa automaticamente cada falante, clonando cada voz de forma independente." },
      { q: "Preciso baixar algum software?", a: "Não. O DubSync funciona completamente na nuvem. Basta enviar seu vídeo e receber o resultado dublado." },
    ],
    alsoWorksWith: "Também funciona com",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Leve seu canal do YouTube para o mundo",
    ctaSubtitle: "Comece com 5 minutos grátis. Sem cartão de crédito.",
    ctaButton: "Começar grátis",
  },
  de: {
    title: "YouTube-Videos mit KI synchronisieren — Stimmklonen in 30+ Sprachen | DubSync",
    description:
      "Übersetzen und synchronisieren Sie YouTube-Videos in über 30 Sprachen mit KI-Stimmklonen und Lip Sync. Behalten Sie Ihre Originalstimme.",
    h1: "YouTube-Videos in 30+ Sprachen synchronisieren",
    subtitle:
      "Übersetzen Sie Ihre YouTube-Videos automatisch und bewahren Sie dabei Ihre Stimme, Ihren Ton und Ihre Persönlichkeit. Perfekter Lip Sync in jeder Sprache.",
    ctaText: "Mein YouTube-Video synchronisieren",
    statBadge: "30+ Sprachen verfügbar",
    steps: ["Video hochladen", "Sprachen auswählen", "Ergebnis herunterladen"],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      { q: "Wie lange dauert die Synchronisation eines YouTube-Videos?", a: "Ein 10-minütiges Video wird in etwa 5-8 Minuten verarbeitet. Die Dauer variiert je nach Anzahl der ausgewählten Sprachen." },
      { q: "Bleibt die Qualität des Originalaudios erhalten?", a: "Ja. DubSync klont Ihre Stimme mit hoher Treue und synchronisiert die Lippen automatisch." },
      { q: "Kann ich Videos mit mehreren Sprechern synchronisieren?", a: "Ja. DubSync erkennt und trennt automatisch jeden Sprecher und klont jede Stimme unabhängig." },
      { q: "Muss ich Software herunterladen?", a: "Nein. DubSync funktioniert vollständig in der Cloud. Laden Sie Ihr Video hoch und erhalten Sie das synchronisierte Ergebnis." },
    ],
    alsoWorksWith: "Funktioniert auch mit",
    breadcrumbPlatforms: "Plattformen",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Bringen Sie Ihren YouTube-Kanal in die Welt",
    ctaSubtitle: "Starten Sie mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
  },
  fr: {
    title: "Doublez vos Vidéos YouTube avec l'IA — Clonage Vocal en 30+ Langues | DubSync",
    description:
      "Traduisez et doublez vos vidéos YouTube dans plus de 30 langues avec clonage vocal IA et lip sync. Gardez votre voix originale.",
    h1: "Doublez vos vidéos YouTube en 30+ langues",
    subtitle:
      "Traduisez automatiquement vos vidéos YouTube en préservant votre voix, votre ton et votre personnalité. Lip sync parfait dans chaque langue.",
    ctaText: "Doubler ma vidéo YouTube",
    statBadge: "30+ langues disponibles",
    steps: ["Téléchargez votre vidéo", "Choisissez les langues", "Téléchargez le résultat"],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Combien de temps faut-il pour doubler une vidéo YouTube ?", a: "Une vidéo de 10 minutes est traitée en environ 5-8 minutes. La durée varie selon le nombre de langues sélectionnées." },
      { q: "La qualité audio originale est-elle conservée ?", a: "Oui. DubSync clone votre voix avec haute fidélité et synchronise les lèvres automatiquement." },
      { q: "Puis-je doubler des vidéos avec plusieurs intervenants ?", a: "Oui. DubSync détecte et sépare automatiquement chaque intervenant, clonant chaque voix indépendamment." },
      { q: "Dois-je télécharger un logiciel ?", a: "Non. DubSync fonctionne entièrement dans le cloud. Téléchargez votre vidéo et recevez le résultat doublé." },
    ],
    alsoWorksWith: "Fonctionne aussi avec",
    breadcrumbPlatforms: "Plateformes",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Portez votre chaîne YouTube dans le monde entier",
    ctaSubtitle: "Commencez avec 5 minutes gratuites. Aucune carte de crédit requise.",
    ctaButton: "Commencer gratuitement",
  },
  ja: {
    title: "YouTubeの動画をAIで吹き替え — 30以上の言語で音声クローン | DubSync",
    description:
      "YouTube動画を30以上の言語にAI音声クローンとリップシンクで翻訳・吹き替え。オリジナルの声を維持。グローバルに成長。",
    h1: "YouTube動画を30以上の言語に吹き替え",
    subtitle:
      "YouTube動画を自動翻訳し、声、トーン、個性を保持。各言語で完璧なリップシンク。",
    ctaText: "YouTube動画を吹き替える",
    statBadge: "30以上の言語に対応",
    steps: ["動画をアップロード", "言語を選択", "結果をダウンロード"],
    faqTitle: "よくある質問",
    faqs: [
      { q: "YouTube動画の吹き替えにどのくらいかかりますか？", a: "10分の動画は約5-8分で処理されます。選択した言語数により所要時間は異なります。" },
      { q: "元の音声品質は維持されますか？", a: "はい。DubSyncは高忠実度で声をクローンし、自動的にリップシンクします。" },
      { q: "複数の話者がいる動画を吹き替えできますか？", a: "はい。DubSyncは各話者を自動的に検出・分離し、それぞれの声を独立してクローンします。" },
      { q: "ソフトウェアのダウンロードは必要ですか？", a: "いいえ。DubSyncは完全にクラウドで動作します。動画をアップロードして吹き替え結果を受け取るだけです。" },
    ],
    alsoWorksWith: "他のプラットフォームでも利用可能",
    breadcrumbPlatforms: "プラットフォーム",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "YouTubeチャンネルを世界に届けよう",
    ctaSubtitle: "5分間の無料吹き替えで始めましょう。クレジットカード不要。",
    ctaButton: "無料で始める",
  },

  hi: {
    title: "YouTube के लिए AI डबिंग — 30+ भाषाओं में | DubSync",
    description:
      "AI वॉइस क्लोनिंग और लिप सिंक के साथ YouTube वीडियो को 30+ भाषाओं में अनुवाद और डब करें।",
    h1: "YouTube वीडियो 30+ भाषाओं में डब करें",
    subtitle:
      "Traduce automáticamente tus videos de YouTube conservando tu voz, tono y personalidad. Lip sync perfecto en cada idioma.",
    ctaText: "Doblar mi video de YouTube",
    statBadge: "30+ idiomas disponibles",
    steps: ["Sube tu video", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cuánto tarda doblar un video de YouTube?", a: "Un video de 10 minutos se procesa en aproximadamente 5-8 minutos. La duración varía según la cantidad de idiomas seleccionados." },
      { q: "¿Se mantiene la calidad del audio original?", a: "Sí. DubSync clona tu voz con alta fidelidad y sincroniza los labios automáticamente." },
      { q: "¿Puedo doblar videos con múltiples hablantes?", a: "Sí. DubSync detecta y separa automáticamente cada hablante, clonando cada voz de forma independiente." },
      { q: "¿Necesito descargar algún software?", a: "No. DubSync funciona completamente en la nube. Solo sube tu video y recibe el resultado doblado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "प्लेटफ़ॉर्म",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Lleva tu canal de YouTube al mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  ar: {
    title: "دبلجة AI لليوتيوب — 30+ لغة | DubSync",
    description:
      "ترجم ودبلج فيديوهات يوتيوب إلى أكثر من 30 لغة باستخدام استنساخ الصوت ومزامنة الشفاه.",
    h1: "دبلج فيديوهات يوتيوب بـ 30+ لغة",
    subtitle:
      "Traduce automáticamente tus videos de YouTube conservando tu voz, tono y personalidad. Lip sync perfecto en cada idioma.",
    ctaText: "Doblar mi video de YouTube",
    statBadge: "30+ idiomas disponibles",
    steps: ["Sube tu video", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cuánto tarda doblar un video de YouTube?", a: "Un video de 10 minutos se procesa en aproximadamente 5-8 minutos. La duración varía según la cantidad de idiomas seleccionados." },
      { q: "¿Se mantiene la calidad del audio original?", a: "Sí. DubSync clona tu voz con alta fidelidad y sincroniza los labios automáticamente." },
      { q: "¿Puedo doblar videos con múltiples hablantes?", a: "Sí. DubSync detecta y separa automáticamente cada hablante, clonando cada voz de forma independiente." },
      { q: "¿Necesito descargar algún software?", a: "No. DubSync funciona completamente en la nube. Solo sube tu video y recibe el resultado doblado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "المنصات",
    breadcrumbYouTube: "يوتيوب",
    ctaTitle: "Lleva tu canal de YouTube al mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  id: {
    title: "Dubbing AI untuk YouTube — 30+ Bahasa | DubSync",
    description:
      "Terjemahkan dan dubbing video YouTube ke 30+ bahasa dengan kloning suara AI dan lip sync.",
    h1: "Dubbing video YouTube ke 30+ bahasa",
    subtitle:
      "Traduce automáticamente tus videos de YouTube conservando tu voz, tono y personalidad. Lip sync perfecto en cada idioma.",
    ctaText: "Doblar mi video de YouTube",
    statBadge: "30+ idiomas disponibles",
    steps: ["Sube tu video", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cuánto tarda doblar un video de YouTube?", a: "Un video de 10 minutos se procesa en aproximadamente 5-8 minutos. La duración varía según la cantidad de idiomas seleccionados." },
      { q: "¿Se mantiene la calidad del audio original?", a: "Sí. DubSync clona tu voz con alta fidelidad y sincroniza los labios automáticamente." },
      { q: "¿Puedo doblar videos con múltiples hablantes?", a: "Sí. DubSync detecta y separa automáticamente cada hablante, clonando cada voz de forma independiente." },
      { q: "¿Necesito descargar algún software?", a: "No. DubSync funciona completamente en la nube. Solo sube tu video y recibe el resultado doblado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Platform",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Lleva tu canal de YouTube al mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  tr: {
    title: "YouTube için AI Dublaj — 30+ Dil | DubSync",
    description:
      "YouTube videolarını AI ses klonlama ve dudak senkronuyla 30+ dile çevirin ve dublajlayın.",
    h1: "YouTube videolarını 30+ dile dublajlayın",
    subtitle:
      "Traduce automáticamente tus videos de YouTube conservando tu voz, tono y personalidad. Lip sync perfecto en cada idioma.",
    ctaText: "Doblar mi video de YouTube",
    statBadge: "30+ idiomas disponibles",
    steps: ["Sube tu video", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cuánto tarda doblar un video de YouTube?", a: "Un video de 10 minutos se procesa en aproximadamente 5-8 minutos. La duración varía según la cantidad de idiomas seleccionados." },
      { q: "¿Se mantiene la calidad del audio original?", a: "Sí. DubSync clona tu voz con alta fidelidad y sincroniza los labios automáticamente." },
      { q: "¿Puedo doblar videos con múltiples hablantes?", a: "Sí. DubSync detecta y separa automáticamente cada hablante, clonando cada voz de forma independiente." },
      { q: "¿Necesito descargar algún software?", a: "No. DubSync funciona completamente en la nube. Solo sube tu video y recibe el resultado doblado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Platformlar",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Lleva tu canal de YouTube al mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  ko: {
    title: "YouTube AI 더빙 — 30개 이상 언어 | DubSync",
    description:
      "AI 음성 클론과 립싱크로 YouTube 비디오를 30개 이상 언어로 번역하고 더빙하세요.",
    h1: "YouTube 비디오를 30개 이상 언어로 더빙",
    subtitle:
      "Traduce automáticamente tus videos de YouTube conservando tu voz, tono y personalidad. Lip sync perfecto en cada idioma.",
    ctaText: "Doblar mi video de YouTube",
    statBadge: "30+ idiomas disponibles",
    steps: ["Sube tu video", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cuánto tarda doblar un video de YouTube?", a: "Un video de 10 minutos se procesa en aproximadamente 5-8 minutos. La duración varía según la cantidad de idiomas seleccionados." },
      { q: "¿Se mantiene la calidad del audio original?", a: "Sí. DubSync clona tu voz con alta fidelidad y sincroniza los labios automáticamente." },
      { q: "¿Puedo doblar videos con múltiples hablantes?", a: "Sí. DubSync detecta y separa automáticamente cada hablante, clonando cada voz de forma independiente." },
      { q: "¿Necesito descargar algún software?", a: "No. DubSync funciona completamente en la nube. Solo sube tu video y recibe el resultado doblado." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "플랫폼",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "Lleva tu canal de YouTube al mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  zh: {
    title: "YouTube AI配音 — 30多种语言 | DubSync",
    description:
      "用AI语音克隆和口型同步将YouTube视频翻译并配音为30多种语言。",
    h1: "将YouTube视频配音为30多种语言",
    subtitle:
      "自动翻译YouTube视频，保留您的声音、语调和个性。每种语言都有完美的口型同步。",
    ctaText: "配音我的YouTube视频",
    statBadge: "30多种语言可用",
    steps: ["上传视频", "选择语言", "下载结果"],
    faqTitle: "常见问题",
    faqs: [
      { q: "配音一个YouTube视频需要多长时间？", a: "10分钟的视频大约需要5-8分钟处理。时长取决于所选语言数量。" },
      { q: "原始音频质量能保持吗？", a: "是的。DubSync以高保真度克隆您的声音并自动同步口型。" },
      { q: "可以配音多说话人的视频吗？", a: "可以。DubSync自动检测并分离每个说话人，独立克隆每个声音。" },
      { q: "需要下载软件吗？", a: "不需要。DubSync完全在云端运行。只需上传视频即可接收配音结果。" },
    ],
    alsoWorksWith: "同样适用于",
    breadcrumbPlatforms: "平台",
    breadcrumbYouTube: "YouTube",
    ctaTitle: "将您的YouTube频道推向世界",
    ctaSubtitle: "5分钟免费开始。无需信用卡。",
    ctaButton: "免费开始",
  },};

type Lang = keyof typeof TRANSLATIONS;
const STEP_ICONS = [Upload, Languages, Download];

const OTHER_PLATFORMS = [
  { slug: "tiktok", name: "TikTok" },
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
        ? "https://dubsync.app/platforms/youtube"
        : `https://dubsync.app/${l}/platforms/youtube`;
  }
  langAlternates["x-default"] = "https://dubsync.app/platforms/youtube";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/platforms/youtube`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/platforms/youtube`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedYouTubePage({
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
          { name: t.breadcrumbYouTube, url: `https://dubsync.app/${lang}/platforms/youtube` },
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
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-400">
            <YouTubeIcon className="h-3.5 w-3.5" /> {t.statBadge}
          </div>
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
              {t.ctaText}
            </Link>
          </div>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={i} className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20">
                    <Icon className="h-6 w-6 text-red-400" />
                  </div>
                  <span className="text-xs font-mono text-red-400 uppercase tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-sm font-medium text-white">{step}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 to-pink-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.ctaTitle}</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">{t.ctaSubtitle}</p>
            <Link href="/signup" className="gradient-button inline-block rounded-lg px-8 py-3 text-sm font-medium">
              {t.ctaButton}
            </Link>
          </div>
        </section>

        {/* FAQ */}
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

        {/* Other platforms */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">{t.alsoWorksWith}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {OTHER_PLATFORMS.map((p) => (
              <Link
                key={p.slug}
                href={`/${lang}/platforms/${p.slug}`}
                className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </section>
      </main>

    </>
  );
}
