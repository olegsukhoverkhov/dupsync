import { createServiceClient } from "./supabase/server";
import * as ai from "./ai";
import { LANGUAGE_MAP } from "./supabase/constants";


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

// Stage 1: Translate + TTS + upload audio (~30-60s per language)
export async function runDubbingAudio(dubId: string) {
  const supabase = await createServiceClient();
  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();

  try {
    log(dubId, "Stage 1: Translate + TTS");
    if (!dub) throw new Error("Dub not found");

    const project = (dub as Record<string, unknown>).projects as Record<string, unknown>;
    if (!project?.transcript) throw new Error("No transcript found");

    const transcript = project.transcript as { start: number; end: number; text: string }[];
    const sourceLang = LANGUAGE_MAP[project.original_language as string] || "English";
    const targetLang = LANGUAGE_MAP[dub.target_language] || dub.target_language;

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
        voiceId = await ai.cloneVoice(sampleBuffer, dub.id, sampleExt);
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
            voiceId = await ai.cloneVoice(videoBuffer, dub.id, ext);
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

    const { wav: audioBuffer, durationSec: newAudioDuration } = await ai.generateTimedAudio(segmentsWithTiming, voiceId, videoDuration);
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
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    log(dubId, `Stage 1 FAILED: ${errMsg}`);
    await supabase.from("dubs").update({ status: "error", error_message: errMsg }).eq("id", dubId);
    checkProjectComplete(supabase, dub?.project_id, dubId);
  }
}

// Stage 2: Lip sync (called separately, up to 300s per dub)
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
    log(dubId, "Stage 2: Lip sync");
    await supabase.from("dubs").update({ status: "lip_syncing", progress: 82 }).eq("id", dubId);

    const audioPath = dub.dubbed_video_url;
    const { data: videoSigned } = await supabase.storage
      .from("videos")
      .createSignedUrl(project.original_video_url as string, 3600);
    const { data: audioSigned } = await supabase.storage
      .from("videos")
      .createSignedUrl(audioPath, 3600);

    if (!videoSigned?.signedUrl || !audioSigned?.signedUrl) {
      throw new Error("Failed to create signed URLs");
    }

    // Progress updates during lip sync
    const progressTimer = setInterval(async () => {
      const { data: d } = await supabase.from("dubs").select("progress").eq("id", dubId).single();
      if (d && d.progress < 92) {
        await supabase.from("dubs").update({ progress: d.progress + 1 }).eq("id", dubId);
      }
    }, 5000);

    // Get audio duration from WAV header
    const { data: audioFile } = await supabase.storage.from("videos").download(audioPath);
    let audioDurationSec = (project.duration_seconds as number) || 0;
    if (audioFile) {
      const audioBuf = Buffer.from(await audioFile.arrayBuffer());
      // WAV: bytes 24-28 = sample rate, 40-44 = data size (16-bit mono)
      const sampleRate = audioBuf.readUInt32LE(24);
      const dataSize = audioBuf.readUInt32LE(40);
      audioDurationSec = dataSize / 2 / sampleRate;
      log(dubId, `Audio duration: ${audioDurationSec.toFixed(2)}s, video duration: ${project.duration_seconds}s`);
    }

    // If audio is significantly longer than video, slow down the video
    let videoUrlForLipSync = videoSigned.signedUrl;
    const originalVideoDuration = (project.duration_seconds as number) || audioDurationSec;
    if (audioDurationSec > originalVideoDuration * 1.05) {
      log(dubId, `Audio longer than video, extending video duration`);
      try {
        videoUrlForLipSync = await ai.slowDownVideo(videoSigned.signedUrl, audioDurationSec, originalVideoDuration);
      } catch (e) {
        log(dubId, `Slow down failed, using original: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }

    const syncedVideoUrl = await ai.lipSync(videoUrlForLipSync, audioSigned.signedUrl);
    clearInterval(progressTimer);

    log(dubId, "Lip sync done, uploading video...");
    await supabase.from("dubs").update({ status: "merging", progress: 92 }).eq("id", dubId);

    const syncedResponse = await fetch(syncedVideoUrl);
    const syncedBuffer = Buffer.from(await syncedResponse.arrayBuffer());
    const videoOutputPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-video.mp4`;

    const { error: videoUploadErr } = await supabase.storage
      .from("videos")
      .upload(videoOutputPath, syncedBuffer, { contentType: "video/mp4", upsert: true });

    if (!videoUploadErr) {
      await supabase.from("dubs").update({
        status: "done", progress: 100, dubbed_video_url: videoOutputPath,
      }).eq("id", dubId);
      log(dubId, `Stage 2 COMPLETE — video ${(syncedBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
    } else {
      // Keep audio-only
      await supabase.from("dubs").update({ status: "done", progress: 100 }).eq("id", dubId);
      log(dubId, `Video upload failed, keeping audio-only`);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    log(dubId, `Stage 2 FAILED: ${errMsg} — keeping audio-only`);
    // Don't set error — keep audio_ready result, just mark as done
    await supabase.from("dubs").update({ status: "done", progress: 100 }).eq("id", dubId);
  }

  checkProjectComplete(supabase, dub.project_id, dubId);
}

// Helper: check if all dubs finished and update project status
async function checkProjectComplete(supabase: Awaited<ReturnType<typeof createServiceClient>>, projectId: string | null, dubId: string) {
  if (!projectId) return;
  const { data: allDubs } = await supabase.from("dubs").select("status").eq("project_id", projectId);
  const allFinished = allDubs?.every((d) => ["done", "error", "audio_ready"].includes(d.status));
  if (allFinished) {
    const anyDone = allDubs?.some((d) => d.status === "done" || d.status === "audio_ready");
    await supabase.from("projects").update({ status: anyDone ? "done" : "error" }).eq("id", projectId);
    log(dubId, `All dubs finished — project: ${anyDone ? "done" : "error"}`);
  }
}

// Legacy wrapper for backward compatibility
export async function runDubbing(dubId: string) {
  await runDubbingAudio(dubId);
}
