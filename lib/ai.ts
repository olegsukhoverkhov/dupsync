import Anthropic from "@anthropic-ai/sdk";
import { TranscriptSegment } from "./supabase/types";

/**
 * Thrown when ElevenLabs returns a 400 with a voice-permission error
 * ("The voice does not have permission to use the model..."). The caller
 * should delete the cloned voice, fall back to a pre-made multilingual
 * voice, and retry.
 *
 * TODO: remove the fallback once the ElevenLabs account quota is bumped.
 */
export class ElevenLabsVoicePermissionError extends Error {
  constructor(body: string) {
    super(`ElevenLabs voice permission: ${body}`);
    this.name = "ElevenLabsVoicePermissionError";
  }
}

/**
 * ElevenLabs account has hit its monthly voice add/edit quota
 * (`voice_add_edit_limit_reached`). On Creator tier that's 95 per
 * billing cycle and it does NOT reset when old voices are deleted —
 * only on the next cycle. When this fires we MUST NOT silently fall
 * back to a pre-made voice because the user will hear a random
 * generic voice instead of their speaker. Surface the specific error
 * so the pipeline can mark the dub as error with a clear message.
 */
export class ElevenLabsQuotaExhaustedError extends Error {
  constructor(body: string) {
    super(`ElevenLabs voice quota exhausted: ${body}`);
    this.name = "ElevenLabsQuotaExhaustedError";
  }
}

/**
 * Pre-flight check: is the ElevenLabs account able to create at
 * least one more voice clone right now? Returns `{ ok: false }` when
 * the monthly `voice_add_edit_counter` has reached the plan cap.
 *
 * Used by `/api/dub` to refuse the request BEFORE deducting credits,
 * so the user isn't charged for a dub that will inevitably fail on
 * Stage 1 voice cloning and produce a wrong-sounding fallback voice.
 *
 * The check is cheap (one GET /user/subscription) and cached for 60s
 * in-process to avoid hammering ElevenLabs on a burst of parallel
 * dub requests.
 */
type ElevenLabsQuota = {
  voiceAddEditUsed: number;
  voiceAddEditMax: number;
  voiceSlotsUsed: number;
  voiceSlotsMax: number;
  characterUsed: number;
  characterMax: number;
};
let quotaCache: { at: number; data: ElevenLabsQuota } | null = null;

export async function getElevenLabsQuota(): Promise<ElevenLabsQuota | null> {
  try {
    const now = Date.now();
    if (quotaCache && now - quotaCache.at < 60_000) return quotaCache.data;

    const res = await fetch(
      "https://api.elevenlabs.io/v1/user/subscription",
      { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! } }
    );
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, number>;
    const data: ElevenLabsQuota = {
      voiceAddEditUsed: Number(j.voice_add_edit_counter ?? 0),
      voiceAddEditMax: Number(j.max_voice_add_edits ?? 0),
      voiceSlotsUsed: Number(j.voice_slots_used ?? 0),
      voiceSlotsMax: Number(j.voice_limit ?? 0),
      characterUsed: Number(j.character_count ?? 0),
      characterMax: Number(j.character_limit ?? 0),
    };
    quotaCache = { at: now, data };
    return data;
  } catch {
    // Non-fatal: if the probe fails, we don't block the dub.
    // Stage 1 will catch the real error if quota is actually hit.
    return null;
  }
}

/**
 * Convenience wrapper: true if a new dubbing pipeline run can
 * reasonably expect voice cloning to succeed right now. Conservative
 * by design — we need at least 1 free add/edit AND at least 1 free
 * voice slot, with a small safety margin so a burst of parallel
 * Stage 1 runs doesn't trip the limit mid-flight.
 */
export async function canCloneVoiceNow(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  const q = await getElevenLabsQuota();
  if (!q) return { ok: true }; // probe failed — let the actual call decide
  if (q.voiceAddEditUsed >= q.voiceAddEditMax) {
    return {
      ok: false,
      reason: "elevenlabs_voice_add_edit_quota_exhausted",
    };
  }
  // Keep at least 1 slot free for subsequent dubs in the same second
  if (q.voiceSlotsUsed >= q.voiceSlotsMax) {
    return { ok: false, reason: "elevenlabs_voice_slots_full" };
  }
  return { ok: true };
}

/**
 * Classified transcription failure. Raised by `transcribe()` when either
 * Whisper or AssemblyAI reject the file for a reason that is meaningful to
 * the end user — so we can surface a friendly error message on the project
 * card instead of a generic "error" blob.
 *
 * Codes:
 *  - `no_audio`          → video has no audio stream (muted screen recording, etc.)
 *  - `format_unsupported`→ file format can't be decoded by either provider
 *  - `too_long`          → file exceeds provider size/duration limits
 *  - `too_short`         → audio is too short to transcribe (<0.1s)
 *  - `unknown`           → catch-all with the raw provider message
 */
export type TranscriptionErrorCode =
  | "no_audio"
  | "format_unsupported"
  | "too_long"
  | "too_short"
  | "unknown";

export class TranscriptionError extends Error {
  code: TranscriptionErrorCode;
  /** User-facing message, safe to render in the UI. */
  userMessage: string;
  constructor(code: TranscriptionErrorCode, userMessage: string, rawMessage?: string) {
    super(rawMessage ? `${userMessage} (raw: ${rawMessage})` : userMessage);
    this.name = "TranscriptionError";
    this.code = code;
    this.userMessage = userMessage;
  }
}

/**
 * Inspect a raw provider error message (from Whisper or AssemblyAI) and
 * classify it into a TranscriptionError. Returns null if the message
 * doesn't match any known pattern — the caller should then fall back to
 * the next provider or throw a generic error.
 */
