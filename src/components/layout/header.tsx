"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { useState } from "react";
import { APP_NAME, NAV_LINKS } from "@/constants";
import { getDashboardPath } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath = user ? getDashboardPath(user.role) : "/login";

  const navLinks = isAuthenticated && user
    ? user.role === "ADMIN"
      ? NAV_LINKS.admin
      : user.role === "LANDLORD"
        ? NAV_LINKS.landlord
        : NAV_LINKS.tenant
    : NAV_LINKS.public;

  const isDashboard = pathname.startsWith("/dashboard/tenant") ||
    pathname.startsWith("/dashboard/landlord") ||
    pathname.startsWith("/dashboard/admin") ||
    pathname.startsWith("/tenant") ||
    pathname.startsWith("/landlord") ||
    pathname.startsWith("/admin");

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
            <Building2 className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.public.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === link.href
                  ? "text-emerald-600"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 outline-none hover:bg-muted"
              >
                <Avatar className="size-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:block">
                  {user.name}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push(dashboardPath)}>
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`${dashboardPath}/profile`)}>
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  logout();
                  window.location.assign("/login");
                }} className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-muted md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{APP_NAME}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === link.href && "text-emerald-600"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
