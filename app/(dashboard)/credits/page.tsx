"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS } from "@/lib/supabase/constants";
import type { Profile, Transaction } from "@/lib/supabase/types";
import { Loader2, CreditCard, TrendingUp, Clock } from "lucide-react";

export default function CreditsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const [profileRes, txRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20),
        ]);

        if (profileRes.data) setProfile(profileRes.data as Profile);
        if (txRes.data) setTransactions(txRes.data as Transaction[]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const planLimits = PLAN_LIMITS[profile.plan];
  const totalCredits =
    planLimits.credits === -1 ? Infinity : planLimits.credits;
  const usedCredits =
    totalCredits === Infinity
      ? 0
      : totalCredits - profile.credits_remaining;
  const usagePercent =
    totalCredits === Infinity
      ? 0
      : Math.round((usedCredits / totalCredits) * 100);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Credits & Usage</h1>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">
                  {profile.credits_remaining === -1
                    ? "∞"
                    : `${Math.floor(Number(profile.credits_remaining))} credits`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Used</p>
                <p className="text-2xl font-bold">
                  {totalCredits === Infinity ? "0" : `${Math.floor(Number(usedCredits))} credits`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-2xl font-bold">{planLimits.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage bar */}
      {totalCredits !== Infinity && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Monthly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span>{Math.floor(Number(usedCredits))} credits used</span>
              <span>{totalCredits.toLocaleString()} credits total</span>
            </div>
            <Progress value={usagePercent} />
          </CardContent>
        </Card>
      )}

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent billing and credit activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No transactions yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-sm">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {tx.description || tx.type}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {tx.credits > 0 ? `+${tx.credits} credits` : "-"}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {tx.amount > 0 ? `$${(tx.amount / 100).toFixed(2)}` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