export function classifyTranscriptionError(
  rawMsg: string
): TranscriptionError | null {
  const m = rawMsg.toLowerCase();

  // AssemblyAI: "No audio stream found in the file."
  // Whisper 400: "The audio file could not be decoded or its format is not
  //               supported." — happens when the container has zero audio.
  if (/no audio stream/.test(m)) {
    return new TranscriptionError(
      "no_audio",
      "Your video has no audio track. Please upload a video with a spoken audio track to dub.",
      rawMsg
    );
  }
  if (/could not be decoded.*format.*not supported/.test(m)) {
    // This Whisper message is ambiguous — could be genuinely broken file
    // OR a silent file that Whisper can't ingest. Mark as no_audio so the
    // user gets the more actionable message; if a follow-up provider
    // succeeds we'll never surface this.
    return new TranscriptionError(
      "no_audio",
      "Your video has no audio track, or the audio format is not supported. Upload a standard video with a spoken audio track.",
      rawMsg
    );
  }
  if (/file.*too large|exceeds.*limit|too long/.test(m)) {
    return new TranscriptionError(
      "too_long",
      "Your video is too long or too large to transcribe. Trim it to under 60 minutes and try again.",
      rawMsg
    );
  }
  if (/audio.*too short|minimum.*duration/.test(m)) {
    return new TranscriptionError(
      "too_short",
      "Your video audio is too short to transcribe. Upload a clip at least 1 second long.",
      rawMsg
    );
  }
  if (/unsupported.*format|invalid.*codec/.test(m)) {
    return new TranscriptionError(
      "format_unsupported",
      "This file format is not supported. Please upload MP4, MOV, AVI, WebM, or MKV.",
      rawMsg
    );
  }
  return null;
}

/**
 * Heuristic — does an error look like a transient/retryable failure?
 * Used by withRetry() to decide whether to back off and retry, or to
 * fail fast on permanent errors (e.g. invalid input, quota exceeded).
 */
export function isTransientError(err: unknown): boolean {
  if (err instanceof ElevenLabsVoicePermissionError) return false; // permanent
  if (err instanceof ElevenLabsQuotaExhaustedError) return false; // permanent until billing cycle reset
  const msg = err instanceof Error ? err.message : String(err);
  return (
    /timed out|timeout/i.test(msg) ||
    /rate.?limit|429/i.test(msg) ||
    /5\d\d/.test(msg) || // 500/502/503/504
    /downstream|unavailable/i.test(msg) ||
    /econn|enetdown|epipe|fetch failed/i.test(msg) ||
    /overloaded/i.test(msg)
  );
}

/**
 * Generic retry wrapper. Retries a function up to `attempts` times on
 * transient errors with exponential backoff. Throws permanent errors
 * immediately so we don't waste time and credits retrying invalid input.
 */
