/**
 * Competitor-comparison copy, localized.
 *
 * Keys:     4 competitors × 10 non-EN languages = 40 pages
 * Rendered: components/vs/vs-page.tsx
 * Routes:   app/(localized)/[lang]/vs/[competitor]/page.tsx
 *
 * Each competitor has a fixed set of comparison rows and FAQs — what differs
 * between locales is the **copy**. We keep the shape identical across all
 * locales so the shared renderer can iterate one schema.
 */

export type VsCompetitor = "rask-ai" | "heygen" | "elevenlabs" | "geckodub";
export type VsLocale = "es" | "pt" | "de" | "fr" | "ja" | "hi" | "ar" | "id" | "tr" | "ko" | "zh";

export type VsRow = {
  feature: string;
  dubsync: string;
  competitor: string;
  /** "good" = green DubSync, "bad" = red competitor, "neutral" = grey */
  dubsyncTone: "good" | "neutral";
  competitorTone: "good" | "neutral" | "bad";
};

export type VsFeature = { feature: string; dubsync: boolean; competitor: boolean };

export type VsCopy = {
  /** SEO meta — shows in <head>. */
  metaTitle: string;
  metaDescription: string;
  /** Visible content on page. */
  eyebrow: string; // "Comparison"
  h1: string; // "DubSync vs Rask AI"
  heroSubtitle: string;
  verdictHeading: string; // "Quick verdict"
  verdictBody: string;
  lipSyncHeading: string;
  lipSyncRows: VsRow[];
  pricingHeading: string;
  dubsyncPricingLabel: string;
  dubsyncPricingNote: string;
  competitorName: string; // "Rask AI" — used in tables + pricing column header
  competitorPricingLabel: string;
  competitorPricingNote: string;
  competitorPricingItems: Array<{ plan: string; price: string }>;
  dubsyncPricingItems: Array<{ plan: string; price: string }>;
  featureHeading: string;
  featureRowsLabel: { feature: string; languages: string; cost: string };
  featureRows: VsFeature[];
  languagesDubsync: string;
  languagesCompetitor: string;
  costDubsync: string;
  costCompetitor: string;
  whereCompetitorWinsHeading: string;
  whereDubsyncWinsHeading: string;
  whereCompetitorWins: string[];
  whereDubsyncWins: string[];
  migrationHeading: string;
  migrationSteps: string[];
  faqHeading: string;
  faqs: Array<{ q: string; a: string }>;
  relatedHeading: string;
  ctaHeading: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  breadcrumbCompare: string;
  breadcrumbVs: string;
};

