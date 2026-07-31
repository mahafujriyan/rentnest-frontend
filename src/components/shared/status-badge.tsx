import { cn } from "@/lib/utils";
import type { RentalStatus, PaymentStatus, UserStatus } from "@/types";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  ACTIVE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  BANNED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

interface StatusBadgeProps {
  status: RentalStatus | PaymentStatus | UserStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status] || statusStyles.PENDING,
        className
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
