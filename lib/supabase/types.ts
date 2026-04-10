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
  /** Stage 3 (optional): burning translated subtitles into the
   *  lip-synced video via fal-ai auto-caption. Only reached when
   *  the dub was created with `has_burned_subs = true`. */
  | "burning_subs"
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
  /**
   * Admin flag. When true, unlocks the private /admin/stats page and
   * renders an "Admin" link in the dashboard sidebar. Flipped manually
   * in the DB — there's intentionally no self-serve way to grant this.
   */
  is_admin: boolean;
  /** When true, the user sees a blocking modal on every dashboard page
   *  and cannot use the app. Set by admin via /api/admin/users/[id]. */
  is_suspended: boolean;
  /** Set to true after the user dismisses or completes the onboarding
   *  wizard. Controls whether the wizard modal shows on the dashboard. */
  onboarding_completed: boolean;
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
  /** True for the auto-created demo project. Demo projects are
   *  excluded from concurrent-project limits and use public video
   *  URLs from the landing-assets bucket. */
  is_demo: boolean;
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
  /** Soft warning written alongside a successful dub — kept for
   *  potential future use. Currently unused in the UI. */
  warning_message: string | null;
  /** Which voice model generated this dub:
   *   - "cloned"  → ElevenLabs Instant Voice Clone of the speaker
   *                 (paid plans only: starter/pro/enterprise)
   *   - "premade" → Pre-made multilingual voice (free plan by
   *                 design, or paid plan as a temporary fallback
   *                 when the clone API errors)
   *  Used by the project detail page to show a "similar voice —
   *  upgrade for exact cloning" chip for free-plan users. */
  voice_source: "cloned" | "premade" | null;
  created_at: string;
  updated_at: string;
  // fal.ai async lip sync tracking (populated by Stage 2 submit, read by webhook)
  fal_request_id: string | null;
  fal_model: string | null;
  fal_attempt: number;
  /** Set by /api/cron/retry-failed-dubs once it has retried this dub.
   *  Prevents infinite cron retry loops. */
  cron_retried_at: string | null;
  // ── Subtitles ──────────────────────────────────────────────
  /** Storage path of the translated .srt file. Always generated
   *  after Stage 1 TTS completes — Phase 1 is platform-wide. */
  srt_url: string | null;
  /** Storage path of the translated .vtt file (same content as
   *  srt_url, just WebVTT format for <track> elements). */
  vtt_url: string | null;
  /** User opted into burned-in subtitles at dub creation time.
   *  Each has_burned_subs=true dub costs +1 credit on top of the
   *  normal minute-per-language rate. Stage 3 only runs when this
   *  is true. */
  has_burned_subs: boolean;
  /** Storage path of the lip-synced video WITH burned subtitles.
   *  Populated by Stage 3 (subtitle burn via fal-ai auto-caption). */
  dubbed_video_with_subs_url: string | null;
  /** fal.ai request id for the Stage 3 auto-caption job. Used by
   *  the webhook handler to correlate callbacks. */
  subs_fal_request_id: string | null;
}

// ── Support tickets ──────────────────────────────────────────

export type TicketStatus = "open" | "waiting_admin" | "waiting_user" | "resolved" | "closed";

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  /** Joined from profiles for admin views */
  user_email?: string;
  user_name?: string;
  /** Last message preview */
  last_message?: string;
  message_count?: number;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  /** Joined sender name for display */
  sender_name?: string;
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
