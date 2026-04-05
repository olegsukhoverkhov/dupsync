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

    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Downloading video: ${project.original_video_url}`);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("videos")
      .download(project.original_video_url);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download video: ${downloadError?.message}`);
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Video size: ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`);

    const ext = (project.original_video_url.split(".").pop() || "mp4").toLowerCase();
    const languageHint = project.original_language !== "auto" ? project.original_language : undefined;

    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Calling Whisper API (ext=${ext}, lang=${languageHint || "auto"})`);
    const { segments, language } = await ai.transcribe(buffer, `video.${ext}`, languageHint);

    console.log(`[TRANSCRIBE:${projectId.slice(0, 8)}] Transcription done: ${segments.length} segments, language=${language}`);

    await supabase
      .from("projects")
      .update({
        status: "ready",
        transcript: segments,
        original_language: language,
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

  try {
    log(dubId, "Starting dubbing pipeline");

    const { data: dub } = await supabase
      .from("dubs")
      .select("*, projects(*)")
      .eq("id", dubId)
      .single();

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

    // Step 2: Generate TTS (30-80%)
    await supabase
      .from("dubs")
      .update({ status: "generating_voice", progress: 35 })
      .eq("id", dubId);

    log(dubId, "Getting multilingual voice");
    const voiceId = await ai.getMultilingualVoice();
    log(dubId, `Using voice: ${voiceId}`);

    const fullText = translatedSegments.map((s) => s.text).join(" ");
    log(dubId, `Generating TTS (${fullText.length} chars)`);

    const audioBuffer = await ai.textToSpeech(fullText, voiceId);
    log(dubId, `TTS done: ${(audioBuffer.byteLength / 1024).toFixed(0)}KB audio`);

    // Upload dubbed audio
    const audioPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-audio.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(audioPath, audioBuffer, { contentType: "audio/mpeg", upsert: true });

    if (uploadError) {
      log(dubId, `Audio upload error: ${uploadError.message}`);
      throw new Error(`Audio upload failed: ${uploadError.message}`);
    }

    log(dubId, "Audio uploaded successfully");

    await supabase
      .from("dubs")
      .update({ progress: 80 })
      .eq("id", dubId);

    // Step 3: Skip lip sync for now (Vercel timeout), mark as done with audio only
    // Lip sync can be added later as async job or external worker
    await supabase
      .from("dubs")
      .update({ status: "merging", progress: 90 })
      .eq("id", dubId);

    log(dubId, "Creating signed URL for dubbed audio");

    const { data: audioSignedUrl } = await supabase.storage
      .from("videos")
      .createSignedUrl(audioPath, 86400); // 24h

    // Mark as done — dubbed_video_url stores the audio path for now
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        dubbed_video_url: audioPath,
      })
      .eq("id", dubId);

    log(dubId, "Dubbing COMPLETE");

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
  }
}