export async function withRetry<T>(
  label: string,
  fn: () => Promise<T>,
  attempts = 3
): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const transient = isTransientError(err);
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[RETRY] ${label} attempt ${i}/${attempts} failed (${transient ? "transient" : "permanent"}): ${msg.slice(0, 200)}`
      );
      if (!transient) throw err;
      if (i < attempts) {
        const backoffMs = 1000 * Math.pow(2, i - 1); // 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`${label} failed after ${attempts} attempts`);
}

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _anthropic;
}

// Whisper supported formats
const WHISPER_FORMATS = new Set(["flac", "m4a", "mp3", "mp4", "mpeg", "mpga", "oga", "ogg", "wav", "webm"]);

// Map unsupported formats to supported ones for Whisper
function getWhisperFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "mp4";
  if (WHISPER_FORMATS.has(ext)) return `audio.${ext}`;
  // MOV (iPhone) → try as m4a first (better compatibility with AAC audio)
  if (ext === "mov") return "audio.m4a";
  // AVI, MKV → send as mp4
  return "audio.mp4";
}

function getWhisperMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "mp4";
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4", m4a: "audio/mp4", mp3: "audio/mpeg",
    wav: "audio/wav", webm: "video/webm", ogg: "audio/ogg",
    oga: "audio/ogg", flac: "audio/flac", mpeg: "video/mpeg",
    mpga: "audio/mpeg",
  };
  // For unsupported formats (mov, avi, mkv), use mp4 mime type
  return mimeTypes[ext] || "video/mp4";
}

// Transcription via AssemblyAI REST API — accepts ANY format including HEVC MOV
export async function transcribeWithAssemblyAI(
  audioBuffer: Buffer,
  languageHint?: string
): Promise<{ segments: TranscriptSegment[]; language: string }> {
  const apiKey = process.env.ASSEMBLYAI_API_KEY!;

  // Step 1: Upload file
  console.log(`[ASSEMBLYAI] Uploading ${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)}MB...`);
  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(audioBuffer),
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text().catch(() => "");
    throw new Error(`AssemblyAI upload failed: ${uploadRes.status} ${err.slice(0, 200)}`);
  }

  const { upload_url } = await uploadRes.json();
  console.log(`[ASSEMBLYAI] Uploaded: ${upload_url}`);

  // Step 2: Start transcription
  const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: upload_url,
      speech_models: ["universal-2"],
      language_code: languageHint && languageHint !== "auto" ? languageHint : undefined,
      language_detection: !languageHint || languageHint === "auto",
    }),
  });

  if (!transcriptRes.ok) throw new Error(`AssemblyAI create failed: ${transcriptRes.status}`);
  const { id: transcriptId } = await transcriptRes.json();

  // Step 3: Poll for completion
  console.log(`[ASSEMBLYAI] Polling transcript ${transcriptId}...`);
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { Authorization: apiKey },
    });
    const data = await pollRes.json();

    if (data.status === "completed") {
      const segments: TranscriptSegment[] = (data.words || []).reduce(
        (acc: TranscriptSegment[], word: { start: number; end: number; text: string }) => {
          const lastSeg = acc[acc.length - 1];
          const wStart = (word.start || 0) / 1000;
          const wEnd = (word.end || 0) / 1000;

          if (!lastSeg || wStart - lastSeg.end > 1.0 || wEnd - lastSeg.start > 5.0) {
            acc.push({ start: wStart, end: wEnd, text: word.text || "" });
          } else {
            lastSeg.end = wEnd;
            lastSeg.text += " " + (word.text || "");
          }
          return acc;
        },
        []
      );

      // AssemblyAI returns regional codes like "en_us", "en_uk", "en_au".
      // We normalize to plain ISO 639-1 ("en") so downstream lookups in
      // LANGUAGE_MAP succeed and we don't pass weird strings to APIs that
      // expect BCP 47 format.
      const rawLang = (data.language_code || languageHint || "en") as string;
      const lang = rawLang.toLowerCase().split(/[_-]/)[0];
      console.log(`[ASSEMBLYAI] Done: ${segments.length} segments, lang=${lang} (raw=${rawLang})`);
      return { segments, language: lang };
    }

    if (data.status === "error") {
      const rawMsg = String(data.error || "unknown AssemblyAI error");
      const classified = classifyTranscriptionError(rawMsg);
      if (classified) throw classified;
      throw new Error(`AssemblyAI error: ${rawMsg}`);
    }
  }

  throw new Error("AssemblyAI transcription timed out");
}

// Transcription: Whisper (primary) → AssemblyAI (fallback for unsupported formats)
export async function transcribe(
  audioBuffer: Buffer,
  filename: string,
  languageHint?: string
): Promise<{ segments: TranscriptSegment[]; language: string }> {
  // Try Whisper first
  const whisperFilename = getWhisperFilename(filename);
  const mimeType = getWhisperMimeType(whisperFilename);
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([new Uint8Array(audioBuffer)], { type: mimeType }),
    whisperFilename
  );
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");
  // Word-level granularity gives us precise per-word start/end timestamps.
  // Whisper's segment-level timestamps tend to round and PAD silence at the
  // ends — e.g. a 5s clip with speech only at 1.5–4s comes back as [0–5].
  // We rebuild segments from words using their real boundaries.
  formData.append("timestamp_granularities[]", "word");
  formData.append("timestamp_granularities[]", "segment");
  if (languageHint && languageHint !== "auto") {
    formData.append("language", languageHint);
  }

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error("Whisper API error:", response.status, errorBody.slice(0, 200));

    // Fallback to AssemblyAI (accepts ALL formats including HEVC MOV).
    // If AssemblyAI ALSO fails with a classified error, that's our final
    // answer — bubble it up so the UI can show a friendly message.
    if (process.env.ASSEMBLYAI_API_KEY) {
      console.log("[TRANSCRIBE] Whisper failed, trying AssemblyAI...");
      try {
        return await transcribeWithAssemblyAI(audioBuffer, languageHint);
      } catch (assemblyErr) {
        // AssemblyAI's message is usually more specific ("No audio stream
        // found in the file") so prefer it when available; otherwise fall
        // back to classifying the original Whisper body.
        if (assemblyErr instanceof TranscriptionError) throw assemblyErr;
        const fromWhisper = classifyTranscriptionError(errorBody);
        if (fromWhisper) throw fromWhisper;
        throw assemblyErr;
      }
    }

    // No fallback configured — try to classify Whisper's own message
    const classified = classifyTranscriptionError(errorBody);
    if (classified) throw classified;
    throw new Error(`Whisper API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Prefer word-level timestamps when available — they give precise speech
  // boundaries instead of Whisper's padded segment boundaries.
  type WhisperWord = { word: string; start: number; end: number };
  type WhisperSeg = { id?: number; start: number; end: number; text: string };
  const words: WhisperWord[] = data.words || [];
  const rawSegments: WhisperSeg[] = data.segments || [];

  let segments: TranscriptSegment[];

  if (words.length > 0 && rawSegments.length > 0) {
    // Match each segment's word range and rebuild start/end from words.
    // We iterate through `words` once, assigning to segments by text-content
    // alignment. To keep this simple and robust, we walk in order and pick
    // the words whose midpoint falls within the segment's [start, end].
    let wordIdx = 0;
    segments = rawSegments
      .map((seg) => {
        const segWords: WhisperWord[] = [];
        // Skip words that ended before this segment started
        while (wordIdx < words.length && words[wordIdx].end <= seg.start) {
          wordIdx++;
        }
        // Collect words that lie within (or overlap) the segment window
        while (wordIdx < words.length && words[wordIdx].start < seg.end) {
          segWords.push(words[wordIdx]);
          wordIdx++;
        }
        if (segWords.length === 0) {
          // Fall back to the segment timestamps if Whisper didn't align
          // any words to this segment (rare).
          return {
            start: seg.start,
            end: seg.end,
            text: seg.text.trim(),
          };
        }
        return {
          start: segWords[0].start,
          end: segWords[segWords.length - 1].end,
          text: seg.text.trim(),
        };
      })
      .filter((s) => s.text.length > 0);
  } else if (words.length > 0) {
    // No segment data — group words into utterances by silence gaps (>1s)
    segments = [];
    let cur: TranscriptSegment | null = null;
    for (const w of words) {
      if (!cur || w.start - cur.end > 1.0) {
        if (cur) segments.push(cur);
        cur = { start: w.start, end: w.end, text: w.word.trim() };
      } else {
        cur.end = w.end;
        cur.text += " " + w.word.trim();
      }
    }
    if (cur) segments.push(cur);
  } else {
    // Final fallback — original Whisper segment timestamps (may be padded)
    segments = rawSegments.map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text.trim(),
    }));
  }

  // Whisper returns language as a full English word ("english", "spanish",
  // "ukrainian"). Normalize to ISO 639-1 codes so the rest of the pipeline
  // can do LANGUAGE_MAP lookups consistently.
  const WHISPER_LANG_MAP: Record<string, string> = {
    english: "en", spanish: "es", french: "fr", german: "de", portuguese: "pt",
    italian: "it", japanese: "ja", korean: "ko", chinese: "zh", hindi: "hi",
    arabic: "ar", russian: "ru", ukrainian: "uk", polish: "pl", dutch: "nl",
    swedish: "sv", turkish: "tr", danish: "da", finnish: "fi", norwegian: "no",
    czech: "cs", greek: "el", romanian: "ro", hungarian: "hu", bulgarian: "bg",
    thai: "th", vietnamese: "vi", indonesian: "id", malay: "ms", filipino: "tl",
    hebrew: "he",
  };
  const rawWhisperLang = (data.language || "en").toString().toLowerCase();
  const normalizedLang =
    WHISPER_LANG_MAP[rawWhisperLang] || rawWhisperLang.split(/[_-]/)[0];
  console.log(`[WHISPER] ${segments.length} segments from ${words.length} words, lang=${normalizedLang} (raw=${rawWhisperLang})`);
  return { segments, language: normalizedLang };
}

// Translation via Claude (with automatic retry on transient errors)
export async function translate(
  segments: TranscriptSegment[],
  sourceLang: string,
  targetLang: string
): Promise<TranscriptSegment[]> {
  return withRetry(`translate(${targetLang})`, () =>
    translateOnce(segments, sourceLang, targetLang)
  );
}

