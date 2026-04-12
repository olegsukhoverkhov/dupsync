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

  let body: { plan?: string; credits_remaining?: number; topup_credits?: number; is_suspended?: boolean; subscription_expired?: boolean; subscription_expires_at?: string | null };
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
  if (body.topup_credits !== undefined) {
    const n = Number(body.topup_credits);
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json(
        { error: "topup_credits must be a non-negative number" },
        { status: 400 }
      );
    }
    updates.topup_credits = n;
  }
  if (typeof body.is_suspended === "boolean") {
    updates.is_suspended = body.is_suspended;
  }
  if (typeof body.subscription_expired === "boolean") {
    updates.subscription_expired = body.subscription_expired;
  }
  if (body.subscription_expires_at !== undefined) {
    updates.subscription_expires_at = body.subscription_expires_at;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const admin = await createServiceClient();

  // Sync expiry date change to Dodo
  if (updates.subscription_expires_at !== undefined) {
    const { data: targetProfile } = await admin
      .from("profiles")
      .select("stripe_customer_id, subscription_expires_at")
      .eq("id", targetId)
      .single();
    if (targetProfile?.stripe_customer_id && updates.subscription_expires_at) {
      try {
        const { updateSubscriptionBillingDate } = await import("@/lib/dodo-payments");
        await updateSubscriptionBillingDate(
          targetProfile.stripe_customer_id,
          updates.subscription_expires_at as string
        );
        console.log(`[ADMIN] Updated Dodo billing date for ${targetId} → ${updates.subscription_expires_at}`);
      } catch (err) {
        console.warn(`[ADMIN] Dodo billing date update failed for ${targetId}:`, err instanceof Error ? err.message : err);
      }
    }
  }

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

  // 2. Delete support tickets + messages (sender_id also references profiles)
  const { data: userTickets } = await admin
    .from("support_tickets")
    .select("id")
    .eq("user_id", targetId);
  if (userTickets && userTickets.length > 0) {
    const ticketIds = userTickets.map((t: { id: string }) => t.id);
    await admin.from("support_messages").delete().in("ticket_id", ticketIds);
  }
  await admin.from("support_messages").delete().eq("sender_id", targetId);
  await admin.from("support_tickets").delete().eq("user_id", targetId);

  // 3. Delete all user-owned rows across every table
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
