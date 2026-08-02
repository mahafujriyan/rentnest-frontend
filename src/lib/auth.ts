import Cookies from "js-cookie";
import { TOKEN_KEY, USER_KEY } from "@/constants";
import type { Role, User } from "@/types";

const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function setAuth(token: string, user: User) {
  // Always set path=/ so proxy/middleware can read cookies on every route
  const options = { ...COOKIE_OPTIONS, path: "/" };
  Cookies.set(TOKEN_KEY, token, options);
  Cookies.set(USER_KEY, JSON.stringify(user), options);
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY, { path: "/" });
  Cookies.remove(USER_KEY, { path: "/" });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const userStr = Cookies.get(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function hasRole(user: User | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "LANDLORD":
      return "/dashboard/landlord";
    case "TENANT":
    default:
      return "/dashboard/tenant";
  }
}