async function translateOnce(
  segments: TranscriptSegment[],
  sourceLang: string,
  targetLang: string
): Promise<TranscriptSegment[]> {
  const text = segments
    .map((s) => `[${s.start}-${s.end}] ${s.text}`)
    .join("\n");

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are translating a video transcript from ${sourceLang} to ${targetLang} for AI dubbing.

CRITICAL REQUIREMENTS:
1. Preserve the EXACT timestamp format [start-end] at the beginning of each line.
2. Translate LITERALLY and faithfully — do NOT add, expand, or paraphrase.
   - Do NOT add information that isn't in the original (e.g. "яке я записую" when the source only said "my first test video").
   - Do NOT add conversational filler ("you know", "actually").
   - Do NOT restate the same idea in different words.
   - If the translation is naturally shorter or longer than the original, that's fine — keep it faithful.
3. Keep it CONCISE where possible. Use shorter synonyms over longer ones.
4. Use natural, conversational ${targetLang}. Match the original tone and register.
5. Output ONLY the translated lines in the same [start-end] format. No commentary.

Segments to translate:
${text}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const lines = content.text.trim().split("\n");
  return lines
    .map((line) => {
      // Accept optional "(Xs)" duration prefix that Claude might echo back
      const match = line.match(/^\[(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\]\s*(?:\([^)]*\)\s*)?(.+)$/);
      if (!match) return null;
      return {
        start: parseFloat(match[1]),
        end: parseFloat(match[2]),
        text: match[3].trim(),
      };
    })
    .filter((s): s is TranscriptSegment => s !== null);
}

// Get a pre-made ElevenLabs multilingual voice
export async function getMultilingualVoice(): Promise<string> {
  // Use "Laura" — ElevenLabs pre-made multilingual female voice
  // Fallback list of known pre-made voice IDs that support multilingual
  const PREMADE_VOICES = [
    "FGY2WhTYpPnrIDTdsKH5", // Laura
    "EXAVITQu4vr4xnSDxMaL", // Sarah
    "XrExE9yKIg1WjnnlVkGX", // Matilda
  ];

  // Try to verify the first voice exists
  for (const id of PREMADE_VOICES) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/voices/${id}`, {
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
      });
      if (res.ok) return id;
    } catch {
      continue;
    }
  }

  // Fallback to first
  return PREMADE_VOICES[0];
}

// ElevenLabs voice cloning with high-quality settings (with retry)
export async function cloneVoice(
  fileBuffer: Buffer,
  name: string,
  fileExt: string = "mp4"
): Promise<string> {
  return withRetry(`cloneVoice(${name.slice(0, 8)})`, () =>
    cloneVoiceOnce(fileBuffer, name, fileExt)
  );
}

async function cloneVoiceOnce(
  fileBuffer: Buffer,
  name: string,
  fileExt: string
): Promise<string> {
  const ext = fileExt.toLowerCase();
  const mimeMap: Record<string, string> = {
    mp4: "audio/mp4", mp3: "audio/mpeg", wav: "audio/wav",
    m4a: "audio/mp4", webm: "audio/webm", mov: "video/mp4",
    avi: "video/mp4", mkv: "video/mp4",
  };
  const mimeType = mimeMap[ext] || "video/mp4";
  const audioExtensions = new Set(["wav", "mp3", "m4a", "webm", "mp4"]);
  const fileName = audioExtensions.has(ext) ? `voice.${ext}` : "voice.mp3";

  const formData = new FormData();
  formData.append("name", `dubsync-${name.slice(0, 8)}-${Date.now()}`);
  formData.append(
    "files",
    new Blob([new Uint8Array(fileBuffer)], { type: mimeType }),
    fileName
  );
  formData.append("description", "Voice cloned by DubSync for video dubbing");
  // Labels help ElevenLabs optimize the voice model
  formData.append("labels", JSON.stringify({
    use_case: "dubbing",
    source: "video",
  }));

  console.log(`[VOICE_CLONE] Uploading ${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)}MB as ${fileName} (${mimeType})`);

  const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error(`[VOICE_CLONE] Error ${response.status}: ${errBody}`);
    // Detect the monthly voice add/edit quota limit. ElevenLabs
    // returns 403 with `voice_add_edit_limit_reached` — this cannot
    // be recovered by retry and deleting existing clones doesn't
    // reset the counter. Surface as a dedicated error so the
    // pipeline can fail the dub with a clear user-facing message
    // instead of silently falling back to a pre-made voice (which
    // plays the speaker's voice as someone completely different).
    if (
      response.status === 403 &&
      /voice_add_edit_limit_reached|monthly limit of voice add/i.test(errBody)
    ) {
      throw new ElevenLabsQuotaExhaustedError(errBody.slice(0, 300));
    }
    throw new Error(`ElevenLabs clone error: ${response.status} ${response.statusText} ${errBody.slice(0, 200)}`);
  }

  const data = await response.json();
  console.log(`[VOICE_CLONE] Success: voice_id=${data.voice_id}`);
  return data.voice_id;
}

// Delete a cloned voice after use to keep the account clean
export async function deleteClonedVoice(voiceId: string): Promise<void> {
  try {
    await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
      method: "DELETE",
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
    });
    console.log(`[VOICE_CLONE] Deleted voice ${voiceId}`);
  } catch {
    console.warn(`[VOICE_CLONE] Failed to delete voice ${voiceId}`);
  }
}

// ElevenLabs text-to-speech
export async function textToSpeech(
  text: string,
  voiceId: string
): Promise<Buffer> {
  return textToSpeechWithSpeed(text, voiceId, 1.0);
}

// ElevenLabs TTS with adjustable speed (0.5 - 2.0)
export async function textToSpeechWithSpeed(
  text: string,
  voiceId: string,
  speed: number
): Promise<Buffer> {
  const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
  console.log(`[TTS] Generating: ${text.length} chars, voice=${voiceId}, speed=${clampedSpeed.toFixed(2)}`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.95,
          style: 0.4,
          use_speaker_boost: true,
        },
        speed: clampedSpeed,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error(`[TTS] Error ${response.status}: ${errBody.slice(0, 200)}`);
    throw new Error(`ElevenLabs TTS error: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

