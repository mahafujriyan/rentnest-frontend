"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminRentals } from "@/hooks/use-admin";
import { formatDate } from "@/lib/format";

export default function AdminRentalsPage() {
  const { data: rentals, isLoading, error, refetch } = useAdminRentals();

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rentals</h1>
        <p className="mt-1 text-muted-foreground">Review all rental transactions.</p>
      </div>

      <div className="rounded-2xl border bg-card">
        {!rentals || rentals.length === 0 ? (
          <EmptyState title="No rentals found" description="Rental activity will appear here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.property?.title || "-"}</TableCell>
                  <TableCell>{rental.tenant?.name || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(rental.startDate)} to {formatDate(rental.endDate)}
                  </TableCell>
                  <TableCell><StatusBadge status={rental.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
