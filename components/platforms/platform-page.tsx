import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { PLATFORM_META, type PlatformKey } from "./icons";

interface Step {
  title: string;
  description: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface PlatformPageProps {
  platformKey: PlatformKey;
  h1: string;
  subtitle: string;
  stat: string;
  cta: string;
  steps: Step[];
  benefits: Benefit[];
  faqs: FaqItem[];
  internalLinks: { label: string; href: string }[];
}

export function PlatformPage({
  platformKey,
  h1,
  subtitle,
  stat,
  cta,
  steps,
  benefits,
  faqs,
  internalLinks,
}: PlatformPageProps) {
  const platform = PLATFORM_META[platformKey];
  const Icon = platform.icon;
  const otherPlatforms = (Object.keys(PLATFORM_META) as PlatformKey[]).filter(
    (k) => k !== platformKey
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="landing-dark bg-[#0F172A] text-white min-h-screen">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Platforms", url: "https://dubsync.app/platforms" },
          { name: platform.name, url: `https://dubsync.app${platform.href}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8 text-center mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-400">
            <Icon className="h-4 w-4" /> {platform.name}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {h1}
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="mt-4 inline-block rounded-full border border-white/10 bg-slate-800/40 px-4 py-1.5 text-sm text-zinc-300">
            {stat}
          </div>
          <div className="mt-8">
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-6 py-3 text-sm font-medium"
            >
              {cta}
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How it <span className="gradient-text">works</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key benefits */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Key <span className="gradient-text">benefits</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Also works with */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mb-24">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">
            Also works with
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {otherPlatforms.map((key) => {
              const p = PLATFORM_META[key];
              const PIcon = p.icon;
              return (
                <Link
                  key={key}
                  href={p.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
                >
                  <PIcon className="h-4 w-4" />
                  {p.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-24 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{cta}</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Free plan includes 1 video up to 15 seconds. No credit card
              required.
            </p>
            <Link
              href="/signup"
              className="gradient-button inline-block rounded-lg px-8 py-3 text-sm font-medium"
            >
              Get started free
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 lg:px-8 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <FaqAccordion items={faqs} />
        </section>

        {/* Internal links */}
        <section className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-zinc-300">
            Learn more
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-800/30 px-5 py-2 text-sm text-zinc-300 hover:border-pink-500/30 transition-colors"
              >
                {link.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
