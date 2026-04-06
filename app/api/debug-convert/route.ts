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

    const { data: fileData } = await supabase.storage
      .from("videos")
      .download(project.original_video_url);

    if (!fileData) {
      return NextResponse.json({ error: "download failed" });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    results["file"] = `${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`;

    // Test GPT-4o audio directly
    results["gpt4o_test"] = "starting...";
    const base64Audio = buffer.toString("base64");
    results["base64_size"] = `${(base64Audio.length / 1024 / 1024).toFixed(2)}MB`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-audio-preview",
        messages: [
          {
            role: "system",
            content: "Transcribe the audio. Return ONLY a JSON array: [{\"start\": 0.0, \"end\": 2.5, \"text\": \"Hello\"}]"
          },
          {
            role: "user",
            content: [
              {
                type: "input_audio",
                input_audio: { data: base64Audio, format: "mp4" },
              },
              { type: "text", text: "Transcribe this audio in English." },
            ],
          },
        ],
        max_tokens: 2048,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      results["gpt4o"] = `SUCCESS: ${content.slice(0, 300)}`;
    } else {
      const err = await response.text();
      results["gpt4o"] = `FAILED ${response.status}: ${err.slice(0, 300)}`;
    }
  } catch (e) {
    results["error"] = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results);
}
