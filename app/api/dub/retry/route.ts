import { NextResponse } from "next/server";
import { after } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runDubbing, cleanupVoiceClone } from "@/lib/pipeline";

export const maxDuration = 300;

/**
 * POST /api/dub/retry — re-run failed dubs without creating new ones.
 * Body: { projectId: string, dubIds: string[] }
 *
 * Resets the specified dubs to "pending" and re-runs Stage 1.
 * No new dub records are created, no duplicate language issue.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as {
    projectId?: string;
    dubIds?: string[];
  };

  const { projectId, dubIds } = body;
  if (!projectId || !dubIds?.length) {
    return NextResponse.json({ error: "projectId and dubIds required" }, { status: 400 });
  }

  // Verify project belongs to user
  const { data: project } = await supabase
    .from("projects")
    .select("id, user_id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const service = await createServiceClient();

  // Reset failed dubs to pending
  await service
    .from("dubs")
    .update({
      status: "pending",
      progress: 0,
      error_message: null,
      fal_request_id: null,
      fal_model: null,
      fal_attempt: 0,
      voice_source: null,
      dubbed_video_url: null,
      dubbed_video_with_subs_url: null,
      srt_url: null,
      vtt_url: null,
    })
    .in("id", dubIds)
    .eq("project_id", projectId);

  // Set project back to dubbing
  await service
    .from("projects")
    .update({ status: "dubbing" })
    .eq("id", projectId);

  // Run dubbing in background
  after(async () => {
    const TTS_CONCURRENCY = 3;
    for (let i = 0; i < dubIds.length; i += TTS_CONCURRENCY) {
      const batch = dubIds.slice(i, i + TTS_CONCURRENCY);
      await Promise.allSettled(batch.map((id) => runDubbing(id)));
    }
    await cleanupVoiceClone(projectId).catch(() => {});
  });

  return NextResponse.json({ ok: true, retrying: dubIds.length });
}
