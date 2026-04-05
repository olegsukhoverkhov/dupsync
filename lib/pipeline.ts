import { createServiceClient } from "./supabase/server";
import * as ai from "./ai";
import { LANGUAGE_MAP } from "./supabase/constants";

export async function runTranscription(projectId: string) {
  const supabase = await createServiceClient();

  try {
    // Update status
    await supabase
      .from("projects")
      .update({ status: "transcribing" })
      .eq("id", projectId);

    // Get project
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!project?.original_video_url) {
      throw new Error("No video URL found");
    }

    // Download video from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("videos")
      .download(project.original_video_url);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download video: ${downloadError?.message}`);
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Transcribe — use original filename extension for correct MIME type
    const ext = (project.original_video_url.split(".").pop() || "mp4").toLowerCase();
    const { segments, language } = await ai.transcribe(buffer, `video.${ext}`);

    // Update project with transcript
    await supabase
      .from("projects")
      .update({
        status: "ready",
        transcript: segments,
        original_language: language,
      })
      .eq("id", projectId);
  } catch (error) {
    console.error("Transcription failed:", error);
    await supabase
      .from("projects")
      .update({
        status: "error",
      })
      .eq("id", projectId);
  }
}

export async function runDubbing(dubId: string) {
  const supabase = await createServiceClient();

  try {
    // Get dub with project
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

    // Step 1: Translate (0-25%)
    await supabase
      .from("dubs")
      .update({ status: "translating", progress: 10 })
      .eq("id", dubId);

    const translatedSegments = await ai.translate(
      transcript,
      sourceLang,
      targetLang
    );

    await supabase
      .from("dubs")
      .update({
        translated_transcript: translatedSegments,
        progress: 25,
      })
      .eq("id", dubId);

    // Step 2: Clone voice & generate TTS (25-60%)
    await supabase
      .from("dubs")
      .update({ status: "generating_voice", progress: 30 })
      .eq("id", dubId);

    // Download original video for voice sample
    const { data: videoData } = await supabase.storage
      .from("videos")
      .download(project.original_video_url as string);

    if (!videoData) throw new Error("Failed to download video for voice clone");

    const videoBuffer = Buffer.from(await videoData.arrayBuffer());
    const voiceId = await ai.cloneVoice(videoBuffer, dub.id);

    // Generate TTS for all segments
    const fullText = translatedSegments.map((s) => s.text).join(" ");
    const audioBuffer = await ai.textToSpeech(fullText, voiceId);

    // Upload generated audio
    const audioPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-audio.mp3`;
    await supabase.storage
      .from("videos")
      .upload(audioPath, audioBuffer, { contentType: "audio/mpeg" });

    await supabase
      .from("dubs")
      .update({ progress: 60 })
      .eq("id", dubId);

    // Step 3: Lip sync (60-90%)
    await supabase
      .from("dubs")
      .update({ status: "lip_syncing", progress: 65 })
      .eq("id", dubId);

    const { data: videoSignedUrl } = await supabase.storage
      .from("videos")
      .createSignedUrl(project.original_video_url as string, 3600);

    const { data: audioSignedUrl } = await supabase.storage
      .from("videos")
      .createSignedUrl(audioPath, 3600);

    if (!videoSignedUrl?.signedUrl || !audioSignedUrl?.signedUrl) {
      throw new Error("Failed to create signed URLs");
    }

    const syncedVideoUrl = await ai.lipSync(
      videoSignedUrl.signedUrl,
      audioSignedUrl.signedUrl
    );

    await supabase
      .from("dubs")
      .update({ progress: 90, status: "merging" })
      .eq("id", dubId);

    // Step 4: Download synced video and upload to storage (90-100%)
    const syncedResponse = await fetch(syncedVideoUrl);
    const syncedBuffer = Buffer.from(await syncedResponse.arrayBuffer());

    const outputPath = `${project.user_id}/${project.id}/${dub.id}/dubbed-video.mp4`;
    await supabase.storage
      .from("videos")
      .upload(outputPath, syncedBuffer, { contentType: "video/mp4" });

    // Mark as done
    await supabase
      .from("dubs")
      .update({
        status: "done",
        progress: 100,
        dubbed_video_url: outputPath,
      })
      .eq("id", dubId);

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
    }
  } catch (error) {
    console.error("Dubbing failed:", error);
    await supabase
      .from("dubs")
      .update({
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })
      .eq("id", dubId);
  }
}
