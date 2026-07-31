import { useQuery, useMutation } from "@tanstack/react-query";
import { paymentService } from "@/services";

export const paymentKeys = {
  all: ["payments"] as const,
  list: () => [...paymentKeys.all, "list"] as const,
  detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
};

export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.list(),
    queryFn: () => paymentService.getAll(),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (rentalId: string) => paymentService.createCheckout(rentalId),
  });
}
