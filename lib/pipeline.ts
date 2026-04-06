import { createServiceClient } from "./supabase/server";
import * as ai from "./ai";
import { LANGUAGE_MAP } from "./supabase/constants";

// Try multiple Whisper-compatible formats for unsupported video files
async function transcribeWithRetry(
  buffer: Buffer,
  originalExt: string,
  languageHint?: string
): Promise<{ segments: { start: number; end: number; text: string }[]; language: string }> {
  // Try formats in order of likelihood to work
  const formats = [
    { filename: "audio.mp4", mime: "video/mp4" },
    { filename: "audio.m4a", mime: "audio/mp4" },
    { filename: "audio.wav", mime: "audio/wav" },
    { filename: "audio.mpeg", mime: "video/mpeg" },
  ];

  let lastError: Error | null = null;

  for (const fmt of formats) {
    try {
      console.log(`[TRANSCRIBE] Trying format: ${fmt.filename} (${fmt.mime}) for .${originalExt} file`);

      const formData = new FormData();
      formData.append(
        "file",
        new Blob([new Uint8Array(buffer)], { type: fmt.mime }),
        fmt.filename
      );
      formData.append("model", "whisper-1");
      formData.append("response_format", "verbose_json");
      formData.append("timestamp_granularities[]", "segment");
      if (languageHint && languageHint !== "auto") {
        formData.append("language", languageHint);
      }

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const segments = (data.segments || []).map(
          (s: { start: number; end: number; text: string }) => ({
            start: s.start,
            end: s.end,
            text: s.text.trim(),
          })
        );
        console.log(`[TRANSCRIBE] Success with ${fmt.filename}: ${segments.length} segments`);
        return { segments, language: data.language || "en" };
      }

      const errBody = await response.text().catch(() => "");
      console.log(`[TRANSCRIBE] Failed with ${fmt.filename}: ${response.status} ${errBody.slice(0, 100)}`);
      lastError = new Error(`Whisper ${response.status}: ${errBody.slice(0, 200)}`);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      console.log(`[TRANSCRIBE] Exception with ${fmt.filename}: ${lastError.message}`);
    }
  }

  throw lastError || new Error("All transcription formats failed");
}

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

    let buffer: Buffer;
    let transcribeFilename: string;

    // Check if client already extracted audio (full-audio.wav or voice-sample.wav)
    const videoDir = project.original_video_url.split("/").slice(0, -1).join("/");
    const { data: wavData } = await supabase.storage
      .from("videos")
      .download(`${videoDir}/full-audio.wav`);

    if (wavData) {
      buffer = Buffer.from(await wavData.arrayBuffer());
      transcribeFilename = "audio.wav";
      console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Using client-extracted full-audio.wav: ${(buffer.byteLength / 1024).toFixed(0)}KB`);
    } else if (!["mp4", "mp3", "wav", "webm", "m4a", "ogg", "flac", "mpeg", "mpga"].includes(ext)) {
      // Format not directly supported by Whisper (MOV, AVI, MKV, etc.)
      // Try multiple formats with retry
      console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Unsupported format .${ext}, trying multiple formats...`);
      const result = await transcribeWithRetry(videoBuffer, ext, languageHint);
      // Skip normal transcribe call, go directly to save
      const rawEnd = result.segments.length > 0 ? result.segments[result.segments.length - 1].end : 0;
      const durationSeconds = Math.ceil(rawEnd + 1);
      await supabase.from("projects").update({
        status: "ready",
        transcript: result.segments,
        original_language: result.language,
        duration_seconds: durationSeconds,
      }).eq("id", projectId);
      console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Done: ${result.segments.length} segments, ${durationSeconds}s`);
      return;
    } else {
      // Format supported by Whisper — use directly
      buffer = videoBuffer;
      transcribeFilename = `video.${ext}`;
    }

    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Calling Whisper API (file=${transcribeFilename}, lang=${languageHint || "auto"})`);
    const { segments, language } = await ai.transcribe(buffer, transcribeFilename, languageHint);

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

