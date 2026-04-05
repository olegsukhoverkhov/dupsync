import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

// Recovers dubs stuck in processing states for more than 5 minutes
// Can be called manually or via cron
export async function GET() {
  const supabase = await createServiceClient();
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  // Find stuck dubs (in non-terminal state for >5 min)
  const { data: stuckDubs } = await supabase
    .from("dubs")
    .select("id, project_id, status, progress, updated_at")
    .in("status", ["pending", "translating", "generating_voice", "lip_syncing", "merging"])
    .lt("updated_at", fiveMinAgo);

  if (!stuckDubs || stuckDubs.length === 0) {
    return NextResponse.json({ recovered: 0, message: "No stuck dubs found" });
  }

  // Mark stuck dubs as error
  const stuckIds = stuckDubs.map((d) => d.id);
  await supabase
    .from("dubs")
    .update({
      status: "error",
      error_message: `Timed out in ${stuckDubs[0]?.status} state. Use "Retry Failed Dubs" to try again.`,
    })
    .in("id", stuckIds);

  // Update parent projects
  const projectIds = [...new Set(stuckDubs.map((d) => d.project_id))];
  for (const pid of projectIds) {
    const { data: allDubs } = await supabase
      .from("dubs")
      .select("status")
      .eq("project_id", pid);

    const allFinished = allDubs?.every((d) => ["done", "error"].includes(d.status));
    if (allFinished) {
      const anyDone = allDubs?.some((d) => d.status === "done");
      await supabase
        .from("projects")
        .update({ status: anyDone ? "done" : "error" })
        .eq("id", pid);
    }
  }

  return NextResponse.json({
    recovered: stuckDubs.length,
    dubs: stuckDubs.map((d) => ({
      id: d.id,
      status: d.status,
      progress: d.progress,
      stuck_since: d.updated_at,
    })),
  });
}
