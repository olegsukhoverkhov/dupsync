import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/admin/support-ticket — admin creates a ticket TO a user.
 * Body: { userId: string, subject: string, message: string }
 *
 * Creates a ticket owned by the target user with status "waiting_user"
 * so the user sees it with a badge in their Support tab.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { userId?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userId, subject, message } = body;
  if (!userId || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "userId, subject, and message required" }, { status: 400 });
  }

  const service = await createServiceClient();

  // Create ticket owned by the target user
  const { data: ticket, error: ticketErr } = await service
    .from("support_tickets")
    .insert({
      user_id: userId,
      subject: subject.trim(),
      status: "waiting_user", // User needs to see and respond
    })
    .select("id")
    .single();

  if (ticketErr || !ticket) {
    return NextResponse.json({ error: ticketErr?.message || "Failed" }, { status: 500 });
  }

  // Add admin's message
  await service.from("support_messages").insert({
    ticket_id: ticket.id,
    sender_id: user.id,
    message: message.trim(),
    is_admin: true,
  });

  return NextResponse.json({ id: ticket.id }, { status: 201 });
}
