"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useDashboardT } from "./locale-provider";

export function SupportTicketModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const t = useDashboardT();

  async function handleSubmit() {
    if (!subject.trim() || !description.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), description: description.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit");
      }
      setSuccess(true);
      setTimeout(() => {
        setSubject("");
        setDescription("");
        setSuccess(false);
        onClose();
        onCreated?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    if (sending) return;
    setSubject("");
    setDescription("");
    setError(null);
    setSuccess(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div>
        <h3 className="text-lg font-semibold text-white">
          {t("dashboard.support.newRequest", "New Support Request")}
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {t("dashboard.support.newRequestDesc", "Describe your issue and we'll get back to you as soon as possible.")}
        </p>

        {success ? (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
            <p className="text-sm font-medium text-emerald-300">
              {t("dashboard.support.ticketCreated", "Ticket submitted successfully!")}
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                {t("dashboard.support.subject", "Subject")}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("dashboard.support.subjectPlaceholder", "Brief summary of your issue")}
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                {t("dashboard.support.description", "Description")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("dashboard.support.descriptionPlaceholder", "Describe your issue in detail...")}
                rows={5}
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:outline-none resize-none"
                disabled={sending}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={sending}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {t("dashboard.support.cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={sending || !subject.trim() || !description.trim()}
                className="flex-1 gradient-button rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {t("dashboard.support.send", "Send")}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
