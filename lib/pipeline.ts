import { createServiceClient } from "./supabase/server";
import * as ai from "./ai";
import { LANGUAGE_MAP } from "./supabase/constants";
import { getQualityTier } from "./quality-tiers";
import { toSrt, toVtt } from "./subtitles";
import type { PlanType, TranscriptSegment } from "./supabase/types";


function log(dubId: string, msg: string) {
  console.log(`[DUB:${dubId.slice(0, 8)}] ${msg}`);
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

    // Voice selection — plan-gated.
    //
    // Free plan users always get a pre-made multilingual voice.
    // Cloning burns a finite monthly ElevenLabs quota that we
    // reserve for paying users (starter/pro/enterprise). Free
    // users still get a perfectly usable dub with accurate
    // translation + lip sync, just with a generic "similar"
    // voice instead of an exact clone of their speaker. The
    // project detail page shows a chip explaining this and a
    // direct upgrade CTA — see projects/[id]/page.tsx.
    //
    // Paid plan users try the full clone path as before, with
    // quota-exhausted failures falling back silently to the
    // pre-made voice so the dub still completes.
    await supabase.from("dubs").update({ status: "generating_voice", progress: 35 }).eq("id", dubId);

    // Look up the dub owner's plan — needed for the clone-vs-premade
    // decision above AND downstream for the lipsync quality tier.
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
    const isFreePlan = ownerPlan === "free";
    log(dubId, `Owner plan=${ownerPlan}, cloning=${!isFreePlan}`);

    let voiceId: string;
    // Tracks which voice model actually produced the dub — written
    // to dubs.voice_source at Stage 1 complete. 'cloned' = ElevenLabs
    // Instant Voice Clone of the original speaker. 'premade' = a
    // pre-made multilingual voice (free-plan default, or paid-plan
    // fallback on quota exhaust / bad sample).
    let voiceSource: "cloned" | "premade" = "premade";

    if (isFreePlan) {
      // Skip the clone path entirely for free users — don't even
      // download the extracted audio sample. Save the ElevenLabs
      // quota for paying customers.
      voiceId = await ai.getMultilingualVoice();
      log(dubId, `Free plan — using pre-made voice: ${voiceId}`);
    } else {
      // Paid plan → try to clone. Same multi-candidate search as
      // before: extracted audio first, then the raw video file as
      // a last-resort clone source.
      const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");
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
          voiceSource = "cloned";
          log(dubId, `Voice cloned from extracted audio: ${voiceId}`);
        } catch (cloneErr) {
          if (cloneErr instanceof ai.ElevenLabsQuotaExhaustedError) {
            log(dubId, `Quota exhausted — falling back to pre-made voice`);
          } else {
            log(
              dubId,
              `Clone from extracted audio failed: ${
                cloneErr instanceof Error ? cloneErr.message : "unknown"
              }`
            );
          }
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
              voiceSource = "cloned";
              log(dubId, `Voice cloned from video file: ${voiceId}`);
            } else {
              throw new Error(`Video too large for cloning: ${(videoBuffer.length / 1024 / 1024).toFixed(1)}MB`);
            }
          } else {
            throw new Error("Could not download video");
          }
        } catch (fallbackErr) {
          if (fallbackErr instanceof ai.ElevenLabsQuotaExhaustedError) {
            log(dubId, `Quota exhausted on fallback — using pre-made voice`);
          } else {
            log(
              dubId,
              `Fallback clone failed: ${
                fallbackErr instanceof Error ? fallbackErr.message : "unknown"
              }`
            );
          }
          voiceId = await ai.getMultilingualVoice();
        }
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
        // Clone existed but was unusable for this language — the
        // final audio came from the pre-made voice so downgrade
        // voice_source accordingly. UI will show the "similar
        // voice" chip if the owner is on the free plan.
        voiceSource = "premade";
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
  }
}

// Legacy wrapper for backward compatibility
export async function runDubbing(dubId: string) {
  await runDubbingAudio(dubId);
}
