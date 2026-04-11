import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";

export const metadata: Metadata = {
  title: "About DubSync — AI Video Dubbing for Every Creator",
  description:
    "DubSync makes video content accessible globally with AI voice cloning, lip sync, and translation in 30+ languages.",
  alternates: {
    canonical: "https://dubsync.app/about",
    languages: getPlatformHreflang("/about"),
  },
  openGraph: {
    type: "website",
    title: "About DubSync — AI Video Dubbing for Every Creator",
    description:
      "DubSync makes video content accessible globally with AI voice cloning, lip sync, and translation in 30+ languages.",
    url: "https://dubsync.app/about",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About DubSync — AI Video Dubbing for Every Creator",
    description:
      "Making video content accessible globally with AI voice cloning and lip sync.",
  },
};

const STATS = [
  { value: "2,000+", label: "Creators" },
  { value: "50M+", label: "Minutes dubbed" },
  { value: "30+", label: "Languages" },
  { value: "96%+", label: "Lip-sync accuracy" },
];

export default function AboutPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">About DubSync</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-zinc-300 leading-relaxed text-lg">
              DubSync exists to make video content accessible to every audience
              on the planet. Language should never be a barrier to great
              storytelling, education, or entertainment. We give creators,
              educators, and businesses the power to reach global audiences in
              minutes, not months.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">The Technology</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              DubSync combines three cutting-edge AI capabilities into a single,
              seamless workflow:
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex gap-3">
                <span className="text-pink-400 font-semibold shrink-0">Voice Cloning</span>
                <span>
                  &mdash; Our AI captures the speaker&apos;s unique tone, pitch,
                  and cadence, then recreates their voice in the target language.
                  No separate voice samples required.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-400 font-semibold shrink-0">Lip Sync</span>
                <span>
                  &mdash; AI-driven facial animation adjusts mouth movements to
                  match the dubbed audio, producing natural-looking video that
                  viewers trust.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-400 font-semibold shrink-0">Translation</span>
                <span>
                  &mdash; Context-aware neural translation preserves meaning,
                  humor, and cultural nuance across 30+ languages with human-level
                  accuracy.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-zinc-300 leading-relaxed">
              We envision a world where every video is watchable in every
              language. Our team is a small, focused group of engineers and
              researchers passionate about multilingual AI, computer vision, and
              audio synthesis. We are building the infrastructure for a truly
              global creator economy where the best content wins, regardless of
              the language it was originally recorded in.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">DubSync in Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <BreadcrumbSchema items={[{ name: "About", url: "https://dubsync.app/about" }]} />
    </div>
  );
}
