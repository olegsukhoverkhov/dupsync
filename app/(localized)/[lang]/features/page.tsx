import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mic,
  Scan,
  Globe,
  Users,
  FileEdit,
  Code,
  Captions,
  ArrowRight,
  Upload,
  Wand2,
  Download,
  Check,
  X,
  Minus,
} from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Funciones de DubSync — Clonaci\u00f3n de Voz, Lip Sync y Doblaje con IA",
    description:
      "Descubre las funciones de doblaje con IA de DubSync: clonaci\u00f3n de voz, lip sync, m\u00e1s de 30 idiomas, detecci\u00f3n de m\u00faltiples hablantes y API.",
    h1: "Funciones de doblaje de video con IA",
    h1Highlight: "para creadores y equipos",
    subtitle:
      "Sube un video, elige tus idiomas y deja que DubSync se encargue de la clonaci\u00f3n de voz, lip sync y traducci\u00f3n. Todo lo que necesitas para llegar al mundo en minutos.",
    ctaPrimary: "Empezar gratis",
    ctaPricing: "Ver precios",
    learnMore: "M\u00e1s informaci\u00f3n",
    howItWorks: "C\u00f3mo funciona",
    howCompares: "C\u00f3mo se compara",
    comparesSubtitle:
      "Compara DubSync con otras herramientas de doblaje con IA en las funciones que m\u00e1s importan.",
    featureLabel: "Funci\u00f3n",
    readyTitle: "\u00bfListo para doblar tu primer video?",
    readySubtitle:
      "Comienza con 5 minutos gratis de doblaje. No se requiere tarjeta de cr\u00e9dito.",
    faqTitle: "Preguntas frecuentes",
    features: {
      voiceCloning: "Clonaci\u00f3n de Voz",
      voiceCloningDesc:
        "Clona la voz de cualquier hablante y conserva su tono, tono y cadencia \u00fanicos en cada idioma.",
      lipSync: "Lip Sync",
      lipSyncDesc:
        "La IA ajusta los movimientos de la boca para que coincidan con el audio doblado. El resultado se ve completamente natural.",
      languages: "M\u00e1s de 30 idiomas",
      languagesDesc:
        "Traduce y dobla videos en m\u00e1s de 30 idiomas, incluyendo espa\u00f1ol, franc\u00e9s, japon\u00e9s, hindi, \u00e1rabe y m\u00e1s.",
      multiSpeaker: "Detecci\u00f3n de m\u00faltiples hablantes",
      multiSpeakerDesc:
        "Detecta y separa autom\u00e1ticamente m\u00faltiples hablantes, clonando cada voz de forma independiente.",
      scriptEditor: "Editor de guiones",
      scriptEditorDesc:
        "Revisa, edita y ajusta los guiones traducidos antes del doblaje. Ajusta el tiempo, la redacci\u00f3n y el \u00e9nfasis.",
      api: "Acceso API",
      apiDesc:
        "Integra DubSync en tu producto o flujo de trabajo con nuestra API REST. Automatiza el doblaje a escala.",
          subtitles: "Subtítulos IA",
      subtitlesDesc:
        "Genera automáticamente subtítulos sincronizados del audio doblado. Exporta como subtítulos incrustados o archivos SRT/VTT. Personaliza fuente, color, posición y estilo.",
},
    steps: {
      step1: "Sube tu video",
      step1Desc:
        "Arrastra un archivo de video o pega un enlace de YouTube. DubSync acepta MP4, MOV y WebM de hasta 2 horas.",
      step2: "Elige idiomas y configuraci\u00f3n",
      step2Desc:
        "Selecciona tus idiomas objetivo, activa lip sync y elige la fidelidad de clonaci\u00f3n de voz.",
      step3: "Descarga el video doblado",
      step3Desc:
        "En minutos obtienes un video doblado con calidad de estudio listo para publicar en YouTube, TikTok o cualquier plataforma.",
    },
    comparison: {
      voiceCloning: "Clonaci\u00f3n de voz",
      lipSync: "Lip sync",
      languages: "M\u00e1s de 30 idiomas",
      multiSpeaker: "Detecci\u00f3n de hablantes",
      scriptEditor: "Editor de guiones",
      restApi: "API REST",
      freePlan: "Plan gratuito",
      youtubeImport: "Importar de YouTube",
          aiSubtitles: "Subtítulos IA (incrustados + SRT)",
},
    faqs: [
      {
        question: "\u00bfQu\u00e9 formatos de video admite DubSync?",
        answer:
          "DubSync admite archivos MP4, MOV y WebM de hasta 2 horas. Tambi\u00e9n puedes pegar un enlace de YouTube y el video se importa autom\u00e1ticamente. Todos los videos se entregan en MP4 a la misma resoluci\u00f3n que el original.",
      },
      {
        question: "\u00bfQu\u00e9 tan precisa es la clonaci\u00f3n de voz?",
        answer:
          "DubSync captura el tono, la altura y la cadencia del hablante con alta fidelidad. La mayor\u00eda de los oyentes no distinguen la voz clonada de la original. Para mejores resultados, usa audio con poco ruido de fondo.",
      },
      {
        question: "\u00bfPuedo editar el guion traducido antes del doblaje?",
        answer:
          "S\u00ed. Despu\u00e9s de la traducci\u00f3n, el editor de guiones integrado permite revisar y ajustar cada l\u00ednea. Puedes cambiar la redacci\u00f3n, modificar el tiempo y agregar marcadores de \u00e9nfasis.",
      },
      {
        question: "\u00bfHay una API para doblaje automatizado?",
        answer:
          "S\u00ed. DubSync ofrece una API REST disponible en los planes Pro y Enterprise. Puedes enviar videos, seleccionar idiomas y obtener resultados de forma program\u00e1tica.",
      },
    ],
    breadcrumbFeatures: "Funciones",
  },
  pt: {
    title: "Recursos do DubSync \u2014 Clonagem de Voz, Lip Sync e Dublagem com IA",
    description:
      "Conhe\u00e7a os recursos de dublagem com IA do DubSync: clonagem de voz, lip sync, mais de 30 idiomas, detec\u00e7\u00e3o de m\u00faltiplos falantes e API.",
    h1: "Recursos de dublagem de v\u00eddeo com IA",
    h1Highlight: "para criadores e equipes",
    subtitle:
      "Envie um v\u00eddeo, escolha seus idiomas e deixe o DubSync cuidar da clonagem de voz, lip sync e tradu\u00e7\u00e3o. Tudo que voc\u00ea precisa para alcan\u00e7ar o mundo em minutos.",
    ctaPrimary: "Come\u00e7ar gr\u00e1tis",
    ctaPricing: "Ver pre\u00e7os",
    learnMore: "Saiba mais",
    howItWorks: "Como funciona",
    howCompares: "Como se compara",
    comparesSubtitle:
      "Veja como o DubSync se compara com outras ferramentas de dublagem com IA nos recursos que mais importam.",
    featureLabel: "Recurso",
    readyTitle: "Pronto para dublar seu primeiro v\u00eddeo?",
    readySubtitle:
      "Comece com 5 minutos gr\u00e1tis de dublagem. Sem necessidade de cart\u00e3o de cr\u00e9dito.",
    faqTitle: "Perguntas frequentes",
    features: {
      voiceCloning: "Clonagem de Voz",
      voiceCloningDesc:
        "Clone a voz de qualquer falante e preserve seu tom, altura e cad\u00eancia \u00fanicos em cada idioma.",
      lipSync: "Lip Sync",
      lipSyncDesc:
        "A IA ajusta os movimentos da boca para corresponder ao \u00e1udio dublado. O resultado parece completamente natural.",
      languages: "Mais de 30 idiomas",
      languagesDesc:
        "Traduza e duble v\u00eddeos em mais de 30 idiomas, incluindo espanhol, franc\u00eas, japon\u00eas, hindi, \u00e1rabe e mais.",
      multiSpeaker: "Detec\u00e7\u00e3o de m\u00faltiplos falantes",
      multiSpeakerDesc:
        "Detecta e separa automaticamente m\u00faltiplos falantes, clonando cada voz independentemente.",
      scriptEditor: "Editor de roteiros",
      scriptEditorDesc:
        "Revise, edite e ajuste os roteiros traduzidos antes da dublagem. Ajuste o tempo, a reda\u00e7\u00e3o e a \u00eanfase.",
      api: "Acesso \u00e0 API",
      apiDesc:
        "Integre o DubSync ao seu produto ou fluxo de trabalho com nossa API REST. Automatize a dublagem em escala.",
          subtitles: "Legendas IA",
      subtitlesDesc:
        "Gere automaticamente legendas sincronizadas do áudio dublado. Exporte como legendas incorporadas ou arquivos SRT/VTT. Personalize fonte, cor, posição e estilo.",
},
    steps: {
      step1: "Envie seu v\u00eddeo",
      step1Desc:
        "Arraste um arquivo de v\u00eddeo ou cole um link do YouTube. O DubSync aceita MP4, MOV e WebM de at\u00e9 2 horas.",
      step2: "Escolha idiomas e configura\u00e7\u00f5es",
      step2Desc:
        "Selecione seus idiomas-alvo, ative o lip sync e escolha a fidelidade de clonagem de voz.",
      step3: "Baixe o v\u00eddeo dublado",
      step3Desc:
        "Em minutos voc\u00ea recebe um v\u00eddeo dublado com qualidade de est\u00fadio pronto para publicar no YouTube, TikTok ou qualquer plataforma.",
    },
    comparison: {
      voiceCloning: "Clonagem de voz",
      lipSync: "Lip sync",
      languages: "Mais de 30 idiomas",
      multiSpeaker: "Detec\u00e7\u00e3o de falantes",
      scriptEditor: "Editor de roteiros",
      restApi: "API REST",
      freePlan: "Plano gratuito",
      youtubeImport: "Importar do YouTube",
          aiSubtitles: "Legendas IA (incorporadas + SRT)",
},
    faqs: [
      {
        question: "Quais formatos de v\u00eddeo o DubSync suporta?",
        answer:
          "O DubSync suporta arquivos MP4, MOV e WebM de at\u00e9 2 horas. Voc\u00ea tamb\u00e9m pode colar um link do YouTube e o v\u00eddeo \u00e9 importado automaticamente. Todos os v\u00eddeos s\u00e3o entregues em MP4 na mesma resolu\u00e7\u00e3o do original.",
      },
      {
        question: "Qual \u00e9 a precis\u00e3o da clonagem de voz?",
        answer:
          "O DubSync captura o tom, a altura e a cad\u00eancia do falante com alta fidelidade. A maioria dos ouvintes n\u00e3o consegue distinguir a voz clonada da original.",
      },
      {
        question: "Posso editar o roteiro traduzido antes da dublagem?",
        answer:
          "Sim. Ap\u00f3s a tradu\u00e7\u00e3o, o editor de roteiros integrado permite revisar e ajustar cada linha. Voc\u00ea pode alterar a reda\u00e7\u00e3o, modificar o tempo e adicionar marcadores de \u00eanfase.",
      },
      {
        question: "Existe uma API para dublagem automatizada?",
        answer:
          "Sim. O DubSync oferece uma API REST dispon\u00edvel nos planos Pro e Enterprise. Voc\u00ea pode enviar v\u00eddeos, selecionar idiomas e obter resultados de forma program\u00e1tica.",
      },
    ],
    breadcrumbFeatures: "Recursos",
  },
  de: {
    title: "DubSync Funktionen \u2014 Stimmklonen, Lip Sync & KI-Videosynchronisation",
    description:
      "Entdecken Sie die KI-Synchronisationsfunktionen von DubSync: Stimmklonen, Lip Sync, \u00fcber 30 Sprachen, Multi-Sprecher-Erkennung und API.",
    h1: "KI-Videosynchronisation",
    h1Highlight: "f\u00fcr Creator und Teams",
    subtitle:
      "Laden Sie ein Video hoch, w\u00e4hlen Sie Ihre Sprachen und lassen Sie DubSync Stimmklonen, Lip Sync und \u00dcbersetzung \u00fcbernehmen. Alles, was Sie brauchen, um in Minuten global zu werden.",
    ctaPrimary: "Kostenlos starten",
    ctaPricing: "Preise ansehen",
    learnMore: "Mehr erfahren",
    howItWorks: "So funktioniert es",
    howCompares: "Im Vergleich",
    comparesSubtitle:
      "Sehen Sie, wie DubSync im Vergleich zu anderen KI-Synchronisationstools bei den wichtigsten Funktionen abschneidet.",
    featureLabel: "Funktion",
    readyTitle: "Bereit, Ihr erstes Video zu synchronisieren?",
    readySubtitle:
      "Starten Sie mit 5 kostenlosen Minuten Synchronisation. Keine Kreditkarte erforderlich.",
    faqTitle: "H\u00e4ufig gestellte Fragen",
    features: {
      voiceCloning: "Stimmklonen",
      voiceCloningDesc:
        "Klonen Sie die Stimme jedes Sprechers und bewahren Sie den einzigartigen Ton, die Tonh\u00f6he und den Rhythmus in jeder Sprache.",
      lipSync: "Lip Sync",
      lipSyncDesc:
        "Die KI passt die Mundbewegungen an das synchronisierte Audio an. Das Ergebnis sieht v\u00f6llig nat\u00fcrlich aus.",
      languages: "\u00dcber 30 Sprachen",
      languagesDesc:
        "\u00dcbersetzen und synchronisieren Sie Videos in \u00fcber 30 Sprachen, darunter Spanisch, Franz\u00f6sisch, Japanisch, Hindi, Arabisch und mehr.",
      multiSpeaker: "Multi-Sprecher-Erkennung",
      multiSpeakerDesc:
        "Erkennt und trennt automatisch mehrere Sprecher und klont jede Stimme unabh\u00e4ngig.",
      scriptEditor: "Skript-Editor",
      scriptEditorDesc:
        "Pr\u00fcfen, bearbeiten und verfeinern Sie \u00fcbersetzte Skripte vor der Synchronisation. Passen Sie Timing, Formulierung und Betonung an.",
      api: "API-Zugang",
      apiDesc:
        "Integrieren Sie DubSync in Ihr Produkt oder Ihren Workflow mit unserer REST API. Automatisieren Sie die Synchronisation im gro\u00dfen Ma\u00dfstab.",
          subtitles: "KI-Untertitel",
      subtitlesDesc:
        "Generiere automatisch synchronisierte Untertitel aus dem synchronisierten Audio. Exportiere als eingebrannte Untertitel oder SRT/VTT-Dateien. Passe Schrift, Farbe, Position und Stil an.",
},
    steps: {
      step1: "Video hochladen",
      step1Desc:
        "Ziehen Sie eine Videodatei oder f\u00fcgen Sie einen YouTube-Link ein. DubSync akzeptiert MP4, MOV und WebM bis zu 2 Stunden.",
      step2: "Sprachen & Einstellungen w\u00e4hlen",
      step2Desc:
        "W\u00e4hlen Sie Ihre Zielsprachen, aktivieren Sie Lip Sync und w\u00e4hlen Sie die Stimmklon-Treue.",
      step3: "Synchronisiertes Video herunterladen",
      step3Desc:
        "In Minuten erhalten Sie ein studioqualit\u00e4t-synchronisiertes Video, bereit f\u00fcr YouTube, TikTok oder jede andere Plattform.",
    },
    comparison: {
      voiceCloning: "Stimmklonen",
      lipSync: "Lip Sync",
      languages: "\u00dcber 30 Sprachen",
      multiSpeaker: "Sprecher-Erkennung",
      scriptEditor: "Skript-Editor",
      restApi: "REST API",
      freePlan: "Kostenloser Plan",
      youtubeImport: "YouTube-Import",
          aiSubtitles: "KI-Untertitel (eingebrannt + SRT)",
},
    faqs: [
      {
        question: "Welche Videoformate unterst\u00fctzt DubSync?",
        answer:
          "DubSync unterst\u00fctzt MP4-, MOV- und WebM-Dateien bis zu 2 Stunden L\u00e4nge. Sie k\u00f6nnen auch einen YouTube-Link einf\u00fcgen und das Video wird automatisch importiert. Alle Videos werden in MP4 in der gleichen Aufl\u00f6sung wie das Original geliefert.",
      },
      {
        question: "Wie genau ist das Stimmklonen?",
        answer:
          "DubSync erfasst den einzigartigen Ton, die Tonh\u00f6he und den Rhythmus des Sprechers mit hoher Treue. Die meisten Zuh\u00f6rer k\u00f6nnen die geklonte Stimme nicht vom Original unterscheiden.",
      },
      {
        question: "Kann ich das \u00fcbersetzte Skript vor der Synchronisation bearbeiten?",
        answer:
          "Ja. Nach der \u00dcbersetzung k\u00f6nnen Sie mit dem integrierten Skript-Editor jede Zeile \u00fcberpr\u00fcfen und anpassen. Sie k\u00f6nnen Formulierungen \u00e4ndern, Timing anpassen und Betonungsmarkierungen hinzuf\u00fcgen.",
      },
      {
        question: "Gibt es eine API f\u00fcr automatisierte Synchronisation?",
        answer:
          "Ja. DubSync bietet eine REST API, die in den Pro- und Enterprise-Pl\u00e4nen verf\u00fcgbar ist. Sie k\u00f6nnen Videos einreichen, Sprachen ausw\u00e4hlen und Ergebnisse programmatisch abrufen.",
      },
    ],
    breadcrumbFeatures: "Funktionen",
  },
  fr: {
    title: "Fonctionnalit\u00e9s DubSync \u2014 Clonage Vocal, Lip Sync et Doublage Vid\u00e9o IA",
    description:
      "D\u00e9couvrez les fonctionnalit\u00e9s de doublage IA de DubSync : clonage vocal, lip sync, plus de 30 langues, d\u00e9tection multi-locuteurs et API.",
    h1: "Fonctionnalit\u00e9s de doublage vid\u00e9o IA",
    h1Highlight: "pour cr\u00e9ateurs et \u00e9quipes",
    subtitle:
      "T\u00e9l\u00e9chargez une vid\u00e9o, choisissez vos langues et laissez DubSync g\u00e9rer le clonage vocal, le lip sync et la traduction. Tout ce qu\u2019il faut pour devenir mondial en quelques minutes.",
    ctaPrimary: "Commencer gratuitement",
    ctaPricing: "Voir les tarifs",
    learnMore: "En savoir plus",
    howItWorks: "Comment \u00e7a marche",
    howCompares: "Comparaison",
    comparesSubtitle:
      "Voyez comment DubSync se compare aux autres outils de doublage IA sur les fonctionnalit\u00e9s cl\u00e9s.",
    featureLabel: "Fonctionnalit\u00e9",
    readyTitle: "Pr\u00eat \u00e0 doubler votre premi\u00e8re vid\u00e9o ?",
    readySubtitle:
      "Commencez avec 5 minutes gratuites de doublage. Aucune carte de cr\u00e9dit requise.",
    faqTitle: "Questions fr\u00e9quentes",
    features: {
      voiceCloning: "Clonage Vocal",
      voiceCloningDesc:
        "Clonez la voix de n\u2019importe quel locuteur et pr\u00e9servez son ton, sa hauteur et sa cadence uniques dans chaque langue.",
      lipSync: "Lip Sync",
      lipSyncDesc:
        "L\u2019IA ajuste les mouvements de la bouche pour correspondre \u00e0 l\u2019audio doubl\u00e9. Le r\u00e9sultat para\u00eet compl\u00e8tement naturel.",
      languages: "Plus de 30 langues",
      languagesDesc:
        "Traduisez et doublez des vid\u00e9os dans plus de 30 langues, dont l\u2019espagnol, le fran\u00e7ais, le japonais, le hindi, l\u2019arabe et plus.",
      multiSpeaker: "D\u00e9tection multi-locuteurs",
      multiSpeakerDesc:
        "D\u00e9tecte et s\u00e9pare automatiquement les locuteurs multiples, clonant chaque voix ind\u00e9pendamment.",
      scriptEditor: "\u00c9diteur de scripts",
      scriptEditorDesc:
        "V\u00e9rifiez, modifiez et affinez les scripts traduits avant le doublage. Ajustez le timing, la formulation et l\u2019emphase.",
      api: "Acc\u00e8s API",
      apiDesc:
        "Int\u00e9grez DubSync dans votre produit ou workflow avec notre API REST. Automatisez le doublage \u00e0 grande \u00e9chelle.",
          subtitles: "Sous-titres IA",
      subtitlesDesc:
        "Générez automatiquement des sous-titres synchronisés à partir de l'audio doublé. Exportez en sous-titres incrustés ou fichiers SRT/VTT. Personnalisez police, couleur, position et style.",
},
    steps: {
      step1: "T\u00e9l\u00e9chargez votre vid\u00e9o",
      step1Desc:
        "D\u00e9posez un fichier vid\u00e9o ou collez un lien YouTube. DubSync accepte les MP4, MOV et WebM jusqu\u2019\u00e0 2 heures.",
      step2: "Choisissez langues et param\u00e8tres",
      step2Desc:
        "S\u00e9lectionnez vos langues cibles, activez le lip sync et choisissez la fid\u00e9lit\u00e9 du clonage vocal.",
      step3: "T\u00e9l\u00e9chargez la vid\u00e9o doubl\u00e9e",
      step3Desc:
        "En quelques minutes, obtenez une vid\u00e9o doubl\u00e9e de qualit\u00e9 studio pr\u00eate \u00e0 \u00eatre publi\u00e9e sur YouTube, TikTok ou toute plateforme.",
    },
    comparison: {
      voiceCloning: "Clonage vocal",
      lipSync: "Lip sync",
      languages: "Plus de 30 langues",
      multiSpeaker: "D\u00e9tection de locuteurs",
      scriptEditor: "\u00c9diteur de scripts",
      restApi: "API REST",
      freePlan: "Plan gratuit",
      youtubeImport: "Import YouTube",
          aiSubtitles: "Sous-titres IA (incrustés + SRT)",
},
    faqs: [
      {
        question: "Quels formats vid\u00e9o DubSync prend-il en charge ?",
        answer:
          "DubSync prend en charge les fichiers MP4, MOV et WebM jusqu\u2019\u00e0 2 heures. Vous pouvez aussi coller un lien YouTube et la vid\u00e9o est import\u00e9e automatiquement. Toutes les vid\u00e9os sont livr\u00e9es en MP4 \u00e0 la m\u00eame r\u00e9solution que l\u2019original.",
      },
      {
        question: "Quelle est la pr\u00e9cision du clonage vocal ?",
        answer:
          "DubSync capture le ton, la hauteur et la cadence uniques du locuteur avec une haute fid\u00e9lit\u00e9. La plupart des auditeurs ne distinguent pas la voix clon\u00e9e de l\u2019originale.",
      },
      {
        question: "Puis-je modifier le script traduit avant le doublage ?",
        answer:
          "Oui. Apr\u00e8s la traduction, l\u2019\u00e9diteur de scripts int\u00e9gr\u00e9 vous permet de v\u00e9rifier et d\u2019ajuster chaque ligne. Vous pouvez changer la formulation, modifier le timing et ajouter des marqueurs d\u2019emphase.",
      },
      {
        question: "Y a-t-il une API pour le doublage automatis\u00e9 ?",
        answer:
          "Oui. DubSync propose une API REST disponible dans les plans Pro et Enterprise. Vous pouvez soumettre des vid\u00e9os, s\u00e9lectionner des langues et obtenir des r\u00e9sultats de mani\u00e8re programmatique.",
      },
    ],
    breadcrumbFeatures: "Fonctionnalit\u00e9s",
  },
  ja: {
    title: "DubSync\u306e\u6a5f\u80fd \u2014 \u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3001AI\u52d5\u753b\u5439\u304d\u66ff\u3048",
    description:
      "DubSync\u306eAI\u5439\u304d\u66ff\u3048\u6a5f\u80fd\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\uff1a\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u300130\u4ee5\u4e0a\u306e\u8a00\u8a9e\u3001\u8907\u6570\u8a71\u8005\u691c\u51fa\u3001API\u3002",
    h1: "AI\u52d5\u753b\u5439\u304d\u66ff\u3048\u6a5f\u80fd",
    h1Highlight: "\u30af\u30ea\u30a8\u30a4\u30bf\u30fc\u3068\u30c1\u30fc\u30e0\u306e\u305f\u3081\u306b",
    subtitle:
      "\u52d5\u753b\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u3001\u8a00\u8a9e\u3092\u9078\u3073\u3001DubSync\u306b\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3001\u7ffb\u8a33\u3092\u304a\u4efb\u305b\u304f\u3060\u3055\u3044\u3002\u6570\u5206\u3067\u4e16\u754c\u306b\u5c55\u958b\u3067\u304d\u307e\u3059\u3002",
    ctaPrimary: "\u7121\u6599\u3067\u59cb\u3081\u308b",
    ctaPricing: "\u6599\u91d1\u3092\u898b\u308b",
    learnMore: "\u8a73\u3057\u304f\u898b\u308b",
    howItWorks: "\u4f7f\u3044\u65b9",
    howCompares: "\u6bd4\u8f03",
    comparesSubtitle:
      "\u91cd\u8981\u306a\u6a5f\u80fd\u3067DubSync\u3092\u4ed6\u306eAI\u5439\u304d\u66ff\u3048\u30c4\u30fc\u30eb\u3068\u6bd4\u8f03\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    featureLabel: "\u6a5f\u80fd",
    readyTitle: "\u6700\u521d\u306e\u52d5\u753b\u3092\u5439\u304d\u66ff\u3048\u308b\u6e96\u5099\u306f\u3067\u304d\u307e\u3057\u305f\u304b\uff1f",
    readySubtitle:
      "5\u5206\u9593\u306e\u7121\u6599\u5439\u304d\u66ff\u3048\u3067\u59cb\u3081\u307e\u3057\u3087\u3046\u3002\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u306f\u4e0d\u8981\u3067\u3059\u3002",
    faqTitle: "\u3088\u304f\u3042\u308b\u8cea\u554f",
    features: {
      voiceCloning: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3",
      voiceCloningDesc:
        "\u3042\u3089\u3086\u308b\u8a71\u8005\u306e\u58f0\u3092\u30af\u30ed\u30fc\u30f3\u3057\u3001\u5404\u8a00\u8a9e\u3067\u305d\u306e\u72ec\u81ea\u306e\u30c8\u30fc\u30f3\u3001\u30d4\u30c3\u30c1\u3001\u30b1\u30a4\u30c7\u30f3\u30b9\u3092\u4fdd\u6301\u3057\u307e\u3059\u3002",
      lipSync: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af",
      lipSyncDesc:
        "AI\u304c\u53e3\u306e\u52d5\u304d\u3092\u5439\u304d\u66ff\u3048\u97f3\u58f0\u306b\u5408\u308f\u305b\u3066\u8abf\u6574\u3057\u307e\u3059\u3002\u7d50\u679c\u306f\u5b8c\u5168\u306b\u81ea\u7136\u306b\u898b\u3048\u307e\u3059\u3002",
      languages: "30\u4ee5\u4e0a\u306e\u8a00\u8a9e",
      languagesDesc:
        "\u30b9\u30da\u30a4\u30f3\u8a9e\u3001\u30d5\u30e9\u30f3\u30b9\u8a9e\u3001\u65e5\u672c\u8a9e\u3001\u30d2\u30f3\u30c7\u30a3\u30fc\u8a9e\u3001\u30a2\u30e9\u30d3\u30a2\u8a9e\u306a\u306930\u4ee5\u4e0a\u306e\u8a00\u8a9e\u306b\u52d5\u753b\u3092\u7ffb\u8a33\u30fb\u5439\u304d\u66ff\u3048\u3002",
      multiSpeaker: "\u8907\u6570\u8a71\u8005\u691c\u51fa",
      multiSpeakerDesc:
        "\u52d5\u753b\u5185\u306e\u8907\u6570\u306e\u8a71\u8005\u3092\u81ea\u52d5\u7684\u306b\u691c\u51fa\u30fb\u5206\u96e2\u3057\u3001\u5404\u58f0\u3092\u72ec\u7acb\u3057\u3066\u30af\u30ed\u30fc\u30f3\u3057\u307e\u3059\u3002",
      scriptEditor: "\u30b9\u30af\u30ea\u30d7\u30c8\u30a8\u30c7\u30a3\u30bf",
      scriptEditorDesc:
        "\u5439\u304d\u66ff\u3048\u524d\u306b\u7ffb\u8a33\u6e08\u307f\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u78ba\u8a8d\u30fb\u7de8\u96c6\u30fb\u5fae\u8abf\u6574\u3002\u30bf\u30a4\u30df\u30f3\u30b0\u3001\u8868\u73fe\u3001\u5f37\u8abf\u3092\u8abf\u6574\u3067\u304d\u307e\u3059\u3002",
      api: "API\u30a2\u30af\u30bb\u30b9",
      apiDesc:
        "REST API\u3067DubSync\u3092\u88fd\u54c1\u3084\u30ef\u30fc\u30af\u30d5\u30ed\u30fc\u306b\u7d71\u5408\u3002\u5439\u304d\u66ff\u3048\u3092\u5927\u898f\u6a21\u306b\u81ea\u52d5\u5316\u3067\u304d\u307e\u3059\u3002",
          subtitles: "AI字幕",
      subtitlesDesc:
        "吹き替え音声から完全に同期した字幕を自動生成。焼き付け字幕またはSRT/VTTファイルとしてエクスポート。フォント、色、位置、スタイルをカスタマイズ。",
},
    steps: {
      step1: "\u52d5\u753b\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",
      step1Desc:
        "\u52d5\u753b\u30d5\u30a1\u30a4\u30eb\u3092\u30c9\u30e9\u30c3\u30b0\u307e\u305f\u306fYouTube\u30ea\u30f3\u30af\u3092\u8cbc\u308a\u4ed8\u3051\u3002DubSync\u306fMP4\u3001MOV\u3001WebM\uff082\u6642\u9593\u307e\u3067\uff09\u306b\u5bfe\u5fdc\u3002",
      step2: "\u8a00\u8a9e\u3068\u8a2d\u5b9a\u3092\u9078\u629e",
      step2Desc:
        "\u30bf\u30fc\u30b2\u30c3\u30c8\u8a00\u8a9e\u3092\u9078\u629e\u3057\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3092\u6709\u52b9\u306b\u3057\u3001\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306e\u5fe0\u5b9f\u5ea6\u3092\u9078\u3073\u307e\u3059\u3002",
      step3: "\u5439\u304d\u66ff\u3048\u52d5\u753b\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9",
      step3Desc:
        "\u6570\u5206\u3067\u30b9\u30bf\u30b8\u30aa\u54c1\u8cea\u306e\u5439\u304d\u66ff\u3048\u52d5\u753b\u304c\u5b8c\u6210\u3002YouTube\u3001TikTok\u3001\u305d\u306e\u4ed6\u3042\u3089\u3086\u308b\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u306b\u516c\u958b\u3067\u304d\u307e\u3059\u3002",
    },
    comparison: {
      voiceCloning: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3",
      lipSync: "\u30ea\u30c3\u30d7\u30b7\u30f3\u30af",
      languages: "30\u4ee5\u4e0a\u306e\u8a00\u8a9e",
      multiSpeaker: "\u8a71\u8005\u691c\u51fa",
      scriptEditor: "\u30b9\u30af\u30ea\u30d7\u30c8\u30a8\u30c7\u30a3\u30bf",
      restApi: "REST API",
      freePlan: "\u7121\u6599\u30d7\u30e9\u30f3",
      youtubeImport: "YouTube\u30a4\u30f3\u30dd\u30fc\u30c8",
          aiSubtitles: "AI字幕（焼き付け + SRT）",
},
    faqs: [
      {
        question: "DubSync\u306f\u3069\u306e\u52d5\u753b\u30d5\u30a9\u30fc\u30de\u30c3\u30c8\u306b\u5bfe\u5fdc\u3057\u3066\u3044\u307e\u3059\u304b\uff1f",
        answer:
          "DubSync\u306fMP4\u3001MOV\u3001WebM\u30d5\u30a1\u30a4\u30eb\uff082\u6642\u9593\u307e\u3067\uff09\u306b\u5bfe\u5fdc\u3057\u3066\u3044\u307e\u3059\u3002YouTube\u30ea\u30f3\u30af\u3092\u8cbc\u308a\u4ed8\u3051\u308b\u3068\u81ea\u52d5\u7684\u306b\u30a4\u30f3\u30dd\u30fc\u30c8\u3055\u308c\u307e\u3059\u3002\u5168\u3066\u306e\u52d5\u753b\u306f\u30aa\u30ea\u30b8\u30ca\u30eb\u3068\u540c\u3058\u89e3\u50cf\u5ea6\u306eMP4\u3067\u7d0d\u54c1\u3055\u308c\u307e\u3059\u3002",
      },
      {
        question: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306e\u7cbe\u5ea6\u306f\u3069\u306e\u304f\u3089\u3044\u3067\u3059\u304b\uff1f",
        answer:
          "DubSync\u306f\u8a71\u8005\u306e\u72ec\u81ea\u306e\u30c8\u30fc\u30f3\u3001\u30d4\u30c3\u30c1\u3001\u30b1\u30a4\u30c7\u30f3\u30b9\u3092\u9ad8\u3044\u5fe0\u5b9f\u5ea6\u3067\u30ad\u30e3\u30d7\u30c1\u30e3\u3057\u307e\u3059\u3002\u307b\u3068\u3093\u3069\u306e\u30ea\u30b9\u30ca\u30fc\u306f\u30af\u30ed\u30fc\u30f3\u3055\u308c\u305f\u58f0\u3068\u30aa\u30ea\u30b8\u30ca\u30eb\u3092\u533a\u5225\u3067\u304d\u307e\u305b\u3093\u3002",
      },
      {
        question: "\u5439\u304d\u66ff\u3048\u524d\u306b\u7ffb\u8a33\u6e08\u307f\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u7de8\u96c6\u3067\u304d\u307e\u3059\u304b\uff1f",
        answer:
          "\u306f\u3044\u3002\u7ffb\u8a33\u5f8c\u3001\u5185\u8535\u306e\u30b9\u30af\u30ea\u30d7\u30c8\u30a8\u30c7\u30a3\u30bf\u3067\u5404\u884c\u3092\u78ba\u8a8d\u30fb\u8abf\u6574\u3067\u304d\u307e\u3059\u3002\u8868\u73fe\u306e\u5909\u66f4\u3001\u30bf\u30a4\u30df\u30f3\u30b0\u306e\u4fee\u6b63\u3001\u5f37\u8abf\u30de\u30fc\u30ab\u30fc\u306e\u8ffd\u52a0\u304c\u53ef\u80fd\u3067\u3059\u3002",
      },
      {
        question: "\u81ea\u52d5\u5439\u304d\u66ff\u3048\u7528\u306eAPI\u306f\u3042\u308a\u307e\u3059\u304b\uff1f",
        answer:
          "\u306f\u3044\u3002DubSync\u306fPro\u304a\u3088\u3073Enterprise\u30d7\u30e9\u30f3\u3067\u5229\u7528\u53ef\u80fd\u306aREST API\u3092\u63d0\u4f9b\u3057\u3066\u3044\u307e\u3059\u3002\u52d5\u753b\u306e\u9001\u4fe1\u3001\u8a00\u8a9e\u306e\u9078\u629e\u3001\u7d50\u679c\u306e\u53d6\u5f97\u3092\u30d7\u30ed\u30b0\u30e9\u30e0\u3067\u884c\u3048\u307e\u3059\u3002",
      },
    ],
    breadcrumbFeatures: "\u6a5f\u80fd",
  },
};

