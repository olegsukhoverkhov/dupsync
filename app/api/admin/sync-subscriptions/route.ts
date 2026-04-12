import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/sync-subscriptions
 * One-time: fetch expiry dates from Dodo for all active subscriptions.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: caller } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!caller?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = await createServiceClient();
  const { data: profiles } = await service
    .from("profiles")
    .select("id, stripe_customer_id, plan")
    .neq("plan", "free")
    .not("stripe_customer_id", "is", null);

  if (!profiles?.length) return NextResponse.json({ synced: 0 });

  const { getSubscription } = await import("@/lib/dodo-payments");
  const results: Array<{ id: string; expires: string | null; error?: string }> = [];

  for (const p of profiles) {
    try {
      const sub = await getSubscription(p.stripe_customer_id!);
      const expiresAt = (sub.current_period_end || sub.next_billing_date || sub.ends_at || null) as string | null;
      if (expiresAt) {
        await service.from("profiles").update({ subscription_expires_at: expiresAt }).eq("id", p.id);
      }
      results.push({ id: p.id, expires: expiresAt });
    } catch (err) {
      results.push({ id: p.id, expires: null, error: err instanceof Error ? err.message : "unknown" });
    }
  }

  return NextResponse.json({ synced: results.length, results });
}
