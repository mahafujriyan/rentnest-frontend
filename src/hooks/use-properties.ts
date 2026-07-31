import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyService } from "@/services";
import type { PropertyFilters } from "@/types";

export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  categories: () => ["categories"] as const,
};

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertyService.getAll(filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyService.getById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: propertyKeys.categories(),
    queryFn: () => propertyService.getCategories(),
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: propertyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof propertyService.update>[1] }) =>
      propertyService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: propertyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}
