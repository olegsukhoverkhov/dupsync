import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runTranscription } from "@/lib/pipeline";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import { detectPlatform } from "@/lib/url-import";
import type { PlanType } from "@/lib/supabase/types";
import { randomUUID } from "crypto";

export const maxDuration = 300;

/**
 * POST /api/projects/import-url
 * Download a video from a social media URL and create a project.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { url, language } = body as { url?: string; language?: string };

  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  // Validate platform
  const { valid, platform, label } = detectPlatform(url);
  if (!valid) {
    return NextResponse.json(
      { error: "Unsupported URL. Paste a link from YouTube, Instagram, TikTok, or Facebook." },
      { status: 400 }
    );
  }

  // Get user plan limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan: PlanType = (profile?.plan as PlanType) || "free";
  const planLimits = PLAN_LIMITS[plan];

  try {
    const fs = await import("fs");
    const os = await import("os");
    const path = await import("path");
    const { execSync } = await import("child_process");

    // Ensure yt-dlp binary exists
    const ytdlpPath = await ensureYtDlp();

    // Step 1: Get video metadata (title, duration)
    console.log(`[IMPORT_URL] Fetching metadata from ${label}: ${url}`);
    let title = "Imported video";
    let duration = 0;
    try {
      const metaRaw = execSync(
        `"${ytdlpPath}" --no-warnings --no-download --print title --print duration ${JSON.stringify(url)}`,
        { timeout: 30000, stdio: ["pipe", "pipe", "pipe"] }
      ).toString().trim();
      const lines = metaRaw.split("\n");
      if (lines[0]) title = lines[0].slice(0, 100);
      if (lines[1]) duration = Math.ceil(parseFloat(lines[1]) || 0);
    } catch (metaErr) {
      console.warn(`[IMPORT_URL] Metadata fetch failed:`, metaErr instanceof Error ? metaErr.message : metaErr);
    }

    // Step 2: Check duration against plan limits
    if (planLimits.maxVideoSeconds > 0 && duration > planLimits.maxVideoSeconds) {
      return NextResponse.json(
        { error: `Video is too long (${duration}s). Your ${planLimits.name} plan allows max ${planLimits.maxVideoSeconds}s.` },
        { status: 413 }
      );
    }

    // Step 3: Download video
    const uuid = randomUUID();
    const tmpFile = path.join(os.tmpdir(), `import-${uuid}.mp4`);
    console.log(`[IMPORT_URL] Downloading video from ${label}...`);

    try {
      execSync(
        `"${ytdlpPath}" --no-warnings -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b" --no-playlist --max-filesize ${planLimits.maxFileSize}M -o ${JSON.stringify(tmpFile)} ${JSON.stringify(url)}`,
        { timeout: 240000, stdio: ["pipe", "pipe", "pipe"] }
      );
    } catch (dlErr) {
      const errObj = dlErr as { stderr?: Buffer; message?: string };
      const stderr = errObj.stderr ? errObj.stderr.toString() : "";
      const msg = stderr || errObj.message || String(dlErr);
      console.error(`[IMPORT_URL] Download error:`, msg.slice(0, 500));
      if (msg.includes("Private") || msg.includes("login") || msg.includes("Sign in") || msg.includes("requires authentication")) {
        return NextResponse.json(
          { error: "This video is private or requires login. Only public videos can be imported." },
          { status: 403 }
        );
      }
      if (msg.includes("max-filesize")) {
        return NextResponse.json(
          { error: `Video file is too large (max ${planLimits.maxFileSize}MB for ${planLimits.name} plan).` },
          { status: 413 }
        );
      }
      if (msg.includes("not available") || msg.includes("Video unavailable") || msg.includes("404")) {
        return NextResponse.json(
          { error: "Video not found or unavailable." },
          { status: 404 }
        );
      }
      throw new Error(`Download failed: ${msg.slice(0, 300)}`);
    }

    if (!fs.existsSync(tmpFile)) {
      return NextResponse.json({ error: "Failed to download video. The URL may be invalid or the video unavailable." }, { status: 400 });
    }

    const fileSize = fs.statSync(tmpFile).size;
    console.log(`[IMPORT_URL] Downloaded: ${(fileSize / 1024 / 1024).toFixed(1)}MB`);

    // Step 4: Upload to Supabase storage
    const storagePath = `${user.id}/${uuid}/original.mp4`;
    const videoBuffer = fs.readFileSync(tmpFile);

    const service = await createServiceClient();
    const { error: uploadErr } = await service.storage
      .from("videos")
      .upload(storagePath, videoBuffer, { contentType: "video/mp4", upsert: true });

    // Cleanup temp file
    try { fs.unlinkSync(tmpFile); } catch {}

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

/**
 * Ensure yt-dlp binary is available in /tmp.
 * Downloads from GitHub releases on first call.
 */
async function ensureYtDlp(): Promise<string> {
  const fs = await import("fs");
  const path = await import("path");
  const os = await import("os");

  const binPath = path.join(os.tmpdir(), "yt-dlp");

  if (fs.existsSync(binPath)) {
    return binPath;
  }

  console.log("[IMPORT_URL] Downloading yt-dlp binary...");

  const { execSync } = await import("child_process");

  // Download latest yt-dlp Linux binary from GitHub
  const dlUrl = process.platform === "darwin"
    ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"
    : "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";

  execSync(`curl -L -o "${binPath}" "${dlUrl}"`, { timeout: 30000, stdio: "pipe" });
  execSync(`chmod +x "${binPath}"`, { stdio: "pipe" });

  // Verify
  const version = execSync(`"${binPath}" --version`, { timeout: 5000 }).toString().trim();
  console.log(`[IMPORT_URL] yt-dlp ${version} ready`);

  return binPath;
}
