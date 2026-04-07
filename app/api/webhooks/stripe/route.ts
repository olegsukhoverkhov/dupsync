import { NextResponse } from "next/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type { PlanType } from "@/lib/supabase/types";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerId = session.customer as string;
      const userId = session.metadata?.userId;

      if (!userId) break;

      // Find the plan from the subscription
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0]?.price.id;

      const planEntry = Object.entries(STRIPE_PLANS).find(
        ([, p]) => p.priceId === priceId
      );

      if (planEntry) {
        const [, planConfig] = planEntry;
        await supabase
          .from("profiles")
          .update({
            plan: planConfig.plan as PlanType,
            credits_remaining: planConfig.credits,
            stripe_customer_id: customerId,
          })
          .eq("id", userId);

        // Record transaction
        await supabase.from("transactions").insert({
          user_id: userId,
          type: "subscription",
          amount: subscription.items.data[0]?.price.unit_amount || 0,
          credits: planConfig.credits,
          description: `Subscribed to ${planConfig.plan} plan`,
          stripe_session_id: session.id,
        });
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      // Refresh credits on renewal
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, plan")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        const planConfig = Object.values(STRIPE_PLANS).find(
          (p) => p.plan === profile.plan
        );
        if (planConfig) {
          await supabase
            .from("profiles")
            .update({ credits_remaining: planConfig.credits })
            .eq("id", profile.id);

          await supabase.from("transactions").insert({
            user_id: profile.id,
            type: "subscription",
            amount: invoice.amount_paid || 0,
            credits: planConfig.credits,
            description: `${planConfig.plan} plan renewal`,
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      // When a subscription is cancelled the user falls back to the
      // Free plan, which gets 1 credit (= 1 video × 1 language).
      await supabase
        .from("profiles")
        .update({ plan: "free", credits_remaining: 1 })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
