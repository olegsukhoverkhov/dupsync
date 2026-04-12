import Link from "next/link";
import { Check, ArrowRight, HelpCircle } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";

const PLANS: { key: PlanType; popular?: boolean }[] = [
  { key: "free" },
  { key: "starter" },
  { key: "pro", popular: true },
  { key: "enterprise" },
];

export function PricingNew() {
  return (
    <section id="pricing" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            AI video dubbing plans with lip sync included. Starting at $19.99/month.
          </p>
        </div>

        <div className="text-center text-sm text-slate-400 mb-8 border border-white/5 bg-white/5 rounded-xl px-4 py-3 max-w-xl mx-auto">
          Every plan includes lip sync and watermark-free exports — even Free.
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLANS.map(({ key, popular }) => {
            const plan = PLAN_LIMITS[key];
            const priceRaw = plan.price;
            const price = (priceRaw / 100).toFixed(2);
            const showDecimal = priceRaw > 0;

            return (
              <div
                key={key}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  popular
                    ? "gradient-border"
                    : "border border-white/10 bg-slate-800/50"
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-button rounded-full px-3 py-1 text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-white">
                      ${showDecimal ? price : "0"}
                    </span>
                    {priceRaw > 0 && (
                      <span className="text-slate-500 ml-1">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-pink-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    popular
                      ? "gradient-button"
                      : "border border-white/10 text-white hover:bg-white/5"
                  }`}
                >
                  {key === "free" ? "Get Started" : "Start Free Trial"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Credit system explanation */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-4 w-4 text-pink-400" />
              <h3 className="text-sm font-semibold text-white">How credits work</h3>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              1 credit = 1 minute of dubbed video in 1 target language.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-500">
              <div className="rounded-lg bg-white/5 px-3 py-2">
                5 min video × 1 lang = <span className="text-white font-medium">5 credits</span>
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-2">
                5 min video × 3 langs = <span className="text-white font-medium">15 credits</span>
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-2">
                10 min video × 2 langs = <span className="text-white font-medium">20 credits</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3">
              Video duration rounds up to the nearest minute. Unused credits don&apos;t roll over.
            </p>
          </div>
        </div>

        {/* Compare link */}
        <div className="text-center mt-8">
          <Link href="/compare" className="text-sm text-pink-400 hover:text-pink-300 font-medium">
            Compare with competitors →
          </Link>
        </div>
      </div>
    </section>
  );
}
