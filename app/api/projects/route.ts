import { NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runTranscription } from "@/lib/pipeline";

export const maxDuration = 300;

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, dubs(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, videoPath, language } = body;

  if (!title || !videoPath) {
    return NextResponse.json(
      { error: "Title and videoPath are required" },
      { status: 400 }
    );
  }

  // Create project
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title,
      original_video_url: videoPath,
      original_language: language || "auto",
      status: "transcribing",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Run transcription after response is sent — keeps function alive on Vercel
  after(async () => {
    try {
      await runTranscription(project.id);
    } catch (err) {
      console.error("Transcription background task failed:", err);
    }
  });

  return NextResponse.json(project, { status: 201 });
}
