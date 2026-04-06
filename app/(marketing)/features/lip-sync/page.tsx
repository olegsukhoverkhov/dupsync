import { Metadata } from "next";
import Link from "next/link";
import {
  Scan,
  Video,
  Layers,
  Sparkles,
  ArrowRight,
  MonitorPlay,
  Presentation,
  Film,
  Podcast,
  Eye,
  Brain,
  Zap,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";

export const metadata: Metadata = {
  title:
    "AI Lip Sync for Dubbed Videos — Natural Mouth Movement in Any Language | DubSync",
  description:
    "DubSync's AI lip sync adjusts mouth movements to match dubbed audio in any language. The result looks completely natural to viewers.",
  alternates: { canonical: "https://dubsync.app/features/lip-sync" },
  openGraph: {
    type: "website",
    title:
      "AI Lip Sync for Dubbed Videos — Natural Mouth Movement in Any Language",
    description:
      "DubSync's AI lip sync adjusts mouth movements to match dubbed audio in any language.",
    url: "https://dubsync.app/features/lip-sync",
    images: ["/og-image.png"],
  },
};

const STEPS = [
  {
    icon: Eye,
    number: "01",
    title: "Detect facial landmarks",
    description:
      "The AI maps the speaker's face in every frame, identifying the mouth, jaw, and surrounding facial muscles with sub-pixel precision.",
  },
  {
    icon: Brain,
    number: "02",
    title: "Analyze dubbed audio phonemes",
    description:
      "The translated speech is broken down into individual phonemes. Each phoneme maps to a specific mouth shape (viseme) that the model knows how to render.",
  },
  {
    icon: Zap,
    number: "03",
    title: "Re-render mouth movements",
    description:
      "The video is re-composited frame by frame, adjusting the mouth region to match the new audio. Skin texture, lighting, and shadows are preserved for a seamless result.",
  },
];

const REASONS = [
  {
    title: "Viewer trust",
    description:
      "Mismatched lip movements are immediately noticeable and make viewers question content quality. Proper lip sync keeps audiences engaged and builds credibility.",
  },
  {
    title: "Higher retention",
    description:
      "Videos with synchronized lip movements hold viewer attention longer. Studies show dubbed videos with lip sync have 35% higher completion rates than those without.",
  },
  {
    title: "Platform performance",
    description:
      "YouTube, TikTok, and Instagram algorithms favor videos with strong watch time. Lip-synced dubs reduce drop-off and improve algorithmic reach in every market.",
  },
];

const CONTENT_TYPES = [
  {
    icon: MonitorPlay,
    title: "Talking-head videos",
    description:
      "YouTube vlogs, course lectures, and podcast clips where the speaker's face is front and center. Lip sync is critical here because the mouth is the focal point.",
  },
  {
    icon: Presentation,
    title: "Presentations & webinars",
    description:
      "Speaker-led content with slides. DubSync detects when the speaker is on screen and applies lip sync only to those segments, leaving slide-only sections untouched.",
  },
  {
    icon: Film,
    title: "Short-form social content",
    description:
      "TikToks, Reels, and Shorts where viewer attention is fleeting. Even a single frame of mismatched lips can trigger a scroll. Lip sync keeps the illusion intact.",
  },
  {
    icon: Podcast,
    title: "Interview & multi-cam footage",
    description:
      "Content with multiple speakers and camera angles. DubSync tracks each speaker independently and applies lip sync to whoever is currently speaking.",
  },
];

const FAQS = [
  {
    question: "Does lip sync work with all video resolutions?",
    answer:
      "Yes. DubSync supports resolutions from 360p up to 4K. The AI adapts its facial landmark detection to the available pixel density. Higher resolutions produce more precise mouth rendering, but even 720p delivers visually convincing results.",
  },
  {
    question: "Can I disable lip sync for certain segments?",
    answer:
      "Yes. The script editor lets you mark segments where lip sync should be skipped, for example when the speaker is off-screen or when you prefer the original mouth movements. You can toggle lip sync on a per-segment basis.",
  },
  {
    question: "How long does lip sync processing take?",
    answer:
      "Processing time depends on video length and resolution. A 10-minute 1080p video typically takes 3-5 minutes with lip sync enabled. 4K videos take slightly longer. You receive a notification when your dubbed video is ready.",
  },
  {
    question: "Does lip sync affect video quality?",
    answer:
      "No. DubSync re-renders only the mouth region while preserving the rest of the frame at original quality. The output video matches the source resolution, bitrate, and codec. There is no perceptible quality loss outside the modified facial area.",
  },
];

export default function LipSyncPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Features", url: "https://dubsync.app/features" },
          {
            name: "Lip Sync",
            url: "https://dubsync.app/features/lip-sync",
          },
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400">
            <Scan className="h-3.5 w-3.5" /> Lip Sync
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            AI lip sync —{" "}
            <span className="gradient-text">
              natural mouth movement in any language
            </span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            DubSync re-renders the speaker's mouth movements to match the dubbed
            audio perfectly. The result is a video that looks like it was
            originally recorded in the target language.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium"
            >
              Try lip sync free
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How lip sync <span className="gradient-text">works</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
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

        {/* Why lip sync matters */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Why lip sync <span className="gradient-text">matters</span>
          </h2>
          <p className="text-center text-zinc-400 mb-12 max-w-xl mx-auto">
            Audio-only dubbing leaves a gap between what viewers hear and what
            they see. Lip sync closes that gap completely.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {REASONS.map((reason) => (
              <div
                key={reason.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Supported content types */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Supported{" "}
            <span className="gradient-text">content types</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {CONTENT_TYPES.map((ct) => (
              <div
                key={ct.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <ct.icon className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {ct.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {ct.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Make dubbed videos look native
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Try lip sync with 5 free minutes of dubbing. No credit card
              required.
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

        {/* Related features */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">
            Related features
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/features/voice-cloning"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Voice Cloning
            </Link>
            <Link
              href="/features/video-translation"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Video Translation
            </Link>
            <Link
              href="/features/api"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              API
            </Link>
            <Link
              href="/features"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              All features
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
