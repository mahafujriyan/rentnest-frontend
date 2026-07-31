"use client";

import Link from "next/link";
import { ArrowRight, Building, FileText, DollarSign } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLandlordProperties } from "@/hooks/use-properties";
import { useLandlordRequests } from "@/hooks/use-rentals";
import { useAuthStore } from "@/store/auth.store";
import { formatDate, formatPrice } from "@/lib/format";

export default function LandlordDashboard() {
  const { user } = useAuthStore();
  const { data: properties, isLoading: propsLoading } = useLandlordProperties();
  const { data: requests, isLoading: reqLoading } = useLandlordRequests();

  if (propsLoading || reqLoading) return <DashboardSkeleton />;

  const pending = requests?.filter((r) => r.status === "PENDING").length || 0;
  const available = properties?.filter((p) => p.isAvailable).length || 0;
  const revenue = properties?.reduce((sum, p) => sum + p.price, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(" ")[0]}!</h1>
        <p className="mt-1 text-muted-foreground">Manage your properties and rental requests</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Properties" value={properties?.length || 0} icon={Building} />
        <StatCard title="Available" value={available} icon={Building} description="Listed & available" />
        <StatCard title="Pending Requests" value={pending} icon={FileText} />
        <StatCard title="Monthly Potential" value={formatPrice(revenue)} icon={DollarSign} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Requests</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/landlord/requests">View all <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.slice(0, 5).map((req) => (
                <div key={req.id} className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">{req.property?.title || "Property"}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.tenant?.name} · {formatDate(req.startDate)} - {formatDate(req.endDate)}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">No rental requests yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
