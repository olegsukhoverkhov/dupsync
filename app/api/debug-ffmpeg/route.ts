import { NextResponse } from "next/server";

export async function GET() {
  const debug: Record<string, unknown> = {};

  try {
    const ffmpegPath = (await import("ffmpeg-static")).default;
    debug.ffmpegPath = ffmpegPath;

    const fs = await import("fs");
    debug.exists = fs.existsSync(ffmpegPath as string);

    if (debug.exists) {
      const { execSync } = await import("child_process");
      const version = execSync(`"${ffmpegPath}" -version`, { timeout: 5000 }).toString().split("\n")[0];
      debug.version = version;
    }
  } catch (e) {
    debug.error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(debug);
}
