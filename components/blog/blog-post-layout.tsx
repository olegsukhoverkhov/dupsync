import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { AuthorCardInline, AuthorCardFull } from "./author-card";
import { CTABlock } from "./cta-block";
import { RelatedArticles } from "./related-articles";
import { ArticleSchema } from "./article-schema";
import { ViewCounter } from "./view-counter";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowLeft } from "lucide-react";

export const ALL_ARTICLES = [
  {
    slug: "what-is-ai-video-dubbing",
    title: "What is AI Video Dubbing? A Complete Guide for 2026",
    excerpt: "Learn how AI video dubbing works, from transcription to voice cloning to lip sync, and why it's replacing traditional dubbing.",
    date: "2025-10-14",
    readingTime: "8 min read",
    category: "Guide",
  },
  {
    slug: "voice-cloning-video-translation",
    title: "How Voice Cloning Works in Video Translation",
    excerpt: "A deep dive into the voice cloning technology behind AI dubbing — how it preserves speaker identity across languages.",
    date: "2025-11-05",
    readingTime: "7 min read",
    category: "Explainer",
  },
  {
    slug: "ai-dubbing-vs-traditional",
    title: "AI Dubbing vs Traditional Dubbing: Cost, Speed & Quality",
    excerpt: "We compare AI dubbing tools with traditional voice actors on cost, turnaround time, and output quality.",
    date: "2025-12-03",
    readingTime: "7 min read",
    category: "Comparison",
  },
  {
    slug: "how-to-dub-youtube-video",
    title: "How to Dub a YouTube Video in 5 Minutes",
    excerpt: "Step-by-step tutorial: upload your YouTube video, choose languages, and get dubbed versions ready to publish.",
    date: "2026-01-10",
    readingTime: "6 min read",
    category: "Tutorial",
  },
  {
    slug: "how-to-clone-voice-for-video",
    title: "How to Clone Your Voice for Video Translation",
    excerpt: "Learn how to create an AI clone of your voice for dubbing videos into other languages while keeping your identity.",
    date: "2026-01-28",
    readingTime: "6 min read",
    category: "Tutorial",
  },
  {
    slug: "ai-dubbing-for-youtube",
    title: "AI Dubbing for YouTube: Grow Your Global Audience",
    excerpt: "How YouTube creators are using AI dubbing to reach viewers in 30+ languages and grow their channels faster.",
    date: "2026-02-18",
    readingTime: "8 min read",
    category: "Use Case",
  },
  {
    slug: "best-ai-dubbing-tools",
    title: "Best AI Dubbing Tools in 2026: Honest Comparison",
    excerpt: "We tested 8 AI dubbing platforms on the same video. Here's how DubSync, Rask AI, ElevenLabs, HeyGen, and others compare.",
    date: "2026-03-12",
    readingTime: "12 min read",
    category: "Comparison",
  },
  {
    slug: "ai-dubbing-pricing-comparison-2026",
    title: "AI Video Dubbing Pricing Comparison 2026",
    excerpt: "Complete pricing guide comparing DubSync, Rask AI, HeyGen, ElevenLabs, and GeckoDub.",
    date: "2026-04-06",
    readingTime: "15 min read",
    category: "Guide",
  },
  {
    slug: "how-to-dub-instagram-reels",
    title: "How to Dub Instagram Reels in 3 Minutes (Step-by-Step)",
    excerpt: "Step-by-step tutorial: dub your Instagram Reels into any language with AI voice cloning and lip sync.",
    date: "2026-04-06",
    readingTime: "6 min read",
    category: "Tutorial",
  },
  {
    slug: "social-media-video-localization-guide",
    title: "Social Media Video Localization: Complete Guide 2026",
    excerpt: "Complete guide to localizing video content for YouTube, TikTok, Instagram, and Facebook with AI dubbing.",
    date: "2026-04-06",
    readingTime: "12 min read",
    category: "Guide",
  },
  {
    slug: "ai-subtitles-for-dubbed-videos",
    title: "AI Subtitles for Dubbed Videos — How It Works",
    excerpt: "DubSync now generates AI subtitles automatically for dubbed videos. Burned-in or SRT export in 30+ languages. Perfect sync with dubbed audio.",
    date: "2026-04-09",
    readingTime: "8 min read",
    category: "Feature",
  },
];

/** Format ISO date to human-readable: "Oct 14, 2025" */
export function formatArticleDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Articles sorted newest first */
export const SORTED_ARTICLES = [...ALL_ARTICLES].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function BlogPostLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const article = ALL_ARTICLES.find((a) => a.slug === slug);
  if (!article) return null;

  const displayDate = formatArticleDate(article.date);

  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Category badge */}
          <span className="inline-block rounded-md border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-400 mb-4">
            {article.category}
          </span>

          {/* Author */}
          <AuthorCardInline date={displayDate} readingTime={article.readingTime} />

          {/* Article content */}
          <div className="prose-blog">
            {children}
          </div>

          {/* CTA */}
          <CTABlock />

          {/* Author full */}
          <AuthorCardFull />

          {/* View counter (unique visitors only) */}
          <ViewCounter slug={slug} />

          {/* Related */}
          <RelatedArticles articles={ALL_ARTICLES} current={slug} />
        </article>
      </main>
      <Footer />

      {/* Schema */}
      <ArticleSchema
        title={article.title}
        description={article.excerpt}
        slug={slug}
        datePublished={article.date}
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: "https://dubsync.app/blog" },
          { name: article.title, url: `https://dubsync.app/blog/${slug}` },
        ]}
      />
    </div>
  );
}
