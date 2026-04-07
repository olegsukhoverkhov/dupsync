import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runTranscription } from "@/lib/pipeline";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { PlanType } from "@/lib/supabase/types";

export const maxDuration = 300;

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ?view=active (default) → only non-archived projects
  // ?view=archived → only archived projects
  // ?view=all → everything
  const url = new URL(request.url);
  const view = url.searchParams.get("view") || "active";

  let query = supabase
    .from("projects")
    .select("*, dubs(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (view === "active") {
    query = query.is("archived_at", null);
  } else if (view === "archived") {
    query = query.not("archived_at", "is", null);
  }
  // view=all → no filter

  const { data: projects, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, videoPath, language } = body;

  if (!title || !videoPath) {
    return NextResponse.json(
      { error: "Title and videoPath are required" },
      { status: 400 }
    );
  }

  // Load the user's plan to know their limits. The client may try to bypass
  // its own checks by uploading a larger/longer file directly to storage,
  // so we MUST verify on the server before creating the project.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan: PlanType = (profile?.plan as PlanType) || "free";
  const planLimits = PLAN_LIMITS[plan];

  // -------- File-size enforcement --------
  // Verify the actual size of the uploaded file via the Storage API. We
  // can't trust the client to send the real size in the request body.
  try {
    const dirPath = videoPath.split("/").slice(0, -1).join("/");
    const fileName = videoPath.split("/").pop();
    const { data: listing } = await supabase.storage
      .from("videos")
      .list(dirPath, { limit: 100, search: fileName });
    const fileMeta = listing?.find((f) => f.name === fileName);
    const sizeBytes = (fileMeta?.metadata as { size?: number } | undefined)?.size ?? 0;
    if (sizeBytes > planLimits.maxFileSize * 1024 * 1024) {
      // Clean up the oversize upload
      await supabase.storage.from("videos").remove([videoPath]);
      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(0);
      return NextResponse.json(
        {
          error: `File too large (${sizeMB}MB). The ${planLimits.name} plan allows max ${planLimits.maxFileSize}MB. Upgrade your plan to upload larger files.`,
        },
        { status: 413 }
      );
    }
  } catch (err) {
    console.warn("[PROJECTS] File size check failed (non-fatal):", err);
    // Don't block the upload if the Storage API fails — duration check
    // will catch most cases anyway.
  }

  // Check for duplicate project name
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user.id)
    .eq("title", title)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: `A project named "${title}" already exists. Please choose a different name.` },
      { status: 409 }
    );
  }

  // Create project
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title,
      original_video_url: videoPath,
      original_language: language || "auto",
      status: "transcribing",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Run transcription synchronously — client polls for status
  try {
    await runTranscription(project.id);
  } catch (err) {
    console.error("Transcription failed:", err);
    // Project status already set to "error" by pipeline
  }

  // Re-fetch project with updated status + duration
  const { data: updatedProject } = await supabase
    .from("projects")
    .select("*")
    .eq("id", project.id)
    .single();

  // -------- Duration enforcement (post-transcription) --------
  // Whisper sets duration_seconds. If the plan has a duration cap and the
  // video exceeds it, delete the project + storage and return 413. We do
  // this AFTER transcription because we don't have ffprobe on Vercel.
  if (
    updatedProject &&
    planLimits.maxVideoSeconds > 0 &&
    updatedProject.duration_seconds &&
    updatedProject.duration_seconds > planLimits.maxVideoSeconds
  ) {
    const dur = updatedProject.duration_seconds;
    const limitLabel =
      planLimits.maxVideoSeconds >= 60
        ? `${(planLimits.maxVideoSeconds / 60).toFixed(0)} min`
        : `${planLimits.maxVideoSeconds} sec`;

    // Clean up: delete the project, its dubs (cascade), and the uploaded file
    await supabase.from("dubs").delete().eq("project_id", project.id);
    await supabase.from("projects").delete().eq("id", project.id);
    await supabase.storage.from("videos").remove([videoPath]);

    return NextResponse.json(
      {
        error: `Video too long (${dur.toFixed(1)}s). The ${planLimits.name} plan allows max ${limitLabel}. Upgrade your plan to dub longer videos.`,
      },
      { status: 413 }
    );
  }

  return NextResponse.json(updatedProject || project, { status: 201 });
}
