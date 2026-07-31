import api from "@/lib/axios";
import type {
  ApiResponse,
  Category,
  CreateCategoryData,
  DashboardStats,
  Property,
  Rental,
  UpdateUserStatusData,
  User,
} from "@/types";

export const adminService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get<ApiResponse<User[]>>("/admin/users");
    return data.data || [];
  },

  updateUserStatus: async (
    id: string,
    statusData: UpdateUserStatusData
  ): Promise<User> => {
    const { data } = await api.patch<ApiResponse<User>>(
      `/admin/users/${id}`,
      statusData
    );
    if (!data.data) throw new Error(data.message || "Failed to update user");
    return data.data;
  },

  getProperties: async (): Promise<Property[]> => {
    const { data } = await api.get<ApiResponse<Property[]>>("/admin/properties");
    return data.data || [];
  },

  getRentals: async (): Promise<Rental[]> => {
    const { data } = await api.get<ApiResponse<Rental[]>>("/admin/rentals");
    return data.data || [];
  },

  createCategory: async (categoryData: CreateCategoryData): Promise<Category> => {
    const { data } = await api.post<ApiResponse<Category>>(
      "/admin/categories",
      categoryData
    );
    if (!data.data) throw new Error(data.message || "Failed to create category");
    return data.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const [users, properties, rentals] = await Promise.all([
      adminService.getUsers(),
      adminService.getProperties(),
      adminService.getRentals(),
    ]);

    const pendingRequests = rentals.filter((r) => r.status === "PENDING").length;
    const activeRentals = rentals.filter(
      (r) => r.status === "ACTIVE" || r.status === "APPROVED"
    ).length;

    return {
      totalUsers: users.length,
      totalProperties: properties.length,
      totalRentals: rentals.length,
      pendingRequests,
      activeRentals,
    };
  },
};
