import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rentalService } from "@/services";
import type { CreateRentalData, UpdateRentalStatusData } from "@/types";

export const rentalKeys = {
  all: ["rentals"] as const,
  lists: () => [...rentalKeys.all, "list"] as const,
  list: () => [...rentalKeys.lists()] as const,
  landlord: () => [...rentalKeys.all, "landlord"] as const,
  detail: (id: string) => [...rentalKeys.all, "detail", id] as const,
};

export function useRentals() {
  return useQuery({
    queryKey: rentalKeys.list(),
    queryFn: () => rentalService.getAll(),
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: rentalKeys.detail(id),
    queryFn: () => rentalService.getById(id),
    enabled: !!id,
  });
}

export function useLandlordRequests() {
  return useQuery({
    queryKey: rentalKeys.landlord(),
    queryFn: () => rentalService.getLandlordRequests(),
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRentalData) => rentalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all });
    },
  });
}

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRentalStatusData }) =>
      rentalService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.all });
    },
  });
}
