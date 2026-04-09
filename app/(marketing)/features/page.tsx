import { Metadata } from "next";
import Link from "next/link";
import { Mic, Scan, Globe, Users, FileEdit, Code, Captions, ArrowRight, Upload, Wand2, Download, Check, X, Minus } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";

export const metadata: Metadata = {
  title: "DubSync Features — Voice Cloning, Lip Sync & AI Video Dubbing",
  description:
    "Explore DubSync's AI dubbing features: voice cloning, lip sync, 30+ languages, multi-speaker detection, and API.",
  alternates: {
    canonical: "https://dubsync.app/features",
    languages: getPlatformHreflang("/features"),
  },
  openGraph: {
    type: "website",
    title: "DubSync Features — Voice Cloning, Lip Sync & AI Video Dubbing",
    description:
      "Explore DubSync's AI dubbing features: voice cloning, lip sync, 30+ languages, multi-speaker detection, and API.",
    url: "https://dubsync.app/features",
    images: ["/og-image.png"],
  },
};

const FEATURES = [
  {
    icon: Mic,
    title: "Voice Cloning",
    description:
      "Clone any speaker's voice and preserve their unique tone, pitch, and cadence across every target language.",
    href: "/features/voice-cloning",
  },
  {
    icon: Scan,
    title: "Lip Sync",
    description:
      "AI adjusts mouth movements to match the dubbed audio so the final video looks completely natural.",
    href: "/features/lip-sync",
  },
  {
    icon: Globe,
    title: "30+ Languages",
    description:
      "Translate and dub videos into over 30 languages including Spanish, French, Japanese, Hindi, Arabic, and more.",
    href: "/features/video-translation",
  },
  {
    icon: Users,
    title: "Multi-Speaker Detection",
    description:
      "Automatically detect and separate multiple speakers in a video, cloning each voice independently for accurate dubbing.",
    href: "/features",
  },
  {
    icon: FileEdit,
    title: "Script Editor",
    description:
      "Review, edit, and fine-tune translated scripts before dubbing. Adjust timing, phrasing, and emphasis for every line.",
    href: "/features",
  },
  {
    icon: Code,
    title: "API Access",
    description:
      "Integrate DubSync into your product or workflow with our REST API. Automate dubbing at scale programmatically.",
    href: "/features/api",
  },
  {
    // AI Subtitles — 7th card. Links to the dedicated feature page.
    icon: Captions,
    title: "AI Subtitles",
    description:
      "Auto-generate perfectly synced subtitles from dubbed audio. Export as burned-in captions or SRT/VTT files. Customize font, color, position, and style.",
    href: "/features/subtitles",
  },
];

const STEPS = [
  {
    icon: Upload,
    number: "01",
    title: "Upload your video",
    description:
      "Drop a video file or paste a YouTube link. DubSync accepts MP4, MOV, and WebM up to 2 hours long.",
  },
  {
    icon: Wand2,
    number: "02",
    title: "Choose languages & settings",
    description:
      "Select your target languages, toggle lip sync, and pick voice cloning fidelity. The AI handles the rest.",
  },
  {
    icon: Download,
    number: "03",
    title: "Download the dubbed video",
    description:
      "In minutes you get a studio-quality dubbed video ready to publish on YouTube, TikTok, or any platform.",
  },
];

