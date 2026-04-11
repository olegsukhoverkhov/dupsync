import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { ids } = await req.json().catch(() => ({ ids: [] })) as { ids?: string[] };
  if (!ids?.length) return NextResponse.json({ error: "ids required" }, { status: 400 });

  const service = await createServiceClient();
  await service.from("error_logs").delete().in("id", ids);

  return NextResponse.json({ ok: true });
}
