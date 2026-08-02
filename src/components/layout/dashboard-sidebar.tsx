"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { APP_NAME } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  links: { href: string; label: string; icon: React.ReactNode }[];
  title: string;
}

export function DashboardSidebar({ links, title }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.refresh();
    window.location.assign("/login");
  };

  return (
    <aside className="relative hidden w-72 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-slate-950 text-slate-100 lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.22),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(14,165,233,0.12),_transparent_50%)]"
      />

      <div className="relative flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.45)]">
            <Building2 className="size-4 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-semibold tracking-tight">{APP_NAME}</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-300/80">
              {title}
            </span>
          </div>
        </Link>
      </div>

      <ScrollArea className="relative flex-1 px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Menu
        </p>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== links[0].href && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    isActive ? "bg-white/15" : "bg-white/5 group-hover:bg-white/10"
                  )}
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="relative border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
          <Avatar className="size-10 ring-2 ring-emerald-400/40">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-emerald-500/20 text-emerald-200 text-xs">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs capitalize text-slate-400">
              {user?.role?.toLowerCase()}
            </p>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}

export function DashboardMobileNav({
  links,
}: {
  links: { href: string; label: string; icon: React.ReactNode }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-1 py-2">
        {links.slice(0, 5).map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== links[0].href && pathname.startsWith(`${link.href}/`));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl transition-colors",
                  isActive ? "bg-emerald-500/15 text-emerald-600" : "bg-muted/60"
                )}
              >
                {link.icon}
              </span>
              <span className="max-w-[64px] truncate">{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DashboardShell({
  links,
  title,
  children,
}: {
  links: { href: string; label: string; icon: React.ReactNode }[];
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/80 via-background to-sky-50/60 dark:from-emerald-950/30 dark:via-background dark:to-slate-950">
      <DashboardSidebar links={links} title={title} />
      <main className="relative flex-1 overflow-auto pb-24 lg:pb-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="relative container mx-auto max-w-6xl p-4 md:p-8">{children}</div>
      </main>
      <DashboardMobileNav links={links} />
    </div>
  );
}
