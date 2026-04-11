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
  hi: [
    "वॉइस क्लोनिंग",
    "मल्टी-स्पीकर डिटेक्शन",
    "स्क्रिप्ट एडिटिंग",
    "API एक्सेस",
    "4K आउटपुट",
    "बैच प्रोसेसिंग",
    "शब्दावली / टर्म लॉक",
    "बैकग्राउंड ऑडियो सुरक्षित रखें",
    "मुफ़्त प्लान",
  ],
  ar: [
    "استنساخ الصوت",
    "اكتشاف المتحدثين المتعددين",
    "تحرير النص",
    "وصول API",
    "إخراج 4K",
    "معالجة دفعية",
    "مسرد / قفل المصطلحات",
    "الحفاظ على الصوت الخلفي",
    "خطة مجانية",
  ],
  id: [
    "Kloning suara",
    "Deteksi multi-pembicara",
    "Pengeditan skrip",
    "Akses API",
    "Output 4K",
    "Pemrosesan batch",
    "Glosarium / kunci istilah",
    "Pertahankan audio latar",
    "Paket gratis",
  ],
  tr: [
    "Ses klonlama",
    "Çoklu konuşmacı algılama",
    "Senaryo düzenleme",
    "API erişimi",
    "4K çıktı",
    "Toplu işleme",
    "Sözlük / terim kilidi",
    "Arka plan sesini koru",
    "Ücretsiz plan",
  ],
  ko: [
    "음성 복제",
    "다중 화자 감지",
    "스크립트 편집",
    "API 접근",
    "4K 출력",
    "일괄 처리",
    "용어집 / 용어 잠금",
    "배경 오디오 보존",
    "무료 플랜",
  ],
} as const;

