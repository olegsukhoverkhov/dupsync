"use client";

import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";
import { DubVideoPlayer } from "./dub-video-player";
import { LANDING_DUB_LANGUAGES } from "@/lib/landing-dubs";

/**
 * Hero section — conversion-optimized layout.
 *
 * Goals:
 *  1. Everything above the fold on both desktop (≥1024) and mobile.
 *  2. Text and video columns balanced (no "little video next to giant text").
 *  3. Standard SaaS hero conversion stack: eyebrow → H1 → subhead → CTAs →
 *     trust checks → hero media.
 *
 * Sizing notes:
 *  - `min-h-[calc(100svh-4rem)]` uses small viewport height so mobile Safari
 *    doesn't push content below the fold when the URL bar is visible.
 *  - On desktop we use a 2-column grid with the video column matching the
 *    text column width (1.1fr / 1fr) so the player looks first-class, not
 *    a tiny sidekick.
 *  - H1 caps at `text-6xl` (not 7xl) so it stays two lines on most desktops
 *    instead of wrapping to 3+ lines.
 */
export function HeroNew() {
  return (
    <section className="relative overflow-hidden pt-20">
      {/* Background gradient orbs — pink/blue design system.
          pointer-events-none is CRITICAL: without it the blurred orbs sit on
          top of the hero player and swallow every tab click. */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 min-h-[calc(100svh-5rem)] flex items-center py-4 sm:py-8 lg:py-10">
        <div className="w-full grid lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-12 items-center">
          {/* LEFT: copy + CTA stack. min-w-0 prevents the grid cell from
              expanding past the container on mobile (default min-width: auto
              for grid items lets content push the cell wider than 100%). */}
          <div className="min-w-0 text-center lg:text-left animate-slide-up">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] sm:text-sm text-slate-300 mb-3 sm:mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Now with AI lip-sync technology
            </div>

            {/* H1 — tightened line-height, capped size so it stays 2 lines */}
            <h1 className="text-[26px] sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold tracking-tight leading-[1.05]">
              AI Video Dubbing in{" "}
              <span className="gradient-text">30+ Languages</span>
            </h1>

            {/* Subheadline — tight, one idea */}
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Upload a video. Our AI clones the speaker&apos;s voice, translates,
              and syncs lips — automatically.
            </p>

            {/* CTAs */}
            <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center lg:justify-start">
              <Link
                href="/signup"
                className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold"
              >
                Dub Your First Video Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Watch Demo
              </Link>
            </div>

            {/* Trust checkmarks — hidden on very small screens to save fold space */}
            <ul
              className="hidden sm:flex mt-5 flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start text-sm text-slate-400"
              aria-label="Product benefits"
            >
              <li className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
                No watermark
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
                Lip sync included
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
                No credit card required
              </li>
            </ul>
          </div>

          {/* RIGHT: hero media — live demo player with language switcher.
              Matches text column in visual weight. Lazy-loaded: no video
              bytes fetched until the user clicks play. */}
          <div className="min-w-0 w-full mx-auto lg:mx-0 max-w-[640px]">
            <DubVideoPlayer
              languages={LANDING_DUB_LANGUAGES.map((l) => ({
                code: l.code,
                label: l.label,
                flag: l.flag,
                url: l.url,
                poster: l.poster,
              }))}
              aspectClass="aspect-video"
            />
            <p className="mt-2 sm:mt-3 text-center text-[11px] sm:text-xs text-slate-500">
              Real DubSync output — switch languages to compare
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
