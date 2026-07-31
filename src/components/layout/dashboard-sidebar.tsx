"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { APP_NAME } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  links: { href: string; label: string; icon: React.ReactNode }[];
  title: string;
}

export function DashboardSidebar({ links, title }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600">
            <Building2 className="size-4 text-white" />
          </div>
          <span className="font-bold">{APP_NAME}</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== links[0].href && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <Avatar className="size-9">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={logout}
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-around py-2">
        {links.slice(0, 5).map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-xs",
                isActive ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              <span className="size-5">{link.icon}</span>
              <span className="max-w-[60px] truncate">{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
