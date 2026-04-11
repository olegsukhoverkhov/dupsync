import { createServiceClient } from "./supabase/server";
import * as ai from "./ai";
import * as fish from "./fish-audio";
import * as cartesia from "./cartesia";
import { LANGUAGE_MAP } from "./supabase/constants";
import { getQualityTier } from "./quality-tiers";
import { toSrt, toVtt, rechunkSegments } from "./subtitles";
import type { PlanType, TranscriptSegment } from "./supabase/types";


function log(dubId: string, msg: string) {
  console.log(`[DUB:${dubId.slice(0, 8)}] ${msg}`);
}

/**
 * Extract audio from a video file server-side using fal.ai ffmpeg.
 * Saves the extracted WAV to Supabase storage alongside the video.
 * Called during transcription so audio is always ready for voice cloning.
 */
async function ensureExtractedAudio(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  videoPath: string
): Promise<void> {
  const videoDir = videoPath.split("/").slice(0, -1).join("/");
  const audioPath = `${videoDir}/extracted-audio.wav`;

  // Check if already exists
  const { data: existing } = await supabase.storage.from("videos").list(videoDir, { search: "extracted-audio" });
  if (existing && existing.length > 0) return;

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    console.warn("[EXTRACT_AUDIO] FAL_KEY not set, skipping audio extraction");
    return;
  }

  try {
    // Get signed URL for the video
    const { data: signed } = await supabase.storage.from("videos").createSignedUrl(videoPath, 600);
    if (!signed?.signedUrl) return;

    // Submit ffmpeg job to fal.ai queue
    const submitRes = await fetch("https://queue.fal.run/fal-ai/ffmpeg-api", {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_files: [{ url: signed.signedUrl, filename: "input.mov" }],
        command: "-i input.mov -vn -acodec pcm_s16le -ar 44100 -ac 1 output.wav",
        output_files: ["output.wav"],
      }),
    });

    if (!submitRes.ok) {
      console.warn(`[EXTRACT_AUDIO] fal.ai submit failed: ${submitRes.status}`);
      return;
    }

    const submitData = (await submitRes.json()) as { request_id?: string; status_url?: string };
    if (!submitData.request_id) {
      console.warn("[EXTRACT_AUDIO] No request_id");
      return;
    }

    // Poll for completion (max 30s)
    let audioUrl: string | null = null;
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(
        `https://queue.fal.run/fal-ai/ffmpeg-api/requests/${submitData.request_id}/status`,
        { headers: { Authorization: `Key ${falKey}` } }
      );
      if (!statusRes.ok) continue;
      const status = (await statusRes.json()) as { status?: string };

      if (status.status === "COMPLETED") {
        // Get result
        const resultRes = await fetch(
          `https://queue.fal.run/fal-ai/ffmpeg-api/requests/${submitData.request_id}`,
          { headers: { Authorization: `Key ${falKey}` } }
        );
        if (resultRes.ok) {
          const result = (await resultRes.json()) as { output_files?: Array<{ url: string }> };
          audioUrl = result.output_files?.[0]?.url || null;
        }
        break;
      }
      if (status.status === "FAILED") break;
    }

    if (!audioUrl) {
      console.warn("[EXTRACT_AUDIO] No audio URL from ffmpeg result");
      return;
    }

    // Download extracted audio
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) return;
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());

    // Upload to storage
    await supabase.storage.from("videos").upload(audioPath, audioBuffer, {
      contentType: "audio/wav",
      upsert: true,
    });

    console.log(`[EXTRACT_AUDIO] Saved ${(audioBuffer.length / 1024).toFixed(0)}KB to ${audioPath}`);
  } catch (err) {
    console.warn(`[EXTRACT_AUDIO] Failed: ${err instanceof Error ? err.message : err}`);
  }
}

// ── Voice clone cache ────────────────────────────────────────
// Shared across parallel dubs of the same project so we clone once.
// Cleaned up after all dubs complete in the /api/dub route.
type VoiceCloneEntry = {
  voiceId: string;
  voiceSource: "cloned" | "premade";
  provider: "cartesia" | "fish" | "premade";
  promise: Promise<void> | undefined;
};
const voiceCloneCache = new Map<string, VoiceCloneEntry>();

/**
 * Get or create a voice clone for a project. Cascade:
 *   1. Cartesia (primary — 47 languages, best quality)
 *   2. Fish Audio (fallback — 13 languages)
 *   3. ElevenLabs premade voice (last resort)
 *
 * First caller creates the clone, concurrent callers await the same promise.
 */
async function getOrCreateVoiceClone(
  projectId: string,
  sampleBuffer: Buffer | null,
  dubId: string,
  fallbackVoiceId: string,
  originalLanguage: string,
  supabase: Awaited<ReturnType<typeof createServiceClient>>
): Promise<{ voiceId: string; voiceSource: "cloned" | "premade"; provider: "cartesia" | "fish" | "premade" }> {
  // Already cached (or in-progress)
  const cached = voiceCloneCache.get(projectId);
  if (cached) {
    if (cached.promise) await cached.promise;
    log(dubId, `Voice clone reused from cache: ${cached.provider} (${cached.voiceId.slice(0, 12)})`);
    return { voiceId: cached.voiceId, voiceSource: cached.voiceSource, provider: cached.provider };
  }

  // First caller — create the clone
  let resolve: () => void;
  const promise = new Promise<void>((r) => { resolve = r; });
  const entry: VoiceCloneEntry = {
    voiceId: fallbackVoiceId,
    voiceSource: "premade",
    provider: "premade",
    promise,
  };
  voiceCloneCache.set(projectId, entry);

  if (sampleBuffer && sampleBuffer.length > 1000) {
    // Try Cartesia with retry (2 attempts with 3s delay)
    const cartesiaKey = process.env.CARTESIA_API_KEY;
    log(dubId, `Voice clone: sample=${(sampleBuffer.length / 1024).toFixed(0)}KB, cartesiaKey=${cartesiaKey ? "set" : "MISSING"}, lang=${originalLanguage}`);
    if (cartesiaKey) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          if (attempt > 1) {
            log(dubId, `Cartesia clone retry ${attempt}/2...`);
            await new Promise((r) => setTimeout(r, 3000));
          }
          const voiceId = await cartesia.cloneVoice(sampleBuffer, dubId, originalLanguage);
          entry.voiceId = voiceId;
          entry.voiceSource = "cloned";
          entry.provider = "cartesia";
          log(dubId, `Voice cloned via Cartesia (shared): ${voiceId}`);
          break;
        } catch (err) {
          const msg = err instanceof Error ? err.message : "unknown";
          log(dubId, `Cartesia clone attempt ${attempt} failed: ${msg}`);
          if (attempt === 2) {
            log(dubId, `Cartesia clone failed after 2 attempts`);
          }
        }
      }
    }

    if (entry.provider === "premade") {
      log(dubId, `Voice clone failed — marking dub as error instead of using premade`);
    }
  } else {
    log(dubId, `No usable voice sample (${sampleBuffer?.length || 0} bytes) — marking as error`);
  }

  entry.promise = undefined;
  resolve!();
  return { voiceId: entry.voiceId, voiceSource: entry.voiceSource, provider: entry.provider };
}

