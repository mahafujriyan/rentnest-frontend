"use client";

import { Users, Building, FileText, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/use-admin";
import { formatPrice } from "@/lib/format";

export default function AdminDashboard() {
  const { data: stats, isLoading, error, refetch } = useAdminStats();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const chartData = [
    { name: "Users", value: stats?.totalUsers || 0 },
    { name: "Properties", value: stats?.totalProperties || 0 },
    { name: "Rentals", value: stats?.totalRentals || 0 },
    { name: "Active", value: stats?.activeRentals || 0 },
    { name: "Pending", value: stats?.pendingRequests || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="mt-1 text-muted-foreground">Platform statistics and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} />
        <StatCard title="Properties" value={stats?.totalProperties || 0} icon={Building} />
        <StatCard title="Rentals" value={stats?.totalRentals || 0} icon={FileText} />
        <StatCard title="Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.596 0.145 163.225)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
