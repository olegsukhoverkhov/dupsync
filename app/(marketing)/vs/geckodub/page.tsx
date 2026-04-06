import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "DubSync vs GeckoDub (2026) — 20 Lip Sync Min vs 7 for Similar Price",
  description:
    "GeckoDub splits video and lip sync into separate pools (only 7 min lip sync on Starter). DubSync includes lip sync in all 20 minutes. Compare plans.",
  alternates: {
    canonical: "https://dubsync.app/vs/geckodub",
  },
  openGraph: {
    type: "website",
    title: "DubSync vs GeckoDub (2026) — 20 Lip Sync Min vs 7 for Similar Price",
    description:
      "GeckoDub splits video and lip sync into separate pools (only 7 min lip sync on Starter). DubSync includes lip sync in all 20 minutes.",
    url: "https://dubsync.app/vs/geckodub",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync vs GeckoDub (2026) — 20 Lip Sync Min vs 7 for Similar Price",
    description:
      "GeckoDub splits video and lip sync into separate pools. DubSync includes lip sync in every minute.",
  },
};

const LIP_SYNC_ROWS = [
  {
    feature: "Starter plan lip sync minutes",
    dubsync: "20 min (all with lip sync)",
    dubsyncPositive: true,
    competitor: "7 min (from 20 min total)",
    competitorNegative: true,
  },
  {
    feature: "Lip sync credit model",
    dubsync: "Unified pool",
    dubsyncPositive: true,
    competitor: "Separate pools",
    competitorNegative: true,
  },
  {
    feature: "Starter plan price",
    dubsync: "$19.99/mo",
    dubsyncPositive: false,
    competitor: "\u20AC12/mo",
    competitorNegative: false,
  },
  {
    feature: "Extra lip sync min for ~$8 more",
    dubsync: "+13 lip sync minutes",
    dubsyncPositive: true,
    competitor: "n/a",
    competitorNegative: false,
  },
];

const FEATURE_ROWS = [
  { feature: "Voice cloning", dubsync: true, competitor: true },
  { feature: "Lip sync in every minute", dubsync: true, competitor: false },
  { feature: "Multi-speaker detection", dubsync: true, competitor: true },
  { feature: "Script editing", dubsync: true, competitor: true },
  { feature: "API access", dubsync: true, competitor: false },
  { feature: "4K output", dubsync: true, competitor: false },
  { feature: "Batch processing", dubsync: true, competitor: true },
  { feature: "Glossary / term lock", dubsync: true, competitor: false },
  { feature: "Background audio preserve", dubsync: true, competitor: true },
  { feature: "Free plan", dubsync: true, competitor: false },
];

const FAQS = [
  {
    q: "Why does GeckoDub split lip sync into a separate pool?",
    a: "GeckoDub separates video dubbing minutes from lip sync minutes. On the Starter plan (\u20AC12/mo), you get 20 minutes of dubbed video but only 7 of those can have lip sync. The remaining 13 minutes are audio-only dubbing. DubSync includes lip sync on every minute by default.",
  },
  {
    q: "Is GeckoDub cheaper than DubSync?",
    a: "GeckoDub Starter is \u20AC12/mo vs DubSync Starter at $19.99/mo. However, GeckoDub only gives 7 lip sync minutes while DubSync gives 20. For roughly $8 more per month, you get 13 additional lip sync minutes with DubSync, plus API access, 4K output, and a free plan to test first.",
  },
  {
    q: "Does GeckoDub have API access?",
    a: "No. As of 2026, GeckoDub does not offer API access at any pricing tier. If you need programmatic dubbing for integration into your workflow, CMS, or application, DubSync provides API access on all paid plans.",
  },
];

function FeatureIcon({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-400" />
  ) : (
    <X className="h-4 w-4 text-red-400/60" />
  );
}

export default function VsGeckoDubPage() {
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
            DubSync vs GeckoDub
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            GeckoDub splits video and lip sync into separate pools.
            DubSync includes lip sync in every minute.
          </p>
        </section>

        {/* Quick Verdict */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick verdict</h2>
            <p className="text-slate-400 leading-relaxed">
              GeckoDub&apos;s Starter plan ({"\u20AC"}12/mo) gives you 20 min of video dubbing
              but only 7 with lip sync. DubSync Starter ($19.99/mo) gives you 20 min
              where ALL of them include lip sync. For roughly $8 more per month, you
              get 13 additional lip sync minutes, plus API access, 4K output, and a
              free plan to test quality first.
            </p>
          </div>
        </section>

        {/* Lip Sync Pool Comparison */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Lip sync pool comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Lip sync pool comparison between DubSync and GeckoDub
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 text-slate-400 font-medium">Metric</th>
                  <th scope="col" className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">GeckoDub</th>
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
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm text-green-300/80">
              <strong>Bottom line:</strong> For ~$8 more per month ($19.99 vs {"\u20AC"}12),
              DubSync gives you 13 additional lip sync minutes (20 vs 7), API access,
              4K output, and a free plan to test before paying.
            </p>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Pricing comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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

            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                <a href="https://www.geckodub.com/pricing" rel="nofollow noopener" target="_blank" className="hover:underline">
                  GeckoDub
                </a>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Starter</span>
                  <span className="text-white font-medium">{"\u20AC"}12/mo — 20 min + 7 min lip sync</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Creator Pro</span>
                  <span className="text-white font-medium">{"\u20AC"}23/mo — 40 min + 15 min lip sync</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Scale</span>
                  <span className="text-white font-medium">{"\u20AC"}71/mo — Custom</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                No free plan. Lip sync minutes are separate from dubbing minutes.
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
                Feature comparison between DubSync and GeckoDub
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th scope="col" className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">GeckoDub</th>
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
                  <td className="p-4 text-center text-slate-300">20+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th scope="row" className="p-4 text-slate-300 font-normal text-left">Lip sync cost per minute</th>
                  <td className="p-4 bg-pink-500/10 text-center text-green-400 font-medium">$1.00 (included)</td>
                  <td className="p-4 text-center text-red-400 font-medium">{"\u20AC"}1.53 (separate pool)</td>
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
                Where GeckoDub wins
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Lower entry price ({"\u20AC"}12 vs $19.99 for 20 min dubbing)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Euro-based pricing for European customers</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Good value if you do not need lip sync on every video</span>
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
                  <span>Lip sync included on every minute (no separate pool)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>API access for workflow integration</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>4K video output support</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Free plan available to test before committing</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>30+ languages vs GeckoDub&apos;s 20+</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">
            Switching from GeckoDub to DubSync
          </h2>
          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <ol className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">1</span>
                <span>Download your original source videos from your local storage or cloud. DubSync supports MP4, MOV, AVI, WebM, and MKV.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">2</span>
                <span><Link href="/login" className="text-pink-400 hover:underline">Sign up for DubSync</Link> (free) and test with your first video to compare quality.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">3</span>
                <span>Select your languages and let DubSync handle transcription, translation, voice cloning, and lip sync in one step. Every minute includes lip sync.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">4</span>
                <span>Upgrade to a paid plan when ready. Cancel your GeckoDub subscription at the end of your current billing cycle.</span>
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
            <Link href="/vs/rask-ai" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              DubSync vs Rask AI
            </Link>
            <Link href="/vs/heygen" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              DubSync vs HeyGen
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
              Get lip sync on every minute with DubSync
            </h2>
            <p className="mt-3 text-slate-400">
              No separate lip sync pool. No hidden costs. Start free.
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
          { name: "DubSync vs GeckoDub", url: "https://dubsync.app/vs/geckodub" },
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
