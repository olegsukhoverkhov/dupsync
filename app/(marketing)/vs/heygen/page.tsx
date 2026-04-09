import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";

export const metadata: Metadata = {
  title: "DubSync vs HeyGen — Lip Sync Included vs Shared",
  description:
    "HeyGen shares lip sync credits with avatars and generation. DubSync gives dedicated lip sync in every credit. Compare for video dubbing in 2026.",
  alternates: {
    canonical: "https://dubsync.app/vs/heygen",
    languages: getPlatformHreflang("/vs/heygen"),
  },
  openGraph: {
    type: "website",
    title: "DubSync vs HeyGen — Lip Sync Included vs Shared",
    description:
      "HeyGen shares lip sync credits with avatars and generation. DubSync gives dedicated lip sync in every credit.",
    url: "https://dubsync.app/vs/heygen",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync vs HeyGen — Lip Sync Included vs Shared",
    description:
      "HeyGen shares lip sync credits with avatars and generation. DubSync gives dedicated lip sync in every credit.",
  },
};

const FEATURE_ROWS = [
  { feature: "Voice cloning", dubsync: true, competitor: true },
  { feature: "AI Subtitles (burned-in + SRT)", dubsync: true, competitor: "partial" as const },
  { feature: "Dedicated lip sync credits", dubsync: true, competitor: false },
  { feature: "Multi-speaker detection", dubsync: true, competitor: true },
  { feature: "Script editing", dubsync: true, competitor: true },
  { feature: "API access", dubsync: true, competitor: true },
  { feature: "4K output", dubsync: true, competitor: true },
  { feature: "AI avatar generation", dubsync: false, competitor: true },
  { feature: "Glossary / term lock", dubsync: true, competitor: false },
  { feature: "Background audio preserve", dubsync: true, competitor: true },
  { feature: "Transparent per-minute pricing", dubsync: true, competitor: false },
];

const FAQS = [
  {
    q: "Does HeyGen share lip sync credits with other features?",
    a: "Yes. HeyGen uses a shared credit pool across all features including avatar generation, video creation, and lip sync dubbing. If you use 100 credits on a 5-minute Avatar IV video, those credits are gone from your lip sync budget. DubSync dedicates all your credits to lip sync dubbing with no sharing.",
  },
  {
    q: "How many lip sync minutes do you actually get on HeyGen?",
    a: "It depends on how you use your other credits. HeyGen Creator gives 200 Premium Credits, but a 5-min Avatar IV video costs 100 credits, leaving only 100 for lip sync (~20 min). DubSync Starter gives you a guaranteed 20 lip sync minutes at $19.99/mo with no sharing.",
  },
  {
    q: "Is DubSync better than HeyGen for video dubbing?",
    a: "For dedicated video dubbing with lip sync, yes. DubSync is purpose-built for dubbing existing videos, so every credit goes toward lip sync. HeyGen is a broader video platform that splits credits across avatars, generation, and dubbing. If you only need dubbing, DubSync gives more predictable value.",
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

export default function VsHeyGenPage() {
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
            DubSync vs HeyGen
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            HeyGen shares lip sync credits with avatars and generation.
            DubSync gives you dedicated lip sync in every credit.
          </p>
        </section>

        {/* Quick Verdict */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick verdict</h2>
            <p className="text-slate-400 leading-relaxed">
              If you need to dub your own videos with lip sync, DubSync offers
              dedicated credits and a more focused workflow. HeyGen&apos;s shared credit
              pool means your lip sync budget shrinks every time you use avatars or
              other features. For pure dubbing value, DubSync&apos;s transparent
              per-minute pricing gives you guaranteed lip sync capacity.
            </p>
          </div>
        </section>

        {/* Shared Pool Calculation */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            The shared credit pool problem
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">HeyGen Creator ($29/mo)</h3>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Total credits</span>
                  <span className="text-white font-medium">200 Premium Credits</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>5-min Avatar IV video</span>
                  <span className="font-medium">-100 credits</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span>Remaining for lip sync</span>
                  <span className="text-yellow-400 font-medium">100 credits (~20 min)</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-bold text-pink-400 mb-4">DubSync Starter ($19.99/mo)</h3>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Total minutes</span>
                  <span className="text-white font-medium">20 min</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>No credit sharing</span>
                  <span className="font-medium">0 min deducted</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span>Available for lip sync</span>
                  <span className="text-green-400 font-medium">20 min (all of them)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-sm text-yellow-300/80">
              <strong>Result:</strong> Same lip sync capacity (20 min), but DubSync costs
              $19.99 vs HeyGen&apos;s $29 — and with HeyGen, one avatar video can wipe
              out half your dubbing budget.
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
                1 credit = 1 minute. Lip sync included on all plans. No sharing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                <a href="https://www.heygen.com/pricing" rel="nofollow noopener" target="_blank" className="hover:underline">
                  HeyGen
                </a>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Free</span>
                  <span className="text-white font-medium">$0 — 3 videos (watermark)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Creator</span>
                  <span className="text-white font-medium">$29/mo — 200 credits (shared)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Pro</span>
                  <span className="text-white font-medium">$99/mo — 2000 credits (shared)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Business</span>
                  <span className="text-white font-medium">$149 + $20/seat</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Credits shared across avatars, video creation, and dubbing.
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
                Feature comparison between DubSync and HeyGen
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th scope="col" className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th scope="col" className="p-4 text-slate-400 font-medium">HeyGen</th>
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
                  <td className="p-4 text-center text-slate-300">40+</td>
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
                Where HeyGen wins
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>AI avatar generation and video creation from scratch</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>40+ languages vs DubSync&apos;s 30+</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Broader video production toolkit beyond dubbing</span>
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
                  <span>Dedicated lip sync credits — no sharing with other features</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Transparent pricing: 1 credit = 1 minute, no guesswork</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Purpose-built for dubbing existing videos</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Glossary and term lock for consistent brand terminology</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>No per-seat fees on Business plan</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">
            Switching from HeyGen to DubSync
          </h2>
          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <ol className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">1</span>
                <span>Download your original source videos. DubSync works with MP4, MOV, AVI, WebM, and MKV.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">2</span>
                <span><Link href="/login" className="text-pink-400 hover:underline">Sign up for DubSync</Link> and test with a free video to compare quality.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">3</span>
                <span>Select your languages and let DubSync handle the full pipeline. Every credit goes to lip sync — no sharing.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">4</span>
                <span>Upgrade when ready. Note: HeyGen avatars and templates cannot be migrated, but your video footage transfers easily.</span>
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
            <Link href="/vs/geckodub" className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
              DubSync vs GeckoDub
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
              Dedicated lip sync credits. No sharing.
            </h2>
            <p className="mt-3 text-slate-400">
              Every DubSync credit goes to lip sync dubbing. Start free.
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
          { name: "DubSync vs HeyGen", url: "https://dubsync.app/vs/heygen" },
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
