import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";

export const metadata: Metadata = {
  title: "DubSync vs Rask AI (2026) — Lip Sync from $19.99 vs $120/mo",
  description:
    "Rask AI charges $120/mo for lip sync and doubles credit usage. DubSync includes lip sync in every credit from $19.99. Compare features, pricing, and real costs.",
  alternates: {
    canonical: "https://dubsync.app/vs/rask-ai",
    languages: getPlatformHreflang("/vs/rask-ai"),
  },
  openGraph: {
    type: "website",
    title: "DubSync vs Rask AI (2026) — Lip Sync from $19.99 vs $120/mo",
    description:
      "Rask AI charges $120/mo for lip sync and doubles credit usage. DubSync includes lip sync in every credit from $19.99.",
    url: "https://dubsync.app/vs/rask-ai",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync vs Rask AI (2026) — Lip Sync from $19.99 vs $120/mo",
    description:
      "Rask AI charges $120/mo for lip sync and doubles credit usage. DubSync includes lip sync in every credit from $19.99.",
  },
};

const LIP_SYNC_ROWS = [
  {
    feature: "Lip sync minutes (starter equivalent)",
    dubsync: "20",
    dubsyncPositive: true,
    competitor: "\u2717 (requires $120 plan)",
    competitorNegative: true,
  },
  {
    feature: "Lip sync credit cost",
    dubsync: "1x (no multiplier)",
    dubsyncPositive: true,
    competitor: "2x",
    competitorNegative: true,
  },
  {
    feature: "Effective lip sync capacity (Pro plan)",
    dubsync: "50 min",
    dubsyncPositive: true,
    competitor: "~50 min (from 100, halved)",
    competitorNegative: false,
  },
  {
    feature: "10-min video \u00d7 3 langs lip sync credits",
    dubsync: "30",
    dubsyncPositive: true,
    competitor: "60",
    competitorNegative: true,
  },
  {
    feature: "Price for lip sync access",
    dubsync: "$19.99/mo",
    dubsyncPositive: true,
    competitor: "$120/mo",
    competitorNegative: true,
  },
];

const FEATURE_ROWS = [
  { feature: "Voice cloning", dubsync: true, competitor: true },
  { feature: "AI Subtitles (burned-in + SRT)", dubsync: true, competitor: "partial" as const },
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
    q: "Is DubSync cheaper than Rask AI for lip sync?",
    a: "Yes. DubSync includes lip sync from $19.99/mo. Rask AI requires Creator Pro at $120/mo and doubles credit consumption, so you pay 6x more for a comparable amount of lip-synced content.",
  },
  {
    q: "Does Rask AI include lip sync on all plans?",
    a: "No. Rask AI\u2019s Creator plan ($50/mo) does not include lip sync. Lip sync requires the Creator Pro plan at $120/mo, where it doubles your credit usage effectively halving your available minutes.",
  },
  {
    q: "How many lip sync minutes do you get on Rask AI vs DubSync?",
    a: "DubSync Starter ($19.99/mo) gives 20 lip sync minutes. Rask AI Creator Pro ($120/mo) gives ~50 effective lip sync minutes after the 2x credit penalty. That is roughly 6x the price for 2.5x the minutes.",
  },
];

function FeatureIcon({ value }: { value: boolean | "partial" }) {
  if (value === "partial") {
    return <span className="text-[10px] font-medium text-yellow-400">Partial</span>;
  }
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
            Rask AI charges $120/mo for lip sync and doubles your credits.
            DubSync includes lip sync in every credit from $19.99.
          </p>
        </section>

        {/* Quick Verdict */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick verdict</h2>
            <p className="text-slate-400 leading-relaxed">
              DubSync is the better choice for creators who need lip-synced dubbing at an
              affordable price. At $19.99/month for 20 minutes with lip sync included,
              DubSync costs a fraction of what Rask AI charges for the same capability.
              Rask AI requires the $120/mo Creator Pro plan for lip sync and doubles your
              credit consumption. Choose Rask AI only if you need support for rare languages
              beyond DubSync&apos;s 30+.
            </p>
          </div>
        </section>

        {/* Lip Sync Comparison Table */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Lip sync comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Lip sync feature comparison between DubSync and Rask AI
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th scope="col" className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">Rask AI</th>
                </tr>
              </thead>
              <tbody>
                {LIP_SYNC_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-white/5">
                    <th scope="row" className="p-4 text-slate-300 font-normal text-left">{row.feature}</th>
                    <td className={`p-4 bg-pink-500/10 text-center font-medium ${row.dubsyncPositive ? "text-green-400" : "text-slate-300"}`}>
                      {row.dubsync}
                    </td>
                    <td className={`p-4 text-center font-medium ${row.competitorNegative ? "text-red-400" : "text-yellow-400"}`}>
                      {row.competitor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <h3 className="text-lg font-bold text-white mb-4">
                <a href="https://www.rask.ai/pricing" rel="nofollow noopener" target="_blank" className="hover:underline">
                  Rask AI
                </a>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Creator</span>
                  <span className="text-white font-medium">$50/mo — 25 min (no lip sync)</span>
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
                No free plan. Lip sync uses 2x credits on Creator Pro only.
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
              <caption className="sr-only">
                Feature comparison between DubSync and Rask AI
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th scope="col" className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">Rask AI</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((f) => (
                  <tr key={f.feature} className="border-b border-white/5">
                    <th scope="row" className="p-4 text-slate-300 font-normal text-left">{f.feature}</th>
                    <td className="p-4 bg-pink-500/10 text-center">
                      <FeatureIcon value={f.dubsync} />
                    </td>
                    <td className="p-4 text-center">
                      <FeatureIcon value={f.competitor} />
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-white/5">
                  <th scope="row" className="p-4 text-slate-300 font-normal text-left">Languages</th>
                  <td className="p-4 bg-pink-500/10 text-center text-slate-300">30+</td>
                  <td className="p-4 text-center text-slate-300">130+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="p-4 text-slate-300 font-normal text-left">Cost per minute (with lip sync)</th>
                  <td className="p-4 bg-pink-500/10 text-center text-green-400 font-medium">$1.00</td>
                  <td className="p-4 text-center text-red-400 font-medium">$2.40</td>
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
                  <span>Lip sync from $19.99/mo vs $120/mo on Rask AI</span>
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
                <span><Link href="/login" className="text-pink-400 hover:underline">Create a free DubSync account</Link> and upload your first video to test the quality.</span>
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

        {/* Internal Links */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-16">
          <h2 className="text-lg font-semibold text-white mb-4">Related comparisons</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/compare" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              All Comparisons
            </Link>
            <Link href="/vs/heygen" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              DubSync vs HeyGen
            </Link>
            <Link href="/vs/elevenlabs" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              DubSync vs ElevenLabs
            </Link>
            <Link href="/#pricing" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              DubSync Pricing
            </Link>
            <Link href="/blog/ai-dubbing-pricing-comparison-2026" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              2026 Pricing Guide
            </Link>
            <Link href="/login" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              Log In
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl font-bold text-white">
              Ready to switch to DubSync?
            </h2>
            <p className="mt-3 text-slate-400">
              Get lip-synced dubbing from $19.99/mo. Start free, no credit card required.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
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
