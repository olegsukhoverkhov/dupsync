import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

/**
 * GET /api/debug-clone?projectId=xxx — test voice clone on production
 * Temporary debug endpoint. Uses service role, no auth check.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  const service = await createServiceClient();

  // If no projectId, find latest non-demo project
  let project: Record<string, unknown> | null = null;
  if (projectId) {
    const { data } = await service.from("projects").select("*").eq("id", projectId).single();
    project = data;
  }
  if (!project) {
    const { data } = await service.from("projects")
      .select("*")
      .eq("is_demo", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    project = data;
  }
  if (!project) return NextResponse.json({ error: "No projects" });

  const debug: Record<string, unknown> = {
    projectId: project.id,
    title: project.title,
    duration: project.duration_seconds,
    originalLanguage: project.original_language,
    videoUrl: project.original_video_url,
    cartesiaKeySet: !!process.env.CARTESIA_API_KEY,
    cartesiaKeyPrefix: process.env.CARTESIA_API_KEY?.slice(0, 10) || "MISSING",
  };

  // Download voice sample
  const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");
  let sampleBuffer: Buffer | null = null;
  let source = "";

  for (const name of ["extracted-audio.webm", "extracted-audio.mp4", "voice-sample.wav"]) {
    try {
      const { data } = await service.storage.from("videos").download(`${videoDir}/${name}`);
      if (data) {
        sampleBuffer = Buffer.from(await data.arrayBuffer());
        source = name;
        break;
      }
    } catch { continue; }
  }

  if (!sampleBuffer) {
    try {
      const { data } = await service.storage.from("videos").download(project.original_video_url as string);
      if (data) {
        sampleBuffer = Buffer.from(await data.arrayBuffer());
        source = "original video";
      }
    } catch (e) {
      debug.downloadError = e instanceof Error ? e.message : String(e);
    }
  }

  debug.sampleSource = source;
  debug.sampleSize = sampleBuffer?.length || 0;

  if (!sampleBuffer || sampleBuffer.length < 1000) {
    debug.error = "No usable sample";
    return NextResponse.json(debug);
  }

  // MIME
  const b = sampleBuffer;
  let mime = "application/octet-stream";
  if (b[0] === 0x1a && b[1] === 0x45) mime = "audio/webm";
  else if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) mime = "video/mp4";
  else if (b[0] === 0x52 && b[1] === 0x49) mime = "audio/wav";
  debug.mime = mime;

  // Clone
  try {
    const cartesia = await import("@/lib/cartesia");
    const voiceId = await cartesia.cloneVoice(sampleBuffer, "debug", project.original_language as string || "en");
    debug.cloneOk = true;
    debug.voiceId = voiceId;

    // TTS test
    const tts = await cartesia.textToSpeech("Hello test", voiceId, "en");
    debug.ttsOk = true;
    debug.ttsSize = tts.length;

    await cartesia.deleteVoice(voiceId);
    debug.cleaned = true;
  } catch (e) {
    debug.cloneOk = false;
    debug.cloneError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(debug);
}
