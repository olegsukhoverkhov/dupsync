"use client";

import { useEffect, useRef, useState } from "react";

type Series = {
  label: string;
  color: string;
  data: number[];
};

type Props = {
  days: string[];
  series: Series[];
};

export function ConversionChart({ days, series }: Props) {
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

  if (days.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6 text-center text-sm text-slate-500">
        No conversion data for this period
      </div>
    );
  }

  const allValues = series.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues, 1);

  const chartHeight = 220;
  const paddingLeft = 44;
  const paddingBottom = 32;
  const paddingTop = 16;
  const paddingRight = 16;
  const plotWidth = containerWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const yTicks = niceYTicks(maxVal);
  const yMax = yTicks[yTicks.length - 1] || maxVal;

  function toPoints(data: number[]) {
    return data.map((v, i) => {
      const x =
        paddingLeft +
        (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
      const y = paddingTop + plotHeight - (v / yMax) * plotHeight;
      return { x, y };
    });
  }

  const seriesPoints = series.map((s) => ({
    ...s,
    points: toPoints(s.data),
  }));

  const labelEvery = Math.max(1, Math.ceil(days.length / 7));

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Daily Conversions</h3>
        {/* Legend */}
        <div className="flex gap-4">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[10px] text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <div className="mb-2 h-5 text-xs text-slate-300">
        {hoveredIdx !== null && days[hoveredIdx] && (
          <span>
            <span className="text-slate-400">{formatDay(days[hoveredIdx])}</span>
            {" — "}
            {series.map((s, si) => (
              <span key={s.label}>
                {si > 0 && " · "}
                <span style={{ color: s.color }}>{s.label}:</span>{" "}
                <span className="font-medium text-white">
                  {s.data[hoveredIdx]}
                </span>
              </span>
            ))}
          </span>
        )}
      </div>

      <div ref={containerRef} className="w-full">
        <svg
          width={containerWidth}
          height={chartHeight}
          viewBox={`0 0 ${containerWidth} ${chartHeight}`}
        >
          {/* Y-axis grid + labels */}
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
                  {tick}
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

          {/* Lines + dots for each series */}
          {seriesPoints.map((s) => {
            const linePath = s.points
              .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
              .join(" ");
            return (
              <g key={s.label}>
                <path
                  d={linePath}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={0.8}
                />
                {s.points.map((p, i) => {
                  const isHovered = hoveredIdx === i;
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 4 : 2.5}
                      fill={isHovered ? s.color : "#1e293b"}
                      stroke={s.color}
                      strokeWidth={isHovered ? 2 : 1.5}
                      className="pointer-events-none"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Invisible hover areas */}
          {days.map((_, i) => {
            const x =
              paddingLeft +
              (days.length === 1
                ? plotWidth / 2
                : (i / (days.length - 1)) * plotWidth);
            return (
              <rect
                key={i}
                x={x - plotWidth / days.length / 2}
                y={paddingTop}
                width={plotWidth / days.length}
                height={plotHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}

          {/* X-axis labels */}
          {days.map((d, i) => {
            const show =
              i === 0 ||
              i === days.length - 1 ||
              (days.length > 2 && i % labelEvery === 0);
            if (!show) return null;
            const x =
              paddingLeft +
              (days.length === 1
                ? plotWidth / 2
                : (i / (days.length - 1)) * plotWidth);
            return (
              <text
                key={`xl-${d}`}
                x={x}
                y={paddingTop + plotHeight + 20}
                textAnchor="middle"
                className="fill-slate-500"
                fontSize={10}
              >
                {formatDay(d)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

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
  for (let v = 0; v <= max + niceStep * 0.1; v += niceStep) ticks.push(v);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + niceStep);
  return ticks;
}

function formatDay(day: string): string {
  const parts = day.split("-");
  if (parts.length < 3) return day;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  return `${months[m - 1] || parts[1]} ${d}`;
}
