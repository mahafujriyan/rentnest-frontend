import api from "@/lib/axios";
import type { ApiResponse, Payment, Rental } from "@/types";

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

function normalizePayment(raw: Record<string, unknown>): Payment {
  const rentalRequest = isRecord(raw.rentalRequest)
    ? raw.rentalRequest
    : isRecord(raw.rental)
      ? raw.rental
      : undefined;

  const rentalId = String(
    raw.rentalRequestId ??
      raw.rental_request_id ??
      raw.rentalId ??
      raw.rental_id ??
      (rentalRequest ? rentalRequest.id : "")
  );

  const stripeSessionId =
    (typeof raw.sessionId === "string" && raw.sessionId) ||
    (typeof raw.stripeSessionId === "string" && raw.stripeSessionId) ||
    (typeof raw.session_id === "string" && raw.session_id) ||
    undefined;

  let rental: Rental | undefined;
  if (rentalRequest) {
    rental = {
      id: String(rentalRequest.id ?? rentalId),
      propertyId: String(
        rentalRequest.propertyId ??
          (isRecord(rentalRequest.property) ? rentalRequest.property.id : "")
      ),
      tenantId: String(rentalRequest.tenantId ?? raw.tenantId ?? ""),
      moveInDate:
        typeof rentalRequest.moveInDate === "string"
          ? rentalRequest.moveInDate
          : undefined,
      status: (rentalRequest.status as Rental["status"]) || "PENDING",
      message: typeof rentalRequest.message === "string" ? rentalRequest.message : undefined,
      property: isRecord(rentalRequest.property)
        ? (rentalRequest.property as unknown as Rental["property"])
        : undefined,
      payment: undefined,
    };
  }

  return {
    id: String(raw.id ?? ""),
    rentalId,
    amount: typeof raw.amount === "number" ? raw.amount : Number(raw.amount) || 0,
    status: (raw.status as Payment["status"]) || "PENDING",
    stripeSessionId,
    rental,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  };
}

function extractPayments(payload: unknown): Payment[] {
  if (Array.isArray(payload)) {
    return payload
      .filter(isRecord)
      .map((item) => normalizePayment(item));
  }
  if (!isRecord(payload)) return [];

  if (Array.isArray(payload.data)) {
    return extractPayments(payload.data);
  }
  if (isRecord(payload.data) && Array.isArray(payload.data.items)) {
    return extractPayments(payload.data.items);
  }
  if (Array.isArray(payload.payments)) {
    return extractPayments(payload.payments);
  }

  return [];
}

function extractPayment(payload: unknown): Payment | null {
  if (!isRecord(payload)) return null;
  if (typeof payload.id === "string" && ("amount" in payload || "status" in payload)) {
    return normalizePayment(payload);
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

  /**
   * Backend: POST /payments/create with { rentalRequestId }
   * Returns Stripe Checkout URL in data.url
   */
  createCheckout: async (rentalRequestId: string): Promise<{ url: string }> => {
    if (!rentalRequestId) {
      throw new Error("Rental request id is required");
    }

    const { data } = await api.post<unknown>("/payments/create", {
      rentalRequestId,
    });

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
