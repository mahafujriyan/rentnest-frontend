"use client";

import Link from "next/link";
import { ArrowRight, FileText, CreditCard, Star, Search, Sparkles } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useRentals } from "@/hooks/use-rentals";
import { usePayments } from "@/hooks/use-payments";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice, formatRentalDate } from "@/lib/format";

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const {
    data: rentals,
    isLoading: rentalsLoading,
    error: rentalsError,
    refetch: refetchRentals,
  } = useRentals();
  const {
    data: payments,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = usePayments();

  if (rentalsLoading || paymentsLoading) return <DashboardSkeleton />;
  if (rentalsError || paymentsError) {
    return (
      <ErrorState
        message={(rentalsError || paymentsError)?.message}
        onRetry={() => {
          refetchRentals();
          refetchPayments();
        }}
      />
    );
  }

  const pending = rentals?.filter((r) => r.status === "PENDING").length || 0;
  const active = rentals?.filter((r) => r.status === "ACTIVE" || r.status === "APPROVED").length || 0;
  const totalPaid = payments?.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0) || 0;
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white shadow-xl shadow-emerald-900/10 md:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-sky-400/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-200">
              <Sparkles className="size-3.5" />
              Tenant workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 md:text-base">
              Track requests, payments, and active stays — all in one premium dashboard.
            </p>
          </div>
          <Button asChild className="bg-emerald-500 text-white hover:bg-emerald-400">
            <Link href="/properties">
              <Search className="mr-2 size-4" />
              Browse properties
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Requests" value={rentals?.length || 0} icon={FileText} accent="emerald" />
        <StatCard title="Pending" value={pending} icon={FileText} description="Awaiting approval" accent="amber" />
        <StatCard title="Active Rentals" value={active} icon={Star} accent="sky" />
        <StatCard title="Total Paid" value={formatPrice(totalPaid)} icon={CreditCard} accent="violet" />
      </div>

      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recent Requests</h2>
            <p className="text-sm text-muted-foreground">Your latest rental activity</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/tenant/requests">
              View all <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
        <div className="p-4 md:p-6">
          {rentals && rentals.length > 0 ? (
            <div className="space-y-3">
              {rentals.slice(0, 5).map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-4 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{rental.property?.title || "Property"}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatRentalDate(rental)}
                    </p>
                  </div>
                  <StatusBadge status={rental.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 px-6 py-12 text-center">
              <p className="text-muted-foreground">
                No rental requests yet.{" "}
                <Link href="/properties" className="font-medium text-emerald-600 hover:underline">
                  Browse properties
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
