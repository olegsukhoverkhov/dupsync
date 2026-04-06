"use client";

import Link from "next/link";
import {
  ArrowRight,
  Users,
  Clock,
  Globe,
  Mic,
  Scan,
  Zap,
  Sparkles,
  Code,
  Upload,
  Cpu,
  Download,
  Star,
  Check,
  ChevronDown,
  Play,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";
import { DemoSection } from "./demo-section";
import { Examples } from "./examples";
import { Testimonials } from "./testimonials";
import { ComparisonBlock } from "./comparison-block";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Safe accessor for nested dict keys that may not exist in all locales. */
function d(obj: any, path: string, fallback: string): string {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return fallback;
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : fallback;
}

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

function Header({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: d(dict, "header.features", "Features"), href: `/${lang}/features` },
    { label: d(dict, "header.pricing", dict.header.pricing ?? "Pricing"), href: `/${lang}/pricing` },
    { label: d(dict, "header.compare", "Compare"), href: `/${lang}/compare` },
    { label: d(dict, "header.blog", "Blog"), href: `/${lang}/blog` },
    { label: d(dict, "header.about", "About"), href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "glass border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={lang === "en" ? "/" : `/${lang}`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
              <Languages className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DubSync</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher current={lang} />
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {dict.header.login}
            </Link>
            <Link href="/signup" className="gradient-button rounded-lg px-4 py-2 text-sm font-medium">
              {dict.header.getStarted}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex sm:hidden h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/5 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-3">
              <LanguageSwitcher current={lang} />
            </div>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors"
            >
              {dict.header.login}
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block gradient-button rounded-xl mx-4 px-4 py-3 text-sm font-medium text-center"
            >
              {dict.header.getStarted}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 mb-8">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            {dict.hero.badge}
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            {dict.hero.title1} <span className="gradient-text">{dict.hero.title2}</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
            {dict.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold"
            >
              {d(dict, "hero.ctaPrimary", "Dub Your First Video Free")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Play className="h-4 w-4" /> {dict.hero.ctaSecondary}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-500" />
              {d(dict, "hero.noWatermark", "No watermark")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-500" />
              {d(dict, "hero.lipSyncIncluded", "Lip sync included")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-500" />
              {d(dict, "hero.noCreditCard", "No credit card required")}
            </span>
          </div>

          <div className="mt-8 flex items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                <strong className="text-slate-300">2,000+</strong> {dict.hero.creators}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                <strong className="text-slate-300">50M+</strong> {dict.hero.minDubbed}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>
                <strong className="text-slate-300">30+</strong> {dict.hero.languages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  LogoBar                                                                   */
/* -------------------------------------------------------------------------- */

function LogoBar({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-y border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm text-zinc-500">{dict.logoBar.trusted}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  HowItWorks                                                               */
/* -------------------------------------------------------------------------- */

function HowItWorks({ dict }: { dict: Dictionary }) {
  const steps = [
    { icon: Upload, step: "Step 1", title: dict.howItWorks.step1title, desc: dict.howItWorks.step1desc },
    { icon: Cpu, step: "Step 2", title: dict.howItWorks.step2title, desc: dict.howItWorks.step2desc },
    { icon: Download, step: "Step 3", title: dict.howItWorks.step3title, desc: dict.howItWorks.step3desc },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">{dict.howItWorks.title}</h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">{dict.howItWorks.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s) => (
            <div key={s.step} className="rounded-2xl border border-white/10 bg-slate-800/30 p-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                <s.icon className="h-6 w-6 text-pink-400" />
              </div>
              <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1">{s.step}</p>
              <h3 className="text-lg font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features                                                                  */
/* -------------------------------------------------------------------------- */

function Features({ dict }: { dict: Dictionary }) {
  const items = [
    { icon: Mic, title: dict.features.voiceCloning, desc: dict.features.voiceCloningDesc },
    { icon: Scan, title: dict.features.lipSync, desc: dict.features.lipSyncDesc },
    { icon: Globe, title: dict.features.languages, desc: dict.features.languagesDesc },
    { icon: Zap, title: dict.features.speed, desc: dict.features.speedDesc },
    { icon: Sparkles, title: dict.features.quality, desc: dict.features.qualityDesc },
    { icon: Code, title: dict.features.api, desc: dict.features.apiDesc },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">{dict.features.title}</h2>
          <p className="mt-4 text-slate-400 text-lg">{dict.features.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 hover:bg-slate-800/60 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  UseCases (inline, dict-driven with fallbacks)                             */
/* -------------------------------------------------------------------------- */

function UseCasesSection({ dict }: { dict: Dictionary }) {
  const useCases = [
    {
      icon: "\u{1F3AC}",
      title: d(dict, "useCases.youtube", "YouTube & Content Creators"),
      description: d(dict, "useCases.youtubeDesc", "Reach global audiences by dubbing your videos into 30+ languages. Grow subscribers and revenue without re-shooting content."),
      badge: d(dict, "useCases.youtubeBadge", "10x audience reach"),
    },
    {
      icon: "\u{1F393}",
      title: d(dict, "useCases.elearning", "E-Learning & Online Courses"),
      description: d(dict, "useCases.elearningDesc", "Make courses accessible worldwide. Dub lectures, tutorials, and training videos while keeping instructor voice and personality."),
      badge: d(dict, "useCases.elearningBadge", "Udemy, Coursera, LMS"),
    },
    {
      icon: "\u{1F4C8}",
      title: d(dict, "useCases.marketing", "Marketing & Product Teams"),
      description: d(dict, "useCases.marketingDesc", "Localize product demos, ads, and onboarding videos for every market. Launch campaigns in 30+ languages simultaneously."),
      badge: d(dict, "useCases.marketingBadge", "15 markets, 1 video"),
    },
    {
      icon: "\u{1F399}\uFE0F",
      title: d(dict, "useCases.podcasts", "Podcasts & Media"),
      description: d(dict, "useCases.podcastsDesc", "Expand your podcast to new language markets. AI preserves your voice, tone, and delivery in every language."),
      badge: d(dict, "useCases.podcastsBadge", "Same voice, new language"),
    },
  ];

  return (
    <section id="use-cases" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {d(dict, "useCases.title", "Built for your workflow")}
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            {d(dict, "useCases.subtitle", "See how teams like yours use DubSync")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {useCases.map((uc) => (
            <div key={uc.title} className="rounded-2xl border border-white/10 bg-slate-800/40 p-6">
              <span className="text-[40px] leading-none" role="img" aria-label={uc.title}>
                {uc.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{uc.title}</h3>
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">{uc.description}</p>
              <span className="mt-4 inline-block rounded-md border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-xs text-pink-400">
                {uc.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  RoiCalculator (inline, dict-driven with fallbacks)                        */
/* -------------------------------------------------------------------------- */

function RoiCalculatorSection({ dict }: { dict: Dictionary }) {
  const rows = [
    {
      metric: d(dict, "roi.costPerLang", "Cost per language"),
      traditional: "$3,000 \u2013 $5,000",
      dubsync: "From $1/min",
    },
    {
      metric: d(dict, "roi.timeFor10min", "Time for 10-min video"),
      traditional: "1\u20133 weeks",
      dubsync: "3 minutes",
    },
    {
      metric: d(dict, "roi.simultaneous", "Simultaneous languages"),
      traditional: "1",
      dubsync: "30+",
    },
    {
      metric: d(dict, "roi.voiceActors", "Voice actors needed"),
      traditional: "Yes",
      dubsync: "No \u2014 AI voice cloning",
    },
    {
      metric: d(dict, "roi.lipSync", "Lip sync"),
      traditional: "Manual work",
      dubsync: "Automatic",
    },
    {
      metric: d(dict, "roi.totalCost", "10-min video \u00D7 5 languages"),
      traditional: "~$20,000",
      dubsync: "~$50",
    },
  ];

  return (
    <section id="roi" className="py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {d(dict, "roi.title", "Why pay thousands for dubbing?")}
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            {d(dict, "roi.subtitle", "See how much you save with AI-powered dubbing")}
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of traditional dubbing costs versus DubSync AI dubbing
            </caption>
            <thead>
              <tr>
                <th scope="col" className="bg-slate-800/60 px-6 py-4 text-sm font-semibold text-white">
                  &nbsp;
                </th>
                <th scope="col" className="bg-slate-800/60 px-6 py-4 text-sm font-semibold text-slate-500">
                  {d(dict, "roi.traditional", "Traditional Dubbing")}
                </th>
                <th scope="col" className="bg-slate-800/60 px-6 py-4 text-sm font-semibold text-green-400">
                  DubSync
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.metric} className={index < rows.length - 1 ? "border-b border-white/10" : undefined}>
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    {row.metric}
                  </th>
                  <td className="px-6 py-4 text-slate-500">{row.traditional}</td>
                  <td className="px-6 py-4 text-green-400 font-medium">{row.dubsync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:shadow-pink-500/40 hover:brightness-110"
          >
            {d(dict, "roi.cta", "Save 99% on dubbing costs \u2014 Start Free")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

function Pricing({ dict }: { dict: Dictionary }) {
  const plans: { key: PlanType; popular?: boolean }[] = [
    { key: "free" },
    { key: "starter" },
    { key: "pro", popular: true },
    { key: "enterprise" },
  ];
  return (
    <section id="pricing" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">{dict.pricing.title}</h2>
          <p className="mt-4 text-slate-400 text-lg">{dict.pricing.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map(({ key, popular }) => {
            const plan = PLAN_LIMITS[key];
            return (
              <div
                key={key}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  popular ? "gradient-border" : "border border-white/10 bg-slate-800/50"
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-button rounded-full px-3 py-1 text-xs font-semibold">
                    {dict.pricing.mostPopular}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-white">${plan.price / 100}</span>
                  {plan.price > 0 && <span className="text-slate-500 ml-1">{dict.pricing.perMonth}</span>}
                </div>
                <ul className="space-y-3 mt-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-pink-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    popular ? "gradient-button" : "border border-white/10 text-white hover:bg-white/5"
                  }`}
                >
                  {key === "free" ? dict.pricing.getStarted : dict.pricing.startTrial}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ (inline, dict-driven + FAQPage schema)                                */
/* -------------------------------------------------------------------------- */

const EN_FAQS = [
  {
    q: "How does voice cloning work?",
    a: "DubSync uses AI to analyze the speaker\u2019s voice characteristics \u2014 pitch, tone, accent, and emotion \u2014 from the original video. It then generates new speech in the target language that preserves these characteristics, so the dubbed version sounds like the same person speaking a different language.",
  },
  {
    q: "What video formats are supported?",
    a: "DubSync supports MP4, MOV, AVI, WebM, and MKV formats. The maximum file size depends on your plan: 100MB for Free, 500MB for Starter, 2GB for Pro, and 5GB for Enterprise.",
  },
  {
    q: "How long does dubbing take?",
    a: "Most videos are processed in 2-5 minutes. A typical 10-minute video takes about 3 minutes to dub into one language. You can dub into multiple languages simultaneously \u2014 they all process in parallel.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The free plan includes 1 video up to 15 seconds with lip sync and voice cloning. No credit card required.",
  },
  {
    q: "How accurate is the lip sync?",
    a: "DubSync uses AI lip-sync technology to automatically adjust mouth movements to match the new audio. Our users report a 95-98% accuracy rate, making it nearly indistinguishable from native speech.",
  },
  {
    q: "Can I edit the translation before dubbing?",
    a: "Yes. After the AI generates the translation, you can review and edit the script before generating the final dubbed audio. This gives you full control over the accuracy and tone of the translation.",
  },
  {
    q: "What languages does DubSync support?",
    a: "DubSync supports over 30 languages including Spanish, French, German, Japanese, Korean, Chinese (Mandarin), Hindi, Arabic, Portuguese, Italian, Turkish, Indonesian, Russian, Polish, Dutch, Swedish, and more.",
  },
  {
    q: "Can DubSync handle multiple speakers in one video?",
    a: "Yes. DubSync automatically detects and separates multiple speakers, cloning each voice individually. This works great for interviews, panel discussions, podcasts, and multi-speaker presentations.",
  },
  {
    q: "How much does AI video dubbing cost?",
    a: "DubSync offers a free plan (1 video up to 15 seconds), Starter at $19.99/month (20 credits), Pro at $49.99/month (50 credits), and Business at $149.99/month (150 credits). Annual billing saves 20%. Every credit includes lip sync.",
  },
  {
    q: "What does 1 credit mean in DubSync?",
    a: "1 credit = 1 minute of dubbed video in 1 target language, always with lip sync included. A 5-minute video into 3 languages uses 15 credits. No hidden multipliers.",
  },
  {
    q: "Does DubSync include lip sync on all plans?",
    a: "Yes. Every paid plan includes lip sync in every credit \u2014 no extra charges, no separate pools, no credit multipliers. Even the free plan includes lip sync.",
  },
  {
    q: "Is DubSync better than traditional dubbing?",
    a: "For digital content, marketing videos, e-learning, and social media \u2014 yes. AI dubbing is 10-100x faster and more affordable. Traditional dubbing studios still excel for theatrical releases where maximum emotional nuance is required.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-white pr-4">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-slate-500 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function FaqSection({ dict }: { dict: Dictionary }) {
  // Use dict faq items if available, otherwise fall back to EN_FAQS
  const faqItems: { q: string; a: string }[] = [];
  for (let i = 1; i <= 12; i++) {
    const q = d(dict, `faq.q${i}`, "");
    const a = d(dict, `faq.a${i}`, "");
    if (q && a) faqItems.push({ q, a });
  }
  const faqs = faqItems.length > 0 ? faqItems : EN_FAQS;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {d(dict, "faq.title", "Frequently asked questions")}
          </h2>
        </div>
        <div>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FinalCTA                                                                  */
/* -------------------------------------------------------------------------- */

function FinalCTA({ dict }: { dict: Dictionary }) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-violet-500/5 to-transparent" />
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{dict.cta.title}</h2>
        <p className="mt-6 text-lg text-slate-400">{dict.cta.subtitle}</p>
        <Link
          href="/signup"
          className="mt-10 inline-flex items-center gap-2 gradient-button rounded-xl px-10 py-4 text-lg font-semibold"
        >
          {dict.cta.button} <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-4 text-sm text-slate-600">{dict.cta.note}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

function Footer({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const footerLinks = {
    [dict.footer.product]: [
      { label: d(dict, "footer.features", "Features"), href: `/${lang}/features` },
      { label: d(dict, "footer.pricing", d(dict, "header.pricing", "Pricing")), href: `/${lang}/pricing` },
      { label: d(dict, "footer.compare", "Compare"), href: `/${lang}/compare` },
      { label: d(dict, "footer.changelog", "Changelog"), href: "/changelog" },
    ],
    [dict.footer.company]: [
      { label: d(dict, "footer.about", "About"), href: "/about" },
      { label: d(dict, "footer.blog", "Blog"), href: `/${lang}/blog` },
      { label: d(dict, "footer.contact", "Contact"), href: "/contact" },
    ],
    [dict.footer.resources]: [
      { label: d(dict, "footer.docs", "Documentation"), href: "/docs" },
    ],
    [dict.footer.legal]: [
      { label: d(dict, "footer.privacy", "Privacy"), href: "/privacy" },
      { label: d(dict, "footer.terms", "Terms"), href: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
                <Languages className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DubSync</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">{dict.footer.tagline}</p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8">
          <p className="text-xs text-zinc-600 text-center">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Export                                                                */
/* -------------------------------------------------------------------------- */

export function LocalizedLanding({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  return (
    <>
      <Header dict={dict} lang={lang} />
      <main>
        <Hero dict={dict} />
        <LogoBar dict={dict} />
        <HowItWorks dict={dict} />
        <DemoSection />
        <Examples />
        <Features dict={dict} />
        <UseCasesSection dict={dict} />
        <RoiCalculatorSection dict={dict} />
        <ComparisonBlock />
        <Testimonials />
        <Pricing dict={dict} />
        <FaqSection dict={dict} />
        <FinalCTA dict={dict} />
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  );
}
