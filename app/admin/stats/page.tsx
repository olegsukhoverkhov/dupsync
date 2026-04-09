import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVisitStats } from "@/lib/analytics";
import { Users, Repeat, TrendingUp, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/**
 * Private admin analytics page. Gated on `ADMIN_EMAILS` (comma-separated
 * Vercel env var). Anyone not in the list gets a 404 — we do NOT leak
 * the route's existence.
 *
 * Intentionally minimal: two big counters (unique + returning), a
 * couple of extras, no charts. Extend later if we actually need more.
 */
export default async function AdminStatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (!user || !allowed.includes((user.email || "").toLowerCase())) {
    // 404 instead of 401/403 — keeps the URL undiscoverable by
    // unauthenticated scanners.
    notFound();
  }

  const stats = await getVisitStats();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
            Admin
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Site Visitors
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Unique visitors are counted by hashed IP. Your own IP is
            excluded via <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">ADMIN_IP_HASH</code>.
            Obvious bots (UA match) are filtered at write time.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={<Users className="h-5 w-5 text-pink-400" />}
            label="Unique visitors"
            value={stats.unique}
            subtitle="Distinct IPs ever seen"
          />
          <StatCard
            icon={<Repeat className="h-5 w-5 text-violet-400" />}
            label="Returning visitors"
            value={stats.returning}
            subtitle="IPs with more than one visit"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
            label="Total visits"
            value={stats.totalVisits}
            subtitle="Sum of visit_count across all rows"
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-amber-400" />}
            label="Last 24 hours"
            value={stats.last24h}
            subtitle="Visits where last_seen_at ≥ now() − 24h"
          />
        </div>

        <p className="mt-10 text-xs text-slate-500">
          Data comes from <code>site_visits</code> via the{" "}
          <code>site_visit_stats</code> RPC. Only marketing routes are
          tracked — the dashboard and auth pages never hit the counter.
        </p>
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
    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-4 text-4xl font-bold tabular-nums text-white">
        {value.toLocaleString("en-US")}
      </p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
