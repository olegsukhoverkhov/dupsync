import { Metadata } from "next";
import Link from "next/link";
import {
  Mic,
  AudioWaveform,
  Languages,
  Sparkles,
  Video,
  GraduationCap,
  Megaphone,
  ArrowRight,
  Shield,
  Gauge,
  Settings2,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";

export const metadata: Metadata = {
  title:
    "AI Voice Cloning for Video Dubbing — Keep Your Voice in Any Language | DubSync",
  description:
    "Clone your voice with AI and dub videos into 30+ languages while keeping your unique tone, pitch, and cadence. Studio-quality results in minutes.",
  alternates: { canonical: "https://dubsync.app/features/voice-cloning" },
  openGraph: {
    type: "website",
    title:
      "AI Voice Cloning for Video Dubbing — Keep Your Voice in Any Language",
    description:
      "Clone your voice with AI and dub videos into 30+ languages while keeping your unique tone, pitch, and cadence.",
    url: "https://dubsync.app/features/voice-cloning",
    images: ["/og-image.png"],
  },
};

const STEPS = [
  {
    icon: Mic,
    number: "01",
    title: "Analyze the original voice",
    description:
      "DubSync's AI listens to the source audio, isolating vocal characteristics like pitch, timbre, speaking pace, and emotional tone from background noise and music.",
  },
  {
    icon: AudioWaveform,
    number: "02",
    title: "Build a voice profile",
    description:
      "The system creates a neural voice model that captures what makes the speaker's voice unique. This profile drives all downstream translations.",
  },
  {
    icon: Languages,
    number: "03",
    title: "Synthesize in target languages",
    description:
      "Using the voice profile, the AI generates speech in each selected language. The cloned voice preserves the speaker's identity while achieving native-level pronunciation.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Refine timing and emotion",
    description:
      "The output is automatically adjusted so speech duration matches the original video. Emotional inflections like excitement, emphasis, and pauses are carried over.",
  },
];

const CAPABILITIES = [
  {
    icon: Gauge,
    title: "High-fidelity cloning",
    description:
      "Our model captures over 40 vocal parameters per speaker, producing output that listeners consistently rate as indistinguishable from the original voice.",
  },
  {
    icon: Settings2,
    title: "Adjustable fidelity",
    description:
      "Choose between Standard and Ultra voice cloning. Standard is fast and suitable for most content. Ultra delivers maximum accuracy for professional productions.",
  },
  {
    icon: Shield,
    title: "Ethical safeguards",
    description:
      "Voice cloning is restricted to content you own or have rights to. All cloned output is watermarked with an inaudible digital signature for traceability.",
  },
];

const USE_CASES = [
  {
    icon: Video,
    title: "YouTube creators",
    description:
      "Reach a global audience without losing your personality. Dub your videos into Spanish, Portuguese, Hindi, and more while sounding like yourself in every language.",
    link: { label: "How to dub YouTube videos", href: "/blog/how-to-dub-youtube-video" },
  },
  {
    icon: GraduationCap,
    title: "E-learning & courses",
    description:
      "Translate training materials and online courses while maintaining instructor voice consistency. Students hear the same voice across all language versions.",
    link: { label: "AI dubbing for education", href: "/blog/what-is-ai-video-dubbing" },
  },
  {
    icon: Megaphone,
    title: "Marketing & ads",
    description:
      "Localize video ads for international campaigns. Keep brand voice consistent across markets without hiring voice actors for each language.",
    link: { label: "Voice cloning for video", href: "/blog/voice-cloning-video-translation" },
  },
];

const FAQS = [
  {
    question: "How much source audio does the AI need for voice cloning?",
    answer:
      "DubSync needs at least 30 seconds of clear speech to build a reliable voice profile. Longer samples (2-5 minutes) produce higher-fidelity results. The audio should have minimal background noise and music for best accuracy.",
  },
  {
    question: "Does voice cloning work with multiple speakers?",
    answer:
      "Yes. DubSync automatically detects and separates individual speakers in the video, then clones each voice independently. Each speaker's dubbed output uses their own unique voice profile.",
  },
  {
    question: "Can I use voice cloning on content I did not create?",
    answer:
      "Voice cloning is available only for content you own or have explicit rights to dub. When you upload a video, you confirm that you have permission to process the voices in it. This policy protects creators and complies with voice-rights regulations.",
  },
  {
    question: "What is the difference between Standard and Ultra voice cloning?",
    answer:
      "Standard cloning is optimized for speed and is suitable for most content like YouTube videos and social media. Ultra cloning uses a larger neural model with more vocal parameters, delivering maximum fidelity for professional broadcasts, e-learning, and enterprise content.",
  },
];

export default function VoiceCloningPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Features", url: "https://dubsync.app/features" },
          {
            name: "Voice Cloning",
            url: "https://dubsync.app/features/voice-cloning",
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
            <Mic className="h-3.5 w-3.5" /> Voice Cloning
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            AI voice cloning —{" "}
            <span className="gradient-text">your voice, any language</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            DubSync clones your voice with AI and speaks it fluently in 30+
            languages. Your tone, your cadence, your personality — preserved
            across every dubbed version.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium"
            >
              Try voice cloning free
            </Link>
          </div>
        </section>

        {/* How voice cloning works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How voice cloning <span className="gradient-text">works</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <step.icon className="h-6 w-6 text-pink-400" />
                  </div>
                  <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key capabilities */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Key <span className="gradient-text">capabilities</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <cap.icon className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Use cases for{" "}
            <span className="gradient-text">voice cloning</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <uc.icon className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {uc.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {uc.description}
                </p>
                <Link
                  href={uc.link.href}
                  className="inline-flex items-center gap-1 text-sm text-pink-400 hover:gap-2 transition-all"
                >
                  {uc.link.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Clone your voice and go global
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Start with 5 free minutes. No credit card required.
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
              href="/features/lip-sync"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Lip Sync
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
