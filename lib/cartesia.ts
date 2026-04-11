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
  const mimeType = detectAudioMime(audioBuffer);
  const sendMime = (mimeType === "video/mp4" || mimeType === "application/octet-stream") ? "audio/mpeg" : mimeType;
  const ext = sendMime === "audio/webm" ? "webm" : sendMime === "audio/wav" ? "wav" : "mp3";

  console.log(`[CARTESIA_CLONE] Sample: ${(audioBuffer.length / 1024).toFixed(0)}KB, mime=${mimeType}→${sendMime}, lang=${language}`);

  // Vercel serverless runtime has a broken FormData/File/Blob that corrupts
  // binary data in multipart uploads. Use child_process to exec curl which
  // sends raw bytes correctly from disk.
  const fs = await import("fs");
  const os = await import("os");
  const path = await import("path");
  const { execSync } = await import("child_process");

  let cloneBuffer = audioBuffer;
  let cloneMime = sendMime;
  let cloneExt = ext;

  // If video file, extract audio with ffmpeg-static (Cartesia rejects video files)
  if (mimeType === "video/mp4" || mimeType === "application/octet-stream") {
    try {
      const ffmpegPath = (await import("ffmpeg-static")).default;
      if (ffmpegPath && fs.existsSync(ffmpegPath as string)) {
        const tempIn = path.join(os.tmpdir(), `clone-in-${Date.now()}.mov`);
        const tempOut = path.join(os.tmpdir(), `clone-out-${Date.now()}.wav`);
        fs.writeFileSync(tempIn, audioBuffer);
        execSync(`"${ffmpegPath}" -i "${tempIn}" -vn -acodec pcm_s16le -ar 44100 -ac 1 "${tempOut}" -y`, {
          timeout: 30000, stdio: "pipe",
        });
        cloneBuffer = fs.readFileSync(tempOut);
        cloneMime = "audio/wav";
        cloneExt = "wav";
        console.log(`[CARTESIA_CLONE] Extracted audio via ffmpeg: ${(cloneBuffer.length / 1024).toFixed(0)}KB WAV`);
        try { fs.unlinkSync(tempIn); } catch {}
        try { fs.unlinkSync(tempOut); } catch {}
      } else {
        console.warn(`[CARTESIA_CLONE] ffmpeg binary not found at ${ffmpegPath} — sending video as-is`);
      }
    } catch (err) {
      console.warn(`[CARTESIA_CLONE] ffmpeg extraction failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  // Upload via curl (Vercel Node.js FormData corrupts binary data)
  const tempFile = path.join(os.tmpdir(), `cartesia-clone-${Date.now()}.${cloneExt}`);
  fs.writeFileSync(tempFile, cloneBuffer);

  try {
    const cloneName = `dubsync-${name.slice(0, 8)}-${Date.now()}`;
    const cmd = `curl -s -w "\\n%{http_code}" -X POST "https://api.cartesia.ai/voices/clone" ` +
      `-H "X-API-Key: ${getApiKey()}" ` +
      `-H "Cartesia-Version: ${CARTESIA_VERSION}" ` +
      `-F "clip=@${tempFile};type=${cloneMime}" ` +
      `-F "name=${cloneName}" ` +
      `-F "language=${mapLanguageCode(language)}" ` +
      `-F "mode=similarity"`;

    const rawResult = execSync(cmd, { timeout: 30000 }).toString();
    const lines = rawResult.trim().split("\n");
    const httpCode = lines[lines.length - 1].trim();
    const result = lines.slice(0, -1).join("\n");
    console.log(`[CARTESIA_CLONE] curl HTTP ${httpCode}, response: ${result.slice(0, 200)}`);

    if (!result.trim().startsWith("{")) {
      throw new Error(`Cartesia clone failed: ${result.slice(0, 300)}`);
    }

    const data = JSON.parse(result);
    if (data.error || data.detail) {
      throw new Error(`Cartesia clone failed: ${data.error || data.detail}`);
    }

    const voiceId = data.id;
    if (!voiceId) throw new Error(`Cartesia clone: no voice ID`);

    console.log(`[CARTESIA_CLONE] Created voice ${voiceId}`);
    return voiceId;
  } finally {
    try { fs.unlinkSync(tempFile); } catch {}
  }
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
 */
function mapLanguageCode(code: string): string {
  return code;
}

/**
 * Detect audio MIME type from buffer magic bytes.
 */
function detectAudioMime(buf: Buffer): string {
  if (buf.length < 12) return "application/octet-stream";
  // WebM: starts with 0x1A45DFA3
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return "audio/webm";
  // MP4/M4A/MOV: "ftyp" at offset 4 — use video/mp4 for better compatibility
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) return "video/mp4";
  // WAV: "RIFF" at offset 0
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "audio/wav";
  // OGG: "OggS"
  if (buf[0] === 0x4f && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) return "audio/ogg";
  // FLAC: "fLaC"
  if (buf[0] === 0x66 && buf[1] === 0x4c && buf[2] === 0x61 && buf[3] === 0x43) return "audio/flac";
  // MP3: ID3 tag or sync word
  if ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0)) return "audio/mpeg";
  // Default
  return "application/octet-stream";
}
