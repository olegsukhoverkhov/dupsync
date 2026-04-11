import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Globe,
  ArrowRight,
  Upload,
  Languages,
  Download,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Traducci\u00f3n de Video con IA \u2014 Traduce Videos a M\u00e1s de 30 Idiomas | DubSync",
    description:
      "Traduce y dobla videos en m\u00e1s de 30 idiomas con IA. Soporte para espa\u00f1ol, franc\u00e9s, japon\u00e9s, hindi, \u00e1rabe y m\u00e1s. Calidad de estudio en minutos.",
    badge: "Traducci\u00f3n de Video",
    h1: "Traduce videos a m\u00e1s de 30 idiomas",
    h1Highlight: "con IA",
    subtitle:
      "DubSync traduce, dobla y sincroniza los labios de tus videos en m\u00e1s de 30 idiomas. Llega a una audiencia global sin volver a grabar una sola palabra.",
    cta: "Traducir un video gratis",
    languagesTitle: "Idiomas disponibles",
    languagesMore: "M\u00e1s idiomas agregados regularmente.",
    languagesRequest: "Solicitar un idioma",
    qualityTitle: "Calidad de traducci\u00f3n",
    qualitySubtitle: "DubSync usa un modelo de traducci\u00f3n neuronal dise\u00f1ado espec\u00edficamente para contenido hablado. Va m\u00e1s all\u00e1 de la traducci\u00f3n palabra por palabra para capturar significado y tono.",
    qualityPoints: [
      "Traducci\u00f3n contextual que preserva el significado, no solo las palabras",
      "Expresiones idiom\u00e1ticas adaptadas a cada idioma y regi\u00f3n",
      "Manejo de terminolog\u00eda t\u00e9cnica y espec\u00edfica del dominio",
      "Traducci\u00f3n consistente en todo el video para un resultado coherente",
      "Editor de guiones integrado para revisar y ajustar traducciones antes del doblaje",
    ],
    workflowTitle: "Flujo de trabajo de traducci\u00f3n",
    workflowSteps: [
      { title: "Subir o enlazar", description: "Arrastra un archivo o pega una URL de YouTube, Vimeo o directa." },
      { title: "Seleccionar idiomas", description: "Elige uno o m\u00faltiples idiomas objetivo. Se admite traducci\u00f3n por lotes." },
      { title: "Procesamiento IA", description: "Transcripci\u00f3n, traducci\u00f3n, clonaci\u00f3n de voz y lip sync se ejecutan en paralelo." },
      { title: "Exportar", description: "Descarga videos doblados en MP4 o env\u00edalos directamente a tus plataformas conectadas." },
    ],
    ctaTitle: "Hazte global con traducci\u00f3n de video IA",
    ctaSubtitle: "Traduce tu primer video gratis. 5 minutos de doblaje incluidos, sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    faqs: [
      { question: "\u00bfA cu\u00e1ntos idiomas puedo traducir un solo video?", answer: "No hay l\u00edmite. Puedes seleccionar tantos idiomas como tu plan admita. Todas las traducciones se ejecutan en paralelo." },
      { question: "\u00bfLa traducci\u00f3n es IA o humana?", answer: "DubSync usa un modelo de traducci\u00f3n neuronal personalizado entrenado espec\u00edficamente para contenido hablado. Tambi\u00e9n puedes editar el guion traducido antes del doblaje." },
      { question: "\u00bfPuedo agregar idiomas que no est\u00e1n listados?", answer: "Constantemente agregamos nuevos idiomas. Si necesitas un idioma que a\u00fan no est\u00e1 disponible, cont\u00e1ctanos y lo priorizaremos seg\u00fan la demanda." },
      { question: "\u00bfLa traducci\u00f3n de video incluye subt\u00edtulos?", answer: "DubSync se enfoca en doblaje de audio, no subt\u00edtulos. Sin embargo, la transcripci\u00f3n traducida est\u00e1 disponible para descargar en formato SRT." },
    ],
    breadcrumbFeatures: "Funciones",
    breadcrumbVideoTranslation: "Traducci\u00f3n de Video",
    regions: { europe: "Europa", asia: "Asia y Pac\u00edfico", middleEast: "Medio Oriente y \u00c1frica" },
  },
  pt: {
    title: "Tradu\u00e7\u00e3o de V\u00eddeo com IA \u2014 Traduza V\u00eddeos para Mais de 30 Idiomas | DubSync",
    description:
      "Traduza e duble v\u00eddeos em mais de 30 idiomas com IA. Suporte para espanhol, franc\u00eas, japon\u00eas, hindi, \u00e1rabe e mais. Qualidade de est\u00fadio em minutos.",
    badge: "Tradu\u00e7\u00e3o de V\u00eddeo",
    h1: "Traduza v\u00eddeos para mais de 30 idiomas",
    h1Highlight: "com IA",
    subtitle:
      "O DubSync traduz, dubla e sincroniza os l\u00e1bios dos seus v\u00eddeos em mais de 30 idiomas. Alcance um p\u00fablico global sem regravar uma \u00fanica palavra.",
    cta: "Traduzir um v\u00eddeo gr\u00e1tis",
    languagesTitle: "Idiomas dispon\u00edveis",
    languagesMore: "Mais idiomas adicionados regularmente.",
    languagesRequest: "Solicitar um idioma",
    qualityTitle: "Qualidade da tradu\u00e7\u00e3o",
    qualitySubtitle: "O DubSync usa um modelo de tradu\u00e7\u00e3o neural projetado especificamente para conte\u00fado falado. Vai al\u00e9m da tradu\u00e7\u00e3o palavra por palavra para capturar significado e tom.",
    qualityPoints: [
      "Tradu\u00e7\u00e3o contextual que preserva o significado, n\u00e3o apenas as palavras",
      "Express\u00f5es idiom\u00e1ticas adaptadas para cada idioma e regi\u00e3o",
      "Tratamento de terminologia t\u00e9cnica e espec\u00edfica do dom\u00ednio",
      "Tradu\u00e7\u00e3o consistente em todo o v\u00eddeo para um resultado coerente",
      "Editor de roteiros integrado para revisar e ajustar tradu\u00e7\u00f5es antes da dublagem",
    ],
    workflowTitle: "Fluxo de tradu\u00e7\u00e3o",
    workflowSteps: [
      { title: "Enviar ou vincular", description: "Arraste um arquivo ou cole uma URL do YouTube, Vimeo ou direta." },
      { title: "Selecionar idiomas", description: "Escolha um ou v\u00e1rios idiomas-alvo. Tradu\u00e7\u00e3o em lote \u00e9 suportada." },
      { title: "Processamento IA", description: "Transcri\u00e7\u00e3o, tradu\u00e7\u00e3o, clonagem de voz e lip sync rodam em paralelo." },
      { title: "Exportar", description: "Baixe v\u00eddeos dublados em MP4 ou envie diretamente para suas plataformas conectadas." },
    ],
    ctaTitle: "Torne-se global com tradu\u00e7\u00e3o de v\u00eddeo IA",
    ctaSubtitle: "Traduza seu primeiro v\u00eddeo gr\u00e1tis. 5 minutos de dublagem inclu\u00eddos, sem cart\u00e3o de cr\u00e9dito.",
    ctaButton: "Come\u00e7ar gr\u00e1tis",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Recursos relacionados",
    allFeatures: "Todos os recursos",
    faqs: [
      { question: "Em quantos idiomas posso traduzir um \u00fanico v\u00eddeo?", answer: "N\u00e3o h\u00e1 limite. Voc\u00ea pode selecionar quantos idiomas seu plano suportar. Todas as tradu\u00e7\u00f5es rodam em paralelo." },
      { question: "A tradu\u00e7\u00e3o \u00e9 IA ou humana?", answer: "O DubSync usa um modelo de tradu\u00e7\u00e3o neural personalizado treinado especificamente para conte\u00fado falado. Voc\u00ea tamb\u00e9m pode editar o roteiro traduzido antes da dublagem." },
      { question: "Posso adicionar idiomas que n\u00e3o est\u00e3o listados?", answer: "Adicionamos novos idiomas constantemente. Se precisar de um idioma que ainda n\u00e3o est\u00e1 dispon\u00edvel, entre em contato e priorizaremos com base na demanda." },
      { question: "A tradu\u00e7\u00e3o de v\u00eddeo inclui legendas?", answer: "O DubSync foca em dublagem de \u00e1udio, n\u00e3o legendas. No entanto, a transcri\u00e7\u00e3o traduzida est\u00e1 dispon\u00edvel para download em formato SRT." },
    ],
    breadcrumbFeatures: "Recursos",
    breadcrumbVideoTranslation: "Tradu\u00e7\u00e3o de V\u00eddeo",
    regions: { europe: "Europa", asia: "\u00c1sia e Pac\u00edfico", middleEast: "Oriente M\u00e9dio e \u00c1frica" },
  },
  de: {
    title: "KI-Video\u00fcbersetzung \u2014 Videos in \u00fcber 30 Sprachen \u00fcbersetzen | DubSync",
    description:
      "\u00dcbersetzen und synchronisieren Sie Videos in \u00fcber 30 Sprachen mit KI. Studio-Qualit\u00e4t in Minuten.",
    badge: "Video\u00fcbersetzung",
    h1: "Videos in \u00fcber 30 Sprachen \u00fcbersetzen",
    h1Highlight: "mit KI",
    subtitle:
      "DubSync \u00fcbersetzt, synchronisiert und passt die Lippen Ihrer Videos in \u00fcber 30 Sprachen an. Erreichen Sie ein globales Publikum, ohne ein einziges Wort neu aufzunehmen.",
    cta: "Ein Video kostenlos \u00fcbersetzen",
    languagesTitle: "Verf\u00fcgbare Sprachen",
    languagesMore: "Weitere Sprachen werden regelm\u00e4\u00dfig hinzugef\u00fcgt.",
    languagesRequest: "Sprache anfordern",
    qualityTitle: "\u00dcbersetzungsqualit\u00e4t",
    qualitySubtitle: "DubSync verwendet ein neuronales \u00dcbersetzungsmodell, das speziell f\u00fcr gesprochene Inhalte entwickelt wurde. Es geht \u00fcber Wort-f\u00fcr-Wort-\u00dcbersetzung hinaus.",
    qualityPoints: [
      "Kontextbewusste \u00dcbersetzung, die Bedeutung bewahrt, nicht nur W\u00f6rter",
      "Idiomatische Formulierungen f\u00fcr jede Sprache und Region",
      "Behandlung technischer und fachspezifischer Terminologie",
      "Konsistente \u00dcbersetzung im gesamten Video f\u00fcr ein koh\u00e4rentes Ergebnis",
      "Integrierter Skript-Editor zum \u00dcberpr\u00fcfen und Anpassen vor der Synchronisation",
    ],
    workflowTitle: "\u00dcbersetzungs-Workflow",
    workflowSteps: [
      { title: "Hochladen oder verlinken", description: "Ziehen Sie eine Datei oder f\u00fcgen Sie eine YouTube-, Vimeo- oder direkte URL ein." },
      { title: "Sprachen w\u00e4hlen", description: "W\u00e4hlen Sie eine oder mehrere Zielsprachen. Batch-\u00dcbersetzung wird unterst\u00fctzt." },
      { title: "KI-Verarbeitung", description: "Transkription, \u00dcbersetzung, Stimmklonen und Lip Sync laufen parallel." },
      { title: "Exportieren", description: "Laden Sie synchronisierte Videos als MP4 herunter oder senden Sie sie direkt an Ihre verbundenen Plattformen." },
    ],
    ctaTitle: "Werden Sie global mit KI-Video\u00fcbersetzung",
    ctaSubtitle: "\u00dcbersetzen Sie Ihr erstes Video kostenlos. 5 Minuten Synchronisation inklusive, keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
    faqTitle: "H\u00e4ufig gestellte Fragen",
    relatedTitle: "Verwandte Funktionen",
    allFeatures: "Alle Funktionen",
    faqs: [
      { question: "In wie viele Sprachen kann ich ein einzelnes Video \u00fcbersetzen?", answer: "Es gibt kein Limit. Sie k\u00f6nnen so viele Zielsprachen w\u00e4hlen, wie Ihr Plan erlaubt. Alle \u00dcbersetzungen laufen parallel." },
      { question: "Ist die \u00dcbersetzung KI oder menschlich?", answer: "DubSync verwendet ein ma\u00dfgeschneidertes neuronales \u00dcbersetzungsmodell, das speziell f\u00fcr gesprochene Inhalte trainiert wurde. Sie k\u00f6nnen auch das \u00fcbersetzte Skript vor der Synchronisation bearbeiten." },
      { question: "Kann ich Sprachen hinzuf\u00fcgen, die nicht aufgelistet sind?", answer: "Wir f\u00fcgen st\u00e4ndig neue Sprachen hinzu. Wenn eine ben\u00f6tigte Sprache noch nicht verf\u00fcgbar ist, kontaktieren Sie uns und wir priorisieren sie nach Bedarf." },
      { question: "Enth\u00e4lt die Video\u00fcbersetzung Untertitel?", answer: "DubSync konzentriert sich auf Audio-Synchronisation, nicht auf Untertitel. Das \u00fcbersetzte Transkript steht jedoch als SRT-Download zur Verf\u00fcgung." },
    ],
    breadcrumbFeatures: "Funktionen",
    breadcrumbVideoTranslation: "Video\u00fcbersetzung",
    regions: { europe: "Europa", asia: "Asien & Pazifik", middleEast: "Naher Osten & Afrika" },
  },
  fr: {
    title: "Traduction Vid\u00e9o IA \u2014 Traduisez des Vid\u00e9os dans Plus de 30 Langues | DubSync",
    description:
      "Traduisez et doublez des vid\u00e9os dans plus de 30 langues avec l\u2019IA. Qualit\u00e9 studio en minutes.",
    badge: "Traduction Vid\u00e9o",
    h1: "Traduisez des vid\u00e9os dans plus de 30 langues",
    h1Highlight: "avec l\u2019IA",
    subtitle:
      "DubSync traduit, double et synchronise les l\u00e8vres de vos vid\u00e9os dans plus de 30 langues. Atteignez un public mondial sans r\u00e9enregistrer un seul mot.",
    cta: "Traduire une vid\u00e9o gratuitement",
    languagesTitle: "Langues disponibles",
    languagesMore: "De nouvelles langues sont ajout\u00e9es r\u00e9guli\u00e8rement.",
    languagesRequest: "Demander une langue",
    qualityTitle: "Qualit\u00e9 de traduction",
    qualitySubtitle: "DubSync utilise un mod\u00e8le de traduction neuronale con\u00e7u sp\u00e9cifiquement pour le contenu parl\u00e9. Il va au-del\u00e0 de la traduction mot \u00e0 mot pour capturer le sens et le ton.",
    qualityPoints: [
      "Traduction contextuelle qui pr\u00e9serve le sens, pas seulement les mots",
      "Expressions idiomatiques adapt\u00e9es \u00e0 chaque langue et r\u00e9gion",
      "Gestion de la terminologie technique et sp\u00e9cifique au domaine",
      "Traduction coh\u00e9rente sur l\u2019ensemble de la vid\u00e9o",
      "\u00c9diteur de scripts int\u00e9gr\u00e9 pour v\u00e9rifier et ajuster les traductions avant le doublage",
    ],
    workflowTitle: "Flux de traduction",
    workflowSteps: [
      { title: "T\u00e9l\u00e9charger ou lier", description: "D\u00e9posez un fichier ou collez une URL YouTube, Vimeo ou directe." },
      { title: "S\u00e9lectionner les langues", description: "Choisissez une ou plusieurs langues cibles. La traduction par lot est prise en charge." },
      { title: "Traitement IA", description: "Transcription, traduction, clonage vocal et lip sync s\u2019ex\u00e9cutent en parall\u00e8le." },
      { title: "Exporter", description: "T\u00e9l\u00e9chargez les vid\u00e9os doubl\u00e9es en MP4 ou envoyez-les directement \u00e0 vos plateformes connect\u00e9es." },
    ],
    ctaTitle: "Devenez mondial avec la traduction vid\u00e9o IA",
    ctaSubtitle: "Traduisez votre premi\u00e8re vid\u00e9o gratuitement. 5 minutes de doublage incluses, sans carte de cr\u00e9dit.",
    ctaButton: "Commencer gratuitement",
    faqTitle: "Questions fr\u00e9quentes",
    relatedTitle: "Fonctionnalit\u00e9s connexes",
    allFeatures: "Toutes les fonctionnalit\u00e9s",
    faqs: [
      { question: "Dans combien de langues puis-je traduire une seule vid\u00e9o ?", answer: "Il n\u2019y a pas de limite. Vous pouvez s\u00e9lectionner autant de langues cibles que votre plan le permet. Toutes les traductions s\u2019ex\u00e9cutent en parall\u00e8le." },
      { question: "La traduction est-elle IA ou humaine ?", answer: "DubSync utilise un mod\u00e8le de traduction neuronale personnalis\u00e9 entra\u00een\u00e9 sp\u00e9cifiquement pour le contenu parl\u00e9. Vous pouvez \u00e9galement modifier le script traduit avant le doublage." },
      { question: "Puis-je ajouter des langues non list\u00e9es ?", answer: "Nous ajoutons constamment de nouvelles langues. Si une langue dont vous avez besoin n\u2019est pas encore disponible, contactez-nous et nous la prioriserons." },
      { question: "La traduction vid\u00e9o inclut-elle des sous-titres ?", answer: "DubSync se concentre sur le doublage audio, pas les sous-titres. Cependant, la transcription traduite est disponible en t\u00e9l\u00e9chargement au format SRT." },
    ],
    breadcrumbFeatures: "Fonctionnalit\u00e9s",
    breadcrumbVideoTranslation: "Traduction Vid\u00e9o",
    regions: { europe: "Europe", asia: "Asie et Pacifique", middleEast: "Moyen-Orient et Afrique" },
  },
  ja: {
    title: "AI\u52d5\u753b\u7ffb\u8a33 \u2014 30\u4ee5\u4e0a\u306e\u8a00\u8a9e\u306b\u52d5\u753b\u3092\u81ea\u52d5\u7ffb\u8a33 | DubSync",
    description:
      "AI\u306730\u4ee5\u4e0a\u306e\u8a00\u8a9e\u306b\u52d5\u753b\u3092\u7ffb\u8a33\u30fb\u5439\u304d\u66ff\u3048\u3002\u6570\u5206\u3067\u30b9\u30bf\u30b8\u30aa\u54c1\u8cea\u306e\u51fa\u529b\u3002",
    badge: "\u52d5\u753b\u7ffb\u8a33",
    h1: "30\u4ee5\u4e0a\u306e\u8a00\u8a9e\u306b\u52d5\u753b\u3092\u7ffb\u8a33",
    h1Highlight: "AI\u3067",
    subtitle:
      "DubSync\u306f\u52d5\u753b\u306e\u7ffb\u8a33\u3001\u5439\u304d\u66ff\u3048\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u309230\u4ee5\u4e0a\u306e\u8a00\u8a9e\u3067\u884c\u3044\u307e\u3059\u3002\u4e00\u8a00\u3082\u53ce\u9332\u3057\u76f4\u3059\u3053\u3068\u306a\u304f\u3001\u30b0\u30ed\u30fc\u30d0\u30eb\u306a\u8996\u8074\u8005\u306b\u30ea\u30fc\u30c1\u3067\u304d\u307e\u3059\u3002",
    cta: "\u52d5\u753b\u3092\u7121\u6599\u3067\u7ffb\u8a33",
    languagesTitle: "\u5bfe\u5fdc\u8a00\u8a9e",
    languagesMore: "\u65b0\u3057\u3044\u8a00\u8a9e\u304c\u5b9a\u671f\u7684\u306b\u8ffd\u52a0\u3055\u308c\u307e\u3059\u3002",
    languagesRequest: "\u8a00\u8a9e\u3092\u30ea\u30af\u30a8\u30b9\u30c8",
    qualityTitle: "\u7ffb\u8a33\u54c1\u8cea",
    qualitySubtitle: "DubSync\u306f\u97f3\u58f0\u30b3\u30f3\u30c6\u30f3\u30c4\u5c02\u7528\u306b\u8a2d\u8a08\u3055\u308c\u305f\u30cb\u30e5\u30fc\u30e9\u30eb\u7ffb\u8a33\u30e2\u30c7\u30eb\u3092\u4f7f\u7528\u3002\u5358\u8a9e\u3054\u3068\u306e\u7ffb\u8a33\u3092\u8d85\u3048\u3066\u610f\u5473\u3068\u30c8\u30fc\u30f3\u3092\u6355\u3089\u3048\u307e\u3059\u3002",
    qualityPoints: [
      "\u5358\u8a9e\u3067\u306f\u306a\u304f\u610f\u5473\u3092\u4fdd\u6301\u3059\u308b\u6587\u8108\u8a8d\u8b58\u7ffb\u8a33",
      "\u5404\u8a00\u8a9e\u30fb\u5730\u57df\u306b\u5408\u308f\u305b\u305f\u81ea\u7136\u306a\u8868\u73fe",
      "\u6280\u8853\u7528\u8a9e\u3084\u5c02\u9580\u7528\u8a9e\u306e\u9069\u5207\u306a\u51e6\u7406",
      "\u4e00\u8cab\u6027\u306e\u3042\u308b\u52d5\u753b\u5168\u4f53\u306e\u7ffb\u8a33",
      "\u5439\u304d\u66ff\u3048\u524d\u306b\u7ffb\u8a33\u3092\u78ba\u8a8d\u30fb\u8abf\u6574\u3067\u304d\u308b\u5185\u8535\u30b9\u30af\u30ea\u30d7\u30c8\u30a8\u30c7\u30a3\u30bf",
    ],
    workflowTitle: "\u7ffb\u8a33\u30ef\u30fc\u30af\u30d5\u30ed\u30fc",
    workflowSteps: [
      { title: "\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u307e\u305f\u306f\u30ea\u30f3\u30af", description: "\u30d5\u30a1\u30a4\u30eb\u3092\u30c9\u30e9\u30c3\u30b0\u307e\u305f\u306fYouTube\u3001Vimeo\u3001\u76f4\u63a5URL\u3092\u8cbc\u308a\u4ed8\u3051\u3002" },
      { title: "\u8a00\u8a9e\u3092\u9078\u629e", description: "1\u3064\u307e\u305f\u306f\u8907\u6570\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u8a00\u8a9e\u3092\u9078\u629e\u3002\u30d0\u30c3\u30c1\u7ffb\u8a33\u306b\u5bfe\u5fdc\u3002" },
      { title: "AI\u304c\u51e6\u7406", description: "\u6587\u5b57\u8d77\u3053\u3057\u3001\u7ffb\u8a33\u3001\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u304c\u4e26\u884c\u3057\u3066\u5b9f\u884c\u3002" },
      { title: "\u30a8\u30af\u30b9\u30dd\u30fc\u30c8", description: "\u5439\u304d\u66ff\u3048\u52d5\u753b\u3092MP4\u3067\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3001\u307e\u305f\u306f\u63a5\u7d9a\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u306b\u76f4\u63a5\u9001\u4fe1\u3002" },
    ],
    ctaTitle: "AI\u52d5\u753b\u7ffb\u8a33\u3067\u30b0\u30ed\u30fc\u30d0\u30eb\u306b",
    ctaSubtitle: "\u6700\u521d\u306e\u52d5\u753b\u3092\u7121\u6599\u3067\u7ffb\u8a33\u30025\u5206\u9593\u306e\u5439\u304d\u66ff\u3048\u4ed8\u304d\u3001\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u4e0d\u8981\u3002",
    ctaButton: "\u7121\u6599\u3067\u59cb\u3081\u308b",
    faqTitle: "\u3088\u304f\u3042\u308b\u8cea\u554f",
    relatedTitle: "\u95a2\u9023\u6a5f\u80fd",
    allFeatures: "\u5168\u3066\u306e\u6a5f\u80fd",
    faqs: [
      { question: "1\u3064\u306e\u52d5\u753b\u3092\u4f55\u8a00\u8a9e\u306b\u7ffb\u8a33\u3067\u304d\u307e\u3059\u304b\uff1f", answer: "\u5236\u9650\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u30d7\u30e9\u30f3\u304c\u30b5\u30dd\u30fc\u30c8\u3059\u308b\u6570\u3060\u3051\u30bf\u30fc\u30b2\u30c3\u30c8\u8a00\u8a9e\u3092\u9078\u629e\u3067\u304d\u307e\u3059\u3002\u5168\u3066\u306e\u7ffb\u8a33\u306f\u4e26\u884c\u3067\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002" },
      { question: "\u7ffb\u8a33\u306fAI\u3067\u3059\u304b\u3001\u4eba\u9593\u3067\u3059\u304b\uff1f", answer: "DubSync\u306f\u97f3\u58f0\u30b3\u30f3\u30c6\u30f3\u30c4\u5c02\u7528\u306b\u8a13\u7df4\u3055\u308c\u305f\u30ab\u30b9\u30bf\u30e0\u30cb\u30e5\u30fc\u30e9\u30eb\u7ffb\u8a33\u30e2\u30c7\u30eb\u3092\u4f7f\u7528\u3057\u3066\u3044\u307e\u3059\u3002\u5439\u304d\u66ff\u3048\u524d\u306b\u7ffb\u8a33\u6e08\u307f\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u7de8\u96c6\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002" },
      { question: "\u30ea\u30b9\u30c8\u306b\u306a\u3044\u8a00\u8a9e\u3092\u8ffd\u52a0\u3067\u304d\u307e\u3059\u304b\uff1f", answer: "\u65b0\u3057\u3044\u8a00\u8a9e\u3092\u5e38\u306b\u8ffd\u52a0\u3057\u3066\u3044\u307e\u3059\u3002\u5fc5\u8981\u306a\u8a00\u8a9e\u304c\u307e\u3060\u5229\u7528\u3067\u304d\u306a\u3044\u5834\u5408\u306f\u3001\u304a\u554f\u3044\u5408\u308f\u305b\u304f\u3060\u3055\u3044\u3002\u9700\u8981\u306b\u5fdc\u3058\u3066\u512a\u5148\u3057\u307e\u3059\u3002" },
      { question: "\u52d5\u753b\u7ffb\u8a33\u306b\u5b57\u5e55\u306f\u542b\u307e\u308c\u307e\u3059\u304b\uff1f", answer: "DubSync\u306f\u97f3\u58f0\u5439\u304d\u66ff\u3048\u306b\u7279\u5316\u3057\u3066\u304a\u308a\u3001\u5b57\u5e55\u306f\u542b\u307e\u308c\u307e\u305b\u3093\u3002\u305f\u3060\u3057\u3001\u7ffb\u8a33\u6e08\u307f\u30c8\u30e9\u30f3\u30b9\u30af\u30ea\u30d7\u30c8\u306fSRT\u5f62\u5f0f\u3067\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u53ef\u80fd\u3067\u3059\u3002" },
    ],
    breadcrumbFeatures: "\u6a5f\u80fd",
    breadcrumbVideoTranslation: "\u52d5\u753b\u7ffb\u8a33",
    regions: { europe: "\u30e8\u30fc\u30ed\u30c3\u30d1", asia: "\u30a2\u30b8\u30a2\u592a\u5e73\u6d0b", middleEast: "\u4e2d\u6771\u30fb\u30a2\u30d5\u30ea\u30ab" },
  },

  hi: {
    title: "AI वीडियो ट्रांसलेशन — 30+ भाषाओं में अनुवाद | DubSync",
    description:
      "30+ भाषाओं में वीडियो का अनुवाद और डबिंग करें।",
    badge: "Traducci\u00f3n de Video",
    h1: "Traduce videos a m\u00e1s de 30 idiomas",
    h1Highlight: "con IA",
    subtitle:
      "DubSync traduce, dobla y sincroniza los labios de tus videos en m\u00e1s de 30 idiomas. Llega a una audiencia global sin volver a grabar una sola palabra.",
    cta: "Traducir un video gratis",
    languagesTitle: "Idiomas disponibles",
    languagesMore: "M\u00e1s idiomas agregados regularmente.",
    languagesRequest: "Solicitar un idioma",
    qualityTitle: "Calidad de traducci\u00f3n",
    qualitySubtitle: "DubSync usa un modelo de traducci\u00f3n neuronal dise\u00f1ado espec\u00edficamente para contenido hablado. Va m\u00e1s all\u00e1 de la traducci\u00f3n palabra por palabra para capturar significado y tono.",
    qualityPoints: [
      "Traducci\u00f3n contextual que preserva el significado, no solo las palabras",
      "Expresiones idiom\u00e1ticas adaptadas a cada idioma y regi\u00f3n",
      "Manejo de terminolog\u00eda t\u00e9cnica y espec\u00edfica del dominio",
      "Traducci\u00f3n consistente en todo el video para un resultado coherente",
      "Editor de guiones integrado para revisar y ajustar traducciones antes del doblaje",
    ],
    workflowTitle: "Flujo de trabajo de traducci\u00f3n",
    workflowSteps: [
      { title: "Subir o enlazar", description: "Arrastra un archivo o pega una URL de YouTube, Vimeo o directa." },
      { title: "Seleccionar idiomas", description: "Elige uno o m\u00faltiples idiomas objetivo. Se admite traducci\u00f3n por lotes." },
      { title: "Procesamiento IA", description: "Transcripci\u00f3n, traducci\u00f3n, clonaci\u00f3n de voz y lip sync se ejecutan en paralelo." },
      { title: "Exportar", description: "Descarga videos doblados en MP4 o env\u00edalos directamente a tus plataformas conectadas." },
    ],
    ctaTitle: "Hazte global con traducci\u00f3n de video IA",
    ctaSubtitle: "Traduce tu primer video gratis. 5 minutos de doblaje incluidos, sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    faqs: [
      { question: "\u00bfA cu\u00e1ntos idiomas puedo traducir un solo video?", answer: "No hay l\u00edmite. Puedes seleccionar tantos idiomas como tu plan admita. Todas las traducciones se ejecutan en paralelo." },
      { question: "\u00bfLa traducci\u00f3n es IA o humana?", answer: "DubSync usa un modelo de traducci\u00f3n neuronal personalizado entrenado espec\u00edficamente para contenido hablado. Tambi\u00e9n puedes editar el guion traducido antes del doblaje." },
      { question: "\u00bfPuedo agregar idiomas que no est\u00e1n listados?", answer: "Constantemente agregamos nuevos idiomas. Si necesitas un idioma que a\u00fan no est\u00e1 disponible, cont\u00e1ctanos y lo priorizaremos seg\u00fan la demanda." },
      { question: "\u00bfLa traducci\u00f3n de video incluye subt\u00edtulos?", answer: "DubSync se enfoca en doblaje de audio, no subt\u00edtulos. Sin embargo, la transcripci\u00f3n traducida est\u00e1 disponible para descargar en formato SRT." },
    ],
    breadcrumbFeatures: "सुविधाएं",
    breadcrumbVideoTranslation: "Traducci\u00f3n de Video",
    regions: { europe: "Europa", asia: "Asia y Pac\u00edfico", middleEast: "Medio Oriente y \u00c1frica" },
  },
  ar: {
    title: "ترجمة الفيديو بالذكاء الاصطناعي — 30+ لغة | DubSync",
    description:
      "ترجمة ودبلجة الفيديوهات إلى أكثر من 30 لغة.",
    badge: "Traducci\u00f3n de Video",
    h1: "Traduce videos a m\u00e1s de 30 idiomas",
    h1Highlight: "con IA",
    subtitle:
      "DubSync traduce, dobla y sincroniza los labios de tus videos en m\u00e1s de 30 idiomas. Llega a una audiencia global sin volver a grabar una sola palabra.",
    cta: "Traducir un video gratis",
    languagesTitle: "Idiomas disponibles",
    languagesMore: "M\u00e1s idiomas agregados regularmente.",
    languagesRequest: "Solicitar un idioma",
    qualityTitle: "Calidad de traducci\u00f3n",
    qualitySubtitle: "DubSync usa un modelo de traducci\u00f3n neuronal dise\u00f1ado espec\u00edficamente para contenido hablado. Va m\u00e1s all\u00e1 de la traducci\u00f3n palabra por palabra para capturar significado y tono.",
    qualityPoints: [
      "Traducci\u00f3n contextual que preserva el significado, no solo las palabras",
      "Expresiones idiom\u00e1ticas adaptadas a cada idioma y regi\u00f3n",
      "Manejo de terminolog\u00eda t\u00e9cnica y espec\u00edfica del dominio",
      "Traducci\u00f3n consistente en todo el video para un resultado coherente",
      "Editor de guiones integrado para revisar y ajustar traducciones antes del doblaje",
    ],
    workflowTitle: "Flujo de trabajo de traducci\u00f3n",
    workflowSteps: [
      { title: "Subir o enlazar", description: "Arrastra un archivo o pega una URL de YouTube, Vimeo o directa." },
      { title: "Seleccionar idiomas", description: "Elige uno o m\u00faltiples idiomas objetivo. Se admite traducci\u00f3n por lotes." },
      { title: "Procesamiento IA", description: "Transcripci\u00f3n, traducci\u00f3n, clonaci\u00f3n de voz y lip sync se ejecutan en paralelo." },
      { title: "Exportar", description: "Descarga videos doblados en MP4 o env\u00edalos directamente a tus plataformas conectadas." },
    ],
    ctaTitle: "Hazte global con traducci\u00f3n de video IA",
    ctaSubtitle: "Traduce tu primer video gratis. 5 minutos de doblaje incluidos, sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    faqs: [
      { question: "\u00bfA cu\u00e1ntos idiomas puedo traducir un solo video?", answer: "No hay l\u00edmite. Puedes seleccionar tantos idiomas como tu plan admita. Todas las traducciones se ejecutan en paralelo." },
      { question: "\u00bfLa traducci\u00f3n es IA o humana?", answer: "DubSync usa un modelo de traducci\u00f3n neuronal personalizado entrenado espec\u00edficamente para contenido hablado. Tambi\u00e9n puedes editar el guion traducido antes del doblaje." },
      { question: "\u00bfPuedo agregar idiomas que no est\u00e1n listados?", answer: "Constantemente agregamos nuevos idiomas. Si necesitas un idioma que a\u00fan no est\u00e1 disponible, cont\u00e1ctanos y lo priorizaremos seg\u00fan la demanda." },
      { question: "\u00bfLa traducci\u00f3n de video incluye subt\u00edtulos?", answer: "DubSync se enfoca en doblaje de audio, no subt\u00edtulos. Sin embargo, la transcripci\u00f3n traducida est\u00e1 disponible para descargar en formato SRT." },
    ],
    breadcrumbFeatures: "الميزات",
    breadcrumbVideoTranslation: "Traducci\u00f3n de Video",
    regions: { europe: "Europa", asia: "Asia y Pac\u00edfico", middleEast: "Medio Oriente y \u00c1frica" },
  },
  id: {
    title: "Terjemahan Video AI — Terjemahkan ke 30+ Bahasa | DubSync",
    description:
      "Terjemahkan dan dubbing video ke 30+ bahasa.",
    badge: "Traducci\u00f3n de Video",
    h1: "Traduce videos a m\u00e1s de 30 idiomas",
    h1Highlight: "con IA",
    subtitle:
      "DubSync traduce, dobla y sincroniza los labios de tus videos en m\u00e1s de 30 idiomas. Llega a una audiencia global sin volver a grabar una sola palabra.",
    cta: "Traducir un video gratis",
    languagesTitle: "Idiomas disponibles",
    languagesMore: "M\u00e1s idiomas agregados regularmente.",
    languagesRequest: "Solicitar un idioma",
    qualityTitle: "Calidad de traducci\u00f3n",
    qualitySubtitle: "DubSync usa un modelo de traducci\u00f3n neuronal dise\u00f1ado espec\u00edficamente para contenido hablado. Va m\u00e1s all\u00e1 de la traducci\u00f3n palabra por palabra para capturar significado y tono.",
    qualityPoints: [
      "Traducci\u00f3n contextual que preserva el significado, no solo las palabras",
      "Expresiones idiom\u00e1ticas adaptadas a cada idioma y regi\u00f3n",
      "Manejo de terminolog\u00eda t\u00e9cnica y espec\u00edfica del dominio",
      "Traducci\u00f3n consistente en todo el video para un resultado coherente",
      "Editor de guiones integrado para revisar y ajustar traducciones antes del doblaje",
    ],
    workflowTitle: "Flujo de trabajo de traducci\u00f3n",
    workflowSteps: [
      { title: "Subir o enlazar", description: "Arrastra un archivo o pega una URL de YouTube, Vimeo o directa." },
      { title: "Seleccionar idiomas", description: "Elige uno o m\u00faltiples idiomas objetivo. Se admite traducci\u00f3n por lotes." },
      { title: "Procesamiento IA", description: "Transcripci\u00f3n, traducci\u00f3n, clonaci\u00f3n de voz y lip sync se ejecutan en paralelo." },
      { title: "Exportar", description: "Descarga videos doblados en MP4 o env\u00edalos directamente a tus plataformas conectadas." },
    ],
    ctaTitle: "Hazte global con traducci\u00f3n de video IA",
    ctaSubtitle: "Traduce tu primer video gratis. 5 minutos de doblaje incluidos, sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    faqs: [
      { question: "\u00bfA cu\u00e1ntos idiomas puedo traducir un solo video?", answer: "No hay l\u00edmite. Puedes seleccionar tantos idiomas como tu plan admita. Todas las traducciones se ejecutan en paralelo." },
      { question: "\u00bfLa traducci\u00f3n es IA o humana?", answer: "DubSync usa un modelo de traducci\u00f3n neuronal personalizado entrenado espec\u00edficamente para contenido hablado. Tambi\u00e9n puedes editar el guion traducido antes del doblaje." },
      { question: "\u00bfPuedo agregar idiomas que no est\u00e1n listados?", answer: "Constantemente agregamos nuevos idiomas. Si necesitas un idioma que a\u00fan no est\u00e1 disponible, cont\u00e1ctanos y lo priorizaremos seg\u00fan la demanda." },
      { question: "\u00bfLa traducci\u00f3n de video incluye subt\u00edtulos?", answer: "DubSync se enfoca en doblaje de audio, no subt\u00edtulos. Sin embargo, la transcripci\u00f3n traducida est\u00e1 disponible para descargar en formato SRT." },
    ],
    breadcrumbFeatures: "Fitur",
    breadcrumbVideoTranslation: "Traducci\u00f3n de Video",
    regions: { europe: "Europa", asia: "Asia y Pac\u00edfico", middleEast: "Medio Oriente y \u00c1frica" },
  },
  tr: {
    title: "AI Video Çeviri — 30+ Dile Otomatik Çeviri | DubSync",
    description:
      "Videoları 30+ dile çevirin ve dublajlayın.",
    badge: "Traducci\u00f3n de Video",
    h1: "Traduce videos a m\u00e1s de 30 idiomas",
    h1Highlight: "con IA",
    subtitle:
      "DubSync traduce, dobla y sincroniza los labios de tus videos en m\u00e1s de 30 idiomas. Llega a una audiencia global sin volver a grabar una sola palabra.",
    cta: "Traducir un video gratis",
    languagesTitle: "Idiomas disponibles",
    languagesMore: "M\u00e1s idiomas agregados regularmente.",
    languagesRequest: "Solicitar un idioma",
    qualityTitle: "Calidad de traducci\u00f3n",
    qualitySubtitle: "DubSync usa un modelo de traducci\u00f3n neuronal dise\u00f1ado espec\u00edficamente para contenido hablado. Va m\u00e1s all\u00e1 de la traducci\u00f3n palabra por palabra para capturar significado y tono.",
    qualityPoints: [
      "Traducci\u00f3n contextual que preserva el significado, no solo las palabras",
      "Expresiones idiom\u00e1ticas adaptadas a cada idioma y regi\u00f3n",
      "Manejo de terminolog\u00eda t\u00e9cnica y espec\u00edfica del dominio",
      "Traducci\u00f3n consistente en todo el video para un resultado coherente",
      "Editor de guiones integrado para revisar y ajustar traducciones antes del doblaje",
    ],
    workflowTitle: "Flujo de trabajo de traducci\u00f3n",
    workflowSteps: [
      { title: "Subir o enlazar", description: "Arrastra un archivo o pega una URL de YouTube, Vimeo o directa." },
      { title: "Seleccionar idiomas", description: "Elige uno o m\u00faltiples idiomas objetivo. Se admite traducci\u00f3n por lotes." },
      { title: "Procesamiento IA", description: "Transcripci\u00f3n, traducci\u00f3n, clonaci\u00f3n de voz y lip sync se ejecutan en paralelo." },
      { title: "Exportar", description: "Descarga videos doblados en MP4 o env\u00edalos directamente a tus plataformas conectadas." },
    ],
    ctaTitle: "Hazte global con traducci\u00f3n de video IA",
    ctaSubtitle: "Traduce tu primer video gratis. 5 minutos de doblaje incluidos, sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    faqs: [
      { question: "\u00bfA cu\u00e1ntos idiomas puedo traducir un solo video?", answer: "No hay l\u00edmite. Puedes seleccionar tantos idiomas como tu plan admita. Todas las traducciones se ejecutan en paralelo." },
      { question: "\u00bfLa traducci\u00f3n es IA o humana?", answer: "DubSync usa un modelo de traducci\u00f3n neuronal personalizado entrenado espec\u00edficamente para contenido hablado. Tambi\u00e9n puedes editar el guion traducido antes del doblaje." },
      { question: "\u00bfPuedo agregar idiomas que no est\u00e1n listados?", answer: "Constantemente agregamos nuevos idiomas. Si necesitas un idioma que a\u00fan no est\u00e1 disponible, cont\u00e1ctanos y lo priorizaremos seg\u00fan la demanda." },
      { question: "\u00bfLa traducci\u00f3n de video incluye subt\u00edtulos?", answer: "DubSync se enfoca en doblaje de audio, no subt\u00edtulos. Sin embargo, la transcripci\u00f3n traducida est\u00e1 disponible para descargar en formato SRT." },
    ],
    breadcrumbFeatures: "Özellikler",
    breadcrumbVideoTranslation: "Traducci\u00f3n de Video",
    regions: { europe: "Europa", asia: "Asia y Pac\u00edfico", middleEast: "Medio Oriente y \u00c1frica" },
  },
  ko: {
    title: "AI 비디오 번역 — 30개 이상 언어로 번역 | DubSync",
    description:
      "비디오를 30개 이상 언어로 번역하고 더빙하세요.",
    badge: "Traducci\u00f3n de Video",
    h1: "Traduce videos a m\u00e1s de 30 idiomas",
    h1Highlight: "con IA",
    subtitle:
      "DubSync traduce, dobla y sincroniza los labios de tus videos en m\u00e1s de 30 idiomas. Llega a una audiencia global sin volver a grabar una sola palabra.",
    cta: "Traducir un video gratis",
    languagesTitle: "Idiomas disponibles",
    languagesMore: "M\u00e1s idiomas agregados regularmente.",
    languagesRequest: "Solicitar un idioma",
    qualityTitle: "Calidad de traducci\u00f3n",
    qualitySubtitle: "DubSync usa un modelo de traducci\u00f3n neuronal dise\u00f1ado espec\u00edficamente para contenido hablado. Va m\u00e1s all\u00e1 de la traducci\u00f3n palabra por palabra para capturar significado y tono.",
    qualityPoints: [
      "Traducci\u00f3n contextual que preserva el significado, no solo las palabras",
      "Expresiones idiom\u00e1ticas adaptadas a cada idioma y regi\u00f3n",
      "Manejo de terminolog\u00eda t\u00e9cnica y espec\u00edfica del dominio",
      "Traducci\u00f3n consistente en todo el video para un resultado coherente",
      "Editor de guiones integrado para revisar y ajustar traducciones antes del doblaje",
    ],
    workflowTitle: "Flujo de trabajo de traducci\u00f3n",
    workflowSteps: [
      { title: "Subir o enlazar", description: "Arrastra un archivo o pega una URL de YouTube, Vimeo o directa." },
      { title: "Seleccionar idiomas", description: "Elige uno o m\u00faltiples idiomas objetivo. Se admite traducci\u00f3n por lotes." },
      { title: "Procesamiento IA", description: "Transcripci\u00f3n, traducci\u00f3n, clonaci\u00f3n de voz y lip sync se ejecutan en paralelo." },
      { title: "Exportar", description: "Descarga videos doblados en MP4 o env\u00edalos directamente a tus plataformas conectadas." },
    ],
    ctaTitle: "Hazte global con traducci\u00f3n de video IA",
    ctaSubtitle: "Traduce tu primer video gratis. 5 minutos de doblaje incluidos, sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    faqs: [
      { question: "\u00bfA cu\u00e1ntos idiomas puedo traducir un solo video?", answer: "No hay l\u00edmite. Puedes seleccionar tantos idiomas como tu plan admita. Todas las traducciones se ejecutan en paralelo." },
      { question: "\u00bfLa traducci\u00f3n es IA o humana?", answer: "DubSync usa un modelo de traducci\u00f3n neuronal personalizado entrenado espec\u00edficamente para contenido hablado. Tambi\u00e9n puedes editar el guion traducido antes del doblaje." },
      { question: "\u00bfPuedo agregar idiomas que no est\u00e1n listados?", answer: "Constantemente agregamos nuevos idiomas. Si necesitas un idioma que a\u00fan no est\u00e1 disponible, cont\u00e1ctanos y lo priorizaremos seg\u00fan la demanda." },
      { question: "\u00bfLa traducci\u00f3n de video incluye subt\u00edtulos?", answer: "DubSync se enfoca en doblaje de audio, no subt\u00edtulos. Sin embargo, la transcripci\u00f3n traducida est\u00e1 disponible para descargar en formato SRT." },
    ],
    breadcrumbFeatures: "기능",
    breadcrumbVideoTranslation: "Traducci\u00f3n de Video",
    regions: { europe: "Europa", asia: "Asia y Pac\u00edfico", middleEast: "Medio Oriente y \u00c1frica" },
  },
  zh: {
    title: "AI视频翻译 — 将视频翻译为30+种语言 | DubSync",
    description:
      "使用AI将视频翻译并配音为30多种语言。支持中文、西班牙语、法语、日语、印地语、阿拉伯语等。几分钟内获得录音棚品质。",
    badge: "视频翻译",
    h1: "将视频翻译为30多种语言",
    h1Highlight: "使用AI",
    subtitle:
      "DubSync将你的视频翻译、配音并同步口型，支持30多种语言。无需重新录制一个字即可触达全球受众。",
    cta: "免费翻译一个视频",
    languagesTitle: "可用语言",
    languagesMore: "更多语言持续添加中。",
    languagesRequest: "请求一种语言",
    qualityTitle: "翻译质量",
    qualitySubtitle: "DubSync使用专为口语内容设计的神经翻译模型。它超越逐字翻译，捕捉含义和语调。",
    qualityPoints: [
      "保留含义而非仅翻译词语的上下文翻译",
      "为每种语言和地区适配的惯用表达",
      "技术和领域专用术语处理",
      "整个视频一致翻译，确保连贯结果",
      "内置脚本编辑器，在配音前审查和调整翻译",
    ],
    workflowTitle: "翻译工作流",
    workflowSteps: [
      { title: "上传或粘贴链接", description: "拖放文件或粘贴YouTube、Vimeo或直接URL。" },
      { title: "选择语言", description: "选择一个或多个目标语言。支持批量翻译。" },
      { title: "AI处理", description: "转录、翻译、声音克隆和口型同步并行运行。" },
      { title: "导出", description: "下载MP4配音视频或直接发送到你连接的平台。" },
    ],
    ctaTitle: "用AI视频翻译走向全球",
    ctaSubtitle: "免费翻译你的第一个视频。含5分钟配音，无需信用卡。",
    ctaButton: "免费开始",
    faqTitle: "常见问题",
    relatedTitle: "相关功能",
    allFeatures: "所有功能",
    faqs: [
      { question: "一个视频可以翻译成多少种语言？", answer: "没有限制。你可以选择你的计划支持的任意多种语言。所有翻译并行运行。" },
      { question: "翻译是AI还是人工的？", answer: "DubSync使用专为口语内容训练的定制神经翻译模型。你也可以在配音前编辑翻译脚本。" },
      { question: "我可以添加未列出的语言吗？", answer: "我们持续添加新语言。如果你需要尚未提供的语言，请联系我们，我们将根据需求优先安排。" },
      { question: "视频翻译包含字幕吗？", answer: "DubSync专注于音频配音。不过，翻译后的转录可以SRT格式下载。" },
    ],
    breadcrumbFeatures: "功能",
    breadcrumbVideoTranslation: "视频翻译",
    regions: { europe: "欧洲", asia: "亚太地区", middleEast: "中东和非洲" },
  },};

