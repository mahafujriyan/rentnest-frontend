import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_KEY, USER_KEY } from "@/constants";

const publicRoutes = ["/", "/properties", "/about", "/contact", "/faq", "/login", "/register"];
const authRoutes = ["/login", "/register"];

const roleDashboards = {
  ADMIN: "/dashboard/admin",
  LANDLORD: "/dashboard/landlord",
  TENANT: "/dashboard/tenant",
} as const;

type AppRole = keyof typeof roleDashboards;

function decodeToken(token: string): { role?: string; user?: { role?: string } } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function getRoleFromUserCookie(request: NextRequest): string | undefined {
  const userStr = request.cookies.get(USER_KEY)?.value;
  if (!userStr) return undefined;
  try {
    const user = JSON.parse(decodeURIComponent(userStr)) as { role?: string };
    return user?.role;
  } catch {
    try {
      const user = JSON.parse(userStr) as { role?: string };
      return user?.role;
    } catch {
      return undefined;
    }
  }
}

function resolveRole(request: NextRequest, token: string): AppRole | undefined {
  const decoded = decodeToken(token);
  const fromToken = decoded?.role || decoded?.user?.role;
  const role = fromToken || getRoleFromUserCookie(request);
  if (role === "ADMIN" || role === "LANDLORD" || role === "TENANT") {
    return role;
  }
  return undefined;
}

function dashboardFor(role: AppRole): string {
  return roleDashboards[role];
}

function isSafeRedirect(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/login") && !path.startsWith("/register");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  // Canonicalize legacy dashboard paths → /dashboard/*
  const legacyRedirects: Record<string, string> = {
    "/tenant": "/dashboard/tenant",
    "/landlord": "/dashboard/landlord",
    "/admin": "/dashboard/admin",
  };

  for (const [legacy, canonical] of Object.entries(legacyRedirects)) {
    if (pathname === legacy || pathname.startsWith(`${legacy}/`)) {
      const rest = pathname.slice(legacy.length);
      return NextResponse.redirect(new URL(`${canonical}${rest}${request.nextUrl.search}`, request.url));
    }
  }

  if (pathname === "/dashboard") {
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/dashboard", request.url));
    }
    const role = resolveRole(request, token);
    return NextResponse.redirect(new URL(role ? dashboardFor(role) : "/login", request.url));
  }

  const isPublicRoute =
    publicRoutes.some((route) => pathname === route) ||
    pathname.startsWith("/properties/") ||
    pathname.startsWith("/payment/");

  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isTenantRoute = pathname.startsWith("/dashboard/tenant");
  const isLandlordRoute = pathname.startsWith("/dashboard/landlord");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isProtectedRoute = isTenantRoute || isLandlordRoute || isAdminRoute;

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const role = resolveRole(request, token);

    if (isAuthRoute) {
      const redirect = request.nextUrl.searchParams.get("redirect");
      if (isSafeRedirect(redirect) && role) {
        // Only allow redirect into the user's own dashboard (or public pages)
        const ownsRedirect =
          (role === "ADMIN") ||
          (role === "TENANT" && redirect.startsWith("/dashboard/tenant")) ||
          (role === "LANDLORD" && redirect.startsWith("/dashboard/landlord")) ||
          (!redirect.startsWith("/dashboard/"));
        if (ownsRedirect) {
          return NextResponse.redirect(new URL(redirect, request.url));
        }
      }
      return NextResponse.redirect(new URL(role ? dashboardFor(role) : "/dashboard/tenant", request.url));
    }

    // Only enforce role when we know it — never bounce between dashboards if role is missing
    if (role) {
      if (isTenantRoute && role !== "TENANT" && role !== "ADMIN") {
        return NextResponse.redirect(new URL(dashboardFor(role), request.url));
      }
      if (isLandlordRoute && role !== "LANDLORD" && role !== "ADMIN") {
        return NextResponse.redirect(new URL(dashboardFor(role), request.url));
      }
      if (isAdminRoute && role !== "ADMIN") {
        return NextResponse.redirect(new URL(dashboardFor(role), request.url));
      }
    }
  }

  if (!isPublicRoute && !isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
