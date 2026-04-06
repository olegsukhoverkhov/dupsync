import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Code,
  ArrowRight,
  Zap,
  Shield,
  Webhook,
  Server,
  Clock,
  FileJson,
  Layers,
  Lock,
} from "lucide-react";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const CODE_EXAMPLE = `curl -X POST https://api.dubsync.app/v1/dub \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_url": "https://example.com/video.mp4",
    "target_languages": ["es", "fr", "ja"],
    "voice_cloning": true,
    "lip_sync": true,
    "webhook_url": "https://yourapp.com/webhook/dubsync"
  }'`;

const TECH_SPECS = [
  { label: "Protocol", value: "HTTPS REST (JSON)" },
  { label: "Authentication", value: "Bearer token (API key)" },
  { label: "Rate limit", value: "60 req/min (Pro), 300/min (Enterprise)" },
  { label: "Max video size", value: "5 GB" },
  { label: "Max video duration", value: "2 hours" },
  { label: "Supported formats", value: "MP4, MOV, WebM" },
  { label: "Output format", value: "MP4 (H.264 + AAC)" },
  { label: "Webhooks", value: "HMAC-SHA256" },
  { label: "SDKs", value: "Python, Node.js, Go (coming soon)" },
  { label: "Uptime SLA", value: "99.9% (Enterprise)" },
];