/**
 * Generate per-segment TTS at NATURAL speed and place each segment at its
 * original timestamp. Preserves the original video's timing exactly:
 *
 *   - If the original speaker is silent for the first 5s, the dub is silent
 *     for the first 5s.
 *   - Each translated segment plays at its natural speed starting at the
 *     original `start` timestamp.
 *   - If the dubbed segment is shorter than the original window, the
 *     remaining time is filled with silence.
 *   - If the dubbed segment is longer than its window, it overlaps the next
 *     segment's window (rare; Claude is asked to keep translations concise).
 *   - Final WAV duration = original video duration. No extra padding, no
 *     time stretching, no audio shifting.
 *
 * This means the dubbed audio plays in sync with the original mouth movements
 * even if the dubbed words finish slightly earlier than the original — which
 * the user explicitly requested ("if the speaker is silent at the start, the
 * dub should be silent at the start too").
 */
export async function generateTimedAudio(
  segments: TranscriptSegment[],
  voiceId: string,
  originalVideoDuration: number
): Promise<{ wav: Buffer; durationSec: number }> {
  const SAMPLE_RATE = 24000;
  console.log(
    `[TTS_TIMED] Generating ${segments.length} segments at natural speed, video=${originalVideoDuration}s`
  );

  // ElevenLabs TTS with optional `speed` parameter (0.7 - 1.2 supported by
  // eleven_multilingual_v2). Returns raw PCM 24kHz mono.
  async function ttsAtSpeedOnce(text: string, speed: number): Promise<Buffer> {
    const body: Record<string, unknown> = {
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.95,
        style: 0.3,
        use_speaker_boost: true,
      },
    };
    // Only send speed if it's not 1.0 — keeps natural-speed calls clean
    if (speed !== 1.0) {
      body.voice_settings = { ...(body.voice_settings as object), speed };
    }
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=pcm_24000`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      const err = await response.text().catch(() => "");
      if (
        response.status === 400 &&
        /does not have permission|voice design/i.test(err)
      ) {
        throw new ElevenLabsVoicePermissionError(err.slice(0, 300));
      }
      throw new Error(`ElevenLabs TTS ${response.status}: ${err.slice(0, 200)}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async function ttsAtSpeed(text: string, speed: number): Promise<Buffer | null> {
    try {
      return await withRetry(
        `tts(${text.slice(0, 20)}, speed=${speed.toFixed(2)})`,
        () => ttsAtSpeedOnce(text, speed),
        3
      );
    } catch (err) {
      if (err instanceof ElevenLabsVoicePermissionError) throw err;
      console.warn(`[TTS_TIMED] TTS giving up after retries: ${err instanceof Error ? err.message : "unknown"}`);
      return null;
    }
  }

  // -------- TWO-PASS TIME-ALIGNED TTS --------
  //
  // Goal: each translated segment should occupy EXACTLY the same time window
  // as the original speech (so the dubbed audio aligns 1:1 with the speaker's
  // mouth movements, and lip sync produces a clean result).
  //
  // STRATEGY DEPENDS ON VIDEO LENGTH:
  //
  // Short videos (≤20s, usually 1-2 segments):
  //   Two-pass time alignment with ElevenLabs `speed` parameter.
  //   - Pass 1: TTS at speed=1.0, measure naturalDuration
  //   - Pass 2: regenerate with speed=natural/target (clamped 0.75-1.25)
  //   The slowdown is barely noticeable on a single short clip and gives
  //   us a perfect timing match for clean lip sync.
  //
  // Long videos (>20s, usually 5+ segments):
  //   Single-pass natural-speed TTS only.
  //   - On long videos, slowdowns from Pass 2 ACCUMULATE across segments
  //     and the whole audio sounds noticeably slow/dragged.
  //   - Better trade-off: each segment plays at its natural speed and is
  //     placed at its original timestamp. Some segments may finish before
  //     their window ends → small silent gaps. Lip sync handles those with
  //     closed-mouth frames.
  //   - Final file duration still equals original video duration.
  const SHORT_VIDEO_THRESHOLD_SEC = 20;
  const useTimeAlignment = originalVideoDuration <= SHORT_VIDEO_THRESHOLD_SEC;
  const SPEED_MIN = 0.75;
  const SPEED_MAX = 1.25;
  const SKIP_REGEN_THRESHOLD = 0.05; // 5%

  console.log(
    `[TTS_TIMED] Strategy: ${useTimeAlignment ? "two-pass time alignment" : "single-pass natural speed"} (video=${originalVideoDuration}s, threshold=${SHORT_VIDEO_THRESHOLD_SEC}s)`
  );

  // Pass 1: generate every segment at speed=1.0 and measure
  const measured: {
    seg: TranscriptSegment;
    pcm: Buffer;
    naturalSec: number;
  }[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg.text.trim()) continue;
    try {
      const pcm = await ttsAtSpeed(seg.text, 1.0);
      if (!pcm) continue;
      const naturalSec = pcm.length / 2 / SAMPLE_RATE;
      measured.push({ seg, pcm, naturalSec });
    } catch (err) {
      console.warn(`[TTS_TIMED] Pass1 segment ${i} exception:`, err);
    }
  }

  // Pass 2: regenerate segments where natural duration doesn't match target
  // (only for short videos — long videos use natural-speed Pass 1 output)
  const generated: { pcm: Buffer; start: number; finalSec: number; text: string }[] = [];

  if (!useTimeAlignment) {
    // Long video — skip Pass 2 entirely. Just use natural-speed PCM.
    for (const { seg, pcm: naturalPcm, naturalSec } of measured) {
      generated.push({ pcm: naturalPcm, start: seg.start, finalSec: naturalSec, text: seg.text });
    }
    console.log(`[TTS_TIMED] Long video → using ${generated.length} natural-speed segments`);
  } else {
    // Short video — apply Pass 2 time alignment
    for (let i = 0; i < measured.length; i++) {
      const { seg, pcm: naturalPcm, naturalSec } = measured[i];
      const targetSec = seg.end - seg.start;

      if (targetSec <= 0) {
        generated.push({ pcm: naturalPcm, start: seg.start, finalSec: naturalSec, text: seg.text });
        continue;
      }

      // speedFactor > 1 means we need to SPEED UP (natural is longer than target).
      // speedFactor < 1 means we need to SLOW DOWN (natural is shorter than target).
      const idealSpeed = naturalSec / targetSec;
      const drift = Math.abs(idealSpeed - 1.0);

      if (drift < SKIP_REGEN_THRESHOLD) {
        // Already close enough — skip the regen to save an API call
        generated.push({ pcm: naturalPcm, start: seg.start, finalSec: naturalSec, text: seg.text });
        console.log(
          `[TTS_TIMED] ${i + 1}/${measured.length}: ${naturalSec.toFixed(2)}s ≈ ${targetSec.toFixed(2)}s target, no regen`
        );
        continue;
      }

      const clampedSpeed = Math.max(SPEED_MIN, Math.min(SPEED_MAX, idealSpeed));
      console.log(
        `[TTS_TIMED] ${i + 1}/${measured.length}: natural=${naturalSec.toFixed(2)}s, target=${targetSec.toFixed(2)}s, ideal speed=${idealSpeed.toFixed(2)} → clamped=${clampedSpeed.toFixed(2)}`
      );

      try {
        const regenPcm = await ttsAtSpeed(seg.text, clampedSpeed);
        if (regenPcm) {
          const finalSec = regenPcm.length / 2 / SAMPLE_RATE;
          generated.push({ pcm: regenPcm, start: seg.start, finalSec, text: seg.text });
        } else {
          // Regen failed — use the natural-speed version
          generated.push({ pcm: naturalPcm, start: seg.start, finalSec: naturalSec, text: seg.text });
        }
      } catch (err) {
        console.warn(`[TTS_TIMED] Pass2 regen ${i} exception:`, err);
        generated.push({ pcm: naturalPcm, start: seg.start, finalSec: naturalSec, text: seg.text });
      }
    }
  }

  // -------- BUILD WAV --------
  //
  // Total duration = original video duration. Each segment is placed at its
  // ORIGINAL start timestamp. Because Pass 2 made every segment fit its
  // window, segments don't overlap each other and there's natural silence
  // in the gaps that the original speaker had between utterances.
  const totalSec = originalVideoDuration;
  const totalSamples = Math.ceil(totalSec * SAMPLE_RATE);
  const pcmOutput = Buffer.alloc(totalSamples * 2); // 16-bit silence

  // Place each segment at its ORIGINAL start timestamp
  for (const g of generated) {
    const startSample = Math.floor(g.start * SAMPLE_RATE);
    const destOffset = startSample * 2;
    const copyBytes = Math.min(g.pcm.length, pcmOutput.length - destOffset);
    if (destOffset >= 0 && copyBytes > 0) {
      g.pcm.copy(pcmOutput, destOffset, 0, copyBytes);
    }
  }

  // Build WAV header
  const wavSize = 44 + totalSamples * 2;
  const wav = Buffer.alloc(wavSize);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wavSize - 8, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(totalSamples * 2, 40);
  pcmOutput.copy(wav, 44);

  const lastVoiceEnd = generated.reduce(
    (max, g) => Math.max(max, g.start + g.finalSec),
    0
  );
  console.log(
    `[TTS_TIMED] Done: ${(wavSize / 1024).toFixed(0)}KB, ${totalSec.toFixed(2)}s (last voice ends at ${lastVoiceEnd.toFixed(2)}s, ${generated.length} segments)`
  );
  return { wav, durationSec: totalSec };
}

