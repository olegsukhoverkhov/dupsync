"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS, LANGUAGE_MAP } from "@/lib/supabase/constants";
import type { Profile } from "@/lib/supabase/types";
import {
  Loader2,
  CreditCard,
  TrendingUp,
  Clock,
  ChevronDown,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  MIN_TOPUP_CREDITS,
  MAX_TOPUP_CREDITS,
  TOPUP_PRESETS,
  quoteTopup,
} from "@/lib/credits-topup";
import { useDashboardT } from "@/components/dashboard/locale-provider";

interface UsageRecord {
  id: string;
  project_id: string;
  project_title: string;
  dub_language: string;
  credits_used: number;
  video_seconds: number;
  created_at: string;
}

interface DayGroup {
  date: string;
  total: number;
  items: UsageRecord[];
}

export default function CreditsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const t = useDashboardT();

  // Top-up state
  const [topupCredits, setTopupCredits] = useState<number>(50);
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupMessage, setTopupMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const [profileRes, usageRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("credit_usage")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(100),
        ]);

        if (profileRes.data) {
          const p = profileRes.data as Profile;
          p.credits_remaining = Number(p.credits_remaining) || 0;
          p.topup_credits = Number(p.topup_credits) || 0;
          setProfile(p);
        }
        if (usageRes.data) setUsage(usageRes.data as UsageRecord[]);
      }
      setLoading(false);
    }
    loadData();

    // Refresh on page focus (user comes back from dubbing or checkout)
    const onFocus = () => loadData();
    window.addEventListener("focus", onFocus);

    // Surface success/cancel from Stripe checkout redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("topup") === "success") {
        setTopupMessage({
          type: "success",
          text: t(
            "dashboard.credits.topupSuccess",
            "Top-up successful! Your credits will appear in a few seconds."
          ),
        });
      } else if (params.get("topup") === "canceled") {
        setTopupMessage({
          type: "info",
          text: t(
            "dashboard.credits.topupCanceled",
            "Top-up canceled. Your card was not charged."
          ),
        });
      }
    }

    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const quote = useMemo(() => quoteTopup(topupCredits), [topupCredits]);

  async function handleTopup() {
    if (!quote) return;
    setTopupLoading(true);
    setTopupMessage(null);
    try {
      const res = await fetch("/api/credits/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: quote.credits }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTopupMessage({
          type: "error",
          text:
            data.error ||
            t("dashboard.credits.topupError", "Could not start checkout."),
        });
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setTopupMessage({
        type: "error",
        text: t("dashboard.credits.noCheckoutUrl", "No checkout URL returned."),
      });
    } catch (err) {
      setTopupMessage({
        type: "error",
        text: err instanceof Error ? err.message : t("dashboard.credits.unknownError", "Unknown error"),
      });
    } finally {
      setTopupLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
      </div>
    );
  }

  if (!profile) return null;

  const planLimits = PLAN_LIMITS[profile.plan];
  const creditsRemaining = Number(profile.credits_remaining) || 0;
  const rawTopup = Number(profile.topup_credits) || 0;
  const totalCredits = planLimits.credits === -1 ? Infinity : planLimits.credits;
  const usedCredits = totalCredits === Infinity ? 0 : Math.max(0, totalCredits - creditsRemaining);
  const usagePercent =
    totalCredits === Infinity || totalCredits === 0
      ? 0
      : Math.round((Math.max(0, usedCredits) / totalCredits) * 100);
  const totalSpend = usedCredits;
  // Effective balance the user can actually spend right now
  const effectiveRemaining =
    totalCredits === Infinity ? Infinity : creditsRemaining + rawTopup;

  // Group usage by day
  const dayGroups: DayGroup[] = [];
  const dayMap = new Map<string, UsageRecord[]>();
  for (const u of usage) {
    const date = new Date(u.created_at).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
    });
    if (!dayMap.has(date)) dayMap.set(date, []);
    dayMap.get(date)!.push(u);
  }
  for (const [date, items] of dayMap) {
    dayGroups.push({
      date,
      total: items.reduce((sum, i) => sum + Number(i.credits_used), 0),
      items,
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-8 text-white">
        {t("dashboard.credits.title", "Credits & Usage")}
      </h1>

      {/* Top-up result banner */}
      {topupMessage && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            topupMessage.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-300"
              : topupMessage.type === "error"
                ? "bg-red-500/10 border border-red-500/30 text-red-300"
                : "bg-blue-500/10 border border-blue-500/30 text-blue-300"
          }`}
        >
          {topupMessage.text}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <Card className="border-white/10 bg-slate-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("dashboard.credits.remaining", "Remaining")}</p>
                <p className="text-xl font-bold text-white">
                  {effectiveRemaining === Infinity
                    ? "∞"
                    : Math.floor(effectiveRemaining).toLocaleString()}
                </p>
                {rawTopup > 0 && effectiveRemaining !== Infinity && (
                  <p className="text-[10px] text-slate-500">
                    {t("dashboard.credits.topupPlanSplit", "{plan} plan + {topup} top-up", {
                      plan: String(Math.floor(creditsRemaining)),
                      topup: String(Math.floor(rawTopup)),
                    })}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("dashboard.credits.used", "Used")}</p>
                <p className="text-xl font-bold text-white">{Math.floor(usedCredits).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                <Sparkles className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("dashboard.credits.topupCredits", "Top-up credits")}</p>
                <p className="text-xl font-bold text-white">
                  {Math.floor(rawTopup).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <CreditCard className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t("dashboard.credits.plan", "Plan")}</p>
                <p className="text-xl font-bold text-white">{planLimits.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top-up purchase card */}
      <Card className="mb-8 border-white/10 bg-gradient-to-br from-pink-500/10 via-violet-500/5 to-blue-600/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Plus className="h-4 w-4 text-pink-400" />
            {t("dashboard.credits.buyMoreCredits", "Buy more credits")}
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            {t(
              "dashboard.credits.buyMoreSubtitle",
              "One-time purchase. Top-up credits never expire and are used only after your plan credits run out."
            )}
          </p>
        </CardHeader>
        <CardContent>
          {/* Slider + price preview */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-slate-400">{t("dashboard.credits.amount", "Amount")}</span>
            <span className="text-2xl font-bold text-white">
              {topupCredits}{" "}
              <span className="text-sm font-normal text-slate-400">{t("dashboard.credits.creditsLabel", "credits")}</span>
            </span>
          </div>
          <input
            type="range"
            min={MIN_TOPUP_CREDITS}
            max={MAX_TOPUP_CREDITS}
            step={1}
            value={topupCredits}
            onChange={(e) => setTopupCredits(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            aria-label={t("dashboard.credits.creditsAriaLabel", "Number of credits to buy")}
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>{MIN_TOPUP_CREDITS}</span>
            <span>{MAX_TOPUP_CREDITS}</span>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mt-4">
            {TOPUP_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTopupCredits(n)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  topupCredits === n
                    ? "bg-white text-slate-900"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Price breakdown */}
          {quote && (
            <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <div>
                <p className="text-xs text-slate-500">
                  {quote.credits} {t("dashboard.credits.creditsLabel", "credits")} × $1 {t("dashboard.credits.perCredit", "per credit")}
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {quote.priceLabel}
                </p>
              </div>

              <button
                type="button"
                disabled={topupLoading || !quote}
                onClick={handleTopup}
                className="mt-4 w-full gradient-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {topupLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("dashboard.credits.openingCheckout", "Opening checkout…")}
                  </>
                ) : (
                  <>
                    {t("dashboard.credits.buyButton", "Buy {n} credits — {price}", {
                      n: String(quote.credits),
                      price: quote.priceLabel,
                    })}
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                {t("dashboard.credits.checkoutNote", "Secure checkout · One-time payment · Credits never expire")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage bar */}
      {totalCredits !== Infinity && (
        <Card className="mb-8 border-white/10 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-base text-white">{t("dashboard.credits.monthlyUsage", "Monthly Usage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">{t("dashboard.credits.creditsUsedOf", "{used} credits used", { used: Math.floor(usedCredits).toLocaleString() })}</span>
              <span className="text-slate-400">{t("dashboard.credits.creditsTotalOf", "{total} credits total", { total: totalCredits.toLocaleString() })}</span>
            </div>
            <Progress value={usagePercent} />
            {usagePercent > 80 && (
              <p className="mt-2 text-xs text-amber-400">
                {t("dashboard.credits.usedNCredits", "You've used {n}% of your credits.", { n: String(usagePercent) })}{" "}
                <Link href="/settings" className="text-pink-400 hover:text-pink-300 underline">{t("dashboard.home.upgrade", "Upgrade")}</Link>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Daily usage history */}
      <Card className="border-white/10 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-base text-white">{t("dashboard.credits.usageHistory", "Usage History")}</CardTitle>
        </CardHeader>
        <CardContent>
          {dayGroups.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              {t("dashboard.credits.noUsage", "No usage recorded yet. Start dubbing to see your credits history.")}
            </p>
          ) : (
            <div className="space-y-2">
              {dayGroups.map((day) => (
                <div key={day.date} className="rounded-xl border border-white/5 overflow-hidden">
                  {/* Day header — clickable */}
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">{day.date}</span>
                      <span className="text-xs text-slate-500">{day.items.length} {t("dashboard.credits.dubs", "dub(s)")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-pink-400">
                        -{Math.floor(day.total)} credits
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${expandedDay === day.date ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Expanded items */}
                  {expandedDay === day.date && (
                    <div className="border-t border-white/5 bg-white/[0.02]">
                      {day.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.03] last:border-0">
                          <div>
                            <p className="text-sm text-white">{item.project_title}</p>
                            <p className="text-xs text-slate-500">
                              {LANGUAGE_MAP[item.dub_language] || item.dub_language} &middot; {item.video_seconds}s video
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-pink-400">-{Math.floor(Number(item.credits_used))}</p>
                            <p className="text-xs text-slate-600">
                              {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
