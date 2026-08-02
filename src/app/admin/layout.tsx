"use client";

import {
  LayoutDashboard,
  Users,
  FolderTree,
  Building,
  FileText,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-sidebar";

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/dashboard/admin/users", label: "Users", icon: <Users className="size-4" /> },
  { href: "/dashboard/admin/categories", label: "Categories", icon: <FolderTree className="size-4" /> },
  { href: "/dashboard/admin/properties", label: "Properties", icon: <Building className="size-4" /> },
  { href: "/dashboard/admin/rentals", label: "Rentals", icon: <FileText className="size-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell links={adminLinks} title="Admin">
      {children}
    </DashboardShell>
  );
}
