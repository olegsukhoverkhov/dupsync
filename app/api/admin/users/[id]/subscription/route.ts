import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/users/[id]/subscription
 * Admin-only. Toggle auto-renew for a user's Dodo subscription.
 * Body: { action: "toggle" | "cancel" | "reactivate" }
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await ctx.params;

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: caller } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!caller?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Get target user's subscription ID
  const service = await createServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("stripe_customer_id, plan")
    .eq("id", targetId)
    .single();
  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription found for this user" }, { status: 400 });
  }

  let body: { action?: string } = {};
  try { body = await request.json(); } catch {}

  try {
    const { getSubscription, cancelSubscription } = await import("@/lib/dodo-payments");

    // Check current status
    const sub = await getSubscription(profile.stripe_customer_id);
    const status = sub.status as string;

    if (status === "cancelled") {
      return NextResponse.json({ error: "Already cancelled. Dodo does not support reactivation — user must create a new subscription." }, { status: 400 });
    }

    await cancelSubscription(profile.stripe_customer_id);
    console.log(`[ADMIN] Cancelled subscription for user ${targetId}`);
    return NextResponse.json({ ok: true, action: "cancel", previousStatus: status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN] Subscription toggle failed for ${targetId}:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
