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
  update: { type: string; amount: number; credits: number; description: string; is_test: boolean; payment_method?: string; raw_webhook?: unknown }
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

  const row = {
    type: update.type,
    amount: update.amount,
    credits: update.credits,
    description: update.description,
    ...(update.payment_method ? { payment_method: update.payment_method } : {}),
    ...(update.raw_webhook ? { raw_webhook: update.raw_webhook } : {}),
  };

  if (pending) {
    await supabase.from("transactions").update(row).eq("id", pending.id);
    console.log(`[DODO_WEBHOOK] Updated checkout ${pending.id} → ${update.type}`);
  } else {
    await supabase.from("transactions").insert({ user_id: userId, ...row, is_test: update.is_test });
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

  const dataStr = JSON.stringify(data);
  console.log(`[DODO_WEBHOOK] ${eventType}`, dataStr.slice(0, 1500));

  // Extract payment method — walk the entire payload to find it
  const methodLabel = extractPaymentMethod(data);

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
        payment_method: methodLabel || undefined,
        raw_webhook: data,
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

      const expiresAt = (data.current_period_end || data.next_billing_date || data.ends_at || null) as string | null;
      await supabase
        .from("profiles")
        .update({
          plan,
          credits_remaining: planConfig.credits,
          stripe_customer_id: subscriptionId,
          subscription_expired: false,
          ...(expiresAt ? { subscription_expires_at: expiresAt } : {}),
        })
        .eq("id", userId);

      const subAmount = Number(data.recurring_pre_tax_amount || data.total_amount || data.total || data.amount || 0);
      const periodCount = Number(data.subscription_period_count || 1);
      const isRenewal = periodCount > 1;
      await upsertTransaction(supabase, userId, {
        type: "subscription",
        amount: subAmount,
        credits: planConfig.credits,
        description: `${isRenewal ? "Renewed" : "Subscribed to"} ${planConfig.name} plan${isRenewal ? ` (period ${periodCount})` : ""}${isTest ? " [TEST]" : ""}`,
        is_test: isTest,
        payment_method: methodLabel || undefined,
        raw_webhook: data,
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

      if (status === "expired") {
        // Subscription period ended — zero credits and flag as expired.
        // Keep plan name so UI can show renewal prompt.
        await supabase
          .from("profiles")
          .update({ credits_remaining: 0, subscription_expired: true })
          .eq("id", profile.id);
        console.log(`[DODO_WEBHOOK] User ${profile.id} subscription expired`);
      } else if (status === "cancelled") {
        // User cancelled but period not over yet — keep current plan,
        // just log it. Downgrade happens when status becomes "expired".
        console.log(`[DODO_WEBHOOK] User ${profile.id} cancelled — keeping plan until period ends`);
      } else if (status === "active") {
        const renewExpiresAt = (data.current_period_end || data.next_billing_date || data.ends_at || null) as string | null;
        const productId = data.product_id as string;
        const newPlan = productIdToPlan(productId);
        if (newPlan && newPlan !== profile.plan) {
          const planConfig = PLAN_LIMITS[newPlan];
          await supabase
            .from("profiles")
            .update({ plan: newPlan, credits_remaining: planConfig.credits, subscription_expired: false, ...(renewExpiresAt ? { subscription_expires_at: renewExpiresAt } : {}) })
            .eq("id", profile.id);
          const changeAmount = Number(data.recurring_pre_tax_amount || 0);
          await upsertTransaction(supabase, profile.id, {
            type: "subscription",
            amount: changeAmount,
            credits: planConfig.credits,
            description: `Upgraded to ${planConfig.name} plan${isTest ? " [TEST]" : ""}`,
            is_test: isTest,
            payment_method: methodLabel || undefined,
            raw_webhook: data,
          });
          console.log(`[DODO_WEBHOOK] User ${profile.id} changed plan: ${profile.plan} → ${newPlan}`);
        } else if (newPlan) {
          const planConfig = PLAN_LIMITS[newPlan];
          await supabase
            .from("profiles")
            .update({ credits_remaining: planConfig.credits, subscription_expired: false, ...(renewExpiresAt ? { subscription_expires_at: renewExpiresAt } : {}) })
            .eq("id", profile.id);
          const renewAmount = Number(data.recurring_pre_tax_amount || 0);
          const periodCount = Number(data.subscription_period_count || 1);
          await upsertTransaction(supabase, profile.id, {
            type: "subscription",
            amount: renewAmount,
            credits: planConfig.credits,
            description: `Renewed ${planConfig.name} plan (period ${periodCount})${isTest ? " [TEST]" : ""}`,
            is_test: isTest,
            payment_method: methodLabel || undefined,
            raw_webhook: data,
          });
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
      // Collect all possible error fields from Dodo for full context
      const errorParts = [
        data.error_message,
        data.failure_reason,
        data.status_reason,
        data.decline_reason,
        data.decline_code,
        data.error_code,
        data.status,
      ].filter(Boolean).map(String);
      const fullError = errorParts.length > 0 ? errorParts.join(" | ") : JSON.stringify(data).slice(0, 400);

      await upsertTransaction(supabase, userId, {
        type: "payment_failed",
        amount: failedAmount,
        credits: 0,
        description: fullError.slice(0, 500),
        is_test: isTest,
        payment_method: methodLabel || undefined,
        raw_webhook: data,
      });

      console.log(`[DODO_WEBHOOK] Payment failed for ${userId}: ${fullError || eventType}`);
      break;
    }

    default:
      console.log(`[DODO_WEBHOOK] Unhandled event: ${eventType}`);
  }

  return NextResponse.json({ ok: true });
}

/**
 * Walk the Dodo webhook payload and extract a human-readable payment method.
 * Dodo can send the method in many places depending on event type.
 * Covers: card (Visa/MC), Google Pay, Apple Pay, PayPal, bank transfer, etc.
 */
function extractPaymentMethod(data: Record<string, unknown>): string | null {
  // Recursively search for payment method indicators
  const flat = flattenObject(data);

  // 1. Look for explicit payment method fields
  const methodType = flat["payment_method_type"] || flat["payment_method.type"] ||
    flat["payment_details.type"] || flat["payment_details.payment_method_type"] ||
    flat["payment_channel"] || flat["payment_type"] || flat["method"] || "";

  // 2. Look for card brand
  const brand = flat["card.brand"] || flat["card_brand"] || flat["payment_method.card.brand"] ||
    flat["payment_details.card.brand"] || flat["payment_details.brand"] || "";

  // 3. Look for last 4 digits
  const last4 = flat["card.last4"] || flat["card_last4"] || flat["payment_method.card.last4"] ||
    flat["payment_details.card.last4"] || flat["payment_details.last4"] || flat["last_four"] || "";

  // 4. Look for wallet type (Google Pay, Apple Pay)
  const wallet = flat["wallet.type"] || flat["payment_method.wallet.type"] ||
    flat["payment_details.wallet"] || flat["wallet_type"] || "";

  // Build label
  const parts: string[] = [];

  if (wallet) {
    parts.push(String(wallet));
  } else if (methodType) {
    parts.push(String(methodType));
  }

  if (brand) parts.push(String(brand));
  if (last4) parts.push(`****${last4}`);

  if (parts.length > 0) return parts.join(" ");

  // Fallback: search all string values for known payment method keywords
  const allValues = Object.values(flat).map(String).join(" ").toLowerCase();
  const knownMethods = ["google_pay", "google pay", "apple_pay", "apple pay", "paypal",
    "visa", "mastercard", "amex", "discover", "bank_transfer", "bank transfer",
    "ideal", "sofort", "sepa", "klarna", "afterpay", "alipay", "wechat"];
  for (const m of knownMethods) {
    if (allValues.includes(m)) return m.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  // Last resort: show payment_method_id if present
  const pmId = flat["payment_method_id"];
  if (pmId) return `pm:${String(pmId).slice(-8)}`;

  return null;
}

/** Flatten nested object to dot-notation keys */
function flattenObject(obj: unknown, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!obj || typeof obj !== "object") return result;
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

function productIdToPlan(productId: string): PlanType | null {
  const map: Record<string, PlanType> = {};
  if (process.env.DODO_PRODUCT_STARTER) map[process.env.DODO_PRODUCT_STARTER] = "starter";
  if (process.env.DODO_PRODUCT_PRO) map[process.env.DODO_PRODUCT_PRO] = "pro";
  if (process.env.DODO_PRODUCT_ENTERPRISE) map[process.env.DODO_PRODUCT_ENTERPRISE] = "enterprise";
  return map[productId] || null;
}
