/**
 * Fish Audio TTS + voice cloning client.
 *
 * Primary TTS provider for DubSync (replaces ElevenLabs).
 *  - Zero voice clone quota (no monthly voice_add_edit_counter)
 *  - $15/1M chars vs ~$220/1M on ElevenLabs Creator
 *  - #1 on TTS-Arena (80.9% accuracy, Jan 2026)
 *  - Full cycle (create→train→TTS→delete) in ~6-7s
 *  - ~$0.0006 per clone+TTS operation (83x cheaper)
 *
 * Flow per dub:
 *   1. createVoiceModel(audioBuffer) → modelId (fast training ~1.5s)
 *   2. textToSpeech(text, modelId) → WAV buffer (per segment)
 *   3. deleteVoiceModel(modelId) → cleanup
 *
 * Docs: https://docs.fish.audio
 */

const FISH_API = "https://api.fish.audio";

function getApiKey(): string {
  const key = process.env.FISH_AUDIO_API_KEY;
  if (!key) {
    throw new Error(
      "FISH_AUDIO_API_KEY is not set. Sign up at https://fish.audio and add the key to Vercel env."
    );
  }
  return key;
}

// ─── Voice model (clone) management ──────────────────────────

/**
 * Create a voice model from a reference audio sample.
 * Returns the model ID. Training is near-instant with `fast` mode.
 *
 * No monthly quota — unlike ElevenLabs' 95/month voice_add_edit
 * limit, Fish Audio allows unlimited model creation.
 */
export async function createVoiceModel(
  audioBuffer: Buffer,
  name: string
): Promise<string> {
  const key = getApiKey();

  const fd = new FormData();
  fd.append("type", "tts");
  fd.append("title", `dubsync-${name.slice(0, 8)}-${Date.now()}`);
  fd.append("visibility", "private");
  fd.append("train_mode", "fast");
  fd.append(
    "voices",
    new Blob([new Uint8Array(audioBuffer)], { type: "audio/wav" }),
    "voice.wav"
  );
  fd.append("texts", "");

  const res = await fetch(`${FISH_API}/model`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: fd,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(
      `Fish Audio model creation failed: ${res.status} ${err.slice(0, 300)}`
    );
  }

  const data = (await res.json()) as { _id?: string; id?: string };
  const modelId = data._id || data.id;
  if (!modelId) {
    throw new Error(
      `Fish Audio: no model ID in response: ${JSON.stringify(data).slice(0, 200)}`
    );
  }

  console.log(
    `[FISH_CLONE] Created model ${modelId} (${(audioBuffer.length / 1024).toFixed(0)}KB sample)`
  );

  // Wait for training to complete (fast mode = ~1-2s)
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const statusRes = await fetch(`${FISH_API}/model/${modelId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const status = (await statusRes.json()) as { state?: string };
    if (status.state === "trained") {
      console.log(`[FISH_CLONE] Model ${modelId} trained`);
      return modelId;
    }
    if (status.state === "failed") {
      throw new Error(`Fish Audio model training failed for ${modelId}`);
    }
  }

  throw new Error(`Fish Audio model training timed out for ${modelId}`);
}

/**
 * Delete a voice model after TTS is done. Frees the private voice
 * slot so we never accumulate orphaned clones. Non-fatal.
 */
export async function deleteVoiceModel(modelId: string): Promise<void> {
  try {
    const key = getApiKey();
    const res = await fetch(`${FISH_API}/model/${modelId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${key}` },
    });
    console.log(`[FISH_CLONE] Deleted model ${modelId} (${res.status})`);
  } catch {
    console.warn(`[FISH_CLONE] Failed to delete model ${modelId}`);
  }
}

// ─── Text-to-speech ──────────────────────────────────────────

/**
 * Generate speech from text using a cloned voice model.
 * Returns raw WAV audio buffer.
 *
 * If no modelId is provided, Fish Audio uses a default voice.
 */
export async function textToSpeech(
  text: string,
  modelId?: string,
  speed: number = 1.0
): Promise<Buffer> {
  const key = getApiKey();

  const body: Record<string, unknown> = {
    text,
    format: "wav",
    temperature: 0.7,
    top_p: 0.7,
    chunk_length: 300,
    normalize: true,
    latency: "normal",
    prosody: { speed, volume: 0 },
  };

  if (modelId) {
    body.reference_id = modelId;
  }

  const res = await fetch(`${FISH_API}/v1/tts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(
      `Fish Audio TTS failed: ${res.status} ${err.slice(0, 300)}`
    );
  }

  return Buffer.from(await res.arrayBuffer());
}

// ─── Quota / credits ─────────────────────────────────────────

export type FishAudioQuota = {
  credit: number;
  userId: string;
};

/**
 * Fetch current API credit balance. Used by /admin/stats to show
 * the Fish Audio quota card alongside ElevenLabs.
 */
export async function getFishAudioQuota(): Promise<FishAudioQuota | null> {
  try {
    const key = getApiKey();
    const res = await fetch(`${FISH_API}/wallet/self/api-credit`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      credit?: string;
      user_id?: string;
    };
    return {
      credit: parseFloat(data.credit || "0"),
      userId: data.user_id || "",
    };
  } catch {
    return null;
  }
}

// ─── Language support ────────────────────────────────────────

/**
 * Languages officially supported by Fish Audio S1/S2 for voice
 * cloning. For languages NOT in this set, we fall back to
 * ElevenLabs pre-made voices (no clone, no quota impact).
 */
export const FISH_SUPPORTED_LANGUAGES = new Set([
  "en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh",
  "ar", "nl", "pl", "ru",
]);

export function isFishSupported(langCode: string): boolean {
  return FISH_SUPPORTED_LANGUAGES.has(langCode.toLowerCase().split("-")[0]);
}
