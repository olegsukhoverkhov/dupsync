import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runTranscription } from "@/lib/pipeline";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectId, language } = body;

  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  // Verify project belongs to user
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Update language hint
  if (language) {
    await supabase
      .from("projects")
      .update({ original_language: language, status: "transcribing", transcript: null })
      .eq("id", projectId);
  }

  // Run transcription in background
  after(async () => {
    try {
      await runTranscription(projectId);
    } catch (err) {
      console.error("Re-transcription failed:", err);
    }
  });

  return NextResponse.json({ ok: true });
}
