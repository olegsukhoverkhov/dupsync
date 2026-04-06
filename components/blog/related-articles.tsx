import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
}

export function RelatedArticles({
  articles,
  current,
}: {
  articles: Article[];
  current: string;
}) {
  const filtered = articles.filter((a) => a.slug !== current).slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="rounded-xl border border-white/10 bg-slate-800/50 p-5 hover:border-white/20 transition-all group"
          >
            <h3 className="text-sm font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-2 text-xs text-slate-500 line-clamp-2">
              {article.excerpt}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-pink-400">
              Read more <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
