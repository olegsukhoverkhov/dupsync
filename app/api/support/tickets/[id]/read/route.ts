import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/support/tickets/[id]/read — mark ticket as read.
 * Changes status from waiting_user → open (user viewed it)
 * or waiting_admin → open (admin viewed it).
 */
export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const service = await createServiceClient();
  const { data: ticket } = await service
    .from("support_tickets")
    .select("status, user_id")
    .eq("id", id)
    .single();

  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only the relevant party can mark as read
  const isAdmin = Boolean(profile?.is_admin);
  if (!isAdmin && ticket.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // User reading a waiting_user ticket → open (badge clears)
  // Admin reading a waiting_admin ticket → open (badge clears)
  const shouldClear =
    (!isAdmin && ticket.status === "waiting_user") ||
    (isAdmin && (ticket.status === "waiting_admin" || ticket.status === "open"));

  if (shouldClear) {
    await service
      .from("support_tickets")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  return NextResponse.json({ ok: true });
}
