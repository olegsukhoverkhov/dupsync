/**
 * One-off script to generate dubs for the landing page "Real results"
 * section. Reads a local mp4, runs the full DubSync pipeline manually
 * (transcribe → translate → clone voice → TTS → lip sync), and uploads
 * everything to Supabase Storage in a public-readable location.
 *
 * Lip sync model: lipsync-2-pro via fal-ai/sync-lipsync/v2 (best quality,
 * $5.01/min — premium tier).
 *
 * Run with:
 *   npx tsx scripts/generate-landing-dubs.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { Agent, setGlobalDispatcher } from "undici";
import * as ai from "../lib/ai";
import { config } from "dotenv";

// Disable undici's 5-minute headers timeout — sync fal.run calls can take 20+ min.
setGlobalDispatcher(
  new Agent({
    headersTimeout: 30 * 60 * 1000, // 30 min
    bodyTimeout: 30 * 60 * 1000,
    connectTimeout: 60 * 1000,
  })
);

config({ path: ".env.local" });

const ORIGINAL_VIDEO_PATH = "/tmp/polish-girl-original.mp4";
const VOICE_SAMPLE_PATH = "/tmp/polish-girl-voice-sample.wav";
const TARGET_LANGUAGES = ["es", "fr", "ja"] as const;
const STORAGE_BUCKET = "landing-assets";
const STORAGE_PREFIX = "polish-girl";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Ensure the public landing bucket exists
async function ensurePublicBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);
  if (!exists) {
    console.log(`[BUCKET] Creating public bucket: ${STORAGE_BUCKET}`);
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
    });
    if (error) throw new Error(`Create bucket failed: ${error.message}`);
  }
}

async function uploadPublic(localPath: string, storagePath: string, contentType: string) {
  const buf = readFileSync(localPath);
  console.log(`[UPLOAD] ${storagePath} (${(buf.length / 1024 / 1024).toFixed(2)}MB)`);
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buf, { contentType, upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function uploadBuffer(buf: Buffer, storagePath: string, contentType: string) {
  console.log(`[UPLOAD] ${storagePath} (${(buf.length / 1024 / 1024).toFixed(2)}MB)`);
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buf, { contentType, upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Run lip sync with the best available fal.ai model:
 * fal-ai/sync-lipsync/v2 with `lipsync-2-pro` ($5.01/min).
 * Uses the synchronous fal.run endpoint (queue.fal.run is currently 503).
 */
async function runBestLipSync(videoUrl: string, audioUrl: string): Promise<string> {
  console.log("[LIP_SYNC] Submitting to fal-ai/sync-lipsync/v2 with lipsync-2-pro (sync)...");

  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch("https://fal.run/fal-ai/sync-lipsync/v2", {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_url: videoUrl,
          audio_url: audioUrl,
          model: "lipsync-2-pro",
          sync_mode: "cut_off",
        }),
        signal: AbortSignal.timeout(28 * 60 * 1000),
      });

      if (res.ok) {
        const result = await res.json();
        const url =
          (typeof result?.video === "string" && result.video) ||
          (typeof result?.video?.url === "string" && result.video.url) ||
          (typeof result?.url === "string" && result.url);
        if (!url) throw new Error(`No video URL in result: ${JSON.stringify(result).slice(0, 300)}`);
        console.log(`[LIP_SYNC] Done: ${url.slice(0, 80)}`);
        return url;
      }

      const err = await res.text();
      const isTransient = res.status >= 500 || res.status === 429;
      console.log(`[LIP_SYNC] attempt ${attempt} failed: ${res.status} ${err.slice(0, 200)}`);
      if (!isTransient || attempt === 8) {
        throw new Error(`fal.ai ${res.status}: ${err.slice(0, 300)}`);
      }
    } catch (e: any) {
      // Network-level errors (GOAWAY, timeout, DNS, etc.)
      const msg = e?.message || String(e);
      console.log(`[LIP_SYNC] attempt ${attempt} network error: ${msg.slice(0, 200)}`);
      if (attempt === 8) throw e;
    }
    const wait = Math.min(30000, 5000 * attempt);
    console.log(`[LIP_SYNC] Waiting ${wait}ms before retry...`);
    await new Promise((r) => setTimeout(r, wait));
  }
  throw new Error("Lip sync failed after retries");
}

