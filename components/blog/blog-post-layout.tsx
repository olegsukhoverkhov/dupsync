import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { AuthorCardInline, AuthorCardFull } from "./author-card";
import { CTABlock } from "./cta-block";
import { RelatedArticles } from "./related-articles";
import { ArticleSchema } from "./article-schema";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowLeft } from "lucide-react";

export const ALL_ARTICLES = [
  {
    slug: "what-is-ai-video-dubbing",
    title: "What is AI Video Dubbing? A Complete Guide for 2026",
    excerpt: "Learn how AI video dubbing works, from transcription to voice cloning to lip sync, and why it's replacing traditional dubbing.",
    date: "April 5, 2026",
    readingTime: "8 min read",
    category: "Guide",
  },
  {
    slug: "voice-cloning-video-translation",
    title: "How Voice Cloning Works in Video Translation",
    excerpt: "A deep dive into the voice cloning technology behind AI dubbing — how it preserves speaker identity across languages.",
    date: "April 5, 2026",
    readingTime: "7 min read",
    category: "Explainer",
  },
  {
    slug: "ai-dubbing-vs-traditional",
    title: "AI Dubbing vs Traditional Dubbing: Cost, Speed & Quality",
    excerpt: "We compare AI dubbing tools with traditional voice actors on cost, turnaround time, and output quality.",
    date: "April 5, 2026",
    readingTime: "7 min read",
    category: "Comparison",
  },
  {
    slug: "best-ai-dubbing-tools",
    title: "Best AI Dubbing Tools in 2026: Honest Comparison",
    excerpt: "We tested 8 AI dubbing platforms on the same video. Here's how DubSync, Rask AI, ElevenLabs, HeyGen, and others compare.",
    date: "April 10, 2026",
    readingTime: "12 min read",
    category: "Comparison",
  },
  {
    slug: "how-to-dub-youtube-video",
    title: "How to Dub a YouTube Video in 5 Minutes",
    excerpt: "Step-by-step tutorial: upload your YouTube video, choose languages, and get dubbed versions ready to publish.",
    date: "April 10, 2026",
    readingTime: "6 min read",
    category: "Tutorial",
  },
  {
    slug: "how-to-clone-voice-for-video",
    title: "How to Clone Your Voice for Video Translation",
    excerpt: "Learn how to create an AI clone of your voice for dubbing videos into other languages while keeping your identity.",
    date: "April 12, 2026",
    readingTime: "6 min read",
    category: "Tutorial",
  },
  {
    slug: "ai-dubbing-for-youtube",
    title: "AI Dubbing for YouTube: Grow Your Global Audience",
    excerpt: "How YouTube creators are using AI dubbing to reach viewers in 30+ languages and grow their channels faster.",
    date: "April 15, 2026",
    readingTime: "8 min read",
    category: "Use Case",
  },
];

export function BlogPostLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const article = ALL_ARTICLES.find((a) => a.slug === slug);
  if (!article) return null;

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
          <AuthorCardInline date={article.date} readingTime={article.readingTime} />

          {/* Article content */}
          <div className="prose-blog">
            {children}
          </div>

          {/* CTA */}
          <CTABlock />

          {/* Author full */}
          <AuthorCardFull />

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
        datePublished="2026-04-05"
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
