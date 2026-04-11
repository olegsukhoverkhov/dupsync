import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import type { VsCopy } from "@/lib/vs/copy";

/**
 * Shared renderer for DubSync-vs-competitor comparison pages. Consumed by
 * both the EN routes under `(marketing)/vs/*` and the localized dynamic
 * route `(localized)/[lang]/vs/[competitor]/page.tsx`.
 *
 * Keeping the markup in one place guarantees every language ships the
 * same SEO signals (H2 order, tables, FAQ accordion, CTA) — translators
 * only change strings in `lib/vs/copy.ts`, never the structure.
 */
export function VsPage({
  copy,
  backToCompareHref,
  loginHref = "/login",
  relatedLinks = [],
}: {
  copy: VsCopy;
  /** Href for "See Full Comparison" CTA — usually `/compare` or `/{lang}/compare`. */
  backToCompareHref: string;
  loginHref?: string;
  /** Optional: links to other comparison pages shown at the bottom. */
  relatedLinks?: Array<{ label: string; href: string }>;
}) {
  const FeatureIcon = ({ value }: { value: boolean }) =>
    value ? (
      <Check className="h-4 w-4 text-green-400" />
    ) : (
      <X className="h-4 w-4 text-red-400/60" />
    );

  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-16">
        <span className="inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400 mb-6">
          {copy.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          {copy.h1}
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
          {copy.heroSubtitle}
        </p>
      </section>

      {/* Quick Verdict */}
      <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
        <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8">
          <h2 className="text-xl font-bold text-white mb-3">
            {copy.verdictHeading}
          </h2>
          <p className="text-slate-400 leading-relaxed">{copy.verdictBody}</p>
        </div>
      </section>

      {/* Lip Sync Comparison Table */}
      <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          {copy.lipSyncHeading}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <caption className="sr-only">
              {copy.h1} — {copy.lipSyncHeading}
            </caption>
            <thead>
              <tr className="border-b border-white/10">
                <th
                  scope="col"
                  className="text-left p-4 text-slate-400 font-medium"
                >
                  {copy.featureRowsLabel.feature}
                </th>
                <th
                  scope="col"
                  className="p-4 text-pink-400 font-medium bg-pink-500/10"
                >
                  DubSync
                </th>
                <th
                  scope="col"
                  className="p-4 text-slate-400 font-medium"
                >
                  {copy.competitorName}
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.lipSyncRows.map((row) => (
                <tr key={row.feature} className="border-b border-white/5">
                  <th
                    scope="row"
                    className="p-4 text-slate-300 font-normal text-left"
                  >
                    {row.feature}
                  </th>
                  <td
                    className={`p-4 bg-pink-500/10 text-center font-medium ${
                      row.dubsyncTone === "good"
                        ? "text-green-400"
                        : "text-slate-300"
                    }`}
                  >
                    {row.dubsync}
                  </td>
                  <td
                    className={`p-4 text-center font-medium ${
                      row.competitorTone === "bad"
                        ? "text-red-400"
                        : row.competitorTone === "good"
                          ? "text-green-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {row.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          {copy.pricingHeading}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
            <h3 className="text-lg font-bold text-pink-400 mb-4">
              {copy.dubsyncPricingLabel}
            </h3>
            <div className="space-y-3">
              {copy.dubsyncPricingItems.map((item) => (
                <div key={item.plan} className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.plan}</span>
                  <span className="text-white font-medium">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              {copy.dubsyncPricingNote}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {copy.competitorPricingLabel}
            </h3>
            <div className="space-y-3">
              {copy.competitorPricingItems.map((item) => (
                <div key={item.plan} className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.plan}</span>
                  <span className="text-white font-medium">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              {copy.competitorPricingNote}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          {copy.featureHeading}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <caption className="sr-only">
              {copy.h1} — {copy.featureHeading}
            </caption>
            <thead>
              <tr className="border-b border-white/10">
                <th
                  scope="col"
                  className="text-left p-4 text-slate-400 font-medium"
                >
                  {copy.featureRowsLabel.feature}
                </th>
                <th
                  scope="col"
                  className="p-4 text-pink-400 font-medium bg-pink-500/10"
                >
                  DubSync
                </th>
                <th
                  scope="col"
                  className="p-4 text-slate-400 font-medium"
                >
                  {copy.competitorName}
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.featureRows.map((f) => (
                <tr key={f.feature} className="border-b border-white/5">
                  <th
                    scope="row"
                    className="p-4 text-slate-300 font-normal text-left"
                  >
                    {f.feature}
                  </th>
                  <td className="p-4 bg-pink-500/10 text-center">
                    <div className="flex justify-center">
                      <FeatureIcon value={f.dubsync} />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <FeatureIcon value={f.competitor} />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-b border-white/5">
                <th
                  scope="row"
                  className="p-4 text-slate-300 font-normal text-left"
                >
                  {copy.featureRowsLabel.languages}
                </th>
                <td className="p-4 bg-pink-500/10 text-center text-slate-300">
                  {copy.languagesDubsync}
                </td>
                <td className="p-4 text-center text-slate-300">
                  {copy.languagesCompetitor}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <th
                  scope="row"
                  className="p-4 text-slate-300 font-normal text-left"
                >
                  {copy.featureRowsLabel.cost}
                </th>
                <td className="p-4 bg-pink-500/10 text-center text-green-400 font-medium">
                  {copy.costDubsync}
                </td>
                <td className="p-4 text-center text-red-400 font-medium">
                  {copy.costCompetitor}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Where each wins */}
      <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {copy.whereCompetitorWinsHeading}
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {copy.whereCompetitorWins.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {copy.whereDubsyncWinsHeading}
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {copy.whereDubsyncWins.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Migration guide */}
      <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-6">
          {copy.migrationHeading}
        </h2>
        <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
          <ol className="space-y-4 text-sm text-slate-400">
            {copy.migrationSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">{copy.faqHeading}</h2>
        <div className="space-y-4">
          {copy.faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      {relatedLinks.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 lg:px-8 mb-16">
          <h2 className="text-lg font-semibold text-white mb-4">
            {copy.relatedHeading}
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-600/10 p-10">
          <h2 className="text-2xl font-bold text-white">{copy.ctaHeading}</h2>
          <p className="mt-3 text-slate-400">{copy.ctaSubtitle}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={loginHref}
              className="inline-flex items-center justify-center gap-2 gradient-button rounded-xl px-6 py-3 text-sm font-semibold"
            >
              {copy.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={backToCompareHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
