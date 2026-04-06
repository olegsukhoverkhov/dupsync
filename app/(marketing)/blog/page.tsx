import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SORTED_ARTICLES, formatArticleDate } from "@/components/blog/blog-post-layout";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "DubSync Blog — AI Video Dubbing Insights & Guides",
  description:
    "Tutorials, comparisons, and guides on AI video dubbing, voice cloning, and video localization. Written by the DubSync team.",
};

export default function BlogPage() {
  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold">
              DubSync <span className="gradient-text">Blog</span>
            </h1>
            <p className="mt-3 text-slate-400">
              Tutorials, comparisons, and guides on AI video dubbing
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SORTED_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-2xl border border-white/10 bg-slate-800/40 p-6 hover:border-white/20 hover:bg-slate-800/60 transition-all"
              >
                <span className="inline-block rounded-md border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-xs font-medium text-pink-400 mb-3">
                  {article.category}
                </span>
                <h2 className="text-base font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatArticleDate(article.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readingTime}
                    </span>
                  </div>
                  <span className="text-xs text-pink-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <BreadcrumbSchema items={[{ name: "Blog", url: "https://dubsync.app/blog" }]} />
    </div>
  );
}
