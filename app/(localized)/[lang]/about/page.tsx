import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

/**
 * Localized /about page.
 *
 * Mirrors the EN version at (marketing)/about/page.tsx but reads all
 * user-visible strings from the in-file TRANSLATIONS map. Keep the two
 * files in structural sync so the SEO signals (H1, H2s, hreflang pair)
 * line up one-for-one across locales.
 */

type Bullet = { label: string; text: string };

type AboutCopy = {
  title: string;
  description: string;
  h1: string;
  missionHeading: string;
  missionBody: string;
  technologyHeading: string;
  technologyIntro: string;
  technologyBullets: Bullet[];
  visionHeading: string;
  visionBody: string;
  numbersHeading: string;
  stats: Array<{ value: string; label: string }>;
  breadcrumb: string;
};

type Lang = "es" | "pt" | "de" | "fr" | "ja" | "hi" | "ar" | "id" | "tr" | "ko";

const TRANSLATIONS: Record<Lang, AboutCopy> = {
  es: {
    title: "Sobre DubSync — Doblaje de Video con IA para Cada Creador",
    description:
      "DubSync hace que el contenido de video sea accesible globalmente con clonación de voz, lip sync y traducción con IA en más de 30 idiomas.",
    h1: "Sobre DubSync",
    missionHeading: "Nuestra misión",
    missionBody:
      "DubSync existe para hacer que el contenido de video sea accesible para cada audiencia del planeta. El idioma nunca debería ser una barrera para una gran narración, educación o entretenimiento. Damos a creadores, educadores y empresas el poder de llegar a audiencias globales en minutos, no en meses.",
    technologyHeading: "La tecnología",
    technologyIntro:
      "DubSync combina tres capacidades de IA de vanguardia en un flujo de trabajo único y fluido:",
    technologyBullets: [
      {
        label: "Clonación de voz",
        text: "— Nuestra IA captura el tono, timbre y cadencia únicos del hablante y luego recrea su voz en el idioma destino. No se requieren muestras de voz adicionales.",
      },
      {
        label: "Lip sync",
        text: "— La animación facial impulsada por IA ajusta los movimientos de la boca al audio doblado, produciendo un video que parece natural y en el que los espectadores confían.",
      },
      {
        label: "Traducción",
        text: "— La traducción neuronal contextual preserva el significado, el humor y los matices culturales en más de 30 idiomas con precisión de nivel humano.",
      },
    ],
    visionHeading: "Nuestra visión",
    visionBody:
      "Visualizamos un mundo donde cada video se pueda ver en cualquier idioma. Nuestro equipo es un grupo pequeño y enfocado de ingenieros e investigadores apasionados por la IA multilingüe, la visión por computadora y la síntesis de audio. Estamos construyendo la infraestructura para una economía de creadores verdaderamente global donde gana el mejor contenido, sin importar el idioma original.",
    numbersHeading: "DubSync en números",
    stats: [
      { value: "2,000+", label: "Creadores" },
      { value: "50M+", label: "Minutos doblados" },
      { value: "30+", label: "Idiomas" },
      { value: "96%+", label: "Precisión de lip sync" },
    ],
    breadcrumb: "Nosotros",
  },
  pt: {
    title: "Sobre o DubSync — Dublagem de Vídeo com IA para Cada Criador",
    description:
      "O DubSync torna o conteúdo em vídeo acessível globalmente com clonagem de voz, lip sync e tradução por IA em mais de 30 idiomas.",
    h1: "Sobre o DubSync",
    missionHeading: "Nossa missão",
    missionBody:
      "O DubSync existe para tornar o conteúdo em vídeo acessível a toda audiência do planeta. O idioma nunca deveria ser uma barreira para grandes histórias, educação ou entretenimento. Damos a criadores, educadores e empresas o poder de alcançar audiências globais em minutos, não em meses.",
    technologyHeading: "A tecnologia",
    technologyIntro:
      "O DubSync combina três capacidades de IA de ponta em um único fluxo de trabalho contínuo:",
    technologyBullets: [
      {
        label: "Clonagem de voz",
        text: "— Nossa IA captura o tom, timbre e cadência únicos do locutor e recria sua voz no idioma destino. Sem amostras de voz adicionais.",
      },
      {
        label: "Lip sync",
        text: "— A animação facial baseada em IA ajusta os movimentos da boca ao áudio dublado, produzindo vídeos naturais em que os espectadores confiam.",
      },
      {
        label: "Tradução",
        text: "— A tradução neural contextual preserva significado, humor e nuance cultural em mais de 30 idiomas com precisão de nível humano.",
      },
    ],
    visionHeading: "Nossa visão",
    visionBody:
      "Imaginamos um mundo onde cada vídeo pode ser assistido em qualquer idioma. Nossa equipe é um grupo pequeno e focado de engenheiros e pesquisadores apaixonados por IA multilíngue, visão computacional e síntese de áudio. Estamos construindo a infraestrutura para uma economia de criadores verdadeiramente global, onde o melhor conteúdo vence, independentemente do idioma original.",
    numbersHeading: "DubSync em números",
    stats: [
      { value: "2,000+", label: "Criadores" },
      { value: "50M+", label: "Minutos dublados" },
      { value: "30+", label: "Idiomas" },
      { value: "96%+", label: "Precisão de lip sync" },
    ],
    breadcrumb: "Sobre",
  },
  de: {
    title: "Über DubSync — KI-Videosynchronisation für jeden Creator",
    description:
      "DubSync macht Videoinhalte global zugänglich durch KI-Stimmklonen, Lippensynchronisation und Übersetzung in über 30 Sprachen.",
    h1: "Über DubSync",
    missionHeading: "Unsere Mission",
    missionBody:
      "DubSync existiert, um Videoinhalte für jede Zielgruppe auf der Welt zugänglich zu machen. Sprache sollte niemals eine Barriere für großartige Geschichten, Bildung oder Unterhaltung sein. Wir geben Creatorn, Pädagogen und Unternehmen die Möglichkeit, globale Zielgruppen in Minuten statt Monaten zu erreichen.",
    technologyHeading: "Die Technologie",
    technologyIntro:
      "DubSync kombiniert drei hochmoderne KI-Fähigkeiten in einem einzigen, nahtlosen Workflow:",
    technologyBullets: [
      {
        label: "Stimmklonen",
        text: "— Unsere KI erfasst den einzigartigen Ton, die Tonhöhe und den Rhythmus des Sprechers und erstellt seine Stimme in der Zielsprache neu. Keine zusätzlichen Stimmproben erforderlich.",
      },
      {
        label: "Lippensynchronisation",
        text: "— KI-gesteuerte Gesichtsanimation passt Mundbewegungen an das synchronisierte Audio an und erzeugt natürlich wirkende Videos, denen Zuschauer vertrauen.",
      },
      {
        label: "Übersetzung",
        text: "— Kontextbewusste neuronale Übersetzung bewahrt Bedeutung, Humor und kulturelle Nuancen in über 30 Sprachen mit menschlicher Genauigkeit.",
      },
    ],
    visionHeading: "Unsere Vision",
    visionBody:
      "Wir stellen uns eine Welt vor, in der jedes Video in jeder Sprache ansehbar ist. Unser Team ist eine kleine, fokussierte Gruppe von Ingenieuren und Forschern, die sich für mehrsprachige KI, Computer Vision und Audiosynthese begeistern. Wir bauen die Infrastruktur für eine wirklich globale Creator-Wirtschaft, in der die besten Inhalte gewinnen, unabhängig von der ursprünglichen Sprache.",
    numbersHeading: "DubSync in Zahlen",
    stats: [
      { value: "2.000+", label: "Creator" },
      { value: "50M+", label: "Synchronisierte Minuten" },
      { value: "30+", label: "Sprachen" },
      { value: "96%+", label: "Lip-Sync-Genauigkeit" },
    ],
    breadcrumb: "Über uns",
  },
  fr: {
    title: "À propos de DubSync — Doublage Vidéo IA pour Chaque Créateur",
    description:
      "DubSync rend le contenu vidéo accessible à l'échelle mondiale grâce au clonage vocal IA, au lip sync et à la traduction en plus de 30 langues.",
    h1: "À propos de DubSync",
    missionHeading: "Notre mission",
    missionBody:
      "DubSync existe pour rendre le contenu vidéo accessible à chaque audience de la planète. La langue ne devrait jamais être une barrière à de grandes histoires, à l'éducation ou au divertissement. Nous donnons aux créateurs, éducateurs et entreprises le pouvoir de toucher des audiences mondiales en minutes, pas en mois.",
    technologyHeading: "La technologie",
    technologyIntro:
      "DubSync combine trois capacités d'IA de pointe dans un flux de travail unique et fluide :",
    technologyBullets: [
      {
        label: "Clonage vocal",
        text: "— Notre IA capture le ton, la hauteur et le rythme uniques du locuteur, puis recrée sa voix dans la langue cible. Aucun échantillon vocal supplémentaire requis.",
      },
      {
        label: "Lip sync",
        text: "— L'animation faciale pilotée par IA ajuste les mouvements de la bouche à l'audio doublé, produisant des vidéos d'apparence naturelle auxquelles les spectateurs font confiance.",
      },
      {
        label: "Traduction",
        text: "— La traduction neuronale contextuelle préserve le sens, l'humour et les nuances culturelles dans plus de 30 langues avec une précision humaine.",
      },
    ],
    visionHeading: "Notre vision",
    visionBody:
      "Nous imaginons un monde où chaque vidéo peut être regardée dans toutes les langues. Notre équipe est un petit groupe concentré d'ingénieurs et de chercheurs passionnés par l'IA multilingue, la vision par ordinateur et la synthèse audio. Nous construisons l'infrastructure d'une économie de créateurs vraiment mondiale où le meilleur contenu gagne, quelle que soit la langue d'origine.",
    numbersHeading: "DubSync en chiffres",
    stats: [
      { value: "2 000+", label: "Créateurs" },
      { value: "50M+", label: "Minutes doublées" },
      { value: "30+", label: "Langues" },
      { value: "96%+", label: "Précision du lip sync" },
    ],
    breadcrumb: "À propos",
  },
  ja: {
    title: "DubSyncについて — すべてのクリエイターのためのAI動画吹き替え",
    description:
      "DubSyncは、30以上の言語でのAI音声クローン、リップシンク、翻訳により、動画コンテンツを世界中にアクセス可能にします。",
    h1: "DubSyncについて",
    missionHeading: "私たちのミッション",
    missionBody:
      "DubSyncは、地球上のすべての視聴者に動画コンテンツをアクセス可能にするために存在します。言語は、優れたストーリーテリング、教育、エンターテインメントの障壁になるべきではありません。私たちは、クリエイター、教育者、企業が数ヶ月ではなく数分でグローバルな視聴者にリーチする力を提供します。",
    technologyHeading: "テクノロジー",
    technologyIntro:
      "DubSyncは、3つの最先端AI機能を単一のシームレスなワークフローに統合します：",
    technologyBullets: [
      {
        label: "音声クローン",
        text: "— 私たちのAIは話者の独特なトーン、ピッチ、リズムを捉え、ターゲット言語でその声を再現します。追加の音声サンプルは不要です。",
      },
      {
        label: "リップシンク",
        text: "— AI駆動の顔アニメーションが吹き替え音声に合わせて口の動きを調整し、視聴者が信頼できる自然な見た目の動画を生成します。",
      },
      {
        label: "翻訳",
        text: "— 文脈を考慮したニューラル翻訳が、30以上の言語で意味、ユーモア、文化的ニュアンスを人間レベルの精度で保持します。",
      },
    ],
    visionHeading: "私たちのビジョン",
    visionBody:
      "私たちは、すべての動画をあらゆる言語で視聴できる世界を思い描いています。私たちのチームは、多言語AI、コンピュータビジョン、音声合成に情熱を持つエンジニアと研究者の小さな集中型グループです。元の言語に関係なく最高のコンテンツが勝つ、真にグローバルなクリエイターエコノミーのためのインフラを構築しています。",
    numbersHeading: "数字で見るDubSync",
    stats: [
      { value: "2,000+", label: "クリエイター" },
      { value: "50M+", label: "吹き替え分数" },
      { value: "30+", label: "言語" },
      { value: "96%+", label: "リップシンク精度" },
    ],
    breadcrumb: "会社概要",
  },

  hi: {
    title: "Sobre DubSync — Doblaje de Video con IA para Cada Creador",
    description:
      "DubSync hace que el contenido de video sea accesible globalmente con clonación de voz, lip sync y traducción con IA en más de 30 idiomas.",
    h1: "Sobre DubSync",
    missionHeading: "Nuestra misión",
    missionBody:
      "DubSync existe para hacer que el contenido de video sea accesible para cada audiencia del planeta. El idioma nunca debería ser una barrera para una gran narración, educación o entretenimiento. Damos a creadores, educadores y empresas el poder de llegar a audiencias globales en minutos, no en meses.",
    technologyHeading: "La tecnología",
    technologyIntro:
      "DubSync combina tres capacidades de IA de vanguardia en un flujo de trabajo único y fluido:",
    technologyBullets: [
      {
        label: "Clonación de voz",
        text: "— Nuestra IA captura el tono, timbre y cadencia únicos del hablante y luego recrea su voz en el idioma destino. No se requieren muestras de voz adicionales.",
      },
      {
        label: "Lip sync",
        text: "— La animación facial impulsada por IA ajusta los movimientos de la boca al audio doblado, produciendo un video que parece natural y en el que los espectadores confían.",
      },
      {
        label: "Traducción",
        text: "— La traducción neuronal contextual preserva el significado, el humor y los matices culturales en más de 30 idiomas con precisión de nivel humano.",
      },
    ],
    visionHeading: "Nuestra visión",
    visionBody:
      "Visualizamos un mundo donde cada video se pueda ver en cualquier idioma. Nuestro equipo es un grupo pequeño y enfocado de ingenieros e investigadores apasionados por la IA multilingüe, la visión por computadora y la síntesis de audio. Estamos construyendo la infraestructura para una economía de creadores verdaderamente global donde gana el mejor contenido, sin importar el idioma original.",
    numbersHeading: "DubSync en números",
    stats: [
      { value: "2,000+", label: "Creadores" },
      { value: "50M+", label: "Minutos doblados" },
      { value: "30+", label: "Idiomas" },
      { value: "96%+", label: "Precisión de lip sync" },
    ],
    breadcrumb: "Nosotros",
  },
  ar: {
    title: "Sobre DubSync — Doblaje de Video con IA para Cada Creador",
    description:
      "DubSync hace que el contenido de video sea accesible globalmente con clonación de voz, lip sync y traducción con IA en más de 30 idiomas.",
    h1: "Sobre DubSync",
    missionHeading: "Nuestra misión",
    missionBody:
      "DubSync existe para hacer que el contenido de video sea accesible para cada audiencia del planeta. El idioma nunca debería ser una barrera para una gran narración, educación o entretenimiento. Damos a creadores, educadores y empresas el poder de llegar a audiencias globales en minutos, no en meses.",
    technologyHeading: "La tecnología",
    technologyIntro:
      "DubSync combina tres capacidades de IA de vanguardia en un flujo de trabajo único y fluido:",
    technologyBullets: [
      {
        label: "Clonación de voz",
        text: "— Nuestra IA captura el tono, timbre y cadencia únicos del hablante y luego recrea su voz en el idioma destino. No se requieren muestras de voz adicionales.",
      },
      {
        label: "Lip sync",
        text: "— La animación facial impulsada por IA ajusta los movimientos de la boca al audio doblado, produciendo un video que parece natural y en el que los espectadores confían.",
      },
      {
        label: "Traducción",
        text: "— La traducción neuronal contextual preserva el significado, el humor y los matices culturales en más de 30 idiomas con precisión de nivel humano.",
      },
    ],
    visionHeading: "Nuestra visión",
    visionBody:
      "Visualizamos un mundo donde cada video se pueda ver en cualquier idioma. Nuestro equipo es un grupo pequeño y enfocado de ingenieros e investigadores apasionados por la IA multilingüe, la visión por computadora y la síntesis de audio. Estamos construyendo la infraestructura para una economía de creadores verdaderamente global donde gana el mejor contenido, sin importar el idioma original.",
    numbersHeading: "DubSync en números",
    stats: [
      { value: "2,000+", label: "Creadores" },
      { value: "50M+", label: "Minutos doblados" },
      { value: "30+", label: "Idiomas" },
      { value: "96%+", label: "Precisión de lip sync" },
    ],
    breadcrumb: "Nosotros",
  },
  id: {
    title: "Sobre DubSync — Doblaje de Video con IA para Cada Creador",
    description:
      "DubSync hace que el contenido de video sea accesible globalmente con clonación de voz, lip sync y traducción con IA en más de 30 idiomas.",
    h1: "Sobre DubSync",
    missionHeading: "Nuestra misión",
    missionBody:
      "DubSync existe para hacer que el contenido de video sea accesible para cada audiencia del planeta. El idioma nunca debería ser una barrera para una gran narración, educación o entretenimiento. Damos a creadores, educadores y empresas el poder de llegar a audiencias globales en minutos, no en meses.",
    technologyHeading: "La tecnología",
    technologyIntro:
      "DubSync combina tres capacidades de IA de vanguardia en un flujo de trabajo único y fluido:",
    technologyBullets: [
      {
        label: "Clonación de voz",
        text: "— Nuestra IA captura el tono, timbre y cadencia únicos del hablante y luego recrea su voz en el idioma destino. No se requieren muestras de voz adicionales.",
      },
      {
        label: "Lip sync",
        text: "— La animación facial impulsada por IA ajusta los movimientos de la boca al audio doblado, produciendo un video que parece natural y en el que los espectadores confían.",
      },
      {
        label: "Traducción",
        text: "— La traducción neuronal contextual preserva el significado, el humor y los matices culturales en más de 30 idiomas con precisión de nivel humano.",
      },
    ],
    visionHeading: "Nuestra visión",
    visionBody:
      "Visualizamos un mundo donde cada video se pueda ver en cualquier idioma. Nuestro equipo es un grupo pequeño y enfocado de ingenieros e investigadores apasionados por la IA multilingüe, la visión por computadora y la síntesis de audio. Estamos construyendo la infraestructura para una economía de creadores verdaderamente global donde gana el mejor contenido, sin importar el idioma original.",
    numbersHeading: "DubSync en números",
    stats: [
      { value: "2,000+", label: "Creadores" },
      { value: "50M+", label: "Minutos doblados" },
      { value: "30+", label: "Idiomas" },
      { value: "96%+", label: "Precisión de lip sync" },
    ],
    breadcrumb: "Nosotros",
  },
  tr: {
    title: "Sobre DubSync — Doblaje de Video con IA para Cada Creador",
    description:
      "DubSync hace que el contenido de video sea accesible globalmente con clonación de voz, lip sync y traducción con IA en más de 30 idiomas.",
    h1: "Sobre DubSync",
    missionHeading: "Nuestra misión",
    missionBody:
      "DubSync existe para hacer que el contenido de video sea accesible para cada audiencia del planeta. El idioma nunca debería ser una barrera para una gran narración, educación o entretenimiento. Damos a creadores, educadores y empresas el poder de llegar a audiencias globales en minutos, no en meses.",
    technologyHeading: "La tecnología",
    technologyIntro:
      "DubSync combina tres capacidades de IA de vanguardia en un flujo de trabajo único y fluido:",
    technologyBullets: [
      {
        label: "Clonación de voz",
        text: "— Nuestra IA captura el tono, timbre y cadencia únicos del hablante y luego recrea su voz en el idioma destino. No se requieren muestras de voz adicionales.",
      },
      {
        label: "Lip sync",
        text: "— La animación facial impulsada por IA ajusta los movimientos de la boca al audio doblado, produciendo un video que parece natural y en el que los espectadores confían.",
      },
      {
        label: "Traducción",
        text: "— La traducción neuronal contextual preserva el significado, el humor y los matices culturales en más de 30 idiomas con precisión de nivel humano.",
      },
    ],
    visionHeading: "Nuestra visión",
    visionBody:
      "Visualizamos un mundo donde cada video se pueda ver en cualquier idioma. Nuestro equipo es un grupo pequeño y enfocado de ingenieros e investigadores apasionados por la IA multilingüe, la visión por computadora y la síntesis de audio. Estamos construyendo la infraestructura para una economía de creadores verdaderamente global donde gana el mejor contenido, sin importar el idioma original.",
    numbersHeading: "DubSync en números",
    stats: [
      { value: "2,000+", label: "Creadores" },
      { value: "50M+", label: "Minutos doblados" },
      { value: "30+", label: "Idiomas" },
      { value: "96%+", label: "Precisión de lip sync" },
    ],
    breadcrumb: "Nosotros",
  },
  ko: {
    title: "Sobre DubSync — Doblaje de Video con IA para Cada Creador",
    description:
      "DubSync hace que el contenido de video sea accesible globalmente con clonación de voz, lip sync y traducción con IA en más de 30 idiomas.",
    h1: "Sobre DubSync",
    missionHeading: "Nuestra misión",
    missionBody:
      "DubSync existe para hacer que el contenido de video sea accesible para cada audiencia del planeta. El idioma nunca debería ser una barrera para una gran narración, educación o entretenimiento. Damos a creadores, educadores y empresas el poder de llegar a audiencias globales en minutos, no en meses.",
    technologyHeading: "La tecnología",
    technologyIntro:
      "DubSync combina tres capacidades de IA de vanguardia en un flujo de trabajo único y fluido:",
    technologyBullets: [
      {
        label: "Clonación de voz",
        text: "— Nuestra IA captura el tono, timbre y cadencia únicos del hablante y luego recrea su voz en el idioma destino. No se requieren muestras de voz adicionales.",
      },
      {
        label: "Lip sync",
        text: "— La animación facial impulsada por IA ajusta los movimientos de la boca al audio doblado, produciendo un video que parece natural y en el que los espectadores confían.",
      },
      {
        label: "Traducción",
        text: "— La traducción neuronal contextual preserva el significado, el humor y los matices culturales en más de 30 idiomas con precisión de nivel humano.",
      },
    ],
    visionHeading: "Nuestra visión",
    visionBody:
      "Visualizamos un mundo donde cada video se pueda ver en cualquier idioma. Nuestro equipo es un grupo pequeño y enfocado de ingenieros e investigadores apasionados por la IA multilingüe, la visión por computadora y la síntesis de audio. Estamos construyendo la infraestructura para una economía de creadores verdaderamente global donde gana el mejor contenido, sin importar el idioma original.",
    numbersHeading: "DubSync en números",
    stats: [
      { value: "2,000+", label: "Creadores" },
      { value: "50M+", label: "Minutos doblados" },
      { value: "30+", label: "Idiomas" },
      { value: "96%+", label: "Precisión de lip sync" },
    ],
    breadcrumb: "Nosotros",
  },};

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
      l === "en" ? "https://dubsync.app/about" : `https://dubsync.app/${l}/about`;
  }
  langAlternates["x-default"] = "https://dubsync.app/about";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/about`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/about`,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
    },
  };
}

export default async function LocalizedAboutPage({
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
        items={[{ name: t.breadcrumb, url: `https://dubsync.app/${lang}/about` }]}
      />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">{t.h1}</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t.missionHeading}</h2>
            <p className="text-zinc-300 leading-relaxed text-lg">{t.missionBody}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t.technologyHeading}</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">{t.technologyIntro}</p>
            <ul className="space-y-3 text-zinc-300">
              {t.technologyBullets.map((b) => (
                <li key={b.label} className="flex gap-3">
                  <span className="text-pink-400 font-semibold shrink-0">
                    {b.label}
                  </span>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t.visionHeading}</h2>
            <p className="text-zinc-300 leading-relaxed">{t.visionBody}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">{t.numbersHeading}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {t.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