/** Shared static data — numbers are identical in every locale, only strings differ. */
const COMPETITOR_FEATURE_MATRIX: Record<VsCompetitor, {
  lipSyncRows: Omit<VsRow, "feature">[];
  featureRows: Omit<VsFeature, "feature">[];
  languagesDubsync: string;
  languagesCompetitor: string;
  costDubsync: string;
  costCompetitor: string;
  dubsyncItems: Array<{ plan: string; price: string }>;
  competitorItems: Array<{ plan: string; price: string }>;
}> = {
  "rask-ai": {
    lipSyncRows: [
      { dubsync: "20", competitor: "✗ (requires $120 plan)", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "1x", competitor: "2x", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "50 min", competitor: "~50 min (from 100, halved)", dubsyncTone: "good", competitorTone: "neutral" },
      { dubsync: "30", competitor: "60", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "$19.99/mo", competitor: "$120/mo", dubsyncTone: "good", competitorTone: "bad" },
    ],
    featureRows: [
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: false },
    ],
    languagesDubsync: "30+",
    languagesCompetitor: "130+",
    costDubsync: "$1.00",
    costCompetitor: "$2.40",
    dubsyncItems: [
      { plan: "Free", price: "$0 — 1 video (15s)" },
      { plan: "Starter", price: "$19.99/mo — 20 min" },
      { plan: "Pro", price: "$49.99/mo — 50 min" },
      { plan: "Business", price: "$149.99/mo — 150 min" },
    ],
    competitorItems: [
      { plan: "Creator", price: "$50/mo — 25 min (no lip sync)" },
      { plan: "Creator Pro", price: "$120/mo — 100 min (50 lip sync)" },
      { plan: "Business", price: "$600/mo — Custom" },
    ],
  },
  heygen: {
    lipSyncRows: [
      { dubsync: "20 min", competitor: "shared pool", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "1x dedicated", competitor: "shared w/ avatars", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "no surcharges", competitor: "premium credits", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "$19.99/mo", competitor: "$29/mo*", dubsyncTone: "good", competitorTone: "neutral" },
      { dubsync: "predictable", competitor: "varies by feature mix", dubsyncTone: "good", competitorTone: "neutral" },
    ],
    featureRows: [
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: false },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: false, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
    ],
    languagesDubsync: "30+",
    languagesCompetitor: "175+",
    costDubsync: "$1.00",
    costCompetitor: "varies",
    dubsyncItems: [
      { plan: "Free", price: "$0 — 1 video (15s)" },
      { plan: "Starter", price: "$19.99/mo — 20 min" },
      { plan: "Pro", price: "$49.99/mo — 50 min" },
      { plan: "Business", price: "$149.99/mo — 150 min" },
    ],
    competitorItems: [
      { plan: "Free", price: "$0 — watermark" },
      { plan: "Creator", price: "$29/mo — shared credits" },
      { plan: "Team", price: "$89/mo — shared credits" },
      { plan: "Enterprise", price: "Custom" },
    ],
  },
  elevenlabs: {
    lipSyncRows: [
      { dubsync: "included", competitor: "✗ not offered", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "yes (MP4)", competitor: "audio only", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "mouth tracking", competitor: "no video sync", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "$19.99/mo", competitor: "$22/mo", dubsyncTone: "good", competitorTone: "neutral" },
      { dubsync: "$1.00/min", competitor: "audio only", dubsyncTone: "good", competitorTone: "bad" },
    ],
    featureRows: [
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: false },
      { dubsync: true, competitor: false },
      { dubsync: true, competitor: false },
      { dubsync: true, competitor: false },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: false },
      { dubsync: false, competitor: true },
      { dubsync: false, competitor: true },
    ],
    languagesDubsync: "30+",
    languagesCompetitor: "29+",
    costDubsync: "$1.00",
    costCompetitor: "audio only",
    dubsyncItems: [
      { plan: "Free", price: "$0 — 1 video (15s)" },
      { plan: "Starter", price: "$19.99/mo — 20 min" },
      { plan: "Pro", price: "$49.99/mo — 50 min" },
      { plan: "Business", price: "$149.99/mo — 150 min" },
    ],
    competitorItems: [
      { plan: "Free", price: "$0 — 10k chars" },
      { plan: "Starter", price: "$5/mo — 30k chars" },
      { plan: "Creator", price: "$22/mo — 100k chars" },
      { plan: "Pro", price: "$99/mo — 500k chars" },
    ],
  },
  geckodub: {
    lipSyncRows: [
      { dubsync: "20 min", competitor: "7 min", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "unified pool", competitor: "split pool", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "1x credit", competitor: "different pool", dubsyncTone: "good", competitorTone: "bad" },
      { dubsync: "$19.99/mo", competitor: "$19/mo", dubsyncTone: "good", competitorTone: "neutral" },
      { dubsync: "no surcharge", competitor: "extra for lip sync", dubsyncTone: "good", competitorTone: "bad" },
    ],
    featureRows: [
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: false },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: false },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: true },
      { dubsync: true, competitor: false },
    ],
    languagesDubsync: "30+",
    languagesCompetitor: "60+",
    costDubsync: "$1.00",
    costCompetitor: "$2.70 (lip sync)",
    dubsyncItems: [
      { plan: "Free", price: "$0 — 1 video (15s)" },
      { plan: "Starter", price: "$19.99/mo — 20 min" },
      { plan: "Pro", price: "$49.99/mo — 50 min" },
      { plan: "Business", price: "$149.99/mo — 150 min" },
    ],
    competitorItems: [
      { plan: "Free", price: "$0 — watermark" },
      { plan: "Starter", price: "$19/mo — 10 min (7 lip sync)" },
      { plan: "Creator", price: "$49/mo — 30 min (15 lip sync)" },
      { plan: "Pro", price: "$149/mo — 100 min" },
    ],
  },
};

/**
 * Compact helper: given a per-locale strings bundle, merge it with the static
 * numeric matrix into a full VsCopy.
 */
