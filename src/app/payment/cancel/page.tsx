"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, Search } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card/90 p-8 text-center shadow-xl backdrop-blur">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="size-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Cancelled</h1>
            <p className="mt-2 text-muted-foreground">
              Your payment was not completed. You can try again anytime from your
              approved rental requests.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard/tenant/requests">
                <ArrowLeft className="mr-2 size-4" />
                Back to Requests
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/properties">
                <Search className="mr-2 size-4" />
                Browse Properties
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
