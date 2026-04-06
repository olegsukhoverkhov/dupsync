import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Video Dubbing Comparison 2026 — DubSync vs Rask AI vs HeyGen vs ElevenLabs",
  description:
    "Compare the top 5 AI video dubbing platforms side by side. Pricing, features, lip sync quality, and real-world cost breakdowns for DubSync, Rask AI, HeyGen, ElevenLabs, and GeckoDub.",
  alternates: {
    canonical: "https://dubsync.app/compare",
  },
  openGraph: {
    type: "website",
    title: "AI Video Dubbing Comparison 2026 — DubSync vs Rask AI vs HeyGen vs ElevenLabs",
    description:
      "Compare the top 5 AI video dubbing platforms side by side. Pricing, features, lip sync, and real-world cost breakdowns.",
    url: "https://dubsync.app/compare",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Dubbing Comparison 2026",
    description:
      "Compare the top 5 AI video dubbing platforms side by side. Pricing, features, lip sync, and real-world cost breakdowns.",
  },
};

const PLATFORMS = [
  {
    name: "DubSync",
    highlight: true,
    plans: [
      { name: "Free", price: "$0", minutes: "1 video (15s)" },
      { name: "Starter", price: "$19.99/mo", minutes: "20 min" },
      { name: "Pro", price: "$49.99/mo", minutes: "50 min" },
      { name: "Business", price: "$149.99/mo", minutes: "150 min" },
    ],
    costPerMin: "$1.00",
    costPerMinValue: 1.0,
    lipSync: true,
    lipSyncIncluded: true,
    voiceCloning: true,
    multiSpeaker: true,
    apiAccess: true,
    languages: "30+",
    freeOption: "1 video (15s)",
  },
  {
    name: "Rask AI",
    highlight: false,
    plans: [
      { name: "Creator", price: "$50/mo", minutes: "25 min" },
      { name: "Creator Pro", price: "$120/mo", minutes: "100 min (50 lip sync)" },
      { name: "Business", price: "$600/mo", minutes: "Custom" },
    ],
    costPerMin: "$2.00",
    costPerMinValue: 2.0,
    lipSync: true,
    lipSyncIncluded: false,
    voiceCloning: true,
    multiSpeaker: true,
    apiAccess: true,
    languages: "130+",
    freeOption: "None",
  },
  {
    name: "HeyGen",
    highlight: false,
    plans: [
      { name: "Free", price: "$0", minutes: "3 videos (watermark)" },
      { name: "Creator", price: "$29/mo", minutes: "~40 min (200 PC)" },
      { name: "Pro", price: "$99/mo", minutes: "~200 min (2000 PC)" },
      { name: "Business", price: "$149+$20/seat", minutes: "Custom" },
    ],
    costPerMin: "$0.73",
    costPerMinValue: 0.73,
    lipSync: true,
    lipSyncIncluded: true,
    voiceCloning: true,
    multiSpeaker: true,
    apiAccess: true,
    languages: "40+",
    freeOption: "3 videos (watermark)",
  },
  {
    name: "ElevenLabs",
    highlight: false,
    plans: [
      { name: "Starter", price: "$5/mo", minutes: "~30 min" },
      { name: "Creator", price: "$22/mo", minutes: "~50 min" },
      { name: "Pro", price: "$99/mo", minutes: "~250 min" },
    ],
    costPerMin: "$0.40",
    costPerMinValue: 0.4,
    lipSync: false,
    lipSyncIncluded: false,
    voiceCloning: true,
    multiSpeaker: false,
    apiAccess: true,
    languages: "29",
    freeOption: "Limited",
  },
  {
    name: "GeckoDub",
    highlight: false,
    plans: [
      { name: "Starter", price: "\u20AC12/mo", minutes: "20 min + 7 min lip sync" },
      { name: "Creator Pro", price: "\u20AC23/mo", minutes: "40 min + 15 min lip sync" },
      { name: "Scale", price: "\u20AC71/mo", minutes: "Custom" },
    ],
    costPerMin: "$0.65",
    costPerMinValue: 0.65,
    lipSync: true,
    lipSyncIncluded: false,
    voiceCloning: true,
    multiSpeaker: true,
    apiAccess: false,
    languages: "20+",
    freeOption: "None",
  },
];

