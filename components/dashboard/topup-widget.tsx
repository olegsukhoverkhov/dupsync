"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  MIN_TOPUP_CREDITS,
  MAX_TOPUP_CREDITS,
  TOPUP_PRESETS,
  quoteTopup,
} from "@/lib/credits-topup";
import { useDashboardT } from "./locale-provider";

/**
 * Topup purchase widget — slider + presets + price preview + buy button.
 *
 * Previously this UI lived inline inside `/credits/page.tsx`. It's now
 * extracted so the same widget can be reused from the "Insufficient
 * credits" alert on the dubbing flow (`/projects/new` and `/projects/[id]`)
 * and anywhere else we want to offer in-place credit purchase.
 *
 * The widget is self-contained: it owns its own state, calls
 * `/api/credits/topup` directly, and either redirects to the
 * checkout URL on success or surfaces the stub 501 message on failure.
 *
 * Rendering context:
 *  - `variant="inline"` → wraps in a gradient card, suitable for a page
 *    section
 *  - `variant="bare"` → no card chrome, suitable for an alert modal body
 */
export function TopupWidget({
  variant = "inline",
  defaultCredits = 50,
  onCheckoutOpened,
}: {
  variant?: "inline" | "bare";
  defaultCredits?: number;
  /** Called right before `window.location.href` is changed. Lets the
   *  caller close a wrapping modal so the user sees checkout, not a
   *  half-closed UI. */
  onCheckoutOpened?: () => void;
}) {
  const t = useDashboardT();
  const [topupCredits, setTopupCredits] = useState<number>(
    Math.min(Math.max(defaultCredits, MIN_TOPUP_CREDITS), MAX_TOPUP_CREDITS)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quote = useMemo(() => quoteTopup(topupCredits), [topupCredits]);

  async function handleBuy() {
    if (!quote) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/credits/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: quote.credits }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ||
            t("dashboard.credits.topupError", "Could not start checkout.")
        );
        return;
      }
      if (data.url) {
        onCheckoutOpened?.();
        window.location.href = data.url;
        return;
      }
      setError(t("dashboard.credits.noCheckoutUrl", "No checkout URL returned."));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("dashboard.credits.unknownError", "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  }

  const body = (
    <>
      {/* Header (shown only in inline variant) */}
      {variant === "inline" && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Plus className="h-4 w-4 text-pink-400" />
            {t("dashboard.credits.buyMoreCredits", "Buy more credits")}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t(
              "dashboard.credits.buyMoreSubtitle",
              "One-time purchase. Top-up credits never expire and are used only after your plan credits run out."
            )}
          </p>
        </div>
      )}

      {/* Slider + current value */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm text-slate-400">
          {t("dashboard.credits.amount", "Amount")}
        </span>
        <span className="text-2xl font-bold text-white">
          {topupCredits}{" "}
          <span className="text-sm font-normal text-slate-400">
            {t("dashboard.credits.creditsLabel", "credits")}
          </span>
        </span>
      </div>
      <input
        type="range"
        min={MIN_TOPUP_CREDITS}
        max={MAX_TOPUP_CREDITS}
        step={1}
        value={topupCredits}
        onChange={(e) => setTopupCredits(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
        aria-label={t(
          "dashboard.credits.creditsAriaLabel",
          "Number of credits to buy"
        )}
      />
      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
        <span>{MIN_TOPUP_CREDITS}</span>
        <span>{MAX_TOPUP_CREDITS}</span>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2 mt-4">
        {TOPUP_PRESETS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setTopupCredits(n)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              topupCredits === n
                ? "bg-white text-slate-900"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Price + CTA */}
      {quote && (
        <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/50 p-4">
          <div>
            <p className="text-xs text-slate-500">
              {quote.credits} {t("dashboard.credits.creditsLabel", "credits")}{" "}
              × $1 {t("dashboard.credits.perCredit", "per credit")}
            </p>
            <p className="text-2xl font-bold text-white mt-1">{quote.priceLabel}</p>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={loading || !quote}
            onClick={handleBuy}
            className="mt-4 w-full gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("dashboard.credits.openingCheckout", "Opening checkout…")}
              </>
            ) : (
              <>
                {t("dashboard.credits.buyButton", "Buy {n} credits — {price}", {
                  n: String(quote.credits),
                  price: quote.priceLabel,
                })}
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            {t(
              "dashboard.credits.checkoutNote",
              "Secure checkout · One-time payment · Credits never expire"
            )}
          </p>
        </div>
      )}
    </>
  );

  if (variant === "bare") return <div>{body}</div>;

  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-pink-500/10 via-violet-500/5 to-blue-600/10 p-5">
      {body}
    </div>
  );
}