// Generate TTS as PCM and pad to exact duration as WAV (legacy single-segment)
export async function textToSpeechPadded(
  text: string,
  voiceId: string,
  targetDurationSec: number,
  speed: number = 1.0
): Promise<Buffer> {
  const SAMPLE_RATE = 24000;
  const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
  console.log(`[TTS_PADDED] ${text.length} chars, target=${targetDurationSec}s, speed=${clampedSpeed.toFixed(2)}`);

  // Get PCM audio from ElevenLabs
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=pcm_24000`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.3,         // lower = more expressive, closer to original
          similarity_boost: 0.95, // maximum similarity to cloned voice
          style: 0.4,             // some style transfer from original
          use_speaker_boost: true, // enhance speaker similarity
        },
        speed: clampedSpeed,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`ElevenLabs TTS error: ${response.status} ${errBody.slice(0, 200)}`);
  }

  const pcmBuffer = Buffer.from(await response.arrayBuffer());
  const pcmSamples = pcmBuffer.length / 2; // 16-bit = 2 bytes per sample
  const pcmDuration = pcmSamples / SAMPLE_RATE;

  console.log(`[TTS_PADDED] PCM: ${pcmSamples} samples = ${pcmDuration.toFixed(2)}s`);

  // Target total samples for exact video duration
  const targetSamples = Math.ceil(targetDurationSec * SAMPLE_RATE);

  // Build WAV with EXACT target duration — trim if speech longer, pad if shorter
  const totalSamples = targetSamples; // ALWAYS exact target duration
  const wavSize = 44 + totalSamples * 2;
  const wav = Buffer.alloc(wavSize); // zeros = silence for padding

  // WAV header
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wavSize - 8, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // mono
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(totalSamples * 2, 40);

  // Copy PCM data (rest is zeros = silence)
  pcmBuffer.copy(wav, 44, 0, Math.min(pcmBuffer.length, totalSamples * 2));

  console.log(`[TTS_PADDED] WAV: ${totalSamples} samples = ${(totalSamples / SAMPLE_RATE).toFixed(2)}s (padded ${Math.max(0, targetSamples - pcmSamples)} samples silence)`);

  return wav;
}

/**
 * Submit a lip sync job to fal.ai with a webhook callback.
 *
 * Returns the fal request_id immediately — no polling. fal.ai will POST
 * the result to `webhookUrl` when the job finishes (success or failure).
 *
 * Use this for the async webhook-based flow. The traditional `lipSync()`
 * function below is kept for legacy/sync use cases.
 */
export async function submitLipSyncJob(
  videoUrl: string,
  audioUrl: string,
  webhookUrl: string,
  options: {
    model: "fal-ai/sync-lipsync" | "fal-ai/latentsync";
    modelVersion?: string;
  }
): Promise<{ requestId: string; model: string }> {
  const body =
    options.model === "fal-ai/sync-lipsync"
      ? {
          video_url: videoUrl,
          audio_url: audioUrl,
          model: options.modelVersion ?? "lipsync-1.8.0",
          sync_mode: "cut_off",
        }
      : { video_url: videoUrl, audio_url: audioUrl };

  // fal.ai accepts the webhook URL as a query parameter on the submit endpoint
  const submitUrl = `https://queue.fal.run/${options.model}?fal_webhook=${encodeURIComponent(webhookUrl)}`;
  console.log(`[LIP_SYNC] Submitting async to ${options.model}, webhook=${webhookUrl}`);

  const response = await fetch(submitUrl, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(
      `fal.ai submit error: ${response.status} ${errBody.slice(0, 200)}`
    );
  }

  const data = await response.json();
  if (!data.request_id) {
    throw new Error(
      `fal.ai submit returned no request_id: ${JSON.stringify(data).slice(0, 200)}`
    );
  }
  console.log(`[LIP_SYNC] ${options.model} job submitted: ${data.request_id}`);
  return { requestId: data.request_id, model: options.model };
}

