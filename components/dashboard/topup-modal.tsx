"use client";

import { useEffect } from "react";
import { X, Plus } from "lucide-react";
import { TopupWidget } from "./topup-widget";
import { useDashboardT } from "./locale-provider";

/**
 * Standalone topup modal — reuses `TopupWidget` but wraps it in a dialog
 * overlay so it can be opened from anywhere (alert modals, buttons on
 * error states, sidebar shortcuts, etc).
 *
 * Esc key and click-outside both close the modal. Body scroll is locked
 * while open so the page behind doesn't move.
 */
export function TopupModal({
  open,
  onClose,
  defaultCredits = 50,
}: {
  open: boolean;
  onClose: () => void;
  defaultCredits?: number;
}) {
  const t = useDashboardT();

  // Esc to close + lock background scroll while open
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

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="topup-modal-title"
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 py-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 pr-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300 mb-3">
            <Plus className="h-3 w-3" />
            {t("dashboard.credits.buyMoreCredits", "Buy more credits")}
          </div>
          <h2
            id="topup-modal-title"
            className="text-xl font-bold text-white"
          >
            {t("dashboard.credits.buyMoreCredits", "Buy more credits")}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              "dashboard.credits.buyMoreSubtitle",
              "One-time purchase. Top-up credits never expire and are used only after your plan credits run out."
            )}
          </p>
        </div>

        <TopupWidget
          variant="bare"
          defaultCredits={defaultCredits}
          onCheckoutOpened={onClose}
        />
      </div>
    </div>
  );
}
