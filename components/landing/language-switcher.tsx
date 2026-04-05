"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LOCALE_INFO, LOCALES, type Locale } from "@/lib/i18n/dictionaries";

const LOCALE_PREFIXES = LOCALES.filter((l) => l !== "en").map((l) => `/${l}`);

function getLocalizedPath(currentPath: string, targetLang: string): string {
  // Strip existing locale prefix
  let cleanPath = currentPath;
  for (const prefix of LOCALE_PREFIXES) {
    if (cleanPath === prefix || cleanPath.startsWith(prefix + "/")) {
      cleanPath = cleanPath.slice(prefix.length) || "/";
      break;
    }
  }

  // Add target prefix
  if (targetLang === "en") {
    return cleanPath || "/";
  }
  return `/${targetLang}${cleanPath === "/" ? "" : cleanPath}`;
}

export function LanguageSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const info = LOCALE_INFO[current];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Change language"
      >
        <span>{info.flag}</span>
        <span className="hidden sm:inline">{info.nativeName}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-sm py-1 shadow-xl z-50">
          {Object.entries(LOCALE_INFO).map(([code, loc]) => (
            <Link
              key={code}
              href={getLocalizedPath(pathname, code)}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                code === current
                  ? "text-white bg-white/5"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{loc.flag}</span>
              <span>{loc.nativeName}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
