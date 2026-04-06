"use client";

import Link from "next/link";
import { ArrowRight, Users, Clock, Globe, Check } from "lucide-react";

export function HeroNew() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background gradient orbs — pink/blue design system */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 mb-8">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Now with AI lip-sync technology
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              AI Video Dubbing — <span className="gradient-text">Clone Voices & Sync Lips in 30+ Languages</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
              Upload a video. AI clones the speaker&apos;s voice, translates, and
              syncs lips — automatically. Go global in minutes, not weeks.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/signup"
                className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold"
              >
                Dub Your First Video Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="mt-6 flex flex-wrap items-center gap-5 justify-center lg:justify-start text-sm text-slate-400/70"
              aria-label="Product benefits: no watermark, lip sync included, no credit card required"
            >
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
                No watermark
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
                Lip sync included
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
                No credit card required
              </span>
            </div>

            {/* Trust metrics */}
            <div className="mt-12 flex flex-col sm:flex-row items-center lg:items-start gap-4 sm:gap-8 text-sm text-slate-500 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span><strong className="text-slate-300">2,000+</strong> creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span><strong className="text-slate-300">50M+</strong> min dubbed</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span><strong className="text-slate-300">30+</strong> languages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
