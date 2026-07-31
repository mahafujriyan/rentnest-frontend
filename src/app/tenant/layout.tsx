"use client";

import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Star,
  User,
} from "lucide-react";
import { DashboardSidebar, DashboardMobileNav } from "@/components/layout/dashboard-sidebar";

const tenantLinks = [
  { href: "/tenant", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/tenant/requests", label: "Rental Requests", icon: <FileText className="size-4" /> },
  { href: "/tenant/payments", label: "Payments", icon: <CreditCard className="size-4" /> },
  { href: "/tenant/reviews", label: "Reviews", icon: <Star className="size-4" /> },
  { href: "/tenant/profile", label: "Profile", icon: <User className="size-4" /> },
];

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar links={tenantLinks} title="Tenant Dashboard" />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="container mx-auto p-4 md:p-8">{children}</div>
      </main>
      <DashboardMobileNav links={tenantLinks} />
    </div>
  );
}
