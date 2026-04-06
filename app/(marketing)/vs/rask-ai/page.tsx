import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "DubSync vs Rask AI — AI Dubbing Comparison 2026",
  description:
    "Compare DubSync and Rask AI side by side. Pricing, lip sync, voice cloning, and feature differences for AI video dubbing in 2026.",
  alternates: {
    canonical: "https://dubsync.app/vs/rask-ai",
  },
  openGraph: {
    type: "website",
    title: "DubSync vs Rask AI — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and Rask AI side by side. Pricing, lip sync, voice cloning, and features.",
    url: "https://dubsync.app/vs/rask-ai",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync vs Rask AI — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and Rask AI for AI video dubbing. Pricing, lip sync, and features compared.",
  },
};

const FEATURES = [
  { feature: "Voice cloning", dubsync: true, competitor: true },
  { feature: "Lip sync included", dubsync: true, competitor: false },
  { feature: "Multi-speaker detection", dubsync: true, competitor: true },
  { feature: "Script editing", dubsync: true, competitor: true },
  { feature: "API access", dubsync: true, competitor: true },
  { feature: "4K output", dubsync: true, competitor: true },
  { feature: "Batch processing", dubsync: true, competitor: true },
  { feature: "Glossary / term lock", dubsync: true, competitor: true },
  { feature: "Background audio preserve", dubsync: true, competitor: true },
  { feature: "Free plan", dubsync: true, competitor: false },
];

const FAQS = [
  {
    q: "Is DubSync cheaper than Rask AI?",
    a: "Yes. DubSync's Pro plan is $49.99/month for 50 minutes with lip sync included. Rask AI's Creator plan is $50/month for 25 minutes without lip sync. For lip sync on Rask AI, you need the Creator Pro plan at $120/month, and lip sync uses 2x credits, giving you effectively 50 minutes of lip-synced content for $120 versus $49.99 with DubSync.",
  },
  {
    q: "Does Rask AI have better language support?",
    a: "Rask AI supports 130+ languages compared to DubSync's 30+. If you need rare languages, Rask AI has an advantage. However, DubSync covers all major global markets including Spanish, French, German, Japanese, Korean, Chinese, Hindi, Arabic, Portuguese, and more.",
  },
  {
    q: "Which has better lip sync quality?",
    a: "Both platforms offer AI lip sync, but DubSync includes it on every paid plan at no extra cost. With Rask AI, lip sync requires the Creator Pro plan ($120/month) and uses 2x credits, effectively halving your available minutes.",
  },
  {
    q: "Can I switch from Rask AI to DubSync?",
    a: "Yes. DubSync accepts the same video formats as Rask AI (MP4, MOV, AVI, WebM, MKV). Simply upload your original source videos to DubSync and start dubbing. There is no proprietary lock-in with either platform since you always retain your original video files.",
  },
];

function FeatureIcon({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-400" />
  ) : (
    <X className="h-4 w-4 text-red-400/60" />
  );
}

export default function VsRaskAiPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-16">
          <span className="inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400 mb-6">
            Comparison
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            DubSync vs Rask AI
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Both platforms offer AI video dubbing with voice cloning, but they
            differ significantly on pricing, lip sync inclusion, and value per
            minute. Here is the full breakdown.
          </p>
        </section>

        {/* Quick Verdict */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick verdict</h2>
            <p className="text-slate-400 leading-relaxed">
              DubSync is the better choice for creators who need lip-synced dubbing at an
              affordable price. At $49.99/month for 50 minutes with lip sync included,
              DubSync costs less than half of what Rask AI charges for the same capability.
              Choose Rask AI if you need support for rare languages beyond DubSync&apos;s 30+.
            </p>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Pricing comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* DubSync */}
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-bold text-pink-400 mb-4">DubSync</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Free</span>
                  <span className="text-white font-medium">$0 — 1 video (15s)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Starter</span>
                  <span className="text-white font-medium">$19.99/mo — 20 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Pro</span>
                  <span className="text-white font-medium">$49.99/mo — 50 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Business</span>
                  <span className="text-white font-medium">$149.99/mo — 150 min</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                1 credit = 1 minute. Lip sync included on all plans.
              </p>
            </div>

            {/* Rask AI */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Rask AI</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Creator</span>
                  <span className="text-white font-medium">$50/mo — 25 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Creator Pro</span>
                  <span className="text-white font-medium">$120/mo — 100 min (50 lip sync)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Business</span>
                  <span className="text-white font-medium">$600/mo — Custom</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                No free plan. Lip sync uses 2x credits on Creator Pro.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Feature comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th className="p-4 text-slate-400 font-medium">Rask AI</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f) => (
                  <tr key={f.feature} className="border-b border-white/5">
                    <td className="p-4 text-slate-300">{f.feature}</td>
                    <td className="p-4 bg-pink-500/10 text-center">
                      <FeatureIcon value={f.dubsync} />
                    </td>
                    <td className="p-4 text-center">
                      <FeatureIcon value={f.competitor} />
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-white/5">
                  <td className="p-4 text-slate-300">Languages</td>
                  <td className="p-4 bg-pink-500/10 text-center text-slate-300">30+</td>
                  <td className="p-4 text-center text-slate-300">130+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-slate-300">Cost per minute (with lip sync)</td>
                  <td className="p-4 bg-pink-500/10 text-center text-green-400 font-medium">$1.00</td>
                  <td className="p-4 text-center text-slate-300">$2.40</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Where each wins */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Where Rask AI wins
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>130+ languages vs DubSync&apos;s 30+</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>More established brand with longer track record</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Advanced SRT/subtitle export features</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Where DubSync wins
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Lip sync included on every plan (no 2x credit penalty)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>60% cheaper: $49.99 for 50 lip-synced min vs $120 for 50</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Free plan available to test before committing</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Simpler pricing: 1 credit = 1 minute, no multipliers</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">
            Switching from Rask AI to DubSync
          </h2>
          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <ol className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">1</span>
                <span>Export or download your original source videos from your local storage. DubSync works with MP4, MOV, AVI, WebM, and MKV formats.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">2</span>
                <span><Link href="/signup" className="text-pink-400 hover:underline">Create a free DubSync account</Link> and upload your first video to test the quality.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">3</span>
                <span>Choose your target languages, review the AI-generated script if needed, and start dubbing with lip sync included.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">4</span>
                <span>Once satisfied with the quality, upgrade to a paid plan. Cancel your Rask AI subscription at the end of your billing period.</span>
              </li>
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl font-bold text-white">
              Ready to switch to DubSync?
            </h2>
            <p className="mt-3 text-slate-400">
              Get lip-synced dubbing at half the cost. Start free, no credit card required.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 gradient-button rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Try DubSync Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                See Full Comparison
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <BreadcrumbSchema
        items={[
          { name: "Compare", url: "https://dubsync.app/compare" },
          { name: "DubSync vs Rask AI", url: "https://dubsync.app/vs/rask-ai" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
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
    </div>
  );
}
