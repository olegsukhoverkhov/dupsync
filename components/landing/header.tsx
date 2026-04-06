"use client";

import Link from "next/link";
import { Languages, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
              <Languages className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DubSync</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/compare" className="text-sm text-zinc-400 hover:text-white transition-colors">Compare</Link>
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About</Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher current="en" />
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="gradient-button rounded-lg px-4 py-2 text-sm font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex sm:hidden h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/5 py-4 space-y-1">
            <Link href="/features" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors">Features</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors">Pricing</Link>
            <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors">Compare</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors">Blog</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors">About</Link>
            <div className="px-4 py-3">
              <LanguageSwitcher current="en" />
            </div>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block gradient-button rounded-xl mx-4 px-4 py-3 text-sm font-medium text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

    </header>
  );
}
