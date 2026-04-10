import type { ReactNode } from "react";

/**
 * Single-row quota card: used / max with a progress bar. Turns
 * amber at ≥75% and red at ≥90% so the operator notices before
 * the pipeline actually starts falling back. `undefined` used/max
 * means the probe failed — renders as a dashed placeholder.
 */
export function QuotaCard({
  icon,
  label,
  used,
  max,
  subtitle,
}: {
  icon: ReactNode;
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
