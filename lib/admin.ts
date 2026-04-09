import { createServiceClient } from "@/lib/supabase/server";
import type { PlanType } from "@/lib/supabase/types";

// Re-export the pure range helpers for code that wants a single
// import path. Client-side code MUST import directly from
// `@/lib/admin-range` to avoid pulling the service client (and thus
// `next/headers`) into the client bundle.
export { RANGE_PRESETS, resolveRange } from "@/lib/admin-range";
export type { RangePreset } from "@/lib/admin-range";

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
