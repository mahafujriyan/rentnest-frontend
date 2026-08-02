"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="size-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold">Payment Cancelled</h1>
            <p className="mt-2 text-muted-foreground">
              Your payment was not completed. You can try again from your rental requests.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/dashboard/tenant/requests"><ArrowLeft className="mr-2 size-4" />Back to Requests</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
