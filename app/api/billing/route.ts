import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createCheckoutSession,
  createBillingPortalSession,
  getOrCreateCustomer,
  STRIPE_PLANS,
} from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, plan } = body as { action: string; plan?: string };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Get or create Stripe customer
  let customerId = profile.stripe_customer_id;
  if (!customerId) {
    const customer = await getOrCreateCustomer({
      email: user.email!,
      userId: user.id,
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const returnUrl = `${request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL}/settings`;

  if (action === "checkout" && plan) {
    const stripePlan = STRIPE_PLANS[plan];
    if (!stripePlan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await createCheckoutSession({
      customerId,
      priceId: stripePlan.priceId,
      userId: user.id,
      returnUrl,
    });

    return NextResponse.json({ url: session.url });
  }

  if (action === "portal") {
    const session = await createBillingPortalSession({
      customerId,
      returnUrl,
    });

    return NextResponse.json({ url: session.url });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
