import api from "@/lib/axios";
import type {
  ApiResponse,
  Category,
  CreatePropertyData,
  Property,
  PropertyFilters,
} from "@/types";

type BackendProperty = Omit<Property, "isAvailable" | "state"> & {
  availability?: boolean;
  isAvailable?: boolean;
  division?: string;
  state?: string;
};

function normalizeProperty(property: BackendProperty): Property {
  return {
    ...property,
    isAvailable: property.isAvailable ?? property.availability ?? true,
    state: property.state ?? property.division,
  };
}

function normalizeProperties(properties?: BackendProperty[]): Property[] {
  return (properties || []).map(normalizeProperty);
}

function toBackendPropertyData(propertyData: Partial<CreatePropertyData>) {
  const { state, ...rest } = propertyData;

  return {
    ...rest,
    ...(state ? { division: state } : {}),
  };
}

export const propertyService = {
  getAll: async (filters?: PropertyFilters): Promise<Property[]> => {
    const { data } = await api.get<ApiResponse<BackendProperty[]>>("/properties", {
      params: filters,
    });
    return normalizeProperties(data.data);
  },

  getById: async (id: string): Promise<Property> => {
    const { data } = await api.get<ApiResponse<BackendProperty>>(`/properties/${id}`);
    if (!data.data) throw new Error(data.message || "Property not found");
    return normalizeProperty(data.data);
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>("/categories");
    return data.data || [];
  },

  getLandlordProperties: async (): Promise<Property[]> => {
    const { data } = await api.get<ApiResponse<BackendProperty[]>>("/landlord/properties");
    return normalizeProperties(data.data);
  },

  create: async (propertyData: CreatePropertyData): Promise<Property> => {
    const { data } = await api.post<ApiResponse<BackendProperty>>(
      "/landlord/properties",
      toBackendPropertyData(propertyData)
    );
    if (!data.data) throw new Error(data.message || "Failed to create property");
    return normalizeProperty(data.data);
  },

  update: async (
    id: string,
    propertyData: Partial<CreatePropertyData>
  ): Promise<Property> => {
    const { data } = await api.put<ApiResponse<BackendProperty>>(
      `/landlord/properties/${id}`,
      toBackendPropertyData(propertyData)
    );
    if (!data.data) throw new Error(data.message || "Failed to update property");
    return normalizeProperty(data.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/landlord/properties/${id}`);
  },

  toggleAvailability: async (id: string, isAvailable: boolean): Promise<Property> => {
    const { data } = await api.put<ApiResponse<BackendProperty>>(
      `/landlord/properties/${id}`,
      { availability: isAvailable }
    );
    if (!data.data) throw new Error(data.message || "Failed to update availability");
    return normalizeProperty(data.data);
  },
};
