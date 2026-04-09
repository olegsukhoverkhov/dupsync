import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVisitStats } from "@/lib/analytics";
import { getAdminUsers } from "@/lib/admin";
import { resolveRange, type RangePreset } from "@/lib/admin";
import { getElevenLabsQuota } from "@/lib/ai";
import { RangeFilter } from "@/components/admin/range-filter";
import { UsersTable } from "@/components/admin/users-table";
import {
  Users,
  Repeat,
  TrendingUp,
  Clock,
  Mic,
  Archive,
  Type,
} from "lucide-react";

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

  // Run all three queries in parallel — they're independent.
  // ElevenLabs quota is optional: if the helper returns null (probe
  // failed, missing key, etc.) we render a disabled card instead of
  // throwing.
  const [stats, usersPageData, elevenLabsQuota] = await Promise.all([
    getVisitStats({ from: range.from, to: range.to }),
    getAdminUsers(usersPage, 10),
    getElevenLabsQuota(),
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

      {/* ── ElevenLabs quota ─────────────────────────────────────
          Operational telemetry for the voice cloning provider.
          Shows the three counters ElevenLabs exposes on
          /v1/user/subscription: voice_add_edit_counter (hard cap
          on monthly clones; blocks Stage 1 when exhausted), voice
          slots used vs limit, and character count used vs limit.
          Each card goes red once the counter hits >= 90% of its
          cap so the state is obvious at a glance. */}
      <div className="mt-10 mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          ElevenLabs quota
        </h2>
        <p className="text-xs text-slate-500">
          Voice cloning provider · resets each billing cycle
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuotaCard
          icon={<Mic className="h-5 w-5" />}
          label="Voice clones / month"
          used={elevenLabsQuota?.voiceAddEditUsed}
          max={elevenLabsQuota?.voiceAddEditMax}
          subtitle="voice_add_edit_counter — blocks new clones when full"
        />
        <QuotaCard
          icon={<Archive className="h-5 w-5" />}
          label="Voice slots"
          used={elevenLabsQuota?.voiceSlotsUsed}
          max={elevenLabsQuota?.voiceSlotsMax}
          subtitle="Cleanup orphaned clones to free slots"
        />
        <QuotaCard
          icon={<Type className="h-5 w-5" />}
          label="TTS characters"
          used={elevenLabsQuota?.characterUsed}
          max={elevenLabsQuota?.characterMax}
          subtitle="Monthly character allowance for TTS"
        />
      </div>

      <UsersTable initial={usersPageData} />
    </div>
  );
}

/**
 * Single-row quota card: used / max with a progress bar. Turns
 * amber at ≥75% and red at ≥90% so the operator notices before
 * the pipeline actually starts falling back. `undefined` used/max
 * means the probe failed — renders as a dashed placeholder.
 */
function QuotaCard({
  icon,
  label,
  used,
  max,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  used: number | undefined;
  max: number | undefined;
  subtitle: string;
}) {
  const probed = typeof used === "number" && typeof max === "number";
  const pct = probed && max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
  const tone =
    !probed
      ? "text-slate-500"
      : pct >= 90
        ? "text-red-400"
        : pct >= 75
          ? "text-amber-400"
          : "text-emerald-400";
  const barColor =
    !probed
      ? "bg-slate-600/40"
      : pct >= 90
        ? "bg-red-500/70"
        : pct >= 75
          ? "bg-amber-500/70"
          : "bg-emerald-500/70";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${tone}`}>
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className={`text-3xl font-bold tabular-nums ${tone}`}>
          {probed ? used.toLocaleString("en-US") : "—"}
        </p>
        {probed && (
          <p className="text-sm text-slate-500 tabular-nums">
            / {max.toLocaleString("en-US")}
          </p>
        )}
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {probed ? `${pct}% used · ` : ""}
        {subtitle}
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
