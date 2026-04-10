"use client";

import { useState } from "react";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import type { SupportTicket, SupportMessage } from "@/lib/supabase/types";
import { useDashboardT } from "@/components/dashboard/locale-provider";

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
  waiting_user: "Waiting for you",
  resolved: "Resolved",
  closed: "Closed",
};

export function TicketDetail({
  ticket,
  messages,
  isAdmin,
  onBack,
  onReply,
  onStatusChange,
}: {
  ticket: SupportTicket;
  messages: SupportMessage[];
  isAdmin?: boolean;
  onBack: () => void;
  onReply: (message: string) => Promise<void>;
  onStatusChange?: (status: string) => Promise<void>;
}) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const t = useDashboardT();

  async function handleSend() {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      await onReply(reply.trim());
      setReply("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 cursor-pointer">
        <ArrowLeft className="h-4 w-4" />
        {t("dashboard.support.backToTickets", "Back to tickets")}
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>
          {isAdmin && (
            <p className="text-xs text-slate-500 mt-1">
              {ticket.user_name || ticket.user_email}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}>
            {STATUS_LABELS[ticket.status] || ticket.status}
          </span>
          {isAdmin && onStatusChange && ticket.status !== "closed" && (
            <select
              value={ticket.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="open">Open</option>
              <option value="waiting_admin">Waiting support</option>
              <option value="waiting_user">Waiting user</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl p-4 ${
              msg.is_admin
                ? "bg-pink-500/5 border border-pink-500/10 ml-4"
                : "bg-white/5 border border-white/5 mr-4"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-400">
                {msg.is_admin ? "Support" : (msg.sender_name || "You")}
              </p>
              <p className="text-[10px] text-slate-600">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-slate-200 whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Reply box */}
      {ticket.status !== "closed" && (
        <div className="flex gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={t("dashboard.support.replyPlaceholder", "Type your reply...")}
            rows={2}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none resize-none"
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !reply.trim()}
            className="shrink-0 gradient-button rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 cursor-pointer"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
