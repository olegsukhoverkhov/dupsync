import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { writeFile, readFile, unlink, stat } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execFileAsync = promisify(execFile);

export const maxDuration = 60;

export async function GET() {
  const results: Record<string, string> = {};

  // 1. Check if ffmpeg-static binary exists
  try {
    const ffmpegModule = await import("ffmpeg-static");
    const ffmpegPath = ffmpegModule.default as unknown as string;
    results["ffmpeg_path"] = ffmpegPath || "null";

    if (ffmpegPath) {
      try {
        const stats = await stat(ffmpegPath);
        results["ffmpeg_exists"] = `yes, size=${stats.size}, mode=${stats.mode.toString(8)}`;
      } catch (e) {
        results["ffmpeg_exists"] = `no: ${e instanceof Error ? e.message : String(e)}`;
      }

      // Try running ffmpeg -version
      try {
        const { stdout } = await execFileAsync(ffmpegPath, ["-version"], { timeout: 5000 });
        results["ffmpeg_version"] = stdout.split("\n")[0];
      } catch (e) {
        results["ffmpeg_version"] = `error: ${e instanceof Error ? e.message : String(e)}`;
      }
    }
  } catch (e) {
    results["ffmpeg_import"] = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 2. Download the latest error project's video and try to convert
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: project } = await supabase
      .from("projects")
      .select("original_video_url")
      .eq("status", "error")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (project?.original_video_url) {
      results["video_url"] = project.original_video_url;

      const { data: fileData, error: dlErr } = await supabase.storage
        .from("videos")
        .download(project.original_video_url);

      if (dlErr || !fileData) {
        results["download"] = `error: ${dlErr?.message}`;
      } else {
        const buffer = Buffer.from(await fileData.arrayBuffer());
        results["download"] = `ok, ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`;

        // Try ffmpeg conversion
        const ffmpegModule = await import("ffmpeg-static");
        const ffmpegPath = ffmpegModule.default as unknown as string;

        if (ffmpegPath) {
          const id = Date.now().toString();
          const inputPath = join(tmpdir(), `test-${id}.mov`);
          const outputPath = join(tmpdir(), `test-${id}.wav`);

          try {
            await writeFile(inputPath, buffer);
            results["input_written"] = `${inputPath}, ${buffer.byteLength} bytes`;

            const { stdout, stderr } = await execFileAsync(ffmpegPath, [
              "-i", inputPath,
              "-vn", "-ar", "16000", "-ac", "1", "-f", "wav",
              "-y", outputPath,
            ], { timeout: 30000 });

            results["ffmpeg_stdout"] = stdout.slice(0, 200) || "(empty)";
            results["ffmpeg_stderr"] = stderr.slice(0, 300) || "(empty)";

            try {
              const outputBuffer = await readFile(outputPath);
              results["output"] = `ok, ${(outputBuffer.byteLength / 1024).toFixed(0)}KB WAV`;

              // Try Whisper with the WAV
              const { transcribe } = await import("@/lib/ai");
              const result = await transcribe(outputBuffer, "audio.wav", "en");
              results["whisper"] = `SUCCESS! ${result.segments.length} segments, lang=${result.language}`;
            } catch (e) {
              results["output_read"] = `error: ${e instanceof Error ? e.message : String(e)}`;
            }
          } catch (e) {
            results["ffmpeg_exec"] = `error: ${e instanceof Error ? e.message : String(e)}`;
          } finally {
            await unlink(inputPath).catch(() => {});
            await unlink(outputPath).catch(() => {});
          }
        }
      }
    } else {
      results["project"] = "no error projects found";
    }
  } catch (e) {
    results["test"] = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results);
}
