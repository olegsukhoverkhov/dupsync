import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mic,
  AudioWaveform,
  Languages,
  Sparkles,
  Video,
  GraduationCap,
  Megaphone,
  ArrowRight,
  Shield,
  Gauge,
  Settings2,
} from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const TRANSLATIONS = {
  es: {
    title: "Clonaci\u00f3n de Voz con IA para Doblaje de Video \u2014 Tu Voz en Cualquier Idioma | DubSync",
    description:
      "Clona tu voz con IA y dobla videos en m\u00e1s de 30 idiomas manteniendo tu tono, tono y cadencia \u00fanicos. Resultados de calidad de estudio en minutos.",
    badge: "Clonaci\u00f3n de Voz",
    h1: "Clonaci\u00f3n de voz con IA \u2014",
    h1Highlight: "tu voz, cualquier idioma",
    subtitle:
      "DubSync clona tu voz con IA y la habla con fluidez en m\u00e1s de 30 idiomas. Tu tono, tu cadencia, tu personalidad \u2014 preservados en cada versi\u00f3n doblada.",
    cta: "Probar clonaci\u00f3n de voz gratis",
    howWorksTitle: "C\u00f3mo funciona la clonaci\u00f3n de voz",
    capabilitiesTitle: "Capacidades clave",
    useCasesTitle: "Casos de uso de la clonaci\u00f3n de voz",
    ctaTitle: "Clona tu voz y conquista el mundo",
    ctaSubtitle: "Comienza con 5 minutos gratis. Sin tarjeta de cr\u00e9dito.",
    ctaButton: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    steps: [
      { title: "Analizar la voz original", description: "La IA de DubSync escucha el audio fuente, aislando caracter\u00edsticas vocales como tono, timbre, velocidad del habla y tono emocional del ruido de fondo y la m\u00fasica." },
      { title: "Crear un perfil de voz", description: "El sistema crea un modelo neuronal de voz que captura lo que hace \u00fanica la voz del hablante. Este perfil impulsa todas las traducciones posteriores." },
      { title: "Sintetizar en idiomas objetivo", description: "Usando el perfil de voz, la IA genera habla en cada idioma seleccionado. La voz clonada preserva la identidad del hablante con pronunciaci\u00f3n nativa." },
      { title: "Ajustar tiempo y emoci\u00f3n", description: "La salida se ajusta autom\u00e1ticamente para que la duraci\u00f3n del habla coincida con el video original. Las inflexiones emocionales se conservan." },
    ],
    capabilities: [
      { title: "Clonaci\u00f3n de alta fidelidad", description: "Nuestro modelo captura m\u00e1s de 40 par\u00e1metros vocales por hablante, produciendo resultados que los oyentes califican consistentemente como indistinguibles del original." },
      { title: "Fidelidad ajustable", description: "Elige entre clonaci\u00f3n Standard y Ultra. Standard es r\u00e1pida y adecuada para la mayor\u00eda del contenido. Ultra ofrece m\u00e1xima precisi\u00f3n para producciones profesionales." },
      { title: "Salvaguardas \u00e9ticas", description: "La clonaci\u00f3n de voz est\u00e1 restringida al contenido que posees o para el que tienes derechos. Toda la salida clonada incluye una marca de agua digital inaudible." },
    ],
    useCases: [
      { title: "Creadores de YouTube", description: "Llega a una audiencia global sin perder tu personalidad. Dobla tus videos a espa\u00f1ol, portugu\u00e9s, hindi y m\u00e1s sonando como t\u00fa en cada idioma." },
      { title: "E-learning y cursos", description: "Traduce materiales de formaci\u00f3n y cursos online manteniendo la consistencia de la voz del instructor en todas las versiones." },
      { title: "Marketing y publicidad", description: "Localiza anuncios de video para campa\u00f1as internacionales. Mant\u00e9n la voz de marca consistente en todos los mercados." },
    ],
    faqs: [
      { question: "\u00bfCu\u00e1nto audio fuente necesita la IA para la clonaci\u00f3n de voz?", answer: "DubSync necesita al menos 30 segundos de habla clara para crear un perfil de voz confiable. Muestras m\u00e1s largas (2-5 minutos) producen resultados de mayor fidelidad." },
      { question: "\u00bfFunciona la clonaci\u00f3n de voz con m\u00faltiples hablantes?", answer: "S\u00ed. DubSync detecta y separa autom\u00e1ticamente a los hablantes individuales, clonando cada voz de forma independiente." },
      { question: "\u00bfPuedo usar la clonaci\u00f3n de voz en contenido que no cre\u00e9?", answer: "La clonaci\u00f3n de voz solo est\u00e1 disponible para contenido que posees o para el que tienes derechos expl\u00edcitos de doblaje." },
      { question: "\u00bfCu\u00e1l es la diferencia entre clonaci\u00f3n Standard y Ultra?", answer: "Standard est\u00e1 optimizada para velocidad y es adecuada para la mayor\u00eda del contenido. Ultra usa un modelo neuronal m\u00e1s grande con m\u00e1s par\u00e1metros vocales para m\u00e1xima fidelidad profesional." },
    ],
    breadcrumbFeatures: "Funciones",
    breadcrumbVoiceCloning: "Clonaci\u00f3n de Voz",
  },
  pt: {
    title: "Clonagem de Voz com IA para Dublagem \u2014 Sua Voz em Qualquer Idioma | DubSync",
    description:
      "Clone sua voz com IA e duble v\u00eddeos em mais de 30 idiomas mantendo seu tom, altura e cad\u00eancia \u00fanicos. Resultados de qualidade de est\u00fadio em minutos.",
    badge: "Clonagem de Voz",
    h1: "Clonagem de voz com IA \u2014",
    h1Highlight: "sua voz, qualquer idioma",
    subtitle:
      "O DubSync clona sua voz com IA e fala com flu\u00eancia em mais de 30 idiomas. Seu tom, sua cad\u00eancia, sua personalidade \u2014 preservados em cada vers\u00e3o dublada.",
    cta: "Experimentar clonagem de voz gr\u00e1tis",
    howWorksTitle: "Como a clonagem de voz funciona",
    capabilitiesTitle: "Capacidades principais",
    useCasesTitle: "Casos de uso da clonagem de voz",
    ctaTitle: "Clone sua voz e conquiste o mundo",
    ctaSubtitle: "Comece com 5 minutos gr\u00e1tis. Sem cart\u00e3o de cr\u00e9dito.",
    ctaButton: "Come\u00e7ar gr\u00e1tis",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Recursos relacionados",
    allFeatures: "Todos os recursos",
    steps: [
      { title: "Analisar a voz original", description: "A IA do DubSync ouve o \u00e1udio fonte, isolando caracter\u00edsticas vocais como tom, timbre, velocidade da fala e tom emocional do ru\u00eddo de fundo e m\u00fasica." },
      { title: "Criar um perfil de voz", description: "O sistema cria um modelo neural de voz que captura o que torna a voz do falante \u00fanica. Este perfil conduz todas as tradu\u00e7\u00f5es subsequentes." },
      { title: "Sintetizar nos idiomas-alvo", description: "Usando o perfil de voz, a IA gera fala em cada idioma selecionado. A voz clonada preserva a identidade do falante com pron\u00fancia nativa." },
      { title: "Ajustar tempo e emo\u00e7\u00e3o", description: "A sa\u00edda \u00e9 ajustada automaticamente para que a dura\u00e7\u00e3o da fala coincida com o v\u00eddeo original. As inflex\u00f5es emocionais s\u00e3o preservadas." },
    ],
    capabilities: [
      { title: "Clonagem de alta fidelidade", description: "Nosso modelo captura mais de 40 par\u00e2metros vocais por falante, produzindo resultados que os ouvintes consistentemente classificam como indistingu\u00edveis do original." },
      { title: "Fidelidade ajust\u00e1vel", description: "Escolha entre clonagem Standard e Ultra. Standard \u00e9 r\u00e1pida e adequada para a maioria do conte\u00fado. Ultra oferece m\u00e1xima precis\u00e3o para produ\u00e7\u00f5es profissionais." },
      { title: "Salvaguardas \u00e9ticas", description: "A clonagem de voz \u00e9 restrita ao conte\u00fado que voc\u00ea possui ou para o qual tem direitos. Toda sa\u00edda clonada inclui uma marca d\u2019\u00e1gua digital inaud\u00edvel." },
    ],
    useCases: [
      { title: "Criadores do YouTube", description: "Alcance um p\u00fablico global sem perder sua personalidade. Duble seus v\u00eddeos em espanhol, portugu\u00eas, hindi e mais, soando como voc\u00ea em cada idioma." },
      { title: "E-learning e cursos", description: "Traduza materiais de treinamento e cursos online mantendo a consist\u00eancia da voz do instrutor em todas as vers\u00f5es." },
      { title: "Marketing e publicidade", description: "Localize an\u00fancios de v\u00eddeo para campanhas internacionais. Mantenha a voz da marca consistente em todos os mercados." },
    ],
    faqs: [
      { question: "Quanto \u00e1udio fonte a IA precisa para a clonagem de voz?", answer: "O DubSync precisa de pelo menos 30 segundos de fala clara para criar um perfil de voz confi\u00e1vel. Amostras mais longas (2-5 minutos) produzem resultados de maior fidelidade." },
      { question: "A clonagem de voz funciona com m\u00faltiplos falantes?", answer: "Sim. O DubSync detecta e separa automaticamente os falantes individuais, clonando cada voz de forma independente." },
      { question: "Posso usar clonagem de voz em conte\u00fado que n\u00e3o criei?", answer: "A clonagem de voz s\u00f3 est\u00e1 dispon\u00edvel para conte\u00fado que voc\u00ea possui ou para o qual tem direitos expl\u00edcitos de dublagem." },
      { question: "Qual \u00e9 a diferen\u00e7a entre clonagem Standard e Ultra?", answer: "Standard \u00e9 otimizada para velocidade e adequada para a maioria do conte\u00fado. Ultra usa um modelo neural maior com mais par\u00e2metros vocais para m\u00e1xima fidelidade profissional." },
    ],
    breadcrumbFeatures: "Recursos",
    breadcrumbVoiceCloning: "Clonagem de Voz",
  },
  de: {
    title: "KI-Stimmklonen f\u00fcr Video-Synchronisation \u2014 Ihre Stimme in Jeder Sprache | DubSync",
    description:
      "Klonen Sie Ihre Stimme mit KI und synchronisieren Sie Videos in \u00fcber 30 Sprachen. Studio-Qualit\u00e4t in Minuten.",
    badge: "Stimmklonen",
    h1: "KI-Stimmklonen \u2014",
    h1Highlight: "Ihre Stimme, jede Sprache",
    subtitle:
      "DubSync klont Ihre Stimme mit KI und spricht sie flie\u00dfend in \u00fcber 30 Sprachen. Ihr Ton, Ihr Rhythmus, Ihre Pers\u00f6nlichkeit \u2014 in jeder synchronisierten Version bewahrt.",
    cta: "Stimmklonen kostenlos testen",
    howWorksTitle: "So funktioniert das Stimmklonen",
    capabilitiesTitle: "Wesentliche F\u00e4higkeiten",
    useCasesTitle: "Anwendungsf\u00e4lle f\u00fcr Stimmklonen",
    ctaTitle: "Klonen Sie Ihre Stimme und werden Sie global",
    ctaSubtitle: "Starten Sie mit 5 kostenlosen Minuten. Keine Kreditkarte erforderlich.",
    ctaButton: "Kostenlos starten",
    faqTitle: "H\u00e4ufig gestellte Fragen",
    relatedTitle: "Verwandte Funktionen",
    allFeatures: "Alle Funktionen",
    steps: [
      { title: "Originalstimme analysieren", description: "DubSyncs KI h\u00f6rt das Quellaudio und isoliert Stimmmerkmale wie Tonh\u00f6he, Klangfarbe, Sprechgeschwindigkeit und emotionalen Ton von Hintergrundger\u00e4uschen und Musik." },
      { title: "Stimmprofil erstellen", description: "Das System erstellt ein neuronales Stimmmodell, das die einzigartigen Merkmale der Stimme erfasst. Dieses Profil steuert alle nachfolgenden \u00dcbersetzungen." },
      { title: "In Zielsprachen synthetisieren", description: "Mit dem Stimmprofil generiert die KI Sprache in jeder ausgew\u00e4hlten Sprache. Die geklonte Stimme bewahrt die Identit\u00e4t des Sprechers mit muttersprachlicher Aussprache." },
      { title: "Timing und Emotionen anpassen", description: "Die Ausgabe wird automatisch angepasst, damit die Sprechdauer mit dem Originalvideo \u00fcbereinstimmt. Emotionale Betonungen werden \u00fcbernommen." },
    ],
    capabilities: [
      { title: "High-Fidelity-Klonen", description: "Unser Modell erfasst \u00fcber 40 Stimmparameter pro Sprecher und produziert Ergebnisse, die Zuh\u00f6rer durchg\u00e4ngig als nicht vom Original unterscheidbar bewerten." },
      { title: "Einstellbare Treue", description: "W\u00e4hlen Sie zwischen Standard- und Ultra-Stimmklonen. Standard ist schnell und f\u00fcr die meisten Inhalte geeignet. Ultra liefert maximale Genauigkeit f\u00fcr professionelle Produktionen." },
      { title: "Ethische Schutzma\u00dfnahmen", description: "Stimmklonen ist auf Inhalte beschr\u00e4nkt, die Sie besitzen oder f\u00fcr die Sie Rechte haben. Alle geklonten Ausgaben enthalten ein unh\u00f6rbares digitales Wasserzeichen." },
    ],
    useCases: [
      { title: "YouTube-Creator", description: "Erreichen Sie ein globales Publikum, ohne Ihre Pers\u00f6nlichkeit zu verlieren. Synchronisieren Sie Ihre Videos auf Spanisch, Portugiesisch, Hindi und mehr \u2014 und klingen Sie in jeder Sprache wie Sie selbst." },
      { title: "E-Learning & Kurse", description: "\u00dcbersetzen Sie Schulungsmaterialien und Online-Kurse bei gleichbleibender Stimmkonsistenz des Dozenten \u00fcber alle Sprachversionen." },
      { title: "Marketing & Werbung", description: "Lokalisieren Sie Videowerbung f\u00fcr internationale Kampagnen. Halten Sie die Markenstimme in allen M\u00e4rkten konsistent." },
    ],
    faqs: [
      { question: "Wie viel Quellaudio ben\u00f6tigt die KI f\u00fcr das Stimmklonen?", answer: "DubSync ben\u00f6tigt mindestens 30 Sekunden klares Sprechen f\u00fcr ein zuverl\u00e4ssiges Stimmprofil. L\u00e4ngere Proben (2-5 Minuten) liefern h\u00f6here Treue." },
      { question: "Funktioniert Stimmklonen mit mehreren Sprechern?", answer: "Ja. DubSync erkennt und trennt automatisch einzelne Sprecher und klont jede Stimme unabh\u00e4ngig." },
      { question: "Kann ich Stimmklonen bei Inhalten verwenden, die ich nicht erstellt habe?", answer: "Stimmklonen ist nur f\u00fcr Inhalte verf\u00fcgbar, die Sie besitzen oder f\u00fcr die Sie ausdr\u00fcckliche Synchronisationsrechte haben." },
      { question: "Was ist der Unterschied zwischen Standard- und Ultra-Stimmklonen?", answer: "Standard ist f\u00fcr Geschwindigkeit optimiert und f\u00fcr die meisten Inhalte geeignet. Ultra verwendet ein gr\u00f6\u00dferes neuronales Modell mit mehr Stimmparametern f\u00fcr maximale professionelle Treue." },
    ],
    breadcrumbFeatures: "Funktionen",
    breadcrumbVoiceCloning: "Stimmklonen",
  },
  fr: {
    title: "Clonage Vocal IA pour Doublage Vid\u00e9o \u2014 Votre Voix dans Toute Langue | DubSync",
    description:
      "Clonez votre voix avec l\u2019IA et doublez des vid\u00e9os dans plus de 30 langues en conservant votre ton, hauteur et cadence uniques. Qualit\u00e9 studio en minutes.",
    badge: "Clonage Vocal",
    h1: "Clonage vocal IA \u2014",
    h1Highlight: "votre voix, toute langue",
    subtitle:
      "DubSync clone votre voix avec l\u2019IA et la parle couramment dans plus de 30 langues. Votre ton, votre cadence, votre personnalit\u00e9 \u2014 pr\u00e9serv\u00e9s dans chaque version doubl\u00e9e.",
    cta: "Essayer le clonage vocal gratuitement",
    howWorksTitle: "Comment fonctionne le clonage vocal",
    capabilitiesTitle: "Capacit\u00e9s cl\u00e9s",
    useCasesTitle: "Cas d\u2019utilisation du clonage vocal",
    ctaTitle: "Clonez votre voix et devenez mondial",
    ctaSubtitle: "Commencez avec 5 minutes gratuites. Aucune carte de cr\u00e9dit requise.",
    ctaButton: "Commencer gratuitement",
    faqTitle: "Questions fr\u00e9quentes",
    relatedTitle: "Fonctionnalit\u00e9s connexes",
    allFeatures: "Toutes les fonctionnalit\u00e9s",
    steps: [
      { title: "Analyser la voix originale", description: "L\u2019IA de DubSync \u00e9coute l\u2019audio source, isolant les caract\u00e9ristiques vocales comme la hauteur, le timbre, le d\u00e9bit et le ton \u00e9motionnel du bruit de fond et de la musique." },
      { title: "Cr\u00e9er un profil vocal", description: "Le syst\u00e8me cr\u00e9e un mod\u00e8le neuronal vocal capturant ce qui rend la voix du locuteur unique. Ce profil dirige toutes les traductions ult\u00e9rieures." },
      { title: "Synth\u00e9tiser dans les langues cibles", description: "En utilisant le profil vocal, l\u2019IA g\u00e9n\u00e8re la parole dans chaque langue s\u00e9lectionn\u00e9e. La voix clon\u00e9e pr\u00e9serve l\u2019identit\u00e9 du locuteur avec une prononciation native." },
      { title: "Affiner le timing et l\u2019\u00e9motion", description: "La sortie est automatiquement ajust\u00e9e pour que la dur\u00e9e de la parole corresponde \u00e0 la vid\u00e9o originale. Les inflexions \u00e9motionnelles sont conserv\u00e9es." },
    ],
    capabilities: [
      { title: "Clonage haute fid\u00e9lit\u00e9", description: "Notre mod\u00e8le capture plus de 40 param\u00e8tres vocaux par locuteur, produisant des r\u00e9sultats que les auditeurs \u00e9valuent syst\u00e9matiquement comme indiscernables de l\u2019original." },
      { title: "Fid\u00e9lit\u00e9 ajustable", description: "Choisissez entre le clonage Standard et Ultra. Standard est rapide et convient \u00e0 la plupart des contenus. Ultra offre une pr\u00e9cision maximale pour les productions professionnelles." },
      { title: "Garanties \u00e9thiques", description: "Le clonage vocal est r\u00e9serv\u00e9 au contenu que vous poss\u00e9dez ou pour lequel vous avez des droits. Toute sortie clon\u00e9e inclut un filigrane num\u00e9rique inaudible." },
    ],
    useCases: [
      { title: "Cr\u00e9ateurs YouTube", description: "Atteignez un public mondial sans perdre votre personnalit\u00e9. Doublez vos vid\u00e9os en espagnol, portugais, hindi et plus en gardant votre voix dans chaque langue." },
      { title: "E-learning et formation", description: "Traduisez les supports de formation et les cours en ligne tout en maintenant la coh\u00e9rence de la voix du formateur dans toutes les versions." },
      { title: "Marketing et publicit\u00e9", description: "Localisez les publicit\u00e9s vid\u00e9o pour les campagnes internationales. Gardez la voix de marque coh\u00e9rente sur tous les march\u00e9s." },
    ],
    faqs: [
      { question: "Combien d\u2019audio source l\u2019IA a-t-elle besoin pour le clonage vocal ?", answer: "DubSync a besoin d\u2019au moins 30 secondes de parole claire pour cr\u00e9er un profil vocal fiable. Des \u00e9chantillons plus longs (2-5 minutes) produisent des r\u00e9sultats de meilleure fid\u00e9lit\u00e9." },
      { question: "Le clonage vocal fonctionne-t-il avec plusieurs locuteurs ?", answer: "Oui. DubSync d\u00e9tecte et s\u00e9pare automatiquement les locuteurs individuels, clonant chaque voix ind\u00e9pendamment." },
      { question: "Puis-je utiliser le clonage vocal sur du contenu que je n\u2019ai pas cr\u00e9\u00e9 ?", answer: "Le clonage vocal n\u2019est disponible que pour le contenu que vous poss\u00e9dez ou pour lequel vous avez des droits explicites de doublage." },
      { question: "Quelle est la diff\u00e9rence entre le clonage Standard et Ultra ?", answer: "Standard est optimis\u00e9 pour la vitesse et convient \u00e0 la plupart des contenus. Ultra utilise un mod\u00e8le neuronal plus grand avec plus de param\u00e8tres vocaux pour une fid\u00e9lit\u00e9 professionnelle maximale." },
    ],
    breadcrumbFeatures: "Fonctionnalit\u00e9s",
    breadcrumbVoiceCloning: "Clonage Vocal",
  },
  ja: {
    title: "AI\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3067\u52d5\u753b\u5439\u304d\u66ff\u3048 \u2014 \u3042\u306a\u305f\u306e\u58f0\u3092\u3042\u3089\u3086\u308b\u8a00\u8a9e\u3067 | DubSync",
    description:
      "AI\u3067\u58f0\u3092\u30af\u30ed\u30fc\u30f3\u3057\u300130\u4ee5\u4e0a\u306e\u8a00\u8a9e\u3067\u52d5\u753b\u3092\u5439\u304d\u66ff\u3048\u3002\u72ec\u81ea\u306e\u30c8\u30fc\u30f3\u3001\u30d4\u30c3\u30c1\u3001\u30b1\u30a4\u30c7\u30f3\u30b9\u3092\u4fdd\u6301\u3002\u6570\u5206\u3067\u30b9\u30bf\u30b8\u30aa\u54c1\u8cea\u3002",
    badge: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3",
    h1: "AI\u97f3\u58f0\u30af\u30ed\u30fc\u30f3 \u2014",
    h1Highlight: "\u3042\u306a\u305f\u306e\u58f0\u3067\u3001\u3042\u3089\u3086\u308b\u8a00\u8a9e\u3067",
    subtitle:
      "DubSync\u306fAI\u3067\u3042\u306a\u305f\u306e\u58f0\u3092\u30af\u30ed\u30fc\u30f3\u3057\u300130\u4ee5\u4e0a\u306e\u8a00\u8a9e\u3067\u6d41\u66a2\u306b\u8a71\u3057\u307e\u3059\u3002\u3042\u306a\u305f\u306e\u30c8\u30fc\u30f3\u3001\u30b1\u30a4\u30c7\u30f3\u30b9\u3001\u500b\u6027\u304c\u5168\u3066\u306e\u5439\u304d\u66ff\u3048\u7248\u3067\u4fdd\u305f\u308c\u307e\u3059\u3002",
    cta: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3092\u7121\u6599\u3067\u8a66\u3059",
    howWorksTitle: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306e\u4ed5\u7d44\u307f",
    capabilitiesTitle: "\u4e3b\u306a\u6a5f\u80fd",
    useCasesTitle: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306e\u6d3b\u7528\u4e8b\u4f8b",
    ctaTitle: "\u58f0\u3092\u30af\u30ed\u30fc\u30f3\u3057\u3066\u4e16\u754c\u3078",
    ctaSubtitle: "5\u5206\u9593\u306e\u7121\u6599\u5439\u304d\u66ff\u3048\u3067\u59cb\u3081\u307e\u3057\u3087\u3046\u3002\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u4e0d\u8981\u3002",
    ctaButton: "\u7121\u6599\u3067\u59cb\u3081\u308b",
    faqTitle: "\u3088\u304f\u3042\u308b\u8cea\u554f",
    relatedTitle: "\u95a2\u9023\u6a5f\u80fd",
    allFeatures: "\u5168\u3066\u306e\u6a5f\u80fd",
    steps: [
      { title: "\u30aa\u30ea\u30b8\u30ca\u30eb\u306e\u58f0\u3092\u5206\u6790", description: "DubSync\u306eAI\u304c\u30bd\u30fc\u30b9\u97f3\u58f0\u3092\u8074\u304d\u3001\u30d4\u30c3\u30c1\u3001\u97f3\u8272\u3001\u8a71\u901f\u3001\u611f\u60c5\u7684\u306a\u30c8\u30fc\u30f3\u306a\u3069\u306e\u97f3\u58f0\u7279\u6027\u3092\u80cc\u666f\u30ce\u30a4\u30ba\u3084\u97f3\u697d\u304b\u3089\u5206\u96e2\u3057\u307e\u3059\u3002" },
      { title: "\u97f3\u58f0\u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210", description: "\u30b7\u30b9\u30c6\u30e0\u304c\u8a71\u8005\u306e\u58f0\u306e\u72ec\u81ea\u6027\u3092\u6355\u3089\u3048\u305f\u30cb\u30e5\u30fc\u30e9\u30eb\u97f3\u58f0\u30e2\u30c7\u30eb\u3092\u4f5c\u6210\u3002\u3053\u306e\u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u304c\u5168\u3066\u306e\u7ffb\u8a33\u3092\u99c6\u52d5\u3057\u307e\u3059\u3002" },
      { title: "\u30bf\u30fc\u30b2\u30c3\u30c8\u8a00\u8a9e\u3067\u5408\u6210", description: "\u97f3\u58f0\u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u3092\u4f7f\u7528\u3057\u3066\u3001AI\u304c\u5404\u8a00\u8a9e\u3067\u97f3\u58f0\u3092\u751f\u6210\u3002\u30af\u30ed\u30fc\u30f3\u3055\u308c\u305f\u58f0\u306f\u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u767a\u97f3\u3067\u8a71\u8005\u306e\u30a2\u30a4\u30c7\u30f3\u30c6\u30a3\u30c6\u30a3\u3092\u4fdd\u6301\u3057\u307e\u3059\u3002" },
      { title: "\u30bf\u30a4\u30df\u30f3\u30b0\u3068\u611f\u60c5\u3092\u8abf\u6574", description: "\u51fa\u529b\u306f\u81ea\u52d5\u7684\u306b\u8abf\u6574\u3055\u308c\u3001\u97f3\u58f0\u306e\u9577\u3055\u304c\u30aa\u30ea\u30b8\u30ca\u30eb\u52d5\u753b\u3068\u4e00\u81f4\u3057\u307e\u3059\u3002\u611f\u60c5\u7684\u306a\u62d1\u63da\u3082\u4fdd\u6301\u3055\u308c\u307e\u3059\u3002" },
    ],
    capabilities: [
      { title: "\u9ad8\u5fe0\u5b9f\u5ea6\u30af\u30ed\u30fc\u30f3", description: "\u5f53\u793e\u306e\u30e2\u30c7\u30eb\u306f\u8a71\u8005\u3054\u3068\u306b40\u4ee5\u4e0a\u306e\u97f3\u58f0\u30d1\u30e9\u30e1\u30fc\u30bf\u3092\u30ad\u30e3\u30d7\u30c1\u30e3\u3057\u3001\u30ea\u30b9\u30ca\u30fc\u304c\u30aa\u30ea\u30b8\u30ca\u30eb\u3068\u533a\u5225\u3067\u304d\u306a\u3044\u7d50\u679c\u3092\u751f\u307f\u51fa\u3057\u307e\u3059\u3002" },
      { title: "\u8abf\u6574\u53ef\u80fd\u306a\u5fe0\u5b9f\u5ea6", description: "Standard\u3068Ultra\u306e\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u304b\u3089\u9078\u629e\u3002Standard\u306f\u9ad8\u901f\u3067\u307b\u3068\u3093\u3069\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u306b\u6700\u9069\u3002Ultra\u306f\u30d7\u30ed\u30d5\u30a7\u30c3\u30b7\u30e7\u30ca\u30eb\u5236\u4f5c\u5411\u3051\u306e\u6700\u9ad8\u7cbe\u5ea6\u3002" },
      { title: "\u5012\u7406\u7684\u306a\u4fdd\u8b77\u63aa\u7f6e", description: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306f\u6240\u6709\u307e\u305f\u306f\u6a29\u5229\u3092\u6301\u3064\u30b3\u30f3\u30c6\u30f3\u30c4\u306b\u9650\u5b9a\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u5168\u3066\u306e\u30af\u30ed\u30fc\u30f3\u51fa\u529b\u306b\u306f\u4e0d\u53ef\u8074\u306a\u30c7\u30b8\u30bf\u30eb\u900f\u304b\u3057\u304c\u542b\u307e\u308c\u307e\u3059\u3002" },
    ],
    useCases: [
      { title: "YouTube\u30af\u30ea\u30a8\u30a4\u30bf\u30fc", description: "\u500b\u6027\u3092\u5931\u308f\u305a\u306b\u30b0\u30ed\u30fc\u30d0\u30eb\u306a\u8996\u8074\u8005\u306b\u30ea\u30fc\u30c1\u3002\u30b9\u30da\u30a4\u30f3\u8a9e\u3001\u30dd\u30eb\u30c8\u30ac\u30eb\u8a9e\u3001\u30d2\u30f3\u30c7\u30a3\u30fc\u8a9e\u306a\u3069\u3067\u81ea\u5206\u3089\u3057\u304f\u5439\u304d\u66ff\u3048\u3002" },
      { title: "E\u30e9\u30fc\u30cb\u30f3\u30b0\u3068\u30b3\u30fc\u30b9", description: "\u5168\u3066\u306e\u8a00\u8a9e\u7248\u3067\u8b1b\u5e2b\u306e\u58f0\u306e\u4e00\u8cab\u6027\u3092\u4fdd\u3061\u306a\u304c\u3089\u3001\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0\u8cc7\u6599\u3084\u30aa\u30f3\u30e9\u30a4\u30f3\u30b3\u30fc\u30b9\u3092\u7ffb\u8a33\u3002" },
      { title: "\u30de\u30fc\u30b1\u30c6\u30a3\u30f3\u30b0\u3068\u5e83\u544a", description: "\u56fd\u969b\u30ad\u30e3\u30f3\u30da\u30fc\u30f3\u5411\u3051\u306b\u52d5\u753b\u5e83\u544a\u3092\u30ed\u30fc\u30ab\u30e9\u30a4\u30ba\u3002\u5168\u5e02\u5834\u3067\u30d6\u30e9\u30f3\u30c9\u30dc\u30a4\u30b9\u306e\u4e00\u8cab\u6027\u3092\u7dad\u6301\u3002" },
    ],
    faqs: [
      { question: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306b\u5fc5\u8981\u306a\u30bd\u30fc\u30b9\u97f3\u58f0\u306e\u9577\u3055\u306f\uff1f", answer: "DubSync\u306f\u4fe1\u983c\u6027\u306e\u9ad8\u3044\u97f3\u58f0\u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u4f5c\u6210\u306b\u6700\u4f4e30\u79d2\u306e\u660e\u77ad\u306a\u97f3\u58f0\u304c\u5fc5\u8981\u3067\u3059\u3002\u3088\u308a\u9577\u3044\u30b5\u30f3\u30d7\u30eb\uff082-5\u5206\uff09\u3067\u3088\u308a\u9ad8\u3044\u5fe0\u5b9f\u5ea6\u304c\u5f97\u3089\u308c\u307e\u3059\u3002" },
      { question: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306f\u8907\u6570\u306e\u8a71\u8005\u306b\u5bfe\u5fdc\u3057\u3066\u3044\u307e\u3059\u304b\uff1f", answer: "\u306f\u3044\u3002DubSync\u306f\u500b\u3005\u306e\u8a71\u8005\u3092\u81ea\u52d5\u7684\u306b\u691c\u51fa\u30fb\u5206\u96e2\u3057\u3001\u5404\u58f0\u3092\u72ec\u7acb\u3057\u3066\u30af\u30ed\u30fc\u30f3\u3057\u307e\u3059\u3002" },
      { question: "\u81ea\u5206\u304c\u4f5c\u6210\u3057\u3066\u3044\u306a\u3044\u30b3\u30f3\u30c6\u30f3\u30c4\u306b\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u304b\uff1f", answer: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306f\u6240\u6709\u307e\u305f\u306f\u660e\u793a\u7684\u306a\u5439\u304d\u66ff\u3048\u6a29\u5229\u3092\u6301\u3064\u30b3\u30f3\u30c6\u30f3\u30c4\u306b\u306e\u307f\u5229\u7528\u53ef\u80fd\u3067\u3059\u3002" },
      { question: "Standard\u3068Ultra\u306e\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u306e\u9055\u3044\u306f\uff1f", answer: "Standard\u306f\u901f\u5ea6\u306b\u6700\u9069\u5316\u3055\u308c\u3001\u307b\u3068\u3093\u3069\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u306b\u9069\u3057\u3066\u3044\u307e\u3059\u3002Ultra\u306f\u3088\u308a\u5927\u304d\u306a\u30cb\u30e5\u30fc\u30e9\u30eb\u30e2\u30c7\u30eb\u3068\u3088\u308a\u591a\u304f\u306e\u97f3\u58f0\u30d1\u30e9\u30e1\u30fc\u30bf\u3067\u6700\u9ad8\u306e\u30d7\u30ed\u54c1\u8cea\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002" },
    ],
    breadcrumbFeatures: "\u6a5f\u80fd",
    breadcrumbVoiceCloning: "\u97f3\u58f0\u30af\u30ed\u30fc\u30f3",
  },
};

type Lang = keyof typeof TRANSLATIONS;

const STEP_ICONS = [Mic, AudioWaveform, Languages, Sparkles];
const CAP_ICONS = [Gauge, Settings2, Shield];
const UC_ICONS = [Video, GraduationCap, Megaphone];

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
        ? "https://dubsync.app/features/voice-cloning"
        : `https://dubsync.app/${l}/features/voice-cloning`;
  }
  langAlternates["x-default"] = "https://dubsync.app/features/voice-cloning";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/features/voice-cloning`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/features/voice-cloning`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedVoiceCloningPage({
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
          { name: t.breadcrumbVoiceCloning, url: `https://dubsync.app/${lang}/features/voice-cloning` },
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
            <Mic className="h-3.5 w-3.5" /> {t.badge}
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
          <div className="grid gap-8 sm:grid-cols-2">
            {t.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                      <Icon className="h-6 w-6 text-pink-400" />
                    </div>
                    <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Capabilities */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.capabilitiesTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {t.capabilities.map((cap, i) => {
              const Icon = CAP_ICONS[i];
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <Icon className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Use cases */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.useCasesTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {t.useCases.map((uc, i) => {
              const Icon = UC_ICONS[i];
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <Icon className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {uc.description}
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
              href={`/${lang}/features/lip-sync`}
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Lip Sync
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
