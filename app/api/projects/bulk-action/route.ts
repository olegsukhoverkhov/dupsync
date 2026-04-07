import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/projects/bulk-action
 *
 * Bulk apply an action to multiple projects.
 *
 * Body:
 *   {
 *     ids: string[],
 *     action: "delete" | "archive" | "unarchive"
 *   }
 *
 * - "delete" → permanently removes the projects (cascade-deletes dubs)
 * - "archive" → soft-archives (sets archived_at = now())
 * - "unarchive" → restores from archive (sets archived_at = null)
 *
 * Always scoped to the current user — RLS plus an explicit user_id
 * filter on every query so a malicious id list can't touch other
 * users' projects.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { ids?: unknown; action?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((x): x is string => typeof x === "string") : [];
  const action = body.action;

  if (ids.length === 0) {
    return NextResponse.json({ error: "ids must be a non-empty string array" }, { status: 400 });
  }
  if (action !== "delete" && action !== "archive" && action !== "unarchive") {
    return NextResponse.json(
      { error: 'action must be "delete", "archive", or "unarchive"' },
      { status: 400 }
    );
  }

  if (action === "delete") {
    // Delete dubs first (in case CASCADE isn't set up), then projects
    await supabase.from("dubs").delete().in("project_id", ids);
    const { error } = await supabase
      .from("projects")
      .delete()
      .in("id", ids)
      .eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, deleted: ids.length });
  }

  if (action === "archive") {
    const { error } = await supabase
      .from("projects")
      .update({ archived_at: new Date().toISOString() })
      .in("id", ids)
      .eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, archived: ids.length });
  }

  // unarchive
  const { error } = await supabase
    .from("projects")
    .update({ archived_at: null })
    .in("id", ids)
    .eq("user_id", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, unarchived: ids.length });
}