async function main() {
  const results: Record<string, string> = {};

  await ensurePublicBucket();

  // 1. Upload original video
  console.log("\n=== STEP 1: Upload original video ===");
  results.original = await uploadPublic(
    ORIGINAL_VIDEO_PATH,
    `${STORAGE_PREFIX}/original.mp4`,
    "video/mp4"
  );

  // 2. Transcribe (Whisper) to get segments + duration
  console.log("\n=== STEP 2: Transcribe ===");
  const videoBuffer = readFileSync(ORIGINAL_VIDEO_PATH);
  const { segments, language } = await ai.transcribe(videoBuffer, "polish-girl-original.mp4", "en");
  console.log(`[TRANSCRIBE] ${segments.length} segments, lang=${language}`);
  segments.slice(0, 3).forEach((s, i) =>
    console.log(`  ${i + 1}. [${s.start.toFixed(2)}-${s.end.toFixed(2)}] ${s.text.slice(0, 60)}`)
  );

  const lastSeg = segments[segments.length - 1];
  const durationSec = Math.ceil(lastSeg.end + 1);
  console.log(`[TRANSCRIBE] Total duration: ${durationSec}s`);

  // 3. Clone voice ONCE (reuse for all 3 languages)
  console.log("\n=== STEP 3: Clone voice ===");
  const voiceSample = readFileSync(VOICE_SAMPLE_PATH);
  const voiceId = await ai.cloneVoice(voiceSample, "landing-polish", "wav");
  console.log(`[VOICE] Cloned: ${voiceId}`);

  // Ensure we ALWAYS clean up the cloned voice on success or failure
  const cleanup = async () => {
    try {
      await ai.deleteClonedVoice(voiceId);
      console.log(`[VOICE] Cleaned up ${voiceId}`);
    } catch (e) {
      console.error(`[VOICE] Failed to delete ${voiceId}:`, e);
    }
  };

  // Check which languages are already done (skip them)
  const { data: existingFiles } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(STORAGE_PREFIX);
  const existingNames = new Set((existingFiles || []).map((f) => f.name));
  console.log(`[SKIP] Found existing files: ${[...existingNames].join(", ")}`);

  try {
  // 4. For each target language: translate, TTS, upload audio, lip sync
  for (const targetLang of TARGET_LANGUAGES) {
    const outputName = `dubbed-${targetLang}.mp4`;
    if (existingNames.has(outputName)) {
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`${STORAGE_PREFIX}/${outputName}`);
      results[targetLang] = data.publicUrl;
      console.log(`\n=== STEP 4.${targetLang.toUpperCase()}: SKIP (already exists) ===`);
      continue;
    }
    console.log(`\n=== STEP 4.${targetLang.toUpperCase()}: Translate + TTS + Lip Sync ===`);

    // Translate
    const langName = { es: "Spanish", fr: "French", ja: "Japanese" }[targetLang];
    const translated = await ai.translate(segments, "English", langName);
    console.log(`[TRANSLATE] ${translated.length} segments to ${langName}`);

    // TTS (uses two-pass time alignment for short videos automatically)
    const segmentsWithTiming = translated.map((seg, i) => ({
      ...seg,
      start: segments[i]?.start ?? seg.start,
      end: segments[i]?.end ?? seg.end,
    }));
    const { wav: audioBuffer } = await ai.generateTimedAudio(segmentsWithTiming, voiceId, durationSec);
    console.log(`[TTS] Generated ${(audioBuffer.length / 1024).toFixed(0)}KB audio`);

    // Upload audio (temp — needed for fal.ai to download)
    const audioUrl = await uploadBuffer(
      audioBuffer,
      `${STORAGE_PREFIX}/audio-${targetLang}.wav`,
      "audio/wav"
    );

    // Lip sync with the BEST model
    const syncedVideoUrl = await runBestLipSync(results.original, audioUrl);

    // Download the synced video and upload to our storage (so we own the URL)
    console.log(`[LIP_SYNC] Downloading synced video...`);
    const syncedRes = await fetch(syncedVideoUrl);
    const syncedBuffer = Buffer.from(await syncedRes.arrayBuffer());
    results[targetLang] = await uploadBuffer(
      syncedBuffer,
      `${STORAGE_PREFIX}/dubbed-${targetLang}.mp4`,
      "video/mp4"
    );
  }

  } finally {
    await cleanup();
  }

  // Output URLs
  console.log("\n=== ALL DONE ===");
  console.log(JSON.stringify(results, null, 2));
  writeFileSync("/tmp/landing-dub-urls.json", JSON.stringify(results, null, 2));
  console.log("\nURLs saved to /tmp/landing-dub-urls.json");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
