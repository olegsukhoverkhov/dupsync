"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { RangeFilter } from "@/components/admin/range-filter";
import { resolveRange, type RangePreset } from "@/lib/admin-range";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Trash2 } from "lucide-react";

type ErrorLog = {
  id: string;
  status_code: number;
  method: string;
  path: string;
  error_message: string;
  user_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  country: string | null;
  created_at: string;
  user_email?: string;
};

export default function AdminErrorsPage() {
  const params = useSearchParams();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const rangePreset = (params.get("range") || "day") as RangePreset;
  const customFrom = params.get("from") || "";
  const customTo = params.get("to") || "";
  const filterStatus = params.get("status") || "";
  const range = resolveRange(rangePreset, customFrom || null, customTo || null);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) return;
    setIsAdmin(true);

    let query = supabase
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (range.from) query = query.gte("created_at", range.from);
    if (range.to) query = query.lt("created_at", range.to);
    if (filterStatus === "4xx") {
      query = query.gte("status_code", 400).lt("status_code", 500);
    } else if (filterStatus === "5xx") {
      query = query.gte("status_code", 500);
    }

    const { data } = await query;
    if (!data) { setLoading(false); return; }

    // Fetch user emails
    const userIds = [...new Set(data.filter((e) => e.user_id).map((e) => e.user_id!))];
    const { data: profiles } = userIds.length > 0
      ? await supabase.from("profiles").select("id, email").in("id", userIds)
      : { data: [] };
    const emailMap = new Map<string, string>();
    for (const p of profiles || []) emailMap.set(p.id, p.email);

    setErrors(data.map((e) => ({
      ...e,
      user_email: e.user_id ? emailMap.get(e.user_id) || null : null,
    })) as ErrorLog[]);
    setLoading(false);
  }, [range.from, range.to, filterStatus]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleClearAll() {
    if (!confirm("Delete all error logs in this view?")) return;
    const ids = errors.map((e) => e.id);
    await fetch("/api/admin/error-logs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    setErrors([]);
  }

  if (!isAdmin && !loading) return null;

  const count5xx = errors.filter((e) => e.status_code >= 500).length;
  const count4xx = errors.filter((e) => e.status_code >= 400 && e.status_code < 500).length;
  const uniquePaths = new Set(errors.map((e) => e.path)).size;

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Errors
          {errors.length > 0 && (
            <span className="ml-3 inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-sm font-semibold text-red-400">
              {errors.length}
            </span>
          )}
        </h1>
        <p className="mt-2 text-sm text-slate-400">API error logs (4xx/5xx responses).</p>
      </header>

      <AdminNav />
      <RangeFilter currentPreset={rangePreset} currentFrom={customFrom} currentTo={customTo} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 my-6">
        <div className="rounded-2xl border border-red-500/20 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-500">5xx Server Errors</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{count5xx}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-500">4xx Client Errors</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{count4xx}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-500">Unique Endpoints</p>
          <p className="text-2xl font-bold text-white mt-1">{uniquePaths}</p>
        </div>
      </div>

      {/* Filters + clear */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {[
            { value: "", label: "All" },
            { value: "5xx", label: "5xx only" },
            { value: "4xx", label: "4xx only" },
          ].map((opt) => {
            const sp = new URLSearchParams(params.toString());
            if (opt.value) sp.set("status", opt.value); else sp.delete("status");
            return (
              <a
                key={opt.value}
                href={`?${sp.toString()}`}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterStatus === opt.value || (!filterStatus && !opt.value)
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {opt.label}
              </a>
            );
          })}
        </div>
        {errors.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Error list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : errors.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/5">
            <AlertTriangle className="h-7 w-7 text-emerald-500/40" />
          </div>
          <p className="text-sm text-slate-400">No errors in this period</p>
        </div>
      ) : (
        <div className="space-y-2">
          {errors.map((err) => (
            <div key={err.id} className="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${
                    err.status_code >= 500
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}>
                    {err.status_code}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{err.method}</span>
                  <span className="text-sm font-mono text-white truncate">{err.path}</span>
                </div>
                <span className="shrink-0 text-[10px] text-slate-600 whitespace-nowrap">
                  {new Date(err.created_at).toLocaleString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 truncate">{err.error_message}</p>
              <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-600">
                {err.user_email && <span>👤 {err.user_email}</span>}
                {err.country && <span>{countryFlag(err.country)} {err.country}</span>}
                {err.ip_hash && <span>IP: {err.ip_hash.slice(0, 8)}…</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}
