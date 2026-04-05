"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Users, Clock, Globe, Volume2, VolumeX } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸", src: "/videos/demo-english.mp4" },
  { code: "es", label: "Spanish", flag: "🇪🇸", src: "/videos/demo-spanish.mp4" },
];

export function HeroNew() {
  const [activeLang, setActiveLang] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function switchLanguage(index: number) {
    setActiveLang(index);
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      videoRef.current.src = LANGUAGES[index].src;
      videoRef.current.currentTime = currentTime;
      videoRef.current.play();
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background gradient orbs — pink/blue design system */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 mb-8">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Now with AI lip-sync technology
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              AI Video Dubbing — <span className="gradient-text">Clone Voices & Sync Lips in 30+ Languages</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed">
              Upload a video. AI clones the speaker&apos;s voice, translates, and
              syncs lips — automatically. Go global in minutes, not weeks.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold"
              >
                Start Dubbing Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </Link>
            </div>

            {/* Trust metrics */}
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-sm text-slate-500">
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

          {/* Right — Real Video Demo */}
          <div className="relative animate-slide-up" style={{ animationDelay: "200ms", opacity: 0 }}>
            {/* Glow behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-blue-600/20 rounded-3xl blur-3xl scale-110" />

            {/* Video player */}
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden backdrop-blur-sm">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="ml-4 flex-1 h-6 rounded-md bg-white/5 flex items-center px-3">
                  <span className="text-xs text-slate-600">dubsync.app/demo</span>
                </div>
              </div>

              {/* Video */}
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={LANGUAGES[activeLang].src}
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Mute/unmute button */}
                <button
                  onClick={() => setMuted(!muted)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                {/* Current language badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-sm px-2.5 py-1.5">
                  <span className="text-sm">{LANGUAGES[activeLang].flag}</span>
                  <span className="text-xs font-medium text-white">{LANGUAGES[activeLang].label}</span>
                </div>
              </div>

              {/* Language switcher */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                <span className="text-xs text-slate-500">Switch language:</span>
                <div className="flex gap-2">
                  {LANGUAGES.map((lang, i) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(i)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        activeLang === i
                          ? "bg-white/10 text-white border border-white/20"
                          : "text-slate-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-2 -right-4 animate-badge-pop delay-500" style={{ opacity: 0 }}>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur-sm px-3 py-2 shadow-xl">
                <span className="text-lg">🇪🇸</span>
                <span className="text-sm font-medium text-white">Spanish</span>
                <span className="text-green-400 text-xs">✓</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-4 animate-badge-pop delay-1000" style={{ opacity: 0 }}>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur-sm px-3 py-2 shadow-xl">
                <span className="text-lg">🇫🇷</span>
                <span className="text-sm font-medium text-white">French</span>
                <span className="text-green-400 text-xs">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
