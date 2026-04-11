import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { VsPage } from "@/components/vs/vs-page";
import { VS_COPY, type VsCompetitor, type VsLocale } from "@/lib/vs/copy";
import { LOCALES, isValidLocale } from "@/lib/i18n/dictionaries";

/**
 * Localized competitor comparison pages.
 *
 * Covers: 5 locales × 4 competitors = 20 static routes under
 *   /{lang}/vs/{rask-ai|heygen|elevenlabs|geckodub}
 *
 * All user-visible strings come from `lib/vs/translations.ts`, all layout/
 * structure from `components/vs/vs-page.tsx`. The per-route file is tiny
 * on purpose — it only handles routing, metadata, and breadcrumbs.
 */

const COMPETITORS: readonly VsCompetitor[] = [
  "rask-ai",
  "heygen",
  "elevenlabs",
  "geckodub",
] as const;

const LOCALIZED_LOCALES: readonly VsLocale[] = ["es", "pt", "de", "fr", "ja"];

function isLocalized(lang: string): lang is VsLocale {
  return (LOCALIZED_LOCALES as readonly string[]).includes(lang);
}
function isCompetitor(c: string): c is VsCompetitor {
  return (COMPETITORS as readonly string[]).includes(c);
}

export function generateStaticParams() {
  const out: Array<{ lang: string; competitor: string }> = [];
  for (const lang of LOCALES) {
    if (lang === "en" || !isLocalized(lang)) continue;
    for (const competitor of COMPETITORS) {
      out.push({ lang, competitor });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; competitor: string }>;
}): Promise<Metadata> {
  const { lang, competitor } = await params;
  if (!isValidLocale(lang) || lang === "en") return {};
  if (!isLocalized(lang) || !isCompetitor(competitor)) return {};

  const copy = VS_COPY[lang][competitor];

  // Build hreflang map: EN, all 5 localized, x-default → /vs/{competitor}
  const langAlternates: Record<string, string> = {};
  for (const l of LOCALES) {
    langAlternates[l] =
      l === "en"
        ? `https://dubsync.app/vs/${competitor}`
        : `https://dubsync.app/${l}/vs/${competitor}`;
  }
  langAlternates["x-default"] = `https://dubsync.app/vs/${competitor}`;

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `https://dubsync.app/${lang}/vs/${competitor}`,
      languages: langAlternates,
    },
    openGraph: {
      type: "website",
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: `https://dubsync.app/${lang}/vs/${competitor}`,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export default async function LocalizedVsCompetitorPage({
  params,
}: {
  params: Promise<{ lang: string; competitor: string }>;
}) {
  const { lang, competitor } = await params;
  if (!isValidLocale(lang) || lang === "en") notFound();
  if (!isLocalized(lang) || !isCompetitor(competitor)) notFound();

  const copy = VS_COPY[lang][competitor];

  // "Related comparisons" links: the other 3 competitors in the same locale
  const relatedLinks = COMPETITORS.filter((c) => c !== competitor).map((c) => ({
    label: VS_COPY[lang][c].h1,
    href: `/${lang}/vs/${c}`,
  }));
  // + link back to the full comparison page in this locale
  relatedLinks.unshift({
    label: copy.ctaSecondary,
    href: `/${lang}/compare`,
  });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: copy.breadcrumbCompare, url: `https://dubsync.app/${lang}/compare` },
          { name: copy.breadcrumbVs, url: `https://dubsync.app/${lang}/vs/${competitor}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: copy.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <VsPage
        copy={copy}
        backToCompareHref={`/${lang}/compare`}
        loginHref="/signup"
        relatedLinks={relatedLinks}
      />
    </>
  );
}
