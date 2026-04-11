"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Loader2, ChevronLeft, ChevronRight, Shield, LogIn, Ban, Trash2, ShieldOff, MessageSquarePlus } from "lucide-react";
import { ConfirmModal, Modal } from "@/components/ui/modal";
import type { AdminUserRow, AdminUsersPage } from "@/lib/admin";
import type { PlanType } from "@/lib/supabase/types";

const PLAN_OPTIONS: { value: PlanType; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

/**
 * Admin users table. Rows come pre-queried from the server component
 * so this is just presentation + the edit modal + pagination. Page
 * state is carried in the `?users=N` URL param so a reload preserves
 * the view.
 *
 * Saving the edit form POSTs to /api/admin/users/[id] and on success
 * calls router.refresh() so the server component re-runs the RPC and
 * the table shows the updated values without a full reload.
 */
export function UsersTable({ initial }: { initial: AdminUsersPage }) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [loggingInAs, setLoggingInAs] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<AdminUserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [ticketTarget, setTicketTarget] = useState<AdminUserRow | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSending, setTicketSending] = useState(false);

  function goToPage(page: number) {
    const next = new URLSearchParams(params.toString());
    next.set("users", String(page));
    startTransition(() => {
      router.push(`?${next.toString()}`);
    });
  }

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="mt-1 text-sm text-slate-400">
            {initial.totalCount} registered · newest first
          </p>
        </div>
        <p className="text-xs text-slate-500">
          Page {initial.page} / {initial.totalPages}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3 text-right">Credits left</th>
                <th className="px-4 py-3 text-right">Credits used</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initial.rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    No users.
                  </td>
                </tr>
              )}
              {initial.rows.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          u.is_online ? "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-slate-600"
                        }`}
                        title={u.is_online ? "Online" : "Offline"}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {u.full_name || u.email}
                        </p>
                        {u.full_name && (
                          <p className="truncate text-xs text-slate-500">{u.email}</p>
                        )}
                      </div>
                      {u.is_admin && (
                        <span
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[10px] font-semibold text-pink-300"
                          title="Admin"
                        >
                          <Shield className="h-3 w-3" />
                          admin
                        </span>
                      )}
                      {u.is_suspended && (
                        <span
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400"
                          title="Suspended"
                        >
                          <Ban className="h-3 w-3" />
                          suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {u.country ? (
                      <span title={u.country}>{countryFlag(u.country)} {u.country}</span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-200">
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-white">
                    {Math.floor(u.credits_remaining)}
                    {u.topup_credits > 0 && (
                      <span className="ml-1 text-xs text-slate-500">
                        +{Math.floor(u.topup_credits)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">
                    {Math.floor(u.credits_used_total)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(u.last_login_at)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={async () => {
                          setLoggingInAs(u.id);
                          try {
                            const res = await fetch(
                              `/api/admin/users/${u.id}/login-link`,
                              { method: "POST" }
                            );
                            if (!res.ok) throw new Error("Failed");
                            const { email, otp } = await res.json();
                            // Open the impersonate page in a new tab.
                            // It calls verifyOtp() client-side which
                            // properly sets the session cookie through
                            // the Supabase SSR auth flow.
                            const url = `/admin/impersonate?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
                            window.open(url, "_blank");
                          } catch {
                            alert("Could not generate login link");
                          } finally {
                            setLoggingInAs(null);
                          }
                        }}
                        disabled={loggingInAs === u.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {loggingInAs === u.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <LogIn className="h-3 w-3" />
                        )}
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => { setTicketTarget(u); setTicketSubject(""); setTicketMessage(""); }}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                      >
                        <MessageSquarePlus className="h-3 w-3" />
                      </button>
                      {!u.is_admin && (
                        <>
                          <button
                            type="button"
                            onClick={() => setSuspendTarget(u)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                              u.is_suspended
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                            }`}
                          >
                            {u.is_suspended ? <ShieldOff className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                            {u.is_suspended ? "Unsuspend" : "Suspend"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(u)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {initial.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => goToPage(initial.page - 1)}
            disabled={initial.page <= 1 || isPending}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3 w-3" />
            Prev
          </button>
          <button
            type="button"
            onClick={() => goToPage(initial.page + 1)}
            disabled={initial.page >= initial.totalPages || isPending}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}

      <EditUserModal
        user={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />

      {/* Suspend / Unsuspend confirm */}
      <ConfirmModal
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        title={suspendTarget?.is_suspended ? "Unsuspend user" : "Suspend user"}
        message={
          suspendTarget?.is_suspended
            ? `Unsuspend ${suspendTarget.email}? They will regain access to their account.`
            : `Suspend ${suspendTarget?.email}? They will see a blocking modal and cannot use the app.`
        }
        confirmLabel={suspendTarget?.is_suspended ? "Unsuspend" : "Suspend"}
        destructive={!suspendTarget?.is_suspended}
        onConfirm={() => {
          if (!suspendTarget) return;
          fetch(`/api/admin/users/${suspendTarget.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_suspended: !suspendTarget.is_suspended }),
          }).then((res) => {
            if (res.ok) router.refresh();
            else alert("Failed to update user");
          });
        }}
      />

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete user permanently"
        message={`Permanently delete ${deleteTarget?.email}? This will remove their account, all projects, and all dubs. This action cannot be undone.`}
        confirmLabel="Delete forever"
        destructive
        onConfirm={() => {
          if (!deleteTarget) return;
          fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" }).then((res) => {
            if (res.ok) router.refresh();
            else alert("Failed to delete user");
          });
        }}
      />

      {/* Create support ticket to user */}
      <Modal open={!!ticketTarget} onClose={() => setTicketTarget(null)}>
        <div>
          <h3 className="text-lg font-semibold text-white">Message to user</h3>
          <p className="mt-1 text-xs text-slate-400">{ticketTarget?.email}</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Subject of the message"
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                Message
              </label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Write your message to the user..."
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setTicketTarget(null)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={ticketSending || !ticketSubject.trim() || !ticketMessage.trim()}
              onClick={async () => {
                if (!ticketTarget) return;
                setTicketSending(true);
                try {
                  const res = await fetch("/api/admin/support-ticket", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: ticketTarget.id,
                      subject: ticketSubject.trim(),
                      message: ticketMessage.trim(),
                    }),
                  });
                  if (res.ok) {
                    setTicketTarget(null);
                    window.dispatchEvent(new Event("support-updated"));
                  } else {
                    alert("Failed to create ticket");
                  }
                } finally {
                  setTicketSending(false);
                }
              }}
              className="flex-1 gradient-button rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {ticketSending && <Loader2 className="h-4 w-4 animate-spin" />}
              Send
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

