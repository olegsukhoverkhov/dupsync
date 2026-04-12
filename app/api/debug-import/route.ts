import { NextResponse } from "next/server";

export const maxDuration = 120;

/**
 * GET /api/debug-import?url=...
 * Debug endpoint to test yt-dlp on Vercel.
 */
export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url") || "https://www.youtube.com/shorts/QV79WE8GDsY";
  const steps: string[] = [];

  try {
    const fs = await import("fs");
    const os = await import("os");
    const path = await import("path");
    const { execSync } = await import("child_process");

    // Step 1: Check ffmpeg
    try {
      const ffmpegPath = (await import("ffmpeg-static")).default;
      steps.push(`ffmpeg: ${ffmpegPath}, exists: ${fs.existsSync(ffmpegPath as string)}`);
    } catch (e) {
      steps.push(`ffmpeg: NOT FOUND (${e instanceof Error ? e.message : e})`);
    }

    // Step 2: Download yt-dlp
    const binPath = path.join(os.tmpdir(), "yt-dlp");
    if (!fs.existsSync(binPath)) {
      steps.push("Downloading yt-dlp binary...");
      const dlUrl = process.platform === "darwin"
        ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"
        : "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";
      execSync(`curl -L -o "${binPath}" "${dlUrl}"`, { timeout: 30000, stdio: "pipe" });
      execSync(`chmod +x "${binPath}"`, { stdio: "pipe" });
    }

    // Step 3: Version
    try {
      const ver = execSync(`"${binPath}" --version`, { timeout: 5000 }).toString().trim();
      steps.push(`yt-dlp version: ${ver}`);
    } catch (e) {
      steps.push(`yt-dlp version FAILED: ${e instanceof Error ? e.message : e}`);
    }

    // Step 4: Get metadata
    try {
      const meta = execSync(
        `"${binPath}" --no-warnings --no-download --print title --print duration "${url}" 2>&1`,
        { timeout: 30000 }
      ).toString().trim();
      steps.push(`Metadata: ${meta}`);
    } catch (e) {
      const err = e as { stderr?: Buffer; stdout?: Buffer; message?: string };
      steps.push(`Metadata FAILED: ${err.stderr?.toString().slice(0, 300) || err.stdout?.toString().slice(0, 300) || err.message || e}`);
    }

    // Step 5: Try download
    const tmpFile = path.join(os.tmpdir(), `debug-import-${Date.now()}.mp4`);
    try {
      const ffmpegPath = (await import("ffmpeg-static")).default;
      const ffmpegArg = ffmpegPath && fs.existsSync(ffmpegPath as string)
        ? `--ffmpeg-location "${ffmpegPath}"`
        : "";
      const formatArg = ffmpegArg
        ? `-f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b"`
        : `-f "b[ext=mp4]/b"`;

      const cmd = `"${binPath}" --no-warnings ${formatArg} ${ffmpegArg} --no-playlist -o "${tmpFile}" "${url}" 2>&1`;
      steps.push(`Command: ${cmd}`);

      const output = execSync(cmd, { timeout: 120000 }).toString();
      steps.push(`Download output: ${output.slice(0, 500)}`);

      if (fs.existsSync(tmpFile)) {
        const size = fs.statSync(tmpFile).size;
        steps.push(`File downloaded: ${(size / 1024).toFixed(0)}KB`);
        fs.unlinkSync(tmpFile);
      } else {
        steps.push("File NOT created");
      }
    } catch (e) {
      const err = e as { stderr?: Buffer; stdout?: Buffer; message?: string };
      const stderr = err.stderr?.toString().slice(0, 500) || "";
      const stdout = err.stdout?.toString().slice(0, 500) || "";
      steps.push(`Download FAILED stderr: ${stderr}`);
      steps.push(`Download FAILED stdout: ${stdout}`);
      steps.push(`Download FAILED message: ${err.message?.slice(0, 300) || ""}`);
      try { fs.unlinkSync(tmpFile); } catch {}
    }
  } catch (e) {
    steps.push(`Error: ${e instanceof Error ? e.message : e}`);
  }

  return NextResponse.json({ steps });
}
