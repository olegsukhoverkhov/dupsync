import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { quoteTopup, MIN_TOPUP_CREDITS, MAX_TOPUP_CREDITS } from "@/lib/credits-topup";

export const dynamic = "force-dynamic";

/**
 * POST /api/credits/topup
 *
 * Creates a checkout session for a one-time credit top-up.
 * Provider: Dodo Payments (primary).
 *
 * Request body:  { credits: number }  // 5..1000
 * Response:      { url: string }      // redirect to checkout
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { credits?: unknown };
  try {
    body = (await request.json()) as { credits?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const creditsRaw = Number(body.credits);
  if (!Number.isFinite(creditsRaw)) {
    return NextResponse.json({ error: "credits must be a number" }, { status: 400 });
  }
  const credits = Math.floor(creditsRaw);
  if (credits < MIN_TOPUP_CREDITS || credits > MAX_TOPUP_CREDITS) {
    return NextResponse.json(
      { error: `credits must be between ${MIN_TOPUP_CREDITS} and ${MAX_TOPUP_CREDITS}` },
      { status: 400 }
    );
  }

  const quote = quoteTopup(credits);
  if (!quote) return NextResponse.json({ error: "Invalid credits amount" }, { status: 400 });

  // ── Dodo Payments ────────────────────────────────────────
  const { isConfigured, createTopupCheckout } = await import("@/lib/dodo-payments");

  if (isConfigured()) {
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://dubsync.app";

    const url = await createTopupCheckout({
      credits,
      totalCents: quote.totalCents,
      customerEmail: user.email!,
      userId: user.id,
      returnUrl: `${origin}/credits?topup=success`,
    });

    // Track checkout initiated (non-blocking)
    const { createServiceClient } = await import("@/lib/supabase/server");
    const service = await createServiceClient();
    service.from("transactions").insert({
      user_id: user.id,
      type: "checkout_initiated",
      amount: quote.totalCents,
      credits,
      description: `Checkout started: ${credits} credits top-up ($${(quote.totalCents / 100).toFixed(2)})`,
      is_test: process.env.DODO_PAYMENTS_ENV !== "production",
    }).then(() => {});

    return NextResponse.json({ url });
  }

  // ── Not configured ───────────────────────────────────────
  return NextResponse.json(
    {
      error: "Credit top-ups are coming soon — we're finalising the payment provider.",
      code: "provider_not_configured",
      quote: { credits: quote.credits, totalCents: quote.totalCents, priceLabel: quote.priceLabel },
    },
    { status: 501 }
  );
}
