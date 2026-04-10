import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** PATCH /api/profile/onboarding — mark onboarding as completed */
export async function PATCH() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}
