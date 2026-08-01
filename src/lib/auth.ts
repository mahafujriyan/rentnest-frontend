import Cookies from "js-cookie";
import { TOKEN_KEY, USER_KEY } from "@/constants";
import type { Role, User } from "@/types";

const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function setAuth(token: string, user: User) {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
  Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
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
