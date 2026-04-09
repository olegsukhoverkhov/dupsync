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
};

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
