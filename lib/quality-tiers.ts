import type { PlanType } from "./supabase/types";

/**
 * Per-plan quality configuration.
 *
 * This is the single source of truth for which model variants each plan
 * uses across the dubbing pipeline. Keep the shape flat and extendable —
 * adding a new tier dimension (e.g. transcription, TTS, output resolution)
 * should only require a new property here plus a consumer in the pipeline.
 */
export interface QualityTier {
  /** Human-readable name for logs and UI */
  label: string;

  /** fal.ai lip sync model path, e.g. "fal-ai/sync-lipsync" or "fal-ai/latentsync" */
  lipSyncModel: "fal-ai/sync-lipsync" | "fal-ai/latentsync";

  /** For sync-lipsync: which beta model version to request (ignored for latentsync) */
  lipSyncModelVersion?: string;
}

export const QUALITY_TIERS: Record<PlanType, QualityTier> = {
  free: {
    label: "Free",
    lipSyncModel: "fal-ai/latentsync",
  },
  starter: {
    label: "Starter",
    lipSyncModel: "fal-ai/latentsync",
  },
  pro: {
    label: "Pro",
    lipSyncModel: "fal-ai/sync-lipsync",
    lipSyncModelVersion: "lipsync-1.8.0",
  },
  enterprise: {
    label: "Business",
    lipSyncModel: "fal-ai/sync-lipsync",
    lipSyncModelVersion: "lipsync-1.8.0",
  },
};

/**
 * Safe accessor — falls back to the `free` tier if an unknown plan is passed
 * (e.g. from a stale profile row or a test fixture).
 */
export function getQualityTier(plan: PlanType | null | undefined): QualityTier {
  if (plan && QUALITY_TIERS[plan]) return QUALITY_TIERS[plan];
  return QUALITY_TIERS.free;
}
