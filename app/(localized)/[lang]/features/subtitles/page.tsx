import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Captions,
  Subtitles,
  Type,
  Palette,
  AlignCenter,
  ArrowRight,
  MonitorPlay,
  Share2,
  GraduationCap,
  Building2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

/**
 * Localized /{lang}/features/subtitles. Content per locale is
 * stored inline in the TRANSLATIONS object below — same pattern
 * as the other localized /features/* pages. Shared render logic
 * reads `t` (the locale block) and renders the page structure.
 */
const TRANSLATIONS = {
  es: {
    title: "Subtítulos IA para Video — Genera en 30+ Idiomas",
    description:
      "Genera subtítulos IA sincronizados con el audio doblado. Incrustados o exportación SRT/VTT. Incluido en todos los planes.",
    badge: "Subtítulos IA",
    h1: "Subtítulos IA —",
    h1Highlight: "sincronizados con cada doblaje",
    subtitle:
      "DubSync genera automáticamente subtítulos sincronizados para cada video doblado, transcritos directamente del audio doblado — no del transcript original. Sincronización perfecta, incrustados o exportación SRT, en cada idioma.",
    ctaPrimary: "Probar Subtítulos IA Gratis",
    ctaPricing: "Ver precios",
    stats: { languages: "30+ idiomas", formats: "SRT + VTT", plans: "Todos los planes" },
    howTitle: "Cómo funcionan los subtítulos IA",
    burnedVsSrtTitle: "Incrustados vs SRT — elige el formato correcto",
    burnedVsSrtSubtitle:
      "Ambos se envían con cada doblaje. Elige el que se adapte a cada canal — o exporta los dos.",
    customTitle: "Personaliza tus subtítulos",
    customSubtitle:
      "Valores predeterminados sensatos de fábrica. Control total cuando lo necesites, sin el agobio de un editor de video completo.",
    useCasesTitle: "Subtítulos para cada plataforma",
    languagesTitle: "Subtítulos en 30+ idiomas",
    languagesBody:
      "Cada idioma al que DubSync dobla obtiene soporte completo de subtítulos, sin caída de calidad para escrituras no latinas. Los idiomas de derecha a izquierda (árabe, hebreo) se renderizan con formación RTL correcta. Los idiomas CJK (chino, japonés, coreano) usan conteo por carácter.",
    ctaTitle: "Envía videos completamente subtitulados a cada plataforma",
    ctaSubtitle: "Comienza con 5 minutos gratis de doblaje — subtítulos incluidos. Sin tarjeta de crédito.",
    ctaButton: "Probar Subtítulos IA Gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    breadcrumbFeatures: "Funciones",
    breadcrumbSubtitles: "Subtítulos IA",
    allFeatures: "Todas las funciones",
    steps: [
      { title: "Dobla tu video", description: "Sube tu video, elige idiomas y ejecuta la canalización de doblaje. Los subtítulos se generan automáticamente junto con cada doblaje." },
      { title: "La IA transcribe el audio doblado", description: "Después del doblaje, el reconocimiento de voz se ejecuta sobre el audio doblado — no sobre el transcript original. El timing coincide con la voz que el espectador escucha." },
      { title: "Timing y segmentación inteligentes", description: "Los transcripts se dividen en cues amigables: máx 2 líneas, 42 caracteres/línea, 1–7s de visualización, alineados con pausas del habla." },
      { title: "Elige tu salida", description: "Incrustados para feeds sociales o archivos SRT/VTT para YouTube y LMS. Exporta ambos desde el mismo doblaje." },
    ],
    customization: [
      { title: "Familia y tamaño de fuente", description: "Sans-serif, serif o monospace. Escala automática a la resolución del video." },
      { title: "Colores y fondos", description: "Color de texto, ancho de contorno y fondo con control de opacidad." },
      { title: "Posición y alineación", description: "Abajo (por defecto), arriba o un offset Y personalizado." },
      { title: "Controles por idioma", description: "Los subtítulos pueden coincidir con el audio doblado o diferir. RTL (árabe, hebreo) y CJK (chino, japonés, coreano) totalmente compatibles." },
    ],
    useCases: [
      { title: "Creadores de YouTube", description: "Sube el video doblado + SRT como pista de subtítulos. YouTube mapea automáticamente al idioma del viewer y Google indexa el texto para SEO.", href: "platforms/youtube" },
      { title: "Redes sociales (TikTok, Instagram, Facebook)", description: "Los subtítulos incrustados son esenciales — la mayoría mira en silencio. Las captions estilizadas aumentan el engagement hasta un 40%.", href: "platforms/tiktok" },
      { title: "E-learning", description: "Cumple con accesibilidad en Udemy, Coursera, Teachable y Thinkific. Exporta SRT por idioma junto con el audio doblado.", href: "platforms/elearning" },
      { title: "Capacitación corporativa", description: "Onboarding HR, seguridad, cumplimiento con captions multilingües. Incrustados para portales internos, SRT para LMS externo.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "El espectador puede activar/desactivar", burned: false, srt: true },
      { feature: "Funciona en todas las plataformas", burned: true, srt: "partial" },
      { feature: "Ideal para redes sociales", burned: true, srt: false },
      { feature: "Ideal para YouTube", burned: false, srt: true },
      { feature: "Editable después de exportar", burned: false, srt: true },
      { feature: "Beneficio SEO", burned: false, srt: true },
      { feature: "Impacto en tamaño", burned: "Video mayor", srt: "Archivo pequeño" },
    ],
    faqs: [
      { question: "¿Se generan del audio doblado o se traducen del original?", answer: "Del audio doblado. La IA transcribe lo que el espectador escucha, asegurando sincronización perfecta." },
      { question: "¿Puedo exportar SRT para YouTube?", answer: "Sí. Exporta SRT o VTT y súbelos como subtítulos. Google indexa el texto para SEO." },
      { question: "¿Incluidos en el plan gratuito?", answer: "Sí. Los subtítulos IA son parte del proceso de doblaje sin costo adicional en todos los planes." },
      { question: "¿Puedo personalizar la apariencia?", answer: "Sí. Fuente, tamaño, color, posición y estilo de fondo. Vista previa en tiempo real." },
      { question: "¿Soportan idiomas de derecha a izquierda?", answer: "Sí. Árabe, hebreo y otros idiomas RTL totalmente compatibles." },
    ],
  },
  pt: {
    title: "Legendas IA para Vídeo — Gere em 30+ Idiomas",
    description:
      "Gere legendas IA sincronizadas com o áudio dublado. Incorporadas ou exportação SRT/VTT. Incluído em todos os planos.",
    badge: "Legendas IA",
    h1: "Legendas IA —",
    h1Highlight: "sincronizadas com cada dublagem",
    subtitle:
      "O DubSync gera automaticamente legendas sincronizadas para cada vídeo dublado, transcritas diretamente do áudio dublado — não da transcrição original. Sincronização perfeita, incorporadas ou exportação SRT, em cada idioma.",
    ctaPrimary: "Experimentar Legendas IA Grátis",
    ctaPricing: "Ver preços",
    stats: { languages: "30+ idiomas", formats: "SRT + VTT", plans: "Todos os planos" },
    howTitle: "Como funcionam as legendas IA",
    burnedVsSrtTitle: "Incorporadas vs SRT — escolha o formato certo",
    burnedVsSrtSubtitle:
      "Ambos vêm com cada dublagem. Escolha o que se adapta a cada canal — ou exporte os dois.",
    customTitle: "Personalize suas legendas",
    customSubtitle:
      "Padrões sensatos de fábrica. Controle total quando precisar, sem o exagero de um editor de vídeo completo.",
    useCasesTitle: "Legendas para cada plataforma",
    languagesTitle: "Legendas em 30+ idiomas",
    languagesBody:
      "Cada idioma que o DubSync dubla tem suporte completo de legendas, sem queda de qualidade para escritas não-latinas. Idiomas da direita para a esquerda (árabe, hebraico) renderizam com formação RTL correta. Idiomas CJK (chinês, japonês, coreano) usam contagem por caractere.",
    ctaTitle: "Envie vídeos totalmente legendados para cada plataforma",
    ctaSubtitle: "Comece com 5 minutos grátis de dublagem — legendas incluídas. Sem cartão de crédito.",
    ctaButton: "Experimentar Legendas IA Grátis",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Recursos relacionados",
    breadcrumbFeatures: "Recursos",
    breadcrumbSubtitles: "Legendas IA",
    allFeatures: "Todos os recursos",
    steps: [
      { title: "Duble seu vídeo", description: "Envie seu vídeo, escolha idiomas e execute o pipeline de dublagem. As legendas são geradas automaticamente junto com cada dublagem." },
      { title: "A IA transcreve o áudio dublado", description: "Após a dublagem, o reconhecimento de voz é executado no áudio dublado — não na transcrição original. O timing corresponde à voz que o espectador ouve." },
      { title: "Timing e segmentação inteligentes", description: "Transcrições são divididas em cues amigáveis: máx 2 linhas, 42 caracteres/linha, 1–7s de exibição, alinhadas com pausas da fala." },
      { title: "Escolha sua saída", description: "Incorporadas para feeds sociais ou arquivos SRT/VTT para YouTube e LMS. Exporte ambos da mesma dublagem." },
    ],
    customization: [
      { title: "Família e tamanho da fonte", description: "Sans-serif, serif ou monospace. Escala automática para resolução do vídeo." },
      { title: "Cores e fundos", description: "Cor do texto, largura do contorno e fundo com controle de opacidade." },
      { title: "Posição e alinhamento", description: "Embaixo (padrão), em cima ou offset Y personalizado." },
      { title: "Controles por idioma", description: "As legendas podem corresponder ao áudio dublado ou diferir. RTL (árabe, hebraico) e CJK (chinês, japonês, coreano) totalmente suportados." },
    ],
    useCases: [
      { title: "Criadores do YouTube", description: "Envie o vídeo dublado + SRT como faixa de legenda. O YouTube mapeia automaticamente para o idioma do viewer e o Google indexa o texto para SEO.", href: "platforms/youtube" },
      { title: "Redes sociais (TikTok, Instagram, Facebook)", description: "Legendas incorporadas são essenciais — a maioria assiste em silêncio. Captions estilizadas aumentam o engajamento em até 40%.", href: "platforms/tiktok" },
      { title: "E-learning", description: "Cumpra acessibilidade no Udemy, Coursera, Teachable e Thinkific. Exporte SRT por idioma junto com o áudio dublado.", href: "platforms/elearning" },
      { title: "Treinamento corporativo", description: "Onboarding RH, segurança, conformidade com captions multilíngues. Incorporadas para portais internos, SRT para LMS externo.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "Espectador pode ativar/desativar", burned: false, srt: true },
      { feature: "Funciona em todas as plataformas", burned: true, srt: "partial" },
      { feature: "Ideal para redes sociais", burned: true, srt: false },
      { feature: "Ideal para YouTube", burned: false, srt: true },
      { feature: "Editável após exportação", burned: false, srt: true },
      { feature: "Benefício SEO", burned: false, srt: true },
      { feature: "Impacto no tamanho", burned: "Vídeo maior", srt: "Arquivo pequeno" },
    ],
    faqs: [
      { question: "São geradas do áudio dublado ou traduzidas do original?", answer: "Do áudio dublado. A IA transcreve o que o espectador ouve, garantindo sincronização perfeita." },
      { question: "Posso exportar SRT para o YouTube?", answer: "Sim. Exporte SRT ou VTT e envie como legendas. O Google indexa o texto para SEO." },
      { question: "Incluídas no plano gratuito?", answer: "Sim. As legendas IA são parte do processo de dublagem sem custo adicional em todos os planos." },
      { question: "Posso personalizar a aparência?", answer: "Sim. Fonte, tamanho, cor, posição e estilo de fundo. Visualização em tempo real." },
      { question: "Suportam idiomas da direita para a esquerda?", answer: "Sim. Árabe, hebraico e outros idiomas RTL totalmente suportados." },
    ],
  },
  de: {
    title: "KI-Untertitel für Video — In 30+ Sprachen Generieren",
    description:
      "KI-Untertitel synchron zum synchronisierten Audio. Eingebrannt oder SRT/VTT-Export. In allen Plänen enthalten.",
    badge: "KI-Untertitel",
    h1: "KI-Untertitel —",
    h1Highlight: "synchron zu jeder Synchronisation",
    subtitle:
      "DubSync generiert automatisch synchronisierte Untertitel für jedes synchronisierte Video, direkt aus dem synchronisierten Audio transkribiert — nicht aus dem Original-Transkript. Perfekte Synchronisation, eingebrannt oder SRT-Export, in jeder Sprache.",
    ctaPrimary: "KI-Untertitel Kostenlos Testen",
    ctaPricing: "Preise ansehen",
    stats: { languages: "30+ Sprachen", formats: "SRT + VTT", plans: "Alle Pläne" },
    howTitle: "Wie KI-Untertitel funktionieren",
    burnedVsSrtTitle: "Eingebrannt vs SRT — das richtige Format wählen",
    burnedVsSrtSubtitle:
      "Beide werden mit jeder Synchronisation geliefert. Wähle das passende für jeden Kanal — oder exportiere beide.",
    customTitle: "Gestalte deine Untertitel",
    customSubtitle:
      "Sinnvolle Defaults von Anfang an. Volle Kontrolle, wenn du sie brauchst, ohne die Überforderung eines vollen Video-Editors.",
    useCasesTitle: "Untertitel für jede Plattform",
    languagesTitle: "Untertitel in 30+ Sprachen",
    languagesBody:
      "Jede Sprache, in die DubSync synchronisiert, erhält volle Untertitelunterstützung, ohne Qualitätseinbußen für nicht-lateinische Schriften. Rechts-nach-links-Sprachen (Arabisch, Hebräisch) werden mit korrekter RTL-Formung gerendert. CJK-Sprachen (Chinesisch, Japanisch, Koreanisch) verwenden zeichenbasierte Zählung.",
    ctaTitle: "Liefere vollständig untertitelte Videos an jede Plattform",
    ctaSubtitle: "Starte mit 5 kostenlosen Minuten Synchronisation — Untertitel inklusive. Keine Kreditkarte erforderlich.",
    ctaButton: "KI-Untertitel Kostenlos Testen",
    faqTitle: "Häufig gestellte Fragen",
    relatedTitle: "Verwandte Funktionen",
    breadcrumbFeatures: "Funktionen",
    breadcrumbSubtitles: "KI-Untertitel",
    allFeatures: "Alle Funktionen",
    steps: [
      { title: "Video wie gewohnt synchronisieren", description: "Video hochladen, Zielsprachen wählen und Synchronisations-Pipeline starten. Untertitel werden automatisch neben jeder Synchronisation generiert." },
      { title: "KI transkribiert synchronisiertes Audio", description: "Nach der Synchronisation läuft Speech-to-Text auf der synchronisierten Audiospur — nicht auf dem Originaltranskript. Das Timing passt zur Stimme, die der Zuschauer hört." },
      { title: "Intelligentes Timing und Segmentierung", description: "Transkripte werden in untertitelfreundliche Cues geteilt: max 2 Zeilen, 42 Zeichen/Zeile, 1–7s Anzeige, ausgerichtet an Sprachpausen." },
      { title: "Ausgabeformat wählen", description: "Eingebrannt für soziale Feeds oder SRT/VTT-Dateien für YouTube und LMS. Exportiere beide aus derselben Synchronisation." },
    ],
    customization: [
      { title: "Schriftfamilie & Größe", description: "Sans-serif, serif oder monospace. Auto-Skalierung zur Videoauflösung." },
      { title: "Farben & Hintergründe", description: "Textfarbe, Konturbreite und Hintergrundplate mit Deckkraftsteuerung." },
      { title: "Position & Ausrichtung", description: "Unten (Standard), oben oder ein benutzerdefinierter Y-Offset." },
      { title: "Sprachspezifische Steuerelemente", description: "Untertitel können dem synchronisierten Audio entsprechen oder davon abweichen. RTL (Arabisch, Hebräisch) und CJK (Chinesisch, Japanisch, Koreanisch) vollständig unterstützt." },
    ],
    useCases: [
      { title: "YouTube-Ersteller", description: "Lade synchronisiertes Video + SRT als Closed-Caption-Spur hoch. YouTube ordnet Untertitel automatisch der Sprache des Zuschauers zu und Google indiziert den Text für SEO.", href: "platforms/youtube" },
      { title: "Soziale Medien (TikTok, Instagram, Facebook)", description: "Eingebrannte Untertitel sind unverzichtbar — die meisten sehen stumm. Gestaltete Captions können Engagement um bis zu 40% erhöhen.", href: "platforms/tiktok" },
      { title: "E-Learning", description: "Erfülle Barrierefreiheitskonformität auf Udemy, Coursera, Teachable und Thinkific. Exportiere SRT pro Sprache.", href: "platforms/elearning" },
      { title: "Unternehmensschulungen", description: "HR-Onboarding, Sicherheit, Compliance mit mehrsprachigen Captions. Eingebrannt für interne Portale, SRT für externes LMS.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "Zuschauer kann ein-/ausschalten", burned: false, srt: true },
      { feature: "Funktioniert auf allen Plattformen", burned: true, srt: "partial" },
      { feature: "Ideal für Social Media", burned: true, srt: false },
      { feature: "Ideal für YouTube", burned: false, srt: true },
      { feature: "Nach Export bearbeitbar", burned: false, srt: true },
      { feature: "SEO-Vorteil", burned: false, srt: true },
      { feature: "Auswirkung auf Dateigröße", burned: "Größeres Video", srt: "Kleine Datei" },
    ],
    faqs: [
      { question: "Aus synchronisiertem Audio generiert oder vom Original übersetzt?", answer: "Aus dem synchronisierten Audio. Die KI transkribiert, was der Zuschauer hört — perfekte Synchronisation." },
      { question: "SRT-Export für YouTube?", answer: "Ja. Exportiere SRT oder VTT und lade als Untertitel hoch. Google indiziert den Text für SEO." },
      { question: "Im kostenlosen Plan enthalten?", answer: "Ja. KI-Untertitel sind Teil des Synchronisierungsprozesses ohne zusätzliche Kosten." },
      { question: "Kann ich das Erscheinungsbild anpassen?", answer: "Ja. Schrift, Größe, Farbe, Position und Hintergrundstil. Echtzeit-Vorschau." },
      { question: "RTL-Sprachen unterstützt?", answer: "Ja. Arabisch, Hebräisch und andere RTL-Sprachen vollständig unterstützt." },
    ],
  },
  fr: {
    title: "Sous-titres IA pour Vidéo — Générez en 30+ Langues",
    description:
      "Sous-titres IA synchronisés avec l'audio doublé. Incrustés ou export SRT/VTT. Inclus dans tous les plans.",
    badge: "Sous-titres IA",
    h1: "Sous-titres IA —",
    h1Highlight: "synchronisés avec chaque doublage",
    subtitle:
      "DubSync génère automatiquement des sous-titres synchronisés pour chaque vidéo doublée, transcrits directement de l'audio doublé — pas de la transcription originale. Synchronisation parfaite, incrustés ou export SRT, dans chaque langue.",
    ctaPrimary: "Essayez les Sous-titres IA Gratuitement",
    ctaPricing: "Voir les tarifs",
    stats: { languages: "30+ langues", formats: "SRT + VTT", plans: "Tous les plans" },
    howTitle: "Comment fonctionnent les sous-titres IA",
    burnedVsSrtTitle: "Incrustés vs SRT — choisissez le bon format",
    burnedVsSrtSubtitle:
      "Les deux sont livrés avec chaque doublage. Choisissez celui qui convient à chaque canal — ou exportez les deux.",
    customTitle: "Personnalisez vos sous-titres",
    customSubtitle:
      "Valeurs par défaut sensées dès le départ. Contrôle total quand vous en avez besoin, sans la complexité d'un éditeur vidéo complet.",
    useCasesTitle: "Sous-titres pour chaque plateforme",
    languagesTitle: "Sous-titres en 30+ langues",
    languagesBody:
      "Chaque langue dans laquelle DubSync double bénéficie d'un support complet des sous-titres, sans baisse de qualité pour les écritures non latines. Les langues de droite à gauche (arabe, hébreu) sont rendues avec un formatage RTL correct. Les langues CJK (chinois, japonais, coréen) utilisent le comptage par caractère.",
    ctaTitle: "Livrez des vidéos entièrement sous-titrées à chaque plateforme",
    ctaSubtitle: "Commencez avec 5 minutes gratuites de doublage — sous-titres inclus. Sans carte de crédit.",
    ctaButton: "Essayez les Sous-titres IA Gratuitement",
    faqTitle: "Questions fréquentes",
    relatedTitle: "Fonctionnalités associées",
    breadcrumbFeatures: "Fonctionnalités",
    breadcrumbSubtitles: "Sous-titres IA",
    allFeatures: "Toutes les fonctionnalités",
    steps: [
      { title: "Doublez votre vidéo", description: "Téléchargez votre vidéo, choisissez les langues cibles et lancez le pipeline de doublage. Les sous-titres sont générés automatiquement avec chaque doublage." },
      { title: "L'IA transcrit l'audio doublé", description: "Après le doublage, la reconnaissance vocale s'exécute sur la piste audio doublée — pas sur la transcription originale. Le timing correspond à la voix que le spectateur entend." },
      { title: "Timing et segmentation intelligents", description: "Les transcriptions sont divisées en cues adaptés aux sous-titres : max 2 lignes, 42 caractères/ligne, 1–7s d'affichage, alignés aux pauses de discours." },
      { title: "Choisissez votre sortie", description: "Incrustés pour les flux sociaux ou fichiers SRT/VTT pour YouTube et LMS. Exportez les deux à partir du même doublage." },
    ],
    customization: [
      { title: "Famille et taille de police", description: "Sans-serif, serif ou monospace. Mise à l'échelle automatique à la résolution vidéo." },
      { title: "Couleurs et arrière-plans", description: "Couleur du texte, largeur du contour et fond avec contrôle d'opacité." },
      { title: "Position et alignement", description: "Bas (par défaut), haut ou un décalage Y personnalisé." },
      { title: "Contrôles par langue", description: "Les sous-titres peuvent correspondre à l'audio doublé ou en différer. RTL (arabe, hébreu) et CJK (chinois, japonais, coréen) entièrement pris en charge." },
    ],
    useCases: [
      { title: "Créateurs YouTube", description: "Téléchargez la vidéo doublée + SRT comme piste de sous-titres fermés. YouTube mappe automatiquement à la langue du spectateur et Google indexe le texte pour le SEO.", href: "platforms/youtube" },
      { title: "Réseaux sociaux (TikTok, Instagram, Facebook)", description: "Les sous-titres incrustés sont essentiels — la plupart des spectateurs regardent en silence. Les captions stylisées augmentent l'engagement jusqu'à 40%.", href: "platforms/tiktok" },
      { title: "E-learning", description: "Conformité d'accessibilité sur Udemy, Coursera, Teachable et Thinkific. Exportez SRT par langue avec l'audio doublé.", href: "platforms/elearning" },
      { title: "Formation en entreprise", description: "Onboarding RH, sécurité, conformité avec captions multilingues. Incrustés pour portails internes, SRT pour LMS externe.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "Le spectateur peut activer/désactiver", burned: false, srt: true },
      { feature: "Fonctionne sur toutes les plateformes", burned: true, srt: "partial" },
      { feature: "Idéal pour les réseaux sociaux", burned: true, srt: false },
      { feature: "Idéal pour YouTube", burned: false, srt: true },
      { feature: "Modifiable après export", burned: false, srt: true },
      { feature: "Avantage SEO", burned: false, srt: true },
      { feature: "Impact sur la taille du fichier", burned: "Vidéo plus grande", srt: "Petit fichier" },
    ],
    faqs: [
      { question: "Générés à partir de l'audio doublé ou traduits de l'original ?", answer: "De l'audio doublé. L'IA transcrit ce que le spectateur entend, assurant une synchronisation parfaite." },
      { question: "Export SRT pour YouTube ?", answer: "Oui. Exportez SRT ou VTT et téléchargez comme sous-titres. Google indexe le texte pour le SEO." },
      { question: "Inclus dans le plan gratuit ?", answer: "Oui. Les sous-titres IA font partie du processus de doublage sans coût supplémentaire." },
      { question: "Puis-je personnaliser l'apparence ?", answer: "Oui. Police, taille, couleur, position et style de fond. Aperçu en temps réel." },
      { question: "Langues droite-à-gauche supportées ?", answer: "Oui. Arabe, hébreu et autres langues RTL entièrement pris en charge." },
    ],
  },
  ja: {
    title: "AI動画字幕 — 30以上の言語で自動生成",
    description:
      "吹き替え音声に同期したAI字幕を生成。焼き付けまたはSRT/VTTエクスポート。全プランに含まれます。",
    badge: "AI字幕",
    h1: "AI字幕 —",
    h1Highlight: "すべての吹き替えに同期",
    subtitle:
      "DubSyncは、すべての吹き替え動画に同期された字幕を自動生成します。元の文字起こしではなく、吹き替え音声から直接文字起こしされます。完全な同期、焼き付けまたはSRTエクスポート、あらゆる言語で。",
    ctaPrimary: "AI字幕を無料でお試し",
    ctaPricing: "料金を見る",
    stats: { languages: "30以上の言語", formats: "SRT + VTT", plans: "全プラン" },
    howTitle: "AI字幕の仕組み",
    burnedVsSrtTitle: "焼き付け vs SRT — 最適なフォーマットを選択",
    burnedVsSrtSubtitle:
      "両方が各吹き替えで提供されます。各チャネルに適したものを選択するか、両方をエクスポートします。",
    customTitle: "字幕をカスタマイズ",
    customSubtitle:
      "最初から適切なデフォルト。必要なときに完全な制御、フル動画エディターの複雑さなしで。",
    useCasesTitle: "すべてのプラットフォーム向け字幕",
    languagesTitle: "30以上の言語の字幕",
    languagesBody:
      "DubSyncが吹き替えるすべての言語は、非ラテン文字の品質低下なしに、完全な字幕サポートを取得します。右から左へ書く言語（アラビア語、ヘブライ語）は正しいRTL形成でレンダリングされます。CJK言語（中国語、日本語、韓国語）は文字ごとのカウントを使用します。",
    ctaTitle: "すべてのプラットフォームに完全字幕付き動画を配信",
    ctaSubtitle: "5分間の無料吹き替えから始めましょう — 字幕含む。クレジットカード不要。",
    ctaButton: "AI字幕を無料でお試し",
    faqTitle: "よくある質問",
    relatedTitle: "関連機能",
    breadcrumbFeatures: "機能",
    breadcrumbSubtitles: "AI字幕",
    allFeatures: "すべての機能",
    steps: [
      { title: "動画を吹き替え", description: "動画をアップロードし、ターゲット言語を選び、吹き替えパイプラインを実行します。字幕は各吹き替えと一緒に自動生成されます。" },
      { title: "AIが吹き替え音声を文字起こし", description: "吹き替え後、音声認識が吹き替え音声トラックで実行されます — 元の文字起こしではありません。タイミングは視聴者が聞く声と一致します。" },
      { title: "スマートなタイミングとセグメント分割", description: "文字起こしは字幕に適したキューに分割されます：最大2行、1行42文字、1–7秒表示、音声の一時停止と文の境界に合わせて調整。" },
      { title: "出力形式を選択", description: "ソーシャルフィード向け焼き付け、またはYouTubeとLMS向けSRT/VTTファイル。同じ吹き替えから両方をエクスポートします。" },
    ],
    customization: [
      { title: "フォントファミリーとサイズ", description: "Sans-serif、serif、またはmonospace。動画解像度への自動スケール。" },
      { title: "色と背景", description: "テキストの色、ストローク幅、不透明度制御付きの背景プレート。" },
      { title: "位置と配置", description: "下（デフォルト）、上、またはカスタムYオフセット。" },
      { title: "言語ごとのコントロール", description: "字幕は吹き替え音声と一致するか、異なる場合があります。RTL（アラビア語、ヘブライ語）とCJK（中国語、日本語、韓国語）に完全対応。" },
    ],
    useCases: [
      { title: "YouTubeクリエイター", description: "吹き替え動画 + SRTをクローズドキャプショントラックとしてアップロード。YouTubeは視聴者の言語に自動マッピングし、GoogleはSEO用にテキストをインデックス化します。", href: "platforms/youtube" },
      { title: "ソーシャルメディア（TikTok、Instagram、Facebook）", description: "焼き付け字幕は必須 — ほとんどの視聴者はミュートで視聴します。スタイル付きキャプションはエンゲージメントを最大40%向上させます。", href: "platforms/tiktok" },
      { title: "Eラーニング", description: "Udemy、Coursera、Teachable、Thinkificでアクセシビリティ準拠を満たします。吹き替え音声と一緒に言語ごとにSRTをエクスポート。", href: "platforms/elearning" },
      { title: "企業研修", description: "HRオンボーディング、セキュリティ、コンプライアンスを多言語キャプションで。内部ポータル向け焼き付け、外部LMS向けSRT。", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "視聴者がオン/オフ切替可能", burned: false, srt: true },
      { feature: "すべてのプラットフォームで動作", burned: true, srt: "partial" },
      { feature: "ソーシャルメディアに最適", burned: true, srt: false },
      { feature: "YouTubeに最適", burned: false, srt: true },
      { feature: "エクスポート後編集可", burned: false, srt: true },
      { feature: "SEOメリット", burned: false, srt: true },
      { feature: "ファイルサイズへの影響", burned: "動画が大きくなる", srt: "小さなファイル" },
    ],
    faqs: [
      { question: "吹き替え音声から生成？それとも翻訳？", answer: "吹き替え音声からです。視聴者が聞く音声をAIが文字起こしし、完璧な同期を保証します。" },
      { question: "YouTube用にSRTエクスポート可能？", answer: "はい。SRTまたはVTTをエクスポートしYouTubeに字幕としてアップロード。GoogleがSEO用にテキストをインデックスします。" },
      { question: "無料プランに含まれますか？", answer: "はい。AI字幕は吹き替えプロセスの一部として全プランで追加費用なしに含まれます。" },
      { question: "外観をカスタマイズできますか？", answer: "はい。フォント、サイズ、色、位置、背景スタイル。リアルタイムプレビュー。" },
      { question: "右から左に書く言語に対応？", answer: "はい。アラビア語、ヘブライ語、その他のRTL言語に完全対応。" },
    ],
  },

  hi: {
    title: "AI सबटाइटल — डब किए गए वीडियो के लिए ऑटो-जनरेट",
    description: "डब किए ऑडियो से सिंक किए AI सबटाइटल जनरेट करें। बर्न-इन या SRT/VTT एक्सपोर्ट। सभी प्लान में शामिल।",
    badge: "AI सबटाइटल",
    h1: "AI सबटाइटल —",
    h1Highlight: "हर डबिंग के साथ सिंक्रनाइज़्ड",
    subtitle: "DubSync हर डब किए वीडियो के लिए सिंक्रनाइज़्ड सबटाइटल ऑटो-जनरेट करता है — मूल ट्रांसक्रिप्ट से नहीं, बल्कि डब किए ऑडियो से। सही सिंक, बर्न-इन या SRT एक्सपोर्ट।",
    ctaPrimary: "AI सबटाइटल मुफ़्त आज़माएं",
    ctaPricing: "मूल्य देखें",
    stats: { languages: "30+ भाषाएं", formats: "SRT + VTT", plans: "सभी प्लान" },
    howTitle: "AI सबटाइटल कैसे काम करते हैं",
    burnedVsSrtTitle: "बर्न-इन vs SRT — सही फॉर्मेट चुनें",
    burnedVsSrtSubtitle: "दोनों हर डबिंग के साथ आते हैं। हर चैनल के लिए सही चुनें — या दोनों एक्सपोर्ट करें।",
    customTitle: "अपने सबटाइटल कस्टमाइज़ करें",
    customSubtitle: "शुरू से सही डिफ़ॉल्ट। जब ज़रूरत हो पूरा कंट्रोल, वीडियो एडिटर की जटिलता के बिना।",
    useCasesTitle: "हर प्लेटफ़ॉर्म के लिए सबटाइटल",
    languagesTitle: "30+ भाषाओं में सबटाइटल",
    languagesBody: "DubSync जिस भी भाषा में डब करता है, उसमें पूर्ण सबटाइटल सपोर्ट मिलता है। RTL (अरबी, हिब्रू) सही RTL रेंडरिंग के साथ। CJK (चीनी, जापानी, कोरियन) कैरेक्टर-लेवल काउंटिंग के साथ।",
    ctaTitle: "हर प्लेटफ़ॉर्म पर सबटाइटल वाले वीडियो भेजें",
    ctaSubtitle: "5 मुफ़्त मिनट डबिंग से शुरू करें — सबटाइटल शामिल। क्रेडिट कार्ड नहीं चाहिए।",
    ctaButton: "AI सबटाइटल मुफ़्त आज़माएं",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    relatedTitle: "संबंधित सुविधाएं",
    breadcrumbFeatures: "सुविधाएं",
    breadcrumbSubtitles: "AI सबटाइटल",
    allFeatures: "सभी सुविधाएं",
    steps: [
      { title: "अपना वीडियो डब करें", description: "वीडियो अपलोड करें, भाषाएं चुनें और डबिंग पाइपलाइन चलाएं। सबटाइटल हर डब के साथ ऑटो-जनरेट होते हैं।" },
      { title: "AI डब किए ऑडियो को ट्रांसक्राइब करता है", description: "डबिंग के बाद, स्पीच रिकग्निशन डब किए ऑडियो ट्रैक पर चलता है — मूल ट्रांसक्रिप्ट पर नहीं।" },
      { title: "स्मार्ट टाइमिंग और सेगमेंटेशन", description: "ट्रांसक्रिप्ट सबटाइटल-फ्रेंडली cues में बांटे जाते हैं: अधिकतम 2 लाइन, 42 कैरेक्टर/लाइन, 1–7s डिस्प्ले।" },
      { title: "अपना आउटपुट चुनें", description: "सोशल फीड के लिए बर्न-इन या YouTube और LMS के लिए SRT/VTT फ़ाइलें। एक ही डब से दोनों एक्सपोर्ट करें।" },
    ],
    customization: [
      { title: "फॉन्ट फ़ैमिली और साइज़", description: "Sans-serif, serif या monospace। वीडियो रेज़ोल्यूशन के अनुसार ऑटो-स्केल।" },
      { title: "रंग और बैकग्राउंड", description: "टेक्स्ट रंग, स्ट्रोक चौड़ाई, और ओपैसिटी कंट्रोल वाला बैकग्राउंड।" },
      { title: "पोज़िशन और अलाइनमेंट", description: "नीचे (डिफ़ॉल्ट), ऊपर, या कस्टम Y ऑफ़सेट।" },
      { title: "भाषा-विशिष्ट कंट्रोल", description: "सबटाइटल डब किए ऑडियो से मैच कर सकते हैं या अलग हो सकते हैं। RTL और CJK पूरी तरह समर्थित।" },
    ],
    useCases: [
      { title: "YouTube क्रिएटर्स", description: "डब किए वीडियो + SRT को क्लोज़्ड कैप्शन ट्रैक के रूप में अपलोड करें। YouTube ऑटो-मैप करता है और Google SEO के लिए इंडेक्स करता है।", href: "platforms/youtube" },
      { title: "सोशल मीडिया (TikTok, Instagram, Facebook)", description: "बर्न-इन सबटाइटल ज़रूरी — ज़्यादातर लोग म्यूट पर देखते हैं। स्टाइल्ड कैप्शन एंगेजमेंट 40% तक बढ़ाते हैं।", href: "platforms/tiktok" },
      { title: "ई-लर्निंग", description: "Udemy, Coursera, Teachable और Thinkific पर एक्सेसिबिलिटी कम्प्लायंस पूरी करें।", href: "platforms/elearning" },
      { title: "कॉर्पोरेट ट्रेनिंग", description: "HR ऑनबोर्डिंग, सुरक्षा, कम्प्लायंस मल्टीलिंगुअल कैप्शन के साथ।", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "दर्शक ऑन/ऑफ कर सकता है", burned: false, srt: true },
      { feature: "सभी प्लेटफ़ॉर्म पर काम करता है", burned: true, srt: "partial" },
      { feature: "सोशल मीडिया के लिए बेस्ट", burned: true, srt: false },
      { feature: "YouTube के लिए बेस्ट", burned: false, srt: true },
      { feature: "एक्सपोर्ट के बाद एडिट करने योग्य", burned: false, srt: true },
      { feature: "SEO लाभ", burned: false, srt: true },
      { feature: "फ़ाइल साइज़ प्रभाव", burned: "बड़ा वीडियो", srt: "छोटी फ़ाइल" },
    ],
    faqs: [
      { question: "डब किए ऑडियो से जनरेट होते हैं या मूल से अनुवाद?", answer: "डब किए ऑडियो से। AI वह ट्रांसक्राइब करता है जो दर्शक सुनता है।" },
      { question: "YouTube के लिए SRT एक्सपोर्ट कर सकते हैं?", answer: "हां। SRT या VTT एक्सपोर्ट करें और सबटाइटल के रूप में अपलोड करें।" },
      { question: "फ्री प्लान में शामिल?", answer: "हां। AI सबटाइटल डबिंग प्रक्रिया का हिस्सा हैं, सभी प्लान में बिना अतिरिक्त लागत।" },
      { question: "अपीयरेंस कस्टमाइज़ कर सकते हैं?", answer: "हां। फॉन्ट, साइज़, रंग, पोज़िशन और बैकग्राउंड स्टाइल। रियल-टाइम प्रीव्यू।" },
      { question: "RTL भाषाओं को सपोर्ट करते हैं?", answer: "हां। अरबी, हिब्रू और अन्य RTL भाषाएं पूरी तरह समर्थित।" },
    ],
  },
  ar: {
    title: "ترجمات AI للفيديو — إنشاء تلقائي بأكثر من 30 لغة",
    description: "إنشاء ترجمات AI متزامنة مع الصوت المدبلج. مدمجة أو تصدير SRT/VTT. مضمنة في جميع الخطط.",
    badge: "ترجمات AI",
    h1: "ترجمات AI —",
    h1Highlight: "متزامنة مع كل دبلجة",
    subtitle: "ينشئ DubSync تلقائياً ترجمات متزامنة لكل فيديو مدبلج — من الصوت المدبلج مباشرة وليس من النص الأصلي. تزامن مثالي، مدمجة أو تصدير SRT.",
    ctaPrimary: "جرب ترجمات AI مجاناً",
    ctaPricing: "عرض الأسعار",
    stats: { languages: "أكثر من 30 لغة", formats: "SRT + VTT", plans: "جميع الخطط" },
    howTitle: "كيف تعمل ترجمات AI",
    burnedVsSrtTitle: "مدمجة vs SRT — اختر الصيغة المناسبة",
    burnedVsSrtSubtitle: "كلاهما يأتي مع كل دبلجة. اختر المناسب لكل قناة — أو صدّر الاثنين.",
    customTitle: "خصص ترجماتك",
    customSubtitle: "إعدادات افتراضية ذكية. تحكم كامل عند الحاجة، دون تعقيد محرر فيديو كامل.",
    useCasesTitle: "ترجمات لكل منصة",
    languagesTitle: "ترجمات بأكثر من 30 لغة",
    languagesBody: "كل لغة يدبلج إليها DubSync تحصل على دعم كامل للترجمات. اللغات من اليمين لليسار (العربية، العبرية) تُعرض بتنسيق RTL صحيح. لغات CJK (الصينية، اليابانية، الكورية) تستخدم عد الأحرف.",
    ctaTitle: "أرسل فيديوهات مترجمة بالكامل لكل منصة",
    ctaSubtitle: "ابدأ بـ 5 دقائق مجانية — الترجمات مضمنة. بدون بطاقة ائتمان.",
    ctaButton: "جرب ترجمات AI مجاناً",
    faqTitle: "الأسئلة الشائعة",
    relatedTitle: "ميزات ذات صلة",
    breadcrumbFeatures: "الميزات",
    breadcrumbSubtitles: "ترجمات AI",
    allFeatures: "جميع الميزات",
    steps: [
      { title: "دبلج فيديوك", description: "ارفع الفيديو، اختر اللغات وشغّل خط الدبلجة. الترجمات تُنشأ تلقائياً مع كل دبلجة." },
      { title: "AI يكتب الصوت المدبلج", description: "بعد الدبلجة، يعمل التعرف على الكلام على المسار الصوتي المدبلج — وليس النص الأصلي." },
      { title: "توقيت وتقسيم ذكي", description: "النصوص تُقسم إلى إشارات ملائمة: حد أقصى سطرين، 42 حرف/سطر، عرض 1–7 ثوانٍ." },
      { title: "اختر مخرجاتك", description: "مدمجة للخلاصات الاجتماعية أو ملفات SRT/VTT ليوتيوب وLMS. صدّر الاثنين من نفس الدبلجة." },
    ],
    customization: [
      { title: "عائلة الخط والحجم", description: "Sans-serif أو serif أو monospace. مقياس تلقائي لدقة الفيديو." },
      { title: "الألوان والخلفيات", description: "لون النص، عرض الحد، وخلفية مع تحكم بالشفافية." },
      { title: "الموضع والمحاذاة", description: "أسفل (افتراضي)، أعلى، أو إزاحة Y مخصصة." },
      { title: "تحكم حسب اللغة", description: "الترجمات يمكن أن تطابق الصوت المدبلج أو تختلف. RTL وCJK مدعومة بالكامل." },
    ],
    useCases: [
      { title: "منشئو يوتيوب", description: "ارفع الفيديو المدبلج + SRT كمسار ترجمة مغلقة. يوتيوب يربط تلقائياً وGoogle يفهرس النص لـSEO.", href: "platforms/youtube" },
      { title: "وسائل التواصل (تيك توك، إنستغرام، فيسبوك)", description: "الترجمات المدمجة ضرورية — معظمهم يشاهدون بصمت. الترجمات المنسقة تزيد التفاعل حتى 40%.", href: "platforms/tiktok" },
      { title: "التعليم الإلكتروني", description: "التوافق مع متطلبات إمكانية الوصول في Udemy وCoursera وTeachable وThinkific.", href: "platforms/elearning" },
      { title: "التدريب المؤسسي", description: "إعداد الموظفين، الأمان، الامتثال مع ترجمات متعددة اللغات.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "المشاهد يمكنه التشغيل/الإيقاف", burned: false, srt: true },
      { feature: "يعمل على جميع المنصات", burned: true, srt: "partial" },
      { feature: "الأفضل لوسائل التواصل", burned: true, srt: false },
      { feature: "الأفضل ليوتيوب", burned: false, srt: true },
      { feature: "قابل للتعديل بعد التصدير", burned: false, srt: true },
      { feature: "فائدة SEO", burned: false, srt: true },
      { feature: "تأثير على الحجم", burned: "فيديو أكبر", srt: "ملف صغير" },
    ],
    faqs: [
      { question: "هل تُنشأ من الصوت المدبلج أم تُترجم من الأصل؟", answer: "من الصوت المدبلج. AI يكتب ما يسمعه المشاهد." },
      { question: "هل يمكن تصدير SRT ليوتيوب؟", answer: "نعم. صدّر SRT أو VTT وارفعها كترجمات." },
      { question: "مضمنة في الخطة المجانية؟", answer: "نعم. ترجمات AI جزء من عملية الدبلجة بدون تكلفة إضافية." },
      { question: "هل يمكن تخصيص المظهر؟", answer: "نعم. الخط والحجم واللون والموضع والخلفية. معاينة فورية." },
      { question: "هل تدعم لغات RTL؟", answer: "نعم. العربية والعبرية ولغات RTL الأخرى مدعومة بالكامل." },
    ],
  },
  id: {
    title: "Subtitle AI untuk Video — Buat Otomatis dalam 30+ Bahasa",
    description: "Buat subtitle AI yang disinkronkan dengan audio dubbing. Dibakar atau ekspor SRT/VTT. Termasuk di semua paket.",
    badge: "Subtitle AI",
    h1: "Subtitle AI —",
    h1Highlight: "tersinkronisasi dengan setiap dubbing",
    subtitle: "DubSync secara otomatis membuat subtitle tersinkronisasi untuk setiap video dubbing — langsung dari audio dubbing, bukan dari transkrip asli. Sinkronisasi sempurna, dibakar atau ekspor SRT.",
    ctaPrimary: "Coba Subtitle AI Gratis",
    ctaPricing: "Lihat harga",
    stats: { languages: "30+ bahasa", formats: "SRT + VTT", plans: "Semua paket" },
    howTitle: "Cara kerja subtitle AI",
    burnedVsSrtTitle: "Dibakar vs SRT — pilih format yang tepat",
    burnedVsSrtSubtitle: "Keduanya disertakan dengan setiap dubbing. Pilih yang sesuai untuk setiap saluran — atau ekspor keduanya.",
    customTitle: "Kustomisasi subtitle Anda",
    customSubtitle: "Default yang masuk akal sejak awal. Kontrol penuh saat dibutuhkan, tanpa kerumitan editor video penuh.",
    useCasesTitle: "Subtitle untuk setiap platform",
    languagesTitle: "Subtitle dalam 30+ bahasa",
    languagesBody: "Setiap bahasa yang didubbing DubSync mendapat dukungan subtitle penuh. Bahasa RTL (Arab, Ibrani) dirender dengan format RTL yang benar. Bahasa CJK menggunakan penghitungan per karakter.",
    ctaTitle: "Kirim video bersubtitle lengkap ke setiap platform",
    ctaSubtitle: "Mulai dengan 5 menit gratis — subtitle termasuk. Tanpa kartu kredit.",
    ctaButton: "Coba Subtitle AI Gratis",
    faqTitle: "Pertanyaan yang sering diajukan",
    relatedTitle: "Fitur terkait",
    breadcrumbFeatures: "Fitur",
    breadcrumbSubtitles: "Subtitle AI",
    allFeatures: "Semua fitur",
    steps: [
      { title: "Dubbing video Anda", description: "Unggah video, pilih bahasa, dan jalankan pipeline dubbing. Subtitle dibuat otomatis bersama setiap dubbing." },
      { title: "AI mentranskripsikan audio dubbing", description: "Setelah dubbing, pengenalan suara berjalan pada trek audio dubbing — bukan transkrip asli." },
      { title: "Timing dan segmentasi cerdas", description: "Transkrip dipecah menjadi cue yang ramah subtitle: maks 2 baris, 42 karakter/baris, tampilan 1–7 detik." },
      { title: "Pilih output Anda", description: "Dibakar untuk feed sosial atau file SRT/VTT untuk YouTube dan LMS. Ekspor keduanya dari dubbing yang sama." },
    ],
    customization: [
      { title: "Keluarga dan ukuran font", description: "Sans-serif, serif, atau monospace. Skala otomatis ke resolusi video." },
      { title: "Warna dan latar belakang", description: "Warna teks, lebar stroke, dan latar dengan kontrol opasitas." },
      { title: "Posisi dan perataan", description: "Bawah (default), atas, atau offset Y kustom." },
      { title: "Kontrol per bahasa", description: "Subtitle bisa cocok dengan audio dubbing atau berbeda. RTL dan CJK sepenuhnya didukung." },
    ],
    useCases: [
      { title: "Kreator YouTube", description: "Unggah video dubbing + SRT sebagai trek subtitle tertutup. YouTube otomatis memetakan dan Google mengindeks teks untuk SEO.", href: "platforms/youtube" },
      { title: "Media sosial (TikTok, Instagram, Facebook)", description: "Subtitle yang dibakar sangat penting — kebanyakan menonton tanpa suara. Subtitle bergaya meningkatkan engagement hingga 40%.", href: "platforms/tiktok" },
      { title: "E-learning", description: "Penuhi kepatuhan aksesibilitas di Udemy, Coursera, Teachable, dan Thinkific.", href: "platforms/elearning" },
      { title: "Pelatihan korporat", description: "Onboarding HR, keamanan, kepatuhan dengan subtitle multibahasa.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "Penonton bisa aktifkan/nonaktifkan", burned: false, srt: true },
      { feature: "Berfungsi di semua platform", burned: true, srt: "partial" },
      { feature: "Terbaik untuk media sosial", burned: true, srt: false },
      { feature: "Terbaik untuk YouTube", burned: false, srt: true },
      { feature: "Bisa diedit setelah ekspor", burned: false, srt: true },
      { feature: "Manfaat SEO", burned: false, srt: true },
      { feature: "Dampak ukuran file", burned: "Video lebih besar", srt: "File kecil" },
    ],
    faqs: [
      { question: "Dibuat dari audio dubbing atau diterjemahkan dari asli?", answer: "Dari audio dubbing. AI mentranskripsikan apa yang didengar penonton." },
      { question: "Bisa ekspor SRT untuk YouTube?", answer: "Ya. Ekspor SRT atau VTT dan unggah sebagai subtitle." },
      { question: "Termasuk di paket gratis?", answer: "Ya. Subtitle AI adalah bagian dari proses dubbing tanpa biaya tambahan." },
      { question: "Bisa kustomisasi tampilan?", answer: "Ya. Font, ukuran, warna, posisi, dan gaya latar. Pratinjau real-time." },
      { question: "Mendukung bahasa RTL?", answer: "Ya. Arab, Ibrani, dan bahasa RTL lainnya sepenuhnya didukung." },
    ],
  },
  tr: {
    title: "AI Altyazı — Dublajlı Videolar İçin Otomatik Oluştur",
    description: "Dublajlı sese senkronize AI altyazılar oluşturun. Gömülü veya SRT/VTT dışa aktarma. Tüm planlarda dahil.",
    badge: "AI Altyazı",
    h1: "AI Altyazı —",
    h1Highlight: "her dublajla senkronize",
    subtitle: "DubSync her dublajlı video için otomatik olarak senkronize altyazılar oluşturur — orijinal transkriptten değil, doğrudan dublajlı sesten. Mükemmel senkronizasyon, gömülü veya SRT dışa aktarma.",
    ctaPrimary: "AI Altyazıyı Ücretsiz Deneyin",
    ctaPricing: "Fiyatları görün",
    stats: { languages: "30+ dil", formats: "SRT + VTT", plans: "Tüm planlar" },
    howTitle: "AI altyazılar nasıl çalışır",
    burnedVsSrtTitle: "Gömülü vs SRT — doğru formatı seçin",
    burnedVsSrtSubtitle: "Her ikisi de her dublajla birlikte gelir. Her kanal için doğru olanı seçin — veya ikisini de dışa aktarın.",
    customTitle: "Altyazılarınızı özelleştirin",
    customSubtitle: "Baştan mantıklı varsayılanlar. İhtiyaç duyduğunuzda tam kontrol, video düzenleyici karmaşıklığı olmadan.",
    useCasesTitle: "Her platform için altyazılar",
    languagesTitle: "30+ dilde altyazılar",
    languagesBody: "DubSync'in dublajladığı her dil tam altyazı desteği alır. RTL diller (Arapça, İbranice) doğru RTL biçimlendirmesiyle gösterilir. CJK dilleri karakter bazlı sayım kullanır.",
    ctaTitle: "Her platforma tamamen altyazılı video gönderin",
    ctaSubtitle: "5 ücretsiz dakikayla başlayın — altyazılar dahil. Kredi kartı gerekmez.",
    ctaButton: "AI Altyazıyı Ücretsiz Deneyin",
    faqTitle: "Sıkça sorulan sorular",
    relatedTitle: "İlgili özellikler",
    breadcrumbFeatures: "Özellikler",
    breadcrumbSubtitles: "AI Altyazı",
    allFeatures: "Tüm özellikler",
    steps: [
      { title: "Videonuzu dublajlayın", description: "Video yükleyin, dilleri seçin ve dublaj hattını çalıştırın. Altyazılar her dublajla otomatik oluşturulur." },
      { title: "AI dublajlı sesi yazıya döker", description: "Dublajdan sonra, konuşma tanıma dublajlı ses parçasında çalışır — orijinal transkriptte değil." },
      { title: "Akıllı zamanlama ve segmentasyon", description: "Transkriptler altyazı dostu cue'lara bölünür: maks 2 satır, 42 karakter/satır, 1–7 sn gösterim." },
      { title: "Çıktınızı seçin", description: "Sosyal akışlar için gömülü veya YouTube ve LMS için SRT/VTT dosyaları. Aynı dublajdan ikisini de dışa aktarın." },
    ],
    customization: [
      { title: "Yazı tipi ailesi ve boyutu", description: "Sans-serif, serif veya monospace. Video çözünürlüğüne otomatik ölçekleme." },
      { title: "Renkler ve arka planlar", description: "Metin rengi, kontur genişliği ve opaklık kontrolü ile arka plan." },
      { title: "Konum ve hizalama", description: "Alt (varsayılan), üst veya özel Y ofseti." },
      { title: "Dil bazlı kontroller", description: "Altyazılar dublajlı sesle eşleşebilir veya farklı olabilir. RTL ve CJK tam desteklenir." },
    ],
    useCases: [
      { title: "YouTube Üreticileri", description: "Dublajlı video + SRT'yi kapalı altyazı parçası olarak yükleyin. YouTube otomatik eşleştirir ve Google SEO için indeksler.", href: "platforms/youtube" },
      { title: "Sosyal medya (TikTok, Instagram, Facebook)", description: "Gömülü altyazılar şart — çoğu sessiz izler. Stilize altyazılar etkileşimi %40'a kadar artırır.", href: "platforms/tiktok" },
      { title: "E-öğrenme", description: "Udemy, Coursera, Teachable ve Thinkific'te erişilebilirlik uyumluluğunu karşılayın.", href: "platforms/elearning" },
      { title: "Kurumsal eğitim", description: "İK oryantasyon, güvenlik, çok dilli altyazılarla uyum.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "İzleyici açıp/kapatabilir", burned: false, srt: true },
      { feature: "Tüm platformlarda çalışır", burned: true, srt: "partial" },
      { feature: "Sosyal medya için en iyi", burned: true, srt: false },
      { feature: "YouTube için en iyi", burned: false, srt: true },
      { feature: "Dışa aktarma sonrası düzenlenebilir", burned: false, srt: true },
      { feature: "SEO avantajı", burned: false, srt: true },
      { feature: "Dosya boyutu etkisi", burned: "Daha büyük video", srt: "Küçük dosya" },
    ],
    faqs: [
      { question: "Dublajlı sesten mi oluşturulur yoksa orijinalden mi çevrilir?", answer: "Dublajlı sesten. AI izleyicinin duyduğunu yazıya döker." },
      { question: "YouTube için SRT dışa aktarılabilir mi?", answer: "Evet. SRT veya VTT dışa aktarın ve altyazı olarak yükleyin." },
      { question: "Ücretsiz plana dahil mi?", answer: "Evet. AI altyazılar dublaj sürecinin bir parçası, ek maliyet yok." },
      { question: "Görünüm özelleştirilebilir mi?", answer: "Evet. Yazı tipi, boyut, renk, konum ve arka plan stili. Gerçek zamanlı önizleme." },
      { question: "RTL dilleri destekliyor mu?", answer: "Evet. Arapça, İbranice ve diğer RTL diller tam desteklenir." },
    ],
  },
  ko: {
    title: "AI 자막 — 더빙 비디오 자동 생성",
    description: "더빙된 오디오에 동기화된 AI 자막 생성. 삽입 또는 SRT/VTT 내보내기. 모든 플랜 포함.",
    badge: "AI 자막",
    h1: "AI 자막 —",
    h1Highlight: "모든 더빙에 동기화",
    subtitle: "DubSync는 모든 더빙 비디오에 자동으로 동기화된 자막을 생성합니다 — 원본 전사가 아닌 더빙된 오디오에서 직접. 완벽한 동기화, 삽입 또는 SRT 내보내기.",
    ctaPrimary: "AI 자막 무료 체험",
    ctaPricing: "요금 보기",
    stats: { languages: "30개 이상 언어", formats: "SRT + VTT", plans: "모든 플랜" },
    howTitle: "AI 자막 작동 방식",
    burnedVsSrtTitle: "삽입 vs SRT — 올바른 형식 선택",
    burnedVsSrtSubtitle: "둘 다 모든 더빙에 포함됩니다. 각 채널에 맞는 것을 선택하거나 둘 다 내보내세요.",
    customTitle: "자막 커스터마이즈",
    customSubtitle: "처음부터 합리적인 기본값. 필요할 때 완전한 제어, 풀 비디오 에디터의 복잡함 없이.",
    useCasesTitle: "모든 플랫폼을 위한 자막",
    languagesTitle: "30개 이상 언어의 자막",
    languagesBody: "DubSync가 더빙하는 모든 언어는 완전한 자막 지원을 받습니다. RTL 언어(아랍어, 히브리어)는 올바른 RTL 형식으로 렌더링됩니다. CJK 언어는 문자별 카운팅을 사용합니다.",
    ctaTitle: "모든 플랫폼에 완전한 자막 비디오 전송",
    ctaSubtitle: "5분 무료로 시작 — 자막 포함. 신용카드 불필요.",
    ctaButton: "AI 자막 무료 체험",
    faqTitle: "자주 묻는 질문",
    relatedTitle: "관련 기능",
    breadcrumbFeatures: "기능",
    breadcrumbSubtitles: "AI 자막",
    allFeatures: "모든 기능",
    steps: [
      { title: "비디오 더빙", description: "비디오 업로드, 언어 선택, 더빙 파이프라인 실행. 자막은 각 더빙과 함께 자동 생성됩니다." },
      { title: "AI가 더빙 오디오 전사", description: "더빙 후, 음성 인식이 더빙된 오디오 트랙에서 실행됩니다 — 원본 전사가 아닙니다." },
      { title: "스마트 타이밍과 세그먼트 분할", description: "전사가 자막 친화적 큐로 분할됩니다: 최대 2줄, 42문자/줄, 1-7초 표시." },
      { title: "출력 선택", description: "소셜 피드용 삽입 또는 YouTube/LMS용 SRT/VTT 파일. 같은 더빙에서 둘 다 내보내기." },
    ],
    customization: [
      { title: "글꼴 패밀리와 크기", description: "Sans-serif, serif 또는 monospace. 비디오 해상도에 자동 스케일." },
      { title: "색상과 배경", description: "텍스트 색상, 스트로크 너비, 불투명도 제어 배경." },
      { title: "위치와 정렬", description: "하단(기본), 상단, 또는 커스텀 Y 오프셋." },
      { title: "언어별 제어", description: "자막은 더빙 오디오와 일치하거나 다를 수 있습니다. RTL과 CJK 완전 지원." },
    ],
    useCases: [
      { title: "YouTube 크리에이터", description: "더빙 비디오 + SRT를 자막 트랙으로 업로드. YouTube 자동 매핑, Google SEO 인덱싱.", href: "platforms/youtube" },
      { title: "소셜 미디어 (TikTok, Instagram, Facebook)", description: "삽입 자막 필수 — 대부분 음소거로 시청. 스타일 자막이 참여도 40% 증가.", href: "platforms/tiktok" },
      { title: "E-Learning", description: "Udemy, Coursera, Teachable, Thinkific 접근성 규정 준수.", href: "platforms/elearning" },
      { title: "기업 교육", description: "HR 온보딩, 보안, 다국어 자막 컴플라이언스.", href: "platforms/elearning" },
    ],
    comparisonRows: [
      { feature: "시청자 켜기/끄기 가능", burned: false, srt: true },
      { feature: "모든 플랫폼 작동", burned: true, srt: "partial" },
      { feature: "소셜 미디어 최적", burned: true, srt: false },
      { feature: "YouTube 최적", burned: false, srt: true },
      { feature: "내보내기 후 편집 가능", burned: false, srt: true },
      { feature: "SEO 혜택", burned: false, srt: true },
      { feature: "파일 크기 영향", burned: "더 큰 비디오", srt: "작은 파일" },
    ],
    faqs: [
      { question: "더빙 오디오에서 생성? 원본에서 번역?", answer: "더빙 오디오에서. AI가 시청자가 듣는 것을 전사합니다." },
      { question: "YouTube용 SRT 내보내기 가능?", answer: "네. SRT 또는 VTT 내보내서 자막으로 업로드." },
      { question: "무료 플랜에 포함?", answer: "네. AI 자막은 더빙 프로세스의 일부, 추가 비용 없음." },
      { question: "외관 커스터마이즈 가능?", answer: "네. 글꼴, 크기, 색상, 위치, 배경 스타일. 실시간 미리보기." },
      { question: "RTL 언어 지원?", answer: "네. 아랍어, 히브리어 등 RTL 언어 완전 지원." },
    ],
  },};

type Lang = keyof typeof TRANSLATIONS;

const STEP_ICONS = [Sparkles, Captions, AlignCenter, Type];
const CUSTOM_ICONS = [Type, Palette, AlignCenter, Subtitles];
const USE_CASE_ICONS = [MonitorPlay, Share2, GraduationCap, Building2];

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
        ? "https://dubsync.app/features/subtitles"
        : `https://dubsync.app/${l}/features/subtitles`;
  }
  langAlternates["x-default"] = "https://dubsync.app/features/subtitles";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/features/subtitles`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/features/subtitles`,
      images: ["/og-image.png"],
    },
  };
}

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="h-5 w-5 text-green-400 mx-auto" aria-label="Yes" />;
  if (value === false)
    return <X className="h-5 w-5 text-zinc-600 mx-auto" aria-label="No" />;
  if (value === "partial")
    return <span className="text-yellow-400 text-xs">Partial</span>;
  return <span className="text-xs text-zinc-400">{value}</span>;
}

export default async function LocalizedSubtitlesFeaturePage({
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
          { name: t.breadcrumbSubtitles, url: `https://dubsync.app/${lang}/features/subtitles` },
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
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400">
            <Captions className="h-3.5 w-3.5" /> {t.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t.h1}{" "}
            <span className="gradient-text">{t.h1Highlight}</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium">
              {t.ctaPrimary}
            </Link>
            <Link href={`/${lang}/pricing`} className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors">
              {t.ctaPricing}
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
            <span>{t.stats.languages}</span>
            <span>·</span>
            <span>{t.stats.formats}</span>
            <span>·</span>
            <span>{t.stats.plans}</span>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.howTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-slate-800/30 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <Icon className="h-6 w-6 text-pink-400" />
                  </div>
                  <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Burned-in vs SRT */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            {t.burnedVsSrtTitle}
          </h2>
          <p className="text-center text-zinc-400 mb-10 max-w-xl mx-auto">
            {t.burnedVsSrtSubtitle}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-slate-800/50">
                  <th className="px-6 py-4 text-left font-semibold text-white">&nbsp;</th>
                  <th className="px-4 py-4 text-center font-semibold text-pink-400">Burned-in</th>
                  <th className="px-4 py-4 text-center font-semibold text-pink-400">SRT / VTT</th>
                </tr>
              </thead>
              <tbody>
                {t.comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-4 text-zinc-300">{row.feature}</td>
                    <td className="px-4 py-4 text-center"><ComparisonCell value={row.burned} /></td>
                    <td className="px-4 py-4 text-center"><ComparisonCell value={row.srt} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customization */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">{t.customTitle}</h2>
          <p className="text-center text-zinc-400 mb-12 max-w-xl mx-auto">{t.customSubtitle}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {t.customization.map((c, i) => {
              const Icon = CUSTOM_ICONS[i];
              return (
                <div key={c.title} className="rounded-2xl border border-white/10 bg-slate-800/30 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                      <Icon className="h-5 w-5 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{c.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Use cases */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">{t.useCasesTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {t.useCases.map((uc, i) => {
              const Icon = USE_CASE_ICONS[i];
              return (
                <Link key={uc.title} href={`/${lang}/${uc.href}`} className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 transition-colors hover:border-pink-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                      <Icon className="h-5 w-5 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{uc.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{uc.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-pink-400 group-hover:gap-2 transition-all">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Languages */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">{t.languagesTitle}</h2>
          <p className="text-center text-zinc-400 max-w-2xl mx-auto">{t.languagesBody}</p>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
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
          <div className="space-y-3">
            {t.faqs.map((f) => (
              <details key={f.question} className="group rounded-xl border border-white/10 bg-slate-800/30 px-5 py-4">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-medium text-white">
                  {f.question}
                  <ArrowRight className="h-4 w-4 text-zinc-500 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">{t.relatedTitle}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/${lang}/features/voice-cloning`} className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors">
              Voice Cloning
            </Link>
            <Link href={`/${lang}/features/lip-sync`} className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors">
              Lip Sync
            </Link>
            <Link href={`/${lang}/blog/ai-subtitles-for-dubbed-videos`} className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors">
              Blog
            </Link>
            <Link href={`/${lang}/features`} className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors">
              {t.allFeatures}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
