import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants";
import { clearAuth, getToken } from "@/lib/auth";
import type { ApiResponse } from "@/types";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function formatErrorDetails(details: unknown): string | null {
  if (!details) return null;
  if (typeof details === "string") return details;
  if (Array.isArray(details)) {
    const parts = details
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          const path = Array.isArray(record.path)
            ? record.path.join(".")
            : typeof record.path === "string"
              ? record.path
              : typeof record.field === "string"
                ? record.field
                : "";
          const msg =
            typeof record.message === "string"
              ? record.message
              : typeof record.msg === "string"
                ? record.msg
                : "";
          return [path, msg].filter(Boolean).join(": ");
        }
        return "";
      })
      .filter(Boolean);
    return parts.length ? parts.join(" · ") : null;
  }
  if (typeof details === "object") {
    const record = details as Record<string, unknown>;
    // Zod-style { fieldErrors: { field: ["msg"] } }
    if (record.fieldErrors && typeof record.fieldErrors === "object") {
      const fieldErrors = record.fieldErrors as Record<string, unknown>;
      const parts = Object.entries(fieldErrors).flatMap(([field, msgs]) => {
        if (Array.isArray(msgs)) return msgs.map((m) => `${field}: ${String(m)}`);
        if (typeof msgs === "string") return [`${field}: ${msgs}`];
        return [];
      });
      if (parts.length) return parts.join(" · ");
    }
    const parts = Object.entries(record).map(([key, value]) => {
      if (Array.isArray(value)) return `${key}: ${value.join(", ")}`;
      return `${key}: ${String(value)}`;
    });
    return parts.length ? parts.join(" · ") : null;
  }
  return null;
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== "undefined" ? getToken() : undefined;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const data = error.response?.data;
    const details = formatErrorDetails(data?.errorDetails);
    const message =
      details ||
      data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAuth();
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";

      if (!isAuthPage) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
