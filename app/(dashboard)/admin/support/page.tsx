"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle, Filter } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { TicketDetail } from "@/components/support/ticket-detail";
import type { SupportTicket, SupportMessage } from "@/lib/supabase/types";

const STATUS_COLORS: Record<string, string> = {
  open: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  waiting_admin: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  waiting_user: "border-pink-500/30 bg-pink-500/10 text-pink-400",
  resolved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  closed: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  waiting_admin: "Waiting for support",
  waiting_user: "Waiting for user",
  resolved: "Resolved",
  closed: "Closed",
};

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "waiting_admin", label: "Needs reply" },
  { value: "waiting_user", label: "Waiting user" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketDetail, setTicketDetail] = useState<{ ticket: SupportTicket; messages: SupportMessage[] } | null>(null);

  const fetchTickets = useCallback(async () => {
    const url = filter
      ? `/api/support/tickets?status=${filter}`
      : "/api/support/tickets";
    const res = await fetch(url);
    if (res.ok) setTickets(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function openTicket(id: string) {
    setSelectedTicket(id);
    const res = await fetch(`/api/support/tickets/${id}`);
    if (res.ok) setTicketDetail(await res.json());
  }

  async function handleReply(message: string) {
    if (!selectedTicket) return;
    await fetch(`/api/support/tickets/${selectedTicket}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    await openTicket(selectedTicket);
    fetchTickets();
    window.dispatchEvent(new Event("support-updated"));
  }

  async function handleStatusChange(status: string) {
    if (!selectedTicket) return;
    await fetch(`/api/support/tickets/${selectedTicket}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await openTicket(selectedTicket);
    fetchTickets();
    window.dispatchEvent(new Event("support-updated"));
  }

  if (selectedTicket && ticketDetail) {
    return (
      <div>
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">Admin</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Support</h1>
        </header>
        <AdminNav />
        <TicketDetail
          ticket={ticketDetail.ticket}
          messages={ticketDetail.messages}
          isAdmin
          onBack={() => { setSelectedTicket(null); setTicketDetail(null); }}
          onReply={handleReply}
          onStatusChange={handleStatusChange}
        />
      </div>
    );
  }

  const needsAttention = tickets.filter((t) => t.status === "open" || t.status === "waiting_admin").length;

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Support
          {needsAttention > 0 && (
            <span className="ml-3 inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-sm font-semibold text-red-400">
              {needsAttention}
            </span>
          )}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage support requests from users.
        </p>
      </header>

      <AdminNav />

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-slate-500" />
        <div className="flex gap-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filter === opt.value
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <MessageCircle className="h-7 w-7 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">No tickets{filter ? ` with status "${filter}"` : ""}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => openTicket(ticket.id)}
                    className="hover:bg-white/[0.02] cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white truncate max-w-xs">{ticket.subject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        {ticket.user_name || ticket.user_email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}>
                        {STATUS_LABELS[ticket.status] || ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
