import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 300;

export async function GET() {
  const checks: Record<string, string> = {};

  // 1. Check env vars
  checks["OPENAI_API_KEY"] = process.env.OPENAI_API_KEY ? `set (${process.env.OPENAI_API_KEY.slice(0, 10)}...)` : "MISSING";
  checks["SUPABASE_SERVICE_ROLE_KEY"] = process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "MISSING";
  checks["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING";

  // 2. Check Supabase connection
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    checks["supabase_auth"] = user ? `authenticated as ${user.email}` : "not authenticated";
  } catch (e) {
    checks["supabase_auth"] = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 3. Check if there are projects with error status
  try {
    const { createClient: createSC } = await import("@supabase/supabase-js");
    const supabase = createSC(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: errorProjects } = await supabase
      .from("projects")
      .select("id, title, status, original_video_url, created_at")
      .eq("status", "error")
      .order("created_at", { ascending: false })
      .limit(3);

    checks["error_projects"] = JSON.stringify(errorProjects);

    // 4. Check if video file exists in storage for the latest error project
    if (errorProjects && errorProjects.length > 0) {
      const project = errorProjects[0];
      if (project.original_video_url) {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("videos")
          .download(project.original_video_url);

        if (downloadError) {
          checks["video_download"] = `error: ${downloadError.message}`;
        } else if (fileData) {
          const buffer = await fileData.arrayBuffer();
          checks["video_download"] = `ok, size: ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`;

          // 5. Try Whisper API with a tiny test
          if (buffer.byteLength > 25 * 1024 * 1024) {
            checks["whisper_check"] = `FILE TOO LARGE: ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB (max 25MB)`;
          } else {
            const ext = project.original_video_url.split(".").pop() || "mp4";
            const mimeTypes: Record<string, string> = {
              mp4: "video/mp4", mov: "video/quicktime", avi: "video/x-msvideo",
              webm: "video/webm", mkv: "video/x-matroska",
            };
            const mimeType = mimeTypes[ext] || "application/octet-stream";
            checks["file_ext"] = ext;
            checks["mime_type"] = mimeType;

            try {
              // Use the exact same code path as the pipeline
              const { transcribe } = await import("@/lib/ai");
              const result = await transcribe(Buffer.from(buffer), `video.${ext}`, "en");
              checks["whisper_api"] = `success, language: ${result.language}, segments: ${result.segments.length}`;
            } catch (e) {
              checks["whisper_api"] = `exception: ${e instanceof Error ? e.message : String(e)}`;
            }
          }
        }
      }
    }
  } catch (e) {
    checks["service_client"] = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks, { status: 200 });
}
