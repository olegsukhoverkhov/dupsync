import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "DubSync vs ElevenLabs — AI Dubbing Comparison 2026",
  description:
    "Compare DubSync and ElevenLabs for AI video dubbing. ElevenLabs has no lip sync. See pricing, features, and which tool fits your needs.",
  alternates: {
    canonical: "https://dubsync.app/vs/elevenlabs",
  },
  openGraph: {
    type: "website",
    title: "DubSync vs ElevenLabs — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and ElevenLabs for AI video dubbing. Pricing, lip sync, and feature differences.",
    url: "https://dubsync.app/vs/elevenlabs",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync vs ElevenLabs — AI Dubbing Comparison 2026",
    description:
      "Compare DubSync and ElevenLabs for AI video dubbing. Pricing, lip sync, and features compared.",
  },
};

const FEATURES = [
  { feature: "Voice cloning", dubsync: true, competitor: true },
  { feature: "Lip sync", dubsync: true, competitor: false },
  { feature: "Multi-speaker detection", dubsync: true, competitor: false },
  { feature: "Video output", dubsync: true, competitor: false },
  { feature: "Script editing", dubsync: true, competitor: false },
  { feature: "API access", dubsync: true, competitor: true },
  { feature: "4K output", dubsync: true, competitor: false },
  { feature: "Text-to-speech", dubsync: false, competitor: true },
  { feature: "Sound effects generation", dubsync: false, competitor: true },
  { feature: "Background audio preserve", dubsync: true, competitor: false },
];

const FAQS = [
  {
    q: "Does ElevenLabs offer lip sync for video dubbing?",
    a: "No. As of 2026, ElevenLabs does not offer lip sync at any pricing tier. ElevenLabs is primarily an audio platform focused on voice synthesis, text-to-speech, and voice cloning. If you need your dubbed videos to have matching lip movements, DubSync is the better choice.",
  },
  {
    q: "Is ElevenLabs cheaper than DubSync for dubbing?",
    a: "ElevenLabs has lower per-minute audio costs starting at approximately $0.17/min on the Starter plan ($5/month for ~30 minutes). However, ElevenLabs produces audio only — you still need to manually sync it with your video and there is no lip sync. DubSync starts at $1.00/min but delivers a complete lip-synced video output ready to publish.",
  },
  {
    q: "Can I use ElevenLabs audio with DubSync?",
    a: "The two platforms serve different purposes. ElevenLabs excels at pure audio generation, while DubSync handles the entire video dubbing pipeline including transcription, translation, voice cloning, lip sync, and video rendering. Most creators find it simpler to use DubSync for the complete workflow rather than combining multiple tools.",
  },
  {
    q: "Which platform has better voice quality?",
    a: "ElevenLabs is widely regarded as having some of the best voice synthesis quality in the industry, especially for English text-to-speech. DubSync focuses on voice cloning accuracy for dubbing, where preserving the original speaker's identity across languages matters most. For dubbing use cases, DubSync's specialized approach delivers excellent results.",
  },
];

function FeatureIcon({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-400" />
  ) : (
    <X className="h-4 w-4 text-red-400/60" />
  );
}

export default function VsElevenLabsPage() {
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
            DubSync vs ElevenLabs
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            ElevenLabs is a leading AI audio platform. DubSync is a complete video
            dubbing solution. These are fundamentally different tools — here is
            when to use each one.
          </p>
        </section>

        {/* Quick Verdict */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick verdict</h2>
            <p className="text-slate-400 leading-relaxed">
              If you need to dub videos with lip sync, DubSync is the clear choice —
              ElevenLabs does not offer lip sync or video output at all. If you need
              pure text-to-speech, voice cloning for audio projects, or sound effects
              generation, ElevenLabs is the industry leader. They solve different problems.
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
                Complete video output with lip sync included.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4">ElevenLabs</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Starter</span>
                  <span className="text-white font-medium">$5/mo — ~30 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Creator</span>
                  <span className="text-white font-medium">$22/mo — ~50 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Pro</span>
                  <span className="text-white font-medium">$99/mo — ~250 min</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Audio output only. No lip sync. No video rendering.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-sm text-yellow-300/80">
              <strong>Important:</strong> ElevenLabs pricing covers audio generation only.
              You would still need a separate tool or manual editing to sync the audio
              with your video and adjust lip movements. DubSync handles the entire
              pipeline end to end.
            </p>
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
                  <th className="p-4 text-slate-400 font-medium">ElevenLabs</th>
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
                  <td className="p-4 text-center text-slate-300">29</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-slate-300">Output format</td>
                  <td className="p-4 bg-pink-500/10 text-center text-slate-300">Video + audio</td>
                  <td className="p-4 text-center text-slate-300">Audio only</td>
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
                Where ElevenLabs wins
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Industry-leading text-to-speech quality</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Lower cost for audio-only projects ($0.17/min vs $1.00/min)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Sound effects and music generation</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Mature, well-documented API for audio applications</span>
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
                  <span>Complete video dubbing with lip sync (ElevenLabs has none)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>End-to-end workflow: upload video, get dubbed video</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Multi-speaker detection and per-speaker voice cloning</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>No manual audio-video syncing required</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">
            Switching from ElevenLabs to DubSync
          </h2>
          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <ol className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">1</span>
                <span>Gather your original video files. With ElevenLabs, you likely have separate audio and video tracks — DubSync handles both in one step.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">2</span>
                <span><Link href="/signup" className="text-pink-400 hover:underline">Create a DubSync account</Link> and upload your video to see the full pipeline in action.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">3</span>
                <span>DubSync handles transcription, translation, voice cloning, and lip sync automatically. No need to manually combine audio tracks with video.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">4</span>
                <span>If you still need ElevenLabs for text-to-speech or audio projects, you can keep both subscriptions. They complement each other well.</span>
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
              Need lip sync? DubSync has you covered.
            </h2>
            <p className="mt-3 text-slate-400">
              Complete video dubbing with lip sync included on every plan. Start free.
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
          { name: "DubSync vs ElevenLabs", url: "https://dubsync.app/vs/elevenlabs" },
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
