import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyWebhook } from "@/lib/dodo-payments";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

/**
 * Try to find the most recent checkout_initiated transaction for a user
 * and update it. If none found, insert a new row.
 */
async function upsertTransaction(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  userId: string,
  update: { type: string; amount: number; credits: number; description: string; is_test: boolean }
) {
  // Find the latest checkout_initiated for this user (within last 2 hours)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const { data: pending } = await supabase
    .from("transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "checkout_initiated")
    .gte("created_at", twoHoursAgo)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (pending) {
    // Update existing checkout record
    await supabase
      .from("transactions")
      .update({
        type: update.type,
        amount: update.amount,
        credits: update.credits,
        description: update.description,
      })
      .eq("id", pending.id);
    console.log(`[DODO_WEBHOOK] Updated checkout ${pending.id} → ${update.type}`);
  } else {
    // No pending checkout — insert new
    await supabase.from("transactions").insert({
      user_id: userId,
      ...update,
    });
    console.log(`[DODO_WEBHOOK] Inserted new ${update.type} for ${userId}`);
  }
}

/**
 * POST /api/webhooks/dodo — Dodo Payments webhook receiver.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const webhookHeaders: Record<string, string> = {};
  req.headers.forEach((v, k) => { webhookHeaders[k] = v; });

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
  const isTest = process.env.DODO_PAYMENTS_ENV !== "production";

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

      const topupAmount = Number(data.total_amount || data.recurring_pre_tax_amount || data.total || data.amount || 0);
      await upsertTransaction(supabase, userId, {
        type: "topup",
        amount: topupAmount,
        credits,
        description: `Top-up: ${credits} credits via Dodo Payments${isTest ? " [TEST]" : ""}`,
        is_test: isTest,
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
          stripe_customer_id: subscriptionId,
        })
        .eq("id", userId);

      const subAmount = Number(data.recurring_pre_tax_amount || data.total_amount || data.total || data.amount || 0);
      await upsertTransaction(supabase, userId, {
        type: "subscription",
        amount: subAmount,
        credits: planConfig.credits,
        description: `Subscribed to ${planConfig.name} plan${isTest ? " [TEST]" : ""}`,
        is_test: isTest,
      });

      console.log(`[DODO_WEBHOOK] User ${userId} subscribed to ${plan}`);
      break;
    }

    // ── Subscription updated (plan change, renewal) ─────────
    case "subscription.updated": {
      const status = data.status as string;
      const subscriptionId = (data.subscription_id || data.id) as string;

      if (!subscriptionId) break;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, plan")
        .eq("stripe_customer_id", subscriptionId)
        .single();
      if (!profile) break;

      if (status === "cancelled" || status === "expired") {
        await supabase
          .from("profiles")
          .update({ plan: "free", credits_remaining: 1 })
          .eq("id", profile.id);
        console.log(`[DODO_WEBHOOK] User ${profile.id} cancelled → free`);
      } else if (status === "active") {
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

    // ── Payment failed ──────────────────────────────────────
    case "payment.failed":
    case "payment.cancelled":
    case "subscription.failed": {
      const userId = metadata.userId;
      if (!userId) break;

      const failedAmount = Number(data.total_amount || data.recurring_pre_tax_amount || data.total || data.amount || 0);
      const errorMessage = (data.error_message || data.failure_reason || data.status_reason || data.decline_reason || "") as string;
      const paymentType = metadata.type === "topup" ? "top-up" : "subscription";

      await upsertTransaction(supabase, userId, {
        type: "payment_failed",
        amount: failedAmount,
        credits: 0,
        description: `Failed ${paymentType}: ${errorMessage || eventType}`.slice(0, 500),
        is_test: isTest,
      });

      console.log(`[DODO_WEBHOOK] Payment failed for ${userId}: ${errorMessage || eventType}`);
      break;
    }

    default:
      console.log(`[DODO_WEBHOOK] Unhandled event: ${eventType}`);
  }

  return NextResponse.json({ ok: true });
}

function productIdToPlan(productId: string): PlanType | null {
  const map: Record<string, PlanType> = {};
  if (process.env.DODO_PRODUCT_STARTER) map[process.env.DODO_PRODUCT_STARTER] = "starter";
  if (process.env.DODO_PRODUCT_PRO) map[process.env.DODO_PRODUCT_PRO] = "pro";
  if (process.env.DODO_PRODUCT_ENTERPRISE) map[process.env.DODO_PRODUCT_ENTERPRISE] = "enterprise";
  return map[productId] || null;
}
