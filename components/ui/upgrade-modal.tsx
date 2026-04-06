"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPGRADE_PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "$19.99",
    credits: "20 credits/mo",
    highlighted: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$49.99",
    credits: "50 credits/mo",
    highlighted: true,
  },
  {
    key: "business",
    name: "Business",
    price: "$149.99",
    credits: "150 credits/mo",
    highlighted: false,
  },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleDismiss() {
    try {
      localStorage.setItem("upgrade_modal_dismissed", "true");
    } catch {
      // localStorage may be unavailable
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center">
      <div className="max-w-2xl w-full mx-4 mt-20 rounded-2xl bg-slate-900 border border-white/10 p-8 relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Your free video is ready!
          </h2>
          <p className="mt-2 text-slate-400">
            Upgrade to dub unlimited videos with lip sync in 30+ languages.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {UPGRADE_PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-xl p-4 text-center ${
                plan.highlighted
                  ? "gradient-border"
                  : "border border-white/10 bg-slate-800/50"
              }`}
            >
              <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
              <p className="text-2xl font-bold text-white mt-2">{plan.price}</p>
              <p className="text-xs text-slate-400 mt-1">{plan.credits}</p>
              <Link
                href={`/pricing?plan=${plan.key}`}
                className={`mt-4 block w-full rounded-lg px-3 py-2 text-sm font-semibold transition-all text-center ${
                  plan.highlighted
                    ? "gradient-button"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                Select
              </Link>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-slate-500">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Download free button */}
        <div className="text-center">
          <button
            onClick={handleDismiss}
            className="border border-white/10 text-white hover:bg-white/5 rounded-xl px-6 py-3 text-sm font-semibold transition-all cursor-pointer"
          >
            Download Free Video
          </button>
        </div>
      </div>
    </div>
  );
}
