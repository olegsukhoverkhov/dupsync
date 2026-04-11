import { notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPaymentsPage({
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
  const filterType = pick("type"); // subscription | topup | all

  const service = await createServiceClient();

  // Fetch transactions with user info
  let query = service
    .from("transactions")
    .select("*, profiles!transactions_user_id_fkey(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filterType && filterType !== "all") {
    query = query.eq("type", filterType);
  }

  const { data: transactions } = await query;

  // Calculate totals
  const allTx = transactions || [];
  const totalRevenue = allTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const subscriptionRevenue = allTx
    .filter((t) => t.type === "subscription")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const topupRevenue = allTx
    .filter((t) => t.type === "topup")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalCreditsGranted = allTx.reduce((sum, t) => sum + Number(t.credits || 0), 0);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Payments
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          All transactions from subscriptions and credit top-ups.
        </p>
      </header>

      <AdminNav />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Total Revenue" value={`$${(totalRevenue / 100).toFixed(2)}`} />
        <StatCard label="Subscriptions" value={`$${(subscriptionRevenue / 100).toFixed(2)}`} />
        <StatCard label="Top-ups" value={`$${(topupRevenue / 100).toFixed(2)}`} />
        <StatCard label="Credits Granted" value={String(totalCreditsGranted)} />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { value: "", label: "All" },
          { value: "subscription", label: "Subscriptions" },
          { value: "topup", label: "Top-ups" },
        ].map((opt) => (
          <a
            key={opt.value}
            href={opt.value ? `?type=${opt.value}` : "?"}
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

      {/* Transactions table */}
      {allTx.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-slate-400">No transactions yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Credits</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allTx.map((tx) => {
                  const p = tx.profiles as Record<string, unknown> | null;
                  const typeBadge =
                    tx.type === "subscription"
                      ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                      : tx.type === "topup"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-500/30 bg-slate-500/10 text-slate-400";
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white truncate max-w-[200px]">
                          {(p?.full_name as string) || (p?.email as string) || tx.user_id.slice(0, 8)}
                        </p>
                        {p?.full_name ? (
                          <p className="text-xs text-slate-500 truncate">{String(p.email)}</p>
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
