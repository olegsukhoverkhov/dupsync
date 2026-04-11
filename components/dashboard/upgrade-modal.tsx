"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, X, ArrowRight, Sparkles } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";
import { useDashboardT } from "./locale-provider";

/**
 * Upgrade modal shown from the dashboard's "Upgrade" button.
 *
 * Renders every plan tier STRICTLY above the user's current plan (so a
 * free user sees Starter/Pro/Business, a Starter user sees Pro/Business,
 * a Pro user sees only Business). Enterprise users never see the button.
 *
 * Clicking a plan's CTA posts to /api/billing and either redirects to
 * the returned checkout URL or surfaces the stub 501 message inline.
 */

const UPGRADE_ORDER: readonly PlanType[] = ["free", "starter", "pro", "enterprise"] as const;

function dollars(cents: number) {
  // Plan prices are stored in cents. We display whole dollars for the
  // monthly row and let users compare cleanly; decimals only appear if a
  // plan actually has them (e.g. $19.99 → "$19.99", $0 → "$0").
  const whole = cents / 100;
  return Number.isInteger(whole) ? `$${whole}` : `$${whole.toFixed(2)}`;
}

/** Pick which plan details to highlight as the primary feature bullets. */
function bulletsFor(plan: PlanType): string[] {
  const p = PLAN_LIMITS[plan];
  return p.features.slice(0, 5);
}

export function UpgradeModal({
  open,
  onClose,
  currentPlan,
}: {
  open: boolean;
  onClose: () => void;
  currentPlan: PlanType;
}) {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useDashboardT();

  // Tiers strictly above the user's current plan
  const availablePlans = useMemo(() => {
    const currentIdx = UPGRADE_ORDER.indexOf(currentPlan);
    if (currentIdx === -1) return [];
    return UPGRADE_ORDER.slice(currentIdx + 1);
  }, [currentPlan]);

  // Close on Escape; lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  async function handleUpgrade(plan: PlanType) {
    setLoadingPlan(plan);
    setError(null);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkout",
          plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Upgrade failed (${res.status}).`);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingPlan(null);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 py-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6 sm:mb-8 pr-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300 mb-3">
            <Sparkles className="h-3 w-3" />
            {t("dashboard.upgradeModal.badge", "Upgrade your plan")}
          </div>
          <h2
            id="upgrade-modal-title"
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            {t("dashboard.upgradeModal.title", "Pick a plan that fits your growth")}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {t("dashboard.upgradeModal.currentPlan", "You're currently on")}{" "}
            <span className="font-semibold text-white">
              {PLAN_LIMITS[currentPlan].name}
            </span>
            . {t("dashboard.upgradeModal.intro", "Choose a higher tier to unlock more credits, languages, and file sizes. Cancel any time.")}
          </p>
        </div>

        {/* Error banner — usually the "coming soon" stub message */}
        {error && (
          <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {error}
          </div>
        )}

        {/* Plan cards */}
        <div
          className={`grid gap-4 ${
            availablePlans.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : availablePlans.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {availablePlans.map((planKey, idx) => {
            const plan = PLAN_LIMITS[planKey];
            // Highlight the second-best tier (good conversion default)
            const highlighted = availablePlans.length > 1 && idx === Math.max(0, availablePlans.length - 2);
            const bullets = bulletsFor(planKey);
            return (
              <div
                key={planKey}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  highlighted
                    ? "border-pink-500/60 bg-gradient-to-b from-pink-500/10 via-violet-500/5 to-transparent"
                    : "border-white/10 bg-slate-800/50"
                }`}
              >
                {highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-button px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                    {t("dashboard.upgradeModal.mostPopular", "Most popular")}
                  </span>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      {dollars(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs text-slate-500">
                        {t("dashboard.upgradeModal.perMonth", "/mo")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {plan.credits === -1
                      ? t("dashboard.upgradeModal.unlimitedCredits", "Unlimited credits")
                      : `${plan.credits} ${t("dashboard.upgradeModal.creditsPerMonth", "credits / month")}`}
                  </p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {bullets.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleUpgrade(planKey)}
                  disabled={loadingPlan !== null}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlighted
                      ? "gradient-button"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {loadingPlan === planKey ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("dashboard.upgradeModal.openingCheckout", "Opening checkout…")}
                    </>
                  ) : (
                    <>
                      {t("dashboard.upgradeModal.upgradeTo", "Upgrade to {plan}", { plan: plan.name })}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          {t("dashboard.upgradeModal.checkoutFooter", "Secure checkout · Cancel any time · Lip sync included on every paid plan")}
        </p>
      </div>
    </div>
  );
}
