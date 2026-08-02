import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";
import { rentalKeys } from "@/hooks/use-rentals";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rentalId: string) => paymentService.createCheckout(rentalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: rentalKeys.all });
    },
  });
}

/** Open Stripe Checkout in the same tab (external URL — never use Next router). */
export function redirectToCheckout(url: string) {
  if (typeof window === "undefined") return;
  window.location.assign(url);
}
