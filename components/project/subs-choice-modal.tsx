"use client";

import { Modal } from "@/components/ui/modal";
import { Subtitles, VideoOff, Check, Loader2 } from "lucide-react";

/**
 * Pre-dub modal that asks the user whether to burn subtitles into
 * the final video. Shows an itemized cost breakdown so there are no
 * surprises when the +1 credit/language surcharge is applied.
 *
 * The modal is strictly a decision gate — it does NOT call the API
 * itself. On confirm it invokes `onConfirm(withSubs)` and the parent
 * page is responsible for calling `/api/dub` with the selected flag.
 *
 * Props:
 *   durationMin   - video length rounded up to the minute
 *   languageCount - how many target languages are being dubbed
 */
export function SubsChoiceModal({
  open,
  onClose,
  onConfirm,
  durationMin,
  languageCount,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (withSubs: boolean) => void;
  durationMin: number;
  languageCount: number;
  submitting: boolean;
}) {
  // Never render negatives — the parent should gate on this, but
  // guarding here makes the math obvious.
  const safeDur = Math.max(1, Math.ceil(durationMin));
  const safeLangs = Math.max(1, languageCount);
  const baseCredits = safeDur * safeLangs;
  const subsCredits = safeLangs; // +1 per output video
  const totalWithSubs = baseCredits + subsCredits;

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-pink-500/30 bg-pink-500/10">
          <Subtitles className="h-5 w-5 text-pink-300" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">
            Add subtitles to the video?
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Burned-in subtitles are rendered directly into each dubbed
            video. Costs{" "}
            <span className="font-semibold text-pink-300">
              +1 credit per language
            </span>
            .
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => onConfirm(true)}
            className="group w-full rounded-xl border border-pink-500/40 bg-pink-500/10 p-4 text-left transition-colors hover:bg-pink-500/15 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-500/20">
                <Check className="h-4 w-4 text-pink-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">
                  With subtitles
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {safeDur} min × {safeLangs} lang ({baseCredits}) + {safeLangs} subs
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold tabular-nums text-white">
                  {totalWithSubs}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  credits
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => onConfirm(false)}
            className="group w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                <VideoOff className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">
                  Without subtitles
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {safeDur} min × {safeLangs} lang
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold tabular-nums text-white">
                  {baseCredits}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  credits
                </p>
              </div>
            </div>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Downloadable{" "}
          <span className="font-medium text-slate-400">.srt</span> and{" "}
          <span className="font-medium text-slate-400">.vtt</span> files
          are always generated for every dub at no extra cost.
        </p>

        {submitting && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Starting dubbing…
          </div>
        )}
      </div>
    </Modal>
  );
}