const TRANSLATIONS = {
  es: {
    title: "API de Doblaje de Video \u2014 Integra Doblaje con IA en Tu Producto | DubSync",
    description:
      "Integra el doblaje de video con IA de DubSync en tu producto con nuestra API REST. Clonaci\u00f3n de voz, lip sync y traducci\u00f3n, todo programable.",
    badge: "API",
    h1: "API de doblaje de video",
    h1Highlight: "para desarrolladores y equipos",
    subtitle:
      "Integra el doblaje de video con IA directamente en tu producto. Una llamada API para transcribir, traducir, clonar voces y sincronizar labios en m\u00e1s de 30 idiomas.",
    ctaApi: "Obtener acceso API",
    ctaDocs: "Leer la documentaci\u00f3n",
    codeTitle: "Dobla un video en",
    codeHighlight: "una sola llamada",
    codeFooter: "Referencia completa de la API y ejemplos de c\u00f3digo en",
    codeFooterLink: "la documentaci\u00f3n",
    capabilitiesTitle: "Capacidades clave",
    techSpecsTitle: "Especificaciones t\u00e9cnicas",
    pricingTitle: "Precios de la API",
    pricingDesc: "El acceso a la API est\u00e1 incluido en los planes Pro y Enterprise. Pro comienza en $29/mes con 60 minutos de doblaje. Enterprise incluye precios por volumen personalizados y procesamiento prioritario.",
    pricingLink: "Ver precios completos",
    ctaTitle: "Empieza a construir con la API de DubSync",
    ctaSubtitle: "Crea una cuenta, genera una clave API y env\u00eda tu primer trabajo de doblaje en menos de 5 minutos.",
    ctaButton: "Empezar gratis",
    ctaDocs2: "Documentaci\u00f3n API",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Funciones relacionadas",
    allFeatures: "Todas las funciones",
    capabilities: [
      { title: "Doblaje en una llamada", description: "Env\u00eda una URL de video, idiomas objetivo y opciones en una sola solicitud POST. DubSync maneja transcripci\u00f3n, traducci\u00f3n, clonaci\u00f3n de voz y lip sync de principio a fin." },
      { title: "Notificaciones webhook", description: "Registra una URL de webhook y recibe actualizaciones en tiempo real cuando los trabajos comienzan, se completan o encuentran errores." },
      { title: "Procesamiento por lotes", description: "Env\u00eda m\u00faltiples videos en una sola solicitud. Cada video se procesa en paralelo y los resultados se entregan individualmente." },
      { title: "Acceso a guiones", description: "Recupera la transcripci\u00f3n, el guion traducido y los datos de sincronizaci\u00f3n a trav\u00e9s de la API. Edita guiones program\u00e1ticamente." },
      { title: "Seguridad por defecto", description: "Todo el tr\u00e1fico API est\u00e1 cifrado con TLS 1.3. Las claves API tienen permisos espec\u00edficos y se pueden rotar en cualquier momento." },
      { title: "Seguimiento de uso", description: "Consulta tu uso actual, cr\u00e9ditos restantes e historial de trabajos a trav\u00e9s de endpoints dedicados." },
    ],
    faqs: [
      { question: "\u00bfQu\u00e9 planes incluyen acceso API?", answer: "La API est\u00e1 disponible en los planes Pro y Enterprise. Pro incluye 60 solicitudes por minuto. Enterprise desbloquea mayor rendimiento y procesamiento prioritario." },
      { question: "\u00bfC\u00f3mo autentico las solicitudes API?", answer: "Crea una clave API desde tu panel de DubSync en Configuraci\u00f3n > Claves API. P\u00e1sala como token Bearer en el encabezado Authorization de cada solicitud." },
      { question: "\u00bfHay un entorno sandbox para pruebas?", answer: "S\u00ed. Cada clave API funciona en modo sandbox por defecto. Las solicitudes sandbox procesan una vista previa de 30 segundos sin costo." },
      { question: "\u00bfQu\u00e9 pasa si un trabajo de doblaje falla?", answer: "Los trabajos fallidos devuelven un objeto de error detallado con un c\u00f3digo de error legible por m\u00e1quina y un mensaje legible por humanos." },
    ],
    breadcrumbFeatures: "Funciones",
    breadcrumbApi: "API",
  },
  pt: {
    title: "API de Dublagem de V\u00eddeo \u2014 Integre Dublagem com IA ao Seu Produto | DubSync",
    description:
      "Integre a dublagem de v\u00eddeo com IA do DubSync ao seu produto com nossa API REST. Clonagem de voz, lip sync e tradu\u00e7\u00e3o, tudo program\u00e1vel.",
    badge: "API",
    h1: "API de dublagem de v\u00eddeo",
    h1Highlight: "para desenvolvedores e equipes",
    subtitle:
      "Integre a dublagem de v\u00eddeo com IA diretamente ao seu produto. Uma chamada API para transcrever, traduzir, clonar vozes e sincronizar l\u00e1bios em mais de 30 idiomas.",
    ctaApi: "Obter acesso \u00e0 API",
    ctaDocs: "Ler a documenta\u00e7\u00e3o",
    codeTitle: "Duble um v\u00eddeo em",
    codeHighlight: "uma \u00fanica chamada",
    codeFooter: "Refer\u00eancia completa da API e exemplos de c\u00f3digo na",
    codeFooterLink: "documenta\u00e7\u00e3o",
    capabilitiesTitle: "Capacidades principais",
    techSpecsTitle: "Especifica\u00e7\u00f5es t\u00e9cnicas",
    pricingTitle: "Pre\u00e7os da API",
    pricingDesc: "O acesso \u00e0 API est\u00e1 inclu\u00eddo nos planos Pro e Enterprise. Pro come\u00e7a em $29/m\u00eas com 60 minutos de dublagem. Enterprise inclui pre\u00e7os por volume personalizados e processamento priorit\u00e1rio.",
    pricingLink: "Ver pre\u00e7os completos",
    ctaTitle: "Comece a construir com a API do DubSync",
    ctaSubtitle: "Crie uma conta, gere uma chave API e envie seu primeiro trabalho de dublagem em menos de 5 minutos.",
    ctaButton: "Come\u00e7ar gr\u00e1tis",
    ctaDocs2: "Documenta\u00e7\u00e3o API",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Recursos relacionados",
    allFeatures: "Todos os recursos",
    capabilities: [
      { title: "Dublagem em uma chamada", description: "Envie uma URL de v\u00eddeo, idiomas-alvo e op\u00e7\u00f5es em uma \u00fanica requisi\u00e7\u00e3o POST. O DubSync cuida de tudo de ponta a ponta." },
      { title: "Notifica\u00e7\u00f5es webhook", description: "Registre uma URL de webhook e receba atualiza\u00e7\u00f5es em tempo real quando os trabalhos come\u00e7am, terminam ou encontram erros." },
      { title: "Processamento em lote", description: "Envie m\u00faltiplos v\u00eddeos em uma \u00fanica requisi\u00e7\u00e3o. Cada v\u00eddeo \u00e9 processado em paralelo e os resultados s\u00e3o entregues individualmente." },
      { title: "Acesso a roteiros", description: "Recupere a transcri\u00e7\u00e3o, o roteiro traduzido e os dados de sincroniza\u00e7\u00e3o via API. Edite roteiros programaticamente." },
      { title: "Seguran\u00e7a por padr\u00e3o", description: "Todo o tr\u00e1fego da API \u00e9 criptografado com TLS 1.3. As chaves API t\u00eam permiss\u00f5es espec\u00edficas e podem ser rotacionadas a qualquer momento." },
      { title: "Rastreamento de uso", description: "Consulte seu uso atual, cr\u00e9ditos restantes e hist\u00f3rico de trabalhos atrav\u00e9s de endpoints dedicados." },
    ],
    faqs: [
      { question: "Quais planos incluem acesso \u00e0 API?", answer: "A API est\u00e1 dispon\u00edvel nos planos Pro e Enterprise. Pro inclui 60 requisi\u00e7\u00f5es por minuto. Enterprise desbloqueia maior throughput e processamento priorit\u00e1rio." },
      { question: "Como autentico as requisi\u00e7\u00f5es da API?", answer: "Crie uma chave API no painel do DubSync em Configura\u00e7\u00f5es > Chaves API. Passe-a como token Bearer no cabe\u00e7alho Authorization de cada requisi\u00e7\u00e3o." },
      { question: "Existe um ambiente sandbox para testes?", answer: "Sim. Cada chave API funciona em modo sandbox por padr\u00e3o. Requisi\u00e7\u00f5es sandbox processam uma pr\u00e9via de 30 segundos sem custo." },
      { question: "O que acontece se um trabalho de dublagem falhar?", answer: "Trabalhos falhados retornam um objeto de erro detalhado com um c\u00f3digo de erro leg\u00edvel por m\u00e1quina e uma mensagem leg\u00edvel por humanos." },
    ],
    breadcrumbFeatures: "Recursos",
    breadcrumbApi: "API",
  },
  de: {
    title: "Video-Synchronisations-API \u2014 KI-Synchronisation in Ihr Produkt integrieren | DubSync",
    description:
      "Integrieren Sie DubSyncs KI-Videosynchronisation in Ihr Produkt mit unserer REST API. Stimmklonen, Lip Sync und \u00dcbersetzung \u2014 alles programmierbar.",
    badge: "API",
    h1: "Video-Synchronisations-API",
    h1Highlight: "f\u00fcr Entwickler und Teams",
    subtitle:
      "Integrieren Sie KI-Videosynchronisation direkt in Ihr Produkt. Ein API-Aufruf f\u00fcr Transkription, \u00dcbersetzung, Stimmklonen und Lip Sync in \u00fcber 30 Sprachen.",
    ctaApi: "API-Zugang erhalten",
    ctaDocs: "Dokumentation lesen",
    codeTitle: "Synchronisieren Sie ein Video in",
    codeHighlight: "einem Aufruf",
    codeFooter: "Vollst\u00e4ndige API-Referenz und Code-Beispiele in",
    codeFooterLink: "der Dokumentation",
    capabilitiesTitle: "Wesentliche F\u00e4higkeiten",
    techSpecsTitle: "Technische Spezifikationen",
    pricingTitle: "API-Preise",
    pricingDesc: "Der API-Zugang ist in den Pro- und Enterprise-Pl\u00e4nen enthalten. Pro beginnt bei $29/Monat mit 60 Minuten Synchronisation. Enterprise bietet individuelle Volumenpreise und Priorit\u00e4tsverarbeitung.",
    pricingLink: "Vollst\u00e4ndige Preise ansehen",
    ctaTitle: "Starten Sie mit der DubSync API",
    ctaSubtitle: "Erstellen Sie ein Konto, generieren Sie einen API-Schl\u00fcssel und senden Sie Ihren ersten Synchronisationsauftrag in unter 5 Minuten.",
    ctaButton: "Kostenlos starten",
    ctaDocs2: "API-Dokumentation",
    faqTitle: "H\u00e4ufig gestellte Fragen",
    relatedTitle: "Verwandte Funktionen",
    allFeatures: "Alle Funktionen",
    capabilities: [
      { title: "Synchronisation in einem Aufruf", description: "Senden Sie eine Video-URL, Zielsprachen und Optionen in einer einzigen POST-Anfrage. DubSync \u00fcbernimmt alles End-to-End." },
      { title: "Webhook-Benachrichtigungen", description: "Registrieren Sie eine Webhook-URL und erhalten Sie Echtzeit-Updates, wenn Auftr\u00e4ge starten, abgeschlossen werden oder Fehler auftreten." },
      { title: "Batch-Verarbeitung", description: "Senden Sie mehrere Videos in einer einzigen Anfrage. Jedes Video wird parallel verarbeitet und Ergebnisse werden einzeln geliefert." },
      { title: "Skript-Zugang", description: "Rufen Sie die Transkription, das \u00fcbersetzte Skript und Timing-Daten \u00fcber die API ab. Bearbeiten Sie Skripte programmatisch." },
      { title: "Standardm\u00e4\u00dfig sicher", description: "Der gesamte API-Verkehr ist mit TLS 1.3 verschl\u00fcsselt. API-Schl\u00fcssel haben spezifische Berechtigungen und k\u00f6nnen jederzeit rotiert werden." },
      { title: "Nutzungsverfolgung", description: "Fragen Sie Ihre aktuelle Nutzung, verbleibende Credits und Auftragshistorie \u00fcber dedizierte Endpunkte ab." },
    ],
    faqs: [
      { question: "Welche Pl\u00e4ne beinhalten API-Zugang?", answer: "Die API ist in den Pro- und Enterprise-Pl\u00e4nen verf\u00fcgbar. Pro bietet 60 Anfragen pro Minute. Enterprise schaltet h\u00f6heren Durchsatz und Priorit\u00e4tsverarbeitung frei." },
      { question: "Wie authentifiziere ich API-Anfragen?", answer: "Erstellen Sie einen API-Schl\u00fcssel im DubSync-Dashboard unter Einstellungen > API-Schl\u00fcssel. \u00dcbergeben Sie ihn als Bearer-Token im Authorization-Header jeder Anfrage." },
      { question: "Gibt es eine Sandbox-Umgebung zum Testen?", answer: "Ja. Jeder API-Schl\u00fcssel funktioniert standardm\u00e4\u00dfig im Sandbox-Modus. Sandbox-Anfragen verarbeiten eine 30-Sekunden-Vorschau kostenlos." },
      { question: "Was passiert, wenn ein Synchronisationsauftrag fehlschl\u00e4gt?", answer: "Fehlgeschlagene Auftr\u00e4ge geben ein detailliertes Fehlerobjekt mit einem maschinenlesbaren Fehlercode und einer menschenlesbaren Nachricht zur\u00fcck." },
    ],
    breadcrumbFeatures: "Funktionen",
    breadcrumbApi: "API",
  },
  fr: {
    title: "API de Doublage Vid\u00e9o \u2014 Int\u00e9grez le Doublage IA \u00e0 Votre Produit | DubSync",
    description:
      "Int\u00e9grez le doublage vid\u00e9o IA de DubSync \u00e0 votre produit avec notre API REST. Clonage vocal, lip sync et traduction, le tout programmable.",
    badge: "API",
    h1: "API de doublage vid\u00e9o",
    h1Highlight: "pour d\u00e9veloppeurs et \u00e9quipes",
    subtitle:
      "Int\u00e9grez le doublage vid\u00e9o IA directement dans votre produit. Un seul appel API pour transcrire, traduire, cloner les voix et synchroniser les l\u00e8vres dans plus de 30 langues.",
    ctaApi: "Obtenir l\u2019acc\u00e8s API",
    ctaDocs: "Lire la documentation",
    codeTitle: "Doublez une vid\u00e9o en",
    codeHighlight: "un seul appel",
    codeFooter: "R\u00e9f\u00e9rence compl\u00e8te de l\u2019API et exemples de code dans",
    codeFooterLink: "la documentation",
    capabilitiesTitle: "Capacit\u00e9s cl\u00e9s",
    techSpecsTitle: "Sp\u00e9cifications techniques",
    pricingTitle: "Tarifs de l\u2019API",
    pricingDesc: "L\u2019acc\u00e8s \u00e0 l\u2019API est inclus dans les plans Pro et Enterprise. Pro commence \u00e0 29$/mois avec 60 minutes de doublage. Enterprise propose des tarifs personnalis\u00e9s et un traitement prioritaire.",
    pricingLink: "Voir les tarifs complets",
    ctaTitle: "Commencez \u00e0 construire avec l\u2019API DubSync",
    ctaSubtitle: "Cr\u00e9ez un compte, g\u00e9n\u00e9rez une cl\u00e9 API et soumettez votre premier travail de doublage en moins de 5 minutes.",
    ctaButton: "Commencer gratuitement",
    ctaDocs2: "Documentation API",
    faqTitle: "Questions fr\u00e9quentes",
    relatedTitle: "Fonctionnalit\u00e9s connexes",
    allFeatures: "Toutes les fonctionnalit\u00e9s",
    capabilities: [
      { title: "Doublage en un appel", description: "Soumettez une URL vid\u00e9o, les langues cibles et les options dans une seule requ\u00eate POST. DubSync g\u00e8re tout de bout en bout." },
      { title: "Notifications webhook", description: "Enregistrez une URL webhook et recevez des mises \u00e0 jour en temps r\u00e9el lorsque les travaux d\u00e9marrent, se terminent ou rencontrent des erreurs." },
      { title: "Traitement par lot", description: "Soumettez plusieurs vid\u00e9os dans une seule requ\u00eate. Chaque vid\u00e9o est trait\u00e9e en parall\u00e8le et les r\u00e9sultats sont livr\u00e9s individuellement." },
      { title: "Acc\u00e8s aux scripts", description: "R\u00e9cup\u00e9rez la transcription, le script traduit et les donn\u00e9es de synchronisation via l\u2019API. Modifiez les scripts de mani\u00e8re programmatique." },
      { title: "S\u00e9curit\u00e9 par d\u00e9faut", description: "Tout le trafic API est chiffr\u00e9 via TLS 1.3. Les cl\u00e9s API ont des permissions sp\u00e9cifiques et peuvent \u00eatre r\u00e9voqu\u00e9es \u00e0 tout moment." },
      { title: "Suivi d\u2019utilisation", description: "Consultez votre utilisation actuelle, cr\u00e9dits restants et historique des travaux via des endpoints d\u00e9di\u00e9s." },
    ],
    faqs: [
      { question: "Quels plans incluent l\u2019acc\u00e8s API ?", answer: "L\u2019API est disponible dans les plans Pro et Enterprise. Pro offre 60 requ\u00eates par minute. Enterprise d\u00e9bloque un d\u00e9bit sup\u00e9rieur et un traitement prioritaire." },
      { question: "Comment authentifier les requ\u00eates API ?", answer: "Cr\u00e9ez une cl\u00e9 API depuis votre tableau de bord DubSync dans Param\u00e8tres > Cl\u00e9s API. Passez-la comme token Bearer dans l\u2019en-t\u00eate Authorization de chaque requ\u00eate." },
      { question: "Y a-t-il un environnement sandbox pour les tests ?", answer: "Oui. Chaque cl\u00e9 API fonctionne en mode sandbox par d\u00e9faut. Les requ\u00eates sandbox traitent un aper\u00e7u de 30 secondes sans co\u00fbt." },
      { question: "Que se passe-t-il si un travail de doublage \u00e9choue ?", answer: "Les travaux \u00e9chou\u00e9s renvoient un objet d\u2019erreur d\u00e9taill\u00e9 avec un code d\u2019erreur lisible par machine et un message lisible par l\u2019humain." },
    ],
    breadcrumbFeatures: "Fonctionnalit\u00e9s",
    breadcrumbApi: "API",
  },
  ja: {
    title: "\u52d5\u753b\u5439\u304d\u66ff\u3048API \u2014 AI\u5439\u304d\u66ff\u3048\u3092\u88fd\u54c1\u306b\u7d71\u5408 | DubSync",
    description:
      "DubSync\u306eAI\u52d5\u753b\u5439\u304d\u66ff\u3048\u3092REST API\u3067\u88fd\u54c1\u306b\u7d71\u5408\u3002\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u3001\u7ffb\u8a33\u3092\u30d7\u30ed\u30b0\u30e9\u30e0\u3067\u5236\u5fa1\u3002",
    badge: "API",
    h1: "\u52d5\u753b\u5439\u304d\u66ff\u3048API",
    h1Highlight: "\u958b\u767a\u8005\u3068\u30c1\u30fc\u30e0\u306e\u305f\u3081\u306b",
    subtitle:
      "AI\u52d5\u753b\u5439\u304d\u66ff\u3048\u3092\u88fd\u54c1\u306b\u76f4\u63a5\u7d71\u5408\u30021\u56deAPI\u30b3\u30fc\u30eb\u3067\u6587\u5b57\u8d77\u3053\u3057\u3001\u7ffb\u8a33\u3001\u97f3\u58f0\u30af\u30ed\u30fc\u30f3\u3001\u30ea\u30c3\u30d7\u30b7\u30f3\u30af\u309230\u4ee5\u4e0a\u306e\u8a00\u8a9e\u3067\u5b9f\u884c\u3002",
    ctaApi: "API\u30a2\u30af\u30bb\u30b9\u3092\u53d6\u5f97",
    ctaDocs: "\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u8aad\u3080",
    codeTitle: "\u52d5\u753b\u3092\u5439\u304d\u66ff\u3048\u308b",
    codeHighlight: "1\u56de\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3067",
    codeFooter: "\u5b8c\u5168\u306aAPI\u30ea\u30d5\u30a1\u30ec\u30f3\u30b9\u3068\u30b3\u30fc\u30c9\u4f8b\u306f",
    codeFooterLink: "\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8",
    capabilitiesTitle: "\u4e3b\u306a\u6a5f\u80fd",
    techSpecsTitle: "\u6280\u8853\u4ed5\u69d8",
    pricingTitle: "API\u6599\u91d1",
    pricingDesc: "API\u30a2\u30af\u30bb\u30b9\u306fPro\u304a\u3088\u3073Enterprise\u30d7\u30e9\u30f3\u306b\u542b\u307e\u308c\u307e\u3059\u3002Pro\u306f\u6708\u984d$29\u304b\u308960\u5206\u306e\u5439\u304d\u66ff\u3048\u4ed8\u304d\u3002Enterprise\u306f\u30ab\u30b9\u30bf\u30e0\u30dc\u30ea\u30e5\u30fc\u30e0\u4fa1\u683c\u3068\u512a\u5148\u51e6\u7406\u3092\u542b\u307f\u307e\u3059\u3002",
    pricingLink: "\u5168\u3066\u306e\u6599\u91d1\u3092\u898b\u308b",
    ctaTitle: "DubSync API\u3067\u69cb\u7bc9\u3092\u59cb\u3081\u308b",
    ctaSubtitle: "\u30a2\u30ab\u30a6\u30f3\u30c8\u3092\u4f5c\u6210\u3057\u3001API\u30ad\u30fc\u3092\u751f\u6210\u3057\u30015\u5206\u4ee5\u5185\u306b\u6700\u521d\u306e\u5439\u304d\u66ff\u3048\u30b8\u30e7\u30d6\u3092\u9001\u4fe1\u3002",
    ctaButton: "\u7121\u6599\u3067\u59cb\u3081\u308b",
    ctaDocs2: "API\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8",
    faqTitle: "\u3088\u304f\u3042\u308b\u8cea\u554f",
    relatedTitle: "\u95a2\u9023\u6a5f\u80fd",
    allFeatures: "\u5168\u3066\u306e\u6a5f\u80fd",
    capabilities: [
      { title: "1\u56de\u306e\u30b3\u30fc\u30eb\u3067\u5439\u304d\u66ff\u3048", description: "\u52d5\u753bURL\u3001\u30bf\u30fc\u30b2\u30c3\u30c8\u8a00\u8a9e\u3001\u30aa\u30d7\u30b7\u30e7\u30f3\u30921\u3064\u306ePOST\u30ea\u30af\u30a8\u30b9\u30c8\u3067\u9001\u4fe1\u3002DubSync\u304c\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9\u3067\u51e6\u7406\u3002" },
      { title: "Webhook\u901a\u77e5", description: "Webhook URL\u3092\u767b\u9332\u3057\u3001\u30b8\u30e7\u30d6\u306e\u958b\u59cb\u3001\u5b8c\u4e86\u3001\u30a8\u30e9\u30fc\u6642\u306b\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u66f4\u65b0\u3092\u53d7\u4fe1\u3002" },
      { title: "\u30d0\u30c3\u30c1\u51e6\u7406", description: "1\u3064\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3067\u8907\u6570\u306e\u52d5\u753b\u3092\u9001\u4fe1\u3002\u5404\u52d5\u753b\u306f\u4e26\u884c\u51e6\u7406\u3055\u308c\u3001\u7d50\u679c\u306f\u500b\u5225\u306b\u7d0d\u54c1\u3002" },
      { title: "\u30b9\u30af\u30ea\u30d7\u30c8\u30a2\u30af\u30bb\u30b9", description: "API\u7d4c\u7531\u3067\u6587\u5b57\u8d77\u3053\u3057\u3001\u7ffb\u8a33\u6e08\u307f\u30b9\u30af\u30ea\u30d7\u30c8\u3001\u30bf\u30a4\u30df\u30f3\u30b0\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3002\u30d7\u30ed\u30b0\u30e9\u30e0\u3067\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u7de8\u96c6\u3002" },
      { title: "\u30c7\u30d5\u30a9\u30eb\u30c8\u3067\u5b89\u5168", description: "\u5168API\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306fTLS 1.3\u3067\u6697\u53f7\u5316\u3002API\u30ad\u30fc\u306f\u7279\u5b9a\u306e\u6a29\u9650\u3067\u30b9\u30b3\u30fc\u30d7\u3055\u308c\u3001\u3044\u3064\u3067\u3082\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u53ef\u80fd\u3002" },
      { title: "\u4f7f\u7528\u91cf\u8ffd\u8de1", description: "\u5c02\u7528\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3067\u73fe\u5728\u306e\u4f7f\u7528\u91cf\u3001\u6b8b\u308a\u30af\u30ec\u30b8\u30c3\u30c8\u3001\u30b8\u30e7\u30d6\u5c65\u6b74\u3092\u30af\u30a8\u30ea\u3002" },
    ],
    faqs: [
      { question: "\u3069\u306e\u30d7\u30e9\u30f3\u306bAPI\u30a2\u30af\u30bb\u30b9\u304c\u542b\u307e\u308c\u307e\u3059\u304b\uff1f", answer: "API\u306fPro\u304a\u3088\u3073Enterprise\u30d7\u30e9\u30f3\u3067\u5229\u7528\u53ef\u80fd\u3067\u3059\u3002Pro\u306f\u6bce\u520660\u30ea\u30af\u30a8\u30b9\u30c8\u3002Enterprise\u306f\u3088\u308a\u9ad8\u3044\u30b9\u30eb\u30fc\u30d7\u30c3\u30c8\u3068\u512a\u5148\u51e6\u7406\u3092\u63d0\u4f9b\u3002" },
      { question: "API\u30ea\u30af\u30a8\u30b9\u30c8\u306e\u8a8d\u8a3c\u65b9\u6cd5\u306f\uff1f", answer: "DubSync\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u8a2d\u5b9a > API\u30ad\u30fc\u304b\u3089API\u30ad\u30fc\u3092\u4f5c\u6210\u3002\u5404\u30ea\u30af\u30a8\u30b9\u30c8\u306eAuthorization\u30d8\u30c3\u30c0\u30fc\u306bBearer\u30c8\u30fc\u30af\u30f3\u3068\u3057\u3066\u6e21\u3057\u307e\u3059\u3002" },
      { question: "\u30c6\u30b9\u30c8\u7528\u306e\u30b5\u30f3\u30c9\u30dc\u30c3\u30af\u30b9\u74b0\u5883\u306f\u3042\u308a\u307e\u3059\u304b\uff1f", answer: "\u306f\u3044\u3002\u5168\u3066\u306eAPI\u30ad\u30fc\u306f\u30c7\u30d5\u30a9\u30eb\u30c8\u3067\u30b5\u30f3\u30c9\u30dc\u30c3\u30af\u30b9\u30e2\u30fc\u30c9\u3067\u52d5\u4f5c\u3057\u307e\u3059\u3002\u30b5\u30f3\u30c9\u30dc\u30c3\u30af\u30b9\u30ea\u30af\u30a8\u30b9\u30c8\u306f30\u79d2\u306e\u30d7\u30ec\u30d3\u30e5\u30fc\u3092\u7121\u6599\u3067\u51e6\u7406\u3057\u307e\u3059\u3002" },
      { question: "\u5439\u304d\u66ff\u3048\u30b8\u30e7\u30d6\u304c\u5931\u6557\u3057\u305f\u5834\u5408\u306f\uff1f", answer: "\u5931\u6557\u3057\u305f\u30b8\u30e7\u30d6\u306f\u3001\u6a5f\u68b0\u53ef\u8aad\u306a\u30a8\u30e9\u30fc\u30b3\u30fc\u30c9\u3068\u4eba\u9593\u304c\u8aad\u3081\u308b\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u542b\u3080\u8a73\u7d30\u306a\u30a8\u30e9\u30fc\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u3092\u8fd4\u3057\u307e\u3059\u3002" },
    ],
    breadcrumbFeatures: "\u6a5f\u80fd",
    breadcrumbApi: "API",
  },
};

