import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title:
    "AI Dubbing with Lip Sync — DubSync vs Rask AI vs HeyGen (2026)",
  description:
    "Compare real lip sync minutes per dollar across AI dubbing tools. DubSync: 20 min from $19.99. Rask AI: requires $120/mo. See hidden costs and credit traps.",
  alternates: {
    canonical: "https://dubsync.app/compare",
  },
  openGraph: {
    type: "website",
    title:
      "AI Dubbing Comparison 2026 — Who Gives You the Most Lip Sync?",
    description:
      "DubSync includes lip sync in every credit. Rask AI charges $120/mo. HeyGen shares credits. See the real numbers.",
    url: "https://dubsync.app/compare",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Dubbing Comparison 2026 — Lip Sync Pricing Compared",
    description:
      "20 lip sync minutes from $19.99/mo. See how DubSync compares to Rask AI, HeyGen, GeckoDub, and ElevenLabs.",
  },
};

const FAQS = [
  {
    q: "Why is DubSync cheaper than Rask AI for lip sync?",
    a: "Rask AI charges $120/mo for lip sync access and doubles credit consumption. DubSync includes lip sync from $19.99/mo — no multipliers, no surcharges.",
  },
  {
    q: "How does DubSync compare to HeyGen for video dubbing?",
    a: "HeyGen is primarily an AI avatar platform. Lip sync shares Premium Credits with other features. DubSync is built specifically for dubbing — every credit is a full minute of lip-synced output.",
  },
  {
    q: "Does DubSync include lip sync on all plans?",
    a: "Yes. Every paid plan + free plan include lip sync.",
  },
  {
    q: "What does 1 credit mean in DubSync?",
    a: "1 credit = 1 minute of dubbed video in 1 language, always with lip sync included.",
  },
  {
    q: "Can I try DubSync before paying?",
    a: "Yes. Free plan includes 1 video up to 15 seconds with lip sync and voice cloning. No credit card required.",
  },
];

function CellPositive({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-green-400 font-medium">{children}</span>
  );
}

function CellNegative({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-red-400/80 font-medium">{children}</span>
  );
}

function CellMixed({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-yellow-400 font-medium">{children}</span>
  );
}

function HiddenCostCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-slate-800/40 overflow-hidden">
      <summary className="flex items-center justify-between cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4" />
      </summary>
      <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">
        {children}
      </div>
    </details>
  );
}

