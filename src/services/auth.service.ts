import api from "@/lib/axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types";

function isAuthResponse(value: unknown): value is AuthResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "token" in value &&
    "user" in value
  );
}

function unwrapAuthResponse(
  response: ApiResponse<AuthResponse> | AuthResponse,
  fallbackMessage: string
): AuthResponse {
  const authData = isAuthResponse(response) ? response : response.data;

  if (!isAuthResponse(authData)) {
    throw new Error(("message" in response && response.message) || fallbackMessage);
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
    if (!data.data) throw new Error(data.message || "Failed to fetch profile");
    return data.data;
  },

  updateProfile: async (profileData: { name: string; phone?: string }): Promise<User> => {
    const { data } = await api.patch<ApiResponse<User>>("/auth/me", profileData);
    if (!data.data) throw new Error(data.message || "Failed to update profile");
    return data.data;
  },
};
