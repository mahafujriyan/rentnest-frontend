import api from "@/lib/axios";
import type { ApiResponse, Payment } from "@/types";

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const { data } = await api.get<ApiResponse<Payment[]>>("/payments");
    return data.data || [];
  },

  getById: async (id: string): Promise<Payment> => {
    const { data } = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
    if (!data.data) throw new Error(data.message || "Payment not found");
    return data.data;
  },

  createCheckout: async (rentalId: string): Promise<{ url: string }> => {
    const { data } = await api.post<ApiResponse<{ url: string }>>("/payments", {
      rentalId,
    });
    if (!data.data?.url) throw new Error(data.message || "Failed to create checkout");
    return data.data;
  },
};
