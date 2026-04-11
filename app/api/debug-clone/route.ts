import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

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

  // Step 2: Check ffmpeg-static and try extraction
  const hasExtracted = (files || []).some(f => f.name.startsWith("extracted-audio"));
  steps.push(`Has extracted audio: ${hasExtracted}`);

  if (!hasExtracted) {
    steps.push("Extracting audio via ffmpeg-static...");
    try {
      const fs = await import("fs");
      const os = await import("os");
      const path = await import("path");
      const { execSync } = await import("child_process");
      const ffmpegPath = (await import("ffmpeg-static")).default;

      steps.push(`ffmpeg path: ${ffmpegPath}`);
      const exists = fs.existsSync(ffmpegPath as string);
      steps.push(`ffmpeg exists: ${exists}`);

      if (exists) {
        const version = execSync(`"${ffmpegPath}" -version`, { timeout: 5000 }).toString().split("\n")[0];
        steps.push(`ffmpeg version: ${version}`);

        // Download video
        const { data: videoData } = await service.storage.from("videos").download(videoUrl);
        if (videoData) {
          const videoBuffer = Buffer.from(await videoData.arrayBuffer());
          steps.push(`Video downloaded: ${(videoBuffer.length / 1024).toFixed(0)}KB`);

          const tempVideo = path.join(os.tmpdir(), `debug-in-${Date.now()}.mov`);
          const tempAudio = path.join(os.tmpdir(), `debug-out-${Date.now()}.wav`);
          fs.writeFileSync(tempVideo, videoBuffer);

          execSync(`"${ffmpegPath}" -i "${tempVideo}" -vn -acodec pcm_s16le -ar 44100 -ac 1 "${tempAudio}" -y`, {
            timeout: 30000, stdio: "pipe",
          });

          const audioBuffer = fs.readFileSync(tempAudio);
          steps.push(`Audio extracted: ${(audioBuffer.length / 1024).toFixed(0)}KB WAV`);

          // Upload
          const audioPath = `${videoDir}/extracted-audio.wav`;
          const { error: upErr } = await service.storage.from("videos").upload(
            audioPath, audioBuffer, { contentType: "audio/wav", upsert: true }
          );
          steps.push(`Upload: ${upErr ? `FAILED ${upErr.message}` : "OK"}`);

          try { fs.unlinkSync(tempVideo); } catch {}
          try { fs.unlinkSync(tempAudio); } catch {}
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
