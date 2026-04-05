import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { isValidLocale, LOCALES } from "@/lib/i18n/dictionaries";
import { getArticlesList } from "@/lib/i18n/blog/translations";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, Clock } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export async function generateStaticParams() {
  return LOCALES.filter((l) => l !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    es: "DubSync Blog — Guías de Doblaje de Video con IA",
    pt: "DubSync Blog — Guias de Dublagem de Vídeo com IA",
    de: "DubSync Blog — KI-Videosynchronisation Guides",
    fr: "DubSync Blog — Guides de Doublage Vidéo par IA",
    ja: "DubSync Blog — AI動画吹き替えガイド",
  };
  return { title: titles[lang] || "DubSync Blog" };
}

export default async function LocalizedBlogListing({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();

  const articles = await getArticlesList(lang);
  const blogLabel: Record<string, string> = {
    es: "Blog", pt: "Blog", de: "Blog", fr: "Blog", ja: "ブログ",
  };

  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold">
              DubSync <span className="gradient-text">{blogLabel[lang]}</span>
            </h1>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/${lang}/blog/${article.slug}`}
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
                  <span className="flex items-center gap-1 text-xs text-slate-600">
                    <Clock className="h-3 w-3" />
                    {article.readingTime}
                  </span>
                  <span className="text-xs text-pink-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <BreadcrumbSchema items={[{ name: blogLabel[lang] || "Blog", url: `https://dubsync.app/${lang}/blog` }]} />
    </div>
  );
}
