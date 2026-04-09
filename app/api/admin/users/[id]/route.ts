import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { PlanType } from "@/lib/supabase/types";

/**
 * PATCH /api/admin/users/[id]
 *
 * Admin-only. Updates `plan` and/or `credits_remaining` on the target
 * profile. Caller identity is taken from the authed cookie session;
 * the mutation itself runs through the service-role client so it
 * bypasses RLS even if we later tighten the profiles policies.
 *
 * Accepts:
 *   { plan?: PlanType, credits_remaining?: number }
 *
 * Returns the updated profile row on success.
 */
const VALID_PLANS: PlanType[] = ["free", "starter", "pro", "enterprise"];

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await ctx.params;
  if (!targetId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  // 1. Auth: caller must be an admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: caller } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!caller?.is_admin) {
    // 404 not 403 — the admin API surface is not a secret we want
    // to confirm exists to non-admins.
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 2. Parse + validate body
  let body: { plan?: string; credits_remaining?: number };
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

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Nothing to update" },
      { status: 400 }
    );
  }

  // 3. Apply via service role so row-level policies can't block
  const admin = await createServiceClient();
  const { data, error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", targetId)
    .select("id, plan, credits_remaining, topup_credits")
    .single();

  if (error) {
    console.error("[admin/users PATCH] update failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
