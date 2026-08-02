"use client";

import {
  LayoutDashboard,
  Building,
  FileText,
  User,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-sidebar";

const landlordLinks = [
  { href: "/dashboard/landlord", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/landlord/properties", label: "Properties", icon: <Building className="size-4" /> },
  { href: "/dashboard/landlord/requests", label: "Requests", icon: <FileText className="size-4" /> },
  { href: "/dashboard/landlord/profile", label: "Profile", icon: <User className="size-4" /> },
];

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell links={landlordLinks} title="Landlord">
      {children}
    </DashboardShell>
  );
}
