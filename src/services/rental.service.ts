import api from "@/lib/axios";
import type {
  ApiResponse,
  CreateRentalData,
  Rental,
  UpdateRentalStatusData,
} from "@/types";

export const rentalService = {
  getAll: async (): Promise<Rental[]> => {
    const { data } = await api.get<ApiResponse<Rental[]>>("/rentals");
    return data.data || [];
  },

  getById: async (id: string): Promise<Rental> => {
    const { data } = await api.get<ApiResponse<Rental>>(`/rentals/${id}`);
    if (!data.data) throw new Error(data.message || "Rental not found");
    return data.data;
  },

  create: async (rentalData: CreateRentalData): Promise<Rental> => {
    const { data } = await api.post<ApiResponse<Rental>>("/rentals", rentalData);
    if (!data.data) throw new Error(data.message || "Failed to create rental request");
    return data.data;
  },

  getLandlordRequests: async (): Promise<Rental[]> => {
    const { data } = await api.get<ApiResponse<Rental[]>>("/landlord/requests");
    return data.data || [];
  },

  updateStatus: async (
    id: string,
    statusData: UpdateRentalStatusData
  ): Promise<Rental> => {
    const { data } = await api.patch<ApiResponse<Rental>>(
      `/landlord/requests/${id}`,
      statusData
    );
    if (!data.data) throw new Error(data.message || "Failed to update request");
    return data.data;
  },
};
