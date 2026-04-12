import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/billing/subscription
 * Returns subscription details for the current user.
 */
export async function GET() {
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
    return NextResponse.json({ subscription: null });
  }

  try {
    const { getSubscription, isConfigured } = await import("@/lib/dodo-payments");
    if (!isConfigured()) {
      return NextResponse.json({ subscription: null });
    }

    const sub = await getSubscription(profile.stripe_customer_id);
    return NextResponse.json({
      subscription: {
        status: sub.status || "active",
        plan: profile.plan,
        currentPeriodEnd: sub.current_period_end || sub.next_billing_date || sub.ends_at || null,
        cancelAtPeriodEnd: sub.cancel_at_period_end || sub.status === "cancelled" || false,
      },
    });
  } catch (err) {
    console.error("[BILLING] Failed to get subscription:", err);
    return NextResponse.json({
      subscription: {
        status: "active",
        plan: profile.plan,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });
  }
}
