import { createServiceClient } from "./supabase/server";
import * as ai from "./ai";
import { LANGUAGE_MAP } from "./supabase/constants";
import { getQualityTier } from "./quality-tiers";
import type { PlanType } from "./supabase/types";


function log(dubId: string, msg: string) {
  console.log(`[DUB:${dubId.slice(0, 8)}] ${msg}`);
}

export async function runTranscription(projectId: string) {
  const supabase = await createServiceClient();

  try {
    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Starting transcription`);

    await supabase
      .from("projects")
      .update({ status: "transcribing" })
      .eq("id", projectId);

    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!project?.original_video_url) {
      throw new Error("No video URL found");
    }

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
    const { segments, language } = await ai.transcribe(videoBuffer, `video.${ext}`, languageHint);

    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Transcription done: ${segments.length} segments, language=${language}`);

    // Calculate duration from last segment end time + buffer
    // Whisper segments don't capture trailing silence, so add 1s buffer
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
    await supabase
      .from("projects")
      .update({ status: "error" })
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

  // All attempts failed — record the final error
  const errMsg = lastError instanceof Error ? lastError.message : "Unknown error";
  log(dubId, `Stage 1 FAILED after retries: ${errMsg}`);
  await supabase
    .from("dubs")
    .update({ status: "error", error_message: errMsg })
    .eq("id", dubId);
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

    // Voice clone — use extracted audio, not full video
    await supabase.from("dubs").update({ status: "generating_voice", progress: 35 }).eq("id", dubId);
    let voiceId: string;

    const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");

    // Try extracted audio formats in order of preference
    const audioCandidates = ["extracted-audio.webm", "extracted-audio.mp4", "voice-sample.wav"];
    let sampleBuffer: Buffer | null = null;
    let sampleExt = "webm";

    for (const candidate of audioCandidates) {
      try {
        const { data, error } = await supabase.storage.from("videos").download(`${videoDir}/${candidate}`);
        if (data && !error) {
          sampleBuffer = Buffer.from(await data.arrayBuffer());
          sampleExt = candidate.split(".").pop() || "webm";
          log(dubId, `Found voice sample: ${candidate} (${(sampleBuffer.length / 1024).toFixed(0)}KB)`);
          break;
        }
      } catch {
        continue;
      }
    }

    if (sampleBuffer && sampleBuffer.length > 1000 && sampleBuffer.length < 11 * 1024 * 1024) {
      try {
        voiceId = await ai.cloneVoice(sampleBuffer, dub.id as string, sampleExt);
        log(dubId, `Voice cloned from extracted audio: ${voiceId}`);
      } catch (cloneErr) {
        log(dubId, `Clone from extracted audio failed: ${cloneErr instanceof Error ? cloneErr.message : "unknown"}`);
        voiceId = await ai.getMultilingualVoice();
        log(dubId, `Using pre-made voice: ${voiceId}`);
      }
    } else {
      log(dubId, `No usable extracted audio (size=${sampleBuffer?.length || 0})`);
      // Try cloning from video file directly as last resort (if size permits)
      try {
        const { data: videoData } = await supabase.storage.from("videos").download(project.original_video_url as string);
        if (videoData) {
          const videoBuffer = Buffer.from(await videoData.arrayBuffer());
          if (videoBuffer.length < 11 * 1024 * 1024) {
            const ext = ((project.original_video_url as string).split(".").pop() || "mp4").toLowerCase();
            voiceId = await ai.cloneVoice(videoBuffer, dub.id as string, ext);
            log(dubId, `Voice cloned from video file: ${voiceId}`);
          } else {
            throw new Error(`Video too large for cloning: ${(videoBuffer.length / 1024 / 1024).toFixed(1)}MB`);
          }
        } else {
          throw new Error("Could not download video");
        }
      } catch (fallbackErr) {
        log(dubId, `Fallback clone failed: ${fallbackErr instanceof Error ? fallbackErr.message : "unknown"}`);
        voiceId = await ai.getMultilingualVoice();
      }
    }

    // Per-segment TTS with exact timing matching original video
    const videoDuration = (project.duration_seconds as number) || 0;
    log(dubId, `TTS: ${translatedSegments.length} segments, video=${videoDuration}s`);

    // Use original transcript timestamps for segment placement
    const segmentsWithTiming = translatedSegments.map((seg, i) => ({
      ...seg,
      // Use original transcript timing if available
      start: transcript[i]?.start ?? seg.start,
      end: transcript[i]?.end ?? seg.end,
    }));

    // Run TTS. If the cloned voice doesn't have permission for the
    // multilingual model (common when the ElevenLabs account is near quota),
    // delete the clone and retry with a pre-made multilingual voice.
    // This is a TEMPORARY workaround — remove once quota is expanded.
    let audioBuffer: Buffer;
    let newAudioDuration: number;
    try {
      const out = await ai.generateTimedAudio(segmentsWithTiming, voiceId, videoDuration);
      audioBuffer = out.wav;
      newAudioDuration = out.durationSec;
    } catch (err) {
      if (err instanceof ai.ElevenLabsVoicePermissionError) {
        log(dubId, `Voice permission error on cloned voice — falling back to pre-made multilingual voice`);
        // Clean up the unusable cloned voice
        if (!["FGY2WhTYpPnrIDTdsKH5", "EXAVITQu4vr4xnSDxMaL", "XrExE9yKIg1WjnnlVkGX"].includes(voiceId)) {
          try { await ai.deleteClonedVoice(voiceId); } catch { /* ignore */ }
        }
        voiceId = await ai.getMultilingualVoice();
        log(dubId, `Retrying TTS with pre-made voice ${voiceId}`);
        const out = await ai.generateTimedAudio(segmentsWithTiming, voiceId, videoDuration);
        audioBuffer = out.wav;
        newAudioDuration = out.durationSec;
      } else {
        throw err;
      }
    }
    log(dubId, `TTS done: audio=${newAudioDuration.toFixed(2)}s (was ${videoDuration}s)`);

    // Upload audio
    const audioPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-audio.wav`;
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(audioPath, audioBuffer, { contentType: "audio/wav", upsert: true });
    if (uploadError) throw new Error(`Audio upload failed: ${uploadError.message}`);

    // Mark as audio_ready — user can already download audio
    await supabase.from("dubs").update({
      status: "audio_ready",
      progress: 80,
      dubbed_video_url: audioPath,
    }).eq("id", dubId);

    log(dubId, "Stage 1 COMPLETE — audio ready");

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
    log(dubId, `Stage 2 submit failed: ${errMsg} — keeping audio-only`);
    // Submission itself failed (network, fal.ai down). Keep the audio
    // result usable; the user can retry from the UI.
    await supabase.from("dubs").update({
      status: "done",
      progress: 100,
      error_message: `Lip sync submit failed: ${errMsg.slice(0, 500)}`,
    }).eq("id", dubId);
    await checkProjectComplete(supabase, dub.project_id, dubId);
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

  // Already tried both models? Give up gracefully.
  if (attempt >= 2) {
    log(dubId, `Webhook: lip sync failed on both models — keeping audio-only. Last error: ${failureReason}`);
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        error_message: `Lip sync failed: ${failureReason.slice(0, 500)}`,
      })
      .eq("id", dubId);
    await checkProjectComplete(supabase, dub.project_id, dubId);
    return;
  }

  // Try the OTHER model once
  const fallbackModel: "fal-ai/sync-lipsync" | "fal-ai/latentsync" =
    currentModel === "fal-ai/sync-lipsync" ? "fal-ai/latentsync" : "fal-ai/sync-lipsync";
  log(dubId, `Webhook: ${currentModel} failed (${failureReason}), retrying with ${fallbackModel}`);

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
    const webhookUrl = `${baseUrl}/api/webhooks/fal-lipsync?dubId=${dubId}&attempt=2`;
    const { requestId, model } = await ai.submitLipSyncJob(
      videoSigned.signedUrl,
      audioSigned.signedUrl,
      webhookUrl,
      {
        model: fallbackModel,
        modelVersion: fallbackModel === "fal-ai/sync-lipsync" ? "lipsync-1.8.0" : undefined,
      }
    );

    await supabase
      .from("dubs")
      .update({
        fal_request_id: requestId,
        fal_model: model,
        fal_attempt: 2,
        status: "lip_syncing",
        progress: 85,
      })
      .eq("id", dubId);
    log(dubId, `Fallback ${fallbackModel} submitted — request_id=${requestId}`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    log(dubId, `Fallback submit failed: ${errMsg} — keeping audio-only`);
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        error_message: `Lip sync failed (no fallback): ${errMsg.slice(0, 500)}`,
      })
      .eq("id", dubId);
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
  }
}

// Legacy wrapper for backward compatibility
export async function runDubbing(dubId: string) {
  await runDubbingAudio(dubId);
}
