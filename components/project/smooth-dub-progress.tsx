"use client";

import { useSmoothProgress, type DubStatus } from "@/hooks/use-smooth-progress";
import { Progress } from "@/components/ui/progress";

interface SmoothDubProgressProps {
  status: DubStatus;
  backendProgress: number;
  videoDurationSec: number;
  label: string;
}

/**
 * Main progress bar for the active dub. Smoothly interpolates between
 * checkpoints based on the estimated stage duration.
 */
export function SmoothDubProgress({
  status,
  backendProgress,
  videoDurationSec,
  label,
}: SmoothDubProgressProps) {
  const smooth = useSmoothProgress({ status, backendProgress, videoDurationSec });

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span>{smooth}%</span>
      </div>
      <Progress value={smooth} />
    </div>
  );
}

interface SmoothDubBadgeProps {
  status: DubStatus;
  backendProgress: number;
  videoDurationSec: number;
  label: string;
}

/**
 * Inline percentage badge used in the per-language list.
 */
export function SmoothDubBadge({
  status,
  backendProgress,
  videoDurationSec,
  label,
}: SmoothDubBadgeProps) {
  const smooth = useSmoothProgress({ status, backendProgress, videoDurationSec });

  return (
    <span className="text-xs text-pink-400 flex items-center gap-1.5">
      {label} {smooth}%
      <span className="inline-flex gap-[3px]">
        <span
          className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce"
          style={{ animationDelay: "200ms", animationDuration: "0.8s" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce"
          style={{ animationDelay: "400ms", animationDuration: "0.8s" }}
        />
      </span>
    </span>
  );
}
