import { notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getVisitStats, getVisitDailyChart, getOnlineCounts, getVisitCountries, getCountryUserStats } from "@/lib/analytics";
import { VisitsChart } from "@/components/admin/visits-chart";
import { LiveCountryTable } from "@/components/admin/live-country-table";
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

  const service = await createServiceClient();
  const [stats, dailyData, online, countries, countryUsers, snapshotRow] = await Promise.all([
    getVisitStats({ from: range.from, to: range.to }),
    getVisitDailyChart({ from: range.from, to: range.to }),
    getOnlineCounts(),
    getVisitCountries({ from: range.from, to: range.to }),
    getCountryUserStats(),
    service.from("admin_analytics_snapshot").select("country_data").eq("id", "default").single(),
  ]);
  const snapshot = (snapshotRow.data?.country_data || {}) as Record<string, { visits: number; registered: number; paid: number }>;

  // Merge traffic countries + profile countries into one list
  const userStatsMap = new Map<string, { registered: number; paid: number }>();
  for (const cu of countryUsers) {
    userStatsMap.set(cu.country, { registered: cu.registered, paid: cu.paid });
  }

  // Add countries that exist in profiles but not in traffic
  const trafficCountryCodes = new Set(countries.map((c) => c.country));
  for (const cu of countryUsers) {
    if (!trafficCountryCodes.has(cu.country)) {
      countries.push({ country: cu.country, visits: 0, unique_visitors: 0 });
    }
  }

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

      {/* ── Country breakdown (live) ────────────────────────── */}
      <LiveCountryTable
        initialData={countries.map((c) => ({
          country: c.country,
          unique_visitors: c.unique_visitors,
          visits: c.visits,
          registered: userStatsMap.get(c.country)?.registered || 0,
          paid: userStatsMap.get(c.country)?.paid || 0,
        }))}
        initialSnapshot={snapshot}
        totalUnique={stats.unique}
      />
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