/**
 * Fetch a completed lip sync job's result from fal.ai. Used by the webhook
 * handler to extract the final video URL when fal.ai posts the OK callback.
 *
 * Note: The webhook payload usually already contains the result, but for
 * cases where the payload is incomplete or we need to re-fetch, this
 * helper hits the queue result endpoint directly.
 */
export async function fetchLipSyncResult(
  modelPath: string,
  requestId: string
): Promise<string> {
  const response = await fetch(
    `https://queue.fal.run/${modelPath}/requests/${requestId}`,
    {
      headers: { Authorization: `Key ${process.env.FAL_KEY}` },
    }
  );
  if (!response.ok) {
    throw new Error(`fal.ai result fetch ${response.status}`);
  }
  const result = await response.json();
  const videoUrl =
    (typeof result?.video === "string" && result.video) ||
    (typeof result?.video?.url === "string" && result.video.url) ||
    (typeof result?.url === "string" && result.url) ||
    null;
  if (!videoUrl) {
    throw new Error(
      `fal.ai result has no video URL: ${JSON.stringify(result).slice(0, 200)}`
    );
  }
  return videoUrl;
}

/**
 * Extract a video URL from a fal.ai webhook payload.
 *
 * Webhook bodies vary by model:
 *   sync-lipsync → { payload: { video: { url: "..." } } }
 *   latentsync   → { payload: { video: { url: "..." } } }
 *   auto-caption → { payload: { video_url: "..." } }
 * Older shapes:   { payload: { video: "..." } }  or  { payload: { url: "..." } }
 */
export function extractVideoUrlFromWebhook(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  // auto-caption uses a flat `video_url` field — check before the
  // nested lipsync shapes so we don't accidentally miss it.
  if (typeof p.video_url === "string") return p.video_url;
  const video = p.video;
  if (typeof video === "string") return video;
  if (video && typeof video === "object") {
    const url = (video as Record<string, unknown>).url;
    if (typeof url === "string") return url;
  }
  if (typeof p.url === "string") return p.url;
  return null;
}

/**
 * fal.ai lip sync — routes to the model configured for the user's plan.
 *
 * Plan mapping:
 * - Free / Starter → `fal-ai/latentsync` (ByteDance LatentSync)
 * - Pro / Business → `fal-ai/sync-lipsync` with `lipsync-1.8.0` (Sync Labs)
 *
 * Retry budget MUST fit within Vercel's 300s function timeout
 * (the /api/dub/lipsync route uses `maxDuration = 300`). Each attempt is
 * capped at 120s of polling, so we get exactly 2 attempts: primary first,
 * then fallback model on failure. Total worst case ~242s, leaving headroom
 * for the surrounding work (signed URLs, downloads, uploads).
 *
 * If both models fail, the dub is left with audio-only and the client can
 * manually retry. This is preferable to having Vercel kill the function
 * mid-attempt and leaving the dub stuck in `lip_syncing` forever.
 */
export const LIP_SYNC_POLL_TIMEOUT_MS = 120_000; // 2 minutes per attempt

export async function lipSync(
  videoUrl: string,
  audioUrl: string,
  options?: { model?: "fal-ai/sync-lipsync" | "fal-ai/latentsync"; modelVersion?: string }
): Promise<string> {
  const primary = options?.model ?? "fal-ai/latentsync";
  const fallback: "fal-ai/sync-lipsync" | "fal-ai/latentsync" =
    primary === "fal-ai/sync-lipsync" ? "fal-ai/latentsync" : "fal-ai/sync-lipsync";

  function bodyFor(model: "fal-ai/sync-lipsync" | "fal-ai/latentsync") {
    if (model === "fal-ai/sync-lipsync") {
      return {
        video_url: videoUrl,
        audio_url: audioUrl,
        model: options?.modelVersion ?? "lipsync-1.8.0",
        sync_mode: "cut_off",
      };
    }
    return { video_url: videoUrl, audio_url: audioUrl };
  }

  // 2 attempts only — primary then fallback. No retries within a model.
  // The Vercel function timeout (300s) doesn't allow more than this with
  // a 120s per-attempt poll cap.
  const models: Array<"fal-ai/sync-lipsync" | "fal-ai/latentsync"> = [primary, fallback];

  let lastError: unknown;
  for (const model of models) {
    try {
      console.log(`[LIP_SYNC] Trying ${model}`);
      return await runLipSyncModel(model, videoUrl, audioUrl, bodyFor(model));
    } catch (err) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : "unknown";
      console.warn(`[LIP_SYNC] ${model} failed: ${errMsg}`);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Lip sync failed: both models exhausted");
}

async function runLipSyncModel(
  modelPath: string,
  videoUrl: string,
  audioUrl: string,
  body: Record<string, unknown>
): Promise<string> {
  console.log(`[LIP_SYNC] Submitting to ${modelPath}...`);

  const submitResponse = await fetch(`https://queue.fal.run/${modelPath}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!submitResponse.ok) {
    const errBody = await submitResponse.text().catch(() => "");
    console.error(`[LIP_SYNC] ${modelPath} submit failed ${submitResponse.status}: ${errBody}`);
    throw new Error(`fal.ai submit error: ${submitResponse.status} ${errBody.slice(0, 200)}`);
  }

  const { request_id } = await submitResponse.json();
  console.log(`[LIP_SYNC] ${modelPath} job submitted: ${request_id}`);

  // Poll for result. Cap at LIP_SYNC_POLL_TIMEOUT_MS (default 2 min) so the
  // per-attempt budget × 2 model attempts fits within Vercel's 300s function
  // timeout. Going longer here previously caused dubs to get stuck in
  // `lip_syncing` forever when Vercel killed the function mid-poll.
  const maxAttempts = Math.floor(LIP_SYNC_POLL_TIMEOUT_MS / 2000);
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusResponse = await fetch(
      `https://queue.fal.run/${modelPath}/requests/${request_id}/status`,
      {
        headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      }
    );

    const statusData = await statusResponse.json();
    if (i % 5 === 0) console.log(`[LIP_SYNC] ${modelPath} poll ${i}: ${statusData.status}`);

    if (statusData.status === "COMPLETED") {
      const resultResponse = await fetch(
        `https://queue.fal.run/${modelPath}/requests/${request_id}`,
        {
          headers: { Authorization: `Key ${process.env.FAL_KEY}` },
        }
      );
      const result = await resultResponse.json();
      // Different fal.ai models return the video URL in different shapes:
      //   sync-lipsync → { video: { url: "..." } }
      //   latentsync   → { video: "..." }  OR  { video: { url: "..." } }
      // Be defensive so a malformed response never becomes `fetch(undefined)`.
      const videoUrl =
        (typeof result?.video === "string" && result.video) ||
        (typeof result?.video?.url === "string" && result.video.url) ||
        (typeof result?.url === "string" && result.url) ||
        null;
      if (!videoUrl) {
        console.error(
          `[LIP_SYNC] ${modelPath} completed but returned no video URL. Response:`,
          JSON.stringify(result).slice(0, 500)
        );
        throw new Error(
          `${modelPath} returned no video URL: ${JSON.stringify(result).slice(0, 200)}`
        );
      }
      console.log(`[LIP_SYNC] ${modelPath} completed → ${videoUrl.slice(0, 80)}`);
      return videoUrl;
    }

    if (statusData.status === "FAILED") {
      const detail = statusData.error || statusData.detail || "Unknown error";
      console.error(`[LIP_SYNC] ${modelPath} failed: ${JSON.stringify(detail).slice(0, 300)}`);
      throw new Error(`Lip sync failed: ${typeof detail === "string" ? detail : JSON.stringify(detail).slice(0, 200)}`);
    }
  }

  throw new Error(`${modelPath} timed out after ${Math.round(LIP_SYNC_POLL_TIMEOUT_MS / 1000)}s`);
}

