"use client";

import Link from "next/link";
import { ArrowRight, FileText, CreditCard, Star } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRentals } from "@/hooks/use-rentals";
import { usePayments } from "@/hooks/use-payments";
import { useAuthStore } from "@/store/auth.store";
import { formatDate, formatPrice } from "@/lib/format";

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const { data: rentals, isLoading: rentalsLoading } = useRentals();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  if (rentalsLoading || paymentsLoading) return <DashboardSkeleton />;

  const pending = rentals?.filter((r) => r.status === "PENDING").length || 0;
  const active = rentals?.filter((r) => r.status === "ACTIVE" || r.status === "APPROVED").length || 0;
  const totalPaid = payments?.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s an overview of your rental activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Requests" value={rentals?.length || 0} icon={FileText} />
        <StatCard title="Pending" value={pending} icon={FileText} description="Awaiting approval" />
        <StatCard title="Active Rentals" value={active} icon={Star} />
        <StatCard title="Total Paid" value={formatPrice(totalPaid)} icon={CreditCard} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Requests</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tenant/requests">View all <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {rentals && rentals.length > 0 ? (
            <div className="space-y-3">
              {rentals.slice(0, 5).map((rental) => (
                <div key={rental.id} className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">{rental.property?.title || "Property"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                    </p>
                  </div>
                  <StatusBadge status={rental.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No rental requests yet.{" "}
              <Link href="/properties" className="text-emerald-600 hover:underline">
                Browse properties
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