type Lang = keyof typeof TRANSLATIONS;

const LANGUAGE_GROUPS = [
  {
    regionKey: "europe" as const,
    languages: [
      { name: "Spanish", flag: "\ud83c\uddea\ud83c\uddf8" }, { name: "French", flag: "\ud83c\uddeb\ud83c\uddf7" },
      { name: "German", flag: "\ud83c\udde9\ud83c\uddea" }, { name: "Italian", flag: "\ud83c\uddee\ud83c\uddf9" },
      { name: "Portuguese", flag: "\ud83c\udde7\ud83c\uddf7" }, { name: "Dutch", flag: "\ud83c\uddf3\ud83c\uddf1" },
      { name: "Polish", flag: "\ud83c\uddf5\ud83c\uddf1" }, { name: "Swedish", flag: "\ud83c\uddf8\ud83c\uddea" },
      { name: "Norwegian", flag: "\ud83c\uddf3\ud83c\uddf4" }, { name: "Finnish", flag: "\ud83c\uddeb\ud83c\uddee" },
      { name: "Danish", flag: "\ud83c\udde9\ud83c\uddf0" }, { name: "Czech", flag: "\ud83c\udde8\ud83c\uddff" },
      { name: "Romanian", flag: "\ud83c\uddf7\ud83c\uddf4" }, { name: "Greek", flag: "\ud83c\uddec\ud83c\uddf7" },
      { name: "Ukrainian", flag: "\ud83c\uddfa\ud83c\udde6" },
    ],
  },
  {
    regionKey: "asia" as const,
    languages: [
      { name: "Japanese", flag: "\ud83c\uddef\ud83c\uddf5" }, { name: "Korean", flag: "\ud83c\uddf0\ud83c\uddf7" },
      { name: "Mandarin", flag: "\ud83c\udde8\ud83c\uddf3" }, { name: "Hindi", flag: "\ud83c\uddee\ud83c\uddf3" },
      { name: "Indonesian", flag: "\ud83c\uddee\ud83c\udde9" }, { name: "Thai", flag: "\ud83c\uddf9\ud83c\udded" },
      { name: "Vietnamese", flag: "\ud83c\uddfb\ud83c\uddf3" }, { name: "Tamil", flag: "\ud83c\uddee\ud83c\uddf3" },
      { name: "Filipino", flag: "\ud83c\uddf5\ud83c\udded" }, { name: "Malay", flag: "\ud83c\uddf2\ud83c\uddfe" },
    ],
  },
  {
    regionKey: "middleEast" as const,
    languages: [
      { name: "Arabic", flag: "\ud83c\uddf8\ud83c\udde6" }, { name: "Turkish", flag: "\ud83c\uddf9\ud83c\uddf7" },
      { name: "Hebrew", flag: "\ud83c\uddee\ud83c\uddf1" }, { name: "Swahili", flag: "\ud83c\uddf0\ud83c\uddea" },
    ],
  },
];

