import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services";
import type { CreateCategoryData, UpdateUserStatusData } from "@/types";

export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  properties: () => [...adminKeys.all, "properties"] as const,
  rentals: () => [...adminKeys.all, "rentals"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
};

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => adminService.getUsers(),
  });
}

export function useAdminProperties() {
  return useQuery({
    queryKey: adminKeys.properties(),
    queryFn: () => adminService.getProperties(),
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: adminKeys.rentals(),
    queryFn: () => adminService.getRentals(),
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getStats(),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusData }) =>
      adminService.updateUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryData) => adminService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
