import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { PricingNew } from "@/components/landing/pricing-new";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "DubSync Pricing — AI Video Dubbing Plans from Free to Enterprise",
  description:
    "Choose the DubSync plan that fits your needs. Free, Starter, Pro, and Enterprise plans for AI video dubbing, voice cloning, and lip sync.",
};

const PRICING_FAQS = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time from your dashboard. When upgrading, you get immediate access to the new plan features. When downgrading, your current plan remains active until the end of the billing period.",
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "You will receive a notification when you reach 80% of your monthly dubbing minutes. Once you hit the limit, new dubbing jobs will be queued until your next billing cycle or until you upgrade your plan.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "We offer a free plan with 5 minutes of dubbing per month so you can test the quality. Paid plans do not have a separate trial, but you can cancel within the first 7 days for a full refund.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual plans are billed once per year at a discounted rate (typically 20% off). You get the same features as the monthly plan but pay less overall. Annual subscriptions can be canceled at any time, with access continuing until the end of the paid period.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day refund policy for new paid subscriptions. After the first 7 days, fees are non-refundable. Unused dubbing minutes do not carry over between billing periods.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, debit cards, and PayPal through our payment processor. Enterprise customers can pay via invoice and bank transfer.",
  },
];

export default function PricingPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-8">
          <h1 className="text-4xl font-bold">
            DubSync Pricing — AI Video Dubbing Plans for Every Creator
          </h1>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            Start for free with 5 minutes of dubbing per month. Upgrade when
            you need more minutes, languages, and team features.
          </p>
        </div>

        <PricingNew />

        {/* Pricing FAQ */}
        <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Pricing FAQ
          </h2>
          <div className="space-y-6">
            {PRICING_FAQS.map((faq) => (
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
      <Footer />
      <BreadcrumbSchema items={[{ name: "Pricing", url: "https://dubsync.app/pricing" }]} />
    </div>
  );
}
