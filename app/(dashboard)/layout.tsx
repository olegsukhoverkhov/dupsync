import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardLocaleProvider } from "@/components/dashboard/locale-provider";
import { SuspendedCheck } from "@/components/dashboard/suspended-check";
import { resolveDashboardLocale } from "@/lib/i18n/dashboard-locale";

export const dynamic = "force-dynamic";

/**
 * Dashboard layout — server component that resolves the user's effective
 * UI locale (from their profile, falling back to the geo cookie) and
 * passes the loaded dictionary into a client-side provider. Every nested
 * page/component reads strings via `useDashboardT()`.
 *
 * Locale stays stable for the whole session unless the user signs in
 * as a different user. When the user changes language from Settings the
 * page does a full reload (`router.refresh()`) so this server layout
 * re-runs and picks up the new `profiles.locale`.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, dict } = await resolveDashboardLocale();

  return (
    <DashboardLocaleProvider locale={locale} dict={dict}>
      <div className="landing-dark bg-[#0F172A] text-white flex flex-col min-h-screen lg:flex-row lg:h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
        <SuspendedCheck />
      </div>
    </DashboardLocaleProvider>
  );
}
