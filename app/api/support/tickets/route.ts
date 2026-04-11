import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/support/tickets — list tickets
 * Regular users: own tickets only. Admins: all tickets.
 * ?status=open|waiting_admin|waiting_user|resolved|closed (optional filter)
 */
export async function GET(req: NextRequest) {
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

  const statusFilter = req.nextUrl.searchParams.get("status");
  const service = await createServiceClient();

  let query = service
    .from("support_tickets")
    .select("*, profiles!support_tickets_user_id_fkey(email, full_name)")
    .order("updated_at", { ascending: false })
    .limit(100);

  // Non-admins only see their own tickets
  if (!profile?.is_admin) {
    query = query.eq("user_id", user.id);
  }

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Flatten profile join
  const tickets = (data || []).map((t: Record<string, unknown>) => {
    const p = t.profiles as Record<string, unknown> | null;
    return {
      ...t,
      profiles: undefined,
      user_email: p?.email || "",
      user_name: p?.full_name || "",
    };
  });

  return NextResponse.json(tickets);
}

/**
 * POST /api/support/tickets — create new ticket
 * Body: { subject: string, description: string }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { subject?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subject = body.subject?.trim();
  const description = body.description?.trim();
  if (!subject || !description) {
    return NextResponse.json({ error: "Subject and description are required" }, { status: 400 });
  }

  const service = await createServiceClient();

  // Create ticket
  const { data: ticket, error: ticketErr } = await service
    .from("support_tickets")
    .insert({ user_id: user.id, subject, status: "waiting_admin" })
    .select("id")
    .single();

  if (ticketErr || !ticket) {
    return NextResponse.json({ error: ticketErr?.message || "Failed to create ticket" }, { status: 500 });
  }

  // Add first message
  await service.from("support_messages").insert({
    ticket_id: ticket.id,
    sender_id: user.id,
    message: description,
    is_admin: false,
  });

  return NextResponse.json({ id: ticket.id }, { status: 201 });
}