/**
 * Clean up voice clone cache for a project. Call after all dubs complete.
 */
export async function cleanupVoiceClone(projectId: string): Promise<void> {
  const cached = voiceCloneCache.get(projectId);
  if (cached && cached.voiceSource === "cloned") {
    if (cached.provider === "cartesia") {
      await cartesia.deleteVoice(cached.voiceId);
      log(projectId, `Cartesia voice deleted: ${cached.voiceId}`);
    } else if (cached.provider === "fish") {
      await fish.deleteVoiceModel(cached.voiceId);
      log(projectId, `Fish Audio model deleted: ${cached.voiceId}`);
    }
  }
  voiceCloneCache.delete(projectId);
}

export async function runTranscription(projectId: string) {
  const supabase = await createServiceClient();

  try {
    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Starting transcription`);

    await supabase
      .from("projects")
      .update({ status: "transcribing", error_message: null })
      .eq("id", projectId);

    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!project?.original_video_url) {
      throw new Error("No video URL found");
    }

    // Extract audio server-side for voice cloning (non-blocking)
    ensureExtractedAudio(supabase, project.original_video_url).catch((e) =>
      console.warn(`[TRANSCRIBE:${projectId.slice(0, 8)}] Audio extraction failed:`, e)
    );

    const ext = (project.original_video_url.split(".").pop() || "mp4").toLowerCase();
    const languageHint = project.original_language !== "auto" ? project.original_language : undefined;

    // Download original video
    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Downloading: ${project.original_video_url}`);
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("videos")
      .download(project.original_video_url);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download video: ${downloadError?.message}`);
    }

    const videoBuffer = Buffer.from(await fileData.arrayBuffer());
    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Video: ${(videoBuffer.byteLength / 1024 / 1024).toFixed(2)}MB, ext=${ext}`);

    // Transcribe using AssemblyAI (primary) or Whisper (fallback)
    // AssemblyAI accepts ALL formats including iPhone HEVC MOV
    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Calling transcription API (ext=${ext}, lang=${languageHint || "auto"})`);
    const { segments: rawSegments, language } = await ai.transcribe(videoBuffer, `video.${ext}`, languageHint);

    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Raw transcription done: ${rawSegments.length} segments, language=${language}`);

    // ── Re-chunk into tight 2–3 second cues ──────────────────
    // ASR providers (Whisper / AssemblyAI) return segments up to
    // 15 seconds long, which is way too coarse for subtitles:
    // TTS can't match the phrasing, captions span multiple lines,
    // and a viewer reading along can't tell which word is being
    // spoken at any given moment.
    //
    // Re-chunking here means every downstream stage — translation,
    // TTS, SRT/VTT, burned-in captions — operates on the same
    // fine-grained 2–3 second boundaries. Result: the audio a
    // viewer hears and the caption they read start and end at
    // the same timestamps, word-for-word.
    const segments = rechunkSegments(rawSegments, {
      maxChars: 80,
      maxSeconds: 3,
      minSeconds: 1,
    });
    console.log(
      `[TRANSCRIBE:${projectId.slice(0, 8)}] Re-chunked: ${rawSegments.length} \u2192 ${segments.length} segments (target \u22643s / \u226480 chars each)`
    );

    // Calculate duration from last segment end time + buffer.
    // Whisper segments don't capture trailing silence, so add 1s buffer.
    const rawEnd = segments.length > 0 ? segments[segments.length - 1].end : 0;
    const durationSeconds = Math.ceil(rawEnd + 1);

    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Duration: ${durationSeconds}s`);

    await supabase
      .from("projects")
      .update({
        status: "ready",
        transcript: segments,
        original_language: language,
        duration_seconds: durationSeconds,
      })
      .eq("id", projectId);
  } catch (error) {
    console.error(`[TRANSCRIBE:${projectId.slice(0, 8)}] FAILED:`, error);
    // Classified errors carry a user-facing message; everything else
    // falls back to a generic string so the UI always has something to
    // render instead of a bare "error" status.
    const userMessage =
      error instanceof ai.TranscriptionError
        ? error.userMessage
        : error instanceof Error
          ? `Transcription failed: ${error.message.slice(0, 300)}`
          : "Transcription failed with an unknown error.";
    await supabase
      .from("projects")
      .update({ status: "error", error_message: userMessage })
      .eq("id", projectId);
  }
}

// Stage 1: Translate + TTS + upload audio (~30-60s per language).
//
// Wraps the actual work in an outer retry loop (up to 2 attempts) on
// transient errors. The internal API calls (translate, cloneVoice,
// ttsNatural) ALSO have their own per-call retries, so a single
// transient hiccup is recovered without coming up to this layer. The
// outer retry catches cases where the whole stage fails partway and
// needs to start over.
export async function runDubbingAudio(dubId: string) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();

  const MAX_ATTEMPTS = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      if (attempt > 1) {
        log(dubId, `Stage 1 retry ${attempt}/${MAX_ATTEMPTS}`);
        // Reset progress + status before retrying so the UI shows we
        // restarted from the beginning of Stage 1.
        await supabase
          .from("dubs")
          .update({ status: "translating", progress: 5, error_message: null })
          .eq("id", dubId);
        // Small backoff so transient API issues have time to resolve
        await new Promise((r) => setTimeout(r, 2000));
      }
      await runDubbingAudioOnce(dubId, dub, supabase);
      return; // success
    } catch (error) {
      lastError = error;
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      const transient = ai.isTransientError(error);
      log(
        dubId,
        `Stage 1 attempt ${attempt} failed (${transient ? "transient" : "permanent"}): ${errMsg}`
      );
      if (!transient) break; // permanent — don't retry
    }
  }

  // All attempts failed — record the final error. Quota exhaustion
  // gets a user-friendly message because the raw ElevenLabs API
  // response is useless ("voice_add_edit_limit_reached") and also
  // a lot less scary to read as plain English.
  let errMsg = lastError instanceof Error ? lastError.message : "Unknown error";
  if (lastError instanceof ai.ElevenLabsQuotaExhaustedError) {
    errMsg =
      "Voice cloning is temporarily unavailable — our ElevenLabs monthly " +
      "quota was reached. Dubbing will resume automatically at the next " +
      "billing cycle. Contact support if you need this dub sooner.";
  }
  log(dubId, `Stage 1 FAILED after retries: ${errMsg}`);
  await supabase
    .from("dubs")
    .update({ status: "error", error_message: errMsg })
    .eq("id", dubId);

  // Refund credits for this failed dub
  const project = (dub as Record<string, unknown>)?.projects as Record<string, unknown> | null;
  const userId = (project?.user_id || (dub as Record<string, unknown>)?.user_id) as string | undefined;
  if (userId && dub) {
    await refundDubCredits(supabase, userId, dub.project_id as string, dubId);
  }

  await checkProjectComplete(supabase, dub?.project_id, dubId);
}

// Inner Stage 1 worker — runs the actual TTS + upload pipeline once.
// Throws on any failure so the outer wrapper can decide whether to retry.
async function runDubbingAudioOnce(
  dubId: string,
  dub: Record<string, unknown> | null,
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  log(dubId, "Stage 1: Translate + TTS");
  if (!dub) throw new Error("Dub not found");

    const project = (dub as Record<string, unknown>).projects as Record<string, unknown>;
    if (!project?.transcript) throw new Error("No transcript found");

    const transcript = project.transcript as { start: number; end: number; text: string }[];
    const sourceLang = LANGUAGE_MAP[project.original_language as string] || "English";
    const targetLanguageCode = dub.target_language as string;
    const targetLang = LANGUAGE_MAP[targetLanguageCode] || targetLanguageCode;

    // Translate
    await supabase.from("dubs").update({ status: "translating", progress: 10 }).eq("id", dubId);
    const translatedSegments = await ai.translate(transcript, sourceLang, targetLang);
    log(dubId, `Translation done: ${translatedSegments.length} segments`);
    await supabase.from("dubs").update({ translated_transcript: translatedSegments, progress: 30 }).eq("id", dubId);

    // ── Voice cloning via Fish Audio ─────────────────────────
    //
    // Primary provider: Fish Audio (all plans, free + paid).
    //  - Zero monthly clone quota (no voice_add_edit_counter)
    //  - $0.0006 per clone+TTS (83x cheaper than ElevenLabs)
    //  - ~6s full cycle (create→train→TTS→delete)
    //  - Unlimited model creation, 10 concurrent private slots
    //
    // Fallback: ElevenLabs pre-made voices (for languages Fish
    // doesn't support, or if Fish Audio API is down).
    //
    // Flow: download voice sample → Fish Audio createVoiceModel
    // → use model ID for per-segment TTS → deleteVoiceModel.
    // The model exists only for the duration of this dub.
    await supabase.from("dubs").update({ status: "generating_voice", progress: 35 }).eq("id", dubId);

    // Look up the dub owner's plan — needed downstream for the
    // lipsync quality tier.
    let ownerPlan: PlanType = "free";
    const ownerUserId = project.user_id as string | undefined;
    if (ownerUserId) {
      const { data: ownerProfile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", ownerUserId)
        .single();
      if (ownerProfile?.plan) ownerPlan = ownerProfile.plan as PlanType;
    }
    log(dubId, `Owner plan=${ownerPlan}`);

    // Voice cloning: use shared cache so parallel dubs reuse the same clone
    const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");
    const audioCandidates = ["extracted-audio.wav", "extracted-audio.webm", "extracted-audio.mp4", "voice-sample.wav"];
    let sampleBuffer: Buffer | null = null;

    for (const candidate of audioCandidates) {
      try {
        const { data, error } = await supabase.storage.from("videos").download(`${videoDir}/${candidate}`);
        if (data && !error) {
          sampleBuffer = Buffer.from(await data.arrayBuffer());
          log(dubId, `Found voice sample: ${candidate} (${(sampleBuffer.length / 1024).toFixed(0)}KB)`);
          break;
        }
      } catch {
        continue;
      }
    }

    if (!sampleBuffer || sampleBuffer.length < 1000) {
      try {
        const { data: videoData } = await supabase.storage.from("videos").download(project.original_video_url as string);
        if (videoData) {
          const videoBuffer = Buffer.from(await videoData.arrayBuffer());
          if (videoBuffer.length < 11 * 1024 * 1024) {
            sampleBuffer = videoBuffer;
            log(dubId, `Using video file as voice sample (${(videoBuffer.length / 1024 / 1024).toFixed(1)}MB)`);
          }
        }
      } catch {
        log(dubId, `Could not download video for voice sample`);
      }
    }

    const fallbackVoiceId = ai.getMultilingualVoice(project.id as string);
    const clone = await getOrCreateVoiceClone(
      project.id as string, sampleBuffer, dubId, fallbackVoiceId,
      project.original_language as string || "en", supabase
    );
    let voiceId = clone.voiceId;
    let voiceSource: "cloned" | "premade" = clone.voiceSource;
    const cloneProvider = clone.provider;

    // Never use premade voice — if clone failed, throw error so user can retry
    if (cloneProvider === "premade") {
      throw new Error(
        "Voice cloning failed. Please try again — if the issue persists, " +
        "try uploading an MP4 video (not MOV) with at least 10 seconds of clear speech."
      );
    }

    // For backward compat: fishModelId is set when provider is fish
    const fishModelId = cloneProvider === "fish" ? voiceId : "";

    // Per-segment TTS with exact timing matching original video
    const videoDuration = (project.duration_seconds as number) || 0;
    log(dubId, `TTS: ${translatedSegments.length} segments, video=${videoDuration}s`);

    // Use original transcript timestamps for segment placement
    const segmentsWithTiming = translatedSegments.map((seg, i) => ({
      ...seg,
      start: transcript[i]?.start ?? seg.start,
      end: transcript[i]?.end ?? seg.end,
    }));

    let audioBuffer: Buffer;
    let newAudioDuration: number;

    if (cloneProvider === "cartesia") {
      // ── Cartesia TTS path (primary) ────────────────────────
      log(dubId, `Using Cartesia TTS (voice=${voiceId}, lang=${targetLanguageCode}, segments=${segmentsWithTiming.length})`);
      let firstError = "";
      const segmentBuffers: Buffer[] = [];
      for (let i = 0; i < segmentsWithTiming.length; i++) {
        const seg = segmentsWithTiming[i];
        if (!seg.text.trim()) continue;
        try {
          const buf = await cartesia.textToSpeech(seg.text, voiceId, targetLanguageCode);
          segmentBuffers.push(buf);
          log(dubId, `  Segment ${i + 1}/${segmentsWithTiming.length}: ${(buf.length / 1024).toFixed(0)}KB`);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "unknown";
          log(dubId, `  Segment ${i + 1} Cartesia TTS failed: ${errMsg}`);
          if (!firstError) firstError = errMsg;
          segmentBuffers.push(Buffer.alloc(0));
        }
      }

      // Concatenate WAV segments with crossfade to eliminate clicks
      const nonEmpty = segmentBuffers.filter((b) => b.length > 44);
      if (nonEmpty.length === 0) throw new Error(`All Cartesia TTS segments failed. First error: ${firstError}`);

      const firstHeader = nonEmpty[0].subarray(0, 44);
      const sampleRate = firstHeader.readUInt32LE(24);
      const channels = firstHeader.readUInt16LE(22);
      const bitsPerSample = firstHeader.readUInt16LE(34);
      const bytesPerSample = bitsPerSample / 8;

      // Apply fade-in/fade-out to each segment to prevent clicks at joins
      const fadeSamples = Math.min(Math.floor(sampleRate * 0.005), 220); // 5ms fade
      const pcmChunks: Buffer[] = [];
      for (const buf of nonEmpty) {
        const pcm = Buffer.from(buf.subarray(44)); // copy so we can modify
        const totalSamples = Math.floor(pcm.length / (bytesPerSample * channels));
        if (totalSamples > fadeSamples * 2 && bytesPerSample === 2) {
          // Fade-in
          for (let i = 0; i < fadeSamples; i++) {
            const gain = i / fadeSamples;
            for (let ch = 0; ch < channels; ch++) {
              const offset = (i * channels + ch) * 2;
              const sample = pcm.readInt16LE(offset);
              pcm.writeInt16LE(Math.round(sample * gain), offset);
            }
          }
          // Fade-out
          for (let i = 0; i < fadeSamples; i++) {
            const gain = i / fadeSamples;
            const sampleIdx = totalSamples - 1 - i;
            for (let ch = 0; ch < channels; ch++) {
              const offset = (sampleIdx * channels + ch) * 2;
              const sample = pcm.readInt16LE(offset);
              pcm.writeInt16LE(Math.round(sample * gain), offset);
            }
          }
        }
        pcmChunks.push(pcm);
      }
      const pcmData = Buffer.concat(pcmChunks);
      const dataSize = pcmData.length;
      const header = Buffer.alloc(44);
      header.write("RIFF", 0);
      header.writeUInt32LE(36 + dataSize, 4);
      header.write("WAVE", 8);
      header.write("fmt ", 12);
      header.writeUInt32LE(16, 16);
      header.writeUInt16LE(1, 20);
      header.writeUInt16LE(channels, 22);
      header.writeUInt32LE(sampleRate, 24);
      header.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);
      header.writeUInt16LE(channels * (bitsPerSample / 8), 32);
      header.writeUInt16LE(bitsPerSample, 34);
      header.write("data", 36);
      header.writeUInt32LE(dataSize, 40);

      audioBuffer = Buffer.concat([header, pcmData]);
      newAudioDuration = dataSize / (sampleRate * channels * (bitsPerSample / 8));
      log(dubId, `Cartesia TTS done: ${nonEmpty.length} segments, ${newAudioDuration.toFixed(2)}s`);

    } else if (fishModelId) {
      // ── Fish Audio TTS path (fallback) ─────────────────────
      log(dubId, `Using Fish Audio TTS (model=${fishModelId.slice(0, 8)})`);
      const segmentBuffers: Buffer[] = [];
      for (let i = 0; i < segmentsWithTiming.length; i++) {
        const seg = segmentsWithTiming[i];
        if (!seg.text.trim()) continue;
        try {
          const buf = await fish.textToSpeech(seg.text, fishModelId);
          segmentBuffers.push(buf);
          log(dubId, `  Segment ${i + 1}/${segmentsWithTiming.length}: ${(buf.length / 1024).toFixed(0)}KB`);
        } catch (err) {
          log(dubId, `  Segment ${i + 1} TTS failed: ${err instanceof Error ? err.message : "unknown"}`);
          // Generate silence placeholder so timing stays correct
          segmentBuffers.push(Buffer.alloc(0));
        }
      }

      // Concatenate all segment WAV buffers into one.
      // Fish Audio returns complete WAV files per segment. We
      // strip the 44-byte WAV header from segments 2+ and
      // concatenate the raw PCM data, then write a new header.
      const pcmChunks: Buffer[] = [];
      let sampleRate = 44100;
      let channels = 1;
      let bitsPerSample = 16;

      for (let i = 0; i < segmentBuffers.length; i++) {
        const buf = segmentBuffers[i];
        if (buf.length < 44) continue; // skip empty/failed segments
        if (i === 0 && buf.length >= 44) {
          // Parse WAV header from first segment to get format info
          // RIFF header: bytes 22-23 = channels, 24-27 = sample rate,
          // 34-35 = bits per sample
          channels = buf.readUInt16LE(22);
          sampleRate = buf.readUInt32LE(24);
          bitsPerSample = buf.readUInt16LE(34);
        }
        // Find "data" chunk — skip past header
        let dataStart = 44; // standard WAV header size
        // Look for "data" marker in case of non-standard header
        for (let j = 12; j < Math.min(buf.length - 4, 200); j++) {
          if (
            buf[j] === 0x64 && // 'd'
            buf[j + 1] === 0x61 && // 'a'
            buf[j + 2] === 0x74 && // 't'
            buf[j + 3] === 0x61 // 'a'
          ) {
            dataStart = j + 8; // skip "data" + 4-byte size
            break;
          }
        }
        pcmChunks.push(buf.subarray(dataStart));
      }

      const pcmData = Buffer.concat(pcmChunks);
      const dataSize = pcmData.length;
      const headerSize = 44;
      const wavHeader = Buffer.alloc(headerSize);
      wavHeader.write("RIFF", 0);
      wavHeader.writeUInt32LE(dataSize + 36, 4);
      wavHeader.write("WAVE", 8);
      wavHeader.write("fmt ", 12);
      wavHeader.writeUInt32LE(16, 16); // fmt chunk size
      wavHeader.writeUInt16LE(1, 20); // PCM format
      wavHeader.writeUInt16LE(channels, 22);
      wavHeader.writeUInt32LE(sampleRate, 24);
      wavHeader.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);
      wavHeader.writeUInt16LE(channels * (bitsPerSample / 8), 32);
      wavHeader.writeUInt16LE(bitsPerSample, 34);
      wavHeader.write("data", 36);
      wavHeader.writeUInt32LE(dataSize, 40);

      audioBuffer = Buffer.concat([wavHeader, pcmData]);
      newAudioDuration = dataSize / (sampleRate * channels * (bitsPerSample / 8));
      log(dubId, `Fish Audio TTS done: ${segmentBuffers.length} segments, ${newAudioDuration.toFixed(2)}s`);

      // Voice model cleanup is now handled by cleanupVoiceClone()
      // after ALL parallel dubs complete (called from /api/dub route).
    } else {
      // ── ElevenLabs fallback path ──────────────────────────
      // Used when Fish Audio clone failed or no voice sample.
      log(dubId, `Using ElevenLabs TTS (premade voice=${voiceId.slice(0, 8)})`);
      try {
        const out = await ai.generateTimedAudio(segmentsWithTiming, voiceId, videoDuration);
        audioBuffer = out.wav;
        newAudioDuration = out.durationSec;
      } catch (err) {
        if (err instanceof ai.ElevenLabsVoicePermissionError) {
          log(dubId, `ElevenLabs permission error — retrying with different premade voice`);
          voiceId = ai.getMultilingualVoice(project.id as string);
          voiceSource = "premade";
          const out = await ai.generateTimedAudio(segmentsWithTiming, voiceId, videoDuration);
          audioBuffer = out.wav;
          newAudioDuration = out.durationSec;
        } else {
          throw err;
        }
      }
    }
    log(dubId, `TTS done: audio=${newAudioDuration.toFixed(2)}s (was ${videoDuration}s)`);

    // Upload audio
    const audioPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-audio.wav`;
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(audioPath, audioBuffer, { contentType: "audio/wav", upsert: true });
    if (uploadError) throw new Error(`Audio upload failed: ${uploadError.message}`);

    // ── Phase 1: always-on subtitle files ──────────────────────
    // Generate .srt and .vtt from the translated segments (with the
    // same timing we used for TTS) and upload alongside the audio.
    // These are downloadable artifacts for users who want to ship
    // subs to YouTube / TikTok / their own player. Failure here is
    // non-fatal — we still mark the audio as ready.
    let srtUploadPath: string | null = null;
    let vttUploadPath: string | null = null;
    try {
      const srtText = toSrt(segmentsWithTiming as TranscriptSegment[]);
      const vttText = toVtt(segmentsWithTiming as TranscriptSegment[]);
      const srtPath = `${project.user_id}/${project.id}/${dub.id}/subtitles.srt`;
      const vttPath = `${project.user_id}/${project.id}/${dub.id}/subtitles.vtt`;

      const [{ error: srtErr }, { error: vttErr }] = await Promise.all([
        supabase.storage
          .from("videos")
          .upload(srtPath, Buffer.from(srtText, "utf-8"), {
            contentType: "application/x-subrip",
            upsert: true,
          }),
        supabase.storage
          .from("videos")
          .upload(vttPath, Buffer.from(vttText, "utf-8"), {
            contentType: "text/vtt",
            upsert: true,
          }),
      ]);
      if (!srtErr) srtUploadPath = srtPath;
      if (!vttErr) vttUploadPath = vttPath;
      if (srtErr || vttErr) {
        log(
          dubId,
          `Subtitle upload warning: srt=${srtErr?.message || "ok"} vtt=${vttErr?.message || "ok"}`
        );
      } else {
        log(dubId, "Subtitle files uploaded (.srt + .vtt)");
      }
    } catch (subsErr) {
      log(
        dubId,
        `Subtitle generation failed (non-fatal): ${
          subsErr instanceof Error ? subsErr.message : "unknown"
        }`
      );
    }

    // Mark as audio_ready — user can already download audio.
    // voice_source lets the UI distinguish cloned-vs-premade so
    // free-plan dubs can render the "similar voice · upgrade for
    // exact cloning" chip on the project detail page.
    await supabase.from("dubs").update({
      status: "audio_ready",
      progress: 80,
      dubbed_video_url: audioPath,
      srt_url: srtUploadPath,
      vtt_url: vttUploadPath,
      voice_source: voiceSource,
    }).eq("id", dubId);

    log(dubId, `Stage 1 COMPLETE — audio ready (voice=${voiceSource})`);

    // Immediately trigger Stage 2 (lip sync) server-side so it doesn't
    // depend on the client being on the project page.
    runLipSync(dubId).catch((err) => {
      log(dubId, `Stage 2 auto-trigger failed: ${err instanceof Error ? err.message : "unknown"} — cron will retry`);
    });

  // Clean up cloned voice
  if (voiceId && !["FGY2WhTYpPnrIDTdsKH5", "EXAVITQu4vr4xnSDxMaL", "XrExE9yKIg1WjnnlVkGX"].includes(voiceId)) {
    await ai.deleteClonedVoice(voiceId);
  }
}

