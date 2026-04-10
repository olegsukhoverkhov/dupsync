"use client";

/**
 * Responsive SVG line chart for daily visits on /admin/stats.
 * No external charting library — uses ResizeObserver to fit
 * the chart to container width. Line with dots, hover tooltips,
 * Y-axis labels, and a subtle fill area.
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
  const chartHeight = 220;
  const paddingLeft = 44;
  const paddingBottom = 32;
  const paddingTop = 16;
  const paddingRight = 16;
  const plotWidth = containerWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Y-axis ticks
  const yTicks = niceYTicks(maxVisits);
  const yMax = yTicks[yTicks.length - 1] || maxVisits;

  // Point positions
  const points = data.map((d, i) => {
    const x =
      paddingLeft +
      (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
    const y = paddingTop + plotHeight - (d.visits / yMax) * plotHeight;
    return { x, y };
  });

  // SVG path for the line
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  // Filled area under the line
  const areaPath = `${linePath} L${points[points.length - 1].x},${paddingTop + plotHeight} L${points[0].x},${paddingTop + plotHeight} Z`;

  // X-axis labels — show ~7 max
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
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines + labels */}
          {yTicks.map((tick) => {
            const y = paddingTop + plotHeight - (tick / yMax) * plotHeight;
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
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-500"
                  fontSize={10}
                >
                  {tick >= 1000
                    ? `${(tick / 1000).toFixed(tick >= 10000 ? 0 : 1)}k`
                    : tick}
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

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaFill)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Dots */}
          {points.map((p, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g key={data[i].day}>
                {/* Invisible larger hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5 : 3.5}
                  fill={isHovered ? "#f472b6" : "#1e293b"}
                  stroke={isHovered ? "#f472b6" : "#94a3b8"}
                  strokeWidth={isHovered ? 2 : 1.5}
                  className="pointer-events-none transition-all"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const show =
              i === 0 ||
              i === data.length - 1 ||
              (data.length > 2 && i % labelEvery === 0);
            if (!show) return null;
            return (
              <text
                key={`xl-${d.day}`}
                x={points[i].x}
                y={paddingTop + plotHeight + 20}
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

  const roughStep = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const residual = roughStep / mag;
  let niceStep: number;
  if (residual <= 1.5) niceStep = mag;
  else if (residual <= 3) niceStep = 2 * mag;
  else if (residual <= 7) niceStep = 5 * mag;
  else niceStep = 10 * mag;

  const ticks: number[] = [];
  for (let v = 0; v <= max + niceStep * 0.1; v += niceStep) {
    ticks.push(v);
  }
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
