import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getPlatformHreflang } from "@/lib/seo/platform-hreflang";
import {
  PLATFORM_META,
  type PlatformKey,
} from "@/components/platforms/icons";

export const metadata: Metadata = {
  title: "DubSync for Every Platform — YouTube, TikTok, Instagram & More",
  description:
    "Dub videos for YouTube, TikTok, Instagram, Facebook, e-learning, and podcasts. AI voice cloning and lip sync for every platform.",
  alternates: {
    canonical: "https://dubsync.app/platforms",
    languages: getPlatformHreflang("/platforms"),
  },
  openGraph: {
    type: "website",
    title: "DubSync for Every Platform — YouTube, TikTok, Instagram & More",
    description:
      "Dub videos for YouTube, TikTok, Instagram, Facebook, e-learning, and podcasts. AI voice cloning and lip sync for every platform.",
    url: "https://dubsync.app/platforms",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubSync for Every Platform — YouTube, TikTok, Instagram & More",
    description:
      "Dub videos for YouTube, TikTok, Instagram, Facebook, e-learning, and podcasts. AI voice cloning and lip sync for every platform.",
    images: ["/og-image.png"],
  },
};

const PLATFORMS: {
  key: PlatformKey;
  description: string;
}[] = [
  {
    key: "youtube",
    description:
      "Dub videos, Shorts, and tutorials into 30+ languages. Grow subscribers and watch time globally.",
  },
  {
    key: "tiktok",
    description:
      "Localize viral content for every market. Keep the energy, reach new audiences with AI dubbing.",
  },
  {
    key: "instagram",
    description:
      "Dub Reels, Stories, and IGTV for international followers with natural voice cloning.",
  },
  {
    key: "facebook",
    description:
      "Localize video ads and branded content for 3B+ users in their native language.",
  },
  {
    key: "elearning",
    description:
      "Dub courses and training videos for global learners while keeping the instructor's voice.",
  },
  {
    key: "podcasts",
    description:
      "Expand your podcast to new language markets. AI preserves your voice and delivery.",
  },
];

const FAQS = [
  {
    question: "Can I dub for multiple platforms at once?",
    answer:
      "Yes. Upload once, select languages, and DubSync creates versions optimized for any platform.",
  },
  {
    question: "What video formats work with each platform?",
    answer:
      "DubSync accepts MP4, MOV, AVI, WebM, and MKV. Output is MP4 which works everywhere.",
  },
  {
    question: "Does DubSync optimize output for each platform?",
    answer:
      "DubSync produces high-quality MP4 output compatible with all platforms. You can trim and resize as needed.",
  },
  {
    question: "Is there a free plan for platform dubbing?",
    answer:
      "Yes. The free plan includes 1 video up to 15 seconds with lip sync and voice cloning. No credit card required.",
  },
];

export default function PlatformsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[{ name: "Platforms", url: "https://dubsync.app/platforms" }]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            AI dubbing for{" "}
            <span className="gradient-text">every platform</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            One upload. 30+ languages. Optimized for every platform.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium"
            >
              Dub Your First Video Free
            </Link>
          </div>
        </section>

        {/* Platform cards */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORMS.map((p) => {
              const meta = PLATFORM_META[p.key];
              const Icon = meta.icon;
              return (
                <div
                  key={p.key}
                  className="group rounded-2xl border border-white/10 bg-slate-800/40 p-6 transition-colors hover:border-white/20 hover:bg-slate-800/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    <Icon />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">
                    {meta.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{p.description}</p>
                  <div className="mt-4">
                    <Link
                      href={meta.href}
                      className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      Learn more &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
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
