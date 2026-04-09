import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVisitStats } from "@/lib/analytics";
import { Users, Repeat, TrendingUp, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/**
 * Private admin analytics page. Gated on `profiles.is_admin = true`.
 * Anyone without the flag gets a 404 — we do NOT leak the route's
 * existence via 401/403.
 *
 * Intentionally minimal: two big counters (unique + returning), a
 * couple of extras, no charts. Extend later if we actually need more.
 */
export default async function AdminStatsPage() {
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

  if (!profile?.is_admin) {
    // 404 instead of 401/403 — keeps the URL undiscoverable by
    // unauthenticated scanners and by logged-in non-admins.
    notFound();
  }

  const stats = await getVisitStats();

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Site Visitors
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Unique visitors are counted by hashed IP. The operator's
          own IP is excluded via{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
            ADMIN_IP_HASH
          </code>
          . Obvious bots are filtered at write time. Access to this
          page is gated on{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
            profiles.is_admin
          </code>
          .
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

      <p className="mt-8 text-xs text-slate-500">
        Data comes from <code>site_visits</code> via the{" "}
        <code>site_visit_stats</code> RPC. Only marketing routes are
        tracked — the dashboard and auth pages never hit the counter.
      </p>
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
