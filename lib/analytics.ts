import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";

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
export async function trackVisit(path: string): Promise<void> {
  try {
    console.log(`[trackVisit] start path=${path}`);
    const salt = process.env.SITE_VISIT_SALT;
    if (!salt) {
      console.warn("[trackVisit] skip: SITE_VISIT_SALT not set");
      return;
    }

    const h = await headers();

    // Real visitor IP. Cloudflare fronts the origin, so prefer
    // `cf-connecting-ip`. Fall back to Vercel/standard headers.
    const ip =
      h.get("cf-connecting-ip") ||
      h.get("x-real-ip") ||
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "";

    if (!ip) {
      console.warn("[trackVisit] skip: no IP in headers");
      return;
    }

    const ipHash = createHash("sha256").update(salt + ip).digest("hex");
    console.log(`[trackVisit] ipHash=${ipHash.slice(0, 12)}... path=${path}`);

    // Admin exclusion — do not record the operator's own browsing.
    if (ipHash === process.env.ADMIN_IP_HASH) {
      console.log("[trackVisit] skip: admin hash match");
      return;
    }

    const userAgent = h.get("user-agent") || null;
    // Skip obvious bots so the counter reflects real humans. This is
    // a naive filter; anything claiming to be a browser gets through.
    if (userAgent && /bot|crawler|spider|slurp|bingpreview/i.test(userAgent)) {
      return;
    }

    const country =
      h.get("cf-ipcountry") || h.get("x-vercel-ip-country") || null;

    const supabase = await createServiceClient();

    // Postgres-side atomic upsert: insert if new, else bump count +
    // last_seen. We use an RPC to avoid a read-then-write race when
    // two tabs fire simultaneously.
    const { error } = await supabase.rpc("record_site_visit", {
      p_ip_hash: ipHash,
      p_path: path,
      p_user_agent: userAgent,
      p_country: country,
    });
    if (error) {
      console.error("[trackVisit] rpc error:", error);
    } else {
      console.log("[trackVisit] wrote row");
    }
  } catch (err) {
    console.error("[trackVisit] exception:", err);
  }
}

/**
 * Read the two counters + a few extras for the admin stats page.
 * Returns zeros on any error so the page still renders.
 */
export async function getVisitStats(): Promise<{
  unique: number;
  returning: number;
  totalVisits: number;
  last24h: number;
}> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc("site_visit_stats");
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
