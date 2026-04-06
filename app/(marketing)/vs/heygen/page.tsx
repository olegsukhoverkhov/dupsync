import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "DubSync vs HeyGen — AI Dubbing Comparison 2026",
  description:
    "Compare DubSync and HeyGen for AI video dubbing. Pricing, lip sync, credit systems, and feature differences explained for 2026.",
  alternates: {
    canonical: "https://dubsync.app/vs/heygen",
  },
  openGraph: {
    type: "website",
    title: "DubSync vs HeyGen — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and HeyGen for AI video dubbing. Pricing, lip sync, credits, and features.",
    url: "https://dubsync.app/vs/heygen",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync vs HeyGen — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and HeyGen for AI video dubbing. Pricing, lip sync, and features compared.",
  },
};

const FEATURES = [
  { feature: "Voice cloning", dubsync: true, competitor: true },
  { feature: "Lip sync included", dubsync: true, competitor: true },
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
    q: "How does HeyGen pricing compare to DubSync?",
    a: "HeyGen uses a credit-based system where 1 credit roughly equals 1 minute for basic dubbing. The Creator plan is $29/month for 200 credits (~40 min). DubSync uses a simpler model: 1 credit = 1 minute, with the Starter plan at $19.99/month for 20 minutes. DubSync is more predictable since you always know exactly how many minutes you get.",
  },
  {
    q: "Does HeyGen have better features than DubSync?",
    a: "HeyGen excels at AI avatar generation and video creation from scratch, making it more of a video creation platform. DubSync is focused specifically on dubbing existing videos with lip sync. If you need to create AI avatar videos, HeyGen is the better choice. If you need to dub your own footage, DubSync offers better value and a more streamlined workflow.",
  },
  {
    q: "Which platform has better lip sync?",
    a: "Both DubSync and HeyGen include lip sync as a standard feature on paid plans. HeyGen has a slight edge for avatar-based content since it generates the entire face. DubSync specializes in lip-syncing real footage of real people, which is the more common use case for creators dubbing their own videos.",
  },
  {
    q: "Can I migrate from HeyGen to DubSync?",
    a: "Yes. Download your original source videos and upload them to DubSync. Both platforms work with standard video formats. DubSync does not import HeyGen-specific projects or avatars, but your original footage works seamlessly.",
  },
];

function FeatureIcon({ value }: { value: boolean }) {
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
            HeyGen is a powerful AI video platform with avatar creation and
            dubbing. DubSync is purpose-built for dubbing existing videos.
            Here is how they compare for video dubbing specifically.
          </p>
        </section>

        {/* Quick Verdict */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick verdict</h2>
            <p className="text-slate-400 leading-relaxed">
              If you need to dub your own videos with lip sync, DubSync offers
              simpler pricing and a more focused workflow. If you need AI avatars,
              video creation from scratch, or a broader video production toolkit,
              HeyGen is the more versatile platform. For pure dubbing value,
              DubSync&apos;s transparent per-minute pricing makes budgeting easier.
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
              <h3 className="text-lg font-bold text-white mb-4">HeyGen</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Free</span>
                  <span className="text-white font-medium">$0 — 3 videos (watermark)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Creator</span>
                  <span className="text-white font-medium">$29/mo — 200 credits (~40 min)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Pro</span>
                  <span className="text-white font-medium">$99/mo — 2000 credits (~200 min)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Business</span>
                  <span className="text-white font-medium">$149 + $20/seat</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Credit-based pricing. Credits vary by feature used.
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
                  <th className="p-4 text-slate-400 font-medium">HeyGen</th>
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
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Lower entry price for basic dubbing ($29 vs $19.99 but more minutes)</span>
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
                  <span>Transparent pricing: 1 credit = 1 minute, no guesswork</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Purpose-built for dubbing existing videos with a streamlined UX</span>
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
                <span><Link href="/signup" className="text-pink-400 hover:underline">Sign up for DubSync</Link> and test with a free video to compare quality.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">3</span>
                <span>Select your languages and dubbing settings. DubSync&apos;s interface is optimized for fast dubbing workflows.</span>
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

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl font-bold text-white">
              Try DubSync for your next dubbing project
            </h2>
            <p className="mt-3 text-slate-400">
              Purpose-built for video dubbing with transparent pricing. Start free.
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
