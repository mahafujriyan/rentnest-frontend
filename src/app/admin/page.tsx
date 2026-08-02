"use client";

import { Users, Building, FileText, DollarSign, Sparkles } from "lucide-react";
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
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white shadow-xl shadow-emerald-900/10 md:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-sky-400/15 blur-3xl"
        />
        <div className="relative max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-200">
            <Sparkles className="size-3.5" />
            Admin control center
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Platform Overview</h1>
          <p className="text-sm leading-relaxed text-slate-300 md:text-base">
            Live insights across users, listings, rentals, and revenue.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} accent="emerald" />
        <StatCard title="Properties" value={stats?.totalProperties || 0} icon={Building} accent="sky" />
        <StatCard title="Rentals" value={stats?.totalRentals || 0} icon={FileText} accent="amber" />
        <StatCard title="Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} accent="violet" />
      </div>

      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-sm backdrop-blur">
        <div className="border-b border-border/60 px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight">Platform Statistics</h2>
          <p className="text-sm text-muted-foreground">Snapshot of marketplace health</p>
        </div>
        <div className="p-4 md:p-6">
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
        </div>
      </section>
    </div>
  );
}
