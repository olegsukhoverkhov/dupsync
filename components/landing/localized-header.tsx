"use client";

import Link from "next/link";
import { Languages, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";

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

export function LocalizedHeader({ dict, lang }: { dict: Dictionary; lang: Locale }) {
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
