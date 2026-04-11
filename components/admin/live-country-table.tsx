"use client";

import { useEffect, useRef, useState } from "react";

type CountryRow = {
  country: string;
  unique_visitors: number;
  visits: number;
  registered: number;
  paid: number;
};

/**
 * Country table with live "new visits" counter.
 * On mount, snapshots current visit counts. Polls every 30s and shows
 * the delta as "+N new". Resets when the user leaves the page.
 */
export function LiveCountryTable({
  initialData,
  totalUnique,
}: {
  initialData: CountryRow[];
  totalUnique: number;
}) {
  const [data, setData] = useState<CountryRow[]>(initialData);
  type Snapshot = { visits: number; registered: number; paid: number };
  const snapshotRef = useRef<Map<string, Snapshot>>(new Map());
  const [deltas, setDeltas] = useState<Map<string, Snapshot>>(new Map());

  // Snapshot on mount
  useEffect(() => {
    const snap = new Map<string, Snapshot>();
    for (const row of initialData) {
      snap.set(row.country, { visits: row.visits, registered: row.registered, paid: row.paid });
    }
    snapshotRef.current = snap;
  }, []); // Only on mount

  // Poll every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/country-visits");
        if (!res.ok) return;
        const fresh: CountryRow[] = await res.json();
        setData(fresh);

        const newDeltas = new Map<string, Snapshot>();
        for (const row of fresh) {
          const base = snapshotRef.current.get(row.country) || { visits: 0, registered: 0, paid: 0 };
          const dv = row.visits - base.visits;
          const dr = row.registered - base.registered;
          const dp = row.paid - base.paid;
          if (dv > 0 || dr > 0 || dp > 0) {
            newDeltas.set(row.country, {
              visits: Math.max(0, dv),
              registered: Math.max(0, dr),
              paid: Math.max(0, dp),
            });
          }
        }
        setDeltas(newDeltas);
      } catch {}
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  const totalNewVisits = Array.from(deltas.values()).reduce((s, d) => s + d.visits, 0);
  const totalNewReg = Array.from(deltas.values()).reduce((s, d) => s + d.registered, 0);
  const totalNewPaid = Array.from(deltas.values()).reduce((s, d) => s + d.paid, 0);
  const totalNew = totalNewVisits + totalNewReg + totalNewPaid;

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Countries
          </h2>
          {totalNew > 0 && (
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 animate-pulse">
              +{totalNew} new
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
              const d = deltas.get(c.country);
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
                    {d && d.visits > 0 && (
                      <span className="ml-1 text-emerald-400 text-[10px] font-semibold">+{d.visits}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-400">
                    {c.registered}
                    {d && d.registered > 0 && (
                      <span className="ml-1 text-emerald-300 text-[10px] font-semibold">+{d.registered}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-pink-400">
                    {c.paid}
                    {d && d.paid > 0 && (
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
