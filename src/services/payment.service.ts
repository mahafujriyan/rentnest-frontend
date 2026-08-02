import api from "@/lib/axios";
import type { ApiResponse, Payment } from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractCheckoutUrl(payload: unknown): string | null {
  if (!isRecord(payload)) return null;

  const candidates = [
    payload.url,
    payload.checkoutUrl,
    payload.checkout_url,
    payload.sessionUrl,
    payload.session_url,
    payload.paymentUrl,
    payload.payment_url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && /^https?:\/\//i.test(candidate)) {
      return candidate;
    }
  }

  if (isRecord(payload.session) && typeof payload.session.url === "string") {
    if (/^https?:\/\//i.test(payload.session.url)) return payload.session.url;
  }

  if ("data" in payload) {
    return extractCheckoutUrl(payload.data);
  }

  return null;
}

function extractPayments(payload: unknown): Payment[] {
  if (Array.isArray(payload)) return payload as Payment[];
  if (!isRecord(payload)) return [];

  if (Array.isArray(payload.data)) return payload.data as Payment[];
  if (isRecord(payload.data) && Array.isArray(payload.data.items)) {
    return payload.data.items as Payment[];
  }
  if (Array.isArray(payload.payments)) return payload.payments as Payment[];

  return [];
}

function extractPayment(payload: unknown): Payment | null {
  if (!isRecord(payload)) return null;
  if (typeof payload.id === "string" && typeof payload.amount === "number") {
    return payload as unknown as Payment;
  }
  if ("data" in payload) return extractPayment(payload.data);
  return null;
}

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const { data } = await api.get<ApiResponse<Payment[]> | Payment[]>("/payments");
    return extractPayments(data);
  },

  getById: async (id: string): Promise<Payment> => {
    const { data } = await api.get<ApiResponse<Payment> | Payment>(`/payments/${id}`);
    const payment = extractPayment(data);
    if (!payment) {
      const message =
        isRecord(data) && typeof data.message === "string"
          ? data.message
          : "Payment not found";
      throw new Error(message);
    }
    return payment;
  },

  createCheckout: async (rentalId: string): Promise<{ url: string }> => {
    const { data } = await api.post<unknown>("/payments", { rentalId });

    const url = extractCheckoutUrl(data);
    if (!url) {
      const message =
        isRecord(data) && typeof data.message === "string"
          ? data.message
          : "Failed to create checkout session";
      throw new Error(message);
    }

    return { url };
  },
};