const SCENARIOS = [
  {
    title: "YouTube Creator",
    description: "10-minute video dubbed into 3 languages monthly",
    totalMinutes: 30,
    results: [
      { platform: "DubSync", plan: "Pro ($49.99)", cost: "$49.99", note: "20 min left over" },
      { platform: "Rask AI", plan: "Creator Pro ($120)", cost: "$120", note: "Lip sync uses 2x credits" },
      { platform: "HeyGen", plan: "Creator ($29)", cost: "$29", note: "Credit-based, may need Pro" },
      { platform: "ElevenLabs", plan: "Creator ($22)", cost: "$22", note: "No lip sync available" },
      { platform: "GeckoDub", plan: "Creator Pro (\u20AC23)", cost: "~$25", note: "Only 15 min lip sync" },
    ],
  },
  {
    title: "E-Learning Company",
    description: "60 minutes of course content into 5 languages monthly",
    totalMinutes: 300,
    results: [
      { platform: "DubSync", plan: "Business ($149.99)", cost: "$149.99", note: "All lip sync included" },
      { platform: "Rask AI", plan: "Business ($600)", cost: "$600+", note: "Enterprise pricing required" },
      { platform: "HeyGen", plan: "Business ($149+)", cost: "$169+", note: "Per-seat pricing adds up" },
      { platform: "ElevenLabs", plan: "Pro ($99)", cost: "$99", note: "No lip sync at any tier" },
      { platform: "GeckoDub", plan: "Scale (\u20AC71)", cost: "~$77+", note: "May need multiple plans" },
    ],
  },
  {
    title: "Marketing Agency",
    description: "20 short ads (30s each) into 10 languages monthly",
    totalMinutes: 100,
    results: [
      { platform: "DubSync", plan: "Business ($149.99)", cost: "$149.99", note: "Lip sync on every video" },
      { platform: "Rask AI", plan: "Creator Pro ($120)", cost: "$120", note: "Only 50 min with lip sync" },
      { platform: "HeyGen", plan: "Pro ($99)", cost: "$99", note: "Credit-based, variable cost" },
      { platform: "ElevenLabs", plan: "Creator ($22)", cost: "$22", note: "Audio only, no lip sync" },
      { platform: "GeckoDub", plan: "Scale (\u20AC71)", cost: "~$77", note: "Limited lip sync minutes" },
    ],
  },
];

const FEATURES_DEEP_DIVE = [
  { feature: "Voice cloning", dubsync: true, rask: true, heygen: true, elevenlabs: true, geckodub: true },
  { feature: "Lip sync included", dubsync: true, rask: false, heygen: true, elevenlabs: false, geckodub: false },
  { feature: "Multi-speaker detection", dubsync: true, rask: true, heygen: true, elevenlabs: false, geckodub: true },
  { feature: "API access", dubsync: true, rask: true, heygen: true, elevenlabs: true, geckodub: false },
  { feature: "Script editing", dubsync: true, rask: true, heygen: true, elevenlabs: false, geckodub: true },
  { feature: "4K output", dubsync: true, rask: true, heygen: true, elevenlabs: false, geckodub: false },
  { feature: "Batch processing", dubsync: true, rask: true, heygen: true, elevenlabs: false, geckodub: true },
  { feature: "No watermark (paid)", dubsync: true, rask: true, heygen: true, elevenlabs: true, geckodub: true },
  { feature: "Glossary / term lock", dubsync: true, rask: true, heygen: false, elevenlabs: false, geckodub: false },
  { feature: "Background audio preserve", dubsync: true, rask: true, heygen: true, elevenlabs: false, geckodub: true },
];

