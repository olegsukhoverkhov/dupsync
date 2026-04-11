import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { extractAudioViaFal } from "@/lib/ai";

export const maxDuration = 120;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const service = await createServiceClient();
  const steps: string[] = [];

  let project: Record<string, unknown> | null = null;
  if (projectId) {
    const { data } = await service.from("projects").select("*").eq("id", projectId).single();
    project = data;
  }
  if (!project) {
    const { data } = await service.from("projects").select("*").eq("is_demo", false).order("created_at", { ascending: false }).limit(1).single();
    project = data;
  }
  if (!project) return NextResponse.json({ error: "No projects" });

  const videoUrl = project.original_video_url as string;
  const videoDir = videoUrl.split("/").slice(0, -1).join("/");

  steps.push(`Project: ${project.id} "${project.title}" ${project.duration_seconds}s`);
  steps.push(`Video: ${videoUrl}`);

  // Step 1: List all files in project directory
  const { data: files } = await service.storage.from("videos").list(videoDir, { limit: 20 });
  const fileList = (files || []).map(f => `${f.name} (${f.metadata?.size || '?'} bytes)`);
  steps.push(`Files in dir: ${fileList.join(", ") || "NONE"}`);

  // Step 2: Try audio extraction via fal.ai synchronous endpoint
  const hasExtracted = (files || []).some(f => f.name.startsWith("extracted-audio"));
  steps.push(`Has extracted audio: ${hasExtracted}`);

  if (!hasExtracted) {
    steps.push("Extracting audio via fal.ai (synchronous)...");

    try {
      // Get signed URL for the video
      const { data: signed } = await service.storage.from("videos").createSignedUrl(videoUrl, 600);
      steps.push(`Signed URL: ${signed?.signedUrl ? "OK" : "FAILED"}`);

      if (signed?.signedUrl) {
        const audioUrl = await extractAudioViaFal(signed.signedUrl);
        steps.push(`fal.ai audio URL: ${audioUrl.slice(0, 100)}`);

        // Download the extracted audio
        const audioRes = await fetch(audioUrl);
        steps.push(`Audio download: HTTP ${audioRes.status}`);

        if (audioRes.ok) {
          const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
          steps.push(`Audio size: ${audioBuffer.length} bytes (${(audioBuffer.length / 1024).toFixed(0)}KB)`);

          // Upload to storage
          const audioPath = `${videoDir}/extracted-audio.wav`;
          const { error: upErr } = await service.storage.from("videos").upload(
            audioPath, audioBuffer, { contentType: "audio/wav", upsert: true }
          );
          steps.push(`Upload: ${upErr ? `FAILED ${upErr.message}` : "OK"}`);
        }
      }
    } catch (e) {
      steps.push(`Extraction error: ${e instanceof Error ? e.message : e}`);
    }

    // Re-list files
    const { data: files2 } = await service.storage.from("videos").list(videoDir, { limit: 20 });
    const fileList2 = (files2 || []).map(f => `${f.name} (${f.metadata?.size || '?'} bytes)`);
    steps.push(`Files after extraction: ${fileList2.join(", ") || "NONE"}`);
  }

  // Step 3: Try voice clone
  steps.push("Attempting voice clone...");
  let sampleBuffer: Buffer | null = null;
  let sampleSource = "";

  for (const name of ["extracted-audio.wav", "extracted-audio.webm", "extracted-audio.mp4"]) {
    try {
      const { data } = await service.storage.from("videos").download(`${videoDir}/${name}`);
      if (data) { sampleBuffer = Buffer.from(await data.arrayBuffer()); sampleSource = name; break; }
    } catch { continue; }
  }
  if (!sampleBuffer) {
    try {
      const { data } = await service.storage.from("videos").download(videoUrl);
      if (data) { sampleBuffer = Buffer.from(await data.arrayBuffer()); sampleSource = "video file"; }
    } catch {}
  }

  steps.push(`Sample: ${sampleSource} (${sampleBuffer?.length || 0} bytes)`);

  if (sampleBuffer) {
    try {
      const { cloneVoice, deleteVoice } = await import("@/lib/cartesia");
      const voiceId = await cloneVoice(sampleBuffer, "debug", project.original_language as string || "en");
      steps.push(`Clone OK: ${voiceId}`);
      await deleteVoice(voiceId);
      steps.push("Cleaned up");
    } catch (e) {
      steps.push(`Clone FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  return NextResponse.json({ steps });
}
