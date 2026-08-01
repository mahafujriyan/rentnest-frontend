"use client";

import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLandlordRequests, useUpdateRentalStatus } from "@/hooks/use-rentals";
import { formatDate, formatPrice } from "@/lib/format";

export default function LandlordRequestsPage() {
  const { data: requests, isLoading, error, refetch } = useLandlordRequests();
  const updateStatus = useUpdateRentalStatus();

  const handleStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      toast.success(`Request ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update request");
    }
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rental Requests</h1>
        <p className="mt-1 text-muted-foreground">Review and manage tenant requests</p>
      </div>

      {!requests || requests.length === 0 ? (
        <EmptyState title="No requests yet" description="Requests from tenants will appear here." />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{req.property?.title}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tenant: {req.tenant?.name} ({req.tenant?.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(req.startDate)} to {formatDate(req.endDate)}
                  </p>
                  {req.property && (
                    <p className="text-sm font-medium text-emerald-600">{formatPrice(req.property.price)}/month</p>
                  )}
                  {req.message && <p className="text-sm italic text-muted-foreground">&ldquo;{req.message}&rdquo;</p>}
                </div>
                {req.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatus(req.id, "APPROVED")}
                      disabled={updateStatus.isPending}
                    >
                      <Check className="mr-2 size-4" />Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatus(req.id, "REJECTED")}
                      disabled={updateStatus.isPending}
                    >
                      <X className="mr-2 size-4" />Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