const COMMON_FOOT_LABELS = {
  es: { feature: "Función", languages: "Idiomas", cost: "Costo por minuto (con lip sync)" },
  pt: { feature: "Recurso", languages: "Idiomas", cost: "Custo por minuto (com lip sync)" },
  de: { feature: "Funktion", languages: "Sprachen", cost: "Kosten pro Minute (mit Lippensync)" },
  fr: { feature: "Fonctionnalité", languages: "Langues", cost: "Coût par minute (avec lip sync)" },
  ja: { feature: "機能", languages: "言語", cost: "1分あたりのコスト（リップシンク込み）" },
  hi: { feature: "सुविधा", languages: "भाषाएँ", cost: "प्रति मिनट लागत (लिप सिंक सहित)" },
  ar: { feature: "الميزة", languages: "اللغات", cost: "التكلفة لكل دقيقة (مع مزامنة الشفاه)" },
  id: { feature: "Fitur", languages: "Bahasa", cost: "Biaya per menit (dengan lip sync)" },
  tr: { feature: "Özellik", languages: "Diller", cost: "Dakika başı maliyet (dudak senkronu dahil)" },
  ko: { feature: "기능", languages: "언어", cost: "분당 비용 (립싱크 포함)" },
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
  hi: {
    eyebrow: "तुलना",
    verdictHeading: "त्वरित निर्णय",
    lipSyncHeading: "लिप सिंक तुलना",
    pricingHeading: "मूल्य तुलना",
    featureHeading: "सुविधा तुलना",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 क्रेडिट = 1 मिनट। सभी प्लान में लिप सिंक शामिल।",
    migrationHeading: "DubSync पर कैसे स्विच करें",
    faqHeading: "अक्सर पूछे जाने वाले प्रश्न",
    relatedHeading: "संबंधित तुलनाएँ",
    ctaHeading: "DubSync पर स्विच करने के लिए तैयार हैं?",
    ctaSubtitle: "$19.99/माह से लिप सिंक डबिंग पाएँ। मुफ़्त शुरू करें, कार्ड नहीं चाहिए।",
    ctaPrimary: "DubSync मुफ़्त आज़माएँ",
    ctaSecondary: "पूरी तुलना देखें",
    breadcrumbCompare: "तुलना",
  },
  ar: {
    eyebrow: "مقارنة",
    verdictHeading: "الحكم السريع",
    lipSyncHeading: "مقارنة مزامنة الشفاه",
    pricingHeading: "مقارنة الأسعار",
    featureHeading: "مقارنة الميزات",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "رصيد واحد = دقيقة واحدة. مزامنة الشفاه مشمولة في جميع الخطط.",
    migrationHeading: "كيفية الانتقال إلى DubSync",
    faqHeading: "الأسئلة الشائعة",
    relatedHeading: "مقارنات ذات صلة",
    ctaHeading: "هل أنت مستعد للانتقال إلى DubSync؟",
    ctaSubtitle: "احصل على الدبلجة مع مزامنة الشفاه بدءًا من $19.99/شهر. ابدأ مجانًا، بدون بطاقة.",
    ctaPrimary: "جرّب DubSync مجانًا",
    ctaSecondary: "عرض المقارنة الكاملة",
    breadcrumbCompare: "مقارنة",
  },
  id: {
    eyebrow: "Perbandingan",
    verdictHeading: "Kesimpulan cepat",
    lipSyncHeading: "Perbandingan lip sync",
    pricingHeading: "Perbandingan harga",
    featureHeading: "Perbandingan fitur",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 kredit = 1 menit. Lip sync termasuk di semua paket.",
    migrationHeading: "Cara beralih ke DubSync",
    faqHeading: "Pertanyaan yang sering diajukan",
    relatedHeading: "Perbandingan terkait",
    ctaHeading: "Siap beralih ke DubSync?",
    ctaSubtitle: "Dapatkan dubbing lip sync mulai $19.99/bulan. Mulai gratis, tanpa kartu.",
    ctaPrimary: "Coba DubSync Gratis",
    ctaSecondary: "Lihat perbandingan lengkap",
    breadcrumbCompare: "Bandingkan",
  },
  tr: {
    eyebrow: "Karşılaştırma",
    verdictHeading: "Hızlı değerlendirme",
    lipSyncHeading: "Dudak senkronu karşılaştırması",
    pricingHeading: "Fiyat karşılaştırması",
    featureHeading: "Özellik karşılaştırması",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 kredi = 1 dakika. Tüm planlarda dudak senkronu dahil.",
    migrationHeading: "DubSync'e nasıl geçilir",
    faqHeading: "Sık sorulan sorular",
    relatedHeading: "İlgili karşılaştırmalar",
    ctaHeading: "DubSync'e geçmeye hazır mısınız?",
    ctaSubtitle: "$19.99/ay'dan başlayan dudak senkronlu dublaj. Ücretsiz başlayın, kart gerekmez.",
    ctaPrimary: "DubSync'i Ücretsiz Deneyin",
    ctaSecondary: "Tam karşılaştırmayı görün",
    breadcrumbCompare: "Karşılaştır",
  },
  ko: {
    eyebrow: "비교",
    verdictHeading: "빠른 결론",
    lipSyncHeading: "립싱크 비교",
    pricingHeading: "가격 비교",
    featureHeading: "기능 비교",
    dubsyncPricingLabel: "DubSync",
    dubsyncPricingNote: "1 크레딧 = 1분. 모든 플랜에 립싱크 포함.",
    migrationHeading: "DubSync로 전환하는 방법",
    faqHeading: "자주 묻는 질문",
    relatedHeading: "관련 비교",
    ctaHeading: "DubSync로 전환할 준비가 되셨나요?",
    ctaSubtitle: "월 $19.99부터 립싱크 더빙을 이용하세요. 무료로 시작, 카드 불필요.",
    ctaPrimary: "DubSync 무료 체험",
    ctaSecondary: "전체 비교 보기",
    breadcrumbCompare: "비교",
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
  hi: [
    "अपने मूल वीडियो एक्सपोर्ट या डाउनलोड करें। DubSync MP4, MOV, AVI, WebM और MKV को सपोर्ट करता है।",
    "DubSync पर एक मुफ़्त अकाउंट बनाएँ और क्वालिटी टेस्ट करने के लिए अपना पहला वीडियो अपलोड करें।",
    "टारगेट भाषाएँ चुनें, AI-जनित स्क्रिप्ट की समीक्षा करें और लिप सिंक डबिंग शुरू करें।",
    "क्वालिटी से संतुष्ट होने पर पेड प्लान में अपग्रेड करें। साइकिल के अंत में अपनी पिछली सब्सक्रिप्शन रद्द करें।",
  ],
  ar: [
    "قم بتصدير أو تنزيل مقاطع الفيديو الأصلية. يدعم DubSync صيغ MP4 وMOV وAVI وWebM وMKV.",
    "أنشئ حسابًا مجانيًا على DubSync وارفع أول فيديو لاختبار الجودة.",
    "اختر اللغات المستهدفة، وراجع النص المُنشأ بالذكاء الاصطناعي، وابدأ الدبلجة مع مزامنة الشفاه.",
    "بمجرد رضاك عن الجودة، قم بالترقية إلى خطة مدفوعة. قم بإلغاء اشتراكك السابق في نهاية الدورة.",
  ],
  id: [
    "Ekspor atau unduh video asli Anda. DubSync mendukung MP4, MOV, AVI, WebM, dan MKV.",
    "Buat akun DubSync gratis dan unggah video pertama Anda untuk menguji kualitas.",
    "Pilih bahasa target, tinjau skrip yang dihasilkan AI, dan mulai dubbing dengan lip sync.",
    "Setelah puas dengan kualitasnya, upgrade ke paket berbayar. Batalkan langganan sebelumnya di akhir siklus.",
  ],
  tr: [
    "Orijinal videolarınızı dışa aktarın veya indirin. DubSync MP4, MOV, AVI, WebM ve MKV destekler.",
    "Ücretsiz bir DubSync hesabı oluşturun ve kaliteyi test etmek için ilk videonuzu yükleyin.",
    "Hedef dilleri seçin, yapay zeka tarafından oluşturulan senaryoyu inceleyin ve dudak senkronlu dublaja başlayın.",
    "Kaliteden memnun olduğunuzda ücretli plana geçin. Önceki aboneliğinizi dönem sonunda iptal edin.",
  ],
  ko: [
    "원본 동영상을 내보내거나 다운로드합니다. DubSync는 MP4, MOV, AVI, WebM, MKV를 지원합니다.",
    "무료 DubSync 계정을 만들고 첫 번째 동영상을 업로드하여 품질을 테스트합니다.",
    "대상 언어를 선택하고, AI 생성 스크립트를 검토한 후, 립싱크 더빙을 시작합니다.",
    "품질에 만족하면 유료 플랜으로 업그레이드합니다. 이전 구독은 결제 주기 말에 취소하세요.",
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
  hi: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — लिप सिंक $19.99 vs $120/माह",
      metaDescription:
        "Rask AI लिप सिंक के लिए $120/माह चार्ज करता है और क्रेडिट खपत दोगुनी करता है। DubSync $19.99 से हर क्रेडिट में लिप सिंक शामिल करता है। सुविधाओं और लागत की तुलना करें।",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI लिप सिंक के लिए $120/माह चार्ज करता है और क्रेडिट दोगुने करता है। DubSync $19.99 से हर क्रेडिट में लिप सिंक शामिल करता है।",
      verdictBody:
        "DubSync उन क्रिएटर्स के लिए सबसे अच्छा विकल्प है जिन्हें किफायती कीमत पर लिप सिंक डबिंग चाहिए। $19.99/माह में आपको लिप सिंक सहित 20 मिनट मिलते हैं — Rask AI की कीमत का एक अंश। Rask AI को लिप सिंक के लिए $120/माह का Creator Pro प्लान चाहिए और क्रेडिट खपत दोगुनी होती है। Rask AI तभी चुनें जब आपको DubSync की 30+ से बाहर की दुर्लभ भाषाएँ चाहिए।",
      lipSyncFeatures: [
        "लिप सिंक मिनट (स्टार्टर प्लान)",
        "लिप सिंक क्रेडिट की लागत",
        "प्रभावी लिप सिंक क्षमता (Pro)",
        "10 मिनट × 3 भाषाएँ: लिप सिंक क्रेडिट",
        "लिप सिंक एक्सेस की कीमत",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "कोई मुफ़्त प्लान नहीं। लिप सिंक केवल Creator Pro में 2x क्रेडिट उपयोग करता है।",
      whereCompetitorWinsHeading: "Rask AI कहाँ जीतता है",
      whereDubsyncWinsHeading: "DubSync कहाँ जीतता है",
      whereCompetitorWins: [
        "DubSync की 30+ के मुकाबले 130+ भाषाएँ",
        "लंबे इतिहास वाला अधिक स्थापित ब्रांड",
        "उन्नत SRT/उपशीर्षक निर्यात सुविधाएँ",
      ],
      whereDubsyncWins: [
        "हर प्लान में लिप सिंक शामिल (2x पेनल्टी नहीं)",
        "Rask AI के $120/माह बनाम $19.99/माह से लिप सिंक",
        "खरीदने से पहले टेस्ट करने के लिए मुफ़्त प्लान उपलब्ध",
        "सरल कीमत: 1 क्रेडिट = 1 मिनट, कोई गुणक नहीं",
      ],
      faqs: [
        {
          q: "क्या DubSync लिप सिंक के लिए Rask AI से सस्ता है?",
          a: "हाँ। DubSync $19.99/माह से लिप सिंक शामिल करता है। Rask AI को $120/माह का Creator Pro चाहिए और क्रेडिट दोगुने करता है, इसलिए समान लिप सिंक कंटेंट के लिए आप 6 गुना अधिक भुगतान करते हैं।",
        },
        {
          q: "क्या Rask AI सभी प्लान में लिप सिंक शामिल करता है?",
          a: "नहीं। Rask AI का Creator प्लान ($50/माह) में लिप सिंक शामिल नहीं है। लिप सिंक के लिए $120/माह का Creator Pro प्लान चाहिए, जहाँ क्रेडिट उपयोग दोगुना होता है।",
        },
        {
          q: "Rask AI vs DubSync में कितने लिप सिंक मिनट मिलते हैं?",
          a: "DubSync Starter ($19.99/माह) 20 मिनट लिप सिंक देता है। Rask AI Creator Pro ($120/माह) 2x पेनल्टी के बाद लगभग 50 प्रभावी मिनट देता है। 6 गुना कीमत, 2.5 गुना मिनट।",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — लिप सिंक शामिल vs साझा क्रेडिट",
      metaDescription:
        "HeyGen लिप सिंक के प्रीमियम क्रेडिट को अवतारों के साथ साझा करता है। DubSync $19.99/माह से हर क्रेडिट में समर्पित लिप सिंक प्रदान करता है।",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen लिप सिंक क्रेडिट को अवतारों और जनरेशन के साथ साझा करता है। DubSync हर क्रेडिट में समर्पित लिप सिंक प्रदान करता है।",
      verdictBody:
        "DubSync अनुमानित लिप सिंक के साथ वीडियो डबिंग के लिए अधिक स्पष्ट विकल्प है। HeyGen एक AI अवतार प्लेटफ़ॉर्म है जहाँ लिप सिंक अवतार जनरेशन के साथ प्रीमियम क्रेडिट साझा करता है, जिससे उपयोग की योजना बनाना कठिन होता है। DubSync विशेष रूप से डबिंग पर केंद्रित है: हर क्रेडिट लिप सिंक सहित एक पूर्ण मिनट है।",
      lipSyncFeatures: [
        "समर्पित लिप सिंक मिनट",
        "क्रेडिट मॉडल",
        "छिपे शुल्क",
        "प्रवेश मूल्य",
        "अनुमानित क्षमता",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "अवतार प्लेटफ़ॉर्म जिसमें लिप सिंक एक सेकेंडरी फ़ीचर है।",
      whereCompetitorWinsHeading: "HeyGen कहाँ जीतता है",
      whereDubsyncWinsHeading: "DubSync कहाँ जीतता है",
      whereCompetitorWins: [
        "175+ सपोर्टेड भाषाएँ",
        "AI-जनित AI अवतार",
        "AI वीडियो प्रोडक्शन के लिए बड़ा इकोसिस्टम",
      ],
      whereDubsyncWins: [
        "क्रेडिट साझा किए बिना समर्पित लिप सिंक",
        "अनुमानित क्षमता: 1 क्रेडिट = 1 मिनट लिप सिंक",
        "भुगतान से पहले टेस्ट करने के लिए मुफ़्त प्लान",
        "वीडियो-केंद्रित डबिंग के लिए कम कीमत",
      ],
      faqs: [
        {
          q: "DubSync, HeyGen से अधिक अनुमानित क्यों है?",
          a: "DubSync डबिंग-समर्पित क्रेडिट का उपयोग करता है: 1 क्रेडिट = लिप सिंक सहित 1 मिनट। HeyGen अवतारों, जनरेशन और लिप सिंक के बीच प्रीमियम क्रेडिट साझा करता है, इसलिए आपकी वास्तविक क्षमता उपयोग पर निर्भर करती है।",
        },
        {
          q: "क्या HeyGen अवतार बनाने के लिए बेहतर है?",
          a: "हाँ। HeyGen AI अवतारों में विशेषज्ञता रखता है और उस उपयोग के लिए अधिक पूर्ण इकोसिस्टम रखता है। DubSync केवल मूल आवाज़ क्लोन के साथ डबिंग पर ध्यान केंद्रित करता है।",
        },
        {
          q: "क्या मैं DubSync से अवतार बना सकता हूँ?",
          a: "नहीं। DubSync मूल स्पीकर की आवाज़ क्लोन करता है और मौजूदा वीडियो के होंठ सिंक करता है, लेकिन टेक्स्ट से नए अवतार नहीं बनाता।",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — वीडियो लिप सिंक vs केवल ऑडियो डबिंग",
      metaDescription:
        "ElevenLabs सर्वश्रेष्ठ AI ऑडियो प्रदान करता है लेकिन कोई लिप सिंक नहीं। DubSync हर डब किए गए वीडियो में लिप सिंक जोड़ता है। वीडियो लोकलाइज़ेशन के लिए तुलना करें।",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs उत्कृष्ट AI ऑडियो प्रदान करता है लेकिन केवल ऑडियो। DubSync ऑटोमैटिक लिप सिंक के साथ डब किया हुआ वीडियो बनाता है।",
      verdictBody:
        "यदि आपको पूर्ण वीडियो लोकलाइज़ेशन चाहिए, तो दोनों में से DubSync ही एकमात्र विकल्प है। ElevenLabs AI वॉइस सिंथेसिस में अग्रणी है, लेकिन केवल ऑडियो देता है — आपको खुद सिंक करना और वीडियो में जोड़ना होता है। DubSync वॉइस क्लोनिंग, ट्रांसलेशन और ऑटो लिप सिंक को एक ही फ़्लो में जोड़कर पब्लिश-रेडी MP4 देता है।",
      lipSyncFeatures: [
        "लिप सिंक शामिल",
        "वीडियो आउटपुट",
        "ऑटोमैटिक लिप सिंक्रोनाइज़ेशन",
        "स्टार्टर प्लान की कीमत",
        "लिप सिंक सहित प्रति मिनट लागत",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "कैरेक्टर-बेस्ड प्लान, वीडियो-बेस्ड नहीं। केवल ऑडियो आउटपुट।",
      whereCompetitorWinsHeading: "ElevenLabs कहाँ जीतता है",
      whereDubsyncWinsHeading: "DubSync कहाँ जीतता है",
      whereCompetitorWins: [
        "बाज़ार की सर्वश्रेष्ठ AI वॉइस क्वालिटी",
        "प्री-मेड वॉइस की सबसे बड़ी लाइब्रेरी",
        "AI साउंड इफ़ेक्ट जनरेशन",
      ],
      whereDubsyncWins: [
        "पूर्ण डब वीडियो, केवल ऑडियो नहीं",
        "ऑटोमैटिक लिप सिंक शामिल",
        "वीडियो के लिए वन-क्लिक वर्कफ़्लो",
        "मिनट-बेस्ड अनुमानित कीमत",
      ],
      faqs: [
        {
          q: "क्या मैं ElevenLabs से वीडियो डब कर सकता हूँ?",
          a: "आप ElevenLabs से डब ऑडियो बना सकते हैं, लेकिन इसे मैन्युअली वीडियो के साथ सिंक करना होगा और लिप सिंक नहीं मिलेगा। DubSync पूरी प्रक्रिया को ऑटोमेट करता है।",
        },
        {
          q: "क्या DubSync, ElevenLabs की टेक्नोलॉजी इस्तेमाल करता है?",
          a: "DubSync वॉइस क्लोनिंग, ट्रांसलेशन और लिप सिंक के लिए कई शीर्ष-स्तरीय AI प्रदाताओं को जोड़ता है। हम किसी एक प्रदाता पर निर्भर नहीं हैं।",
        },
        {
          q: "YouTube क्रिएटर्स के लिए कौन बेहतर है?",
          a: "DubSync। क्रिएटर्स को लिप सिंक वाला तैयार वीडियो चाहिए — सिर्फ़ ऑडियो ट्रैक नहीं। DubSync मिनटों में अपलोड-रेडी MP4 देता है।",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7 लिप सिंक मिनट",
      metaDescription:
        "GeckoDub वीडियो और लिप सिंक को अलग-अलग पूल में बाँटता है (Starter में सिर्फ़ 7 मिनट लिप सिंक)। DubSync पूरे 20 मिनट में लिप सिंक शामिल करता है।",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub वीडियो और लिप सिंक मिनट अलग-अलग पूल में बाँटता है। DubSync हर मिनट में लिप सिंक शामिल करता है।",
      verdictBody:
        "DubSync लिप सिंक वैल्यू प्रति डॉलर में स्पष्ट रूप से जीतता है। GeckoDub का Starter प्लान वीडियो और लिप सिंक मिनट अलग करता है — 10 मिनट वीडियो लेकिन सिर्फ़ 7 लिप सिंक। DubSync Starter $19.99/माह में लिप सिंक सहित पूरे 20 मिनट देता है, लगभग 3 गुना अधिक वास्तविक क्षमता।",
      lipSyncFeatures: [
        "लिप सिंक मिनट (Starter प्लान)",
        "क्रेडिट संरचना",
        "क्रेडिट प्रति लिप सिंक लागत",
        "स्टार्टर प्लान की कीमत",
        "लिप सिंक सरचार्ज",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "हर प्लान में वीडियो और लिप सिंक अलग-अलग क्रेडिट पूल हैं।",
      whereCompetitorWinsHeading: "GeckoDub कहाँ जीतता है",
      whereDubsyncWinsHeading: "DubSync कहाँ जीतता है",
      whereCompetitorWins: [
        "60+ सपोर्टेड भाषाएँ",
        "कुछ क्षेत्रों में अधिक पॉलिश UI",
        "विशिष्ट सबटाइटल एडिटिंग सुविधाएँ",
      ],
      whereDubsyncWins: [
        "समान कीमत में 3 गुना अधिक लिप सिंक मिनट",
        "एकीकृत क्रेडिट मॉडल (अलग पूल नहीं)",
        "लिप सिंक वाला असली मुफ़्त प्लान",
        "लिप सिंक के लिए कोई छिपे शुल्क नहीं",
      ],
      faqs: [
        {
          q: "DubSync अधिक लिप सिंक मिनट क्यों देता है?",
          a: "DubSync एक ही क्रेडिट पूल उपयोग करता है: हर क्रेडिट लिप सिंक सहित 1 मिनट है। GeckoDub वीडियो और लिप सिंक को अलग पूल में बाँटता है, इसलिए Starter प्लान के 10 में से सिर्फ़ 7 मिनट में लिप सिंक शामिल है।",
        },
        {
          q: "क्या GeckoDub में DubSync से अधिक भाषाएँ हैं?",
          a: "हाँ, GeckoDub DubSync की 30+ के मुकाबले 60+ भाषाएँ सपोर्ट करता है। यदि आपको शीर्ष 30 से बाहर की दुर्लभ भाषा चाहिए, तो GeckoDub विकल्प हो सकता है।",
        },
        {
          q: "क्या मैं भुगतान से पहले DubSync आज़मा सकता हूँ?",
          a: "हाँ। DubSync के मुफ़्त प्लान में लिप सिंक और वॉइस क्लोनिंग के साथ 15 सेकंड तक का 1 वीडियो शामिल है। क्रेडिट कार्ड नहीं चाहिए।",
        },
      ],
    },
  },
  ar: {
    "rask-ai": {
      metaTitle: "DubSync مقابل Rask AI (2026) — مزامنة الشفاه من $19.99 مقابل $120/شهر",
      metaDescription:
        "يتقاضى Rask AI مبلغ $120/شهر لمزامنة الشفاه ويضاعف استهلاك الرصيد. DubSync يتضمن مزامنة الشفاه في كل رصيد بدءًا من $19.99. قارن الميزات والتكاليف.",
      h1: "DubSync مقابل Rask AI",
      heroSubtitle:
        "يتقاضى Rask AI مبلغ $120/شهر لمزامنة الشفاه ويضاعف أرصدتك. DubSync يتضمن مزامنة الشفاه في كل رصيد بدءًا من $19.99.",
      verdictBody:
        "DubSync هو الخيار الأفضل لصانعي المحتوى الذين يحتاجون إلى دبلجة مع مزامنة الشفاه بسعر معقول. مقابل $19.99/شهر تحصل على 20 دقيقة مع مزامنة الشفاه — جزء بسيط مما يتقاضاه Rask AI. يتطلب Rask AI خطة Creator Pro بـ$120/شهر لمزامنة الشفاه ويضاعف استهلاك الأرصدة. اختر Rask AI فقط إذا كنت تحتاج لغات نادرة خارج 30+ لغة في DubSync.",
      lipSyncFeatures: [
        "دقائق مزامنة الشفاه (خطة Starter)",
        "تكلفة رصيد مزامنة الشفاه",
        "السعة الفعلية لمزامنة الشفاه (Pro)",
        "10 دقائق × 3 لغات: أرصدة مزامنة الشفاه",
        "سعر الوصول لمزامنة الشفاه",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "لا توجد خطة مجانية. مزامنة الشفاه تستخدم 2x أرصدة فقط في Creator Pro.",
      whereCompetitorWinsHeading: "أين يتفوق Rask AI",
      whereDubsyncWinsHeading: "أين يتفوق DubSync",
      whereCompetitorWins: [
        "أكثر من 130 لغة مقابل 30+ في DubSync",
        "علامة تجارية أكثر رسوخًا مع تاريخ أطول",
        "ميزات تصدير SRT/ترجمة متقدمة",
      ],
      whereDubsyncWins: [
        "مزامنة الشفاه مشمولة في كل خطة (بدون عقوبة 2x)",
        "مزامنة الشفاه من $19.99/شهر مقابل $120/شهر في Rask AI",
        "خطة مجانية متاحة للتجربة قبل الالتزام",
        "تسعير أبسط: رصيد واحد = دقيقة واحدة، بدون مضاعفات",
      ],
      faqs: [
        {
          q: "هل DubSync أرخص من Rask AI لمزامنة الشفاه؟",
          a: "نعم. DubSync يتضمن مزامنة الشفاه من $19.99/شهر. Rask AI يتطلب Creator Pro بـ$120/شهر ويضاعف استهلاك الأرصدة، لذلك تدفع 6 أضعاف لكمية مماثلة من المحتوى مع مزامنة الشفاه.",
        },
        {
          q: "هل يتضمن Rask AI مزامنة الشفاه في جميع الخطط؟",
          a: "لا. خطة Creator في Rask AI ($50/شهر) لا تتضمن مزامنة الشفاه. مزامنة الشفاه تتطلب خطة Creator Pro بـ$120/شهر، حيث يتضاعف استهلاك الأرصدة.",
        },
        {
          q: "كم دقيقة من مزامنة الشفاه تحصل عليها في Rask AI مقابل DubSync؟",
          a: "DubSync Starter ($19.99/شهر) يوفر 20 دقيقة من مزامنة الشفاه. Rask AI Creator Pro ($120/شهر) يوفر حوالي 50 دقيقة فعلية بعد عقوبة 2x. أي 6 أضعاف السعر مقابل 2.5 ضعف الدقائق.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync مقابل HeyGen — مزامنة شفاه مشمولة مقابل أرصدة مشتركة",
      metaDescription:
        "HeyGen يشارك أرصدة مزامنة الشفاه المميزة مع الصور الرمزية. DubSync يقدم مزامنة شفاه مخصصة في كل رصيد بدءًا من $19.99/شهر.",
      h1: "DubSync مقابل HeyGen",
      heroSubtitle:
        "HeyGen يشارك أرصدة مزامنة الشفاه مع الصور الرمزية والإنشاء. DubSync يقدم مزامنة شفاه مخصصة في كل رصيد.",
      verdictBody:
        "DubSync هو الخيار الأوضح لدبلجة الفيديو مع مزامنة شفاه يمكن التنبؤ بها. HeyGen منصة صور رمزية بالذكاء الاصطناعي حيث تشارك مزامنة الشفاه الأرصدة المميزة مع إنشاء الصور الرمزية، مما يصعّب تخطيط الاستخدام. DubSync يركز حصريًا على الدبلجة: كل رصيد هو دقيقة كاملة مع مزامنة الشفاه.",
      lipSyncFeatures: [
        "دقائق مزامنة شفاه مخصصة",
        "نموذج الأرصدة",
        "رسوم مخفية",
        "سعر الدخول",
        "سعة يمكن التنبؤ بها",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "منصة صور رمزية مع مزامنة الشفاه كميزة ثانوية.",
      whereCompetitorWinsHeading: "أين يتفوق HeyGen",
      whereDubsyncWinsHeading: "أين يتفوق DubSync",
      whereCompetitorWins: [
        "أكثر من 175 لغة مدعومة",
        "صور رمزية ذكاء اصطناعي مُنشأة بالذكاء الاصطناعي",
        "نظام بيئي أكبر لإنتاج الفيديو بالذكاء الاصطناعي",
      ],
      whereDubsyncWins: [
        "مزامنة شفاه مخصصة بدون مشاركة أرصدة",
        "سعة يمكن التنبؤ بها: رصيد واحد = دقيقة واحدة من مزامنة الشفاه",
        "خطة مجانية للتجربة قبل الدفع",
        "سعر أقل للدبلجة المركزة على الفيديو",
      ],
      faqs: [
        {
          q: "لماذا DubSync أكثر قابلية للتنبؤ من HeyGen؟",
          a: "DubSync يستخدم أرصدة مخصصة للدبلجة: رصيد واحد = دقيقة واحدة مع مزامنة الشفاه. HeyGen يشارك الأرصدة المميزة بين الصور الرمزية والإنشاء ومزامنة الشفاه، لذلك تعتمد سعتك الفعلية على كيفية استخدامك.",
        },
        {
          q: "هل HeyGen أفضل لإنشاء الصور الرمزية؟",
          a: "نعم. HeyGen متخصص في صور الذكاء الاصطناعي الرمزية ولديه نظام بيئي أكثر اكتمالًا لهذا الاستخدام. DubSync يركز فقط على الدبلجة مع استنساخ الصوت الأصلي.",
        },
        {
          q: "هل يمكنني استخدام DubSync لإنشاء صور رمزية؟",
          a: "لا. DubSync يستنسخ صوت المتحدث الأصلي ويزامن شفاه الفيديو الحالي، لكنه لا ينشئ صورًا رمزية جديدة من النص.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync مقابل ElevenLabs — مزامنة شفاه الفيديو مقابل دبلجة صوتية فقط",
      metaDescription:
        "ElevenLabs يقدم أفضل صوت ذكاء اصطناعي لكن بدون مزامنة شفاه. DubSync يضيف مزامنة الشفاه لكل فيديو مدبلج. قارن لتوطين الفيديو.",
      h1: "DubSync مقابل ElevenLabs",
      heroSubtitle:
        "ElevenLabs يقدم صوت ذكاء اصطناعي استثنائي لكن صوت فقط. DubSync ينتج فيديو مدبلج مع مزامنة شفاه تلقائية.",
      verdictBody:
        "إذا كنت تحتاج توطين فيديو كامل، فإن DubSync هو الخيار الوحيد بينهما. ElevenLabs رائد في تركيب الصوت بالذكاء الاصطناعي، لكنه يقدم صوتًا فقط — عليك المزامنة والدمج في الفيديو بنفسك. DubSync يجمع استنساخ الصوت والترجمة ومزامنة الشفاه التلقائية في تدفق واحد ويقدم MP4 جاهزًا للنشر.",
      lipSyncFeatures: [
        "مزامنة الشفاه مشمولة",
        "إخراج فيديو",
        "مزامنة شفاه تلقائية",
        "سعر خطة البداية",
        "تكلفة الدقيقة مع مزامنة الشفاه",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "خطط قائمة على الأحرف وليس الفيديو. إخراج صوتي فقط.",
      whereCompetitorWinsHeading: "أين يتفوق ElevenLabs",
      whereDubsyncWinsHeading: "أين يتفوق DubSync",
      whereCompetitorWins: [
        "أفضل جودة صوت ذكاء اصطناعي في السوق",
        "أكبر مكتبة أصوات جاهزة",
        "إنشاء مؤثرات صوتية بالذكاء الاصطناعي",
      ],
      whereDubsyncWins: [
        "فيديو مدبلج كامل وليس مجرد صوت",
        "مزامنة شفاه تلقائية مشمولة",
        "سير عمل بنقرة واحدة للفيديو",
        "تسعير يمكن التنبؤ به قائم على الدقائق",
      ],
      faqs: [
        {
          q: "هل يمكنني استخدام ElevenLabs لدبلجة الفيديو؟",
          a: "يمكنك إنشاء صوت مدبلج باستخدام ElevenLabs، لكن ستحتاج لمزامنته يدويًا مع الفيديو ولن تحصل على مزامنة شفاه. DubSync يُؤتمت العملية بالكامل.",
        },
        {
          q: "هل يستخدم DubSync تقنية ElevenLabs؟",
          a: "DubSync يجمع بين عدة مزودي ذكاء اصطناعي من الدرجة الأولى لاستنساخ الصوت والترجمة ومزامنة الشفاه. لا نعتمد على مزود واحد.",
        },
        {
          q: "أيهما أفضل لصانعي محتوى YouTube؟",
          a: "DubSync. يحتاج صانعو المحتوى إلى فيديو جاهز مع مزامنة الشفاه — وليس مجرد مسارات صوتية. DubSync يقدم MP4 جاهزًا للرفع في دقائق.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync مقابل GeckoDub — 20 مقابل 7 دقائق مزامنة شفاه",
      metaDescription:
        "GeckoDub يقسم الفيديو ومزامنة الشفاه إلى مجموعات منفصلة (7 دقائق فقط مزامنة شفاه في Starter). DubSync يتضمن مزامنة الشفاه في الـ20 دقيقة كاملة.",
      h1: "DubSync مقابل GeckoDub",
      heroSubtitle:
        "GeckoDub يقسم دقائق الفيديو ومزامنة الشفاه إلى مجموعات منفصلة. DubSync يتضمن مزامنة الشفاه في كل دقيقة.",
      verdictBody:
        "DubSync يفوز بوضوح في القيمة لكل دولار من مزامنة الشفاه. خطة Starter في GeckoDub تفصل دقائق الفيديو ومزامنة الشفاه — تحصل على 10 دقائق فيديو لكن 7 فقط مزامنة شفاه. DubSync Starter يمنحك 20 دقيقة كاملة مع مزامنة الشفاه مقابل $19.99/شهر، أي ما يقارب 3 أضعاف السعة الحقيقية.",
      lipSyncFeatures: [
        "دقائق مزامنة الشفاه (خطة Starter)",
        "هيكل الأرصدة",
        "تكلفة مزامنة الشفاه لكل رصيد",
        "سعر خطة البداية",
        "رسوم إضافية لمزامنة الشفاه",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "الفيديو ومزامنة الشفاه مجموعات أرصدة منفصلة في كل خطة.",
      whereCompetitorWinsHeading: "أين يتفوق GeckoDub",
      whereDubsyncWinsHeading: "أين يتفوق DubSync",
      whereCompetitorWins: [
        "أكثر من 60 لغة مدعومة",
        "واجهة مستخدم أكثر صقلًا في بعض المجالات",
        "ميزات تحرير ترجمة محددة",
      ],
      whereDubsyncWins: [
        "3 أضعاف دقائق مزامنة الشفاه بنفس السعر",
        "نموذج أرصدة موحد (بدون مجموعات منفصلة)",
        "خطة مجانية حقيقية مع مزامنة الشفاه",
        "لا رسوم مخفية لمزامنة الشفاه",
      ],
      faqs: [
        {
          q: "لماذا يقدم DubSync دقائق مزامنة شفاه أكثر؟",
          a: "DubSync يستخدم مجموعة أرصدة واحدة: كل رصيد هو دقيقة واحدة مع مزامنة الشفاه. GeckoDub يقسم الفيديو ومزامنة الشفاه إلى مجموعات منفصلة، لذلك 7 فقط من 10 دقائق خطة Starter تتضمن مزامنة الشفاه.",
        },
        {
          q: "هل لدى GeckoDub لغات أكثر من DubSync؟",
          a: "نعم، GeckoDub يدعم أكثر من 60 لغة مقابل 30+ في DubSync. إذا كنت تحتاج لغة نادرة خارج أفضل 30 لغة، قد يكون GeckoDub الخيار المناسب.",
        },
        {
          q: "هل يمكنني تجربة DubSync قبل الدفع؟",
          a: "نعم. الخطة المجانية في DubSync تتضمن فيديو واحدًا يصل إلى 15 ثانية مع مزامنة الشفاه واستنساخ الصوت. بدون بطاقة ائتمان.",
        },
      ],
    },
  },
  id: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — Lip Sync Mulai $19.99 vs $120/bulan",
      metaDescription:
        "Rask AI mengenakan $120/bulan untuk lip sync dan menggandakan penggunaan kredit. DubSync menyertakan lip sync di setiap kredit mulai $19.99. Bandingkan fitur dan biaya.",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI mengenakan $120/bulan untuk lip sync dan menggandakan kredit Anda. DubSync menyertakan lip sync di setiap kredit mulai $19.99.",
      verdictBody:
        "DubSync adalah pilihan terbaik bagi kreator yang membutuhkan dubbing lip sync dengan harga terjangkau. Dengan $19.99/bulan Anda mendapat 20 menit dengan lip sync — sebagian kecil dari harga Rask AI. Rask AI memerlukan paket Creator Pro $120/bulan untuk lip sync dan menggandakan konsumsi kredit. Pilih Rask AI hanya jika Anda membutuhkan bahasa langka di luar 30+ bahasa DubSync.",
      lipSyncFeatures: [
        "Menit lip sync (paket Starter)",
        "Biaya per kredit lip sync",
        "Kapasitas efektif lip sync (Pro)",
        "10 menit × 3 bahasa: kredit lip sync",
        "Harga akses lip sync",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "Tidak ada paket gratis. Lip sync menggunakan 2x kredit hanya di Creator Pro.",
      whereCompetitorWinsHeading: "Keunggulan Rask AI",
      whereDubsyncWinsHeading: "Keunggulan DubSync",
      whereCompetitorWins: [
        "130+ bahasa vs 30+ di DubSync",
        "Merek lebih mapan dengan rekam jejak lebih panjang",
        "Fitur ekspor SRT/subtitle tingkat lanjut",
      ],
      whereDubsyncWins: [
        "Lip sync termasuk di setiap paket (tanpa penalti 2x)",
        "Lip sync mulai $19.99/bulan vs $120/bulan di Rask AI",
        "Paket gratis tersedia untuk uji coba sebelum berlangganan",
        "Harga lebih sederhana: 1 kredit = 1 menit, tanpa pengali",
      ],
      faqs: [
        {
          q: "Apakah DubSync lebih murah dari Rask AI untuk lip sync?",
          a: "Ya. DubSync menyertakan lip sync mulai $19.99/bulan. Rask AI memerlukan Creator Pro $120/bulan dan menggandakan konsumsi kredit, jadi Anda membayar 6x lebih banyak untuk jumlah konten lip sync yang sebanding.",
        },
        {
          q: "Apakah Rask AI menyertakan lip sync di semua paket?",
          a: "Tidak. Paket Creator Rask AI ($50/bulan) tidak menyertakan lip sync. Lip sync memerlukan paket Creator Pro $120/bulan, yang menggandakan penggunaan kredit Anda.",
        },
        {
          q: "Berapa menit lip sync yang didapat di Rask AI vs DubSync?",
          a: "DubSync Starter ($19.99/bulan) memberikan 20 menit lip sync. Rask AI Creator Pro ($120/bulan) memberikan sekitar 50 menit efektif setelah penalti 2x. Itu 6x harga untuk 2.5x menit.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — Lip Sync Termasuk vs Kredit Bersama",
      metaDescription:
        "HeyGen berbagi kredit premium lip sync dengan avatar. DubSync menawarkan lip sync khusus di setiap kredit mulai $19.99/bulan.",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen berbagi kredit lip sync dengan avatar dan pembuatan. DubSync menawarkan lip sync khusus di setiap kredit.",
      verdictBody:
        "DubSync adalah pilihan yang lebih jelas untuk dubbing video dengan lip sync yang dapat diprediksi. HeyGen adalah platform avatar AI di mana lip sync berbagi kredit premium dengan pembuatan avatar, menyulitkan perencanaan penggunaan. DubSync fokus secara eksklusif pada dubbing: setiap kredit adalah satu menit penuh dengan lip sync.",
      lipSyncFeatures: [
        "Menit lip sync khusus",
        "Model kredit",
        "Biaya tersembunyi",
        "Harga masuk",
        "Kapasitas yang dapat diprediksi",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "Platform avatar dengan lip sync sebagai fitur sekunder.",
      whereCompetitorWinsHeading: "Keunggulan HeyGen",
      whereDubsyncWinsHeading: "Keunggulan DubSync",
      whereCompetitorWins: [
        "175+ bahasa didukung",
        "Avatar AI yang dihasilkan AI",
        "Ekosistem lebih besar untuk produksi video AI",
      ],
      whereDubsyncWins: [
        "Lip sync khusus tanpa berbagi kredit",
        "Kapasitas yang dapat diprediksi: 1 kredit = 1 menit lip sync",
        "Paket gratis untuk dicoba sebelum membayar",
        "Harga lebih rendah untuk dubbing yang berfokus pada video",
      ],
      faqs: [
        {
          q: "Mengapa DubSync lebih dapat diprediksi daripada HeyGen?",
          a: "DubSync menggunakan kredit khusus dubbing: 1 kredit = 1 menit dengan lip sync. HeyGen berbagi kredit premium antara avatar, pembuatan, dan lip sync, sehingga kapasitas aktual Anda tergantung pada cara penggunaan.",
        },
        {
          q: "Apakah HeyGen lebih baik untuk membuat avatar?",
          a: "Ya. HeyGen berspesialisasi dalam avatar AI dan memiliki ekosistem yang lebih lengkap untuk penggunaan tersebut. DubSync hanya fokus pada dubbing dengan kloning suara asli.",
        },
        {
          q: "Bisakah saya menggunakan DubSync untuk membuat avatar?",
          a: "Tidak. DubSync mengkloning suara pembicara asli dan menyinkronkan bibir video yang ada, tetapi tidak membuat avatar baru dari teks.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — Lip Sync Video vs Dubbing Audio Saja",
      metaDescription:
        "ElevenLabs menawarkan audio AI terbaik tetapi tanpa lip sync. DubSync menambahkan lip sync ke setiap video yang didubbing. Bandingkan untuk lokalisasi video.",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs menawarkan audio AI luar biasa tetapi hanya audio. DubSync menghasilkan video dubbing dengan lip sync otomatis.",
      verdictBody:
        "Jika Anda membutuhkan lokalisasi video lengkap, DubSync adalah satu-satunya pilihan di antara keduanya. ElevenLabs memimpin dalam sintesis suara AI, tetapi hanya menghasilkan audio — Anda harus menyinkronkan dan mengintegrasikan ke video sendiri. DubSync menggabungkan kloning suara, terjemahan, dan lip sync otomatis dalam satu alur dan menghasilkan MP4 siap publikasi.",
      lipSyncFeatures: [
        "Lip sync termasuk",
        "Output video",
        "Sinkronisasi bibir otomatis",
        "Harga paket Starter",
        "Biaya per menit dengan lip sync",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "Paket berbasis karakter, bukan video. Hanya output audio.",
      whereCompetitorWinsHeading: "Keunggulan ElevenLabs",
      whereDubsyncWinsHeading: "Keunggulan DubSync",
      whereCompetitorWins: [
        "Kualitas suara AI terbaik di pasar",
        "Perpustakaan suara siap pakai terbesar",
        "Pembuatan efek suara AI",
      ],
      whereDubsyncWins: [
        "Video dubbing lengkap, bukan hanya audio",
        "Lip sync otomatis termasuk",
        "Alur kerja satu klik untuk video",
        "Harga yang dapat diprediksi berdasarkan menit",
      ],
      faqs: [
        {
          q: "Bisakah saya menggunakan ElevenLabs untuk mendubbing video?",
          a: "Anda dapat menghasilkan audio dubbing dengan ElevenLabs, tetapi harus menyinkronkannya secara manual dengan video dan tidak akan mendapat lip sync. DubSync mengotomatiskan seluruh proses.",
        },
        {
          q: "Apakah DubSync menggunakan teknologi ElevenLabs?",
          a: "DubSync menggabungkan beberapa penyedia AI terkemuka untuk kloning suara, terjemahan, dan lip sync. Kami tidak bergantung pada satu penyedia.",
        },
        {
          q: "Mana yang lebih baik untuk kreator YouTube?",
          a: "DubSync. Kreator membutuhkan video jadi dengan lip sync — bukan hanya trek audio. DubSync menghasilkan MP4 siap unggah dalam hitungan menit.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7 Menit Lip Sync",
      metaDescription:
        "GeckoDub membagi video dan lip sync ke dalam pool terpisah (hanya 7 menit lip sync di Starter). DubSync menyertakan lip sync di seluruh 20 menit.",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub membagi menit video dan lip sync ke dalam pool terpisah. DubSync menyertakan lip sync di setiap menit.",
      verdictBody:
        "DubSync jelas menang dalam nilai per dolar untuk lip sync. Paket Starter GeckoDub memisahkan menit video dan lip sync — Anda mendapat 10 menit video tetapi hanya 7 lip sync. DubSync Starter memberikan 20 menit penuh dengan lip sync seharga $19.99/bulan, hampir 3x kapasitas nyata.",
      lipSyncFeatures: [
        "Menit lip sync (paket Starter)",
        "Struktur kredit",
        "Biaya lip sync per kredit",
        "Harga paket Starter",
        "Biaya tambahan lip sync",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "Video dan lip sync adalah pool kredit terpisah di setiap paket.",
      whereCompetitorWinsHeading: "Keunggulan GeckoDub",
      whereDubsyncWinsHeading: "Keunggulan DubSync",
      whereCompetitorWins: [
        "60+ bahasa didukung",
        "UI lebih halus di beberapa area",
        "Fitur pengeditan subtitle khusus",
      ],
      whereDubsyncWins: [
        "3x lebih banyak menit lip sync dengan harga sama",
        "Model kredit terpadu (tanpa pool terpisah)",
        "Paket gratis nyata dengan lip sync",
        "Tanpa biaya tersembunyi untuk lip sync",
      ],
      faqs: [
        {
          q: "Mengapa DubSync memberikan lebih banyak menit lip sync?",
          a: "DubSync menggunakan satu pool kredit: setiap kredit adalah 1 menit dengan lip sync. GeckoDub membagi video dan lip sync ke dalam pool terpisah, jadi hanya 7 dari 10 menit paket Starter yang menyertakan lip sync.",
        },
        {
          q: "Apakah GeckoDub memiliki lebih banyak bahasa daripada DubSync?",
          a: "Ya, GeckoDub mendukung 60+ bahasa vs 30+ di DubSync. Jika Anda membutuhkan bahasa langka di luar 30 teratas, GeckoDub bisa menjadi pilihan.",
        },
        {
          q: "Bisakah saya mencoba DubSync sebelum membayar?",
          a: "Ya. Paket gratis DubSync termasuk 1 video hingga 15 detik dengan lip sync dan kloning suara. Tanpa kartu kredit.",
        },
      ],
    },
  },
  tr: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — Dudak Senkronu $19.99'dan vs $120/ay",
      metaDescription:
        "Rask AI dudak senkronu icin $120/ay talep ediyor ve kredi tuketimini ikiye katlıyor. DubSync $19.99'dan her krediye dudak senkronu dahil ediyor. Ozellikleri ve maliyetleri karşılaştırın.",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI dudak senkronu icin $120/ay talep ediyor ve kredilerinizi ikiye katlıyor. DubSync $19.99'dan her krediye dudak senkronu dahil ediyor.",
      verdictBody:
        "DubSync, uygun fiyatlı dudak senkronlu dublaj ihtiyacı olan iceriklerin ureticileri icin en iyi secenektir. Aylık $19.99'a dudak senkronu dahil 20 dakika alırsınız — Rask AI'ın fiyatının bir kısmı. Rask AI, dudak senkronu icin aylık $120'lık Creator Pro planını gerektiriyor ve kredi tuketimini ikiye katlıyor. Rask AI'ı yalnızca DubSync'in 30+ dilinin dışında nadir dillere ihtiyacınız varsa secin.",
      lipSyncFeatures: [
        "Dudak senkronu dakikaları (Starter planı)",
        "Dudak senkronu kredi başına maliyet",
        "Etkili dudak senkronu kapasitesi (Pro)",
        "10 dk × 3 dil: dudak senkronu kredileri",
        "Dudak senkronu erişim fiyatı",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "Ucretsiz plan yok. Dudak senkronu yalnızca Creator Pro'da 2x kredi kullanır.",
      whereCompetitorWinsHeading: "Rask AI nerede kazanır",
      whereDubsyncWinsHeading: "DubSync nerede kazanır",
      whereCompetitorWins: [
        "DubSync'in 30+ diline karşı 130+ dil",
        "Daha uzun gecmişe sahip daha koklü marka",
        "Gelişmiş SRT/altyazı dışa aktarma ozellikleri",
      ],
      whereDubsyncWins: [
        "Her planda dudak senkronu dahil (2x cezası yok)",
        "Rask AI'daki $120/ay'a karşı $19.99/ay'dan dudak senkronu",
        "Taahhut etmeden once test etmek icin ucretsiz plan mevcut",
        "Daha basit fiyatlandırma: 1 kredi = 1 dakika, carpan yok",
      ],
      faqs: [
        {
          q: "DubSync, dudak senkronu icin Rask AI'dan daha mı ucuz?",
          a: "Evet. DubSync aylık $19.99'dan dudak senkronu dahil ediyor. Rask AI aylık $120'lık Creator Pro gerektiriyor ve kredi tuketimini ikiye katlıyor, bu yuzden karşılaştırılabilir miktarda dudak senkronlu iceriklere icin 6 kat fazla oduyorsunuz.",
        },
        {
          q: "Rask AI tum planlarda dudak senkronu dahil mi?",
          a: "Hayır. Rask AI'ın Creator planı ($50/ay) dudak senkronu icermiyor. Dudak senkronu, kredi kullnımını ikiye katlayan $120/ay'lık Creator Pro planını gerektiriyor.",
        },
        {
          q: "Rask AI vs DubSync'te kac dakika dudak senkronu alırsınız?",
          a: "DubSync Starter ($19.99/ay) 20 dakika dudak senkronu verir. Rask AI Creator Pro ($120/ay) 2x cezasından sonra yaklaşık 50 etkili dakika verir. 6 kat fiyat, 2.5 kat dakika.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — Dudak Senkronu Dahil vs Paylaşılan Krediler",
      metaDescription:
        "HeyGen, dudak senkronu premium kredilerini avatarlarla paylaşıyor. DubSync, $19.99/ay'dan her kredide ozel dudak senkronu sunuyor.",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen, dudak senkronu kredilerini avatarlar ve uretimle paylaşıyor. DubSync, her kredide ozel dudak senkronu sunuyor.",
      verdictBody:
        "DubSync, ongorebilebilir dudak senkronu ile video dublaj icin daha net bir secimdir. HeyGen, dudak senkronunun avatar uretimi ile premium kredileri paylaştığı bir AI avatar platformudur ve kullanım planlamasını zorlaştırır. DubSync yalnızca dublaja odaklanır: her kredi, dudak senkronu dahil tam bir dakikadır.",
      lipSyncFeatures: [
        "Ozel dudak senkronu dakikaları",
        "Kredi modeli",
        "Gizli ucretler",
        "Giriş fiyatı",
        "Ongorebilebilir kapasite",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "Dudak senkronu ikincil ozellik olan avatar platformu.",
      whereCompetitorWinsHeading: "HeyGen nerede kazanır",
      whereDubsyncWinsHeading: "DubSync nerede kazanır",
      whereCompetitorWins: [
        "175+ desteklenen dil",
        "AI tarafından olusturulan AI avatarlar",
        "AI video uretimi icin daha buyuk ekosistem",
      ],
      whereDubsyncWins: [
        "Kredi paylaşmadan ozel dudak senkronu",
        "Ongorebilebilir kapasite: 1 kredi = 1 dakika dudak senkronu",
        "Odemeden once denemek icin ucretsiz plan",
        "Video odaklı dublaj icin daha duşuk fiyat",
      ],
      faqs: [
        {
          q: "DubSync neden HeyGen'den daha ongorebilebilir?",
          a: "DubSync dublaja ozel krediler kullanır: 1 kredi = dudak senkronu dahil 1 dakika. HeyGen premium kredileri avatarlar, uretim ve dudak senkronu arasında paylaşır, bu nedenle gercek kapasiteniz kullanım şeklinize bağlıdır.",
        },
        {
          q: "HeyGen avatar olusturmak icin daha mı iyi?",
          a: "Evet. HeyGen AI avatarlarda uzmanlaşmıştır ve bu kullanım alanı icin daha eksiksiz bir ekosisteme sahiptir. DubSync yalnızca orijinal ses klonu ile dublaja odaklanır.",
        },
        {
          q: "DubSync ile avatar olusturabilir miyim?",
          a: "Hayır. DubSync orijinal konuşmacının sesini klonlar ve mevcut videonun dudaklarını senkronize eder, ancak metinden yeni avatarlar olusturmaz.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — Video Dudak Senkronu vs Yalnızca Sesli Dublaj",
      metaDescription:
        "ElevenLabs en iyi AI sesini sunuyor ancak dudak senkronu yok. DubSync her dublaj videosuna dudak senkronu ekliyor. Video lokalizasyonu icin karşılaştırın.",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs olağanustu AI sesi sunuyor ancak yalnızca ses. DubSync otomatik dudak senkronlu dublaj videosu uretiyor.",
      verdictBody:
        "Tam video lokalizasyonuna ihtiyacınız varsa, ikisi arasında DubSync tek secenektir. ElevenLabs AI ses sentezinde liderdir, ancak yalnızca ses sunar — senkronizasyon ve videoya entegrasyonu kendiniz yapmalısınız. DubSync ses klonlama, ceviri ve otomatik dudak senkronunu tek bir iş akışında birleştirir ve yayına hazır MP4 sunar.",
      lipSyncFeatures: [
        "Dudak senkronu dahil",
        "Video cıktısı",
        "Otomatik dudak senkronizasyonu",
        "Starter plan fiyatı",
        "Dudak senkronlu dakika başı maliyet",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "Karakter tabanlı planlar, video tabanlı değil. Yalnızca ses cıktısı.",
      whereCompetitorWinsHeading: "ElevenLabs nerede kazanır",
      whereDubsyncWinsHeading: "DubSync nerede kazanır",
      whereCompetitorWins: [
        "Piyasadaki en iyi AI ses kalitesi",
        "En buyuk hazır ses kutuphanesi",
        "AI ses efekti olusturma",
      ],
      whereDubsyncWins: [
        "Yalnızca ses değil, eksiksiz dublaj videosu",
        "Otomatik dudak senkronu dahil",
        "Video icin tek tıklamalı iş akışı",
        "Dakika bazlı ongorebilebilir fiyatlandırma",
      ],
      faqs: [
        {
          q: "ElevenLabs'ı video dublajı icin kullanabilir miyim?",
          a: "ElevenLabs ile dublaj sesi olusturabilirsiniz, ancak videonuzla manuel olarak senkronize etmeniz gerekecek ve dudak senkronu olmayacak. DubSync tum sureci otomatikleştirir.",
        },
        {
          q: "DubSync, ElevenLabs teknolojisini kullanıyor mu?",
          a: "DubSync, ses klonlama, ceviri ve dudak senkronu icin birden fazla birinci sınıf AI sağlayıcısını birleştirir. Tek bir sağlayıcıya bağımlı değiliz.",
        },
        {
          q: "YouTube iceriklerin ureticileri icin hangisi daha iyi?",
          a: "DubSync. Icerik ureticileri dudak senkronlu tamamlanmış videoya ihtiyac duyar — yalnızca ses parçalarına değil. DubSync dakikalar icinde yuklemeye hazır MP4 sunar.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7 Dakika Dudak Senkronu",
      metaDescription:
        "GeckoDub video ve dudak senkronunu ayrı havuzlara boluyor (Starter'da yalnızca 7 dk dudak senkronu). DubSync tam 20 dakikaya dudak senkronu dahil ediyor.",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub video ve dudak senkronu dakikalarını ayrı havuzlara boluyor. DubSync her dakikaya dudak senkronu dahil ediyor.",
      verdictBody:
        "DubSync, dudak senkronu icin dolar başına değerde acıkca kazanır. GeckoDub'un Starter planı video ve dudak senkronu dakikalarını ayırır — 10 dakika video alırsınız ama yalnızca 7'si dudak senkronu. DubSync Starter, $19.99/ay karşılığında dudak senkronu dahil 20 tam dakika verir, neredeyse 3 kat daha fazla gercek kapasite.",
      lipSyncFeatures: [
        "Dudak senkronu dakikaları (Starter planı)",
        "Kredi yapısı",
        "Kredi başına dudak senkronu maliyeti",
        "Starter plan fiyatı",
        "Dudak senkronu ek ucreti",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "Video ve dudak senkronu her planda ayrı kredi havuzlarıdır.",
      whereCompetitorWinsHeading: "GeckoDub nerede kazanır",
      whereDubsyncWinsHeading: "DubSync nerede kazanır",
      whereCompetitorWins: [
        "60+ desteklenen dil",
        "Bazı alanlarda daha cilalı kullanıcı arayuzu",
        "Belirli altyazı duzenleme ozellikleri",
      ],
      whereDubsyncWins: [
        "Aynı fiyata 3 kat daha fazla dudak senkronu dakikası",
        "Birleşik kredi modeli (ayrı havuzlar yok)",
        "Dudak senkronlu gercek ucretsiz plan",
        "Dudak senkronu icin gizli ucret yok",
      ],
      faqs: [
        {
          q: "DubSync neden daha fazla dudak senkronu dakikası sunuyor?",
          a: "DubSync tek bir kredi havuzu kullanır: her kredi dudak senkronu dahil 1 dakikadır. GeckoDub video ve dudak senkronunu ayrı havuzlara boler, bu yuzden Starter planının 10 dakikasının yalnızca 7'si dudak senkronu icerir.",
        },
        {
          q: "GeckoDub'da DubSync'ten daha fazla dil var mı?",
          a: "Evet, GeckoDub DubSync'in 30+ diline karşı 60+ dili destekliyor. Ilk 30 dilin dışında nadir bir dile ihtiyacınız varsa GeckoDub secenek olabilir.",
        },
        {
          q: "Odemeden once DubSync'i deneyebilir miyim?",
          a: "Evet. DubSync'in ucretsiz planı, dudak senkronu ve ses klonlama ile 15 saniyeye kadar 1 video icerir. Kredi kartı gerekmez.",
        },
      ],
    },
  },
  ko: {
    "rask-ai": {
      metaTitle: "DubSync vs Rask AI (2026) — 립싱크 $19.99 vs $120/월",
      metaDescription:
        "Rask AI는 립싱크에 월 $120를 청구하고 크레딧 소비를 두 배로 늘립니다. DubSync는 $19.99부터 모든 크레딧에 립싱크를 포함합니다. 기능과 비용을 비교하세요.",
      h1: "DubSync vs Rask AI",
      heroSubtitle:
        "Rask AI는 립싱크에 월 $120를 청구하고 크레딧을 두 배로 사용합니다. DubSync는 $19.99부터 모든 크레딧에 립싱크를 포함합니다.",
      verdictBody:
        "DubSync는 합리적인 가격에 립싱크 더빙이 필요한 크리에이터를 위한 최고의 선택입니다. 월 $19.99에 립싱크 포함 20분을 얻을 수 있으며, 이는 Rask AI 가격의 일부입니다. Rask AI는 립싱크를 위해 월 $120의 Creator Pro 플랜이 필요하고 크레딧 소비를 두 배로 늘립니다. DubSync의 30개 이상 언어를 벗어난 희귀 언어가 필요한 경우에만 Rask AI를 선택하세요.",
      lipSyncFeatures: [
        "립싱크 분 (Starter 플랜)",
        "립싱크 크레딧당 비용",
        "유효 립싱크 용량 (Pro)",
        "10분 x 3개 언어: 립싱크 크레딧",
        "립싱크 접근 가격",
      ],
      competitorPricingLabel: "Rask AI",
      competitorPricingNote: "무료 플랜 없음. 립싱크는 Creator Pro에서만 2x 크레딧 사용.",
      whereCompetitorWinsHeading: "Rask AI가 우세한 점",
      whereDubsyncWinsHeading: "DubSync가 우세한 점",
      whereCompetitorWins: [
        "DubSync의 30개 이상 대비 130개 이상 언어",
        "더 오랜 역사를 가진 더 확립된 브랜드",
        "고급 SRT/자막 내보내기 기능",
      ],
      whereDubsyncWins: [
        "모든 플랜에 립싱크 포함 (2x 패널티 없음)",
        "Rask AI의 월 $120 대비 월 $19.99부터 립싱크",
        "구매 전 테스트할 수 있는 무료 플랜 제공",
        "더 단순한 가격: 1 크레딧 = 1분, 승수 없음",
      ],
      faqs: [
        {
          q: "립싱크에서 DubSync가 Rask AI보다 저렴한가요?",
          a: "네. DubSync는 월 $19.99부터 립싱크를 포함합니다. Rask AI는 월 $120의 Creator Pro가 필요하고 크레딧 소비를 두 배로 늘리므로, 비슷한 양의 립싱크 콘텐츠에 6배 더 지불합니다.",
        },
        {
          q: "Rask AI는 모든 플랜에 립싱크를 포함하나요?",
          a: "아니요. Rask AI의 Creator 플랜 (월 $50)에는 립싱크가 포함되지 않습니다. 립싱크는 월 $120의 Creator Pro 플랜이 필요하며, 크레딧 사용이 두 배가 됩니다.",
        },
        {
          q: "Rask AI vs DubSync에서 립싱크 분은 얼마나 되나요?",
          a: "DubSync Starter (월 $19.99)는 립싱크 20분을 제공합니다. Rask AI Creator Pro (월 $120)는 2x 패널티 후 약 50분의 유효 시간을 제공합니다. 6배 가격에 2.5배 분수입니다.",
        },
      ],
    },
    heygen: {
      metaTitle: "DubSync vs HeyGen — 립싱크 포함 vs 공유 크레딧",
      metaDescription:
        "HeyGen은 립싱크 프리미엄 크레딧을 아바타와 공유합니다. DubSync는 월 $19.99부터 모든 크레딧에 전용 립싱크를 제공합니다.",
      h1: "DubSync vs HeyGen",
      heroSubtitle:
        "HeyGen은 립싱크 크레딧을 아바타와 생성에 공유합니다. DubSync는 모든 크레딧에 전용 립싱크를 제공합니다.",
      verdictBody:
        "DubSync는 예측 가능한 립싱크로 비디오 더빙에 있어 더 명확한 선택입니다. HeyGen은 립싱크가 아바타 생성과 프리미엄 크레딧을 공유하는 AI 아바타 플랫폼으로, 사용 계획이 어렵습니다. DubSync는 더빙에만 집중합니다: 모든 크레딧이 립싱크 포함 1분입니다.",
      lipSyncFeatures: [
        "전용 립싱크 분",
        "크레딧 모델",
        "숨겨진 수수료",
        "입문 가격",
        "예측 가능한 용량",
      ],
      competitorPricingLabel: "HeyGen",
      competitorPricingNote: "립싱크가 부차적 기능인 아바타 플랫폼.",
      whereCompetitorWinsHeading: "HeyGen이 우세한 점",
      whereDubsyncWinsHeading: "DubSync가 우세한 점",
      whereCompetitorWins: [
        "175개 이상 지원 언어",
        "AI 생성 AI 아바타",
        "AI 비디오 제작을 위한 더 큰 생태계",
      ],
      whereDubsyncWins: [
        "크레딧 공유 없는 전용 립싱크",
        "예측 가능한 용량: 1 크레딧 = 1분 립싱크",
        "결제 전 테스트할 수 있는 무료 플랜",
        "비디오 중심 더빙을 위한 더 낮은 가격",
      ],
      faqs: [
        {
          q: "DubSync가 HeyGen보다 왜 더 예측 가능한가요?",
          a: "DubSync는 더빙 전용 크레딧을 사용합니다: 1 크레딧 = 립싱크 포함 1분. HeyGen은 아바타, 생성, 립싱크 간에 프리미엄 크레딧을 공유하므로 실제 용량은 사용 방식에 따라 달라집니다.",
        },
        {
          q: "HeyGen이 아바타 제작에 더 나은가요?",
          a: "네. HeyGen은 AI 아바타를 전문으로 하며 해당 용도에 더 완전한 생태계를 갖추고 있습니다. DubSync는 원본 음성 복제를 통한 더빙에만 집중합니다.",
        },
        {
          q: "DubSync로 아바타를 만들 수 있나요?",
          a: "아니요. DubSync는 원래 화자의 목소리를 복제하고 기존 비디오의 입술을 동기화하지만, 텍스트에서 새 아바타를 생성하지는 않습니다.",
        },
      ],
    },
    elevenlabs: {
      metaTitle: "DubSync vs ElevenLabs — 비디오 립싱크 vs 오디오 전용 더빙",
      metaDescription:
        "ElevenLabs는 최고의 AI 오디오를 제공하지만 립싱크는 없습니다. DubSync는 모든 더빙 비디오에 립싱크를 추가합니다. 비디오 로컬라이제이션을 비교하세요.",
      h1: "DubSync vs ElevenLabs",
      heroSubtitle:
        "ElevenLabs는 뛰어난 AI 오디오를 제공하지만 오디오만. DubSync는 자동 립싱크가 포함된 더빙 비디오를 생성합니다.",
      verdictBody:
        "완전한 비디오 로컬라이제이션이 필요하다면, 둘 중 DubSync가 유일한 선택입니다. ElevenLabs는 AI 음성 합성의 선두주자이지만 오디오만 제공합니다. 동기화와 비디오 재통합은 직접 해야 합니다. DubSync는 음성 복제, 번역, 자동 립싱크를 하나의 워크플로로 결합하여 게시 준비된 MP4를 제공합니다.",
      lipSyncFeatures: [
        "립싱크 포함",
        "비디오 출력",
        "자동 입술 동기화",
        "Starter 플랜 가격",
        "립싱크 포함 분당 비용",
      ],
      competitorPricingLabel: "ElevenLabs",
      competitorPricingNote: "문자 기반 플랜, 비디오 기반 아님. 오디오 출력만.",
      whereCompetitorWinsHeading: "ElevenLabs가 우세한 점",
      whereDubsyncWinsHeading: "DubSync가 우세한 점",
      whereCompetitorWins: [
        "시장 최고의 AI 음성 품질",
        "가장 큰 기성 음성 라이브러리",
        "AI 사운드 이펙트 생성",
      ],
      whereDubsyncWins: [
        "오디오만이 아닌 완전한 더빙 비디오",
        "자동 립싱크 포함",
        "비디오를 위한 원클릭 워크플로",
        "분 기반 예측 가능한 가격",
      ],
      faqs: [
        {
          q: "ElevenLabs로 비디오를 더빙할 수 있나요?",
          a: "ElevenLabs로 더빙 오디오를 생성할 수 있지만, 비디오와 수동으로 동기화해야 하며 립싱크는 제공되지 않습니다. DubSync는 전체 프로세스를 자동화합니다.",
        },
        {
          q: "DubSync는 ElevenLabs 기술을 사용하나요?",
          a: "DubSync는 음성 복제, 번역, 립싱크를 위해 여러 최고급 AI 제공업체를 결합합니다. 단일 제공업체에 의존하지 않습니다.",
        },
        {
          q: "YouTube 크리에이터에게 어느 것이 더 좋나요?",
          a: "DubSync입니다. 크리에이터는 립싱크가 포함된 완성된 비디오가 필요합니다. 오디오 트랙만으로는 부족합니다. DubSync는 몇 분 안에 업로드 준비된 MP4를 제공합니다.",
        },
      ],
    },
    geckodub: {
      metaTitle: "DubSync vs GeckoDub — 20 vs 7분 립싱크",
      metaDescription:
        "GeckoDub는 비디오와 립싱크를 별도 풀로 분리합니다 (Starter에서 립싱크 7분만). DubSync는 전체 20분에 립싱크를 포함합니다.",
      h1: "DubSync vs GeckoDub",
      heroSubtitle:
        "GeckoDub는 비디오와 립싱크 분을 별도 풀로 분리합니다. DubSync는 모든 분에 립싱크를 포함합니다.",
      verdictBody:
        "DubSync는 립싱크 달러당 가치에서 확실히 승리합니다. GeckoDub의 Starter 플랜은 비디오와 립싱크 분을 분리합니다. 비디오 10분을 얻지만 립싱크는 7분뿐입니다. DubSync Starter는 월 $19.99에 립싱크 포함 20분 전체를 제공하며, 실제 용량이 약 3배입니다.",
      lipSyncFeatures: [
        "립싱크 분 (Starter 플랜)",
        "크레딧 구조",
        "크레딧당 립싱크 비용",
        "Starter 플랜 가격",
        "립싱크 추가 요금",
      ],
      competitorPricingLabel: "GeckoDub",
      competitorPricingNote: "각 플랜에서 비디오와 립싱크는 별도 크레딧 풀입니다.",
      whereCompetitorWinsHeading: "GeckoDub가 우세한 점",
      whereDubsyncWinsHeading: "DubSync가 우세한 점",
      whereCompetitorWins: [
        "60개 이상 지원 언어",
        "일부 영역에서 더 세련된 UI",
        "특정 자막 편집 기능",
      ],
      whereDubsyncWins: [
        "같은 가격에 3배 더 많은 립싱크 분",
        "통합 크레딧 모델 (별도 풀 없음)",
        "립싱크 포함 진정한 무료 플랜",
        "립싱크에 숨겨진 수수료 없음",
      ],
      faqs: [
        {
          q: "DubSync가 왜 더 많은 립싱크 분을 제공하나요?",
          a: "DubSync는 단일 크레딧 풀을 사용합니다: 모든 크레딧이 립싱크 포함 1분입니다. GeckoDub는 비디오와 립싱크를 별도 풀로 분리하므로 Starter 플랜 10분 중 7분만 립싱크를 포함합니다.",
        },
        {
          q: "GeckoDub가 DubSync보다 언어가 더 많은가요?",
          a: "네, GeckoDub는 DubSync의 30개 이상 대비 60개 이상 언어를 지원합니다. 상위 30개 언어 외의 희귀 언어가 필요하면 GeckoDub가 선택지가 될 수 있습니다.",
        },
        {
          q: "결제 전에 DubSync를 체험할 수 있나요?",
          a: "네. DubSync의 무료 플랜에는 립싱크와 음성 복제가 포함된 최대 15초 비디오 1개가 포함됩니다. 신용카드 불필요.",
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
  const locales: VsLocale[] = ["es", "pt", "de", "fr", "ja", "hi", "ar", "id", "tr", "ko"];
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
