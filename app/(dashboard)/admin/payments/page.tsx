"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { ConfirmModal } from "@/components/ui/modal";
import { RangeFilter } from "@/components/admin/range-filter";
import { resolveRange, type RangePreset } from "@/lib/admin-range";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

type Transaction = {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  credits: number;
  description: string | null;
  is_test: boolean;
  created_at: string;
  user_email?: string;
  user_name?: string;
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const filterType = params.get("type") || "";
  const rangePreset = (params.get("range") || "all") as RangePreset;
  const customFrom = params.get("from") || "";
  const customTo = params.get("to") || "";
  const range = resolveRange(rangePreset, customFrom || null, customTo || null);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) return;
    setIsAdmin(true);

    let query = supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (filterType && filterType !== "all") {
      query = query.eq("type", filterType);
    }
    if (range.from) {
      query = query.gte("created_at", range.from);
    }
    if (range.to) {
      query = query.lt("created_at", range.to);
    }

    const { data } = await query;
    if (!data) { setLoading(false); return; }

    // Fetch user info for all transactions
    const userIds = [...new Set(data.map((t) => t.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);

    const profileMap = new Map<string, { email: string; full_name: string | null }>();
    for (const p of profiles || []) {
      profileMap.set(p.id, p);
    }

    setTransactions(data.map((t) => {
      const p = profileMap.get(t.user_id);
      return {
        ...t,
        user_email: p?.email || "",
        user_name: p?.full_name || "",
      };
    }));
    setLoading(false);
  }, [filterType, range.from, range.to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    }
  }

  async function handleDelete() {
    const supabase = createClient();
    const ids = [...selectedIds];
    for (const id of ids) {
      await supabase.from("transactions").delete().eq("id", id);
    }
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
    fetchData();
  }

  function buildFilterUrl(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    return `?${next.toString()}`;
  }

  if (!isAdmin && !loading) return null;

  // Stats from filtered data
  const totalRevenue = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const subRevenue = transactions.filter((t) => t.type === "subscription").reduce((s, t) => s + Number(t.amount || 0), 0);
  const topupRevenue = transactions.filter((t) => t.type === "topup").reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalCredits = transactions.reduce((s, t) => s + Number(t.credits || 0), 0);

  const selectedCount = selectedIds.size;
  const selectedHasTest = [...selectedIds].some((id) => transactions.find((t) => t.id === id)?.is_test);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Payments</h1>
        <p className="mt-2 text-sm text-slate-400">All transactions from subscriptions and credit top-ups.</p>
      </header>

      <AdminNav />

      <RangeFilter currentPreset={rangePreset} currentFrom={customFrom} currentTo={customTo} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 mt-4">
        <StatCard label="Total Revenue" value={`$${(totalRevenue / 100).toFixed(2)}`} />
        <StatCard label="Subscriptions" value={`$${(subRevenue / 100).toFixed(2)}`} />
        <StatCard label="Top-ups" value={`$${(topupRevenue / 100).toFixed(2)}`} />
        <StatCard label="Credits Granted" value={String(totalCredits)} />
      </div>

      {/* Type filter + bulk actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {[
            { value: "", label: "All" },
            { value: "subscription", label: "Subscriptions" },
            { value: "topup", label: "Top-ups" },
          ].map((opt) => (
            <a
              key={opt.value}
              href={buildFilterUrl("type", opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === opt.value || (!filterType && !opt.value)
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {opt.label}
            </a>
          ))}
        </div>

        {selectedCount > 0 && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            Delete {selectedCount} selected
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-slate-400">No transactions{filterType ? ` of type "${filterType}"` : ""} in this period</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === transactions.length && transactions.length > 0}
                      onChange={toggleAll}
                      className="rounded border-white/20 bg-white/5 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Credits</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => {
                  const typeBadge =
                    tx.type === "subscription"
                      ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                      : tx.type === "topup"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-500/30 bg-slate-500/10 text-slate-400";
                  return (
                    <tr key={tx.id} className={`hover:bg-white/[0.02] ${selectedIds.has(tx.id) ? "bg-white/[0.03]" : ""}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(tx.id)}
                          onChange={() => toggleSelect(tx.id)}
                          className="rounded border-white/20 bg-white/5 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white truncate max-w-[200px]">
                          {tx.user_name || tx.user_email || tx.user_id.slice(0, 8)}
                        </p>
                        {tx.user_name ? (
                          <p className="text-xs text-slate-500 truncate">{tx.user_email}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeBadge}`}>
                          {tx.type}
                        </span>
                        {tx.is_test && (
                          <span className="ml-1 inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400">
                            TEST
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-white font-medium">
                        ${(Number(tx.amount || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-300">
                        {tx.credits}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 truncate max-w-[250px]">
                        {tx.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={`Delete ${selectedCount} transaction${selectedCount > 1 ? "s" : ""}`}
        message={`Permanently delete ${selectedCount} selected transaction${selectedCount > 1 ? "s" : ""}? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}
