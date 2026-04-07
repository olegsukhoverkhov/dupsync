"use client";

import { useEffect, useRef, useState } from "react";

export type DubStatus =
  | "pending"
  | "translating"
  | "generating_voice"
  | "lip_syncing"
  | "merging"
  | "done"
  | "error"
  | "audio_ready";

/**
 * Each stage has:
 *  - `from`: progress % the stage starts at
 *  - `to`: progress % the stage ends at (we never overshoot)
 *  - `duration(D)`: estimated duration in ms based on video length D in seconds
 */
const STAGES: Record<
  DubStatus,
  { from: number; to: number; duration: (videoSec: number) => number }
> = {
  pending:          { from: 0,   to: 10,  duration: () => 3_000 },
  translating:      { from: 10,  to: 30,  duration: (D) => Math.max(8_000, D * 600) },     // ~0.6s per video sec
  generating_voice: { from: 30,  to: 80,  duration: (D) => Math.max(20_000, D * 1500) },   // clone + TTS
  audio_ready:      { from: 80,  to: 82,  duration: () => 2_000 },                          // brief upload
  lip_syncing:      { from: 82,  to: 92,  duration: (D) => Math.max(45_000, D * 2200) },    // longest stage
  merging:          { from: 92,  to: 99,  duration: () => 8_000 },
  done:             { from: 100, to: 100, duration: () => 0 },
  error:            { from: 0,   to: 0,   duration: () => 0 },
};

interface UseSmoothProgressArgs {
  /** Current status from the backend */
  status: DubStatus;
  /** Current backend progress (0–100) — used as a floor */
  backendProgress: number;
  /** Original video duration in seconds (drives stage time estimates) */
  videoDurationSec: number;
}

/**
 * Returns a smoothly-interpolated progress value (0–100) that:
 *  - Always >= backendProgress
 *  - Within the current stage, advances linearly toward the next checkpoint
 *  - Never overshoots the next checkpoint until the backend confirms a stage change
 *  - Resets the timer whenever the stage transitions
 */
export function useSmoothProgress({
  status,
  backendProgress,
  videoDurationSec,
}: UseSmoothProgressArgs): number {
  const [smooth, setSmooth] = useState(backendProgress);
  const stageStartRef = useRef<number>(Date.now());
  const lastStatusRef = useRef<DubStatus>(status);
  const lastBackendRef = useRef<number>(backendProgress);

  // Reset stage timer when status changes
  useEffect(() => {
    if (status !== lastStatusRef.current) {
      stageStartRef.current = Date.now();
      lastStatusRef.current = status;
    }
  }, [status]);

  // Snap to backend progress if it jumps ahead
  useEffect(() => {
    if (backendProgress > lastBackendRef.current) {
      lastBackendRef.current = backendProgress;
      setSmooth((prev) => Math.max(prev, backendProgress));
    }
  }, [backendProgress]);

  // Animation loop — tick every 200 ms and interpolate
  useEffect(() => {
    if (status === "done") {
      setSmooth(100);
      return;
    }
    if (status === "error") return;

    const stage = STAGES[status];
    if (!stage) return;

    const tick = () => {
      const elapsed = Date.now() - stageStartRef.current;
      const stageDuration = stage.duration(videoDurationSec || 30);
      const stageRange = stage.to - stage.from;
      const ratio = Math.min(elapsed / stageDuration, 0.95); // never reach 100% of stage on UI
      const target = stage.from + stageRange * ratio;

      setSmooth((prev) => {
        // Floor: backend progress, ceiling: next stage start (stage.to)
        const floor = Math.max(prev, backendProgress);
        const ceiling = stage.to;
        const next = Math.min(Math.max(floor, target), ceiling);
        return next;
      });
    };

    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [status, backendProgress, videoDurationSec]);

  return Math.round(smooth);
}
