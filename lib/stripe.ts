import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-03-31.basil",
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop];
  },
});

export const STRIPE_PLANS: Record<
  string,
  { priceId: string; plan: string; credits: number }
> = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    plan: "starter",
    credits: 60,
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    plan: "pro",
    credits: 300,
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    plan: "enterprise",
    credits: -1,
  },
};

export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  returnUrl,
}: {
  customerId: string;
  priceId: string;
  userId: string;
  returnUrl: string;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: { userId },
  });
}

export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function getOrCreateCustomer({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) {
    return existing.data[0];
  }
  return stripe.customers.create({
    email,
    metadata: { userId },
  });
}
