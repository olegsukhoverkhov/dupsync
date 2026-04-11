import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVisitStats, getVisitDailyChart, getOnlineCounts, getVisitCountries } from "@/lib/analytics";
import { VisitsChart } from "@/components/admin/visits-chart";
import { resolveRange, type RangePreset } from "@/lib/admin";
import { RangeFilter } from "@/components/admin/range-filter";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Users,
  Repeat,
  TrendingUp,
  Clock,
  Monitor,
  Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) notFound();

  const sp = await searchParams;
  const pick = (k: string): string => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] ?? "" : v ?? "";
  };
  const presetParam = (pick("range") || "all") as RangePreset;
  const allowed: RangePreset[] = [
    "all", "day", "yesterday", "week", "month", "year", "custom",
  ];
  const preset: RangePreset = allowed.includes(presetParam)
    ? presetParam
    : "all";
  const customFrom = pick("from");
  const customTo = pick("to");

  const range = resolveRange(preset, customFrom || null, customTo || null);

  const [stats, dailyData, online, countries] = await Promise.all([
    getVisitStats({ from: range.from, to: range.to }),
    getVisitDailyChart({ from: range.from, to: range.to }),
    getOnlineCounts(),
    getVisitCountries({ from: range.from, to: range.to }),
  ]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Site Analytics
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Unique visitors are counted by hashed IP. The operator&apos;s own
          IP is excluded via{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
            ADMIN_IP_HASH
          </code>
          .
        </p>
      </header>

      <AdminNav />

      <RangeFilter
        currentPreset={preset}
        currentFrom={customFrom}
        currentTo={customTo}
      />

      {/* ── Online right now ────────────────────────────── */}
      <div className="mb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Online right now
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Monitor className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              In dashboard
            </p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <p className="text-3xl font-bold tabular-nums text-emerald-400">
              {online.dashboardUsers}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-500">Active in the last 2 minutes</p>
        </div>
        <div className="rounded-2xl border border-blue-500/20 bg-slate-800/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              On site
            </p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <p className="text-3xl font-bold tabular-nums text-blue-400">
              {online.siteVisitors}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-500">Visitors on marketing pages (excl. dashboard)</p>
        </div>
      </div>

      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Visits
        </h2>
        <p className="text-xs text-slate-500">{range.label}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-pink-400" />}
          label="Unique"
          value={stats.unique}
          subtitle="Distinct IPs in range"
        />
        <StatCard
          icon={<Repeat className="h-5 w-5 text-violet-400" />}
          label="Returning"
          value={stats.returning}
          subtitle="≥2 visits in range"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          label="Total visits"
          value={stats.totalVisits}
          subtitle="Events in range"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-amber-400" />}
          label="Last 24h"
          value={stats.last24h}
          subtitle="Ignores filter"
        />
      </div>

      <div className="mt-6">
        <VisitsChart data={dailyData} label={range.label} />
      </div>

      {/* ── Country breakdown ─────────────────────────────── */}
      {countries.length > 0 && (
        <div className="mt-8">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Countries
            </h2>
            <p className="text-xs text-slate-500">{range.label}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3 text-right">Unique</th>
                  <th className="px-4 py-3 text-right">Visits</th>
                  <th className="px-4 py-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {countries.map((c, i) => {
                  const share = stats.unique > 0
                    ? Math.round((c.unique_visitors / stats.unique) * 100)
                    : 0;
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
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-white">
        {value.toLocaleString("en-US")}
      </p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

/** Convert "US" → 🇺🇸 using regional indicator symbols */
function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  const offset = 0x1f1e6 - 65; // 'A' = 65
  return String.fromCodePoint(
    code.charCodeAt(0) + offset,
    code.charCodeAt(1) + offset
  );
}
