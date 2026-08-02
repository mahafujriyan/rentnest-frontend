"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { useRentals } from "@/hooks/use-rentals";
import { redirectToCheckout, useCreateCheckout } from "@/hooks/use-payments";
import { formatPrice, formatRentalDate } from "@/lib/format";

function canPay(status: string) {
  return status === "APPROVED";
}

export default function TenantRequestsPage() {
  const { data: rentals, isLoading, error, refetch } = useRentals();
  const createCheckout = useCreateCheckout();
  const [payingId, setPayingId] = useState<string | null>(null);

  const handlePay = async (rentalId: string) => {
    setPayingId(rentalId);
    try {
      const { url } = await createCheckout.mutateAsync(rentalId);
      toast.success("Redirecting to secure checkout…");
      redirectToCheckout(url);
    } catch (err) {
      setPayingId(null);
      toast.error(err instanceof Error ? err.message : "Payment failed");
    }
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rental Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Track requests and complete payment once approved
        </p>
      </div>

      {!rentals || rentals.length === 0 ? (
        <EmptyState
          title="No rental requests"
          description="Start by browsing available properties."
          action={
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/properties">Browse Properties</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => {
            const isPaying = payingId === rental.id;
            const alreadyPaid =
              rental.status === "ACTIVE" ||
              rental.payment?.status === "COMPLETED";

            return (
              <div
                key={rental.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {rental.property?.title || "Property"}
                    </h3>
                    <StatusBadge status={rental.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatRentalDate(rental)}
                  </p>
                  {rental.property && (
                    <p className="text-sm font-medium text-emerald-600">
                      {formatPrice(rental.property.price)}/month
                    </p>
                  )}
                  {alreadyPaid && (
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Payment completed
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {canPay(rental.status) && !alreadyPaid && (
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handlePay(rental.id)}
                      disabled={createCheckout.isPending}
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Opening checkout…
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 size-4" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  )}
                  {alreadyPaid && (
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/tenant/payments">
                        View payment
                        <ExternalLink className="ml-2 size-3.5" />
                      </Link>
                    </Button>
                  )}
                  {rental.property && (
                    <Button variant="outline" asChild>
                      <Link href={`/properties/${rental.property.id}`}>View Property</Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
