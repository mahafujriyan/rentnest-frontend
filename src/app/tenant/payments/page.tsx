"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent } from "@/components/ui/card";
import { usePayments } from "@/hooks/use-payments";
import { formatDate, formatPrice } from "@/lib/format";

export default function TenantPaymentsPage() {
  const { data: payments, isLoading, error, refetch } = usePayments();

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="mt-1 text-muted-foreground">View  your all payment transactions</p>
      </div>

      {!payments || payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Payments will appear here after you complete a rental."
        />
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{formatPrice(payment.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.rental?.property?.title || "Rental Payment"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.createdAt && formatDate(payment.createdAt)}
                  </p>
                </div>
                <StatusBadge status={payment.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
