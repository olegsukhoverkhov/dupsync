import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/support/tickets/[id]/messages — add reply
 * Body: { message: string }
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: ticketId } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const service = await createServiceClient();

  // Verify ticket exists and user has access
  const { data: ticket } = await service
    .from("support_tickets")
    .select("id, user_id")
    .eq("id", ticketId)
    .single();

  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!profile?.is_admin && ticket.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAdmin = Boolean(profile?.is_admin);

  // Insert message
  await service.from("support_messages").insert({
    ticket_id: ticketId,
    sender_id: user.id,
    message,
    is_admin: isAdmin,
  });

  // Update ticket status + timestamp
  const newStatus = isAdmin ? "waiting_user" : "waiting_admin";
  await service
    .from("support_tickets")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  return NextResponse.json({ ok: true }, { status: 201 });
}
