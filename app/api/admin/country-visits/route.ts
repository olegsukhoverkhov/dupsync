import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getVisitCountries, getCountryUserStats } from "@/lib/analytics";

export const dynamic = "force-dynamic";

type CountryRow = {
  country: string;
  unique_visitors: number;
  visits: number;
  registered: number;
  paid: number;
};

function getMergedData(
  countries: Array<{ country: string; visits: number; unique_visitors: number }>,
  userStats: Array<{ country: string; registered: number; paid: number }>
): CountryRow[] {
  const userMap = new Map<string, { registered: number; paid: number }>();
  for (const u of userStats) userMap.set(u.country, { registered: u.registered, paid: u.paid });

  const countryCodes = new Set(countries.map((c) => c.country));
  for (const u of userStats) {
    if (!countryCodes.has(u.country)) {
      countries.push({ country: u.country, visits: 0, unique_visitors: 0 });
    }
  }

  return countries.map((c) => ({
    country: c.country,
    unique_visitors: c.unique_visitors,
    visits: c.visits,
    registered: userMap.get(c.country)?.registered || 0,
    paid: userMap.get(c.country)?.paid || 0,
  }));
}

/** GET /api/admin/country-visits — returns current data + snapshot for deltas */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const service = await createServiceClient();
  const [countries, userStats, snapshotRow] = await Promise.all([
    getVisitCountries(),
    getCountryUserStats(),
    service.from("admin_analytics_snapshot").select("country_data").eq("id", "default").single(),
  ]);

  const merged = getMergedData(countries, userStats);
  const snapshot = (snapshotRow.data?.country_data || {}) as Record<string, { visits: number; registered: number; paid: number }>;

  return NextResponse.json({ data: merged, snapshot });
}

/**
 * POST /api/admin/country-visits — save current state as snapshot.
 * Called when admin leaves the analytics page (beforeunload).
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const service = await createServiceClient();
  const [countries, userStats] = await Promise.all([
    getVisitCountries(),
    getCountryUserStats(),
  ]);

  const merged = getMergedData(countries, userStats);
  const snapshotData: Record<string, { visits: number; registered: number; paid: number }> = {};
  for (const row of merged) {
    snapshotData[row.country] = { visits: row.visits, registered: row.registered, paid: row.paid };
  }

  await service.from("admin_analytics_snapshot").upsert({
    id: "default",
    country_data: snapshotData,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
