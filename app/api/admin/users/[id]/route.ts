import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { PlanType } from "@/lib/supabase/types";

const VALID_PLANS: PlanType[] = ["free", "starter", "pro", "enterprise"];

/** Shared admin auth check — returns caller user or error response */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: caller } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!caller?.is_admin) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };

  return { user };
}

/**
 * PATCH /api/admin/users/[id]
 *
 * Admin-only. Updates plan, credits_remaining, and/or is_suspended.
 */
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await ctx.params;
  if (!targetId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: { plan?: string; credits_remaining?: number; is_suspended?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.plan === "string") {
    if (!VALID_PLANS.includes(body.plan as PlanType)) {
      return NextResponse.json(
        { error: `plan must be one of ${VALID_PLANS.join(", ")}` },
        { status: 400 }
      );
    }
    updates.plan = body.plan;
  }
  if (body.credits_remaining !== undefined) {
    const n = Number(body.credits_remaining);
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json(
        { error: "credits_remaining must be a non-negative number" },
        { status: 400 }
      );
    }
    updates.credits_remaining = n;
  }
  if (typeof body.is_suspended === "boolean") {
    updates.is_suspended = body.is_suspended;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const admin = await createServiceClient();
  const { data, error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", targetId)
    .select("id, plan, credits_remaining, topup_credits, is_suspended")
    .single();

  if (error) {
    console.error("[admin/users PATCH] update failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

/**
 * DELETE /api/admin/users/[id]
 *
 * Admin-only. Permanently deletes a user from auth.users (cascades
 * to profiles via the DB trigger). Also deletes all their projects
 * and dubs.
 */
export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await ctx.params;
  if (!targetId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  // Don't allow self-deletion
  if (auth.user.id === targetId) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const admin = await createServiceClient();

  // 1. Delete dubs (child of projects)
  const { data: userProjects } = await admin
    .from("projects")
    .select("id")
    .eq("user_id", targetId);
  if (userProjects && userProjects.length > 0) {
    const projectIds = userProjects.map((p: { id: string }) => p.id);
    await admin.from("dubs").delete().in("project_id", projectIds);
  }

  // 2. Delete all user-owned rows across every table
  await admin.from("credit_usage").delete().eq("user_id", targetId);
  await admin.from("transactions").delete().eq("user_id", targetId);
  await admin.from("api_keys").delete().eq("user_id", targetId);
  await admin.from("projects").delete().eq("user_id", targetId);

  // 3. Delete user's files from storage (non-fatal)
  try {
    const { data: files } = await admin.storage
      .from("videos")
      .list(targetId, { limit: 1000 });
    if (files && files.length > 0) {
      const paths = files.map((f: { name: string }) => `${targetId}/${f.name}`);
      await admin.storage.from("videos").remove(paths);
    }
  } catch {
    // Storage cleanup is best-effort
  }

  // 4. Delete profile
  await admin.from("profiles").delete().eq("id", targetId);

  // 5. Delete from auth.users (the authoritative record)
  const { error } = await admin.auth.admin.deleteUser(targetId);
  if (error) {
    console.error("[admin/users DELETE] failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
