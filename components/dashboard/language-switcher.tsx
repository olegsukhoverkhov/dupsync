"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Check, Globe, Loader2 } from "lucide-react";
import { LOCALES, LOCALE_INFO, type Locale } from "@/lib/i18n/dictionaries";
import { useDashboardLocale } from "./locale-provider";

/**
 * Dashboard language switcher.
 *
 * Compact button in the sidebar that opens a popover listing all 6
 * supported locales (flag + native name). Clicking a language PATCHes
 * `/api/profile/locale` to stamp `profiles.locale`, then calls
 * `router.refresh()` so the server dashboard layout re-runs and the
 * whole UI re-renders in the new language without a full page reload.
 */
export function LanguageSwitcher({
  collapsed = false,
  placement = "top",
}: {
  /** If true, render as a compact icon-only button for tight spaces. */
  collapsed?: boolean;
  /**
   * Popover position relative to the trigger.
   * - `"top"` (default) opens upward — good for sidebar footer.
   * - `"bottom"` opens downward — good for Settings card where there's
   *   plenty of room below the control.
   */
  placement?: "top" | "bottom";
}) {
  const router = useRouter();
  const { locale } = useDashboardLocale();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<Locale | null>(null);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // Wait for mount so we can read document for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute popover position whenever it opens OR the viewport changes.
  // Uses fixed-position coordinates so ancestor `overflow: hidden` (e.g.
  // the <Card> wrapping this on the Settings page) can't clip the menu.
  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const compute = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const width = Math.max(rect.width, 200);
      const MENU_HEIGHT = LOCALES.length * 44 + 8; // rough estimate
      if (placement === "top") {
        setMenuPos({
          top: rect.top - MENU_HEIGHT - 8,
          left: rect.left,
          width,
        });
      } else {
        setMenuPos({
          top: rect.bottom + 8,
          left: rect.left,
          width,
        });
      }
    };
    compute();
    // Recompute on scroll/resize so the menu stays glued to the trigger.
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [open, placement]);

  // Close on outside click. The menu lives outside the wrapper (portal)
  // so we need to check both refs to avoid closing when clicking inside
  // the dropdown itself.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        wrapperRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  async function handleSelect(target: Locale) {
    if (target === locale) {
      setOpen(false);
      return;
    }
    setLoading(target);
    try {
      const res = await fetch("/api/profile/locale", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: target }),
      });
      if (!res.ok) {
        console.error("[LANG] failed:", await res.text());
        return;
      }
      // Refresh so the server layout picks up profiles.locale and
      // re-renders the whole dashboard in the new language.
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error("[LANG] error:", err);
    } finally {
      setLoading(null);
    }
  }

  const current = LOCALE_INFO[locale];

  const menu = open && menuPos && mounted ? (
    <div
      ref={menuRef}
      role="menu"
      className="fixed rounded-xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden z-[100]"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        minWidth: Math.max(menuPos.width, 200),
      }}
    >
      {LOCALES.map((code) => {
        const info = LOCALE_INFO[code];
        const isCurrent = code === locale;
        const isLoading = loading === code;
        return (
          <button
            key={code}
            type="button"
            role="menuitem"
            onClick={() => handleSelect(code)}
            disabled={loading !== null}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isCurrent
                ? "bg-pink-500/10 text-pink-300"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-base leading-none">{info.flag}</span>
            <span className="flex-1 text-left">{info.nativeName}</span>
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isCurrent ? (
              <Check className="h-3.5 w-3.5" />
            ) : null}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer ${
          collapsed ? "h-9 w-9 justify-center" : "w-full px-3 py-2.5"
        }`}
      >
        <Globe className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="text-base leading-none">{current.flag}</span>
            <span className="flex-1 text-left">{current.nativeName}</span>
          </>
        )}
      </button>

      {/* Render the popover into document.body via a portal so that
          ancestor `overflow: hidden` (e.g. the Card wrapping the
          switcher on the Settings page) can't clip it. */}
      {menu && createPortal(menu, document.body)}
    </div>
  );
}
