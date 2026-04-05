"use client";

import Link from "next/link";
import { Play, ArrowRight, Users, Clock, Globe } from "lucide-react";

const LANGUAGE_BADGES = [
  { lang: "Spanish", flag: "🇪🇸", delay: "delay-500" },
  { lang: "French", flag: "🇫🇷", delay: "delay-1000" },
  { lang: "Japanese", flag: "🇯🇵", delay: "delay-1500" },
  { lang: "German", flag: "🇩🇪", delay: "delay-2000" },
];

export function HeroNew() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background gradient orbs — pink/blue design system */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400 mb-8">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Now with AI lip-sync technology
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Dub your videos
              <br />
              <span className="gradient-text">in 30+ languages</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-lg leading-relaxed">
              Upload a video. AI clones the speaker&apos;s voice, translates, and
              syncs lips — automatically. Go global in minutes, not weeks.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold"
              >
                Start Dubbing Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Link>
            </div>

            {/* Trust metrics */}
            <div className="mt-12 flex items-center gap-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span><strong className="text-zinc-300">2,000+</strong> creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span><strong className="text-zinc-300">50M+</strong> min dubbed</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span><strong className="text-zinc-300">30+</strong> languages</span>
              </div>
            </div>
          </div>

          {/* Right — Animated Demo Mockup */}
          <div className="relative animate-slide-up delay-200" style={{ animationDelay: "200ms" }}>
            {/* Glow behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-blue-600/20 rounded-3xl blur-3xl scale-110" />

            {/* Video mockup */}
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 p-1 backdrop-blur-sm">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="ml-4 flex-1 h-6 rounded-md bg-white/5 flex items-center px-3">
                  <span className="text-xs text-zinc-600">dupsync.com/project/demo</span>
                </div>
              </div>

              {/* Video area */}
              <div className="relative aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-b-xl overflow-hidden">
                {/* Fake video content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 animate-float">
                      <Play className="h-8 w-8 text-white/60 ml-1" />
                    </div>
                    <p className="text-zinc-500 text-sm">Original Video — English</p>
                  </div>
                </div>

                {/* Processing overlay animation */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: "75%", transition: "width 2s ease" }} />
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">75%</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Generating Spanish dub...</p>
                </div>
              </div>
            </div>

            {/* Floating language badges */}
            {LANGUAGE_BADGES.map((badge, i) => (
              <div
                key={badge.lang}
                className={`absolute animate-badge-pop ${badge.delay}`}
                style={{
                  opacity: 0,
                  ...(i === 0 ? { top: "10%", right: "-5%" } : {}),
                  ...(i === 1 ? { top: "35%", right: "-8%" } : {}),
                  ...(i === 2 ? { bottom: "30%", left: "-5%" } : {}),
                  ...(i === 3 ? { bottom: "10%", right: "-3%" } : {}),
                }}
              >
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur-sm px-3 py-2 shadow-xl">
                  <span className="text-lg">{badge.flag}</span>
                  <span className="text-sm font-medium text-white">{badge.lang}</span>
                  <span className="text-green-400 text-xs">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
