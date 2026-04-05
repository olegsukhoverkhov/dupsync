import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runDubbing } from "@/lib/pipeline";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { Profile } from "@/lib/supabase/types";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectId, languages } = body as {
    projectId: string;
    languages: string[];
  };

  if (!projectId || !languages?.length) {
    return NextResponse.json(
      { error: "projectId and languages are required" },
      { status: 400 }
    );
  }

  // Check plan limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const typedProfile = profile as Profile;
  const planLimits = PLAN_LIMITS[typedProfile.plan];

  if (languages.length > planLimits.maxLanguages) {
    return NextResponse.json(
      {
        error: `Your ${planLimits.name} plan allows max ${planLimits.maxLanguages} languages`,
      },
      { status: 403 }
    );
  }

  // Check credits
  const { data: project } = await supabase
    .from("projects")
    .select("duration_seconds")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const durationMinutes = Math.ceil((project.duration_seconds || 0) / 60);
  const requiredCredits = durationMinutes * languages.length;

  if (
    planLimits.credits !== -1 &&
    typedProfile.credits_remaining < requiredCredits
  ) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 403 }
    );
  }

  // Update project status
  await supabase
    .from("projects")
    .update({ status: "dubbing" })
    .eq("id", projectId);

  // Create dub records
  const dubInserts = languages.map((lang) => ({
    project_id: projectId,
    target_language: lang,
    status: "pending" as const,
  }));

  const { data: dubs, error } = await supabase
    .from("dubs")
    .insert(dubInserts)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Deduct credits
  if (planLimits.credits !== -1) {
    await supabase
      .from("profiles")
      .update({
        credits_remaining: typedProfile.credits_remaining - requiredCredits,
      })
      .eq("id", user.id);
  }

  // Start dubbing pipelines in background
  for (const dub of dubs || []) {
    runDubbing(dub.id).catch(console.error);
  }

  return NextResponse.json(dubs, { status: 201 });
}
