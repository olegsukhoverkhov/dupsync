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

  // Step 2: Try audio extraction if no extracted-audio exists
  const hasExtracted = (files || []).some(f => f.name.startsWith("extracted-audio"));
  steps.push(`Has extracted audio: ${hasExtracted}`);

  if (!hasExtracted) {
    steps.push("Running server-side audio extraction...");
    const falKey = process.env.FAL_KEY;
    steps.push(`FAL_KEY: ${falKey ? "set" : "MISSING"}`);

    if (falKey) {
      try {
        // Get signed URL
        const { data: signed } = await service.storage.from("videos").createSignedUrl(videoUrl, 600);
        steps.push(`Signed URL: ${signed?.signedUrl ? "OK" : "FAILED"}`);

        if (signed?.signedUrl) {
          // Submit to fal.ai ffmpeg queue
          const submitRes = await fetch("https://queue.fal.run/fal-ai/ffmpeg-api", {
            method: "POST",
            headers: { Authorization: `Key ${falKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              input_files: [{ url: signed.signedUrl, filename: "input.mov" }],
              command: "-i input.mov -vn -acodec pcm_s16le -ar 44100 -ac 1 output.wav",
              output_files: ["output.wav"],
            }),
          });

          const submitText = await submitRes.text();
          steps.push(`FFmpeg submit: HTTP ${submitRes.status} ${submitText.slice(0, 200)}`);

          if (submitRes.ok) {
            const submitData = JSON.parse(submitText);
            const reqId = submitData.request_id;
            steps.push(`Request ID: ${reqId}`);

            // Poll for completion
            for (let i = 0; i < 15; i++) {
              await new Promise(r => setTimeout(r, 2000));
              const statusRes = await fetch(
                `https://queue.fal.run/fal-ai/ffmpeg-api/requests/${reqId}/status`,
                { headers: { Authorization: `Key ${falKey}` } }
              );
              const statusData = await statusRes.json() as { status?: string };
              steps.push(`Poll ${i + 1}: ${statusData.status}`);

              if (statusData.status === "COMPLETED") {
                // Get result
                const resultRes = await fetch(
                  `https://queue.fal.run/fal-ai/ffmpeg-api/requests/${reqId}`,
                  { headers: { Authorization: `Key ${falKey}` } }
                );
                const resultText = await resultRes.text();
                steps.push(`Result: HTTP ${resultRes.status} ${resultText.slice(0, 300)}`);

                if (resultRes.ok) {
                  try {
                    const result = JSON.parse(resultText);
                    const audioFileUrl = result.output_files?.[0]?.url;
                    steps.push(`Audio URL: ${audioFileUrl ? audioFileUrl.slice(0, 80) : "MISSING"}`);

                    if (audioFileUrl) {
                      const audioRes = await fetch(audioFileUrl);
                      steps.push(`Audio download: HTTP ${audioRes.status}`);
                      if (audioRes.ok) {
                        const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
                        steps.push(`Audio size: ${audioBuffer.length} bytes`);

                        // Upload
                        const audioPath = `${videoDir}/extracted-audio.wav`;
                        const { error: upErr } = await service.storage.from("videos").upload(
                          audioPath, audioBuffer, { contentType: "audio/wav", upsert: true }
                        );
                        steps.push(`Upload: ${upErr ? `FAILED ${upErr.message}` : "OK"}`);
                      }
                    }
                  } catch (e) {
                    steps.push(`Parse error: ${e instanceof Error ? e.message : e}`);
                  }
                }
                break;
              }
              if (statusData.status === "FAILED") {
                steps.push("FFmpeg FAILED");
                break;
              }
            }
          }
        }
      } catch (e) {
        steps.push(`Extraction error: ${e instanceof Error ? e.message : e}`);
      }
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
