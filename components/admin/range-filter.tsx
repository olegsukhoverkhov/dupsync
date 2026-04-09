"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { RANGE_PRESETS, type RangePreset } from "@/lib/admin";

/**
 * Time-range filter for /admin/stats. URL is the single source of
 * truth — pressing a preset pushes `?range=day` (etc) and the server
 * component reads it via `searchParams`. Custom range uses two extra
 * params `from` / `to` as YYYY-MM-DD strings.
 *
 * Keeping state in the URL lets an admin share a filtered view and
 * survives a full reload.
 */
export function RangeFilter({
  currentPreset,
  currentFrom,
  currentTo,
}: {
  currentPreset: RangePreset;
  currentFrom: string;
  currentTo: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [from, setFrom] = useState(currentFrom);
  const [to, setTo] = useState(currentTo);

  function setPreset(preset: RangePreset) {
    const next = new URLSearchParams(params.toString());
    next.set("range", preset);
    if (preset !== "custom") {
      next.delete("from");
      next.delete("to");
    }
    // Reset stats pagination when filter changes, but keep user-list
    // pagination intact since it's unrelated to the filter.
    startTransition(() => {
      router.push(`?${next.toString()}`);
    });
  }

  function applyCustom() {
    if (!from || !to) return;
    const next = new URLSearchParams(params.toString());
    next.set("range", "custom");
    next.set("from", from);
    next.set("to", to);
    startTransition(() => {
      router.push(`?${next.toString()}`);
    });
  }

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-slate-800/30 p-4">
      <div className="flex flex-wrap gap-2">
        {RANGE_PRESETS.map((p) => {
          const active = p.value === currentPreset;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => setPreset(p.value)}
              disabled={isPending}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                active
                  ? "bg-pink-500/20 text-pink-200 border border-pink-500/40"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {currentPreset === "custom" && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-pink-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-pink-500/50 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={applyCustom}
            disabled={!from || !to || isPending}
            className="gradient-button rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
