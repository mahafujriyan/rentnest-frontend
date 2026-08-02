"use client";

import Link from "next/link";
import { ArrowRight, Building, FileText, DollarSign, Plus, Sparkles } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useLandlordProperties } from "@/hooks/use-properties";
import { useLandlordRequests } from "@/hooks/use-rentals";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice, formatRentalDate } from "@/lib/format";

export default function LandlordDashboard() {
  const { user } = useAuthStore();
  const {
    data: properties,
    isLoading: propsLoading,
    error: propertiesError,
    refetch: refetchProperties,
  } = useLandlordProperties();
  const {
    data: requests,
    isLoading: reqLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useLandlordRequests();

  if (propsLoading || reqLoading) return <DashboardSkeleton />;
  if (propertiesError || requestsError) {
    return (
      <ErrorState
        message={(propertiesError || requestsError)?.message}
        onRetry={() => {
          refetchProperties();
          refetchRequests();
        }}
      />
    );
  }

  const pending = requests?.filter((r) => r.status === "PENDING").length || 0;
  const available = properties?.filter((p) => p.isAvailable).length || 0;
  const revenue = properties?.reduce((sum, p) => sum + p.price, 0) || 0;
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
              Landlord workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome, {firstName}
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 md:text-base">
              Manage listings, approve tenants, and track portfolio performance.
            </p>
          </div>
          <Button asChild className="bg-emerald-500 text-white hover:bg-emerald-400">
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="mr-2 size-4" />
              Add property
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Properties" value={properties?.length || 0} icon={Building} accent="emerald" />
        <StatCard title="Available" value={available} icon={Building} description="Listed & available" accent="sky" />
        <StatCard title="Pending Requests" value={pending} icon={FileText} accent="amber" />
        <StatCard title="Monthly Potential" value={formatPrice(revenue)} icon={DollarSign} accent="violet" />
      </div>

      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recent Requests</h2>
            <p className="text-sm text-muted-foreground">Incoming rental applications</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/landlord/requests">
              View all <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
        <div className="p-4 md:p-6">
          {requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.slice(0, 5).map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-4 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{req.property?.title || "Property"}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {req.tenant?.name || "Tenant"} · {formatRentalDate(req)}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 px-6 py-12 text-center text-muted-foreground">
              No rental requests yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
