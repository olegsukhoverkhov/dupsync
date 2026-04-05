"use client";

import { useEffect, useState } from "react";
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
import { Loader2, CreditCard, TrendingUp, Clock, ChevronDown } from "lucide-react";
import Link from "next/link";

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

        if (profileRes.data) setProfile(profileRes.data as Profile);
        if (usageRes.data) setUsage(usageRes.data as UsageRecord[]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

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
  const totalCredits = planLimits.credits === -1 ? Infinity : planLimits.credits;
  const usedCredits = totalCredits === Infinity ? 0 : totalCredits - creditsRemaining;
  const usagePercent = totalCredits === Infinity ? 0 : Math.round((usedCredits / totalCredits) * 100);
  const totalSpend = usage.reduce((sum, u) => sum + Number(u.credits_used), 0);

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
      <h1 className="text-2xl font-bold mb-8 text-white">Credits & Usage</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <Card className="border-white/10 bg-slate-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Remaining</p>
                <p className="text-xl font-bold text-white">
                  {creditsRemaining === -1 ? "∞" : Math.floor(creditsRemaining).toLocaleString()}
                </p>
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
                <p className="text-xs text-slate-500">Used</p>
                <p className="text-xl font-bold text-white">{Math.floor(usedCredits).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                <CreditCard className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Spend</p>
                <p className="text-xl font-bold text-white">{Math.floor(totalSpend).toLocaleString()}</p>
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
                <p className="text-xs text-slate-500">Plan</p>
                <p className="text-xl font-bold text-white">{planLimits.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage bar */}
      {totalCredits !== Infinity && (
        <Card className="mb-8 border-white/10 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-base text-white">Monthly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">{Math.floor(usedCredits).toLocaleString()} credits used</span>
              <span className="text-slate-400">{totalCredits.toLocaleString()} credits total</span>
            </div>
            <Progress value={usagePercent} />
            {usagePercent > 80 && (
              <p className="mt-2 text-xs text-amber-400">
                You&apos;ve used {usagePercent}% of your credits.{" "}
                <Link href="/settings" className="text-pink-400 hover:text-pink-300 underline">Upgrade</Link>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Daily usage history */}
      <Card className="border-white/10 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-base text-white">Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          {dayGroups.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No usage recorded yet. Start dubbing to see your credits history.
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
                      <span className="text-xs text-slate-500">{day.items.length} dub(s)</span>
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
