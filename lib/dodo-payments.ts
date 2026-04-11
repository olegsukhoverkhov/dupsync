/**
 * Dodo Payments — payment provider for DubSync.
 *
 * Merchant of Record: Dodo handles VAT, taxes, compliance.
 * Pricing: 4% + $0.40 per transaction.
 * Primary payment provider for DubSync.
 *
 * Supports:
 *   - Subscription plans (Starter, Pro, Enterprise)
 *   - One-time credit top-ups
 *   - Customer portal for billing management
 *   - Webhook-based payment confirmation
 *
 * Docs: https://docs.dodopayments.com
 */

const DODO_API = process.env.DODO_PAYMENTS_ENV === "production"
  ? "https://api.dodopayments.com"
  : "https://test.dodopayments.com";

function getApiKey(): string {
  const key = process.env.DODO_PAYMENTS_API_KEY;
  if (!key) throw new Error("DODO_PAYMENTS_API_KEY is not set");
  return key;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
}

// ─── Product IDs (set in env after creating products in Dodo dashboard) ──

/** Map plan names to Dodo product IDs */
export function getPlanProductId(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    starter: process.env.DODO_PRODUCT_STARTER,
    pro: process.env.DODO_PRODUCT_PRO,
    enterprise: process.env.DODO_PRODUCT_ENTERPRISE,
  };
  return map[plan] || null;
}

// ─── Checkout ─────────────────────────────────────────────────

/**
 * Create a checkout session for a subscription plan.
 * Returns the checkout URL to redirect the user to.
 */
export async function createSubscriptionCheckout(opts: {
  productId: string;
  customerEmail: string;
  customerName?: string;
  userId: string;
  returnUrl: string;
}): Promise<string> {
  const res = await fetch(`${DODO_API}/subscriptions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      billing: { city: "", country: "US", state: "", street: "", zipcode: "" },
      customer: { email: opts.customerEmail, name: opts.customerName || opts.customerEmail.split("@")[0] },
      product_id: opts.productId,
      quantity: 1,
      payment_link: true,
      return_url: opts.returnUrl,
      metadata: {
        userId: opts.userId,
      },
    }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    throw new Error(`Dodo checkout failed: ${res.status} ${rawText.slice(0, 300)}`);
  }
  if (!rawText) {
    throw new Error("Dodo checkout: empty response");
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Dodo checkout: invalid JSON: ${rawText.slice(0, 200)}`);
  }

  const url = (data.payment_link as string) || (data.url as string);
  if (!url) {
    throw new Error(`Dodo checkout: no URL in response: ${rawText.slice(0, 200)}`);
  }

  return url;
}

/**
 * Create a checkout session for a one-time credit top-up.
 */
export async function createTopupCheckout(opts: {
  credits: number;
  totalCents: number;
  customerEmail: string;
  userId: string;
  returnUrl: string;
}): Promise<string> {
  // For one-time payments, create a payment with product details inline
  const res = await fetch(`${DODO_API}/payments`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      billing: { city: "", country: "US", state: "", street: "", zipcode: "" },
      customer: { email: opts.customerEmail, name: opts.customerEmail.split("@")[0] },
      product_cart: [
        {
          product_id: process.env.DODO_PRODUCT_TOPUP || "topup",
          quantity: opts.credits,
        },
      ],
      payment_link: true,
      return_url: opts.returnUrl,
      metadata: {
        type: "topup",
        userId: opts.userId,
        credits: String(opts.credits),
      },
    }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    throw new Error(`Dodo topup checkout failed: ${res.status} ${rawText.slice(0, 300)}`);
  }
  if (!rawText) {
    throw new Error("Dodo topup: empty response");
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Dodo topup: invalid JSON: ${rawText.slice(0, 200)}`);
  }

  const url = (data.payment_link as string) || (data.url as string);
  if (!url) {
    throw new Error(`Dodo topup: no URL in response: ${rawText.slice(0, 200)}`);
  }

  return url;
}

// ─── Webhook verification ─────────────────────────────────────

/**
 * Verify a Dodo Payments webhook signature.
 * Uses Standard Webhooks spec (webhook-id, webhook-signature, webhook-timestamp).
 */
export async function verifyWebhook(
  body: string,
  headers: Record<string, string>
): Promise<boolean> {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[DODO_WEBHOOK] No webhook secret configured, skipping verification");
    return true; // Allow in dev
  }

  const webhookId = headers["webhook-id"];
  const webhookTimestamp = headers["webhook-timestamp"];
  const webhookSignature = headers["webhook-signature"];

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return false;
  }

  // Standard Webhooks: sign(webhookId + "." + webhookTimestamp + "." + body)
  const crypto = await import("crypto");
  const secretBytes = Buffer.from(secret.replace("whsec_", ""), "base64");
  const toSign = `${webhookId}.${webhookTimestamp}.${body}`;
  const expectedSig = crypto
    .createHmac("sha256", secretBytes)
    .update(toSign)
    .digest("base64");

  // webhook-signature can contain multiple sigs: "v1,sig1 v1,sig2"
  const signatures = webhookSignature.split(" ");
  return signatures.some((s) => {
    const [, sig] = s.split(",");
    return sig === expectedSig;
  });
}

// ─── Subscription management ──────────────────────────────────

/**
 * Cancel a subscription.
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const res = await fetch(`${DODO_API}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ status: "cancelled" }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Dodo cancel failed: ${res.status} ${err.slice(0, 300)}`);
  }
}

/**
 * Get subscription details.
 */
export async function getSubscription(subscriptionId: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${DODO_API}/subscriptions/${subscriptionId}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Dodo get subscription failed: ${res.status}`);
  return res.json();
}

// ─── Status check ─────────────────────────────────────────────

export function isConfigured(): boolean {
  return !!process.env.DODO_PAYMENTS_API_KEY;
}
