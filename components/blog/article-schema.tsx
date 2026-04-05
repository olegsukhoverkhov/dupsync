import { getAuthorSchema } from "./author-card";

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
}

export function ArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: getAuthorSchema(),
    publisher: {
      "@type": "Organization",
      name: "DubSync",
      logo: {
        "@type": "ImageObject",
        url: "https://dubsync.app/logo.png",
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: `https://dubsync.app/blog/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
