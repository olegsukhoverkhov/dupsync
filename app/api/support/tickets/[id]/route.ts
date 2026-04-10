import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/support/tickets/[id] — get ticket + messages
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
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

  const service = await createServiceClient();

  // Get ticket
  const { data: ticket } = await service
    .from("support_tickets")
    .select("*, profiles!support_tickets_user_id_fkey(email, full_name)")
    .eq("id", id)
    .single();

  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Non-admins can only see their own tickets
  if (!profile?.is_admin && ticket.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Get messages
  const { data: messages } = await service
    .from("support_messages")
    .select("*, profiles!support_messages_sender_id_fkey(full_name)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const p = ticket.profiles as Record<string, unknown> | null;

  return NextResponse.json({
    ticket: {
      ...ticket,
      profiles: undefined,
      user_email: p?.email || "",
      user_name: p?.full_name || "",
    },
    messages: (messages || []).map((m: Record<string, unknown>) => {
      const mp = m.profiles as Record<string, unknown> | null;
      return {
        ...m,
        profiles: undefined,
        sender_name: mp?.full_name || (m.is_admin ? "Support" : "You"),
      };
    }),
  });
}

/**
 * PATCH /api/support/tickets/[id] — update status (admin only)
 * Body: { status: TicketStatus }
 */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
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
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validStatuses = ["open", "waiting_admin", "waiting_user", "resolved", "closed"];
  if (!body.status || !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const service = await createServiceClient();
  await service
    .from("support_tickets")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
