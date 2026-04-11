import { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Video,
  Camera,
  Smartphone,
  CheckCircle2,
  Upload,
  Languages,
  Download,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";

export const metadata: Metadata = {
  title:
    "AI Video Translation — Translate Videos to 30+ Languages Automatically | DubSync",
  description:
    "Translate and dub videos into 30+ languages with AI. Support for Spanish, French, Japanese, Hindi, Arabic, and more. Studio-quality output in minutes.",
  alternates: {
    canonical: "https://dubsync.app/features/video-translation",
    languages: getPlatformHreflang("/features/video-translation"),
  },
  openGraph: {
    type: "website",
    title:
      "AI Video Translation — Translate Videos to 30+ Languages Automatically",
    description:
      "Translate and dub videos into 30+ languages with AI voice cloning and lip sync.",
    url: "https://dubsync.app/features/video-translation",
    images: ["/og-image.png"],
  },
};

const LANGUAGE_GROUPS = [
  {
    region: "Europe",
    languages: [
      { name: "Spanish", flag: "🇪🇸" },
      { name: "French", flag: "🇫🇷" },
      { name: "German", flag: "🇩🇪" },
      { name: "Italian", flag: "🇮🇹" },
      { name: "Portuguese", flag: "🇧🇷" },
      { name: "Dutch", flag: "🇳🇱" },
      { name: "Polish", flag: "🇵🇱" },
      { name: "Swedish", flag: "🇸🇪" },
      { name: "Norwegian", flag: "🇳🇴" },
      { name: "Finnish", flag: "🇫🇮" },
      { name: "Danish", flag: "🇩🇰" },
      { name: "Czech", flag: "🇨🇿" },
      { name: "Romanian", flag: "🇷🇴" },
      { name: "Greek", flag: "🇬🇷" },
      { name: "Ukrainian", flag: "🇺🇦" },
    ],
  },
  {
    region: "Asia & Pacific",
    languages: [
      { name: "Japanese", flag: "🇯🇵" },
      { name: "Korean", flag: "🇰🇷" },
      { name: "Mandarin", flag: "🇨🇳" },
      { name: "Hindi", flag: "🇮🇳" },
      { name: "Indonesian", flag: "🇮🇩" },
      { name: "Thai", flag: "🇹🇭" },
      { name: "Vietnamese", flag: "🇻🇳" },
      { name: "Tamil", flag: "🇮🇳" },
      { name: "Filipino", flag: "🇵🇭" },
      { name: "Malay", flag: "🇲🇾" },
    ],
  },
  {
    region: "Middle East & Africa",
    languages: [
      { name: "Arabic", flag: "🇸🇦" },
      { name: "Turkish", flag: "🇹🇷" },
      { name: "Hebrew", flag: "🇮🇱" },
      { name: "Swahili", flag: "🇰🇪" },
    ],
  },
];

const QUALITY_POINTS = [
  "Context-aware translation that preserves meaning, not just words",
  "Idiomatic phrasing tuned for each language and region",
  "Technical and domain-specific terminology handling",
  "Consistent translation across an entire video for coherent output",
  "Built-in script editor to review and adjust translations before dubbing",
];

const WORKFLOW_STEPS = [
  {
    icon: Upload,
    title: "Upload or link",
    description: "Drop a file or paste a YouTube, Vimeo, or direct URL.",
  },
  {
    icon: Languages,
    title: "Select languages",
    description:
      "Choose one or multiple target languages. Batch translation is supported.",
  },
  {
    icon: Sparkles,
    title: "AI processes",
    description:
      "Transcription, translation, voice cloning, and lip sync run in parallel.",
  },
  {
    icon: Download,
    title: "Export",
    description:
      "Download dubbed videos in MP4 or push directly to your connected platforms.",
  },
];

const PLATFORMS = [
  {
    icon: Video,
    name: "YouTube",
    description:
      "Export dubbed versions and upload to your channel as multi-language tracks or separate videos. Supports YouTube link import for one-click dubbing.",
  },
  {
    icon: Smartphone,
    name: "TikTok",
    description:
      "Generate vertical-format dubbed clips optimized for TikTok. Output is sized and encoded for maximum platform quality.",
  },
  {
    icon: Camera,
    name: "Camera",
    description:
      "Create dubbed Reels and Stories. DubSync preserves aspect ratio and outputs at Camera-recommended bitrates.",
  },
];

const FAQS = [
  {
    question: "How many languages can I translate a single video into?",
    answer:
      "There is no limit. You can select as many target languages as your plan supports. All translations run in parallel so processing time is roughly the same whether you translate into 1 language or 10.",
  },
  {
    question: "Is the translation AI or human?",
    answer:
      "DubSync uses a custom neural translation model trained specifically for spoken content. It understands context, idiomatic expressions, and cultural nuances better than generic translation APIs. You can also edit the translated script before dubbing if you want to fine-tune phrasing.",
  },
  {
    question: "Can I add languages that are not listed?",
    answer:
      "We are constantly adding new languages. If a language you need is not yet available, contact us at support@dubsync.app and we will prioritize it based on demand. Enterprise customers can request custom language support.",
  },
  {
    question: "Does video translation include subtitles?",
    answer:
      "DubSync focuses on audio dubbing, not subtitles. However, the translated transcript is available for download in SRT format so you can add subtitles through your video editor or hosting platform.",
  },
];

export default function VideoTranslationPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Features", url: "https://dubsync.app/features" },
          {
            name: "Video Translation",
            url: "https://dubsync.app/features/video-translation",
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
            <Globe className="h-3.5 w-3.5" /> Video Translation
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Translate videos to 30+ languages{" "}
            <span className="gradient-text">with AI</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            DubSync translates, dubs, and lip-syncs your videos into over 30
            languages. Reach a global audience without re-recording a single
            word.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium"
            >
              Translate a video free
            </Link>
          </div>
        </section>

        {/* Supported languages */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Supported <span className="gradient-text">languages</span>
          </h2>
          <div className="space-y-8">
            {LANGUAGE_GROUPS.map((group) => (
              <div key={group.region}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                  {group.region}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {group.languages.map((lang) => (
                    <span
                      key={lang.name}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/30 px-4 py-2 text-sm text-zinc-300"
                    >
                      <span aria-hidden="true">{lang.flag}</span> {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">
            More languages added regularly.{" "}
            <Link href="/contact" className="text-pink-400 hover:underline">
              Request a language
            </Link>
          </p>
        </section>

        {/* Translation quality */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Translation <span className="gradient-text">quality</span>
          </h2>
          <p className="text-center text-zinc-400 mb-10 max-w-xl mx-auto">
            DubSync uses a neural translation model built specifically for
            spoken content. It goes beyond word-for-word translation to capture
            meaning and tone.
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-8">
            <ul className="space-y-4">
              {QUALITY_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
                  <span className="text-zinc-300 text-sm leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Translation <span className="gradient-text">workflow</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <step.icon className="h-6 w-6 text-pink-400" />
                </div>
                <span className="text-xs font-mono text-pink-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform support */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Publish <span className="gradient-text">everywhere</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <platform.icon className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {platform.name}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Go global with AI video translation
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Translate your first video free. 5 minutes of dubbing included, no
              credit card required.
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
              href="/features/lip-sync"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              Lip Sync
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
