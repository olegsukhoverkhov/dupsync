import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET() {
  const results: Record<string, string> = {};

  try {
    // Check env
    results["ASSEMBLYAI_KEY"] = process.env.ASSEMBLYAI_API_KEY ? `set (${process.env.ASSEMBLYAI_API_KEY.slice(0, 6)}...)` : "MISSING";

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
      return NextResponse.json({ ...results, error: "no error projects" });
    }

    // Download
    const { data: fileData } = await supabase.storage
      .from("videos")
      .download(project.original_video_url);

    if (!fileData) {
      return NextResponse.json({ ...results, error: "download failed" });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    results["file_size"] = `${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`;

    // Test AssemblyAI directly
    const apiKey = process.env.ASSEMBLYAI_API_KEY!;

    // Step 1: Upload
    results["step"] = "uploading to AssemblyAI...";
    const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/octet-stream",
      },
      body: new Uint8Array(buffer),
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      results["upload_error"] = `${uploadRes.status}: ${err.slice(0, 300)}`;
      return NextResponse.json(results);
    }

    const { upload_url } = await uploadRes.json();
    results["upload"] = `ok: ${upload_url}`;

    // Step 2: Create transcript
    const txRes = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_code: "en",
      }),
    });

    if (!txRes.ok) {
      const err = await txRes.text();
      results["transcript_create_error"] = `${txRes.status}: ${err.slice(0, 300)}`;
      return NextResponse.json(results);
    }

    const { id: txId } = await txRes.json();
    results["transcript_id"] = txId;

    // Step 3: Poll
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${txId}`, {
        headers: { Authorization: apiKey },
      });
      const data = await pollRes.json();

      if (data.status === "completed") {
        results["assemblyai"] = `SUCCESS: ${data.words?.length || 0} words, text="${(data.text || "").slice(0, 200)}"`;
        return NextResponse.json(results);
      }
      if (data.status === "error") {
        results["assemblyai"] = `ERROR: ${data.error}`;
        return NextResponse.json(results);
      }
      results["poll"] = `${i}: ${data.status}`;
    }

    results["assemblyai"] = "TIMEOUT after 90s";
  } catch (e) {
    results["exception"] = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results);
}
