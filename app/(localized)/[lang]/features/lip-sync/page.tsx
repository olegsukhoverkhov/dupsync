import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scan,
  ArrowRight,
  MonitorPlay,
  Presentation,
  Film,
  Podcast,
  Eye,
  Brain,
  Zap,
} from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Lip Sync con IA para Videos Doblados \u2014 Movimiento Natural de Boca en Cualquier Idioma | DubSync",
    description:
      "El lip sync con IA de DubSync ajusta los movimientos de la boca para coincidir con el audio doblado en cualquier idioma. El resultado se ve completamente natural.",
    badge: "Lip Sync",
    h1: "Lip sync con IA \u2014",
    h1Highlight: "movimiento natural de boca en cualquier idioma",
    subtitle:
      "DubSync re-renderiza los movimientos de la boca del hablante para que coincidan perfectamente con el audio doblado. El resultado es un video que parece grabado originalmente en el idioma de destino.",
    cta: "Probar lip sync gratis",
    howWorksTitle: "C\u00f3mo funciona el lip sync",
    whyMattersTitle: "Por qu\u00e9 importa el lip sync",
    whyMattersSubtitle: "El doblaje solo con audio deja una brecha entre lo que los espectadores oyen y lo que ven. El lip sync cierra esa brecha.",
    contentTypesTitle: "Tipos de contenido compatibles",
    ctaTitle: "Haz que los videos doblados se vean nativos",
    ctaSubtitle: "Prueba lip sync con 5 minutos gratis de doblaje. Sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    steps: [
      { title: "Detectar puntos faciales", description: "La IA mapea la cara del hablante en cada fotograma, identificando la boca, la mand\u00edbula y los m\u00fasculos faciales con precisi\u00f3n sub-p\u00edxel." },
      { title: "Analizar fonemas del audio doblado", description: "El habla traducida se descompone en fonemas individuales. Cada fonema se mapea a una forma espec\u00edfica de la boca que el modelo sabe renderizar." },
      { title: "Re-renderizar movimientos de boca", description: "El video se recompone fotograma a fotograma, ajustando la regi\u00f3n de la boca al nuevo audio. La textura de la piel, la iluminaci\u00f3n y las sombras se preservan." },
    ],
    reasons: [
      { title: "Confianza del espectador", description: "Los movimientos de labios desincronizados son inmediatamente perceptibles y hacen que los espectadores cuestionen la calidad. El lip sync mantiene a las audiencias comprometidas." },
      { title: "Mayor retenci\u00f3n", description: "Los videos con movimientos de labios sincronizados mantienen la atenci\u00f3n del espectador m\u00e1s tiempo. Los videos doblados con lip sync tienen un 35% m\u00e1s de tasa de finalizaci\u00f3n." },
      { title: "Rendimiento en plataformas", description: "YouTube, TikTok e Instagram favorecen videos con alto tiempo de visualizaci\u00f3n. Los doblajes con lip sync reducen el abandono y mejoran el alcance." },
    ],
    contentTypes: [
      { title: "Videos de talking-head", description: "Vlogs de YouTube, conferencias y clips de podcast donde la cara del hablante es el centro de atenci\u00f3n. El lip sync es cr\u00edtico aqu\u00ed." },
      { title: "Presentaciones y webinars", description: "Contenido con hablante y diapositivas. DubSync detecta cu\u00e1ndo el hablante est\u00e1 en pantalla y aplica lip sync solo a esos segmentos." },
      { title: "Contenido social corto", description: "TikToks, Reels y Shorts donde la atenci\u00f3n es fugaz. Incluso un fotograma de labios desincronizados puede provocar un scroll." },
      { title: "Entrevistas y multi-c\u00e1mara", description: "Contenido con m\u00faltiples hablantes y \u00e1ngulos de c\u00e1mara. DubSync rastrea cada hablante y aplica lip sync al que est\u00e1 hablando." },
    ],
    faqs: [
      { question: "\u00bfFunciona el lip sync con todas las resoluciones de video?", answer: "S\u00ed. DubSync soporta resoluciones desde 360p hasta 4K. La IA adapta su detecci\u00f3n de puntos faciales a la densidad de p\u00edxeles disponible." },
      { question: "\u00bfPuedo desactivar el lip sync para ciertos segmentos?", answer: "S\u00ed. El editor de guiones permite marcar segmentos donde el lip sync debe omitirse, por ejemplo cuando el hablante est\u00e1 fuera de pantalla." },
      { question: "\u00bfCu\u00e1nto tiempo toma el procesamiento de lip sync?", answer: "El tiempo depende de la duraci\u00f3n y resoluci\u00f3n del video. Un video de 10 minutos en 1080p t\u00edpicamente toma 3-5 minutos con lip sync activado." },
      { question: "\u00bfAfecta el lip sync la calidad del video?", answer: "No. DubSync solo re-renderiza la regi\u00f3n de la boca mientras preserva el resto del fotograma en calidad original. No hay p\u00e9rdida de calidad perceptible." },
    ],
    breadcrumbFeatures: "Funciones",
    breadcrumbLipSync: "Lip Sync",
  },
  pt: {
    title: "Lip Sync com IA para V\u00eddeos Dublados \u2014 Movimento Natural da Boca em Qualquer Idioma | DubSync",
    description:
      "O lip sync com IA do DubSync ajusta os movimentos da boca para corresponder ao \u00e1udio dublado em qualquer idioma. O resultado parece completamente natural.",
    badge: "Lip Sync",
    h1: "Lip sync com IA \u2014",
    h1Highlight: "movimento natural da boca em qualquer idioma",
    subtitle:
      "O DubSync re-renderiza os movimentos da boca do falante para corresponder perfeitamente ao \u00e1udio dublado. O resultado \u00e9 um v\u00eddeo que parece ter sido gravado originalmente no idioma-alvo.",
    cta: "Experimentar lip sync gr\u00e1tis",
    howWorksTitle: "Como o lip sync funciona",
    whyMattersTitle: "Por que o lip sync importa",
    whyMattersSubtitle: "A dublagem apenas com \u00e1udio deixa uma lacuna entre o que os espectadores ouvem e o que veem. O lip sync fecha essa lacuna.",
    contentTypesTitle: "Tipos de conte\u00fado suportados",
    ctaTitle: "Fa\u00e7a v\u00eddeos dublados parecerem nativos",
    ctaSubtitle: "Experimente lip sync com 5 minutos gr\u00e1tis de dublagem. Sem cart\u00e3o de cr\u00e9dito.",
    ctaButton: "Come\u00e7ar gr\u00e1tis",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Recursos relacionados",
    allFeatures: "Todos os recursos",
    steps: [
      { title: "Detectar marcos faciais", description: "A IA mapeia o rosto do falante em cada quadro, identificando a boca, o maxilar e os m\u00fasculos faciais com precis\u00e3o sub-pixel." },
      { title: "Analisar fonemas do \u00e1udio dublado", description: "A fala traduzida \u00e9 decomposta em fonemas individuais. Cada fonema \u00e9 mapeado para uma forma espec\u00edfica da boca que o modelo sabe renderizar." },
      { title: "Re-renderizar movimentos da boca", description: "O v\u00eddeo \u00e9 recomposto quadro a quadro, ajustando a regi\u00e3o da boca ao novo \u00e1udio. A textura da pele, ilumina\u00e7\u00e3o e sombras s\u00e3o preservadas." },
    ],
    reasons: [
      { title: "Confian\u00e7a do espectador", description: "Movimentos labiais desincronizados s\u00e3o imediatamente percept\u00edveis e fazem os espectadores questionarem a qualidade. O lip sync mant\u00e9m o p\u00fablico engajado." },
      { title: "Maior reten\u00e7\u00e3o", description: "V\u00eddeos com movimentos labiais sincronizados mant\u00eam a aten\u00e7\u00e3o do espectador por mais tempo. V\u00eddeos dublados com lip sync t\u00eam 35% mais taxa de conclus\u00e3o." },
      { title: "Desempenho nas plataformas", description: "YouTube, TikTok e Instagram favorecem v\u00eddeos com alto tempo de visualiza\u00e7\u00e3o. Dublagens com lip sync reduzem o abandono e melhoram o alcance." },
    ],
    contentTypes: [
      { title: "V\u00eddeos de talking-head", description: "Vlogs do YouTube, palestras e clips de podcast onde o rosto do falante \u00e9 o centro das aten\u00e7\u00f5es. O lip sync \u00e9 cr\u00edtico aqui." },
      { title: "Apresenta\u00e7\u00f5es e webinars", description: "Conte\u00fado com falante e slides. O DubSync detecta quando o falante est\u00e1 na tela e aplica lip sync apenas a esses segmentos." },
      { title: "Conte\u00fado social curto", description: "TikToks, Reels e Shorts onde a aten\u00e7\u00e3o \u00e9 fugaz. At\u00e9 um quadro de l\u00e1bios desincronizados pode provocar um scroll." },
      { title: "Entrevistas e multi-c\u00e2mera", description: "Conte\u00fado com m\u00faltiplos falantes e \u00e2ngulos de c\u00e2mera. O DubSync rastreia cada falante e aplica lip sync a quem est\u00e1 falando." },
    ],
    faqs: [
      { question: "O lip sync funciona com todas as resolu\u00e7\u00f5es de v\u00eddeo?", answer: "Sim. O DubSync suporta resolu\u00e7\u00f5es de 360p at\u00e9 4K. A IA adapta sua detec\u00e7\u00e3o de marcos faciais \u00e0 densidade de pixels dispon\u00edvel." },
      { question: "Posso desativar o lip sync para certos segmentos?", answer: "Sim. O editor de roteiros permite marcar segmentos onde o lip sync deve ser ignorado, por exemplo quando o falante est\u00e1 fora da tela." },
      { question: "Quanto tempo leva o processamento do lip sync?", answer: "O tempo depende da dura\u00e7\u00e3o e resolu\u00e7\u00e3o do v\u00eddeo. Um v\u00eddeo de 10 minutos em 1080p geralmente leva 3-5 minutos com lip sync ativado." },
      { question: "O lip sync afeta a qualidade do v\u00eddeo?", answer: "N\u00e3o. O DubSync s\u00f3 re-renderiza a regi\u00e3o da boca enquanto preserva o restante do quadro na qualidade original. N\u00e3o h\u00e1 perda de qualidade percept\u00edvel." },
    ],
    breadcrumbFeatures: "Recursos",
    breadcrumbLipSync: "Lip Sync",
  },
  de: {
    title: "KI-Lip-Sync f\u00fcr synchronisierte Videos \u2014 Nat\u00fcrliche Mundbewegungen in jeder Sprache | DubSync",
    description:
      "DubSyncs KI-Lip-Sync passt Mundbewegungen an das synchronisierte Audio in jeder Sprache an. Das Ergebnis sieht v\u00f6llig nat\u00fcrlich aus.",
    badge: "Lip Sync",
    h1: "KI-Lip-Sync \u2014",
    h1Highlight: "nat\u00fcrliche Mundbewegung in jeder Sprache",
    subtitle:
      "DubSync rendert die Mundbewegungen des Sprechers neu, damit sie perfekt zum synchronisierten Audio passen. Das Ergebnis ist ein Video, das aussieht, als w\u00e4re es urspr\u00fcnglich in der Zielsprache aufgenommen.",
    cta: "Lip Sync kostenlos testen",
    howWorksTitle: "So funktioniert Lip Sync",
    whyMattersTitle: "Warum Lip Sync wichtig ist",
    whyMattersSubtitle: "Reine Audio-Synchronisation hinterl\u00e4sst eine L\u00fccke zwischen dem, was Zuschauer h\u00f6ren und sehen. Lip Sync schlie\u00dft diese L\u00fccke.",
    contentTypesTitle: "Unterst\u00fctzte Inhaltstypen",
    ctaTitle: "Synchronisierte Videos nat\u00fcrlich aussehen lassen",
    ctaSubtitle: "Testen Sie Lip Sync mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
    faqTitle: "H\u00e4ufig gestellte Fragen",
    relatedTitle: "Verwandte Funktionen",
    allFeatures: "Alle Funktionen",
    steps: [
      { title: "Gesichtsmerkmale erkennen", description: "Die KI kartiert das Gesicht des Sprechers in jedem Bild und identifiziert Mund, Kiefer und Gesichtsmuskeln mit Sub-Pixel-Genauigkeit." },
      { title: "Phoneme des synchronisierten Audios analysieren", description: "Die \u00fcbersetzte Sprache wird in einzelne Phoneme zerlegt. Jedes Phonem wird einer bestimmten Mundform zugeordnet, die das Modell rendern kann." },
      { title: "Mundbewegungen neu rendern", description: "Das Video wird Bild f\u00fcr Bild neu zusammengesetzt, wobei der Mundbereich an das neue Audio angepasst wird. Hautstruktur, Beleuchtung und Schatten bleiben erhalten." },
    ],
    reasons: [
      { title: "Vertrauen der Zuschauer", description: "Nicht \u00fcbereinstimmende Lippenbewegungen fallen sofort auf und lassen Zuschauer die Qualit\u00e4t hinterfragen. Lip Sync h\u00e4lt das Publikum engagiert." },
      { title: "H\u00f6here Retention", description: "Videos mit synchronisierten Lippenbewegungen halten die Aufmerksamkeit l\u00e4nger. Synchronisierte Videos mit Lip Sync haben 35% h\u00f6here Abschlussraten." },
      { title: "Plattform-Performance", description: "YouTube, TikTok und Instagram bevorzugen Videos mit hoher Watch-Time. Lip-synced Dubs reduzieren den Abbruch und verbessern die Reichweite." },
    ],
    contentTypes: [
      { title: "Talking-Head-Videos", description: "YouTube-Vlogs, Vorlesungen und Podcast-Clips, bei denen das Gesicht des Sprechers im Vordergrund steht. Lip Sync ist hier entscheidend." },
      { title: "Pr\u00e4sentationen & Webinare", description: "Inhalt mit Sprecher und Folien. DubSync erkennt, wann der Sprecher sichtbar ist, und wendet Lip Sync nur auf diese Segmente an." },
      { title: "Kurzform-Social-Content", description: "TikToks, Reels und Shorts, wo die Aufmerksamkeit fl\u00fcchtig ist. Selbst ein einziger Frame mit nicht \u00fcbereinstimmenden Lippen kann zum Weiterscrollen f\u00fchren." },
      { title: "Interviews & Multi-Cam-Aufnahmen", description: "Inhalte mit mehreren Sprechern und Kamerawinkeln. DubSync verfolgt jeden Sprecher und wendet Lip Sync auf den aktuell Sprechenden an." },
    ],
    faqs: [
      { question: "Funktioniert Lip Sync mit allen Videoaufl\u00f6sungen?", answer: "Ja. DubSync unterst\u00fctzt Aufl\u00f6sungen von 360p bis 4K. Die KI passt ihre Gesichtserkennung an die verf\u00fcgbare Pixeldichte an." },
      { question: "Kann ich Lip Sync f\u00fcr bestimmte Segmente deaktivieren?", answer: "Ja. Der Skript-Editor erm\u00f6glicht es, Segmente zu markieren, in denen Lip Sync \u00fcbersprungen werden soll, z.B. wenn der Sprecher nicht im Bild ist." },
      { question: "Wie lange dauert die Lip-Sync-Verarbeitung?", answer: "Die Verarbeitungszeit h\u00e4ngt von Videol\u00e4nge und Aufl\u00f6sung ab. Ein 10-min\u00fctiges 1080p-Video dauert typischerweise 3-5 Minuten mit aktiviertem Lip Sync." },
      { question: "Beeintr\u00e4chtigt Lip Sync die Videoqualit\u00e4t?", answer: "Nein. DubSync rendert nur den Mundbereich neu und beh\u00e4lt den Rest des Bildes in Originalqualit\u00e4t bei. Es gibt keinen wahrnehmbaren Qualit\u00e4tsverlust." },
    ],
    breadcrumbFeatures: "Funktionen",
    breadcrumbLipSync: "Lip Sync",
  },
  fr: {
    title: "Lip Sync IA pour Vid\u00e9os Doubl\u00e9es \u2014 Mouvement Naturel de la Bouche dans Toute Langue | DubSync",
    description:
      "Le lip sync IA de DubSync ajuste les mouvements de la bouche pour correspondre \u00e0 l\u2019audio doubl\u00e9 dans toute langue. Le r\u00e9sultat para\u00eet compl\u00e8tement naturel.",
    badge: "Lip Sync",
    h1: "Lip sync IA \u2014",
    h1Highlight: "mouvement naturel de la bouche dans toute langue",
    subtitle:
      "DubSync re-rend les mouvements de la bouche du locuteur pour correspondre parfaitement \u00e0 l\u2019audio doubl\u00e9. Le r\u00e9sultat est une vid\u00e9o qui semble avoir \u00e9t\u00e9 enregistr\u00e9e dans la langue cible.",
    cta: "Essayer le lip sync gratuitement",
    howWorksTitle: "Comment fonctionne le lip sync",
    whyMattersTitle: "Pourquoi le lip sync est important",
    whyMattersSubtitle: "Le doublage audio seul laisse un \u00e9cart entre ce que les spectateurs entendent et voient. Le lip sync comble cet \u00e9cart.",
    contentTypesTitle: "Types de contenu pris en charge",
    ctaTitle: "Rendez les vid\u00e9os doubl\u00e9es naturelles",
    ctaSubtitle: "Essayez le lip sync avec 5 minutes gratuites de doublage. Aucune carte de cr\u00e9dit requise.",
    ctaButton: "Commencer gratuitement",
    faqTitle: "Questions fr\u00e9quentes",
    relatedTitle: "Fonctionnalit\u00e9s connexes",
    allFeatures: "Toutes les fonctionnalit\u00e9s",
    steps: [
      { title: "D\u00e9tecter les rep\u00e8res faciaux", description: "L\u2019IA cartographie le visage du locuteur dans chaque image, identifiant la bouche, la m\u00e2choire et les muscles faciaux avec une pr\u00e9cision sub-pixel." },
      { title: "Analyser les phon\u00e8mes de l\u2019audio doubl\u00e9", description: "La parole traduite est d\u00e9compos\u00e9e en phon\u00e8mes individuels. Chaque phon\u00e8me correspond \u00e0 une forme de bouche que le mod\u00e8le sait rendre." },
      { title: "Re-rendre les mouvements de la bouche", description: "La vid\u00e9o est recompos\u00e9e image par image, ajustant la r\u00e9gion buccale au nouvel audio. Texture de peau, \u00e9clairage et ombres sont pr\u00e9serv\u00e9s." },
    ],
    reasons: [
      { title: "Confiance du spectateur", description: "Des mouvements de l\u00e8vres d\u00e9synchronis\u00e9s sont imm\u00e9diatement perceptibles et font douter les spectateurs de la qualit\u00e9. Le lip sync maintient l\u2019engagement." },
      { title: "R\u00e9tention sup\u00e9rieure", description: "Les vid\u00e9os avec des mouvements de l\u00e8vres synchronis\u00e9s retiennent l\u2019attention plus longtemps. Les vid\u00e9os doubl\u00e9es avec lip sync ont 35% de taux de compl\u00e9tion en plus." },
      { title: "Performance sur les plateformes", description: "YouTube, TikTok et Instagram favorisent les vid\u00e9os avec un temps de visionnage \u00e9lev\u00e9. Le lip sync r\u00e9duit l\u2019abandon et am\u00e9liore la port\u00e9e." },
    ],
    contentTypes: [
      { title: "Vid\u00e9os face-cam\u00e9ra", description: "Vlogs YouTube, conf\u00e9rences et clips de podcast o\u00f9 le visage du locuteur est au centre. Le lip sync est critique ici." },
      { title: "Pr\u00e9sentations et webinaires", description: "Contenu avec locuteur et diapositives. DubSync d\u00e9tecte quand le locuteur est visible et applique le lip sync uniquement \u00e0 ces segments." },
      { title: "Contenu social court", description: "TikToks, Reels et Shorts o\u00f9 l\u2019attention est fugace. M\u00eame une seule image de l\u00e8vres d\u00e9cal\u00e9es peut provoquer un d\u00e9filement." },
      { title: "Interviews et multi-cam", description: "Contenu avec plusieurs locuteurs et angles de cam\u00e9ra. DubSync suit chaque locuteur et applique le lip sync \u00e0 celui qui parle." },
    ],
    faqs: [
      { question: "Le lip sync fonctionne-t-il avec toutes les r\u00e9solutions vid\u00e9o ?", answer: "Oui. DubSync prend en charge les r\u00e9solutions de 360p \u00e0 4K. L\u2019IA adapte sa d\u00e9tection faciale \u00e0 la densit\u00e9 de pixels disponible." },
      { question: "Puis-je d\u00e9sactiver le lip sync pour certains segments ?", answer: "Oui. L\u2019\u00e9diteur de scripts permet de marquer les segments o\u00f9 le lip sync doit \u00eatre ignor\u00e9, par exemple lorsque le locuteur est hors \u00e9cran." },
      { question: "Combien de temps prend le traitement du lip sync ?", answer: "Le temps d\u00e9pend de la dur\u00e9e et de la r\u00e9solution. Une vid\u00e9o de 10 minutes en 1080p prend g\u00e9n\u00e9ralement 3-5 minutes avec le lip sync activ\u00e9." },
      { question: "Le lip sync affecte-t-il la qualit\u00e9 vid\u00e9o ?", answer: "Non. DubSync ne re-rend que la r\u00e9gion buccale tout en pr\u00e9servant le reste de l\u2019image en qualit\u00e9 originale. Aucune perte de qualit\u00e9 perceptible." },
    ],
    breadcrumbFeatures: "Fonctionnalit\u00e9s",
    breadcrumbLipSync: "Lip Sync",
  },
  ja: {
    title: "AI\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3067\u5439\u304d\u66ff\u3048\u52d5\u753b \u2014 \u3042\u3089\u3086\u308b\u8a00\u8a9e\u3067\u81ea\u7136\u306a\u53e3\u306e\u52d5\u304d | DubSync",
    description:
      "DubSync\u306eAI\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u53e3\u306e\u52d5\u304d\u3092\u5439\u304d\u66ff\u3048\u97f3\u58f0\u306b\u5408\u308f\u305b\u3066\u8abf\u6574\u3002\u7d50\u679c\u306f\u5b8c\u5168\u306b\u81ea\u7136\u306b\u898b\u3048\u307e\u3059\u3002",
    badge: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af",
    h1: "AI\u30ea\u30c3\u30d7\u30b7\u30f3\u30af \u2014",
    h1Highlight: "\u3042\u3089\u3086\u308b\u8a00\u8a9e\u3067\u81ea\u7136\u306a\u53e3\u306e\u52d5\u304d",
    subtitle:
      "DubSync\u306f\u8a71\u8005\u306e\u53e3\u306e\u52d5\u304d\u3092\u5439\u304d\u66ff\u3048\u97f3\u58f0\u306b\u5b8c\u5168\u306b\u4e00\u81f4\u3059\u308b\u3088\u3046\u306b\u518d\u30ec\u30f3\u30c0\u30ea\u30f3\u30b0\u3057\u307e\u3059\u3002\u7d50\u679c\u306f\u30bf\u30fc\u30b2\u30c3\u30c8\u8a00\u8a9e\u3067\u5143\u3005\u64ae\u5f71\u3055\u308c\u305f\u304b\u306e\u3088\u3046\u306a\u52d5\u753b\u306b\u306a\u308a\u307e\u3059\u3002",
    cta: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u7121\u6599\u3067\u8a66\u3059",
    howWorksTitle: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306e\u4ed5\u7d44\u307f",
    whyMattersTitle: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u304c\u91cd\u8981\u306a\u7406\u7531",
    whyMattersSubtitle: "\u97f3\u58f0\u3060\u3051\u306e\u5439\u304d\u66ff\u3048\u306f\u3001\u8996\u8074\u8005\u304c\u805e\u304f\u3082\u306e\u3068\u898b\u308b\u3082\u306e\u306e\u9593\u306b\u30ae\u30e3\u30c3\u30d7\u3092\u6b8b\u3057\u307e\u3059\u3002\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u304c\u305d\u306e\u30ae\u30e3\u30c3\u30d7\u3092\u57cb\u3081\u307e\u3059\u3002",
    contentTypesTitle: "\u5bfe\u5fdc\u30b3\u30f3\u30c6\u30f3\u30c4\u30bf\u30a4\u30d7",
    ctaTitle: "\u5439\u304d\u66ff\u3048\u52d5\u753b\u3092\u30cd\u30a4\u30c6\u30a3\u30d6\u306b\u898b\u305b\u308b",
    ctaSubtitle: "5\u5206\u9593\u306e\u7121\u6599\u5439\u304d\u66ff\u3048\u3067\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u4e0d\u8981\u3002",
    ctaButton: "\u7121\u6599\u3067\u59cb\u3081\u308b",
    faqTitle: "\u3088\u304f\u3042\u308b\u8cea\u554f",
    relatedTitle: "\u95a2\u9023\u6a5f\u80fd",
    allFeatures: "\u5168\u3066\u306e\u6a5f\u80fd",
    steps: [
      { title: "\u9854\u306e\u30e9\u30f3\u30c9\u30de\u30fc\u30af\u3092\u691c\u51fa", description: "AI\u304c\u5404\u30d5\u30ec\u30fc\u30e0\u3067\u8a71\u8005\u306e\u9854\u3092\u30de\u30c3\u30d4\u30f3\u30b0\u3057\u3001\u53e3\u3001\u9855\u3001\u9854\u306e\u7b4b\u8089\u3092\u30b5\u30d6\u30d4\u30af\u30bb\u30eb\u7cbe\u5ea6\u3067\u7279\u5b9a\u3057\u307e\u3059\u3002" },
      { title: "\u5439\u304d\u66ff\u3048\u97f3\u58f0\u306e\u97f3\u7d20\u3092\u5206\u6790", description: "\u7ffb\u8a33\u3055\u308c\u305f\u97f3\u58f0\u306f\u500b\u3005\u306e\u97f3\u7d20\u306b\u5206\u89e3\u3055\u308c\u307e\u3059\u3002\u5404\u97f3\u7d20\u306f\u30e2\u30c7\u30eb\u304c\u30ec\u30f3\u30c0\u30ea\u30f3\u30b0\u3067\u304d\u308b\u7279\u5b9a\u306e\u53e3\u306e\u5f62\u306b\u30de\u30c3\u30d4\u30f3\u30b0\u3055\u308c\u307e\u3059\u3002" },
      { title: "\u53e3\u306e\u52d5\u304d\u3092\u518d\u30ec\u30f3\u30c0\u30ea\u30f3\u30b0", description: "\u52d5\u753b\u306f\u30d5\u30ec\u30fc\u30e0\u3054\u3068\u306b\u518d\u5408\u6210\u3055\u308c\u3001\u53e3\u306e\u9818\u57df\u304c\u65b0\u3057\u3044\u97f3\u58f0\u306b\u5408\u308f\u305b\u3066\u8abf\u6574\u3055\u308c\u307e\u3059\u3002\u808c\u306e\u8cea\u611f\u3001\u7167\u660e\u3001\u5f71\u306f\u4fdd\u6301\u3055\u308c\u307e\u3059\u3002" },
    ],
    reasons: [
      { title: "\u8996\u8074\u8005\u306e\u4fe1\u983c", description: "\u53e3\u306e\u52d5\u304d\u304c\u5408\u308f\u306a\u3044\u3068\u3059\u3050\u306b\u6c17\u4ed8\u304b\u308c\u3001\u54c1\u8cea\u3092\u7591\u308f\u308c\u307e\u3059\u3002\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u8996\u8074\u8005\u306e\u30a8\u30f3\u30b2\u30fc\u30b8\u30e1\u30f3\u30c8\u3092\u7dad\u6301\u3057\u307e\u3059\u3002" },
      { title: "\u9ad8\u3044\u4fdd\u6301\u7387", description: "\u53e3\u306e\u52d5\u304d\u304c\u540c\u671f\u3057\u305f\u52d5\u753b\u306f\u8996\u8074\u8005\u306e\u6ce8\u610f\u3092\u3088\u308a\u9577\u304f\u5f15\u304d\u3064\u3051\u307e\u3059\u3002\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u4ed8\u304d\u306e\u5439\u304d\u66ff\u3048\u52d5\u753b\u306f\u5b8c\u8996\u7387\u304c35%\u9ad8\u304f\u306a\u308a\u307e\u3059\u3002" },
      { title: "\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9", description: "YouTube\u3001TikTok\u3001Instagram\u306f\u8996\u8074\u6642\u9593\u306e\u9577\u3044\u52d5\u753b\u3092\u512a\u904d\u3057\u307e\u3059\u3002\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u96e2\u8131\u3092\u6e1b\u3089\u3057\u30ea\u30fc\u30c1\u3092\u5411\u4e0a\u3055\u305b\u307e\u3059\u3002" },
    ],
    contentTypes: [
      { title: "\u30c8\u30fc\u30ad\u30f3\u30b0\u30d8\u30c3\u30c9\u52d5\u753b", description: "YouTube\u30d6\u30ed\u30b0\u3001\u8b1b\u7fa9\u3001\u30dd\u30c3\u30c9\u30ad\u30e3\u30b9\u30c8\u30af\u30ea\u30c3\u30d7\u306a\u3069\u3001\u8a71\u8005\u306e\u9854\u304c\u4e2d\u5fc3\u3068\u306a\u308b\u30b3\u30f3\u30c6\u30f3\u30c4\u3002\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u304c\u91cd\u8981\u3067\u3059\u3002" },
      { title: "\u30d7\u30ec\u30bc\u30f3\u30c6\u30fc\u30b7\u30e7\u30f3\u3068\u30a6\u30a7\u30d3\u30ca\u30fc", description: "\u8a71\u8005\u3068\u30b9\u30e9\u30a4\u30c9\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u3002DubSync\u306f\u8a71\u8005\u304c\u753b\u9762\u306b\u3044\u308b\u3068\u304d\u3092\u691c\u51fa\u3057\u3001\u305d\u306e\u30bb\u30b0\u30e1\u30f3\u30c8\u306b\u306e\u307f\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u9069\u7528\u3002" },
      { title: "\u30b7\u30e7\u30fc\u30c8\u30d5\u30a9\u30fc\u30e0\u30b3\u30f3\u30c6\u30f3\u30c4", description: "TikTok\u3001\u30ea\u30fc\u30eb\u3001Shorts\u306a\u3069\u6ce8\u610f\u304c\u77ed\u3044\u30b3\u30f3\u30c6\u30f3\u30c4\u3002\u53e3\u306e\u52d5\u304d\u304c\u5408\u308f\u306a\u3044\u30d5\u30ec\u30fc\u30e0\u304c1\u3064\u3042\u308b\u3060\u3051\u3067\u30b9\u30af\u30ed\u30fc\u30eb\u3055\u308c\u307e\u3059\u3002" },
      { title: "\u30a4\u30f3\u30bf\u30d3\u30e5\u30fc\u3068\u30de\u30eb\u30c1\u30ab\u30e1\u30e9", description: "\u8907\u6570\u306e\u8a71\u8005\u3068\u30ab\u30e1\u30e9\u30a2\u30f3\u30b0\u30eb\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u3002DubSync\u306f\u5404\u8a71\u8005\u3092\u8ffd\u8de1\u3057\u3001\u73fe\u5728\u8a71\u3057\u3066\u3044\u308b\u4eba\u306b\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u9069\u7528\u3002" },
    ],
    faqs: [
      { question: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u5168\u3066\u306e\u52d5\u753b\u89e3\u50cf\u5ea6\u306b\u5bfe\u5fdc\u3057\u3066\u3044\u307e\u3059\u304b\uff1f", answer: "\u306f\u3044\u3002DubSync\u306f360p\u304b\u30894K\u307e\u3067\u306e\u89e3\u50cf\u5ea6\u306b\u5bfe\u5fdc\u3057\u3066\u3044\u307e\u3059\u3002AI\u304c\u5229\u7528\u53ef\u80fd\u306a\u30d4\u30af\u30bb\u30eb\u5bc6\u5ea6\u306b\u5408\u308f\u305b\u3066\u9854\u8a8d\u8b58\u3092\u8abf\u6574\u3057\u307e\u3059\u3002" },
      { question: "\u7279\u5b9a\u306e\u30bb\u30b0\u30e1\u30f3\u30c8\u3067\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u7121\u52b9\u306b\u3067\u304d\u307e\u3059\u304b\uff1f", answer: "\u306f\u3044\u3002\u30b9\u30af\u30ea\u30d7\u30c8\u30a8\u30c7\u30a3\u30bf\u3067\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u30b9\u30ad\u30c3\u30d7\u3059\u308b\u30bb\u30b0\u30e1\u30f3\u30c8\u3092\u30de\u30fc\u30af\u3067\u304d\u307e\u3059\u3002\u4f8b\u3048\u3070\u8a71\u8005\u304c\u753b\u9762\u5916\u306e\u3068\u304d\u306a\u3069\u3002" },
      { question: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306e\u51e6\u7406\u306b\u3069\u306e\u304f\u3089\u3044\u6642\u9593\u304c\u304b\u304b\u308a\u307e\u3059\u304b\uff1f", answer: "\u52d5\u753b\u306e\u9577\u3055\u3068\u89e3\u50cf\u5ea6\u306b\u3088\u308a\u307e\u3059\u30021080p\u306e10\u5206\u306e\u52d5\u753b\u306f\u901a\u5e38\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u6709\u52b9\u30673-5\u5206\u304b\u304b\u308a\u307e\u3059\u3002" },
      { question: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u306f\u52d5\u753b\u306e\u54c1\u8cea\u306b\u5f71\u97ff\u3057\u307e\u3059\u304b\uff1f", answer: "\u3044\u3044\u3048\u3002DubSync\u306f\u53e3\u306e\u9818\u57df\u306e\u307f\u3092\u518d\u30ec\u30f3\u30c0\u30ea\u30f3\u30b0\u3057\u3001\u6b8b\u308a\u306e\u30d5\u30ec\u30fc\u30e0\u306f\u30aa\u30ea\u30b8\u30ca\u30eb\u54c1\u8cea\u3067\u4fdd\u6301\u3057\u307e\u3059\u3002\u77e5\u899a\u3067\u304d\u308b\u54c1\u8cea\u4f4e\u4e0b\u306f\u3042\u308a\u307e\u305b\u3093\u3002" },
    ],
    breadcrumbFeatures: "\u6a5f\u80fd",
    breadcrumbLipSync: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af",
  },
};

type Lang = keyof typeof TRANSLATIONS;

const STEP_ICONS = [Eye, Brain, Zap];
const CT_ICONS = [MonitorPlay, Presentation, Film, Podcast];

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
        ? "https://dubsync.app/features/lip-sync"
        : `https://dubsync.app/${l}/features/lip-sync`;
  }
  langAlternates["x-default"] = "https://dubsync.app/features/lip-sync";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/features/lip-sync`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/features/lip-sync`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedLipSyncPage({
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
          { name: t.breadcrumbFeatures, url: `https://dubsync.app/${lang}/features` },
          { name: t.breadcrumbLipSync, url: `https://dubsync.app/${lang}/features/lip-sync` },
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
            <Scan className="h-3.5 w-3.5" /> {t.badge}
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

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.howWorksTitle}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <Icon className="h-7 w-7 text-pink-400" />
                  </div>
                  <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why lip sync matters */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            {t.whyMattersTitle}
          </h2>
          <p className="text-center text-zinc-400 mb-12 max-w-xl mx-auto">
            {t.whyMattersSubtitle}
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {t.reasons.map((reason) => (
              <div
                key={reason.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Content types */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.contentTypesTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {t.contentTypes.map((ct, i) => {
              const Icon = CT_ICONS[i];
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                      <Icon className="h-5 w-5 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {ct.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {ct.description}
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
              href={`/${lang}/features/video-translation`}
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Video Translation
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

      <Footer />
    </>
  );
}