const WORKFLOW_ICONS = [Upload, Languages, Sparkles, Download];

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
        ? "https://dubsync.app/features/video-translation"
        : `https://dubsync.app/${l}/features/video-translation`;
  }
  langAlternates["x-default"] = "https://dubsync.app/features/video-translation";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/features/video-translation`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/features/video-translation`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedVideoTranslationPage({
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
          { name: t.breadcrumbFeatures, url: `https://dubsync.app/${lang}/features` },
          { name: t.breadcrumbVideoTranslation, url: `https://dubsync.app/${lang}/features/video-translation` },
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
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400">
            <Globe className="h-3.5 w-3.5" /> {t.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t.h1}{" "}
            <span className="gradient-text">{t.h1Highlight}</span>
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

        {/* Supported languages */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.languagesTitle}
          </h2>
          <div className="space-y-8">
            {LANGUAGE_GROUPS.map((group) => (
              <div key={group.regionKey}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                  {t.regions[group.regionKey]}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {group.languages.map((l) => (
                    <span
                      key={l.name}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/30 px-4 py-2 text-sm text-zinc-300"
                    >
                      <span aria-hidden="true">{l.flag}</span> {l.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">
            {t.languagesMore}{" "}
            <Link href="/contact" className="text-pink-400 hover:underline">
              {t.languagesRequest}
            </Link>
          </p>
        </section>

        {/* Translation quality */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            {t.qualityTitle}
          </h2>
          <p className="text-center text-zinc-400 mb-10 max-w-xl mx-auto">
            {t.qualitySubtitle}
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-8">
            <ul className="space-y-4">
              {t.qualityPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
                  <span className="text-zinc-300 text-sm leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.workflowTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.workflowSteps.map((step, i) => {
              const Icon = WORKFLOW_ICONS[i];
              return (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <Icon className="h-6 w-6 text-pink-400" />
                  </div>
                  <span className="text-xs font-mono text-pink-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              {t.ctaSubtitle}
            </p>
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-8 py-3 text-sm font-medium"
            >
              {t.ctaButton}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
            {t.faqTitle}
          </h2>
          <div className="space-y-4">
            {t.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-slate-800/30"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-white">
                  {faq.question}
                  <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-4 text-sm text-zinc-400 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related features */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">
            {t.relatedTitle}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/features/voice-cloning`}
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Voice Cloning
            </Link>
            <Link
              href={`/${lang}/features/lip-sync`}
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Lip Sync
            </Link>
            <Link
              href={`/${lang}/features/api`}
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              API
            </Link>
            <Link
              href={`/${lang}/features`}
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              {t.allFeatures}
            </Link>
          </div>
        </section>
      </main>

    </>
  );
}
