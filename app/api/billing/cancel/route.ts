import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing/cancel
 * Cancels the current user's subscription via Dodo Payments.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id")
    .eq("id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  if (profile.plan === "free" || !profile.stripe_customer_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  try {
    const { cancelSubscription } = await import("@/lib/dodo-payments");
    await cancelSubscription(profile.stripe_customer_id);

    console.log(`[BILLING] User ${user.id} cancelled subscription ${profile.stripe_customer_id}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[BILLING] Cancel failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
