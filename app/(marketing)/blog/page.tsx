import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "DubSync Blog — AI Video Dubbing Insights & Guides",
  description:
    "Expert articles on AI video dubbing, voice cloning, multilingual content strategy, and translation technology from the DubSync team.",
};

const ARTICLES = [
  {
    slug: "what-is-ai-video-dubbing",
    title: "What is AI Video Dubbing? A Complete Guide for 2026",
    excerpt:
      "Learn how AI video dubbing works, from automatic transcription to voice cloning and lip sync. Discover why creators and businesses are switching from traditional dubbing workflows.",
    date: "April 5, 2026",
    readingTime: "5 min read",
  },
  {
    slug: "voice-cloning-video-translation",
    title: "How Voice Cloning Works in Video Translation",
    excerpt:
      "Explore the technology behind voice cloning for video translation, including neural text-to-speech, speaker identity preservation, and the privacy safeguards that protect your voice data.",
    date: "April 5, 2026",
    readingTime: "4 min read",
  },
  {
    slug: "ai-dubbing-vs-traditional",
    title: "AI Dubbing vs Traditional Dubbing: Cost, Speed & Quality Compared",
    excerpt:
      "A side-by-side comparison of AI-powered dubbing and traditional dubbing studios. Learn which approach fits your budget, timeline, and quality requirements.",
    date: "April 5, 2026",
    readingTime: "4 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">DubSync Blog</h1>
          <p className="text-zinc-300 text-lg mb-12">
            Insights on AI dubbing, voice cloning, multilingual content
            strategy, and product updates from the DubSync team.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-pink-500/40 hover:bg-white/[0.08]"
              >
                <p className="text-sm text-zinc-500 mb-3">
                  {article.date} &middot; {article.readingTime}
                </p>
                <h2 className="text-lg font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
