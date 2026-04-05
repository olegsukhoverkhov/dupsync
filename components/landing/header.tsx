"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
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

          <nav className="hidden sm:flex items-center gap-8">
            <Link
              href="#demo"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Demo
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
        </div>
      </div>
    </header>
  );
}
