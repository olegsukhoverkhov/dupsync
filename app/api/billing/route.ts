import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/billing
 *
 * Handles subscription checkout and portal redirects.
 * Provider: Dodo Payments.
 *
 * Request body:
 *   { action: "checkout", plan: "starter"|"pro"|"enterprise" }
 *   { action: "portal" }
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { action, plan } = body as { action: string; plan?: string };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const returnUrl = `${request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  // ── Dodo Payments (primary) ──────────────────────────────
  const { isConfigured, createSubscriptionCheckout, getPlanProductId } = await import("@/lib/dodo-payments");

  if (isConfigured()) {
    if (action === "checkout" && plan) {
      const productId = getPlanProductId(plan);
      if (!productId) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      const url = await createSubscriptionCheckout({
        productId,
        customerEmail: user.email!,
        customerName: profile.full_name || undefined,
        userId: user.id,
        returnUrl,
      });

      // Track checkout initiated (non-blocking)
      const { createServiceClient } = await import("@/lib/supabase/server");
      const service = await createServiceClient();
      service.from("transactions").insert({
        user_id: user.id,
        type: "checkout_initiated",
        amount: 0,
        credits: 0,
        description: `Checkout started: ${plan} plan`,
        is_test: process.env.DODO_PAYMENTS_ENV !== "production",
      }).then(() => {});

      return NextResponse.json({ url });
    }

    if (action === "portal") {
      // Dodo doesn't have a portal URL API — redirect to dashboard
      // or manage via our own settings page
      return NextResponse.json({
        error: "Subscription management is available in Settings. Contact support to cancel.",
        code: "use_settings",
      }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // ── Not configured ───────────────────────────────────────
  return NextResponse.json(
    {
      error: "Plan upgrades are coming soon — we're finalising the payment provider. In the meantime, your current plan stays active.",
      code: "provider_not_configured",
    },
    { status: 501 }
  );
}
