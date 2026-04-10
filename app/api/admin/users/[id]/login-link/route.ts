import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/users/[id]/login-link
 *
 * Admin-only. Generates a one-time magic-link login URL for the
 * target user so the admin can instantly log into their account
 * in a new tab and see exactly what they see — useful for
 * debugging user-reported issues without asking for credentials.
 *
 * Uses Supabase `auth.admin.generateLink({ type: 'magiclink' })`
 * which produces a standard auth URL. When the admin opens it,
 * Supabase's `/auth/v1/verify` endpoint exchanges the token for
 * a real session cookie — same flow as email login, just skipping
 * the "check your inbox" step.
 *
 * Returns: { url: string }
 */
export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await ctx.params;
  if (!targetId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  // 1. Auth: caller must be admin
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 2. Fetch target user's email via service role
  const admin = await createServiceClient();
  const { data: targetUser, error: fetchErr } =
    await admin.auth.admin.getUserById(targetId);
  if (fetchErr || !targetUser?.user?.email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 3. Generate magic link
  const redirectTo =
    (process.env.NEXT_PUBLIC_APP_URL || "https://dubsync.app") + "/dashboard";

  const { data: linkData, error: linkErr } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email: targetUser.user.email,
      options: { redirectTo },
    });

  if (linkErr || !linkData?.properties?.action_link) {
    console.error("[ADMIN_LOGIN_LINK] generateLink failed:", linkErr);
    return NextResponse.json(
      { error: "Failed to generate login link" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: linkData.properties.action_link });
}
