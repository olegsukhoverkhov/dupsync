"use client";

import { useCallback, useEffect, useState } from "react";
import { LifeBuoy, Plus, MessageCircle } from "lucide-react";
import { SupportTicketModal } from "@/components/dashboard/support-ticket-modal";
import { TicketDetail } from "@/components/support/ticket-detail";
import { useDashboardT } from "@/components/dashboard/locale-provider";
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
  waiting_user: "New reply",
  resolved: "Resolved",
  closed: "Closed",
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketDetail, setTicketDetail] = useState<{ ticket: SupportTicket; messages: SupportMessage[] } | null>(null);
  const t = useDashboardT();

  const fetchTickets = useCallback(async () => {
    const res = await fetch("/api/support/tickets");
    if (res.ok) setTickets(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function openTicket(id: string) {
    setSelectedTicket(id);
    const res = await fetch(`/api/support/tickets/${id}`);
    if (res.ok) {
      const data = await res.json();
      setTicketDetail(data);
      // Mark as read — if status is waiting_user, change to open
      if (data.ticket?.status === "waiting_user") {
        fetch(`/api/support/tickets/${id}/read`, { method: "POST" })
          .then(() => {
            fetchTickets();
            window.dispatchEvent(new Event("support-updated"));
          })
          .catch(() => {});
      }
    }
  }

  async function handleReply(message: string) {
    if (!selectedTicket) return;
    await fetch(`/api/support/tickets/${selectedTicket}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    // Refresh detail
    await openTicket(selectedTicket);
    fetchTickets();
    window.dispatchEvent(new Event("support-updated"));
  }

  if (selectedTicket && ticketDetail) {
    return (
      <div className="max-w-3xl mx-auto">
        <TicketDetail
          ticket={ticketDetail.ticket}
          messages={ticketDetail.messages}
          onBack={() => { setSelectedTicket(null); setTicketDetail(null); }}
          onReply={handleReply}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
            {t("dashboard.support.title", "Support")}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            {t("dashboard.support.yourTickets", "Your Tickets")}
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="gradient-button inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {t("dashboard.support.newRequest", "New Request")}
        </button>
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
            <LifeBuoy className="h-7 w-7 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">
            {t("dashboard.support.noTickets", "No support tickets yet")}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {t("dashboard.support.noTicketsDesc", "Create a request if you need help")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => openTicket(ticket.id)}
              className="w-full text-left rounded-2xl border border-white/10 bg-slate-800/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <MessageCircle className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ticket.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}>
                  {STATUS_LABELS[ticket.status] || ticket.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <SupportTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchTickets}
      />
    </div>
  );
}
