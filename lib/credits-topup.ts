/**
 * Credit top-up pricing and validation — shared between the client (pricing
 * preview on the slider) and the server (billing enforcement).
 *
 * Pricing model
 * -------------
 * Flat $1.00 per credit at every quantity. This matches the Starter plan
 * unit economics (20 credits / $19.99) so a top-up never dilutes margins.
 * No volume discounts — buying 500 credits costs exactly $500, not less.
 *
 * The checkout shows whole-dollar prices only (no cents), both for visual
 * simplicity and because the pricing is integer-dollar by construction.
 *
 * Slider bounds
 * -------------
 * `MIN_TOPUP_CREDITS`=5 (too-small purchases aren't worth the transaction
 *  fee) and `MAX_TOPUP_CREDITS`=1000 (stops obvious abuse; huge orders should
 *  contact sales for custom pricing). These are enforced on both sides.
 */

export const MIN_TOPUP_CREDITS = 5;
export const MAX_TOPUP_CREDITS = 1000;

/** Flat rate: 100 cents ($1.00) per credit, no volume discount. */
export const CENTS_PER_CREDIT = 100;

export type TopupQuote = {
  credits: number;
  centsPerCredit: number;
  /** Total charge in cents. */
  totalCents: number;
  /** Human-readable USD price, e.g. "$69". Whole dollars only. */
  priceLabel: string;
};

/**
 * Calculate the price for a top-up of `credits`. Returns `null` if the
 * credits count is outside the allowed range.
 */
export function quoteTopup(credits: number): TopupQuote | null {
  if (!Number.isFinite(credits)) return null;
  const c = Math.floor(credits);
  if (c < MIN_TOPUP_CREDITS || c > MAX_TOPUP_CREDITS) return null;

  const totalCents = c * CENTS_PER_CREDIT;
  const dollars = Math.round(totalCents / 100);

  return {
    credits: c,
    centsPerCredit: CENTS_PER_CREDIT,
    totalCents,
    priceLabel: `$${dollars}`,
  };
}

/** Quick preset buttons rendered next to the slider. */
export const TOPUP_PRESETS = [10, 25, 50, 100, 500] as const;
