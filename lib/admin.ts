import { createServiceClient } from "@/lib/supabase/server";
import type { PlanType } from "@/lib/supabase/types";

/**
 * Time-range preset keys used by the /admin/stats filter. Each preset
 * maps to a concrete [from, to) window at `resolveRange()` time so the
 * URL state can stay tiny and shareable.
 *
 * `day` is "today", `yesterday` is the calendar day before today,
 * `custom` expects explicit `from` / `to` query params.
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
    // Bump day by 1 and use start-of-day as the EXCLUSIVE upper bound.
    const d = new Date(`${s}T00:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString();
  }
  return new Date(s).toISOString();
}

// ─────────────────────────── Users ───────────────────────────

export type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  plan: PlanType;
  credits_remaining: number;
  topup_credits: number;
  credits_used_total: number;
  last_login_at: string | null;
  created_at: string;
  is_admin: boolean;
};

export type AdminUsersPage = {
  rows: AdminUserRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Paginated list of users for /admin/stats. Uses the `admin_users_list`
 * RPC which joins auth.users + profiles + credit_usage in a single round
 * trip. All authorization must be handled by the caller (page checks
 * `profile.is_admin`).
 */
export async function getAdminUsers(
  page: number,
  pageSize: number = 10
): Promise<AdminUsersPage> {
  const safePage = Math.max(1, Math.floor(page));
  const safeSize = Math.max(1, Math.min(50, Math.floor(pageSize)));
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc("admin_users_list", {
      p_limit: safeSize,
      p_offset: (safePage - 1) * safeSize,
    });
    if (error || !data) {
      return {
        rows: [],
        totalCount: 0,
        page: safePage,
        pageSize: safeSize,
        totalPages: 0,
      };
    }
    const rows: AdminUserRow[] = (data as unknown as RawAdminUserRow[]).map((r) => ({
      id: r.id,
      email: r.email,
      full_name: r.full_name,
      plan: r.plan as PlanType,
      credits_remaining: Number(r.credits_remaining ?? 0),
      topup_credits: Number(r.topup_credits ?? 0),
      credits_used_total: Number(r.credits_used_total ?? 0),
      last_login_at: r.last_login_at,
      created_at: r.created_at,
      is_admin: Boolean(r.is_admin),
    }));
    const totalCount = Number(
      (data as unknown as RawAdminUserRow[])[0]?.total_count ?? 0
    );
    return {
      rows,
      totalCount,
      page: safePage,
      pageSize: safeSize,
      totalPages: Math.max(1, Math.ceil(totalCount / safeSize)),
    };
  } catch {
    return {
      rows: [],
      totalCount: 0,
      page: safePage,
      pageSize: safeSize,
      totalPages: 0,
    };
  }
}

type RawAdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  credits_remaining: number | string;
  topup_credits: number | string;
  credits_used_total: number | string;
  last_login_at: string | null;
  created_at: string;
  is_admin: boolean;
  total_count: number | string;
};
