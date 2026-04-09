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

export type TransactionType = "subscription" | "addon" | "usage" | "topup";

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
  /**
   * Timestamp of the user's last successful login. Updated by
   * `/api/auth/track-login`, which is called from the OAuth callback
   * route and from the email/password login form. NULL for users who
   * logged in before this column was added.
   */
  last_login_at: string | null;
  /**
   * Preferred UI locale (en/es/pt/de/fr/ja). Stamped at signup or on
   * first login from the `dubsync_locale` cookie that `proxy.ts` sets
   * via geo detection. NULL for legacy users who signed up before this
   * column existed — their UI locale falls back to whatever the route
   * they're currently on tells us.
   */
  locale: string | null;
  /**
   * Plan credits remaining for the current billing period. Resets to the
   * plan's monthly allocation on renewal.
   */
  credits_remaining: number;
  /**
   * One-time purchased "top-up" credits. These persist across plan renewals
   * and are only consumed AFTER `credits_remaining` is exhausted, so users
   * never waste their monthly allocation by accident.
   */
  topup_credits: number;
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
  /**
   * User-facing error message set when transcription or the pipeline fails.
   * NULL when the project is healthy or still in progress. Written by
   * `runTranscription` (and other pipeline stages) when they catch a
   * classified error; rendered on the dashboard card and project detail
   * page when `status === "error"`.
   */
  error_message: string | null;
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
  /** Set by /api/cron/retry-failed-dubs once it has retried this dub.
   *  Prevents infinite cron retry loops. */
  cron_retried_at: string | null;
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
  /**
   * Total credits consumed by all dubs on this project (sum of
   * `credit_usage.credits_used` rows with this project_id). Attached by
   * /api/projects; may be undefined when a project has no usage rows yet.
   */
  credits_used?: number;
}
