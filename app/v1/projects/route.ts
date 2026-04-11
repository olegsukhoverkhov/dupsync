import { NextResponse, type NextRequest } from "next/server";
import { authenticateApiRequest, apiError } from "@/lib/api-auth";
import { enforceRateLimit } from "@/lib/api-ratelimit";
import { createServiceClient } from "@/lib/supabase/server";
import { runTranscription } from "@/lib/pipeline";
import { PLAN_LIMITS } from "@/lib/supabase/constants";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /v1/projects — create a new project by uploading a video file.
 *
 * Request: `multipart/form-data` with:
 *   - `video`: the video file (required)
 *   - `title`: human-readable project name (required)
 *   - `source_language`: ISO 639-1 code or "auto" (optional, default: "auto")
 *
 * Response (201):
 *   {
 *     id: "...",
 *     title: "...",
 *     status: "ready" | "error",
 *     original_language: "en",
 *     duration_seconds: 123,
 *     created_at: "2026-..."
 *   }
 *
 * The call is SYNCHRONOUS — it waits for transcription to complete
 * (typically 10-60s) so the client receives the full metadata in the
 * response. For very long videos that approach Vercel's 300s limit,
 * the client should handle a 504 and poll `GET /v1/projects/:id`.
 *
 * Plan enforcement (file size, duration) mirrors the dashboard route
 * so API users can't bypass their subscription limits.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) return auth;

  const limit = await enforceRateLimit(auth.apiKeyId, auth.profile.plan);
  if (limit.deny) return limit.deny;

  // Parse multipart form-data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return limit.applyHeaders(
      apiError("invalid_request", "Expected multipart/form-data body.", 400)
    );
  }

  const video = formData.get("video");
  const title = (formData.get("title") as string | null)?.trim();
  const sourceLanguage =
    (formData.get("source_language") as string | null)?.trim() || "auto";

  if (!title) {
    return limit.applyHeaders(
      apiError("invalid_request", "Missing `title` field.", 400)
    );
  }
  if (!(video instanceof File)) {
    return limit.applyHeaders(
      apiError("invalid_request", "Missing `video` file in form-data.", 400)
    );
  }

  const planLimits = PLAN_LIMITS[auth.profile.plan];

  // File-size gate (enforced BEFORE upload to save bandwidth)
  const sizeBytes = video.size;
  if (sizeBytes > planLimits.maxFileSize * 1024 * 1024) {
    return limit.applyHeaders(
      apiError(
        "file_too_large",
        `File is ${(sizeBytes / 1024 / 1024).toFixed(0)}MB. Your ${planLimits.name} plan allows max ${planLimits.maxFileSize}MB.`,
        413
      )
    );
  }

  // Duplicate-title guard — same user, same title = 409
  const service = await createServiceClient();
  const { data: existing } = await service
    .from("projects")
    .select("id")
    .eq("user_id", auth.userId)
    .eq("title", title)
    .limit(1);
  if (existing && existing.length > 0) {
    return limit.applyHeaders(
      apiError(
        "conflict",
        `A project named "${title}" already exists.`,
        409
      )
    );
  }

  // Upload to Supabase Storage under the user's scoped path
  const ext = (video.name.split(".").pop() || "mp4").toLowerCase();
  const uploadId = crypto.randomUUID();
  const storagePath = `${auth.userId}/${uploadId}/original.${ext}`;

  const buffer = Buffer.from(await video.arrayBuffer());
  const { error: uploadError } = await service.storage
    .from("videos")
    .upload(storagePath, buffer, {
      contentType: video.type || "video/mp4",
      upsert: false,
    });
  if (uploadError) {
    return limit.applyHeaders(
      apiError("storage_error", `Upload failed: ${uploadError.message}`, 500)
    );
  }

  // Create project row
  const { data: project, error: insertError } = await service
    .from("projects")
    .insert({
      user_id: auth.userId,
      title,
      original_video_url: storagePath,
      original_language: sourceLanguage,
      status: "transcribing",
    })
    .select()
    .single();

  if (insertError || !project) {
    // Clean up the orphaned upload
    await service.storage.from("videos").remove([storagePath]);
    return limit.applyHeaders(
      apiError(
        "db_error",
        insertError?.message || "Failed to create project row",
        500
      )
    );
  }

  // Run transcription synchronously — client gets the full status back
  try {
    await runTranscription(project.id);
  } catch (err) {
    console.error(`[API v1/projects] runTranscription failed:`, err);
    // Pipeline already wrote error_message on the project row
  }

  // Re-fetch with the updated status + duration_seconds
  const { data: updated } = await service
    .from("projects")
    .select("*")
    .eq("id", project.id)
    .single();

  // Post-transcription duration gate
  if (
    updated &&
    planLimits.maxVideoSeconds > 0 &&
    updated.duration_seconds &&
    updated.duration_seconds > planLimits.maxVideoSeconds
  ) {
    // Clean up — video too long
    await service.from("projects").delete().eq("id", project.id);
    await service.storage.from("videos").remove([storagePath]);
    return limit.applyHeaders(
      apiError(
        "duration_too_long",
        `Video is ${updated.duration_seconds}s. Your ${planLimits.name} plan allows max ${planLimits.maxVideoSeconds}s.`,
        413
      )
    );
  }

  // Success response — sanitize the DB row to stable public fields only
  const final = updated || project;
  const res = NextResponse.json(
    {
      id: final.id,
      title: final.title,
      status: final.status,
      original_language: final.original_language,
      duration_seconds: final.duration_seconds,
      error_message: final.error_message ?? null,
      created_at: final.created_at,
    },
    { status: 201 }
  );
  return limit.applyHeaders(res);
}
