import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lightweight endpoint called by dashboard polling
// Recovers stuck dubs for the current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: true });

  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  // Find user's stuck dubs
  const { data: stuckDubs } = await supabase
    .from("dubs")
    .select("id, project_id, status")
    .in("status", ["translating", "generating_voice", "lip_syncing", "merging"])
    .lt("updated_at", fiveMinAgo);

  if (!stuckDubs || stuckDubs.length === 0) {
    return NextResponse.json({ recovered: 0 });
  }

  // Mark as error with audio-only fallback message
  for (const dub of stuckDubs) {
    await supabase
      .from("dubs")
      .update({
        status: "error",
        error_message: `Processing timed out (stuck in ${dub.status}). Tap "Retry Failed Dubs" to try again.`,
      })
      .eq("id", dub.id);
  }

  // Update parent projects
  const projectIds = [...new Set(stuckDubs.map((d) => d.project_id))];
  for (const pid of projectIds) {
    const { data: allDubs } = await supabase
      .from("dubs")
      .select("status")
      .eq("project_id", pid);

    if (allDubs?.every((d) => ["done", "error"].includes(d.status))) {
      await supabase
        .from("projects")
        .update({ status: allDubs.some((d) => d.status === "done") ? "done" : "error" })
        .eq("id", pid);
    }
  }

  return NextResponse.json({ recovered: stuckDubs.length });
}
