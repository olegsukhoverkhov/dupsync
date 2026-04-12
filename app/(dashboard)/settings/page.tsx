"use client";

import { useEffect, useState } from "react";
import { AlertModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { Profile } from "@/lib/supabase/types";
import { Loader2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/dashboard/language-switcher";
import { useDashboardT } from "@/components/dashboard/locale-provider";
import { SubscriptionModal } from "@/components/dashboard/subscription-modal";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string; type: "error" | "info" } | null>(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const t = useDashboardT();

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data as Profile);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleUpgradeCheckout(plan: string) {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkout", plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setAlertModal({
        title: t("dashboard.settingsPage.errorTitle", "Error"),
        message: t("dashboard.settingsPage.billingPortalError", "Failed to open billing portal. Please try again."),
        type: "error",
      });
    } finally {
      setBillingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const currentPlan = PLAN_LIMITS[profile.plan];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">{t("dashboard.settingsPage.title", "Settings")}</h1>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("dashboard.settingsPage.profile", "Profile")}</CardTitle>
          <CardDescription>{t("dashboard.settingsPage.profileDescription", "Your account information")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>
                {profile.full_name?.charAt(0) || profile.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {profile.full_name || t("dashboard.settingsPage.noNameSet", "No name set")}
              </p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Card — mobile users primarily discover the language
          switcher here (the sidebar switcher is desktop-only). Picking
          a locale calls PATCH /api/profile/locale which stamps the DB
          and refreshes the server layout so the whole dashboard
          re-renders in the chosen language without a full reload. */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("dashboard.settingsPage.language", "Language")}</CardTitle>
          <CardDescription>
            {t("dashboard.settingsPage.languageDescription", "Interface language for the dashboard and emails.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <LanguageSwitcher placement="bottom" />
          </div>
        </CardContent>
      </Card>

      {/* Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("dashboard.settingsPage.subscriptionPlan", "Subscription Plan")}</CardTitle>
              <CardDescription>
                {t("dashboard.settingsPage.subscriptionDescription", "Manage your subscription and billing")}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{t("dashboard.settingsPage.price", "Price")}</p>
              <p className="font-medium">
                {currentPlan.price === 0
                  ? t("dashboard.settingsPage.free", "Free")
                  : t("dashboard.settingsPage.perMonth", "${price}/month", { price: String(currentPlan.price / 100) })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("dashboard.settingsPage.credits", "Credits")}</p>
              <p className="font-medium">
                {currentPlan.credits === -1
                  ? t("dashboard.settingsPage.unlimited", "Unlimited")
                  : t("dashboard.settingsPage.creditsOfTotal", "{used} / {total} credits", {
                      used: String(Math.floor(Math.min(Number(profile.credits_remaining), currentPlan.credits))),
                      total: String(currentPlan.credits),
                    })}
              </p>
              {Number(profile.topup_credits ?? 0) > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("dashboard.settingsPage.topupExtra", "+ {n} top-up credits", { n: String(Math.floor(Number(profile.topup_credits))) })}
                </p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground">{t("dashboard.settingsPage.maxFileSize", "Max File Size")}</p>
              <p className="font-medium">{currentPlan.maxFileSize}MB</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("dashboard.settingsPage.maxLanguages", "Max Languages")}</p>
              <p className="font-medium">{currentPlan.maxLanguages}</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            {profile.plan === "free" ? (
              <>
                <Button
                  onClick={() => handleUpgradeCheckout("starter")}
                  disabled={billingLoading}
                >
                  {billingLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("dashboard.settingsPage.upgradeToStarter", "Upgrade to Starter")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpgradeCheckout("pro")}
                  disabled={billingLoading}
                >
                  {t("dashboard.settingsPage.upgradeToPro", "Upgrade to Pro")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpgradeCheckout("enterprise")}
                  disabled={billingLoading}
                >
                  {t("dashboard.settingsPage.upgradeToEnterprise", "Upgrade to Enterprise")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowSubModal(true)}
                >
                  {t("dashboard.settingsPage.manageSubscription", "Manage Subscription")}
                </Button>
                {profile.plan === "starter" && (
                  <>
                    <Button onClick={() => handleUpgradeCheckout("pro")} disabled={billingLoading}>
                      {billingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("dashboard.settingsPage.upgradeToPro", "Upgrade to Pro")}
                    </Button>
                    <Button variant="outline" onClick={() => handleUpgradeCheckout("enterprise")} disabled={billingLoading}>
                      {t("dashboard.settingsPage.upgradeToEnterprise", "Upgrade to Enterprise")}
                    </Button>
                  </>
                )}
                {profile.plan === "pro" && (
                  <Button onClick={() => handleUpgradeCheckout("enterprise")} disabled={billingLoading}>
                    {billingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("dashboard.settingsPage.upgradeToEnterprise", "Upgrade to Enterprise")}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {alertModal && (
        <AlertModal
          open={true}
          onClose={() => setAlertModal(null)}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      )}

      {profile && profile.plan !== "free" && showSubModal && (
        <SubscriptionModal
          open={showSubModal}
          onClose={() => setShowSubModal(false)}
          plan={profile.plan}
          planPrice={PLAN_LIMITS[profile.plan]?.price || 0}
        />
      )}
    </div>
  );
}
