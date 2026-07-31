import api from "@/lib/axios";
import type {
  ApiResponse,
  Category,
  CreateCategoryData,
  CreatePropertyData,
  Property,
  PropertyFilters,
} from "@/types";

export const propertyService = {
  getAll: async (filters?: PropertyFilters): Promise<Property[]> => {
    const { data } = await api.get<ApiResponse<Property[]>>("/properties", {
      params: filters,
    });
    return data.data || [];
  },

  getById: async (id: string): Promise<Property> => {
    const { data } = await api.get<ApiResponse<Property>>(`/properties/${id}`);
    if (!data.data) throw new Error(data.message || "Property not found");
    return data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>("/categories");
    return data.data || [];
  },

  create: async (propertyData: CreatePropertyData): Promise<Property> => {
    const { data } = await api.post<ApiResponse<Property>>(
      "/landlord/properties",
      propertyData
    );
    if (!data.data) throw new Error(data.message || "Failed to create property");
    return data.data;
  },

  update: async (
    id: string,
    propertyData: Partial<CreatePropertyData>
  ): Promise<Property> => {
    const { data } = await api.put<ApiResponse<Property>>(
      `/landlord/properties/${id}`,
      propertyData
    );
    if (!data.data) throw new Error(data.message || "Failed to update property");
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/landlord/properties/${id}`);
  },

  toggleAvailability: async (id: string, isAvailable: boolean): Promise<Property> => {
    const { data } = await api.put<ApiResponse<Property>>(
      `/landlord/properties/${id}`,
      { isAvailable }
    );
    if (!data.data) throw new Error(data.message || "Failed to update availability");
    return data.data;
  },
};
