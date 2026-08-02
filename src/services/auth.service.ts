import api from "@/lib/axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Role,
  User,
} from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeRole(role: unknown): Role | undefined {
  if (Array.isArray(role) && role.length > 0) {
    return normalizeRole(role[0]);
  }
  if (typeof role !== "string") return undefined;
  const upper = role.toUpperCase().replace(/^ROLE_/, "");
  if (upper === "ADMIN" || upper === "LANDLORD" || upper === "TENANT") {
    return upper;
  }
  return undefined;
}

function normalizeUser(value: unknown): User | null {
  if (!isRecord(value)) return null;
  const role = normalizeRole(value.role ?? value.roles);
  const id = value.id ?? value._id;
  const email = value.email;
  if ((typeof id !== "string" && typeof id !== "number") || typeof email !== "string" || !role) {
    return null;
  }

  return {
    id: String(id),
    name: typeof value.name === "string" ? value.name : email,
    email,
    role,
    status: value.status as User["status"],
    phone: typeof value.phone === "string" ? value.phone : undefined,
    avatar: typeof value.avatar === "string" ? value.avatar : undefined,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : undefined,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
  };
}

function extractToken(value: Record<string, unknown>): string | null {
  const direct =
    value.token ?? value.accessToken ?? value.access_token ?? value.jwt;

  if (typeof direct === "string" && direct.length > 0) return direct;

  if (isRecord(value.tokens)) {
    const nested =
      value.tokens.accessToken ??
      value.tokens.access_token ??
      value.tokens.token;
    if (typeof nested === "string" && nested.length > 0) return nested;
  }

  return null;
}

function normalizeAuthPayload(payload: unknown): AuthResponse | null {
  if (!isRecord(payload)) return null;

  // { token/accessToken, user }
  const token = extractToken(payload);
  const user = normalizeUser(payload.user);
  if (token && user) return { token, user };

  // { success, message, data: { token, user } } or data nested again
  if ("data" in payload) {
    const nested = normalizeAuthPayload(payload.data);
    if (nested) return nested;
  }

  // { data: user, token } flat hybrid
  if (token) {
    const dataUser = normalizeUser(payload.data);
    if (dataUser) return { token, user: dataUser };
  }

  return null;
}

function unwrapAuthResponse(
  response: unknown,
  fallbackMessage: string
): AuthResponse {
  const authData = normalizeAuthPayload(response);

  if (!authData) {
    const message =
      isRecord(response) && typeof response.message === "string"
        ? response.message
        : fallbackMessage;
    // Avoid showing a success-looking API message as a hard failure when shape is wrong
    throw new Error(
      message.toLowerCase().includes("success")
        ? "Login succeeded but auth data was incomplete. Please try again."
        : message || fallbackMessage
    );
  }

  return authData;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse> | AuthResponse>(
      "/auth/login",
      credentials
    );
    return unwrapAuthResponse(data, "Login failed");
  },

  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse> | AuthResponse>(
      "/auth/register",
      registerData
    );
    return unwrapAuthResponse(data, "Registration failed");
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    const user = normalizeUser(data.data) ?? normalizeUser(data);
    if (!user) throw new Error(data.message || "Failed to fetch profile");
    return user;
  },

  updateProfile: async (profileData: { name: string; phone?: string }): Promise<User> => {
    const { data } = await api.patch<ApiResponse<User>>("/auth/me", profileData);
    const user = normalizeUser(data.data) ?? normalizeUser(data);
    if (!user) throw new Error(data.message || "Failed to update profile");
    return user;
  },
};
