import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getConversionFunnel,
  getConversionByCountry,
  getConversionDaily,
} from "@/lib/analytics";
import { resolveRange, type RangePreset } from "@/lib/admin";
import { RangeFilter } from "@/components/admin/range-filter";
import { AdminNav } from "@/components/admin/admin-nav";
import { FunnelChart } from "@/components/admin/funnel-chart";
import { ConversionChart } from "@/components/admin/conversion-chart";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Target,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

function rate(a: number, b: number): string {
  if (b === 0) return "0%";
  return `${((a / b) * 100).toFixed(1)}%`;
}

function formatHours(h: number | null): string {
  if (h == null) return "--";
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${h.toFixed(1)}h`;
  return `${(h / 24).toFixed(1)}d`;
}

export default async function ConversionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) notFound();

  const sp = await searchParams;
  const pick = (k: string): string => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] ?? "" : v ?? "";
  };
  const presetParam = (pick("range") || "all") as RangePreset;
  const allowed: RangePreset[] = [
    "all", "day", "yesterday", "week", "month", "year", "custom",
  ];
  const preset: RangePreset = allowed.includes(presetParam)
    ? presetParam
    : "all";
  const customFrom = pick("from");
  const customTo = pick("to");
  const range = resolveRange(preset, customFrom || null, customTo || null);

  const [funnel, countryData, dailyData] = await Promise.all([
    getConversionFunnel({ from: range.from, to: range.to }),
    getConversionByCountry({ from: range.from, to: range.to }),
    getConversionDaily({ from: range.from, to: range.to }),
  ]);

  const funnelSteps = [
    { label: "Visitors", value: funnel.visitors, color: "linear-gradient(90deg, #ec4899, #f472b6)" },
    { label: "Signups", value: funnel.signups, color: "linear-gradient(90deg, #a78bfa, #c084fc)" },
    { label: "First Dub", value: funnel.firstDubbers, color: "linear-gradient(90deg, #60a5fa, #93c5fd)" },
    { label: "Paid", value: funnel.paidUsers, color: "linear-gradient(90deg, #34d399, #6ee7b7)" },
  ];

  const metricCards = [
    {
      label: "Visitor \u2192 Signup",
      value: rate(funnel.signups, funnel.visitors),
      icon: Users,
      sub: `${funnel.signups} of ${funnel.visitors}`,
    },
    {
      label: "Signup \u2192 First Dub",
      value: rate(funnel.firstDubbers, funnel.signups),
      icon: Zap,
      sub: `${funnel.firstDubbers} of ${funnel.signups}`,
    },
    {
      label: "First Dub \u2192 Paid",
      value: rate(funnel.paidUsers, funnel.firstDubbers),
      icon: DollarSign,
      sub: `${funnel.paidUsers} of ${funnel.firstDubbers}`,
    },
    {
      label: "Overall Visitor \u2192 Paid",
      value: rate(funnel.paidUsers, funnel.visitors),
      icon: Target,
      sub: `${funnel.paidUsers} of ${funnel.visitors}`,
    },
    {
      label: "Avg. Signup \u2192 Dub",
      value: formatHours(funnel.avgSignupToDubHours),
      icon: Clock,
      sub: "time to first dub",
    },
    {
      label: "Avg. Signup \u2192 Paid",
      value: formatHours(funnel.avgSignupToPaidHours),
      icon: TrendingUp,
      sub: "time to conversion",
    },
  ];

  return (
    <div>
      <AdminNav />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Conversion Analytics</h1>
        <RangeFilter
          currentPreset={preset}
          currentFrom={customFrom}
          currentTo={customTo}
        />
      </div>

      {/* Metric cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-white/10 bg-slate-800/30 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <card.icon className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Funnel + Chart row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <FunnelChart steps={funnelSteps} />
        <ConversionChart
          days={dailyData.map((d) => d.day)}
          series={[
            {
              label: "Signups",
              color: "#a78bfa",
              data: dailyData.map((d) => d.signups),
            },
            {
              label: "First Dub",
              color: "#60a5fa",
              data: dailyData.map((d) => d.firstDubbers),
            },
            {
              label: "Paid",
              color: "#34d399",
              data: dailyData.map((d) => d.paidUsers),
            },
          ]}
        />
      </div>

      {/* Country conversion table */}
      <div className="rounded-2xl border border-white/10 bg-slate-800/30 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Conversion by Country
        </h3>
        {countryData.length === 0 ? (
          <p className="text-sm text-slate-500">No country data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Country</th>
                  <th className="pb-3 px-3 font-medium text-right">Visitors</th>
                  <th className="pb-3 px-3 font-medium text-right">Signups</th>
                  <th className="pb-3 px-3 font-medium text-right">CR%</th>
                  <th className="pb-3 px-3 font-medium text-right">First Dub</th>
                  <th className="pb-3 px-3 font-medium text-right">CR%</th>
                  <th className="pb-3 px-3 font-medium text-right">Paid</th>
                  <th className="pb-3 pl-3 font-medium text-right">CR%</th>
                </tr>
              </thead>
              <tbody>
                {countryData.map((row) => (
                  <tr
                    key={row.country}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-2.5 pr-4 font-medium text-white">
                      {countryFlag(row.country)} {row.country || "Unknown"}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {row.visitors.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {row.signups}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {rate(row.signups, row.visitors)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {row.firstDubbers}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {rate(row.firstDubbers, row.signups)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {row.paidUsers}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-medium text-emerald-400">
                      {rate(row.paidUsers, row.visitors)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  const c = code.toUpperCase();
  return String.fromCodePoint(
    ...Array.from(c).map((ch) => 0x1f1e6 - 65 + ch.charCodeAt(0))
  );
}
