import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVisitCountries, getCountryUserStats } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/** GET /api/admin/country-visits — live country data for polling */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [countries, userStats] = await Promise.all([
    getVisitCountries(),
    getCountryUserStats(),
  ]);

  const userMap = new Map<string, { registered: number; paid: number }>();
  for (const u of userStats) userMap.set(u.country, { registered: u.registered, paid: u.paid });

  // Merge
  const countryCodes = new Set(countries.map((c) => c.country));
  for (const u of userStats) {
    if (!countryCodes.has(u.country)) {
      countries.push({ country: u.country, visits: 0, unique_visitors: 0 });
    }
  }

  const merged = countries.map((c) => ({
    country: c.country,
    unique_visitors: c.unique_visitors,
    visits: c.visits,
    registered: userMap.get(c.country)?.registered || 0,
    paid: userMap.get(c.country)?.paid || 0,
  }));

  return NextResponse.json(merged);
}
