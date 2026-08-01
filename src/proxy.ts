import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_KEY } from "@/constants";

const publicRoutes = ["/", "/properties", "/about", "/contact", "/faq", "/login", "/register"];
const authRoutes = ["/login", "/register"];

const tenantRoutes = ["/tenant"];
const landlordRoutes = ["/landlord"];
const adminRoutes = ["/admin"];

function decodeToken(token: string): { role?: string; user?: { role?: string } } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = JSON.parse(atob(padded));
    return decoded;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  const isPublicRoute =
    publicRoutes.some((route) => pathname === route) ||
    pathname.startsWith("/properties/") ||
    pathname.startsWith("/payment/");

  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isTenantRoute = tenantRoutes.some((route) => pathname.startsWith(route));
  const isLandlordRoute = landlordRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const isProtectedRoute = isTenantRoute || isLandlordRoute || isAdminRoute;

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const decoded = decodeToken(token);
    const role = decoded?.role || decoded?.user?.role;

    if (isAuthRoute) {
      const dashboard =
        role === "ADMIN" ? "/admin" : role === "LANDLORD" ? "/landlord" : "/tenant";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    if (isTenantRoute && role !== "TENANT" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/landlord", request.url));
    }

    if (isLandlordRoute && role !== "LANDLORD" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/tenant", request.url));
    }

    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/tenant", request.url));
    }
  }

  if (!isPublicRoute && !isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
