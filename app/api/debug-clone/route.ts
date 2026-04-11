import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const service = await createServiceClient();

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

  const debug: Record<string, unknown> = {
    projectId: project.id,
    title: project.title,
    duration: project.duration_seconds,
    videoUrl: project.original_video_url,
    buildVersion: "v5-sdk-readstream",
  };

  // Download sample
  const videoDir = (project.original_video_url as string).split("/").slice(0, -1).join("/");
  let sampleBuffer: Buffer | null = null;

  for (const name of ["extracted-audio.webm", "extracted-audio.mp4"]) {
    try {
      const { data } = await service.storage.from("videos").download(`${videoDir}/${name}`);
      if (data) { sampleBuffer = Buffer.from(await data.arrayBuffer()); debug.source = name; break; }
    } catch { continue; }
  }
  if (!sampleBuffer) {
    try {
      const { data } = await service.storage.from("videos").download(project.original_video_url as string);
      if (data) { sampleBuffer = Buffer.from(await data.arrayBuffer()); debug.source = "video file"; }
    } catch {}
  }

  debug.sampleSize = sampleBuffer?.length || 0;
  if (!sampleBuffer) return NextResponse.json({ ...debug, error: "No sample" });

  // Clone using lib/cartesia.ts (ReadStream approach)
  try {
    const { cloneVoice, deleteVoice } = await import("@/lib/cartesia");
    const voiceId = await cloneVoice(sampleBuffer, "debug", project.original_language as string || "en");
    debug.cloneOk = true;
    debug.voiceId = voiceId;
    await deleteVoice(voiceId);
    debug.cleaned = true;
  } catch (e) {
    debug.cloneOk = false;
    debug.cloneError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(debug);
}
