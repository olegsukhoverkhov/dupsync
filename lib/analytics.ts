import { createHash } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Request context the caller collects from `headers()` BEFORE
 * scheduling trackVisit via `after()`. Next disallows calling
 * request-scoped APIs (headers, cookies, draftMode) inside after()
 * callbacks, so the caller must extract values eagerly.
 */
export type VisitContext = {
  ip: string;
  userAgent: string | null;
  country: string | null;
  path: string;
};

/**
 * Lightweight site-visit tracking.
 *
 * Called from the marketing layout via `after()` so it never blocks
 * the response. Hashes the visitor's IP with a server-side salt and
 * upserts a row in `site_visits`. Subsequent visits from the same IP
 * bump `visit_count` and `last_seen_at`, giving us two numbers:
 *
 *   - Unique visitors  = count(*)           — one row per ever-seen IP
 *   - Returning visits = count where visit_count > 1
 *
 * The admin operator's own visits are excluded by comparing the hash
 * to `ADMIN_IP_HASH` (set once in Vercel env after capturing the real
 * IP from the first visit). If the salt is missing we skip tracking
 * entirely — refusing to write unsalted hashes.
 *
 * We never persist the raw IP. The salt is long-lived: rotating it
 * would invalidate `ADMIN_IP_HASH` and start a new "epoch" of IP
 * identity (existing rows would become orphans that never match new
 * visitors again).
 */
export async function trackVisit(ctx: VisitContext): Promise<void> {
  try {
    const salt = process.env.SITE_VISIT_SALT;
    if (!salt) return;
    if (!ctx.ip) return;

    // Skip obvious bots so the counter reflects real humans. Naive UA
    // filter; anything claiming to be a browser gets through.
    if (ctx.userAgent && /bot|crawler|spider|slurp|bingpreview/i.test(ctx.userAgent)) {
      return;
    }

    const ipHash = createHash("sha256").update(salt + ctx.ip).digest("hex");

    // Admin exclusion — do not record the operator's own browsing.
    if (ipHash === process.env.ADMIN_IP_HASH) return;

    const supabase = await createServiceClient();

    // Postgres-side atomic upsert: insert if new, else bump count +
    // last_seen. We use an RPC to avoid a read-then-write race when
    // two tabs fire simultaneously.
    const { error } = await supabase.rpc("record_site_visit", {
      p_ip_hash: ipHash,
      p_path: ctx.path,
      p_user_agent: ctx.userAgent,
      p_country: ctx.country,
    });
    if (error) {
      // Keep the error log — a silent analytics failure is almost
      // impossible to notice otherwise. Everything else stays quiet.
      console.error("[trackVisit] rpc error:", error);
    }
  } catch (err) {
    console.error("[trackVisit] exception:", err);
  }
}

/**
 * Daily visit counts for the chart on /admin/stats. Returns an
 * array of { day: "YYYY-MM-DD", visits: number } ordered by date.
 */
export async function getVisitDailyChart(range?: {
  from?: string | null;
  to?: string | null;
}): Promise<Array<{ day: string; visits: number }>> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc("site_visit_daily", {
      p_from: range?.from ?? null,
      p_to: range?.to ?? null,
    });
    if (error || !data) return [];
    return (data as Array<{ day: string; visits: number }>).map((r) => ({
      day: String(r.day),
      visits: Number(r.visits),
    }));
  } catch {
    return [];
  }
}

/**
 * Read visit counters for the admin stats page. Accepts an optional
 * ISO date range. `from`/`to` are INCLUSIVE of `from` and EXCLUSIVE
 * of `to` on the SQL side so callers can safely pass "start of next
 * day" to include a full day without off-by-one errors.
 *
 * Returns zeros on any error so the page still renders.
 */
export async function getVisitStats(range?: {
  from?: string | null;
  to?: string | null;
}): Promise<{
  unique: number;
  returning: number;
  totalVisits: number;
  last24h: number;
}> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc("site_visit_stats", {
      p_from: range?.from ?? null,
      p_to: range?.to ?? null,
    });
    if (error || !data) {
      return { unique: 0, returning: 0, totalVisits: 0, last24h: 0 };
    }
    // RPC returns a single-row set.
    const row = Array.isArray(data) ? data[0] : data;
    return {
      unique: Number(row?.unique_count ?? 0),
      returning: Number(row?.returning_count ?? 0),
      totalVisits: Number(row?.total_visits ?? 0),
      last24h: Number(row?.last_24h ?? 0),
    };
  } catch {
    return { unique: 0, returning: 0, totalVisits: 0, last24h: 0 };
  }
}

/**
 * Live online counters for the admin analytics page.
 * - dashboardUsers: users with a heartbeat in the last 2 minutes
 * - siteVisitors: distinct IPs seen on marketing pages in the last 2 minutes
 */
/**
 * Country breakdown for the admin analytics page.
 */
export async function getVisitCountries(range?: {
  from?: string | null;
  to?: string | null;
}): Promise<Array<{ country: string; visits: number; unique_visitors: number }>> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc("site_visit_countries", {
      p_from: range?.from ?? null,
      p_to: range?.to ?? null,
    });
    if (error || !data) return [];
    return (data as Array<{ country: string; visits: number; unique_visitors: number }>).map((r) => ({
      country: String(r.country),
      visits: Number(r.visits),
      unique_visitors: Number(r.unique_visitors),
    }));
  } catch {
    return [];
  }
}

export async function getOnlineCounts(): Promise<{
  dashboardUsers: number;
  siteVisitors: number;
}> {
  try {
    const supabase = await createServiceClient();
    const [dashRes, siteRes] = await Promise.all([
      supabase.rpc("online_dashboard_users"),
      supabase.rpc("online_site_visitors"),
    ]);
    return {
      dashboardUsers: Number(dashRes.data ?? 0),
      siteVisitors: Number(siteRes.data ?? 0),
    };
  } catch {
    return { dashboardUsers: 0, siteVisitors: 0 };
  }
}
