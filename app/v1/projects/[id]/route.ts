import { NextResponse, type NextRequest } from "next/server";
import { authenticateApiRequest, apiError } from "@/lib/api-auth";
import { enforceRateLimit } from "@/lib/api-ratelimit";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /v1/projects/:id — fetch project metadata + transcript.
 *
 * Ownership enforced: users can only read projects they own.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) return auth;

  const limit = await enforceRateLimit(auth.apiKeyId, auth.profile.plan);
  if (limit.deny) return limit.deny;

  const { id } = await params;
  const service = await createServiceClient();
  const { data: project } = await service
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (!project) {
    return limit.applyHeaders(apiError("not_found", "Project not found.", 404));
  }

  const res = NextResponse.json({
    id: project.id,
    title: project.title,
    status: project.status,
    original_language: project.original_language,
    duration_seconds: project.duration_seconds,
    transcript: project.transcript,
    error_message: project.error_message ?? null,
    created_at: project.created_at,
    updated_at: project.updated_at,
  });
  return limit.applyHeaders(res);
}
