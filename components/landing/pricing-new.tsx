"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";

const PLANS: { key: PlanType; popular?: boolean }[] = [
  { key: "free" },
  { key: "starter" },
  { key: "pro", popular: true },
  { key: "enterprise" },
];

export function PricingNew() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Start free. Scale as you grow. No hidden fees.
          </p>

          {/* Monthly/Annual toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !annual ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                annual ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual <span className="text-green-400 text-xs ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLANS.map(({ key, popular }) => {
            const plan = PLAN_LIMITS[key];
            const price = annual
              ? Math.round(plan.price * 0.8 / 100)
              : plan.price / 100;

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
                    <span className="text-4xl font-bold text-white">${price}</span>
                    {plan.price > 0 && (
                      <span className="text-zinc-500 ml-1">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-pink-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
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
      </div>
    </section>
  );
}
