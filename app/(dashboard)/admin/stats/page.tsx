import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVisitStats } from "@/lib/analytics";
import { getAdminUsers } from "@/lib/admin";
import { resolveRange, type RangePreset } from "@/lib/admin";
import { RangeFilter } from "@/components/admin/range-filter";
import { UsersTable } from "@/components/admin/users-table";
import { Users, Repeat, TrendingUp, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/**
 * Private admin dashboard. Gated on `profiles.is_admin = true`.
 * Non-admins (including logged-in users) get a 404 so the URL never
 * confirms its existence.
 *
 * URL state:
 *   ?range=all|day|yesterday|week|month|year|custom   (default: all)
 *   ?from=YYYY-MM-DD  ?to=YYYY-MM-DD                  (custom only)
 *   ?users=N                                          (user list page)
 *
 * The page is a server component that reads searchParams, resolves
 * the range on the server, runs the two DB queries in parallel, and
 * hands the results to two client islands (RangeFilter, UsersTable)
 * for interaction.
 */
export default async function AdminStatsPage({
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

  // Pluck query state from the URL. Array values (?key=a&key=b) are
  // not expected here so we take the first element.
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
  const usersPageParam = parseInt(pick("users") || "1", 10);
  const usersPage = Number.isFinite(usersPageParam) && usersPageParam > 0
    ? usersPageParam
    : 1;

  const range = resolveRange(
    preset,
    customFrom || null,
    customTo || null
  );

  // Run both queries in parallel — they're independent.
  const [stats, usersPageData] = await Promise.all([
    getVisitStats({ from: range.from, to: range.to }),
    getAdminUsers(usersPage, 10),
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
          . Obvious bots are filtered at write time. Access to this
          page is gated on{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
            profiles.is_admin
          </code>
          .
        </p>
      </header>

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

      <UsersTable initial={usersPageData} />
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
