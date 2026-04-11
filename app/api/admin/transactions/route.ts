import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * DELETE /api/admin/transactions — bulk delete transactions (admin only)
 * Body: { ids: string[] }
 */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { ids?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.ids?.length) {
    return NextResponse.json({ error: "ids required" }, { status: 400 });
  }

  const service = await createServiceClient();
  await service.from("transactions").delete().in("id", body.ids);

  return NextResponse.json({ ok: true, deleted: body.ids.length });
}
