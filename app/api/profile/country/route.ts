import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

/**
 * PATCH /api/profile/country — stamp country from geo headers
 * Called from dashboard on mount if profile.country is null.
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reqHeaders = await headers();
  const country = reqHeaders.get("cf-ipcountry")
    || reqHeaders.get("x-vercel-ip-country")
    || null;

  if (!country) return NextResponse.json({ ok: true, country: null });

  await supabase
    .from("profiles")
    .update({ country })
    .eq("id", user.id)
    .is("country", null); // Only set if not already set

  return NextResponse.json({ ok: true, country });
}
