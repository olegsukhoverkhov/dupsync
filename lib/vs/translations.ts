/**
 * Per-locale strings for the 4 competitor comparison pages.
 *
 * Structure: VS_LOCALIZED_STRINGS[lang][competitor] → all user-visible
 * strings needed by `mergeCopy()` in ./copy.ts.
 *
 * The feature/pricing NUMBERS live in copy.ts (one source of truth) so
 * translators only translate LABELS and PROSE.
 */

import type { VsCompetitor, VsLocale } from "./copy";

type LocaleStrings = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroSubtitle: string;
  verdictHeading: string;
  verdictBody: string;
  lipSyncHeading: string;
  lipSyncFeatures: string[];
  pricingHeading: string;
  dubsyncPricingLabel: string;
  dubsyncPricingNote: string;
  competitorPricingLabel: string;
  competitorPricingNote: string;
  featureHeading: string;
  featureLabels: string[];
  featureFoot: { feature: string; languages: string; cost: string };
  whereCompetitorWinsHeading: string;
  whereDubsyncWinsHeading: string;
  whereCompetitorWins: string[];
  whereDubsyncWins: string[];
  migrationHeading: string;
  migrationSteps: string[];
  faqHeading: string;
  faqs: Array<{ q: string; a: string }>;
  relatedHeading: string;
  ctaHeading: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  breadcrumbCompare: string;
};

// Shared labels that are the same across all competitors within a locale.
const COMMON_FEATURE_LABELS = {
  es: [
    "Clonación de voz",
    "Detección multi-hablante",
    "Edición de script",
    "Acceso API",
    "Salida 4K",
    "Procesamiento en lote",
    "Glosario / bloqueo de términos",
    "Preservar audio de fondo",
    "Plan gratuito",
  ],
  pt: [
    "Clonagem de voz",
    "Detecção multi-locutor",
    "Edição de script",
    "Acesso API",
    "Saída 4K",
    "Processamento em lote",
    "Glossário / bloqueio de termos",
    "Preservar áudio de fundo",
    "Plano gratuito",
  ],
  de: [
    "Stimmklonen",
    "Mehrsprecher-Erkennung",
    "Skript-Bearbeitung",
    "API-Zugang",
    "4K-Ausgabe",
    "Stapelverarbeitung",
    "Glossar / Begriffssperre",
    "Hintergrund-Audio beibehalten",
    "Kostenloser Plan",
  ],
  fr: [
    "Clonage vocal",
    "Détection multi-locuteur",
    "Édition de script",
    "Accès API",
    "Sortie 4K",
    "Traitement par lot",
    "Glossaire / verrouillage de termes",
    "Préserver l'audio d'arrière-plan",
    "Plan gratuit",
  ],
  ja: [
    "音声クローン",
    "複数話者検出",
    "スクリプト編集",
    "APIアクセス",
    "4K出力",
    "バッチ処理",
    "用語集・ロック",
    "背景音声の保持",
    "無料プラン",
  ],
} as const;

const COMMON_FOOT_LABELS = {
  es: { feature: "Función", languages: "Idiomas", cost: "Costo por minuto (con lip sync)" },
  pt: { feature: "Recurso", languages: "Idiomas", cost: "Custo por minuto (com lip sync)" },
  de: { feature: "Funktion", languages: "Sprachen", cost: "Kosten pro Minute (mit Lippensync)" },
  fr: { feature: "Fonctionnalité", languages: "Langues", cost: "Coût par minute (avec lip sync)" },
  ja: { feature: "機能", languages: "言語", cost: "1分あたりのコスト（リップシンク込み）" },
} as const;

const COMMON_LABELS = {
  es: {
    eyebrow: "Comparación",
    verdictHeading: "Veredicto rápido",
    lipSyncHeading: "Comparación de lip sync",
    pricingHeading: "Comparación de precios",
    featureHeading: "Comparación de funciones",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 crédito = 1 minuto. Lip sync incluido en todos los planes.",
    migrationHeading: "Cómo cambiar a DubSync",
    faqHeading: "Preguntas frecuentes",
    relatedHeading: "Comparaciones relacionadas",
    ctaHeading: "¿Listo para cambiar a DubSync?",
    ctaSubtitle: "Obtén doblaje con lip sync desde $19.99/mes. Empieza gratis, sin tarjeta.",
    ctaPrimary: "Prueba DubSync Gratis",
    ctaSecondary: "Ver comparación completa",
    breadcrumbCompare: "Comparar",
  },
  pt: {
    eyebrow: "Comparação",
    verdictHeading: "Veredito rápido",
    lipSyncHeading: "Comparação de lip sync",
    pricingHeading: "Comparação de preços",
    featureHeading: "Comparação de recursos",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 crédito = 1 minuto. Lip sync incluído em todos os planos.",
    migrationHeading: "Como migrar para o DubSync",
    faqHeading: "Perguntas frequentes",
    relatedHeading: "Comparações relacionadas",
    ctaHeading: "Pronto para migrar para o DubSync?",
    ctaSubtitle: "Obtenha dublagem com lip sync a partir de $19.99/mês. Comece grátis, sem cartão.",
    ctaPrimary: "Experimente o DubSync Grátis",
    ctaSecondary: "Ver comparação completa",
    breadcrumbCompare: "Comparar",
  },
  de: {
    eyebrow: "Vergleich",
    verdictHeading: "Kurzes Fazit",
    lipSyncHeading: "Lippensync-Vergleich",
    pricingHeading: "Preisvergleich",
    featureHeading: "Funktionsvergleich",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 Credit = 1 Minute. Lippensync in allen Plänen enthalten.",
    migrationHeading: "Wechseln zu DubSync",
    faqHeading: "Häufig gestellte Fragen",
    relatedHeading: "Verwandte Vergleiche",
    ctaHeading: "Bereit, zu DubSync zu wechseln?",
    ctaSubtitle: "Erhalte Lippensync-Synchronisation ab $19.99/Monat. Kostenlos starten.",
    ctaPrimary: "DubSync kostenlos testen",
    ctaSecondary: "Vollständigen Vergleich ansehen",
    breadcrumbCompare: "Vergleichen",
  },
  fr: {
    eyebrow: "Comparaison",
    verdictHeading: "Verdict rapide",
    lipSyncHeading: "Comparaison lip sync",
    pricingHeading: "Comparaison tarifaire",
    featureHeading: "Comparaison des fonctionnalités",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 crédit = 1 minute. Lip sync inclus dans tous les plans.",
    migrationHeading: "Passer à DubSync",
    faqHeading: "Questions fréquentes",
    relatedHeading: "Comparaisons connexes",
    ctaHeading: "Prêt à passer à DubSync ?",
    ctaSubtitle: "Obtenez le doublage avec lip sync à partir de 19,99 $/mois. Commencez gratuitement.",
    ctaPrimary: "Essayer DubSync gratuitement",
    ctaSecondary: "Voir la comparaison complète",
    breadcrumbCompare: "Comparer",
  },
  ja: {
    eyebrow: "比較",
    verdictHeading: "クイック結論",
    lipSyncHeading: "リップシンク比較",
    pricingHeading: "価格比較",
    featureHeading: "機能比較",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1クレジット = 1分。すべてのプランにリップシンク付き。",
    migrationHeading: "DubSyncへの移行方法",
    faqHeading: "よくある質問",
    relatedHeading: "関連する比較",
    ctaHeading: "DubSyncに切り替える準備はできましたか？",
    ctaSubtitle: "月額$19.99からリップシンク吹き替え。無料で開始、カード不要。",
    ctaPrimary: "DubSyncを無料で試す",
    ctaSecondary: "完全な比較を見る",
    breadcrumbCompare: "比較",
  },
} as const;

