import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runTranscription } from "@/lib/pipeline";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import { detectPlatform } from "@/lib/url-import";
import type { PlanType } from "@/lib/supabase/types";
import { randomUUID } from "crypto";

export const maxDuration = 300;

const COBALT_API = process.env.COBALT_API_URL || "https://cobalt-production-eda4.up.railway.app";

/**
 * POST /api/projects/import-url
 * Download a video from a social media URL via Cobalt API and create a project.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { url, language } = body as { url?: string; language?: string };

  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  const { valid, platform, label } = detectPlatform(url);
  if (!valid) {
    return NextResponse.json(
      { error: "Unsupported URL. Paste a link from YouTube, Instagram, TikTok, or Facebook." },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan: PlanType = (profile?.plan as PlanType) || "free";
  const planLimits = PLAN_LIMITS[plan];

  try {
    console.log(`[IMPORT_URL] Requesting download from ${label}: ${url}`);

    // Step 1: Request download URL from Cobalt
    const cobaltRes = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        videoQuality: "1080",
        youtubeVideoCodec: "h264",
      }),
    });

    if (!cobaltRes.ok) {
      const errText = await cobaltRes.text().catch(() => "");
      console.error(`[IMPORT_URL] Cobalt error: ${cobaltRes.status} ${errText.slice(0, 300)}`);
      if (cobaltRes.status === 400) {
        return NextResponse.json(
          { error: "This video is private, unavailable, or not supported." },
          { status: 400 }
        );
      }
      throw new Error(`Cobalt API error: ${cobaltRes.status}`);
    }

    const cobaltData = await cobaltRes.json() as {
      status: string;
      url?: string;
      filename?: string;
      error?: { code?: string };
      picker?: Array<{ url: string; type: string }>;
    };

    console.log(`[IMPORT_URL] Cobalt response: status=${cobaltData.status}`);

    let downloadUrl: string | null = null;
    let title = "Imported video";

    if (cobaltData.status === "tunnel" || cobaltData.status === "redirect") {
      downloadUrl = cobaltData.url || null;
      if (cobaltData.filename) {
        title = cobaltData.filename.replace(/\.[^.]+$/, "").slice(0, 100);
      }
    } else if (cobaltData.status === "picker" && cobaltData.picker?.length) {
      // Multiple options — pick first video
      const videoItem = cobaltData.picker.find(p => p.type === "video") || cobaltData.picker[0];
      downloadUrl = videoItem?.url || null;
    } else if (cobaltData.status === "error") {
      return NextResponse.json(
        { error: "This video is private, unavailable, or not supported." },
        { status: 400 }
      );
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Could not get download URL for this video." },
        { status: 400 }
      );
    }

    // Step 2: Download the video file
    console.log(`[IMPORT_URL] Downloading video...`);
    const videoRes = await fetch(downloadUrl);
    if (!videoRes.ok) {
      throw new Error(`Video download failed: ${videoRes.status}`);
    }

    const videoBuffer = Buffer.from(await videoRes.arrayBuffer());
    const sizeMB = videoBuffer.length / (1024 * 1024);
    console.log(`[IMPORT_URL] Downloaded: ${sizeMB.toFixed(1)}MB`);

    // Step 3: Check file size
    if (sizeMB > planLimits.maxFileSize) {
      return NextResponse.json(
        { error: `Video file is too large (${sizeMB.toFixed(0)}MB). Max ${planLimits.maxFileSize}MB for ${planLimits.name} plan.` },
        { status: 413 }
      );
    }

    // Step 4: Upload to Supabase storage
    const uuid = randomUUID();
    const storagePath = `${user.id}/${uuid}/original.mp4`;

    const service = await createServiceClient();
    const { error: uploadErr } = await service.storage
      .from("videos")
      .upload(storagePath, videoBuffer, { contentType: "video/mp4", upsert: true });

    if (uploadErr) {
      throw new Error(`Storage upload failed: ${uploadErr.message}`);
    }

    console.log(`[IMPORT_URL] Uploaded to ${storagePath}`);

    // Step 5: Create project
    const { data: project, error: projectErr } = await service
      .from("projects")
      .insert({
        user_id: user.id,
        title: title || "Imported video",
        original_video_url: storagePath,
        original_language: language || "auto",
        status: "transcribing",
        source_url: url,
        source_platform: platform,
      })
      .select()
      .single();

    if (projectErr) {
      throw new Error(`Project creation failed: ${projectErr.message}`);
    }

    console.log(`[IMPORT_URL] Project created: ${project.id}`);

    // Step 6: Run transcription
    try {
      await runTranscription(project.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transcription failed";
      await service.from("projects").update({ status: "error", error_message: msg }).eq("id", project.id);
    }

    return NextResponse.json(project);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error(`[IMPORT_URL] Error:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