type Lang = keyof typeof TRANSLATIONS;

const CAP_ICONS = [Zap, Webhook, Layers, FileJson, Shield, Clock];

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
        ? "https://dubsync.app/features/api"
        : `https://dubsync.app/${l}/features/api`;
  }
  langAlternates["x-default"] = "https://dubsync.app/features/api";

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://dubsync.app/${lang}/features/api`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: `https://dubsync.app/${lang}/features/api`,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocalizedApiPage({
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
          { name: t.breadcrumbApi, url: `https://dubsync.app/${lang}/features/api` },
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
            <Code className="h-3.5 w-3.5" /> {t.badge}
          </div>
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
              {t.ctaApi}
            </Link>
            <Link
              href="/docs"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
            >
              {t.ctaDocs}
            </Link>
          </div>
        </section>

        {/* Code example */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            {t.codeTitle}{" "}
            <span className="gradient-text">{t.codeHighlight}</span>
          </h2>
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-zinc-500 font-mono">
                terminal
              </span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
              <code className="text-zinc-300 font-[family-name:var(--font-geist-mono)]">
                {CODE_EXAMPLE}
              </code>
            </pre>
          </div>
          <p className="mt-4 text-center text-sm text-zinc-500">
            {t.codeFooter}{" "}
            <Link href="/docs" className="text-pink-400 hover:underline">
              {t.codeFooterLink}
            </Link>
            .
          </p>
        </section>

        {/* Capabilities */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            {t.capabilitiesTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Tech specs */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            {t.techSpecsTitle}
          </h2>
          <div className="rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {TECH_SPECS.map((spec, i) => (
                  <tr
                    key={spec.label}
                    className={
                      i < TECH_SPECS.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 font-medium text-zinc-300 whitespace-nowrap">
                      {spec.label}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-right">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing link */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-8">
            <Server className="h-8 w-8 text-pink-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t.pricingTitle}</h2>
            <p className="text-sm text-zinc-400 mb-4 max-w-md mx-auto">
              {t.pricingDesc}
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm text-pink-400 hover:gap-2 transition-all"
            >
              {t.pricingLink} <ArrowRight className="h-4 w-4" />
            </Link>
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
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="gradient-button rounded-lg px-8 py-3 text-sm font-medium"
              >
                {t.ctaButton}
              </Link>
              <Link
                href="/docs"
                className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
              >
                {t.ctaDocs2}
              </Link>
            </div>
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
              href={`/${lang}/features/video-translation`}
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Video Translation
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
