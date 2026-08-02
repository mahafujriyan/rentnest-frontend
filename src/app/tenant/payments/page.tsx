"use client";

import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { usePayments } from "@/hooks/use-payments";
import { formatDate, formatPrice } from "@/lib/format";

export default function TenantPaymentsPage() {
  const { data: payments, isLoading, error, refetch } = usePayments();

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  const completedTotal =
    payments
      ?.filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="mt-1 text-muted-foreground">
            All Stripe checkout transactions for your rentals
          </p>
        </div>
        {payments && payments.length > 0 && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total paid
            </p>
            <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
              {formatPrice(completedTotal)}
            </p>
          </div>
        )}
      </div>

      {!payments || payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="When you pay for an approved rental, the receipt will show up here."
          action={
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard/tenant/requests">
                Go to requests <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{formatPrice(payment.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.rental?.property?.title || "Rental Payment"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {payment.createdAt ? formatDate(payment.createdAt) : "—"}
                    {payment.stripeSessionId
                      ? ` · ${payment.stripeSessionId.slice(0, 18)}…`
                      : ""}
                  </p>
                </div>
              </div>
              <StatusBadge status={payment.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
