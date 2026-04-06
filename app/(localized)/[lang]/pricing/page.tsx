import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOCALES, isValidLocale, type Locale } from "@/lib/i18n/dictionaries";
import { PricingNew } from "@/components/landing/pricing-new";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

/* ------------------------------------------------------------------ */
/*  Translations — only UI chrome; pricing data comes from PricingNew */
/* ------------------------------------------------------------------ */

const t: Record<
  Exclude<Locale, "en">,
  {
    title: string;
    metaTitle: string;
    metaDescription: string;
    ogDescription: string;
    heading: string;
    subheading: string;
    faqHeading: string;
    breadcrumb: string;
    faqs: { q: string; a: string }[];
  }
> = {
  es: {
    title: "Precios de DubSync — Planes de Doblaje de Video con IA",
    metaTitle:
      "Precios de DubSync — Planes de Doblaje de Video con IA desde Gratis hasta Enterprise",
    metaDescription:
      "Elige el plan de DubSync que se adapte a tus necesidades. Planes Gratis, Starter, Pro y Enterprise para doblaje de video con IA, clonación de voz y sincronización labial.",
    ogDescription:
      "Elige el plan de DubSync ideal. Planes Gratis, Starter, Pro y Enterprise con sincronización labial incluida.",
    heading:
      "Precios de DubSync — Planes de Doblaje de Video con IA para Cada Creador",
    subheading:
      "Comienza gratis con 5 minutos de doblaje al mes. Actualiza cuando necesites más minutos, idiomas y funciones de equipo.",
    faqHeading: "Preguntas Frecuentes sobre Precios",
    breadcrumb: "Precios",
    faqs: [
      {
        q: "¿Puedo cambiar de plan en cualquier momento?",
        a: "Sí. Puedes mejorar o reducir tu plan en cualquier momento desde tu panel de control. Al mejorar, obtienes acceso inmediato a las nuevas funciones. Al reducir, tu plan actual permanece activo hasta el final del período de facturación.",
      },
      {
        q: "¿Qué sucede si excedo los límites de mi plan?",
        a: "Recibirás una notificación cuando alcances el 80% de tus minutos mensuales de doblaje. Una vez que alcances el límite, los nuevos trabajos de doblaje se pondrán en cola hasta tu próximo ciclo de facturación o hasta que actualices tu plan.",
      },
      {
        q: "¿Hay una prueba gratuita para los planes de pago?",
        a: "Ofrecemos un plan gratuito con 5 minutos de doblaje al mes para que puedas probar la calidad. Los planes de pago no tienen una prueba separada, pero puedes cancelar dentro de los primeros 7 días para obtener un reembolso completo.",
      },
      {
        q: "¿Cómo funciona la facturación anual?",
        a: "Los planes anuales se facturan una vez al año con una tarifa con descuento (normalmente un 20% de descuento). Obtienes las mismas funciones que el plan mensual pero pagas menos en total. Las suscripciones anuales se pueden cancelar en cualquier momento, con acceso hasta el final del período pagado.",
      },
      {
        q: "¿Ofrecen reembolsos?",
        a: "Ofrecemos una política de reembolso de 7 días para nuevas suscripciones de pago. Después de los primeros 7 días, las tarifas no son reembolsables. Los minutos de doblaje no utilizados no se transfieren entre períodos de facturación.",
      },
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos todas las principales tarjetas de crédito, tarjetas de débito y PayPal a través de nuestro procesador de pagos. Los clientes Enterprise pueden pagar mediante factura y transferencia bancaria.",
      },
    ],
  },
  pt: {
    title: "Preços do DubSync — Planos de Dublagem de Vídeo com IA",
    metaTitle:
      "Preços do DubSync — Planos de Dublagem de Vídeo com IA do Gratuito ao Enterprise",
    metaDescription:
      "Escolha o plano DubSync que atende às suas necessidades. Planos Gratuito, Starter, Pro e Enterprise para dublagem de vídeo com IA, clonagem de voz e sincronização labial.",
    ogDescription:
      "Escolha o plano DubSync ideal. Planos Gratuito, Starter, Pro e Enterprise com sincronização labial incluída.",
    heading:
      "Preços do DubSync — Planos de Dublagem de Vídeo com IA para Cada Criador",
    subheading:
      "Comece gratuitamente com 5 minutos de dublagem por mês. Faça upgrade quando precisar de mais minutos, idiomas e recursos de equipe.",
    faqHeading: "Perguntas Frequentes sobre Preços",
    breadcrumb: "Preços",
    faqs: [
      {
        q: "Posso trocar de plano a qualquer momento?",
        a: "Sim. Você pode fazer upgrade ou downgrade do seu plano a qualquer momento pelo painel de controle. Ao fazer upgrade, você obtém acesso imediato aos novos recursos. Ao fazer downgrade, seu plano atual permanece ativo até o final do período de cobrança.",
      },
      {
        q: "O que acontece se eu exceder os limites do meu plano?",
        a: "Você receberá uma notificação quando atingir 80% dos seus minutos mensais de dublagem. Quando atingir o limite, novos trabalhos de dublagem serão enfileirados até o próximo ciclo de cobrança ou até você fazer upgrade.",
      },
      {
        q: "Existe um teste gratuito para os planos pagos?",
        a: "Oferecemos um plano gratuito com 5 minutos de dublagem por mês para você testar a qualidade. Os planos pagos não têm um teste separado, mas você pode cancelar nos primeiros 7 dias para obter reembolso total.",
      },
      {
        q: "Como funciona a cobrança anual?",
        a: "Os planos anuais são cobrados uma vez por ano com desconto (normalmente 20% de desconto). Você obtém os mesmos recursos do plano mensal, mas paga menos no total. Assinaturas anuais podem ser canceladas a qualquer momento, com acesso até o final do período pago.",
      },
      {
        q: "Vocês oferecem reembolsos?",
        a: "Oferecemos uma política de reembolso de 7 dias para novas assinaturas pagas. Após os primeiros 7 dias, as taxas não são reembolsáveis. Minutos de dublagem não utilizados não são transferidos entre períodos de cobrança.",
      },
      {
        q: "Quais métodos de pagamento vocês aceitam?",
        a: "Aceitamos todos os principais cartões de crédito, cartões de débito e PayPal através do nosso processador de pagamentos. Clientes Enterprise podem pagar via fatura e transferência bancária.",
      },
    ],
  },
  de: {
    title: "DubSync Preise — KI-Videosynchronisation Pläne",
    metaTitle:
      "DubSync Preise — KI-Videosynchronisation Pläne von Kostenlos bis Enterprise",
    metaDescription:
      "Wählen Sie den DubSync-Plan, der zu Ihren Bedürfnissen passt. Kostenlose, Starter-, Pro- und Enterprise-Pläne für KI-Videosynchronisation, Stimmklonen und Lippensynchronisation.",
    ogDescription:
      "Wählen Sie den idealen DubSync-Plan. Kostenlose, Starter-, Pro- und Enterprise-Pläne mit Lippensynchronisation inklusive.",
    heading:
      "DubSync Preise — KI-Videosynchronisation für jeden Creator",
    subheading:
      "Starten Sie kostenlos mit 5 Minuten Synchronisation pro Monat. Upgraden Sie, wenn Sie mehr Minuten, Sprachen und Team-Funktionen benötigen.",
    faqHeading: "Häufig gestellte Fragen zu Preisen",
    breadcrumb: "Preise",
    faqs: [
      {
        q: "Kann ich jederzeit den Plan wechseln?",
        a: "Ja. Sie können Ihren Plan jederzeit über Ihr Dashboard upgraden oder downgraden. Beim Upgrade erhalten Sie sofortigen Zugriff auf die neuen Funktionen. Beim Downgrade bleibt Ihr aktueller Plan bis zum Ende des Abrechnungszeitraums aktiv.",
      },
      {
        q: "Was passiert, wenn ich meine Planlimits überschreite?",
        a: "Sie erhalten eine Benachrichtigung, wenn Sie 80% Ihrer monatlichen Synchronisationsminuten erreichen. Sobald Sie das Limit erreichen, werden neue Synchronisationsaufträge bis zum nächsten Abrechnungszyklus oder bis Sie Ihren Plan upgraden, in die Warteschlange gestellt.",
      },
      {
        q: "Gibt es eine kostenlose Testversion für kostenpflichtige Pläne?",
        a: "Wir bieten einen kostenlosen Plan mit 5 Minuten Synchronisation pro Monat, damit Sie die Qualität testen können. Kostenpflichtige Pläne haben keine separate Testversion, aber Sie können innerhalb der ersten 7 Tage für eine volle Rückerstattung kündigen.",
      },
      {
        q: "Wie funktioniert die jährliche Abrechnung?",
        a: "Jahrespläne werden einmal jährlich zu einem reduzierten Tarif abgerechnet (in der Regel 20% Rabatt). Sie erhalten die gleichen Funktionen wie beim Monatsplan, zahlen aber insgesamt weniger. Jahresabonnements können jederzeit gekündigt werden, wobei der Zugang bis zum Ende des bezahlten Zeitraums bestehen bleibt.",
      },
      {
        q: "Bieten Sie Rückerstattungen an?",
        a: "Wir bieten eine 7-Tage-Rückerstattungsrichtlinie für neue kostenpflichtige Abonnements. Nach den ersten 7 Tagen sind die Gebühren nicht erstattungsfähig. Ungenutzte Synchronisationsminuten werden nicht zwischen Abrechnungszeiträumen übertragen.",
      },
      {
        q: "Welche Zahlungsmethoden akzeptieren Sie?",
        a: "Wir akzeptieren alle gängigen Kredit- und Debitkarten sowie PayPal über unseren Zahlungsabwickler. Enterprise-Kunden können per Rechnung und Banküberweisung bezahlen.",
      },
    ],
  },
  fr: {
    title: "Tarifs DubSync — Plans de Doublage Vidéo par IA",
    metaTitle:
      "Tarifs DubSync — Plans de Doublage Vidéo par IA du Gratuit à Enterprise",
    metaDescription:
      "Choisissez le plan DubSync adapté à vos besoins. Plans Gratuit, Starter, Pro et Enterprise pour le doublage vidéo par IA, le clonage vocal et la synchronisation labiale.",
    ogDescription:
      "Choisissez le plan DubSync idéal. Plans Gratuit, Starter, Pro et Enterprise avec synchronisation labiale incluse.",
    heading:
      "Tarifs DubSync — Plans de Doublage Vidéo par IA pour Chaque Créateur",
    subheading:
      "Commencez gratuitement avec 5 minutes de doublage par mois. Passez à un plan supérieur quand vous avez besoin de plus de minutes, de langues et de fonctionnalités d'équipe.",
    faqHeading: "Questions Fréquentes sur les Tarifs",
    breadcrumb: "Tarifs",
    faqs: [
      {
        q: "Puis-je changer de plan à tout moment ?",
        a: "Oui. Vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre tableau de bord. Lors d'une mise à niveau, vous obtenez un accès immédiat aux nouvelles fonctionnalités. Lors d'un passage à un plan inférieur, votre plan actuel reste actif jusqu'à la fin de la période de facturation.",
      },
      {
        q: "Que se passe-t-il si je dépasse les limites de mon plan ?",
        a: "Vous recevrez une notification lorsque vous atteindrez 80% de vos minutes mensuelles de doublage. Une fois la limite atteinte, les nouveaux travaux de doublage seront mis en file d'attente jusqu'à votre prochain cycle de facturation ou jusqu'à ce que vous passiez à un plan supérieur.",
      },
      {
        q: "Y a-t-il un essai gratuit pour les plans payants ?",
        a: "Nous proposons un plan gratuit avec 5 minutes de doublage par mois pour tester la qualité. Les plans payants n'ont pas d'essai séparé, mais vous pouvez annuler dans les 7 premiers jours pour un remboursement complet.",
      },
      {
        q: "Comment fonctionne la facturation annuelle ?",
        a: "Les plans annuels sont facturés une fois par an à un tarif réduit (généralement 20% de réduction). Vous bénéficiez des mêmes fonctionnalités que le plan mensuel mais payez moins au total. Les abonnements annuels peuvent être annulés à tout moment, l'accès étant maintenu jusqu'à la fin de la période payée.",
      },
      {
        q: "Proposez-vous des remboursements ?",
        a: "Nous proposons une politique de remboursement de 7 jours pour les nouveaux abonnements payants. Après les 7 premiers jours, les frais ne sont pas remboursables. Les minutes de doublage non utilisées ne sont pas reportées entre les périodes de facturation.",
      },
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Nous acceptons toutes les principales cartes de crédit, cartes de débit et PayPal via notre processeur de paiement. Les clients Enterprise peuvent payer par facture et virement bancaire.",
      },
    ],
  },
  ja: {
    title: "DubSync 料金プラン — AI動画吹き替えプラン",
    metaTitle:
      "DubSync 料金プラン — 無料からエンタープライズまでのAI動画吹き替えプラン",
    metaDescription:
      "ニーズに合ったDubSyncプランをお選びください。AI動画吹き替え、音声クローン、リップシンクのための無料、スターター、プロ、エンタープライズプラン。",
    ogDescription:
      "最適なDubSyncプランをお選びください。すべてのプランにリップシンクが含まれています。",
    heading:
      "DubSync 料金プラン — すべてのクリエイターのためのAI動画吹き替えプラン",
    subheading:
      "月5分の吹き替えから無料で始められます。より多くの分数、言語、チーム機能が必要になったらアップグレードしてください。",
    faqHeading: "料金に関するよくある質問",
    breadcrumb: "料金プラン",
    faqs: [
      {
        q: "いつでもプランを変更できますか？",
        a: "はい。ダッシュボードからいつでもプランのアップグレードまたはダウングレードが可能です。アップグレード時は新機能にすぐにアクセスできます。ダウングレード時は、請求期間の終了まで現在のプランが有効です。",
      },
      {
        q: "プランの制限を超えた場合はどうなりますか？",
        a: "月間吹き替え分数の80%に達すると通知が届きます。上限に達すると、新しい吹き替えジョブは次の請求サイクルまたはプランのアップグレードまでキューに入れられます。",
      },
      {
        q: "有料プランの無料トライアルはありますか？",
        a: "品質をテストできるよう、月5分の吹き替えが可能な無料プランを提供しています。有料プランには別途トライアルはありませんが、最初の7日以内にキャンセルすれば全額返金されます。",
      },
      {
        q: "年間請求はどのように機能しますか？",
        a: "年間プランは割引料金で年1回請求されます（通常20%オフ）。月間プランと同じ機能を利用でき、合計で支払額が少なくなります。年間サブスクリプションはいつでもキャンセルでき、支払済み期間の終了までアクセスが継続します。",
      },
      {
        q: "返金はありますか？",
        a: "新規有料サブスクリプションに対して7日間の返金ポリシーを提供しています。最初の7日間を過ぎると、料金は返金不可となります。未使用の吹き替え分数は請求期間間で繰り越されません。",
      },
      {
        q: "どのような支払い方法に対応していますか？",
        a: "決済プロセッサーを通じて、主要なクレジットカード、デビットカード、PayPalに対応しています。エンタープライズのお客様は請求書および銀行振込でのお支払いが可能です。",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return LOCALES.filter((l) => l !== "en").map((lang) => ({ lang }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") return {};

  const loc = t[lang as Exclude<Locale, "en">];
  if (!loc) return {};

  const langAlternates: Record<string, string> = {};
  for (const l of LOCALES) {
    langAlternates[l] =
      l === "en"
        ? "https://dubsync.app/pricing"
        : `https://dubsync.app/${l}/pricing`;
  }
  langAlternates["x-default"] = "https://dubsync.app/pricing";

  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: {
      canonical: `https://dubsync.app/${lang}/pricing`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: loc.metaTitle,
      description: loc.ogDescription,
      url: `https://dubsync.app/${lang}/pricing`,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: loc.title,
      description: loc.ogDescription,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function LocalizedPricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();

  const loc = t[lang as Exclude<Locale, "en">];
  if (!loc) notFound();

  return (
    <>
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{loc.heading}</h1>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            {loc.subheading}
          </p>
        </div>

        <PricingNew />

        {/* Pricing FAQ */}
        <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">
            {loc.faqHeading}
          </h2>
          <div className="space-y-6">
            {loc.faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BreadcrumbSchema
        items={[
          {
            name: loc.breadcrumb,
            url: `https://dubsync.app/${lang}/pricing`,
          },
        ]}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loc.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </>
  );
}
