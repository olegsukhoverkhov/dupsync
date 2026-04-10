import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVisitStats, getVisitDailyChart } from "@/lib/analytics";
import { VisitsChart } from "@/components/admin/visits-chart";
import { resolveRange, type RangePreset } from "@/lib/admin";
import { RangeFilter } from "@/components/admin/range-filter";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Users,
  Repeat,
  TrendingUp,
  Clock,
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

  const [stats, dailyData] = await Promise.all([
    getVisitStats({ from: range.from, to: range.to }),
    getVisitDailyChart({ from: range.from, to: range.to }),
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
