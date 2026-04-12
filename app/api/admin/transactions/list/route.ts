import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/transactions/list
 * Returns all transactions with user info. Uses service client to bypass RLS.
 * Query params: type, from, to
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const filterType = url.searchParams.get("type") || "";
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";

  const service = await createServiceClient();

  let query = service
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filterType && filterType !== "all") {
    query = query.eq("type", filterType);
  }
  const renewalFilter = url.searchParams.get("renewal");
  if (renewalFilter === "true") query = query.eq("is_renewal", true);
  if (renewalFilter === "false") query = query.eq("is_renewal", false);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lt("created_at", to);

  const { data: transactions } = await query;
  if (!transactions) return NextResponse.json({ transactions: [] });

  // Fetch user info
  const userIds = [...new Set(transactions.map((t) => t.user_id))];
  const { data: profiles } = await service
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  const profileMap = new Map<string, { email: string; full_name: string | null }>();
  for (const p of profiles || []) {
    profileMap.set(p.id, p);
  }

  const result = transactions.map((t) => {
    const p = profileMap.get(t.user_id);
    return { ...t, user_email: p?.email || "", user_name: p?.full_name || "" };
  });

  return NextResponse.json({ transactions: result });
}
