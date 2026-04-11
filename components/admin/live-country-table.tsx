"use client";

import { useEffect, useState } from "react";

type CountryRow = {
  country: string;
  unique_visitors: number;
  visits: number;
  registered: number;
  paid: number;
};

type Snapshot = Record<string, { visits: number; registered: number; paid: number }>;

/**
 * Country table with persistent "new" counters.
 * Deltas are calculated from a DB-stored snapshot (last time admin
 * viewed this page). Snapshot is saved when the page is closed/left.
 */
export function LiveCountryTable({
  initialData,
  initialSnapshot,
  totalUnique,
}: {
  initialData: CountryRow[];
  initialSnapshot: Snapshot;
  totalUnique: number;
}) {
  const [data, setData] = useState<CountryRow[]>(initialData);
  const [snapshot] = useState<Snapshot>(initialSnapshot);

  // Poll every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/country-visits");
        if (!res.ok) return;
        const json = await res.json();
        setData(json.data || []);
      } catch {}
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  // Save snapshot when leaving the page
  useEffect(() => {
    function saveSnapshot() {
      // Use keepalive so it survives page unload
      fetch("/api/admin/country-visits", { method: "POST", keepalive: true }).catch(() => {});
    }

    window.addEventListener("beforeunload", saveSnapshot);
    // Also listen for visibility change (tab switch on mobile)
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") saveSnapshot();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", saveSnapshot);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Also save when component unmounts (SPA navigation)
      saveSnapshot();
    };
  }, []);

  // Calculate deltas from DB snapshot
  function getDelta(country: string) {
    const row = data.find((r) => r.country === country);
    const base = snapshot[country];
    if (!row) return { visits: 0, registered: 0, paid: 0 };
    if (!base) return { visits: row.visits, registered: row.registered, paid: row.paid }; // New country
    return {
      visits: Math.max(0, row.visits - base.visits),
      registered: Math.max(0, row.registered - base.registered),
      paid: Math.max(0, row.paid - base.paid),
    };
  }

  const totalNewVisits = data.reduce((s, r) => s + getDelta(r.country).visits, 0);
  const totalNewReg = data.reduce((s, r) => s + getDelta(r.country).registered, 0);
  const totalNewPaid = data.reduce((s, r) => s + getDelta(r.country).paid, 0);
  const totalNew = totalNewVisits + totalNewReg + totalNewPaid;

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Countries
          </h2>
          {totalNew > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              +{totalNewVisits > 0 ? `${totalNewVisits} visits` : ""}
              {totalNewReg > 0 ? `${totalNewVisits > 0 ? ", " : ""}${totalNewReg} reg` : ""}
              {totalNewPaid > 0 ? `${(totalNewVisits > 0 || totalNewReg > 0) ? ", " : ""}${totalNewPaid} paid` : ""}
            </span>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3 text-right">Unique</th>
              <th className="px-4 py-3 text-right">Visits</th>
              <th className="px-4 py-3 text-right">Registered</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((c) => {
              const share = totalUnique > 0
                ? Math.round((c.unique_visitors / totalUnique) * 100)
                : 0;
              const d = getDelta(c.country);
              return (
                <tr key={c.country} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{countryFlag(c.country)}</span>
                      <span className="text-white font-medium">{c.country}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-white">
                    {c.unique_visitors}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">
                    {c.visits}
                    {d.visits > 0 && (
                      <span className="ml-1 text-emerald-400 text-[10px] font-semibold">+{d.visits}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-400">
                    {c.registered}
                    {d.registered > 0 && (
                      <span className="ml-1 text-emerald-300 text-[10px] font-semibold">+{d.registered}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-pink-400">
                    {c.paid}
                    {d.paid > 0 && (
                      <span className="ml-1 text-pink-300 text-[10px] font-semibold">+{d.paid}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-pink-500/70 rounded-full"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-slate-500 w-8 text-right">
                        {share}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}
