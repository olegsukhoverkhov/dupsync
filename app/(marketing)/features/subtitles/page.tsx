import { Metadata } from "next";
import Link from "next/link";
import {
  Captions,
  Subtitles,
  Type,
  Palette,
  AlignCenter,
  ArrowRight,
  MonitorPlay,
  Share2,
  GraduationCap,
  Building2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";

export const metadata: Metadata = {
  title: "AI Subtitles for Video — Auto-Generate in 30+ Languages",
  description:
    "Generate AI subtitles synced to dubbed audio. Burned-in or SRT/VTT export. Custom styling. Included in all plans.",
  alternates: {
    canonical: "https://dubsync.app/features/subtitles",
    languages: getPlatformHreflang("/features/subtitles"),
  },
  openGraph: {
    type: "website",
    title: "AI Subtitles for Video — Auto-Generate in 30+ Languages",
    description:
      "Generate AI subtitles synced to dubbed audio. Burned-in or SRT/VTT export. Custom styling. Included in all plans.",
    url: "https://dubsync.app/features/subtitles",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Subtitles for Video — Auto-Generate in 30+ Languages",
    description:
      "Generate AI subtitles synced to dubbed audio. Burned-in or SRT/VTT export. Custom styling. Included in all plans.",
  },
};

const STEPS = [
  {
    icon: Sparkles,
    number: "01",
    title: "Dub your video",
    description:
      "Upload your video, pick target languages, and run the dubbing pipeline. Subtitles are generated automatically alongside every dub.",
  },
  {
    icon: Captions,
    number: "02",
    title: "AI transcribes dubbed audio",
    description:
      "After dubbing, speech-to-text runs on the dubbed audio track — not the original transcript. Timing matches the voice the viewer actually hears.",
  },
  {
    icon: AlignCenter,
    number: "03",
    title: "Smart timing and segmentation",
    description:
      "Transcripts are split into subtitle-friendly cues: max 2 lines, 42 chars/line, 1–7s display, aligned to speech pauses and sentence boundaries.",
  },
  {
    icon: Type,
    number: "04",
    title: "Choose your output",
    description:
      "Burned-in for social feeds or SRT/VTT files for YouTube and LMS platforms. Export both from the same dub — no second pipeline run.",
  },
];

const CUSTOMIZATION = [
  {
    icon: Type,
    title: "Font family & size",
    description:
      "Sans-serif, serif, or monospace. Auto-scale to video resolution so 1080p and 4K exports stay legible.",
  },
  {
    icon: Palette,
    title: "Colors & backgrounds",
    description:
      "Text color, stroke width, and background plate with opacity control. Tune readability for any footage.",
  },
  {
    icon: AlignCenter,
    title: "Position & alignment",
    description:
      "Bottom (default), top, or a custom Y offset. Clears TikTok UI chrome by default.",
  },
  {
    icon: Subtitles,
    title: "Per-language controls",
    description:
      "Subtitles can match the dubbed audio or differ from it. RTL (Arabic, Hebrew) and CJK (Chinese, Japanese, Korean) fully supported.",
  },
];

const USE_CASES = [
  {
    icon: MonitorPlay,
    title: "YouTube creators",
    description:
      "Upload dubbed video + SRT as a closed-caption track. YouTube auto-maps captions to the viewer's language and Google indexes the text for SEO.",
    href: "/platforms/youtube",
  },
  {
    icon: Share2,
    title: "Social media (TikTok, Instagram, Facebook)",
    description:
      "Burned-in subtitles are essential — most viewers watch on mute. Styled captions can increase Reels engagement by up to 40%.",
    href: "/platforms/tiktok",
  },
  {
    icon: GraduationCap,
    title: "E-learning",
    description:
      "Satisfy accessibility compliance on Udemy, Coursera, Teachable, and Thinkific. Export SRT per language alongside the dubbed audio track.",
    href: "/platforms/elearning",
  },
  {
    icon: Building2,
    title: "Corporate training",
    description:
      "HR onboarding, security awareness, and compliance videos with multi-language captions. Burned-in for internal portals, SRT for external LMS.",
    href: "/platforms/elearning",
  },
];

const COMPARISON = [
  { feature: "Viewer can toggle on/off", burned: false, srt: true },
  { feature: "Works on every platform", burned: true, srt: "partial" },
  { feature: "Best for social media", burned: true, srt: false },
  { feature: "Best for YouTube", burned: false, srt: true },
  { feature: "Editable after export", burned: false, srt: true },
  { feature: "SEO benefit", burned: false, srt: true },
  { feature: "File size impact", burned: "Larger video", srt: "Small file" },
];

const FAQS = [
  {
    question: "Are subtitles generated from dubbed audio or translated from the original?",
    answer:
      "From the dubbed audio. AI transcribes what viewers hear, ensuring perfect sync between captions and speech in every target language.",
  },
  {
    question: "Can I export SRT files for YouTube?",
    answer:
      "Yes. Export SRT or VTT from any dub and upload to YouTube as closed captions. Google indexes the caption text for SEO, and viewers see the track enabled automatically in their account language.",
  },
  {
    question: "Are AI subtitles included in the free plan?",
    answer:
      "Yes. AI subtitles are part of the dubbing process at no extra cost on all plans, including Free. SRT and VTT export are available on every tier.",
  },
  {
    question: "Can I customize subtitle appearance?",
    answer:
      "Yes. Font family, size, color, position, and background style — all adjustable with a real-time preview before export.",
  },
  {
    question: "Do subtitles support right-to-left languages?",
    answer:
      "Yes. Arabic, Hebrew, Urdu, and Persian render with correct RTL glyph shaping and mirrored line wrapping. CJK languages use per-character counting so dense lines don't overflow.",
  },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="h-5 w-5 text-green-400 mx-auto" aria-label="Yes" />;
  if (value === false)
    return <X className="h-5 w-5 text-zinc-600 mx-auto" aria-label="No" />;
  if (value === "partial")
    return <span className="text-yellow-400 text-xs">Partial</span>;
  return <span className="text-xs text-zinc-400">{value}</span>;
}

export default function FeaturesSubtitlesPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Features", url: "https://dubsync.app/features" },
          {
            name: "AI Subtitles",
            url: "https://dubsync.app/features/subtitles",
          },
        ]}
      />

      {/* FAQPage schema — parallel to the <FaqAccordion /> render so
          Google rich results stay in sync with what users see. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400">
            <Captions className="h-3.5 w-3.5" /> AI Subtitles
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            AI subtitles —{" "}
            <span className="gradient-text">
              synced to every dub, every language
            </span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            DubSync auto-generates synchronized subtitles for every dubbed
            video, transcribed directly from the dubbed audio — not the
            original transcript. Perfect sync, burned-in or SRT export, in
            every language.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium"
            >
              Try AI Subtitles Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
            >
              View pricing
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
            <span>30+ languages</span>
            <span>·</span>
            <span>SRT + VTT export</span>
            <span>·</span>
            <span>Included in all plans</span>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How AI subtitles <span className="gradient-text">work</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                  <step.icon className="h-6 w-6 text-pink-400" />
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

        {/* Burned-in vs SRT */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Burned-in vs SRT —{" "}
            <span className="gradient-text">choose the right format</span>
          </h2>
          <p className="text-center text-zinc-400 mb-10 max-w-xl mx-auto">
            Both ship with every dub. Pick the one that fits each distribution
            channel — or export both.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-slate-800/50">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Feature
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-pink-400">
                    Burned-in
                  </th>
                  <th className="px-4 py-4 text-center font-semibold text-pink-400">
                    SRT / VTT
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
                    <td className="px-4 py-4 text-center">
                      <ComparisonCell value={row.burned} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ComparisonCell value={row.srt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customization */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Make subtitles <span className="gradient-text">yours</span>
          </h2>
          <p className="text-center text-zinc-400 mb-12 max-w-xl mx-auto">
            Sensible defaults out of the box. Complete control when you need
            it, without the overwhelm of a full video editor.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {CUSTOMIZATION.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <c.icon className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {c.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Subtitles for{" "}
            <span className="gradient-text">every platform</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.title}
                href={uc.href}
                className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 transition-colors hover:border-pink-500/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20">
                    <uc.icon className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {uc.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {uc.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-pink-400 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Subtitles in <span className="gradient-text">30+ languages</span>
          </h2>
          <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-8">
            Every language DubSync dubs into gets full subtitle support, with
            no quality drop-off for non-Latin scripts. Right-to-left languages
            (Arabic, Hebrew) render with correct RTL glyph shaping. CJK
            languages (Chinese, Japanese, Korean) use per-character counting
            so dense lines stay within the safe area.
          </p>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ship fully-captioned video to every platform
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Start with 5 free minutes of dubbing — subtitles included. No
              credit card required.
            </p>
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-8 py-3 text-sm font-medium"
            >
              Try AI Subtitles Free
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
              href="/blog/ai-subtitles-for-dubbed-videos"
              className="rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
            >
              How It Works (Blog)
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
