/**
 * Cartesia Sonic-3 — voice cloning + TTS provider.
 *
 * Used as PRIMARY voice provider (replacing Fish Audio):
 *   - Instant Voice Clone from ~5s audio sample
 *   - TTS in 47 languages (including Ukrainian)
 *   - Unlimited clone slots
 *   - DELETE /voices/{id} to clean up after dub
 *
 * Pricing (Pro plan $4/mo):
 *   - 100K credits/month
 *   - 15 credits per second of audio
 *   - ~111 minutes of TTS per month
 *
 * Docs: https://docs.cartesia.ai
 */

const CARTESIA_API = "https://api.cartesia.ai";
const CARTESIA_VERSION = "2024-11-13";
const MODEL_ID = "sonic-3";

function getApiKey(): string {
  const key = process.env.CARTESIA_API_KEY;
  if (!key) throw new Error("CARTESIA_API_KEY is not set");
  return key;
}

function headers(): Record<string, string> {
  return {
    "X-API-Key": getApiKey(),
    "Cartesia-Version": CARTESIA_VERSION,
  };
}

// ─── Voice clone management ────────────────────────────────

/**
 * Clone a voice from an audio sample. Returns the voice ID.
 * Uses "similarity" mode for best voice matching from short clips.
 */
export async function cloneVoice(
  audioBuffer: Buffer,
  name: string,
  language: string = "en"
): Promise<string> {
  const fd = new FormData();
  fd.append("clip", new Blob([new Uint8Array(audioBuffer)], { type: "audio/wav" }), "voice.wav");
  fd.append("name", `dubsync-${name.slice(0, 8)}-${Date.now()}`);
  fd.append("language", mapLanguageCode(language));
  fd.append("mode", "similarity");

  const res = await fetch(`${CARTESIA_API}/voices/clone`, {
    method: "POST",
    headers: headers(),
    body: fd,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Cartesia clone failed: ${res.status} ${err.slice(0, 300)}`);
  }

  const rawText = await res.text();
  console.log(`[CARTESIA_CLONE] Raw response: ${rawText.slice(0, 300)}`);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Cartesia clone: invalid JSON response: ${rawText.slice(0, 200)}`);
  }

  const voiceId = (data.id as string) || (data.voice_id as string);
  if (!voiceId) {
    throw new Error(`Cartesia clone: no voice ID in response: ${rawText.slice(0, 200)}`);
  }

  console.log(`[CARTESIA_CLONE] Created voice ${voiceId} (${(audioBuffer.length / 1024).toFixed(0)}KB sample)`);
  return voiceId;
}

/**
 * Delete a cloned voice. Frees the slot. Non-fatal.
 */
export async function deleteVoice(voiceId: string): Promise<void> {
  try {
    const res = await fetch(`${CARTESIA_API}/voices/${voiceId}`, {
      method: "DELETE",
      headers: headers(),
    });
    console.log(`[CARTESIA_CLONE] Deleted voice ${voiceId} (${res.status})`);
  } catch {
    console.warn(`[CARTESIA_CLONE] Failed to delete voice ${voiceId}`);
  }
}

// ─── Text-to-speech ────────────────────────────────────────

/**
 * Generate speech from text using a cloned voice.
 * Returns raw WAV audio buffer.
 */
export async function textToSpeech(
  text: string,
  voiceId: string,
  language: string = "en",
  speed: "slowest" | "slow" | "normal" | "fast" | "fastest" = "normal"
): Promise<Buffer> {
  const body = {
    model_id: MODEL_ID,
    transcript: text,
    voice: { mode: "id", id: voiceId },
    output_format: {
      container: "wav",
      encoding: "pcm_s16le",
      sample_rate: 44100,
    },
    language: mapLanguageCode(language),
    speed,
  };

  const res = await fetch(`${CARTESIA_API}/tts/bytes`, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error(`[CARTESIA_TTS] Failed: ${res.status} voice=${voiceId} lang=${language} text="${text.slice(0, 50)}" err=${err.slice(0, 300)}`);
    throw new Error(`Cartesia TTS failed: ${res.status} ${err.slice(0, 300)}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

// ─── Quota / credits ───────────────────────────────────────

export type CartesiaQuota = {
  credits: number;
  currency: string;
};

/**
 * Get remaining credits from billing API.
 * Requires API key with billing scope.
 */
export async function getCartesiaQuota(): Promise<CartesiaQuota | null> {
  try {
    // Cartesia doesn't have a public billing API yet.
    // Return credits from env var (manually set).
    const credits = Number(process.env.CARTESIA_CREDITS || 0);
    return { credits, currency: "credits" };
  } catch {
    return null;
  }
}

// ─── Language support ──────────────────────────────────────

/**
 * All 47 languages Cartesia Sonic-3 supports.
 */
export const CARTESIA_SUPPORTED_LANGUAGES = [
  "en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh", "ar",
  "nl", "pl", "ru", "sv", "tr", "hi", "el", "fi", "da", "no",
  "bg", "ro", "cs", "hr", "sk", "uk", "hu", "ka", "tl", "ms",
  "vi", "th", "id", "ta", "bn", "te", "gu", "kn", "ml", "mr",
  "pa", "he",
] as const;

export function isCartesiaSupported(langCode: string): boolean {
  return (CARTESIA_SUPPORTED_LANGUAGES as readonly string[]).includes(langCode);
}

/**
 * Map our language codes to Cartesia's expected format.
 * Most are the same ISO 639-1 codes.
 */
function mapLanguageCode(code: string): string {
  // Cartesia uses standard ISO 639-1 codes for most languages
  return code;
}
