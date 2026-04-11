import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/keys/:id — revoke an API key.
 *
 * Marks `revoked_at = now()` rather than deleting the row so we keep
 * an audit trail (when the key was issued, when it was last used, when
 * it was revoked). The partial index on `key_hash` excludes revoked
 * rows, so lookups on request time see only active keys — but a user
 * can still inspect revoked-key history in the dashboard.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = await createServiceClient();
  // Only revoke the user's own keys — extra belt-and-braces check on
  // top of the RLS/FK constraints.
  const { data, error } = await service
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Key not found or already revoked" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
