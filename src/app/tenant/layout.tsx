"use client";

import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Star,
  User,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-sidebar";

const tenantLinks = [
  { href: "/dashboard/tenant", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/tenant/requests", label: "Rental Requests", icon: <FileText className="size-4" /> },
  { href: "/dashboard/tenant/payments", label: "Payments", icon: <CreditCard className="size-4" /> },
  { href: "/dashboard/tenant/reviews", label: "Reviews", icon: <Star className="size-4" /> },
  { href: "/dashboard/tenant/profile", label: "Profile", icon: <User className="size-4" /> },
];

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell links={tenantLinks} title="Tenant">
      {children}
    </DashboardShell>
  );
}