// Stage 2: Lip sync — webhook-based async flow.
//
// Submits the job to fal.ai with a webhook URL and returns immediately.
// The Vercel function exits in <2 seconds. fal.ai POSTs the result to
// /api/webhooks/fal-lipsync when the job finishes (success or failure).
// The webhook handler downloads the video, uploads to Supabase, and
// marks the dub as done.
//
// This avoids the 300s Vercel function timeout entirely — dubs of any
// length now work, and we don't burn function-seconds while polling.
export async function runLipSync(dubId: string) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();

  if (!dub || !dub.dubbed_video_url) return;

  // Skip if already past audio_ready (e.g. client also triggered)
  const dubStatus = (dub as Record<string, unknown>).status as string;
  if (dubStatus !== "audio_ready") {
    log(dubId, `Stage 2 skipped — status is ${dubStatus}, not audio_ready`);
    return;
  }

  const project = (dub as Record<string, unknown>).projects as Record<string, unknown>;
  if (!project) return;

  try {
    log(dubId, "Stage 2: Lip sync (async webhook)");
    await supabase.from("dubs").update({ status: "lip_syncing", progress: 82 }).eq("id", dubId);

    const audioPath = dub.dubbed_video_url;
    const { data: videoSigned } = await supabase.storage
      .from("videos")
      .createSignedUrl(project.original_video_url as string, 3600 * 4);
    const { data: audioSigned } = await supabase.storage
      .from("videos")
      .createSignedUrl(audioPath, 3600 * 4);

    if (!videoSigned?.signedUrl || !audioSigned?.signedUrl) {
      throw new Error("Failed to create signed URLs");
    }

    // Look up the owner's plan to route to the correct lip sync model.
    let plan: PlanType = "free";
    const userId = project.user_id as string | undefined;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", userId)
        .single();
      if (profile?.plan) plan = profile.plan as PlanType;
    }
    const tier = getQualityTier(plan);
    log(dubId, `Plan=${plan}, tier=${tier.label}, model=${tier.lipSyncModel}${tier.lipSyncModelVersion ? ` (${tier.lipSyncModelVersion})` : ""}`);

    // Submit job to fal.ai with webhook callback (no polling)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dubsync.app";
    const webhookUrl = `${baseUrl}/api/webhooks/fal-lipsync?dubId=${dubId}&attempt=1`;
    const { requestId, model } = await ai.submitLipSyncJob(
      videoSigned.signedUrl,
      audioSigned.signedUrl,
      webhookUrl,
      {
        model: tier.lipSyncModel,
        modelVersion: tier.lipSyncModelVersion,
      }
    );

    // Persist job tracking so the webhook handler can correlate the
    // callback to this dub and decide whether to retry the fallback model.
    await supabase
      .from("dubs")
      .update({
        fal_request_id: requestId,
        fal_model: model,
        fal_attempt: 1,
        progress: 85,
      })
      .eq("id", dubId);

    log(dubId, `Stage 2 SUBMITTED — request_id=${requestId}, waiting for webhook`);
    // Function exits here. Webhook handler takes over when fal.ai responds.
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[DUB:${dubId.slice(0, 8)}] Stage 2 SUBMIT FAILED:`, error);
    log(dubId, `Stage 2 submit failed: ${errMsg} — triggering retry flow`);
    // Treat initial submit failure like a webhook failure so the
    // retry logic kicks in with backoff and eventual refund.
    await supabase.from("dubs").update({ fal_attempt: 1 }).eq("id", dubId);
    await handleLipSyncFailureFromWebhook(dubId, errMsg);
  }
}

/**
 * Called by the webhook handler after fal.ai posts a successful result.
 * Downloads the synced video, uploads it to Supabase, and either:
 *   - marks the dub as done (success), OR
 *   - submits the fallback model if the primary failed (retry).
 *
 * On final failure, keeps the audio-only result and records error_message.
 */
export async function completeLipSyncFromWebhook(
  dubId: string,
  videoUrl: string
) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();
  if (!dub) return;
  const project = (dub as Record<string, unknown>).projects as Record<string, unknown>;
  if (!project) return;

  try {
    log(dubId, `Webhook: downloading lip-synced video from ${videoUrl.slice(0, 80)}`);
    await supabase.from("dubs").update({ status: "merging", progress: 92 }).eq("id", dubId);

    const syncedResponse = await fetch(videoUrl);
    if (!syncedResponse.ok) {
      throw new Error(`Failed to download synced video: ${syncedResponse.status}`);
    }
    const syncedBuffer = Buffer.from(await syncedResponse.arrayBuffer());
    const videoOutputPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-video.mp4`;

    const { error: videoUploadErr } = await supabase.storage
      .from("videos")
      .upload(videoOutputPath, syncedBuffer, { contentType: "video/mp4", upsert: true });

    if (videoUploadErr) {
      throw new Error(`Storage upload failed: ${videoUploadErr.message}`);
    }

    // If the user opted into burned-in subtitles at dub creation,
    // kick off Stage 3 now instead of marking the dub as done. The
    // lip-synced video is already saved (so even if burn-in fails
    // the user still gets a usable result from the retry path) but
    // the dub stays in `burning_subs` until the Shotstack webhook
    // fires.
    const wantsBurnedSubs = Boolean(
      (dub as Record<string, unknown>).has_burned_subs
    );

    if (wantsBurnedSubs) {
      // Save the lip-synced path first so Stage 3 can build a
      // signed URL for it, and so the lip-sync retry flow can still
      // fall back if burn-in fails entirely.
      await supabase
        .from("dubs")
        .update({
          status: "burning_subs",
          progress: 94,
          dubbed_video_url: videoOutputPath,
          error_message: null,
        })
        .eq("id", dubId);
      log(
        dubId,
        `Stage 2 COMPLETE — video ${(syncedBuffer.byteLength / 1024 / 1024).toFixed(2)}MB, starting Stage 3 (burn subtitles)`
      );
      await runBurnSubtitles(dubId);
      // Do NOT call checkProjectComplete here — Stage 3 will do it
      // once the burn-in webhook fires (or fails terminally).
      return;
    }

    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        dubbed_video_url: videoOutputPath,
        error_message: null,
      })
      .eq("id", dubId);
    log(dubId, `Stage 2 COMPLETE via webhook — video ${(syncedBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    log(dubId, `Webhook completion failed: ${errMsg} — keeping audio-only`);
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        error_message: `Lip sync upload failed: ${errMsg.slice(0, 500)}`,
      })
      .eq("id", dubId);
  }

  await checkProjectComplete(supabase, dub.project_id, dubId);
}

/**
 * Called by the webhook handler when fal.ai reports a job failure. Tries
 * the fallback model once; if that's already been tried, marks the dub
 * as done with an error message and keeps the audio-only result.
 */
/**
 * Max lip sync attempts before giving up. Each attempt retries the
 * same model first, then falls back to the other model on the last try.
 * Retries: attempt 1 (original), 2 (retry 30s), 3 (retry 1m), 4 (fallback model).
 */
const MAX_LIP_SYNC_ATTEMPTS = 4;
const RETRY_DELAYS_MS = [0, 30_000, 60_000, 180_000]; // per attempt

export async function handleLipSyncFailureFromWebhook(
  dubId: string,
  failureReason: string
) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();
  if (!dub) return;
  const project = (dub as Record<string, unknown>).projects as Record<string, unknown>;
  if (!project) return;

  const currentModel = (dub as Record<string, unknown>).fal_model as string | null;
  const attempt = ((dub as Record<string, unknown>).fal_attempt as number | null) || 1;
  const nextAttempt = attempt + 1;

  // All retries exhausted — refund credits and show friendly error
  if (nextAttempt > MAX_LIP_SYNC_ATTEMPTS) {
    log(dubId, `Lip sync failed after ${attempt} attempts — refunding credits. Last error: ${failureReason}`);

    // Refund credits for this dub
    const userId = project.user_id as string | undefined;
    if (userId) {
      await refundDubCredits(supabase, userId, dub.project_id, dubId);
    }

    await supabase
      .from("dubs")
      .update({
        status: "error",
        progress: 100,
        error_message: "Due to high server load, we couldn't generate your video. No credits were charged. Please try again or contact support.",
      })
      .eq("id", dubId);
    await checkProjectComplete(supabase, dub.project_id, dubId);
    return;
  }

  // Determine which model to use for the retry
  // Last attempt: try the OTHER model as fallback
  const useModel: "fal-ai/sync-lipsync" | "fal-ai/latentsync" =
    nextAttempt === MAX_LIP_SYNC_ATTEMPTS
      ? (currentModel === "fal-ai/sync-lipsync" ? "fal-ai/latentsync" : "fal-ai/sync-lipsync")
      : (currentModel as "fal-ai/sync-lipsync" | "fal-ai/latentsync") || "fal-ai/latentsync";

  const delayMs = RETRY_DELAYS_MS[nextAttempt - 1] || 0;
  log(dubId, `Attempt ${attempt} failed (${failureReason}). Retry ${nextAttempt}/${MAX_LIP_SYNC_ATTEMPTS} with ${useModel} in ${delayMs / 1000}s`);

  // Update status to show user we're still working
  await supabase.from("dubs").update({
    status: "lip_syncing",
    progress: 83,
    error_message: null,
  }).eq("id", dubId);

  // Delay before retry (if needed)
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  try {
    const audioPath = dub.dubbed_video_url as string;
    const { data: videoSigned } = await supabase.storage
      .from("videos")
      .createSignedUrl(project.original_video_url as string, 3600 * 4);
    const { data: audioSigned } = await supabase.storage
      .from("videos")
      .createSignedUrl(audioPath, 3600 * 4);
    if (!videoSigned?.signedUrl || !audioSigned?.signedUrl) {
      throw new Error("Failed to create signed URLs for retry");
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dubsync.app";
    const webhookUrl = `${baseUrl}/api/webhooks/fal-lipsync?dubId=${dubId}&attempt=${nextAttempt}`;
    const { requestId, model } = await ai.submitLipSyncJob(
      videoSigned.signedUrl,
      audioSigned.signedUrl,
      webhookUrl,
      {
        model: useModel,
        modelVersion: useModel === "fal-ai/sync-lipsync" ? "lipsync-1.8.0" : undefined,
      }
    );

    await supabase
      .from("dubs")
      .update({
        fal_request_id: requestId,
        fal_model: model,
        fal_attempt: nextAttempt,
        status: "lip_syncing",
        progress: 85,
      })
      .eq("id", dubId);
    log(dubId, `Retry ${nextAttempt} submitted — model=${model}, request_id=${requestId}`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    log(dubId, `Retry ${nextAttempt} submit failed: ${errMsg}`);
    // Recursively try next attempt
    await supabase.from("dubs").update({ fal_attempt: nextAttempt }).eq("id", dubId);
    await handleLipSyncFailureFromWebhook(dubId, errMsg);
  }
}

/**
 * Refund credits for a failed dub. Returns 1 credit (+ 1 for subs
 * if applicable) to the user's credits_remaining.
 */
async function refundDubCredits(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  userId: string,
  projectId: string,
  dubId: string
) {
  try {
    // Find how many credits this dub cost
    const { data: usage } = await supabase
      .from("credit_usage")
      .select("credits_used")
      .eq("dub_id", dubId)
      .single();
    const refundAmount = usage ? Number(usage.credits_used) : 1;

    // Refund to plan credits first (up to plan limit), remainder to topup
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_remaining, topup_credits, plan")
      .eq("id", userId)
      .single();
    if (profile) {
      const { PLAN_LIMITS } = await import("./supabase/constants");
      const planMax = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]?.credits || 0;
      const currentPlan = Number(profile.credits_remaining);
      const canRefundToPlan = Math.min(refundAmount, Math.max(0, planMax - currentPlan));
      const refundToTopup = refundAmount - canRefundToPlan;

      await supabase
        .from("profiles")
        .update({
          credits_remaining: currentPlan + canRefundToPlan,
          topup_credits: Number(profile.topup_credits) + refundToTopup,
        })
        .eq("id", userId);
    }

    // Delete the credit_usage record
    await supabase.from("credit_usage").delete().eq("dub_id", dubId);
    log(dubId, `Refunded ${refundAmount} credit(s) to user ${userId.slice(0, 8)}`);
  } catch (err) {
    console.error(`[DUB:${dubId.slice(0, 8)}] Credit refund failed:`, err);
  }
}

// ═════════════════════════ Stage 3: Burn subtitles ═════════════════════════
//
// Optional stage that runs after a successful lip sync when the dub
// was created with `has_burned_subs = true`. We feed the lip-synced
// video AND our pre-computed SRT file (from Phase 1, Claude-translated
// segments with original-voice timestamps) into Shotstack's render
// API, which burns the subtitles into the video pixels.
//
// Previously this used fal-ai/auto-caption which re-transcribed the
// dubbed audio via STT. That broke for every language the model
// didn't support (Ukrainian, Polish, Turkish, Hindi, Arabic...): the
// webhook returned a "success" response but the output video had no
// visible captions. Shotstack is language-agnostic because it just
// renders our SRT verbatim with libass.
export async function runBurnSubtitles(dubId: string) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();
  if (!dub || !dub.dubbed_video_url) return;

  try {
    // Need BOTH signed URLs: the lip-synced video AND the SRT file
    // generated by Phase 1. The SRT has Claude-translated text with
    // timestamps from the original speaker — which is exactly what
    // you, the user, proposed as the fix when auto-caption misfired.
    if (!dub.srt_url) {
      throw new Error(
        "No SRT file for this dub — Phase 1 subtitle upload failed. Re-run Stage 1."
      );
    }

    const [{ data: videoSigned }, { data: srtSigned }] = await Promise.all([
      supabase.storage
        .from("videos")
        .createSignedUrl(dub.dubbed_video_url as string, 3600 * 4),
      supabase.storage
        .from("videos")
        .createSignedUrl(dub.srt_url as string, 3600 * 4),
    ]);

    if (!videoSigned?.signedUrl) {
      throw new Error("Failed to create signed URL for lip-synced video");
    }
    if (!srtSigned?.signedUrl) {
      throw new Error("Failed to create signed URL for SRT file");
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dubsync.app";
    const webhookUrl = `${baseUrl}/api/webhooks/shotstack-subs?dubId=${dubId}`;
    const { renderId } = await ai.submitShotstackBurnJob(
      videoSigned.signedUrl,
      srtSigned.signedUrl,
      webhookUrl
    );

    // Re-use the `subs_fal_request_id` column as the generic render
    // tracking id. We don't rename it yet to avoid a migration, but
    // the name is now a misnomer — it holds the Shotstack render id.
    await supabase
      .from("dubs")
      .update({ subs_fal_request_id: renderId, progress: 96 })
      .eq("id", dubId);
    log(dubId, `Stage 3 SUBMITTED — Shotstack render_id=${renderId}, waiting for webhook`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    log(dubId, `Stage 3 submit failed: ${errMsg} — falling back to plain lip-synced video`);
    // Keep the lip-synced video as the final result so the user
    // still has a dub they can download. The soft SRT/VTT files are
    // also intact from Stage 1.
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        error_message: `Burn-in failed: ${errMsg.slice(0, 500)}`,
      })
      .eq("id", dubId);
    await checkProjectComplete(supabase, dub.project_id, dubId);
  }
}

/**
 * Called by the subtitles webhook handler with a successful result.
 * Downloads the captioned video, uploads it to Supabase, and marks
 * the dub as done with the new video URL stored alongside the
 * original lip-synced one.
 *
 * Works for both providers — the caller normalizes the URL before
 * invoking this function. Today only Shotstack calls it; the old
 * fal-subs route stub is kept for compatibility with already-
 * submitted-but-not-yet-delivered jobs.
 */
export async function completeBurnSubtitlesFromWebhook(
  dubId: string,
  videoUrl: string
) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();
  if (!dub) return;
  const project = (dub as Record<string, unknown>).projects as Record<string, unknown>;
  if (!project) return;

  try {
    log(dubId, `Stage 3 webhook: downloading captioned video from ${videoUrl.slice(0, 80)}`);

    const captionedRes = await fetch(videoUrl);
    if (!captionedRes.ok) {
      throw new Error(`Download captioned video: ${captionedRes.status}`);
    }
    const captionedBuffer = Buffer.from(await captionedRes.arrayBuffer());
    const withSubsPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-video-subs.mp4`;

    const { error: uploadErr } = await supabase.storage
      .from("videos")
      .upload(withSubsPath, captionedBuffer, {
        contentType: "video/mp4",
        upsert: true,
      });
    if (uploadErr) {
      throw new Error(`Storage upload failed: ${uploadErr.message}`);
    }

    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        dubbed_video_with_subs_url: withSubsPath,
        error_message: null,
      })
      .eq("id", dubId);
    log(
      dubId,
      `Stage 3 COMPLETE — captioned video ${(captionedBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    log(dubId, `Stage 3 completion failed: ${errMsg} — keeping plain lip-synced video`);
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        error_message: `Burn-in upload failed: ${errMsg.slice(0, 500)}`,
      })
      .eq("id", dubId);
  }

  await checkProjectComplete(supabase, dub.project_id, dubId);
}

/**
 * Called by the subtitles webhook when the render provider reports
 * a failure. We keep the lip-synced video and mark the dub as done
 * so the user still has a usable result; the error is surfaced in
 * `error_message`.
 */
export async function handleBurnSubtitlesFailureFromWebhook(
  dubId: string,
  failureReason: string
) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("project_id")
    .eq("id", dubId)
    .single();
  log(dubId, `Stage 3 webhook failure: ${failureReason} — keeping lip-synced video`);
  await supabase
    .from("dubs")
    .update({
      status: "done",
      progress: 100,
      error_message: `Burn-in failed: ${failureReason.slice(0, 500)}`,
    })
    .eq("id", dubId);
  if (dub?.project_id) {
    await checkProjectComplete(supabase, dub.project_id, dubId);
  }
}

// Helper: check if all dubs finished and update project status.
// Only "done" and "error" are TERMINAL states. "audio_ready" is intermediate
// (Stage 1 finished, Stage 2 lip sync about to start) so we must NOT treat
// it as finished — otherwise the project flips to "done" before lip sync runs.
async function checkProjectComplete(supabase: Awaited<ReturnType<typeof createServiceClient>>, projectId: string | null, dubId: string) {
  if (!projectId) return;
  const { data: allDubs } = await supabase.from("dubs").select("status").eq("project_id", projectId);
  const allFinished = allDubs?.every((d) => ["done", "error"].includes(d.status));
  if (allFinished) {
    const anyDone = allDubs?.some((d) => d.status === "done");
    await supabase.from("projects").update({ status: anyDone ? "done" : "error" }).eq("id", projectId);
    log(dubId, `All dubs finished — project: ${anyDone ? "done" : "error"}`);

    // Send "dub complete" email notification (non-blocking)
    if (anyDone) {
      sendProjectCompleteEmail(supabase, projectId).catch((e) =>
        console.warn(`[EMAIL] dub complete notification failed:`, e)
      );
    }
  }
}

/** Send email when all dubs in a project are done. */
async function sendProjectCompleteEmail(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  projectId: string
) {
  const { data: project } = await supabase
    .from("projects")
    .select("title, user_id, is_demo")
    .eq("id", projectId)
    .single();
  if (!project || project.is_demo) return; // Don't email for demo projects

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, locale, credits_remaining, plan")
    .eq("id", project.user_id)
    .single();
  if (!profile?.email) return;

  const { sendDubCompleteEmail, sendCreditsLowEmail } = await import("./email");

  await sendDubCompleteEmail({
    to: profile.email,
    projectId,
    projectTitle: project.title,
    locale: profile.locale,
  });

  // Also check if credits are low (< 20% of plan)
  const { PLAN_LIMITS } = await import("./supabase/constants");
  const planCredits = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]?.credits || 0;
  if (planCredits > 0) {
    const remaining = Number(profile.credits_remaining);
    if (remaining <= planCredits * 0.2) {
      await sendCreditsLowEmail({
        to: profile.email,
        creditsRemaining: remaining,
        locale: profile.locale,
      });
    }
  }
}

// Legacy wrapper for backward compatibility
export async function runDubbing(dubId: string) {
  await runDubbingAudio(dubId);
}