function EditUserModal({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUserRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Modal open={!!user} onClose={onClose}>
      {user && (
        <EditForm
          key={user.id /* reset form state when switching users */}
          user={user}
          onCancel={onClose}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
}

function EditForm({
  user,
  onCancel,
  onSaved,
}: {
  user: AdminUserRow;
  onCancel: () => void;
  onSaved: () => void;
}) {
  // Seed directly from props on mount. Because the parent re-keys
  // this component per user, the state is correct from the first
  // render and we never see "0/free" flash.
  const [plan, setPlan] = useState<PlanType>(user.plan);
  const [credits, setCredits] = useState<string>(
    String(Math.floor(user.credits_remaining))
  );
  const [topup, setTopup] = useState<string>(
    String(Math.floor(user.topup_credits))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const creditsNumber = Number(credits);
      const topupNumber = Number(topup);
      if (!Number.isFinite(creditsNumber) || creditsNumber < 0) {
        setError("Credits must be a non-negative number");
        setSaving(false);
        return;
      }
      if (!Number.isFinite(topupNumber) || topupNumber < 0) {
        setError("Top-up credits must be a non-negative number");
        setSaving(false);
        return;
      }
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, credits_remaining: creditsNumber, topup_credits: topupNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white">Edit user</h3>
      <p className="mt-1 text-xs text-slate-400 break-all">{user.email}</p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">
            Plan
          </label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as PlanType)}
            className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-pink-500/50 focus:outline-none"
          >
            {PLAN_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">
            Credits remaining
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-pink-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">
            Top-up credits
          </label>
          <input
            type="number"
            min={0}
            step={1}
            value={topup}
            onChange={(e) => setTopup(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white focus:border-pink-500/50 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 gradient-button rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
      </div>
    </div>
  );
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString("en-US", {
    year: sameYear ? undefined : "numeric",
    month: "short",
    day: "numeric",
  });
}
