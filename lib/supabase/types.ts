export type PlanType = "free" | "starter" | "pro" | "enterprise";

export type ProjectStatus =
  | "uploading"
  | "transcribing"
  | "ready"
  | "dubbing"
  | "done"
  | "error";

export type DubStatus =
  | "pending"
  | "translating"
  | "generating_voice"
  | "lip_syncing"
  | "merging"
  | "audio_ready"
  | "done"
  | "error";

export type TransactionType = "subscription" | "addon" | "usage";

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  plan: PlanType;
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  status: ProjectStatus;
  original_video_url: string | null;
  original_language: string;
  transcript: TranscriptSegment[] | null;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
  /** ISO timestamp when archived, or null if active */
  archived_at: string | null;
}

export interface Dub {
  id: string;
  project_id: string;
  target_language: string;
  status: DubStatus;
  translated_transcript: TranscriptSegment[] | null;
  dubbed_video_url: string | null;
  progress: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  // fal.ai async lip sync tracking (populated by Stage 2 submit, read by webhook)
  fal_request_id: string | null;
  fal_model: string | null;
  fal_attempt: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  credits: number;
  description: string | null;
  stripe_session_id: string | null;
  created_at: string;
}

export interface ProjectWithDubs extends Project {
  dubs: Dub[];
}
