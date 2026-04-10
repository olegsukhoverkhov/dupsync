"use client";

/**
 * Simple SVG bar chart for daily visits on /admin/stats.
 * No external charting library — just responsive SVG with
 * hover tooltips and a gradient fill.
 *
 * Receives data server-side and renders client-side for
 * interactivity (hover state). The chart respects the
 * calendar range filter — when the admin changes the range,
 * the server re-fetches and passes new data.
 */
import { useState } from "react";

type Props = {
  data: Array<{ day: string; visits: number }>;
  label: string;
};

export function VisitsChart({ data, label }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 text-center text-sm text-slate-500">
        No visit data for this period
      </div>
    );
  }

  const maxVisits = Math.max(...data.map((d) => d.visits), 1);
  const chartHeight = 200;
  const barGap = 2;
  const barWidth = Math.max(
    4,
    Math.min(40, (800 - data.length * barGap) / data.length)
  );
  const chartWidth = data.length * (barWidth + barGap);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-white">Visits</h3>
        <p className="text-xs text-slate-500">{label}</p>
      </div>

      {/* Tooltip */}
      {hoveredIdx !== null && data[hoveredIdx] && (
        <div className="mb-2 text-xs text-slate-300">
          <span className="font-medium text-white">
            {data[hoveredIdx].visits}
          </span>{" "}
          visits on{" "}
          <span className="text-slate-400">{data[hoveredIdx].day}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <svg
          width={Math.max(chartWidth, 200)}
          height={chartHeight + 24}
          viewBox={`0 0 ${Math.max(chartWidth, 200)} ${chartHeight + 24}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="1" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={0}
              y1={chartHeight * (1 - frac)}
              x2={Math.max(chartWidth, 200)}
              y2={chartHeight * (1 - frac)}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const h = (d.visits / maxVisits) * chartHeight;
            const x = i * (barWidth + barGap);
            const y = chartHeight - h;
            const isHovered = hoveredIdx === i;
            return (
              <rect
                key={d.day}
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(h, 1)}
                rx={2}
                fill={isHovered ? "url(#barGradHover)" : "url(#barGrad)"}
                className="cursor-pointer transition-opacity"
                opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}

          {/* X-axis labels (show first, last, and every ~5th) */}
          {data.map((d, i) => {
            const showLabel =
              i === 0 ||
              i === data.length - 1 ||
              (data.length > 10 && i % Math.ceil(data.length / 7) === 0);
            if (!showLabel) return null;
            return (
              <text
                key={`label-${d.day}`}
                x={i * (barWidth + barGap) + barWidth / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                className="fill-slate-500"
                fontSize={9}
              >
                {d.day.slice(5)} {/* MM-DD */}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
        <span>
          {data.length} day{data.length !== 1 ? "s" : ""}
        </span>
        <span>Max: {maxVisits} visits/day</span>
      </div>
    </div>
  );
}
