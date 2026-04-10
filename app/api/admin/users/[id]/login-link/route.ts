import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/users/[id]/login-link
 *
 * Admin-only. Generates a one-time OTP for the target user so the
 * admin can log into their account in a new browser tab and see
 * exactly what they see.
 *
 * Flow:
 *  1. API generates a magic-link OTP via `auth.admin.generateLink`
 *  2. Returns `{ email, otp }` to the admin client
 *  3. Client opens `/admin/impersonate?email=X&otp=Y` in a new tab
 *  4. That page calls `supabase.auth.verifyOtp({ email, token, type: 'email' })`
 *  5. verifyOtp sets the session cookie through the SSR client
 *  6. Redirect to /dashboard — admin is now logged in as the user
 *
 * Why not use action_link directly: Supabase's action_link returns
 * tokens in a URL hash fragment (#access_token=...) but our app
 * uses cookie-based SSR auth. The hash is invisible to the server,
 * so the existing admin session cookie wins and the user sees their
 * own dashboard, not the target's.
 *
 * Returns: { email: string, otp: string }
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

  // 3. Generate magic link OTP (we only need the token, not the URL)
  const { data: linkData, error: linkErr } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email: targetUser.user.email,
    });

  if (linkErr || !linkData?.properties?.email_otp) {
    console.error("[ADMIN_LOGIN_LINK] generateLink failed:", linkErr);
    return NextResponse.json(
      { error: "Failed to generate login token" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    email: targetUser.user.email,
    otp: linkData.properties.email_otp,
  });
}
