import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "DubSync vs GeckoDub — AI Dubbing Comparison 2026",
  description:
    "Compare DubSync and GeckoDub for AI video dubbing. Pricing, lip sync, API access, and features compared side by side for 2026.",
  alternates: {
    canonical: "https://dubsync.app/vs/geckodub",
  },
  openGraph: {
    type: "website",
    title: "DubSync vs GeckoDub — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and GeckoDub for AI video dubbing. Pricing, lip sync, and feature differences.",
    url: "https://dubsync.app/vs/geckodub",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync vs GeckoDub — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and GeckoDub for AI video dubbing. Pricing, lip sync, and features compared.",
  },
};

const FEATURES = [
  { feature: "Voice cloning", dubsync: true, competitor: true },
  { feature: "Lip sync included", dubsync: true, competitor: false },
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
    q: "How does GeckoDub pricing compare to DubSync?",
    a: "GeckoDub's Starter plan is \u20AC12/month for 20 minutes of video dubbing plus 7 minutes of lip sync (separate pools). DubSync's Starter plan is $19.99/month for 20 minutes with lip sync included on every minute. GeckoDub's lower price comes with the trade-off of limited lip sync minutes and no API access.",
  },
  {
    q: "Does GeckoDub include lip sync?",
    a: "GeckoDub offers lip sync, but it is tracked as a separate minute pool from regular dubbing. On the Starter plan, you get 20 minutes of dubbing but only 7 minutes of lip sync. On Creator Pro, you get 40 minutes of dubbing but only 15 minutes of lip sync. DubSync includes lip sync on every dubbed minute at no extra cost.",
  },
  {
    q: "Does GeckoDub have an API?",
    a: "No. As of 2026, GeckoDub does not offer API access. If you need programmatic dubbing for integration into your workflow, CMS, or application, DubSync's API is available on paid plans.",
  },
  {
    q: "Which platform is better for small creators?",
    a: "GeckoDub has a slight price advantage at the entry level (\u20AC12 vs $19.99), but DubSync includes lip sync on every minute and offers a free plan to test quality before paying. For creators who need lip sync on all their content, DubSync is the better value overall.",
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
            GeckoDub is an affordable European AI dubbing platform. DubSync offers
            a more complete feature set with lip sync included. Here is a detailed
            comparison to help you choose.
          </p>
        </section>

        {/* Quick Verdict */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick verdict</h2>
            <p className="text-slate-400 leading-relaxed">
              GeckoDub offers competitive pricing for basic dubbing, but separates lip
              sync into a limited minute pool and lacks API access. DubSync includes lip
              sync on every minute, offers API access, 4K output, and a free plan to
              test quality. For creators who need lip sync on all their content, DubSync
              is the better value despite the slightly higher starting price.
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
              <h3 className="text-lg font-bold text-white mb-4">GeckoDub</h3>
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
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th className="p-4 text-slate-400 font-medium">GeckoDub</th>
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
                  <td className="p-4 text-center text-slate-300">20+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-slate-300">Lip sync cost per minute</td>
                  <td className="p-4 bg-pink-500/10 text-center text-green-400 font-medium">$1.00 (included)</td>
                  <td className="p-4 text-center text-slate-300">{"\u20AC"}1.53 (separate pool)</td>
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
                  <span>Good value for dubbing without lip sync</span>
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
                <span><Link href="/signup" className="text-pink-400 hover:underline">Sign up for DubSync</Link> (free) and test with your first video to compare quality.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">3</span>
                <span>Select your languages and let DubSync handle transcription, translation, voice cloning, and lip sync in one step.</span>
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
