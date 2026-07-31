import { create } from "zustand";
import { clearAuth, getStoredUser, setAuth } from "@/lib/auth";
import { authService } from "@/services";
import type { LoginCredentials, RegisterData, User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => void;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    const user = getStoredUser();
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  login: async (credentials) => {
    const { token, user } = await authService.login(credentials);
    setAuth(token, user);
    set({ user, isAuthenticated: true });
    return user;
  },

  register: async (data) => {
    const { token, user } = await authService.register(data);
    setAuth(token, user);
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: () => {
    clearAuth();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  refreshUser: async () => {
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      clearAuth();
      set({ user: null, isAuthenticated: false });
    }
  },
}));
