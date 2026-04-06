import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runLipSync } from "@/lib/pipeline";

export const maxDuration = 300;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dubId } = await request.json();
  if (!dubId) {
    return NextResponse.json({ error: "dubId required" }, { status: 400 });
  }

  // Verify dub belongs to user and is in audio_ready status
  const { data: dub } = await supabase
    .from("dubs")
    .select("id, status, project_id, projects(user_id)")
    .eq("id", dubId)
    .single();

  if (!dub) {
    return NextResponse.json({ error: "Dub not found" }, { status: 404 });
  }

  if (dub.status !== "audio_ready") {
    return NextResponse.json({ error: `Dub is in ${dub.status} status, not audio_ready` }, { status: 400 });
  }

  // Run lip sync synchronously (up to 300s)
  try {
    await runLipSync(dubId);
  } catch (err) {
    console.error(`Lip sync failed for ${dubId}:`, err);
  }

  return NextResponse.json({ ok: true });
}