const MIGRATION_STEPS = {
  es: [
    "Exporta o descarga tus videos originales. DubSync admite MP4, MOV, AVI, WebM y MKV.",
    "Crea una cuenta gratuita de DubSync y sube tu primer video para probar la calidad.",
    "Elige los idiomas destino, revisa el script generado por IA y comienza el doblaje con lip sync.",
    "Una vez satisfecho con la calidad, actualiza a un plan pago. Cancela tu suscripción anterior al final del ciclo.",
  ],
  pt: [
    "Exporte ou baixe seus vídeos originais. O DubSync suporta MP4, MOV, AVI, WebM e MKV.",
    "Crie uma conta gratuita no DubSync e envie seu primeiro vídeo para testar a qualidade.",
    "Escolha os idiomas destino, revise o script gerado por IA e comece a dublagem com lip sync.",
    "Ao se satisfazer com a qualidade, atualize para um plano pago. Cancele sua assinatura anterior ao final do ciclo.",
  ],
  de: [
    "Exportiere oder lade deine Originalvideos herunter. DubSync unterstützt MP4, MOV, AVI, WebM und MKV.",
    "Erstelle ein kostenloses DubSync-Konto und lade dein erstes Video hoch, um die Qualität zu testen.",
    "Wähle deine Zielsprachen, prüfe das KI-generierte Skript und starte die Synchronisation mit Lippensync.",
    "Wenn du zufrieden bist, wechsle zu einem kostenpflichtigen Plan. Kündige dein vorheriges Abo am Zyklusende.",
  ],
  fr: [
    "Exportez ou téléchargez vos vidéos originales. DubSync prend en charge MP4, MOV, AVI, WebM et MKV.",
    "Créez un compte DubSync gratuit et téléversez votre première vidéo pour tester la qualité.",
    "Choisissez vos langues cibles, vérifiez le script généré par l'IA et lancez le doublage avec lip sync.",
    "Une fois satisfait, passez à un plan payant. Annulez votre abonnement précédent à la fin du cycle.",
  ],
  ja: [
    "元の動画をエクスポートまたはダウンロードします。DubSyncはMP4、MOV、AVI、WebM、MKVに対応しています。",
    "無料のDubSyncアカウントを作成し、最初の動画をアップロードして品質をテストします。",
    "対象言語を選択し、AI生成スクリプトを確認して、リップシンク付きの吹き替えを開始します。",
    "品質に満足したら有料プランにアップグレードし、前のサブスクリプションを期末にキャンセルします。",
  ],
} as const;

// Per-competitor per-locale strings. Kept compact: `applyCommon()` below
// mixes in the shared labels.
type PerCompetitor = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  verdictBody: string;
  lipSyncFeatures: string[];
  dubsyncPricingNoteOverride?: string;
  competitorPricingLabel: string;
  competitorPricingNote: string;
  whereCompetitorWinsHeading: string;
  whereDubsyncWinsHeading: string;
  whereCompetitorWins: string[];
  whereDubsyncWins: string[];
  faqs: Array<{ q: string; a: string }>;
};

