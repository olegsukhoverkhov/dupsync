import { NextResponse, type NextRequest } from "next/server";
import { authenticateApiRequest, apiError } from "@/lib/api-auth";
import { enforceRateLimit } from "@/lib/api-ratelimit";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /v1/projects/:id/dubs — list dubs for a project, with signed
 * download URLs for the final video and audio files.
 *
 * Response:
 *   {
 *     dubs: [
 *       {
 *         id: "...",
 *         target_language: "es",
 *         status: "done",
 *         progress: 100,
 *         error_message: null,
 *         video_url: "https://...signed...",   // null until Stage 2 done
 *         audio_url: "https://...signed...",   // null until Stage 1 done
 *         created_at: "2026-...",
 *         updated_at: "2026-..."
 *       },
 *       ...
 *     ]
 *   }
 *
 * Signed URLs are TTL 1 hour — clients should download promptly or
 * re-fetch if the link has expired.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) return auth;

  const limit = await enforceRateLimit(auth.apiKeyId, auth.profile.plan);
  if (limit.deny) return limit.deny;

  const { id: projectId } = await params;
  const service = await createServiceClient();

  // Project ownership gate
  const { data: project } = await service
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", auth.userId)
    .maybeSingle();
  if (!project) {
    return limit.applyHeaders(apiError("not_found", "Project not found.", 404));
  }

  const { data: dubs } = await service
    .from("dubs")
    .select(
      "id, target_language, status, progress, error_message, dubbed_video_url, created_at, updated_at"
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  // Resolve `dubbed_video_url` (storage path) to a signed URL for each
  // dub. The pipeline writes `.wav` for audio-only Stage 1 output and
  // `.mp4` once Stage 2 (lip sync) completes — we expose both shapes.
  const enriched = await Promise.all(
    (dubs || []).map(async (dub) => {
      const path = dub.dubbed_video_url as string | null;
      let video_url: string | null = null;
      let audio_url: string | null = null;

      if (path) {
        const { data: signed } = await service.storage
          .from("videos")
          .createSignedUrl(path, 3600); // 1h TTL
        if (signed?.signedUrl) {
          if (path.endsWith(".mp4")) {
            video_url = signed.signedUrl;
          } else if (path.endsWith(".wav")) {
            audio_url = signed.signedUrl;
          }
        }
      }

      return {
        id: dub.id,
        target_language: dub.target_language,
        status: dub.status,
        progress: dub.progress,
        error_message: dub.error_message,
        video_url,
        audio_url,
        created_at: dub.created_at,
        updated_at: dub.updated_at,
      };
    })
  );

  const res = NextResponse.json({ dubs: enriched });
  return limit.applyHeaders(res);
}
