"use client";

import { ArrowDown } from "lucide-react";

type FunnelStep = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  steps: FunnelStep[];
};

function pct(a: number, b: number): string {
  if (b === 0) return "0%";
  return `${((a / b) * 100).toFixed(1)}%`;
}

export function FunnelChart({ steps }: Props) {
  const max = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6">
      <h3 className="mb-5 text-sm font-semibold text-white">
        Conversion Funnel
      </h3>
      <div className="space-y-1">
        {steps.map((step, i) => {
          const widthPct = Math.max((step.value / max) * 100, 2);
          const firstValue = steps[0].value;
          const convRate =
            i > 0 && firstValue > 0
              ? ((step.value / firstValue) * 100).toFixed(1)
              : null;

          return (
            <div key={step.label}>
              {/* Conversion rate arrow between steps */}
              {convRate !== null && (
                <div className="flex items-center gap-2 py-1.5 pl-2">
                  <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">
                    {convRate}%
                  </span>
                </div>
              )}

              {/* Bar row */}
              <div className="flex items-center gap-4">
                <span className="w-28 shrink-0 text-right text-xs font-medium text-slate-300">
                  {step.label}
                </span>
                <div className="relative flex-1">
                  <div
                    className="h-9 rounded-lg transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      background: step.color,
                    }}
                  />
                </div>
                <div className="w-20 shrink-0 text-right">
                  <span className="text-sm font-semibold text-white">
                    {step.value.toLocaleString()}
                  </span>
                  {i > 0 && (
                    <span className="ml-1.5 text-[10px] text-slate-500">
                      {pct(step.value, steps[0].value)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