type Lang = keyof typeof TRANSLATIONS;

const COMPARISON_DATA = [
  { dubsync: true, heygen: true, rask: true, elevenlabs: "partial" as const },
  { dubsync: true, heygen: true, rask: "partial" as const, elevenlabs: false },
  { dubsync: true, heygen: true, rask: true, elevenlabs: true },
  { dubsync: true, heygen: false, rask: true, elevenlabs: false },
  { dubsync: true, heygen: false, rask: true, elevenlabs: false },
  { dubsync: true, heygen: true, rask: true, elevenlabs: true },
  { dubsync: true, heygen: false, rask: true, elevenlabs: true },
  { dubsync: true, heygen: false, rask: true, elevenlabs: false },
  // AI Subtitles (burned-in + SRT). Same row index as the new
  // `comparison.aiSubtitles` label in every TRANSLATIONS block.
  { dubsync: true, heygen: "partial" as const, rask: "partial" as const, elevenlabs: false },
];

function ComparisonIcon({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="h-5 w-5 text-green-400" aria-label="Yes" />;
  if (value === "partial")
    return <Minus className="h-5 w-5 text-yellow-400" aria-label="Partial" />;
  return <X className="h-5 w-5 text-zinc-600" aria-label="No" />;
}

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
        ? "https://dubsync.app/features"
        : `https://dubsync.app/${l}/features`;
  }
  langAlternates["x-default"] = "https://dubsync.app/features";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/features`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/features`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedFeaturesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();
  const t = TRANSLATIONS[lang as Lang];
  if (!t) notFound();

  const features = [
    {
      icon: Mic,
      title: t.features.voiceCloning,
      description: t.features.voiceCloningDesc,
      href: `/${lang}/features/voice-cloning`,
    },
    {
      icon: Scan,
      title: t.features.lipSync,
      description: t.features.lipSyncDesc,
      href: `/${lang}/features/lip-sync`,
    },
    {
      icon: Globe,
      title: t.features.languages,
      description: t.features.languagesDesc,
      href: `/${lang}/features/video-translation`,
    },
    {
      icon: Users,
      title: t.features.multiSpeaker,
      description: t.features.multiSpeakerDesc,
      href: `/${lang}/features`,
    },
    {
      icon: FileEdit,
      title: t.features.scriptEditor,
      description: t.features.scriptEditorDesc,
      href: `/${lang}/features`,
    },
    {
      icon: Code,
      title: t.features.api,
      description: t.features.apiDesc,
      href: `/${lang}/features/api`,
    },
    {
      // AI Subtitles — 7th card, localized. Injected via the
      // inline dict `subtitles`/`subtitlesDesc` keys added to
      // each TRANSLATIONS block.
      icon: Captions,
      title: (t.features as Record<string, string>).subtitles ?? "AI Subtitles",
      description:
        (t.features as Record<string, string>).subtitlesDesc ??
        "Auto-generate perfectly synced subtitles from dubbed audio. Export as burned-in captions or SRT/VTT files.",
      href: `/${lang}/features/subtitles`,
    },
  ];

  const steps = [
    { icon: Upload, number: "01", title: t.steps.step1, description: t.steps.step1Desc },
    { icon: Wand2, number: "02", title: t.steps.step2, description: t.steps.step2Desc },
    { icon: Download, number: "03", title: t.steps.step3, description: t.steps.step3Desc },
  ];

  const comparisonLabels = [
    t.comparison.voiceCloning,
    t.comparison.lipSync,
    t.comparison.languages,
    t.comparison.multiSpeaker,
    t.comparison.scriptEditor,
    t.comparison.restApi,
    t.comparison.freePlan,
    t.comparison.youtubeImport,
    // AI Subtitles row — matches the new 9th entry in COMPARISON_DATA.
    (t.comparison as Record<string, string>).aiSubtitles ??
      "AI Subtitles (burned-in + SRT)",
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          {
            name: t.breadcrumbFeatures,
            url: `https://dubsync.app/${lang}/features`,
          },
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t.h1}{" "}
            <span className="gradient-text">{t.h1Highlight}</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="gradient-button rounded-lg px-6 py-3 text-sm font-medium"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
            >
              {t.ctaPricing}
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 transition-colors hover:border-pink-500/30 hover:bg-slate-800/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <feature.icon className="h-6 w-6 text-pink-400" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-pink-400 group-hover:gap-2 transition-all">
                  {t.learnMore} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.howItWorks}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <step.icon className="h-7 w-7 text-pink-400" />
                </div>
                <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                  Step {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            {t.howCompares}
          </h2>
          <p className="text-center text-zinc-400 mb-10 max-w-xl mx-auto">
            {t.comparesSubtitle}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-slate-800/50">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    {t.featureLabel}
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-pink-400">
                    DubSync
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-zinc-300">
                    HeyGen
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-zinc-300">
                    Rask AI
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-zinc-300">
                    ElevenLabs
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonLabels.map((label, i) => (
                  <tr
                    key={label}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-6 py-4 text-zinc-300">{label}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={COMPARISON_DATA[i].dubsync} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={COMPARISON_DATA[i].heygen} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={COMPARISON_DATA[i].rask} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={COMPARISON_DATA[i].elevenlabs} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t.readyTitle}
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              {t.readySubtitle}
            </p>
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-8 py-3 text-sm font-medium"
            >
              {t.ctaPrimary}
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
      </main>

    </>
  );
}