const WHY_DUBSYNC = [
  {
    title: "Lip sync on every plan",
    description:
      "Unlike Rask AI and GeckoDub that charge extra for lip sync, or ElevenLabs that does not offer it at all, DubSync includes lip sync on every paid plan at no additional cost.",
  },
  {
    title: "Transparent per-minute pricing",
    description:
      "1 credit equals 1 minute of dubbed video. No confusing credit systems, no per-seat fees, no hidden multipliers for lip sync. You always know exactly what you are paying.",
  },
  {
    title: "Best value for creators",
    description:
      "At $1.00 per minute with lip sync included, DubSync delivers the best overall value for creators who need their dubbed videos to look and sound professional.",
  },
];

const FAQS = [
  {
    q: "Which AI dubbing tool has the best lip sync?",
    a: "DubSync and HeyGen both include lip sync as a standard feature. Rask AI offers lip sync on its Creator Pro plan, but it uses 2x credits, effectively halving your available minutes. ElevenLabs does not offer lip sync at any tier. GeckoDub separates lip sync into a separate minute pool.",
  },
  {
    q: "What is the cheapest AI dubbing tool in 2026?",
    a: "ElevenLabs offers the lowest per-minute cost at approximately $0.40/min, but it does not include lip sync or multi-speaker support. For full-featured dubbing with lip sync, DubSync offers the best value at $1.00/min with lip sync included on every plan.",
  },
  {
    q: "Can I try these tools for free?",
    a: "DubSync offers a free plan with one video up to 15 seconds. HeyGen offers 3 free videos with a watermark. ElevenLabs has a limited free tier. Rask AI and GeckoDub do not offer free plans.",
  },
  {
    q: "Which platform supports the most languages?",
    a: "Rask AI supports the most languages at 130+. HeyGen supports 40+, DubSync supports 30+, ElevenLabs supports 29, and GeckoDub supports 20+. For most creators, 30 languages covers the vast majority of their target markets.",
  },
  {
    q: "Do any of these tools offer an API?",
    a: "DubSync, Rask AI, HeyGen, and ElevenLabs all offer API access on their paid plans. GeckoDub does not currently offer an API. ElevenLabs has the most mature audio-focused API, while DubSync and HeyGen provide end-to-end video dubbing APIs.",
  },
  {
    q: "Which tool is best for YouTube creators?",
    a: "DubSync is purpose-built for YouTube creators who need professional lip-synced dubbing at an affordable price. HeyGen is a strong alternative for avatar-based content. Rask AI is suitable if you need 130+ languages but costs more for lip sync.",
  },
];

function FeatureIcon({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-400 mx-auto" />
  ) : (
    <X className="h-4 w-4 text-red-400/60 mx-auto" />
  );
}