type LocaleStrings = {
  eyebrow: string;
  heroSubtitle: string;
  verdictHeading: string;
  verdictBody: string;
  lipSyncHeading: string;
  lipSyncFeatures: string[]; // 5 labels
  pricingHeading: string;
  dubsyncPricingLabel: string;
  dubsyncPricingNote: string;
  competitorPricingLabel: string;
  competitorPricingNote: string;
  featureHeading: string;
  featureLabels: string[]; // 9 feature labels
  featureFoot: { feature: string; languages: string; cost: string };
  whereCompetitorWinsHeading: string;
  whereDubsyncWinsHeading: string;
  whereCompetitorWins: string[];
  whereDubsyncWins: string[];
  migrationHeading: string;
  migrationSteps: string[];
  faqHeading: string;
  faqs: Array<{ q: string; a: string }>;
  relatedHeading: string;
  ctaHeading: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  breadcrumbCompare: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
};

function mergeCopy(
  competitor: VsCompetitor,
  competitorName: string,
  breadcrumbVs: string,
  s: LocaleStrings
): VsCopy {
  const matrix = COMPETITOR_FEATURE_MATRIX[competitor];
  return {
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription,
    eyebrow: s.eyebrow,
    h1: s.h1,
    heroSubtitle: s.heroSubtitle,
    verdictHeading: s.verdictHeading,
    verdictBody: s.verdictBody,
    lipSyncHeading: s.lipSyncHeading,
    lipSyncRows: matrix.lipSyncRows.map((r, i) => ({ ...r, feature: s.lipSyncFeatures[i] })),
    pricingHeading: s.pricingHeading,
    dubsyncPricingLabel: s.dubsyncPricingLabel,
    dubsyncPricingNote: s.dubsyncPricingNote,
    competitorName,
    competitorPricingLabel: s.competitorPricingLabel,
    competitorPricingNote: s.competitorPricingNote,
    competitorPricingItems: matrix.competitorItems,
    dubsyncPricingItems: matrix.dubsyncItems,
    featureHeading: s.featureHeading,
    featureRowsLabel: s.featureFoot,
    featureRows: matrix.featureRows.map((r, i) => ({ ...r, feature: s.featureLabels[i] })),
    languagesDubsync: matrix.languagesDubsync,
    languagesCompetitor: matrix.languagesCompetitor,
    costDubsync: matrix.costDubsync,
    costCompetitor: matrix.costCompetitor,
    whereCompetitorWinsHeading: s.whereCompetitorWinsHeading,
    whereDubsyncWinsHeading: s.whereDubsyncWinsHeading,
    whereCompetitorWins: s.whereCompetitorWins,
    whereDubsyncWins: s.whereDubsyncWins,
    migrationHeading: s.migrationHeading,
    migrationSteps: s.migrationSteps,
    faqHeading: s.faqHeading,
    faqs: s.faqs,
    relatedHeading: s.relatedHeading,
    ctaHeading: s.ctaHeading,
    ctaSubtitle: s.ctaSubtitle,
    ctaPrimary: s.ctaPrimary,
    ctaSecondary: s.ctaSecondary,
    breadcrumbCompare: s.breadcrumbCompare,
    breadcrumbVs,
  };
}

// Import the actual locale data from the translations file so the matrix
// above stays colocated with the English source of truth.
import { VS_LOCALIZED_STRINGS } from "./translations";

export const VS_COPY: Record<VsLocale, Record<VsCompetitor, VsCopy>> = (() => {
  const out = {} as Record<VsLocale, Record<VsCompetitor, VsCopy>>;
  const competitors: Array<{ slug: VsCompetitor; name: string; vsBreadcrumb: string }> = [
    { slug: "rask-ai", name: "Rask AI", vsBreadcrumb: "DubSync vs Rask AI" },
    { slug: "heygen", name: "HeyGen", vsBreadcrumb: "DubSync vs HeyGen" },
    { slug: "elevenlabs", name: "ElevenLabs", vsBreadcrumb: "DubSync vs ElevenLabs" },
    { slug: "geckodub", name: "GeckoDub", vsBreadcrumb: "DubSync vs GeckoDub" },
  ];
  const locales: VsLocale[] = ["es", "pt", "de", "fr", "ja", "hi", "ar", "id", "tr", "ko", "zh"];
  for (const lang of locales) {
    out[lang] = {} as Record<VsCompetitor, VsCopy>;
    for (const c of competitors) {
      const strings = VS_LOCALIZED_STRINGS[lang][c.slug];
      out[lang][c.slug] = mergeCopy(c.slug, c.name, strings.h1, strings);
    }
  }
  return out;
})();
