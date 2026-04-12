"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDashboardT } from "./locale-provider";
import { CreditCard, Calendar, AlertTriangle, Loader2, X } from "lucide-react";

type SubscriptionData = {
  status: string;
  plan: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

interface Props {
  open: boolean;
  onClose: () => void;
  plan: string;
  planPrice: number; // cents
}

export function SubscriptionModal({ open, onClose, plan, planPrice }: Props) {
  const t = useDashboardT();
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelInput, setCancelInput] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");

  const fetchSub = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/subscription");
      const data = await res.json();
      setSub(data.subscription);
      if (data.subscription?.cancelAtPeriodEnd || data.subscription?.status === "cancelled") {
        setCancelled(true);
      }
    } catch {
      setError(t("dashboard.subscriptionModal.loadError", "Failed to load subscription details"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (open) {
      fetchSub();
      setCancelInput("");
      setShowCancelConfirm(false);
      setCancelled(false);
      setError("");
    }
  }, [open, fetchSub]);

  async function handleCancel() {
    if (cancelInput.toLowerCase() !== "cancel") return;
    setCancelling(true);
    setError("");
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to cancel");
        return;
      }
      setCancelled(true);
      setShowCancelConfirm(false);
    } catch {
      setError(t("dashboard.subscriptionModal.cancelError", "Failed to cancel subscription"));
    } finally {
      setCancelling(false);
    }
  }

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
  const priceLabel = planPrice > 0 ? `$${(planPrice / 100).toFixed(2)}` : t("dashboard.settingsPage.free", "Free");

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKey); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-bold text-white mb-5">
          {t("dashboard.subscriptionModal.title", "Manage Subscription")}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plan info */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-violet-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("dashboard.subscriptionModal.plan", "Plan")}: {planName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {priceLabel}/{t("dashboard.subscriptionModal.month", "mo")}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                cancelled
                  ? "border border-red-500/30 bg-red-500/10 text-red-400"
                  : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}>
                {cancelled
                  ? t("dashboard.subscriptionModal.cancelled", "Cancelled")
                  : t("dashboard.subscriptionModal.active", "Active")}
              </span>
            </div>

            {/* Next renewal */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <Calendar className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">
                  {cancelled
                    ? t("dashboard.subscriptionModal.expiresOn", "Expires on")
                    : t("dashboard.subscriptionModal.nextRenewal", "Next renewal")}
                </p>
                <p className="text-sm font-medium text-white">
                  {formatDate(sub?.currentPeriodEnd ?? null)}
                </p>
              </div>
            </div>

            {/* Auto-renew toggle or cancelled state */}
            {cancelled ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-sm text-amber-300">
                  {t("dashboard.subscriptionModal.cancelledMessage",
                    "Your subscription has been cancelled. You'll retain access until the end of your billing period.")}
                </p>
              </div>
            ) : !showCancelConfirm ? (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    {t("dashboard.subscriptionModal.autoRenew", "Auto-renew")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t("dashboard.subscriptionModal.autoRenewDescription",
                      "Automatically renew your subscription each month")}
                  </p>
                </div>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="relative h-6 w-11 rounded-full bg-emerald-500 transition-colors cursor-pointer"
                  aria-label={t("dashboard.subscriptionModal.toggleAutoRenew", "Toggle auto-renew")}
                >
                  <span className="absolute top-0.5 left-[22px] h-5 w-5 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            ) : (
              /* Cancel confirmation */
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-300">
                      {t("dashboard.subscriptionModal.cancelConfirmTitle", "Cancel subscription?")}
                    </p>
                    <p className="text-xs text-red-300/70 mt-1">
                      {t("dashboard.subscriptionModal.cancelConfirmMessage",
                        "You'll lose access to premium features at the end of your billing period. Type \"cancel\" to confirm.")}
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  value={cancelInput}
                  onChange={(e) => setCancelInput(e.target.value)}
                  placeholder={t("dashboard.subscriptionModal.typeCancel", "Type \"cancel\" to confirm")}
                  className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-white placeholder:text-red-300/40 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowCancelConfirm(false); setCancelInput(""); }}
                    className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {t("dashboard.subscriptionModal.keepSubscription", "Keep subscription")}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelInput.toLowerCase() !== "cancel" || cancelling}
                    className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-red-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {cancelling ? (
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      t("dashboard.subscriptionModal.confirmCancel", "Cancel subscription")
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
          </div>
        )}

        {/* Close button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {t("dashboard.subscriptionModal.close", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
}
