/**
 * Pure time-range helpers for the admin dashboard. Kept server/client
 * safe — NO imports from `@/lib/supabase/server` or anything that
 * touches `next/headers`, so this module can be imported from both
 * the server component (page.tsx) and the client islands.
 */

export type RangePreset =
  | "all"
  | "day"
  | "yesterday"
  | "week"
  | "month"
  | "year"
  | "custom";

export const RANGE_PRESETS: { value: RangePreset; label: string }[] = [
  { value: "all",       label: "All time" },
  { value: "day",       label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week",      label: "Last 7 days" },
  { value: "month",     label: "Last 30 days" },
  { value: "year",      label: "Last 365 days" },
  { value: "custom",    label: "Custom" },
];

/**
 * Resolve a preset + optional custom bounds into concrete UTC ISO
 * timestamps. Returned `from`/`to` are passed straight to the
 * `site_visit_stats(from, to)` RPC — `to` is EXCLUSIVE.
 *
 * Presets are computed against the server's current clock (UTC on
 * Vercel), which is fine for a solo admin dashboard.
 */
export function resolveRange(
  preset: RangePreset,
  customFrom?: string | null,
  customTo?: string | null
): { from: string | null; to: string | null; label: string } {
  const now = new Date();
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1);

  switch (preset) {
    case "day":
      return {
        from: startOfToday.toISOString(),
        to: startOfTomorrow.toISOString(),
        label: "Today",
      };
    case "yesterday":
      return {
        from: startOfYesterday.toISOString(),
        to: startOfToday.toISOString(),
        label: "Yesterday",
      };
    case "week": {
      const from = new Date(now);
      from.setUTCDate(from.getUTCDate() - 7);
      return { from: from.toISOString(), to: now.toISOString(), label: "Last 7 days" };
    }
    case "month": {
      const from = new Date(now);
      from.setUTCDate(from.getUTCDate() - 30);
      return { from: from.toISOString(), to: now.toISOString(), label: "Last 30 days" };
    }
    case "year": {
      const from = new Date(now);
      from.setUTCFullYear(from.getUTCFullYear() - 1);
      return { from: from.toISOString(), to: now.toISOString(), label: "Last 365 days" };
    }
    case "custom": {
      // Accept plain YYYY-MM-DD or any ISO string. For YYYY-MM-DD we
      // interpret as start-of-day UTC for `from`, and start-of-NEXT-day
      // UTC for `to` so the end date is included.
      const from = customFrom ? normalizeStartOfDay(customFrom) : null;
      const to = customTo ? normalizeEndOfDayExclusive(customTo) : null;
      return {
        from,
        to,
        label:
          from && to
            ? `${from.slice(0, 10)} → ${customTo?.slice(0, 10)}`
            : "Custom",
      };
    }
    case "all":
    default:
      return { from: null, to: null, label: "All time" };
  }
}

function normalizeStartOfDay(s: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00:00.000Z`;
  return new Date(s).toISOString();
}

function normalizeEndOfDayExclusive(s: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString();
  }
  return new Date(s).toISOString();
}
