"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, ArrowRight, Receipt } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { paymentKeys } from "@/hooks/use-payments";
import { rentalKeys } from "@/hooks/use-rentals";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    queryClient.invalidateQueries({ queryKey: rentalKeys.all });
  }, [queryClient]);

  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card/90 p-8 text-center shadow-xl backdrop-blur">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <CheckCircle className="size-8 text-emerald-600" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment Successful</h1>
        <p className="mt-2 text-muted-foreground">
          Your rental payment has been processed. The rental is now active.
        </p>
        {sessionId && (
          <p className="mt-3 break-all rounded-xl bg-muted/60 px-3 py-2 text-left text-[11px] text-muted-foreground">
            Session: {sessionId}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard/tenant/requests">
            View My Rentals <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tenant/payments">
            <Receipt className="mr-2 size-4" />
            Payment History
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Suspense
          fallback={
            <div className="h-64 w-full max-w-md animate-pulse rounded-3xl bg-muted" />
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
