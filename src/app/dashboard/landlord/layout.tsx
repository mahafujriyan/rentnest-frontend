"use client";

import {
  LayoutDashboard,
  Building,
  FileText,
  User,
} from "lucide-react";
import { DashboardSidebar, DashboardMobileNav } from "@/components/layout/dashboard-sidebar";

const landlordLinks = [
  { href: "/dashboard/landlord", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/landlord/properties", label: "Properties", icon: <Building className="size-4" /> },
  { href: "/dashboard/landlord/requests", label: "Requests", icon: <FileText className="size-4" /> },
  { href: "/dashboard/landlord/profile", label: "Profile", icon: <User className="size-4" /> },
];

export default function LandlordDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar links={landlordLinks} title="Landlord Dashboard" />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="container mx-auto p-4 md:p-8">{children}</div>
      </main>
      <DashboardMobileNav links={landlordLinks} />
    </div>
  );
}

