"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getDashboardPath } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/dashboard");
      return;
    }
    router.replace(getDashboardPath(user.role));
  }, [isAuthenticated, isLoading, router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-background to-sky-50 dark:from-emerald-950/40 dark:via-background dark:to-slate-950">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-emerald-600" />
        <span className="text-sm font-medium">Opening your dashboard…</span>
      </div>
    </div>
  );
}
