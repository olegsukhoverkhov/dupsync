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
import { Loader2, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string; type: "error" | "info" } | null>(null);

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

  async function handleBillingAction(action: string, plan?: string) {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setAlertModal({ title: "Error", message: "Failed to open billing portal. Please try again.", type: "error" });
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
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
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
                {profile.full_name || "No name set"}
              </p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing
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
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">
                {currentPlan.price === 0
                  ? "Free"
                  : `$${currentPlan.price / 100}/month`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Credits</p>
              <p className="font-medium">
                {profile.credits_remaining === -1
                  ? "Unlimited"
                  : `${Math.floor(Number(profile.credits_remaining))} credits remaining`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Max File Size</p>
              <p className="font-medium">{currentPlan.maxFileSize}MB</p>
            </div>
            <div>
              <p className="text-muted-foreground">Max Languages</p>
              <p className="font-medium">{currentPlan.maxLanguages}</p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            {profile.plan === "free" ? (
              <>
                <Button
                  onClick={() => handleBillingAction("checkout", "starter")}
                  disabled={billingLoading}
                >
                  {billingLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upgrade to Starter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBillingAction("checkout", "pro")}
                  disabled={billingLoading}
                >
                  Upgrade to Pro
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleBillingAction("portal")}
                disabled={billingLoading}
              >
                {billingLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Manage Subscription
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
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
    </div>
  );
}
