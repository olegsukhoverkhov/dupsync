import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUsers } from "@/lib/admin";
import { UsersTable } from "@/components/admin/users-table";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) notFound();

  const sp = await searchParams;
  const pick = (k: string): string => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] ?? "" : v ?? "";
  };
  const usersPageParam = parseInt(pick("users") || "1", 10);
  const usersPage = Number.isFinite(usersPageParam) && usersPageParam > 0
    ? usersPageParam
    : 1;

  const usersPageData = await getAdminUsers(usersPage, 10);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Users
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage users, plans, and credits.
        </p>
      </header>

      <AdminNav />

      <UsersTable initial={usersPageData} />
    </div>
  );
}
