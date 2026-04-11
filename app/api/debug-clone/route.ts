import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

/**
 * POST /api/debug-clone — test voice clone on production
 * Body: { projectId: string }
 * Admin only. Returns detailed debug info.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { projectId } = await req.json().catch(() => ({})) as { projectId?: string };
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const service = await createServiceClient();
  // Use service role to access any project regardless of ownership
  const { data: project } = await service.from("projects").select("original_video_url, original_language").eq("id", projectId).single();
  if (!project) {
    // If project not found, try to test with admin's latest project
    const { data: latestProject } = await service.from("projects")
      .select("id, original_video_url, original_language")
      .eq("is_demo", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (!latestProject) return NextResponse.json({ error: "No projects found" }, { status: 404 });
    return NextResponse.json({ redirect: "Use this projectId instead", projectId: latestProject.id });
  }

  const debug: Record<string, unknown> = {
    projectId,
    originalVideoUrl: project.original_video_url,
    originalLanguage: project.original_language,
    cartesiaKeySet: !!process.env.CARTESIA_API_KEY,
    cartesiaKeyLength: process.env.CARTESIA_API_KEY?.length || 0,
  };

  // Try to download voice sample
  const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");
  const candidates = ["extracted-audio.webm", "extracted-audio.mp4", "voice-sample.wav"];
  let sampleBuffer: Buffer | null = null;
  let sampleSource = "";

  for (const candidate of candidates) {
    try {
      const { data, error } = await service.storage.from("videos").download(`${videoDir}/${candidate}`);
      if (data && !error) {
        sampleBuffer = Buffer.from(await data.arrayBuffer());
        sampleSource = candidate;
        break;
      }
    } catch { continue; }
  }

  if (!sampleBuffer) {
    try {
      const { data } = await service.storage.from("videos").download(project.original_video_url as string);
      if (data) {
        sampleBuffer = Buffer.from(await data.arrayBuffer());
        sampleSource = "original video file";
      }
    } catch (err) {
      debug.downloadError = err instanceof Error ? err.message : String(err);
    }
  }

  debug.sampleSource = sampleSource;
  debug.sampleSize = sampleBuffer?.length || 0;

  if (!sampleBuffer || sampleBuffer.length < 1000) {
    debug.error = "No usable voice sample";
    return NextResponse.json(debug);
  }

  // Detect MIME
  const buf = sampleBuffer;
  let mimeType = "application/octet-stream";
  if (buf[0] === 0x1a && buf[1] === 0x45) mimeType = "audio/webm";
  else if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) mimeType = "video/mp4";
  else if (buf[0] === 0x52 && buf[1] === 0x49) mimeType = "audio/wav";
  debug.detectedMime = mimeType;

  // Try clone
  try {
    const { cloneVoice, deleteVoice } = await import("@/lib/cartesia");
    const voiceId = await cloneVoice(sampleBuffer, "debug-test", project.original_language as string || "en");
    debug.cloneSuccess = true;
    debug.voiceId = voiceId;

    // Test TTS
    const { textToSpeech } = await import("@/lib/cartesia");
    const ttsResult = await textToSpeech("Hello test", voiceId, "en");
    debug.ttsSuccess = true;
    debug.ttsSize = ttsResult.length;

    // Cleanup
    await deleteVoice(voiceId);
    debug.cleaned = true;
  } catch (err) {
    debug.cloneSuccess = false;
    debug.cloneError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(debug);
}