export async function runDubbing(dubId: string) {
  const supabase = await createServiceClient();

  const { data: dub } = await supabase
    .from("dubs")
    .select("*, projects(*)")
    .eq("id", dubId)
    .single();

  try {
    log(dubId, "Starting dubbing pipeline");

    if (!dub) throw new Error("Dub not found");

    const project = (dub as Record<string, unknown>).projects as Record<string, unknown>;
    if (!project?.transcript) throw new Error("No transcript found");

    const transcript = project.transcript as { start: number; end: number; text: string }[];
    const sourceLang = LANGUAGE_MAP[project.original_language as string] || "English";
    const targetLang = LANGUAGE_MAP[dub.target_language] || dub.target_language;

    log(dubId, `Translating ${sourceLang} → ${targetLang} (${transcript.length} segments)`);

    // Step 1: Translate (0-30%)
    await supabase
      .from("dubs")
      .update({ status: "translating", progress: 10 })
      .eq("id", dubId);

    const translatedSegments = await ai.translate(transcript, sourceLang, targetLang);

    log(dubId, `Translation done: ${translatedSegments.length} segments`);

    await supabase
      .from("dubs")
      .update({ translated_transcript: translatedSegments, progress: 30 })
      .eq("id", dubId);

    // Step 2: Clone voice or fallback to pre-made (30-80%)
    await supabase
      .from("dubs")
      .update({ status: "generating_voice", progress: 35 })
      .eq("id", dubId);

    let voiceId: string;
    try {
      // Try to use extracted voice sample (uploaded by client)
      const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");
      const voiceSamplePath = `${videoDir}/voice-sample.wav`;

      log(dubId, `Looking for voice sample at: ${voiceSamplePath}`);
      const { data: audioData, error: audioErr } = await supabase.storage
        .from("videos")
        .download(voiceSamplePath);

      if (audioData && !audioErr) {
        const audioBuffer = Buffer.from(await audioData.arrayBuffer());
        log(dubId, `Voice sample found: ${(audioBuffer.byteLength / 1024).toFixed(0)}KB`);
        voiceId = await ai.cloneVoice(audioBuffer, dub.id, "wav");
        log(dubId, `Voice cloned successfully: ${voiceId}`);
      } else {
        log(dubId, `No voice sample found (${audioErr?.message}), trying video file...`);
        // Fallback: try with video file directly
        const { data: videoData } = await supabase.storage
          .from("videos")
          .download(project.original_video_url as string);

        if (videoData) {
          const videoBuffer = Buffer.from(await videoData.arrayBuffer());
          const ext = ((project.original_video_url as string).split(".").pop() || "mp4").toLowerCase();
          voiceId = await ai.cloneVoice(videoBuffer, dub.id, ext);
          log(dubId, `Voice cloned from video: ${voiceId}`);
        } else {
          throw new Error("No audio source available");
        }
      }
    } catch (cloneErr) {
      log(dubId, `Clone failed: ${cloneErr instanceof Error ? cloneErr.message : "unknown"}, using pre-made voice`);
      voiceId = await ai.getMultilingualVoice();
      log(dubId, `Using pre-made voice: ${voiceId}`);
    }

    // Generate TTS padded to exact video duration as WAV
    // RULE: Always use natural/slow speed for dubbed speech
    // Dubbed content should sound natural, not rushed
    const videoDuration = (project.duration_seconds as number) || 0;
    const fullText = translatedSegments.map((s) => s.text).join(". ");

    // Always use 0.85x speed for natural-sounding dubbed speech
    // This ensures audio never sounds rushed or accelerated
    const targetSpeed = 0.85;

    log(dubId, `TTS: ${fullText.length} chars, video=${videoDuration}s, speed=${targetSpeed}`);

    const audioBuffer = await ai.textToSpeechPadded(fullText, voiceId, videoDuration, targetSpeed);
    log(dubId, `TTS done: ${(audioBuffer.byteLength / 1024).toFixed(0)}KB WAV`);

    // Upload dubbed audio as WAV
    const audioPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-audio.wav`;
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(audioPath, audioBuffer, { contentType: "audio/wav", upsert: true });

    if (uploadError) {
      log(dubId, `Audio upload error: ${uploadError.message}`);
      throw new Error(`Audio upload failed: ${uploadError.message}`);
    }

    log(dubId, "Audio uploaded successfully");

    await supabase
      .from("dubs")
      .update({ progress: 80 })
      .eq("id", dubId);

    // Step 3: Lip sync via fal.ai (Vercel Pro = 300s timeout)
    await supabase
      .from("dubs")
      .update({ status: "lip_syncing", progress: 82 })
      .eq("id", dubId);

    const { data: videoSignedUrl } = await supabase.storage
      .from("videos")
      .createSignedUrl(project.original_video_url as string, 3600);

    const { data: audioSignedUrlData } = await supabase.storage
      .from("videos")
      .createSignedUrl(audioPath, 3600);

    let finalOutputPath = audioPath; // fallback to audio-only

    let lipSyncTimer: ReturnType<typeof setInterval> | null = null;

    if (videoSignedUrl?.signedUrl && audioSignedUrlData?.signedUrl) {
      try {
        log(dubId, "Starting lip sync via fal.ai...");

        // Update progress periodically during lip sync
        lipSyncTimer = setInterval(async () => {
          const { data: currentDub } = await supabase
            .from("dubs")
            .select("progress")
            .eq("id", dubId)
            .single();
          const currentProgress = currentDub?.progress || 82;
          if (currentProgress < 92) {
            await supabase
              .from("dubs")
              .update({ progress: Math.min(currentProgress + 1, 92) })
              .eq("id", dubId);
          }
        }, 5000);

        const syncedVideoUrl = await ai.lipSync(
          videoSignedUrl.signedUrl,
          audioSignedUrlData.signedUrl
        );
        if (lipSyncTimer) clearInterval(lipSyncTimer);

        log(dubId, `Lip sync done, downloading result...`);

        await supabase
          .from("dubs")
          .update({ status: "merging", progress: 92 })
          .eq("id", dubId);

        // Download synced video and upload to storage
        const syncedResponse = await fetch(syncedVideoUrl);
        const syncedBuffer = Buffer.from(await syncedResponse.arrayBuffer());

        const videoOutputPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-video.mp4`;
        const { error: videoUploadErr } = await supabase.storage
          .from("videos")
          .upload(videoOutputPath, syncedBuffer, { contentType: "video/mp4", upsert: true });

        if (!videoUploadErr) {
          finalOutputPath = videoOutputPath;
          log(dubId, `Video uploaded: ${(syncedBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
        } else {
          log(dubId, `Video upload failed: ${videoUploadErr.message}, keeping audio-only`);
        }
      } catch (lipSyncErr) {
        if (lipSyncTimer) clearInterval(lipSyncTimer);
        log(dubId, `Lip sync failed: ${lipSyncErr instanceof Error ? lipSyncErr.message : "unknown"}, keeping audio-only`);
        // Continue with audio-only output
      }
    } else {
      log(dubId, "Could not create signed URLs for lip sync, keeping audio-only");
    }

    // Mark as done
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        dubbed_video_url: finalOutputPath,
      })
      .eq("id", dubId);

    log(dubId, "Dubbing COMPLETE");

    // Clean up cloned voice to keep ElevenLabs account tidy
    if (voiceId && !["FGY2WhTYpPnrIDTdsKH5", "EXAVITQu4vr4xnSDxMaL", "XrExE9yKIg1WjnnlVkGX"].includes(voiceId)) {
      await ai.deleteClonedVoice(voiceId);
    }

    // Credits already deducted in API route before pipeline starts

    // Check if all dubs for this project are done
    const { data: allDubs } = await supabase
      .from("dubs")
      .select("status")
      .eq("project_id", project.id);

    const allDone = allDubs?.every((d) => d.status === "done");
    if (allDone) {
      await supabase
        .from("projects")
        .update({ status: "done" })
        .eq("id", project.id);
      log(dubId, "All dubs done — project marked as done");
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    log(dubId, `FAILED: ${errMsg}`);
    console.error(`[DUB:${dubId.slice(0, 8)}] Full error:`, error);
    await supabase
      .from("dubs")
      .update({
        status: "error",
        error_message: errMsg,
      })
      .eq("id", dubId);

    // Check if ALL dubs for this project have failed/completed
    const projectId = dub?.project_id;
    if (projectId) {
      const { data: allDubs } = await supabase
        .from("dubs")
        .select("status")
        .eq("project_id", projectId);
      const allFinished = allDubs?.every((d) => ["done", "error"].includes(d.status));
      if (allFinished) {
        const anyDone = allDubs?.some((d) => d.status === "done");
        await supabase
          .from("projects")
          .update({ status: anyDone ? "done" : "error" })
          .eq("id", projectId);
        log(dubId, `All dubs finished — project status: ${anyDone ? "done" : "error"}`);
      }
    }
  }
}
