"use client";

import {
  LayoutDashboard,
  Users,
  FolderTree,
  Building,
  FileText,
} from "lucide-react";
import { DashboardSidebar, DashboardMobileNav } from "@/components/layout/dashboard-sidebar";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="size-4" /> },
  { href: "/admin/categories", label: "Categories", icon: <FolderTree className="size-4" /> },
  { href: "/admin/properties", label: "Properties", icon: <Building className="size-4" /> },
  { href: "/admin/rentals", label: "Rentals", icon: <FileText className="size-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar links={adminLinks} title="Admin Dashboard" />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="container mx-auto p-4 md:p-8">{children}</div>
      </main>
      <DashboardMobileNav links={adminLinks} />
    </div>
  );
}
