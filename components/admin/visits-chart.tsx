"use client";

/**
 * Responsive SVG histogram for daily visits on /admin/stats.
 * No external charting library — uses a ResizeObserver to fit
 * bars to the container width. Hover tooltips, gradient fill,
 * Y-axis labels, and rounded bars.
 */
import { useEffect, useRef, useState } from "react";

type Props = {
  data: Array<{ day: string; visits: number }>;
  label: string;
};

export function VisitsChart({ data, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setContainerWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 text-center text-sm text-slate-500">
        No visit data for this period
      </div>
    );
  }

  const maxVisits = Math.max(...data.map((d) => d.visits), 1);
  const chartHeight = 180;
  const paddingLeft = 40; // space for Y-axis labels
  const paddingBottom = 28; // space for X-axis labels
  const paddingTop = 8;
  const paddingRight = 8;
  const plotWidth = containerWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Bar sizing — adapt to data length
  const totalGapRatio = 0.3; // 30% of plot is gaps
  const barWidth = Math.max(
    2,
    (plotWidth * (1 - totalGapRatio)) / data.length
  );
  const gap = data.length > 1
    ? (plotWidth - barWidth * data.length) / (data.length - 1)
    : 0;

  // Y-axis ticks (3–5 nice round numbers)
  const yTicks = niceYTicks(maxVisits);

  // X-axis labels — show ~7 labels max
  const labelEvery = Math.max(1, Math.ceil(data.length / 7));

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-white">Visits</h3>
        <p className="text-xs text-slate-500">{label}</p>
      </div>

      {/* Tooltip */}
      <div className="mb-2 h-5 text-xs text-slate-300">
        {hoveredIdx !== null && data[hoveredIdx] && (
          <>
            <span className="font-medium text-white">
              {data[hoveredIdx].visits}
            </span>{" "}
            visits on{" "}
            <span className="text-slate-400">{data[hoveredIdx].day}</span>
          </>
        )}
      </div>

      <div ref={containerRef} className="w-full">
        <svg
          width={containerWidth}
          height={chartHeight}
          viewBox={`0 0 ${containerWidth} ${chartHeight}`}
        >
          <defs>
            <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="histGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="1" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines + labels */}
          {yTicks.map((tick) => {
            const y =
              paddingTop + plotHeight - (tick / maxVisits) * plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={containerWidth - paddingRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500"
                  fontSize={10}
                >
                  {tick >= 1000 ? `${(tick / 1000).toFixed(tick >= 10000 ? 0 : 1)}k` : tick}
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + plotHeight}
            x2={containerWidth - paddingRight}
            y2={paddingTop + plotHeight}
            stroke="rgba(255,255,255,0.1)"
          />

          {/* Bars */}
          {data.map((d, i) => {
            const h = maxVisits > 0 ? (d.visits / maxVisits) * plotHeight : 0;
            const x = paddingLeft + i * (barWidth + gap);
            const y = paddingTop + plotHeight - h;
            const isHovered = hoveredIdx === i;
            return (
              <rect
                key={d.day}
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(h, 1)}
                rx={Math.min(3, barWidth / 2)}
                fill={isHovered ? "url(#histGradHover)" : "url(#histGrad)"}
                className="cursor-pointer transition-opacity"
                opacity={hoveredIdx !== null && !isHovered ? 0.35 : 1}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const show =
              i === 0 ||
              i === data.length - 1 ||
              (data.length > 2 && i % labelEvery === 0);
            if (!show) return null;
            const x = paddingLeft + i * (barWidth + gap) + barWidth / 2;
            return (
              <text
                key={`xl-${d.day}`}
                x={x}
                y={paddingTop + plotHeight + 16}
                textAnchor="middle"
                className="fill-slate-500"
                fontSize={10}
              >
                {formatDayLabel(d.day)}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
        <span>
          {data.length} day{data.length !== 1 ? "s" : ""}
        </span>
        <span>
          Total: {data.reduce((s, d) => s + d.visits, 0).toLocaleString("en-US")} · Peak: {maxVisits}/day
        </span>
      </div>
    </div>
  );
}

/** Generate nice Y-axis tick values. */
function niceYTicks(max: number): number[] {
  if (max <= 0) return [0];
  if (max <= 5) return Array.from({ length: max + 1 }, (_, i) => i);

  // Find a nice step: 1, 2, 5, 10, 20, 50, ...
  const roughStep = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const residual = roughStep / mag;
  let niceStep: number;
  if (residual <= 1.5) niceStep = mag;
  else if (residual <= 3) niceStep = 2 * mag;
  else if (residual <= 7) niceStep = 5 * mag;
  else niceStep = 10 * mag;

  const ticks: number[] = [];
  for (let v = 0; v <= max; v += niceStep) {
    ticks.push(v);
  }
  // Always include a tick at or above max
  if (ticks[ticks.length - 1] < max) {
    ticks.push(ticks[ticks.length - 1] + niceStep);
  }
  return ticks;
}

/** Format "2026-04-10" → "Apr 10" */
function formatDayLabel(day: string): string {
  const parts = day.split("-");
  if (parts.length < 3) return day;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  return `${months[m - 1] || parts[1]} ${d}`;
}