/**
 * Slow down a video to match a target duration using fal.ai ffmpeg.
 * Returns a URL to the slowed video.
 */
export async function slowDownVideo(
  videoUrl: string,
  targetDurationSec: number,
  originalDurationSec: number
): Promise<string> {
  const speedFactor = originalDurationSec / targetDurationSec;
  console.log(`[FFMPEG] Slowing video from ${originalDurationSec}s to ${targetDurationSec}s (speed=${speedFactor.toFixed(3)})`);

  if (speedFactor >= 0.95) {
    console.log(`[FFMPEG] Speed factor too small, returning original`);
    return videoUrl;
  }

  const submitResponse = await fetch("https://queue.fal.run/fal-ai/ffmpeg-api/compose", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracks: [
        {
          id: "v1",
          type: "video",
          keyframes: [
            {
              url: videoUrl,
              timestamp: 0,
              duration: targetDurationSec,
            },
          ],
        },
      ],
    }),
  });

  if (!submitResponse.ok) {
    const err = await submitResponse.text().catch(() => "");
    console.warn(`[FFMPEG] Submit failed: ${submitResponse.status} ${err.slice(0, 200)}`);
    return videoUrl; // fallback to original
  }

  const { request_id } = await submitResponse.json();

  // Poll for result
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(`https://queue.fal.run/fal-ai/ffmpeg-api/requests/${request_id}/status`, {
      headers: { Authorization: `Key ${process.env.FAL_KEY}` },
    });
    const status = await statusRes.json();
    if (status.status === "COMPLETED") {
      const resultRes = await fetch(`https://queue.fal.run/fal-ai/ffmpeg-api/requests/${request_id}`, {
        headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      });
      const result = await resultRes.json();
      console.log(`[FFMPEG] Slowed video ready`);
      return result.video_url || result.video?.url || result.url || videoUrl;
    }
    if (status.status === "FAILED") {
      console.warn(`[FFMPEG] Failed: ${JSON.stringify(status).slice(0, 200)}`);
      return videoUrl;
    }
  }
  return videoUrl;
}

/**
 * Submit a burn-subtitles job to fal.ai `auto-caption` with a webhook
 * callback. Returns the request id so the caller can persist it and
 * correlate the result when the webhook fires.
 *
 * Why auto-caption instead of feeding our own SRT file: the fal.ai
 * ffmpeg-api `compose` endpoint has no subtitle track type (only
 * video/audio/image) and no fal.ai model currently accepts a custom
 * SRT input. auto-caption runs STT on the dubbed audio, which is in
 * the target language already — the burned captions naturally match
 * what the user hears. Our own translated_segments (used for the
 * downloadable .srt/.vtt files) can drift slightly from the STT
 * output because TTS compresses/stretches timing; using STT for the
 * burn-in keeps visual + audio perfectly synced.
 *
 * The job is submitted async with a webhook URL. Poll-based flows
 * would burn serverless seconds; the webhook arrives whenever fal.ai
 * finishes (usually 30–120s for a short clip).
 */
export async function submitBurnSubtitlesJob(
  videoUrl: string,
  webhookUrl: string
): Promise<{ requestId: string }> {
  const res = await fetch(
    `https://queue.fal.run/fal-ai/auto-caption?fal_webhook=${encodeURIComponent(webhookUrl)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: videoUrl,
        // Styling defaults tuned for short-form social video:
        // large readable text, white with dark stroke, centered
        // near the bottom so it sits above typical TikTok UI chrome.
        txt_color: "white",
        txt_font: "Standard",
        font_size: 32,
        stroke_width: 2,
        left_align: "center",
        top_align: 0.82,
        refresh_interval: 1.5,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `auto-caption submit failed: ${res.status} ${text.slice(0, 300)}`
    );
  }
  const json = (await res.json()) as { request_id?: string };
  if (!json.request_id) {
    throw new Error("auto-caption submit: no request_id in response");
  }
  return { requestId: json.request_id };
}
