import { NextResponse } from "next/server";

export const maxDuration = 120;

export async function GET() {
  const results: Record<string, string> = {};

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get latest error project
    const { data: project } = await supabase
      .from("projects")
      .select("original_video_url")
      .eq("status", "error")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!project?.original_video_url) {
      return NextResponse.json({ error: "no error projects" });
    }

    results["video_url"] = project.original_video_url;
    const ext = project.original_video_url.split(".").pop()?.toLowerCase() || "mp4";
    results["ext"] = ext;

    // Download
    const { data: fileData, error: dlErr } = await supabase.storage
      .from("videos")
      .download(project.original_video_url);

    if (dlErr || !fileData) {
      results["download"] = `error: ${dlErr?.message}`;
      return NextResponse.json(results);
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    results["download"] = `ok, ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`;

    // Try multiple formats
    const formats = [
      { filename: "audio.mp4", mime: "video/mp4" },
      { filename: "audio.m4a", mime: "audio/mp4" },
      { filename: "audio.mpeg", mime: "video/mpeg" },
    ];

    for (const fmt of formats) {
      try {
        const formData = new FormData();
        formData.append(
          "file",
          new Blob([new Uint8Array(buffer)], { type: fmt.mime }),
          fmt.filename
        );
        formData.append("model", "whisper-1");
        formData.append("response_format", "verbose_json");
        formData.append("timestamp_granularities[]", "segment");
        formData.append("language", "en");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          results[`${fmt.filename}`] = `SUCCESS: ${data.segments?.length || 0} segments, lang=${data.language}`;
          break; // Stop on first success
        } else {
          const err = await response.text();
          results[`${fmt.filename}`] = `${response.status}: ${err.slice(0, 150)}`;
        }
      } catch (e) {
        results[`${fmt.filename}`] = `exception: ${e instanceof Error ? e.message : String(e)}`;
      }
    }
  } catch (e) {
    results["error"] = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results);
}
