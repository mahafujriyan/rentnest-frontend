"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRentals } from "@/hooks/use-rentals";
import { useCreateCheckout } from "@/hooks/use-payments";
import { formatDate, formatPrice } from "@/lib/format";

export default function TenantRequestsPage() {
  const router = useRouter();
  const { data: rentals, isLoading, error, refetch } = useRentals();
  const createCheckout = useCreateCheckout();

  const handlePay = async (rentalId: string) => {
    try {
      const { url } = await createCheckout.mutateAsync(rentalId);
      router.push(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    }
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rental Requests</h1>
        <p className="mt-1 text-muted-foreground">Track and manage your rental requests</p>
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
          {rentals.map((rental) => (
            <Card key={rental.id}>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">
                      {rental.property?.title || "Property"}
                    </h3>
                    <StatusBadge status={rental.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(rental.startDate)} — {formatDate(rental.endDate)}
                  </p>
                  {rental.property && (
                    <p className="text-sm font-medium text-emerald-600">
                      {formatPrice(rental.property.price)}/month
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {rental.status === "APPROVED" && (
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handlePay(rental.id)}
                      disabled={createCheckout.isPending}
                    >
                      <CreditCard className="mr-2 size-4" />
                      Pay Now
                    </Button>
                  )}
                  {rental.property && (
                    <Button variant="outline" asChild>
                      <Link href={`/properties/${rental.property.id}`}>View Property</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
