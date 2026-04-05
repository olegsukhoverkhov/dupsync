import { NextResponse } from "next/server";
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

  // Check for duplicate project name
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id)
    .eq("title", title)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: `A project named "${title}" already exists. Please choose a different name.` },
      { status: 409 }
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

  // Run transcription synchronously — client polls for status
  // Using after() was unreliable on some Vercel deployments
  try {
    await runTranscription(project.id);
  } catch (err) {
    console.error("Transcription failed:", err);
    // Project status already set to "error" by pipeline
  }

  // Re-fetch project with updated status
  const { data: updatedProject } = await supabase
    .from("projects")
    .select("*")
    .eq("id", project.id)
    .single();

  return NextResponse.json(updatedProject || project, { status: 201 });
}
