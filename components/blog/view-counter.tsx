"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  slug: string;
  /** Localized "views" label, e.g. "views", "vistas", "Aufrufe" */
  label?: string;
}

/**
 * View counter for blog articles.
 *
 * Uniqueness is tracked via localStorage flag `viewed_${slug}`.
 * On first visit:
 *   1. Calls POST /api/blog/views to increment count
 *   2. Stores the flag so subsequent visits don't increment
 * On repeat visits:
 *   1. Calls GET /api/blog/views to fetch the latest count without incrementing
 */
export function ViewCounter({ slug, label = "views" }: ViewCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const storageKey = `viewed_${slug}`;
    const alreadyViewed =
      typeof window !== "undefined" && localStorage.getItem(storageKey) === "1";

    let cancelled = false;

    async function fetchOrIncrement() {
      try {
        if (alreadyViewed) {
          const res = await fetch(
            `/api/blog/views?slug=${encodeURIComponent(slug)}`,
            { cache: "no-store" }
          );
          if (!res.ok) return;
          const data = await res.json();
          if (!cancelled) setCount(data.count ?? 0);
        } else {
          const res = await fetch("/api/blog/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          });
          if (!res.ok) return;
          const data = await res.json();
          if (!cancelled) {
            setCount(data.count ?? 0);
            try {
              localStorage.setItem(storageKey, "1");
            } catch {
              // localStorage may be disabled — silently ignore
            }
          }
        }
      } catch {
        // Network error — leave count null, render nothing
      }
    }

    fetchOrIncrement();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (count === null) {
    return (
      <div className="mt-12 flex items-center justify-center gap-2 border-t border-white/5 pt-6 text-sm text-slate-500">
        <Eye className="h-4 w-4" />
        <span className="opacity-50">—</span>
      </div>
    );
  }

  const formatted = new Intl.NumberFormat("en-US").format(count);

  return (
    <div className="mt-12 flex items-center justify-center gap-2 border-t border-white/5 pt-6 text-sm text-slate-400">
      <Eye className="h-4 w-4 text-pink-400" />
      <span>
        <strong className="text-white font-semibold">{formatted}</strong>{" "}
        {label}
      </span>
    </div>
  );
}
