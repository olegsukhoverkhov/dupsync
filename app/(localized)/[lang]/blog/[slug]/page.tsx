import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { isValidLocale, LOCALES } from "@/lib/i18n/dictionaries";
import { getBlogHreflang } from "@/lib/seo/blog-hreflang";
import { getArticleTranslation, TRANSLATED_SLUGS, type ArticleTranslation } from "@/lib/i18n/blog/translations";
import { AuthorCardInline, AuthorCardFull } from "@/components/blog/author-card";
import { CTABlock } from "@/components/blog/cta-block";
import { ArticleSchema } from "@/components/blog/article-schema";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES.filter((l) => l !== "en")) {
    for (const slug of Object.keys(TRANSLATED_SLUGS)) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === "en") return {};

  const article = await getArticleTranslation(lang, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://dubsync.app/${lang}/blog/${slug}`,
      languages: getBlogHreflang(slug),
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `https://dubsync.app/${lang}/blog/${slug}`,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function LocalizedBlogPost({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();

  const article = await getArticleTranslation(lang, slug);
  if (!article) redirect(`/${lang}/blog`);

  return (
    <>
      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "ja" ? "ブログに戻る" : lang === "de" ? "Zurück zum Blog" : lang === "fr" ? "Retour au blog" : lang === "pt" ? "Voltar ao blog" : "Volver al blog"}
          </Link>

          <span className="inline-block rounded-md border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-400 mb-4">
            {article.category}
          </span>

          <AuthorCardInline date={article.date} readingTime={article.readingTime} />

          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: article.content }} />

          <CTABlock />
          <AuthorCardFull />
        </article>
      </main>
      <ArticleSchema
        title={article.title}
        description={article.excerpt}
        slug={`${lang}/blog/${slug}`}
        datePublished="2026-04-05"
      />
      <BreadcrumbSchema
        items={[
          { name: "Blog", url: `https://dubsync.app/${lang}/blog` },
          { name: article.title, url: `https://dubsync.app/${lang}/blog/${slug}` },
        ]}
      />
    </>
  );
}