const PER_COMPETITOR: Record<VsLocale, Record<VsCompetitor, PerCompetitor>> = {
  es: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — Lip Sync desde $19.99 vs $120/mes",
      metaDescription:
        "Rask AI cobra $120/mes por lip sync y duplica el uso de créditos. DubSync incluye lip sync en cada crédito desde $19.99. Compara funciones y costos.",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI cobra $120/mes por lip sync y duplica tus créditos. DubSync incluye lip sync en cada crédito desde $19.99.",
      verdictBody:
        "DubSync es la mejor opción para creadores que necesitan doblaje con lip sync a un precio accesible. Por $19.99/mes obtienes 20 minutos con lip sync incluido — una fracción de lo que cobra Rask AI. Rask AI exige el plan Creator Pro de $120/mes para lip sync y duplica el consumo de créditos. Elige Rask AI solo si necesitas idiomas poco comunes fuera de los 30+ de DubSync.",
      lipSyncFeatures: [
        "Minutos de lip sync (plan inicial)",
        "Costo por crédito de lip sync",
        "Capacidad efectiva de lip sync (Pro)",
        "10 min × 3 idiomas: créditos lip sync",
        "Precio de acceso a lip sync",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "Sin plan gratuito. Lip sync usa 2x créditos solo en Creator Pro.",
      whereCompetitorWinsHeading: "Dónde gana Rask AI",
      whereDubsyncWinsHeading: "Dónde gana DubSync",
      whereCompetitorWins: [
        "130+ idiomas vs los 30+ de DubSync",
        "Marca más establecida con más historial",
        "Funciones avanzadas de exportación SRT/subtítulos",
      ],
      whereDubsyncWins: [
        "Lip sync incluido en cada plan (sin penalización 2x)",
        "Lip sync desde $19.99/mes vs $120/mes en Rask AI",
        "Plan gratuito disponible para probar antes de comprometerse",
        "Precio más simple: 1 crédito = 1 minuto, sin multiplicadores",
      ],
      faqs: [
        {
          q: "¿Es DubSync más barato que Rask AI para lip sync?",
          a: "Sí. DubSync incluye lip sync desde $19.99/mes. Rask AI exige Creator Pro a $120/mes y duplica el consumo de créditos, por lo que pagas 6 veces más por una cantidad comparable de contenido con lip sync.",
        },
        {
          q: "¿Rask AI incluye lip sync en todos los planes?",
          a: "No. El plan Creator de Rask AI ($50/mes) no incluye lip sync. El lip sync requiere el plan Creator Pro a $120/mes, donde duplica tu uso de créditos.",
        },
        {
          q: "¿Cuántos minutos de lip sync obtienes en Rask AI vs DubSync?",
          a: "DubSync Starter ($19.99/mes) da 20 minutos de lip sync. Rask AI Creator Pro ($120/mes) da unos 50 minutos efectivos después de la penalización 2x. Es 6 veces el precio por 2.5 veces los minutos.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — Lip Sync Incluido vs Créditos Compartidos",
      metaDescription:
        "HeyGen comparte créditos premium de lip sync con avatares. DubSync incluye lip sync dedicado en cada crédito desde $19.99/mes.",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen comparte créditos de lip sync con avatares y generación. DubSync ofrece lip sync dedicado en cada crédito.",
      verdictBody:
        "DubSync es la opción más clara para doblaje de video con lip sync predecible. HeyGen es una plataforma de avatares de IA donde el lip sync comparte créditos premium con generación de avatares y otras funciones, lo que dificulta planificar el uso. DubSync se centra exclusivamente en doblaje: cada crédito es un minuto completo con lip sync incluido.",
      lipSyncFeatures: [
        "Minutos de lip sync dedicados",
        "Modelo de créditos",
        "Recargos ocultos",
        "Precio de entrada",
        "Capacidad predecible",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "Plataforma de avatares con lip sync como función secundaria.",
      whereCompetitorWinsHeading: "Dónde gana HeyGen",
      whereDubsyncWinsHeading: "Dónde gana DubSync",
      whereCompetitorWins: [
        "175+ idiomas soportados",
        "Avatares de IA generados por IA",
        "Ecosistema más grande para producción de video con IA",
      ],
      whereDubsyncWins: [
        "Lip sync dedicado sin compartir créditos",
        "Capacidad predecible: 1 crédito = 1 minuto de lip sync",
        "Plan gratuito para probar antes de pagar",
        "Precio más bajo para doblaje enfocado en video",
      ],
      faqs: [
        {
          q: "¿Por qué DubSync es más predecible que HeyGen?",
          a: "DubSync usa créditos dedicados a doblaje: 1 crédito = 1 minuto con lip sync. HeyGen comparte créditos premium entre avatares, generación y lip sync, por lo que tu capacidad real depende de cómo los uses.",
        },
        {
          q: "¿HeyGen es mejor para crear avatares?",
          a: "Sí. HeyGen se especializa en avatares de IA y tiene un ecosistema más completo para ese caso de uso. DubSync se enfoca únicamente en doblaje con voz original clonada.",
        },
        {
          q: "¿Puedo usar DubSync para crear avatares?",
          a: "No. DubSync clona la voz del hablante original y sincroniza los labios del video existente, pero no genera avatares nuevos desde texto.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — Lip Sync de Video vs Doblaje Solo Audio",
      metaDescription:
        "ElevenLabs ofrece el mejor audio de IA pero sin lip sync. DubSync añade lip sync a cada video doblado. Compara para localización de video.",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs ofrece audio de IA excepcional pero solo audio. DubSync produce video doblado con lip sync automático.",
      verdictBody:
        "Si necesitas localización de video completo, DubSync es la única opción de las dos. ElevenLabs es líder en síntesis de voz con IA, pero solo entrega audio — tú te encargas de sincronizar y reintegrar al video. DubSync combina clonación de voz, traducción y lip sync automático en un solo flujo y entrega un video MP4 listo para publicar.",
      lipSyncFeatures: [
        "Lip sync incluido",
        "Salida de video",
        "Sincronización automática de labios",
        "Precio del plan inicial",
        "Costo por minuto con lip sync",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "Planes basados en caracteres, no en video. Solo salida de audio.",
      whereCompetitorWinsHeading: "Dónde gana ElevenLabs",
      whereDubsyncWinsHeading: "Dónde gana DubSync",
      whereCompetitorWins: [
        "Mejor calidad de voz de IA del mercado",
        "Biblioteca de voces pre-hechas más grande",
        "Generación de efectos de sonido con IA",
      ],
      whereDubsyncWins: [
        "Video doblado completo, no solo audio",
        "Lip sync automático incluido",
        "Flujo de trabajo de un clic para video",
        "Precio predecible basado en minutos",
      ],
      faqs: [
        {
          q: "¿Puedo usar ElevenLabs para doblar videos?",
          a: "Puedes generar audio doblado con ElevenLabs, pero tendrás que sincronizarlo manualmente con tu video y no tendrás lip sync. DubSync automatiza todo el proceso.",
        },
        {
          q: "¿DubSync usa la tecnología de ElevenLabs?",
          a: "DubSync combina múltiples proveedores de IA de primer nivel para clonación de voz, traducción y lip sync. No dependemos de un solo proveedor.",
        },
        {
          q: "¿Cuál es mejor para creadores de YouTube?",
          a: "DubSync. Los creadores necesitan video terminado con lip sync — no solo pistas de audio. DubSync entrega MP4 listo para subir en minutos.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7 Minutos de Lip Sync",
      metaDescription:
        "GeckoDub divide video y lip sync en grupos separados (solo 7 min lip sync en Starter). DubSync incluye lip sync en los 20 minutos completos.",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub divide minutos de video y lip sync en grupos separados. DubSync incluye lip sync en cada minuto.",
      verdictBody:
        "DubSync gana claramente en valor por dólar de lip sync. El plan Starter de GeckoDub separa los minutos de video y lip sync — obtienes 10 minutos de video pero solo 7 de lip sync. DubSync Starter te da 20 minutos completos con lip sync incluido por $19.99/mes, casi 3 veces más capacidad real.",
      lipSyncFeatures: [
        "Minutos de lip sync (plan Starter)",
        "Estructura de créditos",
        "Costo de lip sync por crédito",
        "Precio del plan inicial",
        "Recargo por lip sync",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "Video y lip sync son grupos de créditos separados en cada plan.",
      whereCompetitorWinsHeading: "Dónde gana GeckoDub",
      whereDubsyncWinsHeading: "Dónde gana DubSync",
      whereCompetitorWins: [
        "60+ idiomas soportados",
        "Interfaz de usuario más pulida en algunas áreas",
        "Características específicas de edición de subtítulos",
      ],
      whereDubsyncWins: [
        "3x más minutos de lip sync por el mismo precio",
        "Modelo de créditos unificado (sin pools separados)",
        "Plan gratuito real con lip sync",
        "Sin recargos ocultos por lip sync",
      ],
      faqs: [
        {
          q: "¿Por qué DubSync da más minutos de lip sync?",
          a: "DubSync usa un grupo de créditos único: cada crédito es 1 minuto con lip sync. GeckoDub divide video y lip sync en grupos separados, por lo que solo 7 de los 10 minutos del plan Starter incluyen lip sync.",
        },
        {
          q: "¿GeckoDub tiene más idiomas que DubSync?",
          a: "Sí, GeckoDub soporta más de 60 idiomas vs los 30+ de DubSync. Si necesitas un idioma poco común fuera de los 30 principales, GeckoDub podría ser la opción.",
        },
        {
          q: "¿Puedo probar DubSync antes de pagar?",
          a: "Sí. El plan gratuito de DubSync incluye 1 video de hasta 15 segundos con lip sync y clonación de voz. Sin tarjeta de crédito.",
        },
      ],
    },
  },
  pt: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — Lip Sync a partir de $19.99 vs $120/mês",
      metaDescription:
        "Rask AI cobra $120/mês pelo lip sync e dobra o uso de créditos. DubSync inclui lip sync em cada crédito a partir de $19.99. Compare recursos e custos.",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI cobra $120/mês pelo lip sync e dobra seus créditos. DubSync inclui lip sync em cada crédito a partir de $19.99.",
      verdictBody:
        "O DubSync é a melhor escolha para criadores que precisam de dublagem com lip sync a um preço acessível. Por $19.99/mês você obtém 20 minutos com lip sync incluído — uma fração do que o Rask AI cobra. O Rask AI exige o plano Creator Pro de $120/mês para lip sync e dobra o consumo de créditos. Escolha o Rask AI apenas se precisar de idiomas raros além dos 30+ do DubSync.",
      lipSyncFeatures: [
        "Minutos de lip sync (plano inicial)",
        "Custo por crédito de lip sync",
        "Capacidade efetiva de lip sync (Pro)",
        "10 min × 3 idiomas: créditos lip sync",
        "Preço de acesso ao lip sync",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "Sem plano gratuito. Lip sync usa 2x créditos apenas no Creator Pro.",
      whereCompetitorWinsHeading: "Onde o Rask AI vence",
      whereDubsyncWinsHeading: "Onde o DubSync vence",
      whereCompetitorWins: [
        "130+ idiomas vs 30+ do DubSync",
        "Marca mais estabelecida com histórico mais longo",
        "Recursos avançados de exportação SRT/legendas",
      ],
      whereDubsyncWins: [
        "Lip sync incluído em cada plano (sem penalidade 2x)",
        "Lip sync a partir de $19.99/mês vs $120/mês no Rask AI",
        "Plano gratuito disponível para testar antes de se comprometer",
        "Preço mais simples: 1 crédito = 1 minuto, sem multiplicadores",
      ],
      faqs: [
        {
          q: "O DubSync é mais barato que o Rask AI para lip sync?",
          a: "Sim. O DubSync inclui lip sync a partir de $19.99/mês. O Rask AI exige Creator Pro a $120/mês e dobra o consumo de créditos, então você paga 6x mais por uma quantidade comparável de conteúdo com lip sync.",
        },
        {
          q: "O Rask AI inclui lip sync em todos os planos?",
          a: "Não. O plano Creator do Rask AI ($50/mês) não inclui lip sync. O lip sync exige o plano Creator Pro a $120/mês, onde dobra seu uso de créditos.",
        },
        {
          q: "Quantos minutos de lip sync você obtém no Rask AI vs DubSync?",
          a: "DubSync Starter ($19.99/mês) dá 20 minutos de lip sync. Rask AI Creator Pro ($120/mês) dá cerca de 50 minutos efetivos após a penalidade 2x. É 6x o preço por 2.5x os minutos.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — Lip Sync Incluído vs Créditos Compartilhados",
      metaDescription:
        "HeyGen compartilha créditos premium de lip sync com avatares. DubSync oferece lip sync dedicado em cada crédito a partir de $19.99/mês.",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen compartilha créditos de lip sync com avatares e geração. DubSync oferece lip sync dedicado em cada crédito.",
      verdictBody:
        "O DubSync é a escolha mais clara para dublagem de vídeo com lip sync previsível. O HeyGen é uma plataforma de avatares de IA onde o lip sync compartilha créditos premium com geração de avatares, dificultando o planejamento de uso. O DubSync se concentra exclusivamente em dublagem: cada crédito é um minuto completo com lip sync incluído.",
      lipSyncFeatures: [
        "Minutos de lip sync dedicados",
        "Modelo de créditos",
        "Taxas ocultas",
        "Preço de entrada",
        "Capacidade previsível",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "Plataforma de avatares com lip sync como recurso secundário.",
      whereCompetitorWinsHeading: "Onde o HeyGen vence",
      whereDubsyncWinsHeading: "Onde o DubSync vence",
      whereCompetitorWins: [
        "175+ idiomas suportados",
        "Avatares de IA gerados por IA",
        "Ecossistema maior para produção de vídeo com IA",
      ],
      whereDubsyncWins: [
        "Lip sync dedicado sem compartilhar créditos",
        "Capacidade previsível: 1 crédito = 1 minuto de lip sync",
        "Plano gratuito para testar antes de pagar",
        "Preço mais baixo para dublagem focada em vídeo",
      ],
      faqs: [
        {
          q: "Por que o DubSync é mais previsível que o HeyGen?",
          a: "O DubSync usa créditos dedicados à dublagem: 1 crédito = 1 minuto com lip sync. O HeyGen compartilha créditos premium entre avatares, geração e lip sync, então sua capacidade real depende de como você os usa.",
        },
        {
          q: "O HeyGen é melhor para criar avatares?",
          a: "Sim. O HeyGen se especializa em avatares de IA e tem um ecossistema mais completo para esse caso de uso. O DubSync se concentra apenas em dublagem com clonagem de voz original.",
        },
        {
          q: "Posso usar o DubSync para criar avatares?",
          a: "Não. O DubSync clona a voz do locutor original e sincroniza os lábios do vídeo existente, mas não gera novos avatares a partir de texto.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — Lip Sync de Vídeo vs Dublagem Só Áudio",
      metaDescription:
        "ElevenLabs oferece o melhor áudio de IA, mas sem lip sync. DubSync adiciona lip sync a cada vídeo dublado. Compare para localização de vídeo.",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs oferece áudio de IA excepcional, mas apenas áudio. DubSync produz vídeo dublado com lip sync automático.",
      verdictBody:
        "Se você precisa de localização completa de vídeo, o DubSync é a única opção entre os dois. O ElevenLabs é líder em síntese de voz com IA, mas entrega apenas áudio — você precisa sincronizar e reintegrar ao vídeo. O DubSync combina clonagem de voz, tradução e lip sync automático em um único fluxo e entrega um MP4 pronto para publicar.",
      lipSyncFeatures: [
        "Lip sync incluído",
        "Saída de vídeo",
        "Sincronização automática de lábios",
        "Preço do plano inicial",
        "Custo por minuto com lip sync",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "Planos baseados em caracteres, não em vídeo. Apenas saída de áudio.",
      whereCompetitorWinsHeading: "Onde o ElevenLabs vence",
      whereDubsyncWinsHeading: "Onde o DubSync vence",
      whereCompetitorWins: [
        "Melhor qualidade de voz de IA do mercado",
        "Maior biblioteca de vozes pré-feitas",
        "Geração de efeitos sonoros com IA",
      ],
      whereDubsyncWins: [
        "Vídeo dublado completo, não apenas áudio",
        "Lip sync automático incluído",
        "Fluxo de trabalho de um clique para vídeo",
        "Preço previsível baseado em minutos",
      ],
      faqs: [
        {
          q: "Posso usar o ElevenLabs para dublar vídeos?",
          a: "Você pode gerar áudio dublado com o ElevenLabs, mas precisará sincronizá-lo manualmente com seu vídeo e não terá lip sync. O DubSync automatiza todo o processo.",
        },
        {
          q: "O DubSync usa a tecnologia do ElevenLabs?",
          a: "O DubSync combina vários provedores de IA de primeira linha para clonagem de voz, tradução e lip sync. Não dependemos de um único provedor.",
        },
        {
          q: "Qual é melhor para criadores de YouTube?",
          a: "DubSync. Os criadores precisam de vídeo finalizado com lip sync — não apenas faixas de áudio. O DubSync entrega MP4 pronto para upload em minutos.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7 Minutos de Lip Sync",
      metaDescription:
        "GeckoDub divide vídeo e lip sync em pools separados (apenas 7 min lip sync no Starter). DubSync inclui lip sync nos 20 minutos completos.",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub divide minutos de vídeo e lip sync em pools separados. DubSync inclui lip sync em cada minuto.",
      verdictBody:
        "O DubSync vence claramente em valor por dólar de lip sync. O plano Starter do GeckoDub separa os minutos de vídeo e lip sync — você obtém 10 minutos de vídeo, mas apenas 7 de lip sync. O DubSync Starter dá 20 minutos completos com lip sync incluído por $19.99/mês, quase 3x mais capacidade real.",
      lipSyncFeatures: [
        "Minutos de lip sync (plano Starter)",
        "Estrutura de créditos",
        "Custo de lip sync por crédito",
        "Preço do plano inicial",
        "Taxa extra por lip sync",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "Vídeo e lip sync são pools de créditos separados em cada plano.",
      whereCompetitorWinsHeading: "Onde o GeckoDub vence",
      whereDubsyncWinsHeading: "Onde o DubSync vence",
      whereCompetitorWins: [
        "60+ idiomas suportados",
        "Interface de usuário mais polida em algumas áreas",
        "Recursos específicos de edição de legendas",
      ],
      whereDubsyncWins: [
        "3x mais minutos de lip sync pelo mesmo preço",
        "Modelo de créditos unificado (sem pools separados)",
        "Plano gratuito real com lip sync",
        "Sem taxas ocultas por lip sync",
      ],
      faqs: [
        {
          q: "Por que o DubSync oferece mais minutos de lip sync?",
          a: "O DubSync usa um único pool de créditos: cada crédito é 1 minuto com lip sync. O GeckoDub divide vídeo e lip sync em pools separados, então apenas 7 dos 10 minutos do plano Starter incluem lip sync.",
        },
        {
          q: "O GeckoDub tem mais idiomas que o DubSync?",
          a: "Sim, o GeckoDub suporta mais de 60 idiomas vs 30+ do DubSync. Se você precisa de um idioma raro fora dos 30 principais, o GeckoDub pode ser a opção.",
        },
        {
          q: "Posso testar o DubSync antes de pagar?",
          a: "Sim. O plano gratuito do DubSync inclui 1 vídeo de até 15 segundos com lip sync e clonagem de voz. Sem cartão de crédito.",
        },
      ],
    },
  },
  de: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — Lippensync ab 19,99 $ vs 120 $/Monat",
      metaDescription:
        "Rask AI verlangt 120 $/Monat für Lippensync und verdoppelt den Credit-Verbrauch. DubSync enthält Lippensync in jedem Credit ab 19,99 $. Vergleich.",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI verlangt 120 $/Monat für Lippensync und verdoppelt deine Credits. DubSync enthält Lippensync in jedem Credit ab 19,99 $.",
      verdictBody:
        "DubSync ist die bessere Wahl für Creator, die lippensynchronisierte Synchronisation zu einem erschwinglichen Preis benötigen. Für 19,99 $/Monat erhältst du 20 Minuten mit Lippensync — ein Bruchteil dessen, was Rask AI verlangt. Rask AI erfordert den Creator-Pro-Plan für 120 $/Monat und verdoppelt den Credit-Verbrauch. Wähle Rask AI nur, wenn du seltene Sprachen außerhalb der 30+ von DubSync brauchst.",
      lipSyncFeatures: [
        "Lippensync-Minuten (Starter-Plan)",
        "Kosten pro Lippensync-Credit",
        "Effektive Lippensync-Kapazität (Pro)",
        "10 Min × 3 Sprachen: Lippensync-Credits",
        "Preis für Lippensync-Zugang",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "Kein kostenloser Plan. Lippensync nutzt 2x Credits nur im Creator Pro.",
      whereCompetitorWinsHeading: "Wo Rask AI gewinnt",
      whereDubsyncWinsHeading: "Wo DubSync gewinnt",
      whereCompetitorWins: [
        "130+ Sprachen vs 30+ von DubSync",
        "Etabliertere Marke mit längerer Historie",
        "Erweiterte SRT-/Untertitel-Exportfunktionen",
      ],
      whereDubsyncWins: [
        "Lippensync in jedem Plan enthalten (keine 2x-Strafe)",
        "Lippensync ab 19,99 $/Monat vs 120 $/Monat bei Rask AI",
        "Kostenloser Plan zum Testen vor dem Kauf",
        "Einfachere Preise: 1 Credit = 1 Minute, keine Multiplikatoren",
      ],
      faqs: [
        {
          q: "Ist DubSync günstiger als Rask AI für Lippensync?",
          a: "Ja. DubSync enthält Lippensync ab 19,99 $/Monat. Rask AI erfordert Creator Pro für 120 $/Monat und verdoppelt den Credit-Verbrauch, sodass du 6x mehr für eine vergleichbare Menge an lippensynchronisierten Inhalten zahlst.",
        },
        {
          q: "Enthält Rask AI Lippensync in allen Plänen?",
          a: "Nein. Der Creator-Plan von Rask AI (50 $/Monat) enthält kein Lippensync. Lippensync erfordert den Creator-Pro-Plan für 120 $/Monat, wo es deinen Credit-Verbrauch verdoppelt.",
        },
        {
          q: "Wie viele Lippensync-Minuten erhältst du bei Rask AI vs DubSync?",
          a: "DubSync Starter (19,99 $/Monat) bietet 20 Lippensync-Minuten. Rask AI Creator Pro (120 $/Monat) bietet ca. 50 effektive Minuten nach der 2x-Strafe. Das ist 6x der Preis für 2,5x die Minuten.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — Lippensync inklusive vs geteilte Credits",
      metaDescription:
        "HeyGen teilt Premium-Credits für Lippensync mit Avataren. DubSync bietet dediziertes Lippensync in jedem Credit ab 19,99 $/Monat.",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen teilt Lippensync-Credits mit Avataren und Generierung. DubSync bietet dediziertes Lippensync in jedem Credit.",
      verdictBody:
        "DubSync ist die klarere Wahl für Videosynchronisation mit vorhersehbarem Lippensync. HeyGen ist eine KI-Avatar-Plattform, bei der Lippensync Premium-Credits mit Avatar-Generierung und anderen Funktionen teilt, was die Nutzungsplanung erschwert. DubSync konzentriert sich ausschließlich auf Synchronisation: Jedes Credit ist eine volle Minute mit Lippensync.",
      lipSyncFeatures: [
        "Dedizierte Lippensync-Minuten",
        "Credit-Modell",
        "Versteckte Gebühren",
        "Einstiegspreis",
        "Vorhersehbare Kapazität",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "Avatar-Plattform mit Lippensync als Nebenfunktion.",
      whereCompetitorWinsHeading: "Wo HeyGen gewinnt",
      whereDubsyncWinsHeading: "Wo DubSync gewinnt",
      whereCompetitorWins: [
        "175+ unterstützte Sprachen",
        "KI-generierte KI-Avatare",
        "Größeres Ökosystem für KI-Videoproduktion",
      ],
      whereDubsyncWins: [
        "Dediziertes Lippensync ohne geteilte Credits",
        "Vorhersehbare Kapazität: 1 Credit = 1 Minute Lippensync",
        "Kostenloser Plan zum Testen vor dem Kauf",
        "Niedrigerer Preis für video-fokussierte Synchronisation",
      ],
      faqs: [
        {
          q: "Warum ist DubSync vorhersehbarer als HeyGen?",
          a: "DubSync verwendet dedizierte Synchronisations-Credits: 1 Credit = 1 Minute mit Lippensync. HeyGen teilt Premium-Credits zwischen Avataren, Generierung und Lippensync, sodass deine tatsächliche Kapazität davon abhängt, wie du sie verwendest.",
        },
        {
          q: "Ist HeyGen besser für das Erstellen von Avataren?",
          a: "Ja. HeyGen ist auf KI-Avatare spezialisiert und hat ein vollständigeres Ökosystem für diesen Anwendungsfall. DubSync konzentriert sich ausschließlich auf Synchronisation mit geklonter Originalstimme.",
        },
        {
          q: "Kann ich DubSync zum Erstellen von Avataren verwenden?",
          a: "Nein. DubSync klont die Stimme des Originalsprechers und synchronisiert die Lippen im bestehenden Video, generiert aber keine neuen Avatare aus Text.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — Video-Lippensync vs Audio-Only",
      metaDescription:
        "ElevenLabs bietet besten KI-Audio, aber kein Lippensync. DubSync fügt Lippensync zu jedem synchronisierten Video hinzu. Video-Lokalisierung.",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs bietet hervorragenden KI-Audio, aber nur Audio. DubSync erstellt synchronisierte Videos mit automatischem Lippensync.",
      verdictBody:
        "Wenn du vollständige Video-Lokalisierung brauchst, ist DubSync die einzige Option. ElevenLabs ist führend in KI-Sprachsynthese, liefert aber nur Audio — du musst selbst synchronisieren und ins Video einfügen. DubSync kombiniert Stimmklonen, Übersetzung und automatisches Lippensync in einem einzigen Workflow und liefert ein veröffentlichungsfertiges MP4.",
      lipSyncFeatures: [
        "Lippensync enthalten",
        "Videoausgabe",
        "Automatische Lippensynchronisation",
        "Einstiegspreis",
        "Kosten pro Minute mit Lippensync",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "Zeichenbasierte Pläne, nicht videobasiert. Nur Audioausgabe.",
      whereCompetitorWinsHeading: "Wo ElevenLabs gewinnt",
      whereDubsyncWinsHeading: "Wo DubSync gewinnt",
      whereCompetitorWins: [
        "Beste KI-Sprachqualität auf dem Markt",
        "Größere Bibliothek vorgefertigter Stimmen",
        "KI-Soundeffekt-Generierung",
      ],
      whereDubsyncWins: [
        "Vollständiges synchronisiertes Video, nicht nur Audio",
        "Automatisches Lippensync enthalten",
        "Ein-Klick-Workflow für Video",
        "Vorhersehbare Preise basierend auf Minuten",
      ],
      faqs: [
        {
          q: "Kann ich ElevenLabs zum Synchronisieren von Videos verwenden?",
          a: "Du kannst mit ElevenLabs synchronisiertes Audio generieren, musst es aber manuell mit deinem Video synchronisieren und hast kein Lippensync. DubSync automatisiert den gesamten Prozess.",
        },
        {
          q: "Verwendet DubSync die Technologie von ElevenLabs?",
          a: "DubSync kombiniert mehrere erstklassige KI-Anbieter für Stimmklonen, Übersetzung und Lippensync. Wir sind nicht von einem einzigen Anbieter abhängig.",
        },
        {
          q: "Was ist besser für YouTube-Creator?",
          a: "DubSync. Creator brauchen fertige Videos mit Lippensync — nicht nur Audiospuren. DubSync liefert hochlade-fertige MP4 in Minuten.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7 Lippensync-Minuten",
      metaDescription:
        "GeckoDub trennt Video- und Lippensync-Minuten (nur 7 Min Lippensync im Starter). DubSync enthält Lippensync in allen 20 Minuten.",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub teilt Video- und Lippensync-Minuten in separate Pools. DubSync enthält Lippensync in jeder Minute.",
      verdictBody:
        "DubSync gewinnt klar beim Preis-Leistungs-Verhältnis von Lippensync. Der Starter-Plan von GeckoDub trennt Video- und Lippensync-Minuten — du erhältst 10 Videominuten, aber nur 7 mit Lippensync. DubSync Starter bietet 20 volle Minuten mit Lippensync für 19,99 $/Monat, fast 3x mehr echte Kapazität.",
      lipSyncFeatures: [
        "Lippensync-Minuten (Starter-Plan)",
        "Credit-Struktur",
        "Lippensync-Kosten pro Credit",
        "Einstiegspreis",
        "Extra-Gebühr für Lippensync",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "Video und Lippensync sind in jedem Plan getrennte Credit-Pools.",
      whereCompetitorWinsHeading: "Wo GeckoDub gewinnt",
      whereDubsyncWinsHeading: "Wo DubSync gewinnt",
      whereCompetitorWins: [
        "60+ unterstützte Sprachen",
        "Polierte Benutzeroberfläche in einigen Bereichen",
        "Spezifische Untertitel-Bearbeitungsfunktionen",
      ],
      whereDubsyncWins: [
        "3x mehr Lippensync-Minuten zum gleichen Preis",
        "Einheitliches Credit-Modell (keine separaten Pools)",
        "Echter kostenloser Plan mit Lippensync",
        "Keine versteckten Gebühren für Lippensync",
      ],
      faqs: [
        {
          q: "Warum bietet DubSync mehr Lippensync-Minuten?",
          a: "DubSync verwendet einen einzigen Credit-Pool: Jedes Credit ist 1 Minute mit Lippensync. GeckoDub trennt Video und Lippensync in separate Pools, sodass nur 7 der 10 Minuten des Starter-Plans Lippensync enthalten.",
        },
        {
          q: "Hat GeckoDub mehr Sprachen als DubSync?",
          a: "Ja, GeckoDub unterstützt über 60 Sprachen vs 30+ bei DubSync. Wenn du eine seltene Sprache außerhalb der Top 30 brauchst, könnte GeckoDub die Wahl sein.",
        },
        {
          q: "Kann ich DubSync vor dem Kauf testen?",
          a: "Ja. Der kostenlose Plan von DubSync umfasst 1 Video bis zu 15 Sekunden mit Lippensync und Stimmklonen. Keine Kreditkarte erforderlich.",
        },
      ],
    },
  },
  fr: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — Lip sync à 19,99 $ vs 120 $/mois",
      metaDescription:
        "Rask AI facture 120 $/mois pour le lip sync et double l'utilisation des crédits. DubSync inclut le lip sync dans chaque crédit dès 19,99 $. Comparaison.",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI facture 120 $/mois pour le lip sync et double vos crédits. DubSync inclut le lip sync dans chaque crédit dès 19,99 $.",
      verdictBody:
        "DubSync est le meilleur choix pour les créateurs qui ont besoin de doublage avec lip sync à prix abordable. Pour 19,99 $/mois, vous obtenez 20 minutes avec lip sync inclus — une fraction de ce que Rask AI facture. Rask AI exige le plan Creator Pro à 120 $/mois pour le lip sync et double la consommation de crédits. Choisissez Rask AI seulement si vous avez besoin de langues rares au-delà des 30+ de DubSync.",
      lipSyncFeatures: [
        "Minutes de lip sync (plan Starter)",
        "Coût par crédit de lip sync",
        "Capacité effective de lip sync (Pro)",
        "10 min × 3 langues : crédits lip sync",
        "Prix d'accès au lip sync",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "Pas de plan gratuit. Lip sync utilise 2x crédits uniquement sur Creator Pro.",
      whereCompetitorWinsHeading: "Où Rask AI gagne",
      whereDubsyncWinsHeading: "Où DubSync gagne",
      whereCompetitorWins: [
        "130+ langues vs 30+ pour DubSync",
        "Marque plus établie avec un historique plus long",
        "Fonctionnalités avancées d'exportation SRT/sous-titres",
      ],
      whereDubsyncWins: [
        "Lip sync inclus dans chaque plan (pas de pénalité 2x)",
        "Lip sync dès 19,99 $/mois vs 120 $/mois sur Rask AI",
        "Plan gratuit disponible pour tester avant de s'engager",
        "Prix plus simple : 1 crédit = 1 minute, pas de multiplicateurs",
      ],
      faqs: [
        {
          q: "DubSync est-il moins cher que Rask AI pour le lip sync ?",
          a: "Oui. DubSync inclut le lip sync dès 19,99 $/mois. Rask AI exige Creator Pro à 120 $/mois et double la consommation de crédits, donc vous payez 6x plus pour une quantité comparable de contenu avec lip sync.",
        },
        {
          q: "Rask AI inclut-il le lip sync sur tous les plans ?",
          a: "Non. Le plan Creator de Rask AI (50 $/mois) n'inclut pas le lip sync. Le lip sync nécessite le plan Creator Pro à 120 $/mois, où il double votre utilisation de crédits.",
        },
        {
          q: "Combien de minutes de lip sync obtenez-vous sur Rask AI vs DubSync ?",
          a: "DubSync Starter (19,99 $/mois) donne 20 minutes de lip sync. Rask AI Creator Pro (120 $/mois) donne environ 50 minutes effectives après la pénalité 2x. C'est 6x le prix pour 2,5x les minutes.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — Lip Sync inclus vs crédits partagés",
      metaDescription:
        "HeyGen partage les crédits premium de lip sync avec les avatars. DubSync offre un lip sync dédié dans chaque crédit dès 19,99 $/mois.",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen partage les crédits de lip sync avec les avatars et la génération. DubSync offre un lip sync dédié dans chaque crédit.",
      verdictBody:
        "DubSync est le choix le plus clair pour le doublage vidéo avec lip sync prévisible. HeyGen est une plateforme d'avatars IA où le lip sync partage les crédits premium avec la génération d'avatars, ce qui rend la planification de l'utilisation difficile. DubSync se concentre exclusivement sur le doublage : chaque crédit est une minute complète avec lip sync.",
      lipSyncFeatures: [
        "Minutes de lip sync dédiées",
        "Modèle de crédits",
        "Frais cachés",
        "Prix d'entrée",
        "Capacité prévisible",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "Plateforme d'avatars avec lip sync comme fonctionnalité secondaire.",
      whereCompetitorWinsHeading: "Où HeyGen gagne",
      whereDubsyncWinsHeading: "Où DubSync gagne",
      whereCompetitorWins: [
        "175+ langues prises en charge",
        "Avatars IA générés par IA",
        "Écosystème plus grand pour la production vidéo IA",
      ],
      whereDubsyncWins: [
        "Lip sync dédié sans partage de crédits",
        "Capacité prévisible : 1 crédit = 1 minute de lip sync",
        "Plan gratuit pour tester avant de payer",
        "Prix plus bas pour le doublage centré sur la vidéo",
      ],
      faqs: [
        {
          q: "Pourquoi DubSync est-il plus prévisible que HeyGen ?",
          a: "DubSync utilise des crédits dédiés au doublage : 1 crédit = 1 minute avec lip sync. HeyGen partage les crédits premium entre avatars, génération et lip sync, donc votre capacité réelle dépend de la façon dont vous les utilisez.",
        },
        {
          q: "HeyGen est-il meilleur pour créer des avatars ?",
          a: "Oui. HeyGen se spécialise dans les avatars IA et possède un écosystème plus complet pour ce cas d'usage. DubSync se concentre uniquement sur le doublage avec clonage de voix originale.",
        },
        {
          q: "Puis-je utiliser DubSync pour créer des avatars ?",
          a: "Non. DubSync clone la voix du locuteur original et synchronise les lèvres de la vidéo existante, mais ne génère pas de nouveaux avatars à partir de texte.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — Lip sync vidéo vs audio uniquement",
      metaDescription:
        "ElevenLabs offre le meilleur audio IA mais pas de lip sync. DubSync ajoute le lip sync à chaque vidéo doublée. Comparez pour la localisation vidéo.",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs offre un audio IA exceptionnel mais uniquement audio. DubSync produit de la vidéo doublée avec lip sync automatique.",
      verdictBody:
        "Si vous avez besoin de localisation vidéo complète, DubSync est la seule option. ElevenLabs est leader en synthèse vocale IA mais ne livre que de l'audio — vous devez synchroniser et réintégrer à la vidéo. DubSync combine clonage vocal, traduction et lip sync automatique dans un seul flux et livre un MP4 prêt à publier.",
      lipSyncFeatures: [
        "Lip sync inclus",
        "Sortie vidéo",
        "Synchronisation automatique des lèvres",
        "Prix du plan de départ",
        "Coût par minute avec lip sync",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "Plans basés sur les caractères, pas la vidéo. Sortie audio uniquement.",
      whereCompetitorWinsHeading: "Où ElevenLabs gagne",
      whereDubsyncWinsHeading: "Où DubSync gagne",
      whereCompetitorWins: [
        "Meilleure qualité de voix IA du marché",
        "Plus grande bibliothèque de voix préfabriquées",
        "Génération d'effets sonores IA",
      ],
      whereDubsyncWins: [
        "Vidéo doublée complète, pas juste de l'audio",
        "Lip sync automatique inclus",
        "Flux en un clic pour la vidéo",
        "Prix prévisible basé sur les minutes",
      ],
      faqs: [
        {
          q: "Puis-je utiliser ElevenLabs pour doubler des vidéos ?",
          a: "Vous pouvez générer de l'audio doublé avec ElevenLabs, mais devrez le synchroniser manuellement avec votre vidéo et n'aurez pas de lip sync. DubSync automatise tout le processus.",
        },
        {
          q: "DubSync utilise-t-il la technologie d'ElevenLabs ?",
          a: "DubSync combine plusieurs fournisseurs IA de premier plan pour le clonage vocal, la traduction et le lip sync. Nous ne dépendons pas d'un seul fournisseur.",
        },
        {
          q: "Quel est le meilleur pour les créateurs YouTube ?",
          a: "DubSync. Les créateurs ont besoin de vidéos finalisées avec lip sync — pas seulement des pistes audio. DubSync livre des MP4 prêts à téléverser en minutes.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7 minutes de lip sync",
      metaDescription:
        "GeckoDub sépare vidéo et lip sync en pools distincts (seulement 7 min lip sync au Starter). DubSync inclut le lip sync dans les 20 minutes complètes.",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub sépare les minutes vidéo et lip sync en pools distincts. DubSync inclut le lip sync dans chaque minute.",
      verdictBody:
        "DubSync gagne clairement en valeur par dollar de lip sync. Le plan Starter de GeckoDub sépare les minutes vidéo et lip sync — vous obtenez 10 minutes vidéo mais seulement 7 de lip sync. DubSync Starter donne 20 minutes complètes avec lip sync inclus pour 19,99 $/mois, presque 3x plus de capacité réelle.",
      lipSyncFeatures: [
        "Minutes de lip sync (plan Starter)",
        "Structure des crédits",
        "Coût lip sync par crédit",
        "Prix du plan de départ",
        "Frais supplémentaires pour lip sync",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "Vidéo et lip sync sont des pools de crédits distincts dans chaque plan.",
      whereCompetitorWinsHeading: "Où GeckoDub gagne",
      whereDubsyncWinsHeading: "Où DubSync gagne",
      whereCompetitorWins: [
        "60+ langues prises en charge",
        "Interface utilisateur plus polie dans certains domaines",
        "Fonctionnalités spécifiques d'édition de sous-titres",
      ],
      whereDubsyncWins: [
        "3x plus de minutes de lip sync au même prix",
        "Modèle de crédits unifié (pas de pools distincts)",
        "Vrai plan gratuit avec lip sync",
        "Pas de frais cachés pour le lip sync",
      ],
      faqs: [
        {
          q: "Pourquoi DubSync offre-t-il plus de minutes de lip sync ?",
          a: "DubSync utilise un seul pool de crédits : chaque crédit est 1 minute avec lip sync. GeckoDub sépare vidéo et lip sync en pools distincts, donc seulement 7 des 10 minutes du plan Starter incluent le lip sync.",
        },
        {
          q: "GeckoDub a-t-il plus de langues que DubSync ?",
          a: "Oui, GeckoDub prend en charge plus de 60 langues vs 30+ pour DubSync. Si vous avez besoin d'une langue rare au-delà des 30 principales, GeckoDub peut être le choix.",
        },
        {
          q: "Puis-je essayer DubSync avant de payer ?",
          a: "Oui. Le plan gratuit de DubSync inclut 1 vidéo jusqu'à 15 secondes avec lip sync et clonage vocal. Sans carte de crédit.",
        },
      ],
    },
  },
  ja: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — リップシンク $19.99 vs $120/月",
      metaDescription:
        "Rask AIはリップシンクに$120/月を請求し、クレジット消費を倍増させます。DubSyncは$19.99から各クレジットにリップシンクを含みます。比較。",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AIはリップシンクに$120/月を請求し、クレジットを倍増させます。DubSyncは$19.99から各クレジットにリップシンクを含みます。",
      verdictBody:
        "DubSyncは手頃な価格でリップシンク付き吹き替えが必要なクリエイターにとって最良の選択です。月額$19.99でリップシンク込み20分 — Rask AIの料金の一部です。Rask AIはリップシンクに$120/月のCreator Proプランが必要で、クレジット消費を倍増させます。DubSyncの30以上を超える珍しい言語が必要な場合のみRask AIを選択してください。",
      lipSyncFeatures: [
        "リップシンク分数（Starterプラン）",
        "リップシンクのクレジットコスト",
        "実効リップシンク容量（Pro）",
        "10分×3言語：リップシンククレジット",
        "リップシンクアクセスの価格",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "無料プランなし。リップシンクはCreator Proでのみ2xクレジットを使用。",
      whereCompetitorWinsHeading: "Rask AIが勝る点",
      whereDubsyncWinsHeading: "DubSyncが勝る点",
      whereCompetitorWins: [
        "DubSyncの30以上に対して130以上の言語",
        "より確立されたブランドと長い実績",
        "高度なSRT/字幕エクスポート機能",
      ],
      whereDubsyncWins: [
        "すべてのプランでリップシンク付き（2xペナルティなし）",
        "Rask AIの$120/月に対し、$19.99/月からリップシンク",
        "契約前にテストできる無料プラン",
        "よりシンプルな価格：1クレジット=1分、乗数なし",
      ],
      faqs: [
        {
          q: "DubSyncはリップシンクでRask AIより安いですか？",
          a: "はい。DubSyncは$19.99/月からリップシンクを含みます。Rask AIは$120/月のCreator Proが必要で、クレジット消費を倍増させるため、同等のリップシンク付きコンテンツに対して6倍の料金を支払うことになります。",
        },
        {
          q: "Rask AIはすべてのプランにリップシンクを含みますか？",
          a: "いいえ。Rask AIのCreatorプラン（$50/月）にはリップシンクは含まれません。リップシンクには$120/月のCreator Proプランが必要で、クレジット使用量が倍増します。",
        },
        {
          q: "Rask AI vs DubSyncのリップシンク分数はどのくらいですか？",
          a: "DubSync Starter（$19.99/月）は20分のリップシンクを提供します。Rask AI Creator Pro（$120/月）は2xペナルティ後に約50分の実効時間を提供します。6倍の価格で2.5倍の分数です。",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — リップシンク付属 vs 共有クレジット",
      metaDescription:
        "HeyGenはプレミアムリップシンククレジットをアバターと共有します。DubSyncは$19.99/月から各クレジットに専用リップシンクを提供。",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGenはリップシンククレジットをアバターや生成と共有します。DubSyncは各クレジットに専用リップシンクを提供。",
      verdictBody:
        "DubSyncは予測可能なリップシンク付き動画吹き替えにとってより明確な選択肢です。HeyGenはリップシンクがアバター生成などの機能とプレミアムクレジットを共有するAIアバタープラットフォームで、使用計画が難しくなります。DubSyncは吹き替えのみに集中：各クレジットはリップシンク付きの完全な1分です。",
      lipSyncFeatures: [
        "専用リップシンク分数",
        "クレジットモデル",
        "隠れた料金",
        "エントリー価格",
        "予測可能な容量",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "リップシンクを副次機能とするアバタープラットフォーム。",
      whereCompetitorWinsHeading: "HeyGenが勝る点",
      whereDubsyncWinsHeading: "DubSyncが勝る点",
      whereCompetitorWins: [
        "175以上の対応言語",
        "AI生成のAIアバター",
        "AI動画制作向けの大きなエコシステム",
      ],
      whereDubsyncWins: [
        "クレジットを共有しない専用リップシンク",
        "予測可能な容量：1クレジット=1分のリップシンク",
        "支払い前にテストできる無料プラン",
        "動画特化型吹き替えのより低い価格",
      ],
      faqs: [
        {
          q: "なぜDubSyncはHeyGenより予測可能ですか？",
          a: "DubSyncは吹き替え専用クレジットを使用：1クレジット=リップシンク付き1分。HeyGenはアバター、生成、リップシンクの間でプレミアムクレジットを共有するため、実際の容量は使い方次第です。",
        },
        {
          q: "HeyGenはアバター作成に優れていますか？",
          a: "はい。HeyGenはAIアバターに特化しており、その用途に対してより完全なエコシステムを持っています。DubSyncはオリジナル音声クローンによる吹き替えのみに焦点を当てています。",
        },
        {
          q: "DubSyncでアバターを作成できますか？",
          a: "いいえ。DubSyncは元の話者の声をクローンし、既存の動画の唇を同期しますが、テキストから新しいアバターを生成することはできません。",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — 動画リップシンク vs 音声のみ吹き替え",
      metaDescription:
        "ElevenLabsは最高のAI音声を提供しますが、リップシンクはありません。DubSyncは各吹き替え動画にリップシンクを追加。動画ローカライズ比較。",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabsは優れたAI音声を提供しますが、音声のみです。DubSyncは自動リップシンク付きの吹き替え動画を生成します。",
      verdictBody:
        "完全な動画ローカライズが必要な場合、DubSyncは唯一の選択肢です。ElevenLabsはAI音声合成のリーダーですが、音声のみを提供 — 動画への同期と再統合は自分で行う必要があります。DubSyncは音声クローン、翻訳、自動リップシンクを単一のワークフローに組み合わせ、公開準備完了のMP4を提供します。",
      lipSyncFeatures: [
        "リップシンク付属",
        "動画出力",
        "自動唇同期",
        "スタータープランの価格",
        "リップシンク付き1分あたりのコスト",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "文字ベースのプラン（動画ベースではない）。音声出力のみ。",
      whereCompetitorWinsHeading: "ElevenLabsが勝る点",
      whereDubsyncWinsHeading: "DubSyncが勝る点",
      whereCompetitorWins: [
        "市場最高のAI音声品質",
        "より大きな既製音声ライブラリ",
        "AI効果音生成",
      ],
      whereDubsyncWins: [
        "音声だけでなく完全な吹き替え動画",
        "自動リップシンク付属",
        "動画向けワンクリックワークフロー",
        "分数ベースの予測可能な価格",
      ],
      faqs: [
        {
          q: "ElevenLabsを動画の吹き替えに使用できますか？",
          a: "ElevenLabsで吹き替え音声を生成できますが、手動で動画と同期する必要があり、リップシンクもありません。DubSyncは全プロセスを自動化します。",
        },
        {
          q: "DubSyncはElevenLabsの技術を使用していますか？",
          a: "DubSyncは音声クローン、翻訳、リップシンクに複数の一流AIプロバイダーを組み合わせています。単一のプロバイダーに依存しません。",
        },
        {
          q: "YouTubeクリエイターにはどちらが適していますか？",
          a: "DubSyncです。クリエイターはリップシンク付きの完成動画が必要です — 音声トラックだけではありません。DubSyncは数分でアップロード準備完了のMP4を提供します。",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7分のリップシンク",
      metaDescription:
        "GeckoDubは動画とリップシンクを別々のプールに分割（Starterではわずか7分のリップシンク）。DubSyncは完全な20分にリップシンクを含みます。",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDubは動画とリップシンクの分数を別々のプールに分割します。DubSyncは各分にリップシンクを含みます。",
      verdictBody:
        "DubSyncはリップシンクの価値で明確に勝利します。GeckoDubのStarterプランは動画とリップシンクの分数を分離 — 10分の動画が得られますが、リップシンクは7分のみです。DubSync Starterは月額$19.99でリップシンク付き20分完全に提供し、実際の容量は約3倍です。",
      lipSyncFeatures: [
        "リップシンク分数（Starterプラン）",
        "クレジット構造",
        "クレジットあたりのリップシンクコスト",
        "スタータープランの価格",
        "リップシンクの追加料金",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "各プランで動画とリップシンクは別々のクレジットプールです。",
      whereCompetitorWinsHeading: "GeckoDubが勝る点",
      whereDubsyncWinsHeading: "DubSyncが勝る点",
      whereCompetitorWins: [
        "60以上の対応言語",
        "一部の領域でより洗練されたUI",
        "特定の字幕編集機能",
      ],
      whereDubsyncWins: [
        "同じ価格で3倍のリップシンク分数",
        "統一されたクレジットモデル（プール分離なし）",
        "リップシンク付き真の無料プラン",
        "リップシンクの隠れた料金なし",
      ],
      faqs: [
        {
          q: "なぜDubSyncはより多くのリップシンク分数を提供しますか？",
          a: "DubSyncは単一のクレジットプールを使用：各クレジットはリップシンク付き1分。GeckoDubは動画とリップシンクを別々のプールに分割するため、Starterプランの10分のうち7分のみリップシンクを含みます。",
        },
        {
          q: "GeckoDubはDubSyncより言語数が多いですか？",
          a: "はい、GeckoDubはDubSyncの30以上に対して60以上の言語をサポートします。上位30言語を超える珍しい言語が必要な場合、GeckoDubが選択肢となる可能性があります。",
        },
        {
          q: "支払い前にDubSyncを試すことができますか？",
          a: "はい。DubSyncの無料プランには、リップシンクと音声クローン付きの15秒までの動画1本が含まれます。クレジットカード不要。",
        },
      ],
    },
  },
};

// Assemble the full LocaleStrings by merging per-competitor strings with
// the common labels. The shape matches what copy.ts expects.
export const VS_LOCALIZED_STRINGS: Record<
  VsLocale,
  Record<VsCompetitor, LocaleStrings>
> = (() => {
  const out = {} as Record<VsLocale, Record<VsCompetitor, LocaleStrings>>;
  const locales: VsLocale[] = ["es", "pt", "de", "fr", "ja"];
  const competitors: VsCompetitor[] = ["rask-ai", "heygen", "elevenlabs", "geckodub"];
  for (const lang of locales) {
    out[lang] = {} as Record<VsCompetitor, LocaleStrings>;
    const common = COMMON_LABELS[lang];
    for (const c of competitors) {
      const pc = PER_COMPETITOR[lang][c];
      out[lang][c] = {
        metaTitle: pc.metaTitle,
        metaDescription: pc.metaDescription,
        h1: pc.h1,
        heroSubtitle: pc.heroSubtitle,
        verdictBody: pc.verdictBody,
        lipSyncFeatures: pc.lipSyncFeatures,
        eyebrow: common.eyebrow,
        verdictHeading: common.verdictHeading,
        lipSyncHeading: common.lipSyncHeading,
        pricingHeading: common.pricingHeading,
        featureHeading: common.featureHeading,
        dubsyncPricingLabel: common.dubsyncPricingLabel,
        dubsyncPricingNote: common.dubsyncPricingNote,
        competitorPricingLabel: pc.competitorPricingLabel,
        competitorPricingNote: pc.competitorPricingNote,
        featureLabels: [...COMMON_FEATURE_LABELS[lang]],
        featureFoot: COMMON_FOOT_LABELS[lang],
        whereCompetitorWinsHeading: pc.whereCompetitorWinsHeading,
        whereDubsyncWinsHeading: pc.whereDubsyncWinsHeading,
        whereCompetitorWins: pc.whereCompetitorWins,
        whereDubsyncWins: pc.whereDubsyncWins,
        migrationHeading: common.migrationHeading,
        migrationSteps: [...MIGRATION_STEPS[lang]],
        faqHeading: common.faqHeading,
        faqs: pc.faqs,
        relatedHeading: common.relatedHeading,
        ctaHeading: common.ctaHeading,
        ctaSubtitle: common.ctaSubtitle,
        ctaPrimary: common.ctaPrimary,
        ctaSecondary: common.ctaSecondary,
        breadcrumbCompare: common.breadcrumbCompare,
      };
    }
  }
  return out;
})();
