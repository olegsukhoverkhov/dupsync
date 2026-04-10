import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap, ArrowRight, Upload, Languages, Download } from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Dobla Cursos Online y E-Learning con IA — Clonación de Voz | DubSync",
    description:
      "Traduce y dobla cursos online y contenido de e-learning en más de 30 idiomas con clonación de voz con IA. Mantén la voz del instructor.",
    h1: "Dobla cursos online para estudiantes globales",
    subtitle:
      "Traduce tus cursos y materiales de e-learning a cualquier idioma. Mantén la voz del instructor consistente en todas las versiones.",
    ctaText: "Doblar mi curso",
    statBadge: "E-learning optimizado",
    steps: ["Sube tu curso", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Funciona con plataformas como Udemy o Coursera?", a: "Sí. Puedes subir cualquier video de curso, independientemente de la plataforma. Luego sube la versión doblada a tu plataforma preferida." },
      { q: "¿Se mantiene la voz del instructor?", a: "Sí. DubSync clona la voz del instructor para que suene natural en cada idioma traducido." },
      { q: "¿Puedo doblar un curso completo?", a: "Sí. Puedes subir múltiples lecciones y procesarlas por lotes." },
      { q: "¿Se generan subtítulos traducidos?", a: "Sí. DubSync genera subtítulos SRT/VTT traducidos que puedes descargar junto al video." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Lleva tus cursos a estudiantes de todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  pt: {
    title: "Duble Cursos Online e E-Learning com IA — Clonagem de Voz | DubSync",
    description:
      "Traduza e duble cursos online e conteúdo de e-learning em mais de 30 idiomas com clonagem de voz com IA. Mantenha a voz do instrutor.",
    h1: "Duble cursos online para alunos globais",
    subtitle:
      "Traduza seus cursos e materiais de e-learning para qualquer idioma. Mantenha a voz do instrutor consistente em todas as versões.",
    ctaText: "Dublar meu curso",
    statBadge: "E-learning otimizado",
    steps: ["Envie seu curso", "Escolha os idiomas", "Baixe o resultado"],
    faqTitle: "Perguntas frequentes",
    faqs: [
      { q: "Funciona com plataformas como Udemy ou Coursera?", a: "Sim. Você pode enviar qualquer vídeo de curso, independente da plataforma. Depois, envie a versão dublada para sua plataforma preferida." },
      { q: "A voz do instrutor é mantida?", a: "Sim. O DubSync clona a voz do instrutor para que soe natural em cada idioma traduzido." },
      { q: "Posso dublar um curso completo?", a: "Sim. Você pode enviar múltiplas aulas e processá-las em lote." },
      { q: "Legendas traduzidas são geradas?", a: "Sim. O DubSync gera legendas SRT/VTT traduzidas que podem ser baixadas junto ao vídeo." },
    ],
    alsoWorksWith: "Também funciona com",
    breadcrumbPlatforms: "Plataformas",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Leve seus cursos para alunos de todo o mundo",
    ctaSubtitle: "Comece com 5 minutos grátis. Sem cartão de crédito.",
    ctaButton: "Começar grátis",
  },
  de: {
    title: "Online-Kurse und E-Learning mit KI synchronisieren — Stimmklonen | DubSync",
    description:
      "Übersetzen und synchronisieren Sie Online-Kurse und E-Learning-Inhalte in über 30 Sprachen mit KI-Stimmklonen. Bewahren Sie die Stimme des Dozenten.",
    h1: "Online-Kurse für globale Lernende synchronisieren",
    subtitle:
      "Übersetzen Sie Ihre Kurse und E-Learning-Materialien in jede Sprache. Bewahren Sie die konsistente Stimme des Dozenten in allen Versionen.",
    ctaText: "Meinen Kurs synchronisieren",
    statBadge: "E-Learning optimiert",
    steps: ["Kurs hochladen", "Sprachen auswählen", "Ergebnis herunterladen"],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      { q: "Funktioniert es mit Plattformen wie Udemy oder Coursera?", a: "Ja. Sie können jedes Kursvideo hochladen, unabhängig von der Plattform. Laden Sie die synchronisierte Version dann auf Ihre bevorzugte Plattform hoch." },
      { q: "Bleibt die Stimme des Dozenten erhalten?", a: "Ja. DubSync klont die Stimme des Dozenten, damit sie in jeder übersetzten Sprache natürlich klingt." },
      { q: "Kann ich einen kompletten Kurs synchronisieren?", a: "Ja. Sie können mehrere Lektionen hochladen und im Batch verarbeiten." },
      { q: "Werden übersetzte Untertitel generiert?", a: "Ja. DubSync generiert übersetzte SRT/VTT-Untertitel, die Sie zusammen mit dem Video herunterladen können." },
    ],
    alsoWorksWith: "Funktioniert auch mit",
    breadcrumbPlatforms: "Plattformen",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Bringen Sie Ihre Kurse zu Lernenden weltweit",
    ctaSubtitle: "Starten Sie mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
  },
  fr: {
    title: "Doublez vos Cours en Ligne et E-Learning avec l'IA — Clonage Vocal | DubSync",
    description:
      "Traduisez et doublez vos cours en ligne et contenu e-learning dans plus de 30 langues avec clonage vocal IA. Gardez la voix du formateur.",
    h1: "Doublez vos cours en ligne pour le monde entier",
    subtitle:
      "Traduisez vos cours et supports e-learning dans n'importe quelle langue. Conservez la voix du formateur dans toutes les versions.",
    ctaText: "Doubler mon cours",
    statBadge: "E-learning optimisé",
    steps: ["Téléchargez votre cours", "Choisissez les langues", "Téléchargez le résultat"],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Fonctionne-t-il avec des plateformes comme Udemy ou Coursera ?", a: "Oui. Vous pouvez télécharger n'importe quelle vidéo de cours, quelle que soit la plateforme. Chargez ensuite la version doublée sur votre plateforme préférée." },
      { q: "La voix du formateur est-elle conservée ?", a: "Oui. DubSync clone la voix du formateur pour qu'elle sonne naturellement dans chaque langue traduite." },
      { q: "Puis-je doubler un cours complet ?", a: "Oui. Vous pouvez télécharger plusieurs leçons et les traiter par lots." },
      { q: "Des sous-titres traduits sont-ils générés ?", a: "Oui. DubSync génère des sous-titres SRT/VTT traduits que vous pouvez télécharger avec la vidéo." },
    ],
    alsoWorksWith: "Fonctionne aussi avec",
    breadcrumbPlatforms: "Plateformes",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Portez vos cours aux apprenants du monde entier",
    ctaSubtitle: "Commencez avec 5 minutes gratuites. Aucune carte de crédit requise.",
    ctaButton: "Commencer gratuitement",
  },
  ja: {
    title: "オンラインコースとeラーニングをAIで吹き替え — 音声クローン | DubSync",
    description:
      "オンラインコースとeラーニングコンテンツを30以上の言語にAI音声クローンで翻訳・吹き替え。講師の声を維持。",
    h1: "オンラインコースをグローバルな学習者向けに吹き替え",
    subtitle:
      "コースやeラーニング教材をあらゆる言語に翻訳。全バージョンで講師の声の一貫性を維持。",
    ctaText: "コースを吹き替える",
    statBadge: "eラーニング最適化",
    steps: ["コースをアップロード", "言語を選択", "結果をダウンロード"],
    faqTitle: "よくある質問",
    faqs: [
      { q: "UdemyやCourseraなどのプラットフォームに対応していますか？", a: "はい。プラットフォームに関係なく、あらゆるコース動画をアップロードできます。吹き替え版をお好みのプラットフォームにアップロードしてください。" },
      { q: "講師の声は維持されますか？", a: "はい。DubSyncは講師の声をクローンし、各翻訳言語で自然に聞こえるようにします。" },
      { q: "コース全体を吹き替えできますか？", a: "はい。複数のレッスンをアップロードしてバッチ処理できます。" },
      { q: "翻訳字幕は生成されますか？", a: "はい。DubSyncは翻訳済みSRT/VTT字幕を生成し、動画と一緒にダウンロードできます。" },
    ],
    alsoWorksWith: "他のプラットフォームでも利用可能",
    breadcrumbPlatforms: "プラットフォーム",
    breadcrumbElearning: "eラーニング",
    ctaTitle: "コースを世界中の学習者に届けよう",
    ctaSubtitle: "5分間の無料吹き替えで始めましょう。クレジットカード不要。",
    ctaButton: "無料で始める",
  },

  hi: {
    title: "E-Learning के लिए AI डबिंग — ऑनलाइन कोर्स | DubSync",
    description:
      "वैश्विक शिक्षार्थियों के लिए ई-लर्निंग कोर्स AI डबिंग से डब करें।",
    h1: "ई-लर्निंग कोर्स AI से डब करें",
    subtitle:
      "Traduce tus cursos y materiales de e-learning a cualquier idioma. Mantén la voz del instructor consistente en todas las versiones.",
    ctaText: "Doblar mi curso",
    statBadge: "E-learning optimizado",
    steps: ["Sube tu curso", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Funciona con plataformas como Udemy o Coursera?", a: "Sí. Puedes subir cualquier video de curso, independientemente de la plataforma. Luego sube la versión doblada a tu plataforma preferida." },
      { q: "¿Se mantiene la voz del instructor?", a: "Sí. DubSync clona la voz del instructor para que suene natural en cada idioma traducido." },
      { q: "¿Puedo doblar un curso completo?", a: "Sí. Puedes subir múltiples lecciones y procesarlas por lotes." },
      { q: "¿Se generan subtítulos traducidos?", a: "Sí. DubSync genera subtítulos SRT/VTT traducidos que puedes descargar junto al video." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "प्लेटफ़ॉर्म",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Lleva tus cursos a estudiantes de todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  ar: {
    title: "دبلجة AI للتعليم الإلكتروني — الدورات عبر الإنترنت | DubSync",
    description:
      "دبلج دورات التعليم الإلكتروني للمتعلمين حول العالم بدبلجة الذكاء الاصطناعي.",
    h1: "دبلج دورات التعليم الإلكتروني بالذكاء الاصطناعي",
    subtitle:
      "Traduce tus cursos y materiales de e-learning a cualquier idioma. Mantén la voz del instructor consistente en todas las versiones.",
    ctaText: "Doblar mi curso",
    statBadge: "E-learning optimizado",
    steps: ["Sube tu curso", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Funciona con plataformas como Udemy o Coursera?", a: "Sí. Puedes subir cualquier video de curso, independientemente de la plataforma. Luego sube la versión doblada a tu plataforma preferida." },
      { q: "¿Se mantiene la voz del instructor?", a: "Sí. DubSync clona la voz del instructor para que suene natural en cada idioma traducido." },
      { q: "¿Puedo doblar un curso completo?", a: "Sí. Puedes subir múltiples lecciones y procesarlas por lotes." },
      { q: "¿Se generan subtítulos traducidos?", a: "Sí. DubSync genera subtítulos SRT/VTT traducidos que puedes descargar junto al video." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "المنصات",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Lleva tus cursos a estudiantes de todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  id: {
    title: "Dubbing AI untuk E-Learning — Kursus Online | DubSync",
    description:
      "Dubbing kursus e-learning untuk pelajar global dengan dubbing AI.",
    h1: "Dubbing kursus e-learning dengan AI",
    subtitle:
      "Traduce tus cursos y materiales de e-learning a cualquier idioma. Mantén la voz del instructor consistente en todas las versiones.",
    ctaText: "Doblar mi curso",
    statBadge: "E-learning optimizado",
    steps: ["Sube tu curso", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Funciona con plataformas como Udemy o Coursera?", a: "Sí. Puedes subir cualquier video de curso, independientemente de la plataforma. Luego sube la versión doblada a tu plataforma preferida." },
      { q: "¿Se mantiene la voz del instructor?", a: "Sí. DubSync clona la voz del instructor para que suene natural en cada idioma traducido." },
      { q: "¿Puedo doblar un curso completo?", a: "Sí. Puedes subir múltiples lecciones y procesarlas por lotes." },
      { q: "¿Se generan subtítulos traducidos?", a: "Sí. DubSync genera subtítulos SRT/VTT traducidos que puedes descargar junto al video." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Platform",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Lleva tus cursos a estudiantes de todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  tr: {
    title: "E-Learning için AI Dublaj — Online Kurslar | DubSync",
    description:
      "Küresel öğrenciler için e-öğrenme kurslarını AI dublajla dublajlayın.",
    h1: "E-öğrenme kurslarını AI ile dublajlayın",
    subtitle:
      "Traduce tus cursos y materiales de e-learning a cualquier idioma. Mantén la voz del instructor consistente en todas las versiones.",
    ctaText: "Doblar mi curso",
    statBadge: "E-learning optimizado",
    steps: ["Sube tu curso", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Funciona con plataformas como Udemy o Coursera?", a: "Sí. Puedes subir cualquier video de curso, independientemente de la plataforma. Luego sube la versión doblada a tu plataforma preferida." },
      { q: "¿Se mantiene la voz del instructor?", a: "Sí. DubSync clona la voz del instructor para que suene natural en cada idioma traducido." },
      { q: "¿Puedo doblar un curso completo?", a: "Sí. Puedes subir múltiples lecciones y procesarlas por lotes." },
      { q: "¿Se generan subtítulos traducidos?", a: "Sí. DubSync genera subtítulos SRT/VTT traducidos que puedes descargar junto al video." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "Platformlar",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Lleva tus cursos a estudiantes de todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },
  ko: {
    title: "E-Learning AI 더빙 — 온라인 강좌 | DubSync",
    description:
      "글로벌 학습자를 위해 E-Learning 강좌를 AI 더빙으로 더빙하세요.",
    h1: "E-Learning 강좌를 AI로 더빙",
    subtitle:
      "Traduce tus cursos y materiales de e-learning a cualquier idioma. Mantén la voz del instructor consistente en todas las versiones.",
    ctaText: "Doblar mi curso",
    statBadge: "E-learning optimizado",
    steps: ["Sube tu curso", "Elige los idiomas", "Descarga el resultado"],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Funciona con plataformas como Udemy o Coursera?", a: "Sí. Puedes subir cualquier video de curso, independientemente de la plataforma. Luego sube la versión doblada a tu plataforma preferida." },
      { q: "¿Se mantiene la voz del instructor?", a: "Sí. DubSync clona la voz del instructor para que suene natural en cada idioma traducido." },
      { q: "¿Puedo doblar un curso completo?", a: "Sí. Puedes subir múltiples lecciones y procesarlas por lotes." },
      { q: "¿Se generan subtítulos traducidos?", a: "Sí. DubSync genera subtítulos SRT/VTT traducidos que puedes descargar junto al video." },
    ],
    alsoWorksWith: "También funciona con",
    breadcrumbPlatforms: "플랫폼",
    breadcrumbElearning: "E-Learning",
    ctaTitle: "Lleva tus cursos a estudiantes de todo el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de crédito.",
    ctaButton: "Empezar gratis",
  },};

type Lang = keyof typeof TRANSLATIONS;
const STEP_ICONS = [Upload, Languages, Download];

const OTHER_PLATFORMS = [
  { slug: "youtube", name: "YouTube" },
  { slug: "tiktok", name: "TikTok" },
  { slug: "instagram", name: "Instagram" },
  { slug: "facebook", name: "Facebook" },
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
        ? "https://dubsync.app/platforms/elearning"
        : `https://dubsync.app/${l}/platforms/elearning`;
  }
  langAlternates["x-default"] = "https://dubsync.app/platforms/elearning";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/platforms/elearning`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/platforms/elearning`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedElearningPage({
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
          { name: t.breadcrumbElearning, url: `https://dubsync.app/${lang}/platforms/elearning` },
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-medium text-green-400">
            <GraduationCap className="h-3.5 w-3.5" /> {t.statBadge}
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
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20">
                    <Icon className="h-6 w-6 text-green-400" />
                  </div>
                  <span className="text-xs font-mono text-green-400 uppercase tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-sm font-medium text-white">{step}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-600/10 p-10">
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
