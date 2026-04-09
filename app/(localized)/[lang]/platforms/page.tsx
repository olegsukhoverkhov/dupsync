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

type TranslationDict = {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  cta: string;
  breadcrumbPlatforms: string;
  /** FAQ items rendered into an FAQPage schema + visible accordion. */
  faqs: Array<{ q: string; a: string }>;
};

const TRANSLATIONS: Record<"es" | "pt" | "de" | "fr" | "ja" | "hi" | "ar" | "id" | "tr" | "ko", TranslationDict> = {
  es: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram y Más",
    description:
      "Dobla videos para YouTube, TikTok, Instagram, Facebook, e-learning y podcasts. Clonación de voz y lip sync con IA para cada plataforma.",
    h1: "Doblaje con IA para cada plataforma",
    subtitle:
      "Contenido optimizado para cada plataforma. Clonación de voz, lip sync y traducción automática adaptados a las especificaciones de cada canal.",
    cta: "Empezar gratis",
    breadcrumbPlatforms: "Plataformas",
    faqs: [
      {
        q: "¿Qué plataformas admite DubSync?",
        a: "DubSync funciona con cualquier plataforma que acepte MP4: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plataformas de e-learning y hosts de podcasts. El mismo video doblado se publica en todas partes.",
      },
      {
        q: "¿Debo crear videos diferentes para cada plataforma?",
        a: "No. DubSync produce un video doblado en alta calidad que puedes reutilizar en varias plataformas. Puedes recortar y cambiar el tamaño según lo que cada red requiera.",
      },
      {
        q: "¿Qué formatos de video funcionan con cada plataforma?",
        a: "DubSync acepta MP4, MOV, AVI, WebM y MKV. La salida es MP4, que funciona en todas las plataformas.",
      },
      {
        q: "¿Hay un plan gratuito para doblar por plataforma?",
        a: "Sí. El plan gratuito incluye 1 video de hasta 15 segundos con lip sync y clonación de voz. Sin tarjeta de crédito.",
      },
    ],
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
    faqs: [
      {
        q: "Quais plataformas o DubSync suporta?",
        a: "O DubSync funciona com qualquer plataforma que aceite MP4: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plataformas de e-learning e hosts de podcast. O mesmo vídeo dublado é publicado em todas.",
      },
      {
        q: "Preciso criar vídeos diferentes para cada plataforma?",
        a: "Não. O DubSync produz um vídeo dublado de alta qualidade que você reutiliza em várias plataformas. Você pode cortar e redimensionar conforme necessário.",
      },
      {
        q: "Quais formatos de vídeo funcionam em cada plataforma?",
        a: "O DubSync aceita MP4, MOV, AVI, WebM e MKV. A saída é MP4, compatível com todas as plataformas.",
      },
      {
        q: "Existe um plano gratuito para dublagem por plataforma?",
        a: "Sim. O plano gratuito inclui 1 vídeo de até 15 segundos com lip sync e clonagem de voz. Sem cartão de crédito.",
      },
    ],
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
    faqs: [
      {
        q: "Welche Plattformen unterstützt DubSync?",
        a: "DubSync funktioniert mit jeder Plattform, die MP4 akzeptiert: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, E-Learning-Plattformen und Podcast-Hosts. Dasselbe synchronisierte Video wird überall veröffentlicht.",
      },
      {
        q: "Muss ich für jede Plattform unterschiedliche Videos erstellen?",
        a: "Nein. DubSync produziert ein hochwertiges synchronisiertes Video, das Sie auf mehreren Plattformen wiederverwenden können. Sie können es bei Bedarf zuschneiden und anpassen.",
      },
      {
        q: "Welche Videoformate funktionieren mit welchen Plattformen?",
        a: "DubSync akzeptiert MP4, MOV, AVI, WebM und MKV. Die Ausgabe erfolgt als MP4 und funktioniert überall.",
      },
      {
        q: "Gibt es einen kostenlosen Plan für plattformübergreifende Synchronisation?",
        a: "Ja. Der kostenlose Plan umfasst 1 Video bis zu 15 Sekunden mit Lip Sync und Stimmklonen. Keine Kreditkarte erforderlich.",
      },
    ],
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
    faqs: [
      {
        q: "Quelles plateformes DubSync prend-il en charge ?",
        a: "DubSync fonctionne avec toute plateforme qui accepte MP4 : YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plateformes de e-learning et hébergeurs de podcasts. La même vidéo doublée se publie partout.",
      },
      {
        q: "Dois-je créer des vidéos différentes pour chaque plateforme ?",
        a: "Non. DubSync produit une vidéo doublée de haute qualité que vous réutilisez sur plusieurs plateformes. Vous pouvez recadrer et redimensionner selon les besoins.",
      },
      {
        q: "Quels formats vidéo fonctionnent avec chaque plateforme ?",
        a: "DubSync accepte MP4, MOV, AVI, WebM et MKV. La sortie est en MP4, compatible partout.",
      },
      {
        q: "Y a-t-il un plan gratuit pour le doublage par plateforme ?",
        a: "Oui. Le plan gratuit inclut 1 vidéo jusqu'à 15 secondes avec lip sync et clonage vocal. Sans carte de crédit.",
      },
    ],
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
    faqs: [
      {
        q: "DubSyncはどのプラットフォームに対応していますか？",
        a: "DubSyncはMP4を受け付けるあらゆるプラットフォームで動作します：YouTube、TikTok、Instagram、Facebook、LinkedIn、Vimeo、Twitch、eラーニングプラットフォーム、ポッドキャストホストなど。同じ吹き替え動画をすべてに公開できます。",
      },
      {
        q: "プラットフォームごとに別々の動画を作成する必要がありますか？",
        a: "いいえ。DubSyncは複数のプラットフォームで再利用できる高品質な吹き替え動画を作成します。必要に応じてトリミングやリサイズが可能です。",
      },
      {
        q: "各プラットフォームでどの動画形式が使えますか？",
        a: "DubSyncはMP4、MOV、AVI、WebM、MKVを受け付けます。出力はMP4で、どこでも使えます。",
      },
      {
        q: "プラットフォーム吹き替え向けの無料プランはありますか？",
        a: "はい。無料プランには15秒までの動画1本（リップシンク＆音声クローン付き）が含まれます。クレジットカード不要。",
      },
    ],
  },

  hi: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram y Más",
    description:
      "Dobla videos para YouTube, TikTok, Instagram, Facebook, e-learning y podcasts. Clonación de voz y lip sync con IA para cada plataforma.",
    h1: "Doblaje con IA para cada plataforma",
    subtitle:
      "Contenido optimizado para cada plataforma. Clonación de voz, lip sync y traducción automática adaptados a las especificaciones de cada canal.",
    cta: "Empezar gratis",
    breadcrumbPlatforms: "Plataformas",
    faqs: [
      {
        q: "¿Qué plataformas admite DubSync?",
        a: "DubSync funciona con cualquier plataforma que acepte MP4: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plataformas de e-learning y hosts de podcasts. El mismo video doblado se publica en todas partes.",
      },
      {
        q: "¿Debo crear videos diferentes para cada plataforma?",
        a: "No. DubSync produce un video doblado en alta calidad que puedes reutilizar en varias plataformas. Puedes recortar y cambiar el tamaño según lo que cada red requiera.",
      },
      {
        q: "¿Qué formatos de video funcionan con cada plataforma?",
        a: "DubSync acepta MP4, MOV, AVI, WebM y MKV. La salida es MP4, que funciona en todas las plataformas.",
      },
      {
        q: "¿Hay un plan gratuito para doblar por plataforma?",
        a: "Sí. El plan gratuito incluye 1 video de hasta 15 segundos con lip sync y clonación de voz. Sin tarjeta de crédito.",
      },
    ],
  },
  ar: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram y Más",
    description:
      "Dobla videos para YouTube, TikTok, Instagram, Facebook, e-learning y podcasts. Clonación de voz y lip sync con IA para cada plataforma.",
    h1: "Doblaje con IA para cada plataforma",
    subtitle:
      "Contenido optimizado para cada plataforma. Clonación de voz, lip sync y traducción automática adaptados a las especificaciones de cada canal.",
    cta: "Empezar gratis",
    breadcrumbPlatforms: "Plataformas",
    faqs: [
      {
        q: "¿Qué plataformas admite DubSync?",
        a: "DubSync funciona con cualquier plataforma que acepte MP4: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plataformas de e-learning y hosts de podcasts. El mismo video doblado se publica en todas partes.",
      },
      {
        q: "¿Debo crear videos diferentes para cada plataforma?",
        a: "No. DubSync produce un video doblado en alta calidad que puedes reutilizar en varias plataformas. Puedes recortar y cambiar el tamaño según lo que cada red requiera.",
      },
      {
        q: "¿Qué formatos de video funcionan con cada plataforma?",
        a: "DubSync acepta MP4, MOV, AVI, WebM y MKV. La salida es MP4, que funciona en todas las plataformas.",
      },
      {
        q: "¿Hay un plan gratuito para doblar por plataforma?",
        a: "Sí. El plan gratuito incluye 1 video de hasta 15 segundos con lip sync y clonación de voz. Sin tarjeta de crédito.",
      },
    ],
  },
  id: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram y Más",
    description:
      "Dobla videos para YouTube, TikTok, Instagram, Facebook, e-learning y podcasts. Clonación de voz y lip sync con IA para cada plataforma.",
    h1: "Doblaje con IA para cada plataforma",
    subtitle:
      "Contenido optimizado para cada plataforma. Clonación de voz, lip sync y traducción automática adaptados a las especificaciones de cada canal.",
    cta: "Empezar gratis",
    breadcrumbPlatforms: "Plataformas",
    faqs: [
      {
        q: "¿Qué plataformas admite DubSync?",
        a: "DubSync funciona con cualquier plataforma que acepte MP4: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plataformas de e-learning y hosts de podcasts. El mismo video doblado se publica en todas partes.",
      },
      {
        q: "¿Debo crear videos diferentes para cada plataforma?",
        a: "No. DubSync produce un video doblado en alta calidad que puedes reutilizar en varias plataformas. Puedes recortar y cambiar el tamaño según lo que cada red requiera.",
      },
      {
        q: "¿Qué formatos de video funcionan con cada plataforma?",
        a: "DubSync acepta MP4, MOV, AVI, WebM y MKV. La salida es MP4, que funciona en todas las plataformas.",
      },
      {
        q: "¿Hay un plan gratuito para doblar por plataforma?",
        a: "Sí. El plan gratuito incluye 1 video de hasta 15 segundos con lip sync y clonación de voz. Sin tarjeta de crédito.",
      },
    ],
  },
  tr: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram y Más",
    description:
      "Dobla videos para YouTube, TikTok, Instagram, Facebook, e-learning y podcasts. Clonación de voz y lip sync con IA para cada plataforma.",
    h1: "Doblaje con IA para cada plataforma",
    subtitle:
      "Contenido optimizado para cada plataforma. Clonación de voz, lip sync y traducción automática adaptados a las especificaciones de cada canal.",
    cta: "Empezar gratis",
    breadcrumbPlatforms: "Plataformas",
    faqs: [
      {
        q: "¿Qué plataformas admite DubSync?",
        a: "DubSync funciona con cualquier plataforma que acepte MP4: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plataformas de e-learning y hosts de podcasts. El mismo video doblado se publica en todas partes.",
      },
      {
        q: "¿Debo crear videos diferentes para cada plataforma?",
        a: "No. DubSync produce un video doblado en alta calidad que puedes reutilizar en varias plataformas. Puedes recortar y cambiar el tamaño según lo que cada red requiera.",
      },
      {
        q: "¿Qué formatos de video funcionan con cada plataforma?",
        a: "DubSync acepta MP4, MOV, AVI, WebM y MKV. La salida es MP4, que funciona en todas las plataformas.",
      },
      {
        q: "¿Hay un plan gratuito para doblar por plataforma?",
        a: "Sí. El plan gratuito incluye 1 video de hasta 15 segundos con lip sync y clonación de voz. Sin tarjeta de crédito.",
      },
    ],
  },
  ko: {
    title: "DubSync para Cada Plataforma — YouTube, TikTok, Instagram y Más",
    description:
      "Dobla videos para YouTube, TikTok, Instagram, Facebook, e-learning y podcasts. Clonación de voz y lip sync con IA para cada plataforma.",
    h1: "Doblaje con IA para cada plataforma",
    subtitle:
      "Contenido optimizado para cada plataforma. Clonación de voz, lip sync y traducción automática adaptados a las especificaciones de cada canal.",
    cta: "Empezar gratis",
    breadcrumbPlatforms: "Plataformas",
    faqs: [
      {
        q: "¿Qué plataformas admite DubSync?",
        a: "DubSync funciona con cualquier plataforma que acepte MP4: YouTube, TikTok, Instagram, Facebook, LinkedIn, Vimeo, Twitch, plataformas de e-learning y hosts de podcasts. El mismo video doblado se publica en todas partes.",
      },
      {
        q: "¿Debo crear videos diferentes para cada plataforma?",
        a: "No. DubSync produce un video doblado en alta calidad que puedes reutilizar en varias plataformas. Puedes recortar y cambiar el tamaño según lo que cada red requiera.",
      },
      {
        q: "¿Qué formatos de video funcionan con cada plataforma?",
        a: "DubSync acepta MP4, MOV, AVI, WebM y MKV. La salida es MP4, que funciona en todas las plataformas.",
      },
      {
        q: "¿Hay un plan gratuito para doblar por plataforma?",
        a: "Sí. El plan gratuito incluye 1 video de hasta 15 segundos con lip sync y clonación de voz. Sin tarjeta de crédito.",
      },
    ],
  },};

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
  // New 2026-04 locales — currently share the Spanish platform
  // descriptions as a placeholder until proper translations are
  // written in Phase 2. Platform name strings stay as proper nouns.
  hi: {
    youtube: { name: "YouTube", desc: "30+ भाषाओं में वॉइस क्लोनिंग के साथ YouTube वीडियो डब करें।" },
    tiktok: { name: "TikTok", desc: "AI TikTok डबिंग के साथ वैश्विक रूप से वायरल जाएं।" },
    instagram: { name: "Instagram", desc: "वैश्विक दर्शकों के लिए Reels और Stories डब करें।" },
    facebook: { name: "Facebook", desc: "Facebook वीडियो विज्ञापन और कंटेंट स्थानीयकृत करें।" },
    elearning: { name: "E-Learning", desc: "दुनिया भर के छात्रों के लिए ऑनलाइन कोर्स का अनुवाद करें।" },
    podcasts: { name: "Podcasts", desc: "AI के साथ अपने पॉडकास्ट को किसी भी भाषा में डब करें।" },
  },
  ar: {
    youtube: { name: "YouTube", desc: "دبلج فيديوهات YouTube إلى أكثر من 30 لغة باستخدام استنساخ الصوت." },
    tiktok: { name: "TikTok", desc: "انطلق عالمياً مع دبلجة AI لـ TikTok." },
    instagram: { name: "Instagram", desc: "دبلج Reels وStories للجمهور العالمي." },
    facebook: { name: "Facebook", desc: "وطّن إعلانات الفيديو ومحتوى Facebook." },
    elearning: { name: "E-Learning", desc: "ترجم الدورات عبر الإنترنت للمتعلمين حول العالم." },
    podcasts: { name: "Podcasts", desc: "دبلج البودكاست إلى أي لغة باستخدام الذكاء الاصطناعي." },
  },
  id: {
    youtube: { name: "YouTube", desc: "Dubbing video YouTube ke 30+ bahasa dengan kloning suara." },
    tiktok: { name: "TikTok", desc: "Viral secara global dengan dubbing TikTok AI." },
    instagram: { name: "Instagram", desc: "Dubbing Reels dan Stories untuk audiens global." },
    facebook: { name: "Facebook", desc: "Lokalkan iklan video dan konten Facebook." },
    elearning: { name: "E-Learning", desc: "Terjemahkan kursus online untuk pelajar di seluruh dunia." },
    podcasts: { name: "Podcasts", desc: "Dubbing podcast ke bahasa apa pun dengan AI." },
  },
  tr: {
    youtube: { name: "YouTube", desc: "YouTube videolarını ses klonlama ile 30+ dilde dublajlayın." },
    tiktok: { name: "TikTok", desc: "AI TikTok dublajı ile küresel olarak viral olun." },
    instagram: { name: "Instagram", desc: "Reels ve Stories'i küresel izleyici için dublajlayın." },
    facebook: { name: "Facebook", desc: "Facebook video reklamlarını ve içeriği yerelleştirin." },
    elearning: { name: "E-Learning", desc: "Çevrimiçi kursları dünya çapında öğrenciler için çevirin." },
    podcasts: { name: "Podcasts", desc: "Podcast'inizi AI ile herhangi bir dile dublajlayın." },
  },
  ko: {
    youtube: { name: "YouTube", desc: "YouTube 비디오를 음성 클론으로 30개 이상 언어로 더빙." },
    tiktok: { name: "TikTok", desc: "AI TikTok 더빙으로 글로벌 바이럴 되기." },
    instagram: { name: "Instagram", desc: "글로벌 시청자를 위해 Reels와 Stories 더빙." },
    facebook: { name: "Facebook", desc: "Facebook 비디오 광고와 콘텐츠 로컬라이즈." },
    elearning: { name: "E-Learning", desc: "전 세계 학습자를 위해 온라인 강좌 번역." },
    podcasts: { name: "Podcasts", desc: "AI로 팟캐스트를 모든 언어로 더빙." },
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

  // Localized FAQPage Schema — matches the visible accordion below so Google
  // picks up rich results in every language.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t.breadcrumbPlatforms, url: `https://dubsync.app/${lang}/platforms` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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

        {/* FAQ — rendered so on-page content matches the FAQPage schema
            above. Google penalises schema without matching visible content. */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 pb-16">
          <div className="space-y-3">
            {t.faqs.map((f, i) => (
              <details
                key={i}
                className="rounded-xl border border-white/10 bg-slate-800/30 overflow-hidden group"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-white list-none">
                  <span>{f.q}</span>
                  <ArrowRight className="h-4 w-4 text-zinc-500 rotate-90 group-open:rotate-[270deg] transition-transform" />
                </summary>
                <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

    </>
  );
}
