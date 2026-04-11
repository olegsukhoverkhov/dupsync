import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-keys";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/keys — list the caller's API keys.
 *
 * Returns only safe fields (id, name, prefix, created_at, last_used_at,
 * revoked_at). The hash and plaintext are NEVER returned; the plaintext
 * only exists transiently during POST.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = await createServiceClient();
  const { data, error } = await service
    .from("api_keys")
    .select("id, name, key_prefix, last_used_at, last_used_ip, expires_at, revoked_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ keys: data ?? [] });
}

/**
 * POST /api/keys — generate a new API key.
 *
 * Request body: `{ name?: string }`
 * Response:     `{ key: { id, name, prefix, plaintext, created_at } }`
 *
 * The `plaintext` field is returned ONLY on this endpoint and ONLY for
 * this one call. The client must surface it to the user immediately
 * (behind a "Copy this key now — you won't see it again" modal) and
 * then discard.
 *
 * Plan gating: API access is restricted to Pro and Enterprise plans.
 * Free/Starter users get a 403.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Plan gate — only paid-tier users can issue keys.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan: PlanType = (profile?.plan as PlanType) || "free";
  if (plan !== "pro" && plan !== "enterprise") {
    return NextResponse.json(
      {
        error: `API access requires a Pro or Business plan. You're on ${PLAN_LIMITS[plan].name}. Upgrade to unlock API access.`,
        code: "plan_required",
      },
      { status: 403 }
    );
  }

  // Parse optional name from body
  let name: string | null = null;
  try {
    const body = (await request.json()) as { name?: unknown };
    if (typeof body.name === "string" && body.name.trim().length > 0) {
      name = body.name.trim().slice(0, 80);
    }
  } catch {
    // Empty body is fine — name defaults to null
  }

  // Generate + persist
  const generated = generateApiKey();
  const service = await createServiceClient();
  const { data: inserted, error } = await service
    .from("api_keys")
    .insert({
      user_id: user.id,
      name,
      key_prefix: generated.prefix,
      key_hash: generated.hash,
    })
    .select("id, name, key_prefix, created_at")
    .single();

  if (error || !inserted) {
    return NextResponse.json(
      { error: error?.message || "Failed to create key" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      key: {
        id: inserted.id,
        name: inserted.name,
        prefix: inserted.key_prefix,
        plaintext: generated.plaintext, // SHOWN ONCE
        created_at: inserted.created_at,
      },
    },
    { status: 201 }
  );
}
