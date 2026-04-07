"use client";

import Link from "next/link";
import {
  ArrowRight,
  Users,
  Clock,
  Globe,
  Mic,
  GraduationCap,
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
import { useEffect, useState, useRef, useCallback } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";
import Image from "next/image";

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
    { label: d(dict, "header.platforms", "Platforms"), href: `/${lang}/platforms` },
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
/*  LogoBar (inline, dict-driven)                                             */
/* -------------------------------------------------------------------------- */

const LOGOS = [
  "YouTube", "Udemy", "Coursera", "Shopify", "HubSpot",
  "Notion", "Linear", "Vercel", "Product Hunt", "TechCrunch",
  "Canva", "Loom",
];

function LocalizedLogoBar({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-y border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm text-zinc-500 mb-8">
          {d(dict, "logoBar.trusted", "Used by teams at")}
        </p>
        <div className="flex items-center justify-center gap-x-6 sm:gap-x-10 gap-y-4 flex-wrap">
          {LOGOS.map((name) => (
            <div
              key={name}
              className="text-zinc-600 font-semibold text-base tracking-tight hover:text-zinc-400 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  HowItWorks                                                               */
/* -------------------------------------------------------------------------- */

function HowItWorks({ dict }: { dict: Dictionary }) {
  const steps = [
    { icon: Upload, step: d(dict, "howItWorks.step1label", "STEP 1"), title: dict.howItWorks.step1title, desc: dict.howItWorks.step1desc },
    { icon: Cpu, step: d(dict, "howItWorks.step2label", "STEP 2"), title: dict.howItWorks.step2title, desc: dict.howItWorks.step2desc },
    { icon: Download, step: d(dict, "howItWorks.step3label", "STEP 3"), title: dict.howItWorks.step3title, desc: dict.howItWorks.step3desc },
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

function UseCasesSection({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const cards = [
    {
      key: "youtube",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
          <path d="M10 8.5v7l6-3.5-6-3.5z" fill="white" />
        </svg>
      ),
      link: `/${lang}/platforms/youtube`,
    },
    {
      key: "tiktok",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
          <path
            d="M19 7.5V2h-3.5c0 3-2 4.5-4.5 5v6.5c0 2.5-2 4.5-4.5 4.5S2 16 2 13.5 4 9 6.5 9c.5 0 1 .1 1.5.2V12c-.5-.1-1-.2-1.5-.2C5.1 11.8 4 12.5 4 13.5S5.1 15.2 6.5 15.2 9 14 9 13V2h4c0 0 0 3.5 3 5 .7.3 1.5.5 2.5.5h.5z"
            fill="currentColor"
          />
        </svg>
      ),
      link: `/${lang}/platforms/tiktok`,
    },
    {
      key: "instagram",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8">
          <defs>
            <linearGradient id="ig-loc" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFDC80" />
              <stop offset="25%" stopColor="#F77737" />
              <stop offset="50%" stopColor="#E1306C" />
              <stop offset="75%" stopColor="#C13584" />
              <stop offset="100%" stopColor="#5851DB" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-loc)" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="4.5" stroke="url(#ig-loc)" strokeWidth="2" fill="none" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-loc)" />
        </svg>
      ),
      link: `/${lang}/platforms/instagram`,
    },
    {
      key: "facebook",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8">
          <circle cx="12" cy="12" r="10" fill="#1877F2" />
          <path
            d="M15.5 8H14c-1.1 0-1.5.7-1.5 1.5V11h3l-.5 3h-2.5v7h-3v-7H8v-3h1.5V9c0-2.2 1.3-3.5 3.5-3.5h2.5v2.5z"
            fill="white"
          />
        </svg>
      ),
      link: `/${lang}/platforms/facebook`,
    },
    {
      key: "elearning",
      icon: <GraduationCap className="h-8 w-8 text-white" />,
      link: `/${lang}/platforms/elearning`,
    },
    {
      key: "podcasts",
      icon: <Mic className="h-8 w-8 text-white" />,
      link: `/${lang}/platforms/podcasts`,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.key}
              className="group rounded-2xl border border-white/10 bg-slate-800/40 p-6 transition-colors hover:border-white/20 hover:bg-slate-800/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                {card.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {d(dict, `useCases.${card.key}`, card.key)}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {d(dict, `useCases.${card.key}Desc`, "")}
              </p>
              <span className="mt-4 inline-block rounded-md border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-xs text-pink-400">
                {d(dict, `useCases.${card.key}Tag`, "")}
              </span>
              <div className="mt-4">
                <Link
                  href={card.link}
                  className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                >
                  {d(dict, "useCases.learnMore", "Learn more \u2192")}
                </Link>
              </div>
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
      traditional: d(dict, "roi.traditionalCostValue", "$3,000 \u2013 $5,000"),
      dubsync: d(dict, "roi.dubsyncCostValue", "From $1/min"),
    },
    {
      metric: d(dict, "roi.timeFor10min", "Time for 10-min video"),
      traditional: d(dict, "roi.traditionalTimeValue", "1\u20133 weeks"),
      dubsync: d(dict, "roi.dubsyncTimeValue", "3 minutes"),
    },
    {
      metric: d(dict, "roi.simultaneous", "Simultaneous languages"),
      traditional: d(dict, "roi.traditionalLangsValue", "1"),
      dubsync: d(dict, "roi.dubsyncLangsValue", "30+"),
    },
    {
      metric: d(dict, "roi.voiceActors", "Voice actors needed"),
      traditional: d(dict, "roi.traditionalActorsValue", "Yes"),
      dubsync: d(dict, "roi.dubsyncActorsValue", "No \u2014 AI voice cloning"),
    },
    {
      metric: d(dict, "roi.lipSync", "Lip sync"),
      traditional: d(dict, "roi.traditionalLipSyncValue", "Manual work"),
      dubsync: d(dict, "roi.dubsyncLipSyncValue", "Automatic"),
    },
    {
      metric: d(dict, "roi.totalCost", "10-min video \u00D7 5 languages"),
      traditional: d(dict, "roi.traditionalTotalValue", "~$20,000"),
      dubsync: d(dict, "roi.dubsyncTotalValue", "~$50"),
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

function translateFeature(feature: string, dict: Dictionary): string {
  const featureMap: Record<string, string> = {
    "1 video": d(dict, "pricing.oneVideo", feature),
    "1 target language": d(dict, "pricing.targetLanguage", feature),
    "720p output": d(dict, "pricing.output720", feature),
    "1080p output": d(dict, "pricing.output1080", feature),
    "4K output": d(dict, "pricing.output4k", feature),
    "100MB max file size": d(dict, "pricing.maxFile100", feature),
    "500MB max file size": d(dict, "pricing.maxFile500", feature),
    "2GB max file size": d(dict, "pricing.maxFile2gb", feature),
    "5GB max file size": d(dict, "pricing.maxFile5gb", feature),
    "Voice cloning": d(dict, "pricing.voiceCloning", feature),
    "Lip sync included": d(dict, "pricing.lipSyncIncludedFeature", feature),
    "No watermark": d(dict, "pricing.noWatermarkFeature", feature),
    "Email support": d(dict, "pricing.emailSupport", feature),
    "API access": d(dict, "pricing.apiAccess", feature),
    "Priority processing": d(dict, "pricing.priorityProcessing", feature),
    "Custom voice profiles": d(dict, "pricing.customVoices", feature),
    "Dedicated support": d(dict, "pricing.dedicatedSupport", feature),
    "Unlimited projects": d(dict, "pricing.unlimitedProjects", feature),
  };
  // Handle "N credits/month" pattern
  const creditsMatch = feature.match(/^(\d+) credits\/month$/);
  if (creditsMatch) return `${creditsMatch[1]} ${d(dict, "pricing.creditsMonth", "credits/month")}`;
  // Handle "Up to N languages" pattern
  const langsMatch = feature.match(/^Up to (\d+) languages$/);
  if (langsMatch) return d(dict, "pricing.upToLangs", feature).replace("{n}", langsMatch[1]);
  // Handle "All 30+ languages"
  if (feature === "All 30+ languages") return d(dict, "pricing.allLangs", feature);
  return featureMap[feature] || feature;
}

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
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-pink-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300">{translateFeature(f, dict)}</span>
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

        {/* How credits work */}
        <div className="mt-16 max-w-3xl mx-auto rounded-2xl border border-white/10 bg-slate-800/30 p-8">
          <h3 className="text-xl font-bold text-white mb-4">
            {d(dict, "pricing.howCreditsWork", "How credits work")}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {d(dict, "pricing.creditExplanation", "1 credit = 1 minute of dubbed video in 1 target language.")}
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-slate-300">{d(dict, "pricing.creditExample1", "5 min video \u00D7 1 lang =")}</span>
              <span className="font-semibold text-white">5 {d(dict, "pricing.credits", "credits")}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-slate-300">{d(dict, "pricing.creditExample2", "5 min video \u00D7 3 langs =")}</span>
              <span className="font-semibold text-white">15 {d(dict, "pricing.credits", "credits")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{d(dict, "pricing.creditExample3", "10 min video \u00D7 2 langs =")}</span>
              <span className="font-semibold text-white">20 {d(dict, "pricing.credits", "credits")}</span>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            {d(dict, "pricing.creditNote", "Video duration rounds up to the nearest minute. Unused credits don\u2019t roll over.")}
          </p>
          <div className="mt-4">
            <Link href="/compare" className="text-sm text-pink-400 hover:text-pink-300 font-medium">
              {d(dict, "pricing.compareLink", "Compare with competitors \u2192")}
            </Link>
          </div>
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
/*  DemoSection (inline, translated)                                          */
/* -------------------------------------------------------------------------- */

function LocalizedDemoSection({ dict }: { dict: Dictionary }) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const TABS = [
    {
      id: "upload",
      label: d(dict, "demo.uploadLabel", "Upload"),
      icon: Upload,
      description: d(dict, "demo.uploadDesc", "Drag & drop your video"),
    },
    {
      id: "process",
      label: d(dict, "demo.processLabel", "AI Processing"),
      icon: Cpu,
      description: d(dict, "demo.processDesc", "AI does the heavy lifting"),
    },
    {
      id: "download",
      label: d(dict, "demo.downloadLabel", "Download"),
      icon: Download,
      description: d(dict, "demo.downloadDesc", "Get dubbed videos"),
    },
  ];

  return (
    <section id="demo" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">{d(dict, "demo.title", "See it in action")}</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            {d(dict, "demo.subtitle", "Three steps. That\u2019s all it takes to reach a global audience.")}
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center justify-start sm:justify-center gap-2 mb-8 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all shrink-0 ${
                activeTab === i
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto mb-8 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            key={activeTab}
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
            style={{ animation: "progress-bar 4s linear forwards" }}
          />
        </div>

        {/* Tab content — cards */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-8 min-h-[320px]">
            {activeTab === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 animate-fade-in">
                <div className="w-full max-w-md border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-blue-500/30 transition-colors">
                  <Upload className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-white font-medium">{d(dict, "demo.dropHere", "Drop your video here")}</p>
                  <p className="text-zinc-500 text-sm mt-1">{d(dict, "demo.formats", "MP4, MOV, AVI up to 5GB")}</p>
                </div>
                <div className="mt-6 flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 w-full max-w-md">
                  <div className="h-10 w-10 rounded bg-blue-500/20 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">product-demo.mp4</p>
                    <p className="text-xs text-zinc-500">245 MB</p>
                  </div>
                  <Check className="h-5 w-5 text-green-400" />
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="py-8 animate-fade-in">
                <div className="max-w-md mx-auto space-y-4">
                  {[
                    { label: d(dict, "demo.transcribing", "Transcribing audio"), done: true },
                    { label: d(dict, "demo.translating", "Translating to Spanish"), done: true },
                    { label: d(dict, "demo.cloning", "Cloning speaker voice"), done: true },
                    { label: d(dict, "demo.syncing", "Syncing lip movements"), done: false },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        step.done ? "bg-green-500/20" : "bg-blue-500/20"
                      }`}>
                        {step.done ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <div className="h-4 w-4 text-blue-400 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                        )}
                      </div>
                      <span className={`text-sm ${step.done ? "text-zinc-400" : "text-white font-medium"}`}>
                        {step.label}
                      </span>
                      {step.done && (
                        <span className="text-xs text-zinc-600 ml-auto">{d(dict, "demo.done", "Done")}</span>
                      )}
                      {!step.done && (
                        <span className="text-xs text-blue-400 ml-auto">{d(dict, "demo.processing", "Processing...")}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 max-w-md mx-auto">
                  <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>{d(dict, "demo.overallProgress", "Overall progress")}</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="py-8 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {[
                    { flag: "\uD83C\uDDEA\uD83C\uDDF8", lang: d(dict, "demo.langSpanish", "Spanish"), ready: true },
                    { flag: "\uD83C\uDDEB\uD83C\uDDF7", lang: d(dict, "demo.langFrench", "French"), ready: true },
                    { flag: "\uD83C\uDDE9\uD83C\uDDEA", lang: d(dict, "demo.langGerman", "German"), ready: true },
                    { flag: "\uD83C\uDDEF\uD83C\uDDF5", lang: d(dict, "demo.langJapanese", "Japanese"), ready: false },
                    { flag: "\uD83C\uDDF0\uD83C\uDDF7", lang: d(dict, "demo.langKorean", "Korean"), ready: false },
                    { flag: "\uD83C\uDDE7\uD83C\uDDF7", lang: d(dict, "demo.langPortuguese", "Portuguese"), ready: false },
                  ].map((lang) => (
                    <div
                      key={lang.lang}
                      className={`rounded-xl border p-4 text-center transition-all ${
                        lang.ready
                          ? "border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer"
                          : "border-white/5 bg-white/[0.02] opacity-50"
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <p className="text-sm text-white mt-2">{lang.lang}</p>
                      {lang.ready ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                          <Download className="h-3 w-3" /> {d(dict, "demo.ready", "Ready")}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600 mt-1 block">{d(dict, "demo.processing", "Processing...")}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Examples (inline, translated)                                             */
/* -------------------------------------------------------------------------- */

function LocalizedExamples({ dict }: { dict: Dictionary }) {
  const EXAMPLES = [
    {
      title: d(dict, "examples.youtubeTitle", "YouTube Tutorial"),
      original: d(dict, "examples.youtubeOriginal", "\uD83C\uDDFA\uD83C\uDDF8 English"),
      dubbed: d(dict, "examples.youtubeDubbed", "\uD83C\uDDEA\uD83C\uDDF8 Spanish"),
      duration: d(dict, "examples.youtubeDuration", "Dubbed in 3 min"),
      accuracy: d(dict, "examples.youtubeAccuracy", "98% voice match"),
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: d(dict, "examples.productTitle", "Product Demo"),
      original: d(dict, "examples.productOriginal", "\uD83C\uDDFA\uD83C\uDDF8 English"),
      dubbed: d(dict, "examples.productDubbed", "\uD83C\uDDEB\uD83C\uDDF7 French"),
      duration: d(dict, "examples.productDuration", "Dubbed in 2 min"),
      accuracy: d(dict, "examples.productAccuracy", "97% voice match"),
      gradient: "from-violet-500/20 to-pink-500/20",
    },
    {
      title: d(dict, "examples.courseTitle", "Online Course"),
      original: d(dict, "examples.courseOriginal", "\uD83C\uDDFA\uD83C\uDDF8 English"),
      dubbed: d(dict, "examples.courseDubbed", "\uD83C\uDDEF\uD83C\uDDF5 Japanese"),
      duration: d(dict, "examples.courseDuration", "Dubbed in 5 min"),
      accuracy: d(dict, "examples.courseAccuracy", "96% voice match"),
      gradient: "from-amber-500/20 to-orange-500/20",
    },
  ];

  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">{d(dict, "examples.title", "Real results")}</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            {d(dict, "examples.subtitle", "See how creators use DubSync to reach global audiences")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.title}
              className="group rounded-2xl border border-white/10 bg-slate-800/50 overflow-hidden hover:border-white/20 transition-all"
            >
              {/* Video thumbnail */}
              <div className={`relative aspect-video bg-gradient-to-br ${ex.gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-0.5" />
                  </div>
                </div>
                {/* Language transform indicator */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-white">
                    {ex.original}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/50" />
                  <span className="text-xs bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-white">
                    {ex.dubbed}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white">{ex.title}</h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ex.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    {ex.accuracy}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonials (inline, translated headings, EN quotes)                     */
/* -------------------------------------------------------------------------- */

const TESTIMONIALS = [
  {
    quote: "DubSync doubled my international audience in two months. The voice cloning is so good that my Spanish viewers genuinely think I speak Spanish. Game changer for any creator going global.",
    name: "Daniel Moretti",
    role: "YouTube Creator",
    detail: "1.2M subscribers",
    avatar: "/avatars/1.jpg",
    gradient: "from-blue-500 to-cyan-500",
    rating: 5,
  },
  {
    quote: "We used to spend $5,000 per language for professional dubbing. DubSync does it in minutes for a fraction of the cost. The lip sync is incredible \u2014 our students can\u2019t tell it\u2019s AI.",
    name: "Tom\u00E1\u0161 Nov\u00E1k",
    role: "Head of Content",
    detail: "EduTech Pro",
    avatar: "/avatars/2.jpg",
    gradient: "from-violet-500 to-pink-500",
    rating: 4.5,
  },
  {
    quote: "Our product demos now reach 15 markets instead of 3. DubSync paid for itself in the first week. It\u2019s a no-brainer for any global marketing team.",
    name: "Marcus Johnson",
    role: "Marketing Director",
    detail: "ScaleUp Agency",
    avatar: "/avatars/3.jpg",
    gradient: "from-amber-500 to-orange-500",
    rating: 5,
  },
  {
    quote: "I run a cooking channel and needed my recipes in Japanese and Korean. DubSync nailed the tone \u2014 warm and conversational, not robotic. My Asian audience grew 400% in 3 months.",
    name: "Elena Petrova",
    role: "Content Creator",
    detail: "850K subscribers",
    avatar: "/avatars/4.jpg",
    gradient: "from-green-500 to-emerald-500",
    rating: 4,
  },
  {
    quote: "As a solo developer, I integrated DubSync\u2019s API into our LMS in one afternoon. Now every course we publish automatically gets dubbed into 6 languages. The documentation is clear and the API is rock solid.",
    name: "Mikael Lindstr\u00F6m",
    role: "CTO",
    detail: "LearnFlow",
    avatar: "/avatars/5.jpg",
    gradient: "from-red-500 to-pink-500",
    rating: 5,
  },
  {
    quote: "I was skeptical about AI dubbing until I tried DubSync. The voice cloning captured my energy and enthusiasm perfectly. My French and German versions sound like me, not a text-to-speech bot.",
    name: "Sophia Andersson",
    role: "Podcast Host",
    detail: "The Global Show",
    avatar: "/avatars/6.jpg",
    gradient: "from-cyan-500 to-blue-500",
    rating: 4.5,
  },
  {
    quote: "We localize corporate training videos for 12 countries. Before DubSync it took 3 weeks per language. Now it\u2019s done in a day. The quality is consistent and our compliance team approved it.",
    name: "James O\u2019Brien",
    role: "L&D Manager",
    detail: "Fortune 500 Company",
    avatar: "/avatars/7.jpg",
    gradient: "from-indigo-500 to-violet-500",
    rating: 4.5,
  },
  {
    quote: "DubSync helped me turn my English fitness tutorials into a Spanish-language brand. The lip sync makes it look completely natural. My Latino audience engagement is through the roof.",
    name: "Rachel Torres",
    role: "Fitness Influencer",
    detail: "2.1M followers",
    avatar: "/avatars/8.jpg",
    gradient: "from-pink-500 to-rose-500",
    rating: 5,
  },
];

function TestimonialStars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < Math.floor(rating)) {
          return <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />;
        }
        if (i < rating) {
          return (
            <div key={i} className="relative h-3.5 w-3.5">
              <Star className="absolute h-3.5 w-3.5 text-amber-400/30" />
              <div className="absolute overflow-hidden w-[50%] h-full">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              </div>
            </div>
          );
        }
        return <Star key={i} className="h-3.5 w-3.5 text-amber-400/30" />;
      })}
    </div>
  );
}

function TestimonialAvatar({ src, name, gradient }: { src: string; name: string; gradient: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`relative h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden`}>
      {!imgError ? (
        <Image
          src={src}
          alt={name}
          width={40}
          height={40}
          className="absolute inset-0 w-full h-full object-cover rounded-full z-10"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function LocalizedTestimonials({ dict }: { dict: Dictionary }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 0.5;
    let animId: number;

    function step() {
      if (!el || isUserScrolling) {
        animId = requestAnimationFrame(step);
        return;
      }
      el.scrollLeft += speed;
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isUserScrolling]);

  const pauseAutoScroll = useCallback(() => {
    setIsUserScrolling(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsUserScrolling(false), 3000);
  }, []);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = scrollRef.current?.scrollLeft || 0;
    pauseAutoScroll();
  }, [pauseAutoScroll]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartX.current - dx;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">{d(dict, "testimonials.title", "Loved by creators")}</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            {d(dict, "testimonials.subtitle", "Join thousands of creators who are reaching global audiences")}
          </p>
          {/* Trustpilot rating */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#00B67A" />
            </svg>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                if (i < 4) return <Star key={i} className="h-4 w-4 fill-[#00B67A] text-[#00B67A]" />;
                return (
                  <div key={i} className="relative h-4 w-4">
                    <Star className="absolute h-4 w-4 text-[#00B67A]/30" />
                    <div className="absolute overflow-hidden w-[80%] h-full">
                      <Star className="h-4 w-4 fill-[#00B67A] text-[#00B67A]" />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-sm text-white font-semibold">4.8/5</span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {d(dict, "testimonials.trustpilotRated", "Rated on")} <span className="text-[#00B67A] font-medium">Trustpilot</span> &middot; {d(dict, "testimonials.trustpilotReviews", "2,000+ reviews")}
            </span>
          </div>
        </div>

        {/* Scrollable auto-moving carousel */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={pauseAutoScroll}
            onWheel={pauseAutoScroll}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="shrink-0 w-[280px] sm:w-[340px] rounded-2xl border border-white/10 bg-slate-800/40 p-5 hover:border-white/20 transition-all flex flex-col select-none"
              >
                <TestimonialStars rating={t.rating} />
                <p className="mt-3 text-slate-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
                  <TestimonialAvatar src={t.avatar} name={t.name} gradient={t.gradient} />
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} &middot; {t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          {d(dict, "testimonials.disclaimer", "Testimonials are from English-speaking users and have not been translated.")}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  ComparisonBlock (inline, translated)                                      */
/* -------------------------------------------------------------------------- */

function LocalizedComparisonBlock({ dict }: { dict: Dictionary }) {
  const ROWS = [
    {
      feature: d(dict, "comparison.lipSyncMinutes", "Lip sync minutes from ~$20/mo"),
      dubsync: { text: "20 min", color: "text-green-400" },
      rask: { text: d(dict, "comparison.notAvailable", "\u2717 not available"), color: "text-red-400" },
      heygen: { text: d(dict, "comparison.sharedPool", "shared pool*"), color: "text-yellow-400" },
    },
    {
      feature: d(dict, "comparison.lipSyncIncluded", "Lip sync included in every credit"),
      dubsync: { text: d(dict, "comparison.always", "always"), color: "text-green-400" },
      rask: { text: d(dict, "comparison.twoXCost", "2x credit cost"), color: "text-red-400" },
      heygen: { text: d(dict, "comparison.costsCredits", "costs credits"), color: "text-yellow-400" },
    },
    {
      feature: d(dict, "comparison.priceForAccess", "Price for lip sync access"),
      dubsync: { text: "$19.99/mo", color: "text-green-400" },
      rask: { text: "$120/mo", color: "text-red-400" },
      heygen: { text: "$29/mo", color: "text-yellow-400" },
    },
    {
      feature: d(dict, "comparison.hiddenSurcharges", "Hidden lip sync surcharges"),
      dubsync: { text: d(dict, "comparison.none", "none"), color: "text-green-400" },
      rask: { text: d(dict, "comparison.doublesUsage", "doubles usage"), color: "text-red-400" },
      heygen: { text: d(dict, "comparison.sharedPool", "shared pool*"), color: "text-yellow-400" },
    },
    {
      feature: d(dict, "comparison.watermarkRow", "Watermark on free plan"),
      dubsync: { text: "\u2717 " + d(dict, "comparison.noWatermark", "No watermark"), color: "text-green-400" },
      rask: { text: "\u2713 " + d(dict, "comparison.watermark", "Watermark"), color: "text-red-400" },
      heygen: { text: "\u2713 " + d(dict, "comparison.watermark", "Watermark"), color: "text-red-400" },
    },
  ];

  const STATS = [
    {
      value: d(dict, "comparison.stat1Value", "20 min"),
      label: d(dict, "comparison.stat1Label", "of lip sync from just $19.99"),
    },
    {
      value: d(dict, "comparison.stat2Value", "$1.00/min"),
      label: d(dict, "comparison.stat2Label", "all-inclusive, lip sync included in every credit"),
    },
    {
      value: d(dict, "comparison.stat3Value", "$0"),
      label: d(dict, "comparison.stat3Label", "hidden surcharges, every credit = lip sync included"),
    },
  ];

  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {d(dict, "comparison.title", "Every credit includes lip sync. No hidden fees.")}
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            {d(dict, "comparison.subtitle", "See how DubSync compares to Rask AI and HeyGen for AI video dubbing with lip sync.")}
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-800/50">
          <table className="w-full text-sm">
            <caption className="sr-only">
              {d(dict, "comparison.caption", "DubSync vs Rask AI vs HeyGen \u2014 lip sync comparison")}
            </caption>
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-slate-400 font-medium">
                  {d(dict, "comparison.feature", "Feature")}
                </th>
                <th className="px-6 py-4 text-center font-semibold text-white">
                  DubSync
                </th>
                <th className="px-6 py-4 text-center font-medium text-slate-400">
                  Rask AI
                </th>
                <th className="px-6 py-4 text-center font-medium text-slate-400">
                  HeyGen
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i < ROWS.length - 1 ? "border-b border-white/5" : ""}
                >
                  <td className="px-6 py-4 text-slate-300">{row.feature}</td>
                  <td className={`px-6 py-4 text-center font-semibold ${row.dubsync.color}`}>
                    {row.dubsync.text}
                  </td>
                  <td className={`px-6 py-4 text-center ${row.rask.color}`}>
                    {row.rask.text}
                  </td>
                  <td className={`px-6 py-4 text-center ${row.heygen.color}`}>
                    {row.heygen.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <p className="mt-4 text-xs text-slate-500 text-center">
          {d(dict, "comparison.footnote", "* HeyGen lip sync shares Premium Credits with avatars, generation, and other features. Prices as of April 2026.")}
        </p>

        {/* Stat cards */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-white/10 bg-slate-800/50 p-6 text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom text + link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          {d(dict, "comparison.bottomText", "Other tools charge $120/mo for lip sync or split credits between features.")}
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/compare"
            className="text-sm text-pink-400 hover:text-pink-300 font-medium"
          >
            {d(dict, "comparison.seeFullComparison", "See how we compare \u2192")}
          </Link>
        </div>
      </div>
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
      { label: d(dict, "footer.platforms", "Platforms"), href: `/${lang}/platforms` },
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
        {/* Trust badges */}
        <div className="border-t border-white/5 pt-6 pb-4">
          <div className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap text-[11px] text-slate-500">
            <span className="flex items-center gap-1">SSL Secured</span>
            <span className="flex items-center gap-1">PCI DSS</span>
            <span className="flex items-center gap-1">GDPR</span>
            <span className="flex items-center gap-1">SOC 2</span>
            <span className="flex items-center gap-1.5">
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-blue-400">VISA</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-orange-400">MC</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-cyan-400">AMEX</span>
              <span className="rounded bg-white/10 px-1 py-px text-[9px] font-bold text-blue-300">PayPal</span>
            </span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6">
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
    <main>
      <Hero dict={dict} />
      <LocalizedLogoBar dict={dict} />
      <HowItWorks dict={dict} />
      <LocalizedDemoSection dict={dict} />
      <LocalizedExamples dict={dict} />
      <Features dict={dict} />
      <UseCasesSection dict={dict} lang={lang} />
      <RoiCalculatorSection dict={dict} />
      <LocalizedComparisonBlock dict={dict} />
      <LocalizedTestimonials dict={dict} />
      <Pricing dict={dict} />
      <FaqSection dict={dict} />
      <FinalCTA dict={dict} />
    </main>
  );
}
