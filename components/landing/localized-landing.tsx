import Link from "next/link";
import { ArrowRight, Users, Clock, Globe, Mic, Scan, Zap, Sparkles, Code, Upload, Cpu, Download, Star, Check, ChevronDown, Play } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";

function Header({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={lang === "en" ? "/" : `/${lang}`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="text-lg font-bold text-white">DubSync</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher current={lang} />
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {dict.header.login}
            </Link>
            <Link href="/signup" className="gradient-button rounded-lg px-4 py-2 text-sm font-medium">
              {dict.header.getStarted}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

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
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">{dict.hero.subtitle}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold">
              {dict.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#demo" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors">
              <Play className="h-4 w-4" /> {dict.hero.ctaSecondary}
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span><strong className="text-slate-300">2,000+</strong> {dict.hero.creators}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span><strong className="text-slate-300">50M+</strong> {dict.hero.minDubbed}</span></div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4" /><span><strong className="text-slate-300">30+</strong> {dict.hero.languages}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
            <div key={f.title} className="group rounded-2xl border border-white/10 bg-slate-800/30 p-6 hover:bg-slate-800/60 hover:border-white/20 transition-all hover:-translate-y-1">
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

function Pricing({ dict }: { dict: Dictionary }) {
  const plans: { key: PlanType; popular?: boolean }[] = [
    { key: "free" }, { key: "starter" }, { key: "pro", popular: true }, { key: "enterprise" },
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
              <div key={key} className={`relative rounded-2xl p-6 flex flex-col ${popular ? "gradient-border" : "border border-white/10 bg-slate-800/50"}`}>
                {popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-button rounded-full px-3 py-1 text-xs font-semibold">{dict.pricing.mostPopular}</div>}
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-2"><span className="text-4xl font-bold text-white">${plan.price / 100}</span>{plan.price > 0 && <span className="text-slate-500 ml-1">{dict.pricing.perMonth}</span>}</div>
                <ul className="space-y-3 mt-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-pink-400 mt-0.5 shrink-0" /><span className="text-slate-300">{f}</span></li>
                  ))}
                </ul>
                <Link href="/signup" className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${popular ? "gradient-button" : "border border-white/10 text-white hover:bg-white/5"}`}>
                  {key === "free" ? dict.pricing.getStarted : dict.pricing.startTrial} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ dict }: { dict: Dictionary }) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-violet-500/5 to-transparent" />
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{dict.cta.title}</h2>
        <p className="mt-6 text-lg text-slate-400">{dict.cta.subtitle}</p>
        <Link href="/signup" className="mt-10 inline-flex items-center gap-2 gradient-button rounded-xl px-10 py-4 text-lg font-semibold">
          {dict.cta.button} <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-4 text-sm text-slate-600">{dict.cta.note}</p>
      </div>
    </section>
  );
}

function Footer({ dict }: { dict: Dictionary }) {
  const footerLinks = {
    [dict.footer.product]: [
      { label: "Features", href: "/#demo" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
    [dict.footer.company]: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    [dict.footer.resources]: [
      { label: "Documentation", href: "/docs" },
    ],
    [dict.footer.legal]: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
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
                  <li key={link.label}>
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
          <p className="text-xs text-zinc-600 text-center">&copy; {new Date().getFullYear()} {dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export function LocalizedLanding({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  return (
    <>
      <Header dict={dict} lang={lang} />
      <main>
        <Hero dict={dict} />
        <section className="border-y border-white/5 py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-sm text-zinc-500">{dict.logoBar.trusted}</p>
          </div>
        </section>
        <section className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8"><span className="gradient-text">{dict.whatIs.title}</span></h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>{dict.whatIs.p1}</p>
              <p>{dict.whatIs.p2}</p>
            </div>
          </div>
        </section>
        <HowItWorks dict={dict} />
        <Features dict={dict} />
        <Pricing dict={dict} />
        <FinalCTA dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
