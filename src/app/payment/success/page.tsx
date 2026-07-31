"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="size-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="mt-2 text-muted-foreground">
              Your rental payment has been processed. Your rental is now active.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/tenant/requests">View My Rentals <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tenant/payments">Payment History</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
