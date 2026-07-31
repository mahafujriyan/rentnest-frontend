import api from "@/lib/axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    if (!data.data) throw new Error(data.message || "Login failed");
    return data.data;
  },

  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/register",
      registerData
    );
    if (!data.data) throw new Error(data.message || "Registration failed");
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    if (!data.data) throw new Error(data.message || "Failed to fetch profile");
    return data.data;
  },
};
