import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers, cookies } from "next/headers";

/**
 * PATCH /api/profile/country — stamp country if missing.
 * Prefers dubsync_country cookie (set by marketing layout, same source
 * as site_visit_events) over live geo headers.
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cookieStore = await cookies();
  const reqHeaders = await headers();
  const country = cookieStore.get("dubsync_country")?.value
    || reqHeaders.get("cf-ipcountry")
    || reqHeaders.get("x-vercel-ip-country")
    || null;

  if (!country) return NextResponse.json({ ok: true, country: null });

  await supabase
    .from("profiles")
    .update({ country })
    .eq("id", user.id)
    .is("country", null);

  return NextResponse.json({ ok: true, country });
}