export default function ComparePage() {
  const maxCost = Math.max(...PLATFORMS.map((p) => p.costPerMinValue));

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
            AI video dubbing tools{" "}
            <span className="gradient-text">compared</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            An honest, side-by-side comparison of the top 5 AI video dubbing
            platforms in 2026. Pricing, features, lip sync quality, and
            real-world cost breakdowns to help you choose the right tool.
          </p>
        </section>

        {/* Quick Comparison Table */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Quick comparison table
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-400 font-medium">Platform</th>
                  <th className="p-4 text-slate-400 font-medium">Starting price</th>
                  <th className="p-4 text-slate-400 font-medium">Cost/min</th>
                  <th className="p-4 text-slate-400 font-medium">Lip sync</th>
                  <th className="p-4 text-slate-400 font-medium">Voice cloning</th>
                  <th className="p-4 text-slate-400 font-medium">Languages</th>
                  <th className="p-4 text-slate-400 font-medium">Free tier</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((p) => (
                  <tr
                    key={p.name}
                    className={`border-b border-white/5 ${
                      p.highlight ? "bg-pink-500/10" : ""
                    }`}
                  >
                    <td className="p-4 font-semibold text-white">
                      {p.highlight ? (
                        <span className="flex items-center gap-2">
                          {p.name}
                          <span className="rounded-full bg-pink-500/20 border border-pink-500/30 px-2 py-0.5 text-[10px] text-pink-400 font-medium">
                            Recommended
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={`/vs/${p.name.toLowerCase().replace(/\s+/g, "-")}`}
                          className="hover:text-pink-400 transition-colors"
                        >
                          {p.name}
                        </Link>
                      )}
                    </td>
                    <td className="p-4 text-center text-slate-300">
                      {p.plans[0].price}
                    </td>
                    <td className="p-4 text-center text-slate-300">{p.costPerMin}</td>
                    <td className="p-4 text-center">
                      {p.lipSync ? (
                        p.lipSyncIncluded ? (
                          <span className="text-green-400 text-xs">Included</span>
                        ) : (
                          <span className="text-yellow-400 text-xs">Extra cost</span>
                        )
                      ) : (
                        <span className="text-red-400/60 text-xs">No</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <FeatureIcon value={p.voiceCloning} />
                    </td>
                    <td className="p-4 text-center text-slate-300">{p.languages}</td>
                    <td className="p-4 text-center text-slate-300 text-xs">{p.freeOption}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cost per minute chart */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-3">
            Cost per minute with lip sync
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            Effective cost per minute of dubbed video including lip sync.
            ElevenLabs does not offer lip sync.
          </p>
          <div className="space-y-4">
            {PLATFORMS.map((p) => {
              const width = (p.costPerMinValue / maxCost) * 100;
              return (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="w-28 text-sm text-slate-300 text-right shrink-0">
                    {p.name}
                  </span>
                  <div className="flex-1 h-8 rounded-lg bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-lg flex items-center px-3 text-xs font-medium ${
                        p.highlight
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                          : !p.lipSync
                          ? "bg-slate-600/60 text-slate-300"
                          : "bg-slate-600 text-slate-200"
                      }`}
                      style={{ width: `${Math.max(width, 15)}%` }}
                    >
                      {p.lipSync ? p.costPerMin : `${p.costPerMin}*`}
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-slate-600 mt-2">
              * ElevenLabs cost shown is audio-only; lip sync is not available.
              Rask AI lip sync uses 2x credits, so effective cost doubles for lip-synced content.
            </p>
          </div>
        </section>

        {/* Real-world scenario cards */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-3">
            Real-world pricing scenarios
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            What you would actually pay each month for common use cases.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {SCENARIOS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-white/10 bg-slate-800/40 p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{s.description}</p>
                <div className="space-y-3">
                  {s.results.map((r) => (
                    <div
                      key={r.platform}
                      className={`flex items-start justify-between gap-2 text-sm ${
                        r.platform === "DubSync" ? "text-pink-400" : "text-slate-300"
                      }`}
                    >
                      <div>
                        <span className="font-medium">{r.platform}</span>
                        <span className="block text-xs text-slate-500">
                          {r.note}
                        </span>
                      </div>
                      <span className="font-semibold shrink-0">{r.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature deep dive */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Feature deep dive
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th className="p-4 text-pink-400 font-medium bg-pink-500/10">DubSync</th>
                  <th className="p-4 text-slate-400 font-medium">Rask AI</th>
                  <th className="p-4 text-slate-400 font-medium">HeyGen</th>
                  <th className="p-4 text-slate-400 font-medium">ElevenLabs</th>
                  <th className="p-4 text-slate-400 font-medium">GeckoDub</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES_DEEP_DIVE.map((f) => (
                  <tr key={f.feature} className="border-b border-white/5">
                    <td className="p-4 text-slate-300">{f.feature}</td>
                    <td className="p-4 bg-pink-500/10">
                      <FeatureIcon value={f.dubsync} />
                    </td>
                    <td className="p-4">
                      <FeatureIcon value={f.rask} />
                    </td>
                    <td className="p-4">
                      <FeatureIcon value={f.heygen} />
                    </td>
                    <td className="p-4">
                      <FeatureIcon value={f.elevenlabs} />
                    </td>
                    <td className="p-4">
                      <FeatureIcon value={f.geckodub} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Why DubSync */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why creators choose DubSync
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_DUBSYNC.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl font-bold text-white">
              Ready to try the best-value AI dubbing?
            </h2>
            <p className="mt-3 text-slate-400">
              Start dubbing your videos for free. No credit card required.
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
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                View Pricing
              </Link>
            </div>
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