const COMPARISON = [
  {
    feature: "Voice cloning",
    dubsync: true,
    heygen: true,
    rask: true,
    elevenlabs: "partial",
  },
  {
    feature: "Lip sync",
    dubsync: true,
    heygen: true,
    rask: "partial",
    elevenlabs: false,
  },
  {
    // AI Subtitles (burned-in + SRT). DubSync ships both formats on
    // every plan; competitors vary — Rask has SRT only, HeyGen is
    // limited, ElevenLabs is audio-only so has no subtitle story.
    feature: "AI Subtitles (burned-in + SRT)",
    dubsync: true,
    heygen: "partial",
    rask: "partial",
    elevenlabs: false,
  },
  {
    feature: "30+ languages",
    dubsync: true,
    heygen: true,
    rask: true,
    elevenlabs: true,
  },
  {
    feature: "Multi-speaker detection",
    dubsync: true,
    heygen: false,
    rask: true,
    elevenlabs: false,
  },
  {
    feature: "Script editor",
    dubsync: true,
    heygen: false,
    rask: true,
    elevenlabs: false,
  },
  {
    feature: "REST API",
    dubsync: true,
    heygen: true,
    rask: true,
    elevenlabs: true,
  },
  {
    feature: "Free plan",
    dubsync: true,
    heygen: false,
    rask: true,
    elevenlabs: true,
  },
  {
    feature: "YouTube link import",
    dubsync: true,
    heygen: false,
    rask: true,
    elevenlabs: false,
  },
];

const FAQS = [
  {
    question: "What video formats does DubSync support?",
    answer:
      "DubSync supports MP4, MOV, and WebM files up to 2 hours long. You can also paste a YouTube link and we will import the video automatically. All output videos are delivered in MP4 at the same resolution as your original.",
  },
  {
    question: "How accurate is the voice cloning?",
    answer:
      "DubSync captures the speaker's unique tone, pitch, and cadence with high fidelity. Most listeners cannot distinguish the cloned voice from the original. For best results, use source audio with minimal background noise and clear speech.",
  },
  {
    question: "Can I edit the translated script before dubbing?",
    answer:
      "Yes. After translation, the built-in script editor lets you review and adjust every line. You can change wording, modify timing, and add emphasis markers. The dubbed audio regenerates based on your edits so the final result matches your intent.",
  },
  {
    question: "Is there an API for automated dubbing?",
    answer:
      "Yes. DubSync offers a REST API available on Pro and Enterprise plans. You can submit videos, select languages, and retrieve dubbed outputs programmatically. Full documentation and code examples are available at dubsync.app/docs.",
  },
];

function ComparisonIcon({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="h-5 w-5 text-green-400" aria-label="Yes" />;
  if (value === "partial")
    return <Minus className="h-5 w-5 text-yellow-400" aria-label="Partial" />;
  return <X className="h-5 w-5 text-zinc-600" aria-label="No" />;
}

export default function FeaturesPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Features", url: "https://dubsync.app/features" },
        ]}
      />

      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            AI video dubbing features{" "}
            <span className="gradient-text">built for creators and teams</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            Upload a video, pick your languages, and let DubSync handle voice
            cloning, lip sync, and translation. Everything you need to go global
            in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="gradient-button rounded-lg px-6 py-3 text-sm font-medium"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </section>

        {/* Feature cards grid */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 mb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 transition-colors hover:border-pink-500/30 hover:bg-slate-800/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <feature.icon className="h-6 w-6 text-pink-400" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-pink-400 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How <span className="gradient-text">DubSync</span> works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <step.icon className="h-7 w-7 text-pink-400" />
                </div>
                <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                  Step {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            How DubSync <span className="gradient-text">compares</span>
          </h2>
          <p className="text-center text-zinc-400 mb-10 max-w-xl mx-auto">
            See how DubSync stacks up against other AI dubbing tools on the
            features that matter most.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-slate-800/50">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Feature
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-pink-400">
                    DubSync
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-zinc-300">
                    HeyGen
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-zinc-300">
                    Rask AI
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-zinc-300">
                    ElevenLabs
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-6 py-4 text-zinc-300">{row.feature}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={row.dubsync} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={row.heygen} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={row.rask} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <ComparisonIcon value={row.elevenlabs} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to dub your first video?
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Start with 5 free minutes of dubbing. No credit card required.
            </p>
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-8 py-3 text-sm font-medium"
            >
              Get started free
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <FaqAccordion items={FAQS} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
