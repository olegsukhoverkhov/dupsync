import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyWebhook } from "@/lib/dodo-payments";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/dodo — Dodo Payments webhook receiver.
 *
 * Handles:
 *   - payment.succeeded → credit top-ups
 *   - subscription.created → plan activation
 *   - subscription.updated → plan changes, cancellation
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const webhookHeaders: Record<string, string> = {};
  req.headers.forEach((v, k) => { webhookHeaders[k] = v; });

  // Verify signature
  const valid = await verifyWebhook(rawBody, webhookHeaders);
  if (!valid) {
    console.error("[DODO_WEBHOOK] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    type?: string;
    data?: Record<string, unknown>;
    payload?: Record<string, unknown>;
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type || "";
  const data = event.data || event.payload || {};
  const metadata = (data.metadata || {}) as Record<string, string>;

  console.log(`[DODO_WEBHOOK] ${eventType}`, JSON.stringify(data).slice(0, 500));

  const supabase = await createServiceClient();

  switch (eventType) {
    // ── One-time payment succeeded (credit top-up) ─────────
    case "payment.succeeded":
    case "payment.updated": {
      if (metadata.type !== "topup") break;
      const userId = metadata.userId;
      const credits = parseInt(metadata.credits || "0", 10);
      if (!userId || !credits) break;

      // Add credits to topup_credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("topup_credits")
        .eq("id", userId)
        .single();
      if (profile) {
        await supabase
          .from("profiles")
          .update({ topup_credits: Number(profile.topup_credits) + credits })
          .eq("id", userId);
        console.log(`[DODO_WEBHOOK] Granted ${credits} top-up credits to ${userId}`);
      }

      // Record transaction
      await supabase.from("transactions").insert({
        user_id: userId,
        type: "topup",
        amount: Number(data.total || data.amount || 0),
        credits,
        description: `Top-up: ${credits} credits via Dodo Payments`,
      });
      break;
    }

    // ── Subscription created / activated ────────────────────
    case "subscription.created":
    case "subscription.active": {
      const userId = metadata.userId;
      if (!userId) break;

      const productId = data.product_id as string;
      const plan = productIdToPlan(productId);
      if (!plan) {
        console.warn(`[DODO_WEBHOOK] Unknown product_id: ${productId}`);
        break;
      }

      const planConfig = PLAN_LIMITS[plan];
      const subscriptionId = (data.subscription_id || data.id) as string;

      await supabase
        .from("profiles")
        .update({
          plan,
          credits_remaining: planConfig.credits,
          stripe_customer_id: subscriptionId, // reuse field for Dodo subscription ID
        })
        .eq("id", userId);

      await supabase.from("transactions").insert({
        user_id: userId,
        type: "subscription",
        amount: Number(data.total || data.amount || 0),
        credits: planConfig.credits,
        description: `Subscribed to ${planConfig.name} plan`,
      });

      console.log(`[DODO_WEBHOOK] User ${userId} subscribed to ${plan}`);
      break;
    }

    // ── Subscription updated (plan change, renewal) ─────────
    case "subscription.updated": {
      const status = data.status as string;
      const subscriptionId = (data.subscription_id || data.id) as string;

      if (!subscriptionId) break;

      // Find user by subscription ID (stored in stripe_customer_id field)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, plan")
        .eq("stripe_customer_id", subscriptionId)
        .single();
      if (!profile) break;

      if (status === "cancelled" || status === "expired") {
        // Downgrade to free
        await supabase
          .from("profiles")
          .update({ plan: "free", credits_remaining: 1 })
          .eq("id", profile.id);
        console.log(`[DODO_WEBHOOK] User ${profile.id} cancelled → free`);
      } else if (status === "active") {
        // Plan renewal or upgrade
        const productId = data.product_id as string;
        const newPlan = productIdToPlan(productId);
        if (newPlan && newPlan !== profile.plan) {
          const planConfig = PLAN_LIMITS[newPlan];
          await supabase
            .from("profiles")
            .update({ plan: newPlan, credits_remaining: planConfig.credits })
            .eq("id", profile.id);
          console.log(`[DODO_WEBHOOK] User ${profile.id} changed plan: ${profile.plan} → ${newPlan}`);
        } else if (newPlan) {
          // Same plan renewal — reset credits
          const planConfig = PLAN_LIMITS[newPlan];
          await supabase
            .from("profiles")
            .update({ credits_remaining: planConfig.credits })
            .eq("id", profile.id);
          console.log(`[DODO_WEBHOOK] User ${profile.id} renewed ${newPlan}`);
        }
      }
      break;
    }

    default:
      console.log(`[DODO_WEBHOOK] Unhandled event: ${eventType}`);
  }

  return NextResponse.json({ ok: true });
}

/**
 * Map Dodo product ID to plan name.
 */
function productIdToPlan(productId: string): PlanType | null {
  const map: Record<string, PlanType> = {};
  if (process.env.DODO_PRODUCT_STARTER) map[process.env.DODO_PRODUCT_STARTER] = "starter";
  if (process.env.DODO_PRODUCT_PRO) map[process.env.DODO_PRODUCT_PRO] = "pro";
  if (process.env.DODO_PRODUCT_ENTERPRISE) map[process.env.DODO_PRODUCT_ENTERPRISE] = "enterprise";
  return map[productId] || null;
}