export default function ComparePage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 text-center mb-20">
          <span className="inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400 mb-6">
            Updated April 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            AI Dubbing with Lip Sync —{" "}
            <span className="gradient-text">Who Gives You the Most?</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Not headline prices — real lip sync minutes per dollar.
          </p>
        </section>

        {/* Section 1: What you actually get for ~$20/month */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            What you actually get for ~$20/month
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Lip sync feature comparison across AI dubbing platforms at
                approximately $20 per month
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    scope="col"
                    className="text-left p-4 text-slate-400 font-medium"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-pink-400 font-medium bg-pink-500/10"
                  >
                    DubSync
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-400 font-medium"
                  >
                    <Link
                      href="/vs/geckodub"
                      className="hover:text-pink-400 transition-colors"
                    >
                      GeckoDub
                    </Link>
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-400 font-medium"
                  >
                    <Link
                      href="/vs/heygen"
                      className="hover:text-pink-400 transition-colors"
                    >
                      HeyGen
                    </Link>
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-400 font-medium"
                  >
                    <Link
                      href="/vs/rask-ai"
                      className="hover:text-pink-400 transition-colors"
                    >
                      Rask AI
                    </Link>
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-400 font-medium"
                  >
                    <Link
                      href="/vs/elevenlabs"
                      className="hover:text-pink-400 transition-colors"
                    >
                      ElevenLabs
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 text-slate-300 font-medium"
                  >
                    Lip sync minutes from ~$20/mo
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>20 min</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>7 min</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>shared*</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 text-slate-300 font-medium"
                  >
                    Lip sync in every credit
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>always</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>separate pool</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>costs credits</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>2x cost</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 text-slate-300 font-medium"
                  >
                    Hidden lip sync surcharges
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>none</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>limited pool</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>shared pool</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>doubles usage</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 text-slate-300 font-medium"
                  >
                    Price for lip sync access
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>$19.99/mo</CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>&euro;12/mo</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellMixed>$29/mo</CellMixed>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>$120/mo</CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>N/A</CellNegative>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 text-slate-300 font-medium"
                  >
                    Free plan with lip sync
                  </th>
                  <td className="p-4 text-center bg-pink-500/10">
                    <CellPositive>
                      <Check className="h-4 w-4 mx-auto" aria-label="Yes" />
                    </CellPositive>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                  <td className="p-4 text-center">
                    <CellNegative>
                      <X className="h-4 w-4 mx-auto" aria-label="No" />
                    </CellNegative>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Other features (smaller, muted) */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h3 className="text-lg font-semibold text-slate-400 text-center mb-6">
            Other features
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Additional feature comparison across AI dubbing platforms
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    scope="col"
                    className="text-left p-4 text-slate-500 font-medium"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-pink-400/70 font-medium bg-pink-500/5"
                  >
                    DubSync
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-500 font-medium"
                  >
                    GeckoDub
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-500 font-medium"
                  >
                    HeyGen
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-500 font-medium"
                  >
                    Rask AI
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-slate-500 font-medium"
                  >
                    ElevenLabs
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 font-medium"
                  >
                    Languages
                  </th>
                  <td className="p-4 text-center bg-pink-500/5">30+</td>
                  <td className="p-4 text-center">30+</td>
                  <td className="p-4 text-center">175+</td>
                  <td className="p-4 text-center">130+</td>
                  <td className="p-4 text-center">29+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 font-medium"
                  >
                    Voice cloning
                  </th>
                  <td className="p-4 text-center bg-pink-500/5">
                    <Check className="h-4 w-4 text-green-400/70 mx-auto" aria-label="All plans" />
                  </td>
                  <td className="p-4 text-center">
                    <Check className="h-4 w-4 text-green-400/70 mx-auto" aria-label="All plans" />
                  </td>
                  <td className="p-4 text-center text-xs">paid plans</td>
                  <td className="p-4 text-center text-xs">Creator+</td>
                  <td className="p-4 text-center text-xs">Starter+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 font-medium"
                  >
                    API access
                  </th>
                  <td className="p-4 text-center bg-pink-500/5 text-xs">
                    Pro $49.99
                  </td>
                  <td className="p-4 text-center text-xs">?</td>
                  <td className="p-4 text-center text-xs">from $5</td>
                  <td className="p-4 text-center text-xs">Enterprise</td>
                  <td className="p-4 text-center text-xs">from $5</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 font-medium"
                  >
                    Max resolution
                  </th>
                  <td className="p-4 text-center bg-pink-500/5">4K</td>
                  <td className="p-4 text-center">?</td>
                  <td className="p-4 text-center">4K</td>
                  <td className="p-4 text-center">4K</td>
                  <td className="p-4 text-center text-xs">
                    N/A (audio)
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th
                    scope="row"
                    className="text-left p-4 font-medium"
                  >
                    Product focus
                  </th>
                  <td className="p-4 text-center bg-pink-500/5 text-xs">
                    Video dubbing
                  </td>
                  <td className="p-4 text-center text-xs">
                    Video dubbing
                  </td>
                  <td className="p-4 text-center text-xs">
                    AI avatars
                  </td>
                  <td className="p-4 text-center text-xs">
                    Localization
                  </td>
                  <td className="p-4 text-center text-xs">Audio/TTS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Real cost scenario */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-3">
            Real cost: 10-min video dubbed into 3 languages
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            That&apos;s 30 minutes of lip-synced video. Here&apos;s what
            each platform actually charges.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* DubSync card */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-pink-500 via-violet-500 to-blue-500">
              <div className="rounded-[15px] bg-slate-900 p-6 h-full">
                <h3 className="text-lg font-bold text-pink-400 mb-4">
                  DubSync
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Plan</dt>
                    <dd className="text-white font-medium">
                      Pro $49.99/mo
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Credits needed</dt>
                    <dd className="text-white">30</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Credits available</dt>
                    <dd className="text-white">50</dd>
                  </div>
                  <div className="flex justify-between items-start pt-2 border-t border-white/10">
                    <dt className="text-slate-400">Result</dt>
                    <dd className="text-green-400 text-right">
                      <Check className="h-4 w-4 inline mr-1" />
                      Done. 20 credits left.
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-lg font-bold text-white">
                  $49.99
                </p>
              </div>
            </div>

            {/* Rask AI card */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Rask AI
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Plan needed</dt>
                  <dd className="text-white font-medium">
                    Creator Pro $120/mo
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Credits needed</dt>
                  <dd className="text-white">
                    60{" "}
                    <span className="text-red-400/60 text-xs">
                      (30 min x 2x)
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Credits available</dt>
                  <dd className="text-white">100</dd>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-white/10">
                  <dt className="text-slate-400">Result</dt>
                  <dd className="text-yellow-400 text-right text-xs">
                    Done, used 60% of plan on one video.
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-lg font-bold text-white">$120</p>
            </div>

            {/* HeyGen card */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                HeyGen
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Plan</dt>
                  <dd className="text-white font-medium">
                    Creator $29/mo
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Credits needed</dt>
                  <dd className="text-white">
                    150{" "}
                    <span className="text-slate-500 text-xs">
                      (30 min x 5 cr/min)
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Credits available</dt>
                  <dd className="text-white">200 (shared)</dd>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-white/10">
                  <dt className="text-slate-400">Result</dt>
                  <dd className="text-yellow-400 text-right text-xs">
                    Done, only 50 credits left for avatars.
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-lg font-bold text-white">$29</p>
            </div>

            {/* GeckoDub card */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                GeckoDub
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Plan needed</dt>
                  <dd className="text-white font-medium">
                    Creator Pro &euro;23/mo
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">
                    Lip sync min available
                  </dt>
                  <dd className="text-white">15</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Lip sync min needed</dt>
                  <dd className="text-white">30</dd>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-white/10">
                  <dt className="text-slate-400">Result</dt>
                  <dd className="text-red-400 text-right text-xs">
                    <X className="h-3 w-3 inline mr-1" />
                    Not enough. Need Scale at &euro;71/mo.
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-lg font-bold text-white">
                &euro;71
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Where the real costs hide */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Where the real costs hide
          </h2>
          <div className="space-y-4">
            <HiddenCostCard title="Rask AI: lip sync doubles your credits">
              <p>
                Rask AI Creator Pro costs $120/mo and includes 100
                minutes of dubbing. But when you enable lip sync, each
                minute costs 2 credits instead of 1. Your real lip sync
                capacity: ~50 minutes, not 100. A 10-min video in 3
                languages = 60 lip sync credits = more than half your
                plan.
              </p>
            </HiddenCostCard>
            <HiddenCostCard title="HeyGen: shared credit pool">
              <p>
                HeyGen Creator gives you 200 Premium Credits per month.
                Lip sync translation costs 5 credits per minute. But
                those same credits are shared with Avatar IV (20 cr/min),
                video generation, and other AI features. Use 5 minutes of
                Avatar IV = 100 credits gone. Only 100 left = 20 minutes
                of lip sync translation.
              </p>
            </HiddenCostCard>
            <HiddenCostCard title="GeckoDub: separate lip sync pool">
              <p>
                GeckoDub Starter includes 20 minutes of video
                translation. But only 7 of those minutes can have lip
                sync. The other 13 minutes? Audio-only dubbing, no lip
                sync. Their Creator Pro at &euro;23/mo increases lip sync
                to 15 minutes — still less than DubSync&apos;s 20 minutes
                at $19.99.
              </p>
            </HiddenCostCard>
            <HiddenCostCard title="ElevenLabs: no lip sync at all">
              <p>
                ElevenLabs is an excellent audio platform. But it
                generates audio only — no video output, no lip sync.
                You&apos;d need to pair it with a separate lip sync tool
                and build your own pipeline. Great for developers, not for
                creators.
              </p>
            </HiddenCostCard>
          </div>
          <div className="mt-10 text-center">
            <p className="text-lg font-semibold text-white mb-4">
              DubSync: 1 credit = 1 minute with lip sync. Always. No
              exceptions.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 gradient-button rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Start Dubbing Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Section 5: Why creators choose DubSync */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why creators choose DubSync
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Lip sync on every plan
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Unlike Rask AI and GeckoDub that charge extra for lip
                sync, or ElevenLabs that does not offer it at all,
                DubSync includes lip sync on every plan — including the
                free tier.
              </p>
            </div>
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                No credit traps or multipliers
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                1 credit = 1 minute of dubbed video with lip sync. No 2x
                multipliers, no shared pools, no separate lip sync
                buckets. You always know exactly what you are paying for.
              </p>
            </div>
            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Built for video dubbing
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                DubSync is purpose-built for video dubbing with lip sync.
                Not an avatar platform, not an audio tool, not an
                enterprise localization suite. Every feature is designed
                for creators who dub videos.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-semibold text-white">{faq.q}</h3>
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl font-bold text-white">
              Ready to dub with real lip sync?
            </h2>
            <p className="mt-3 text-slate-400">
              Start dubbing your videos for free. No credit card required.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 gradient-button rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Start Dubbing Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              See also:{" "}
              <Link
                href="/blog/ai-dubbing-pricing-comparison-2026"
                className="text-pink-400/70 hover:text-pink-400 transition-colors"
              >
                AI Dubbing Pricing Comparison 2026
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[{ name: "Compare", url: "https://dubsync.app/compare" }]}
      />

      {/* FAQPage Schema */}
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
