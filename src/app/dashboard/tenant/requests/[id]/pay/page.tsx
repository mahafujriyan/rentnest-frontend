"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { redirectToCheckout, useCreateCheckout } from "@/hooks/use-payments";

export default function TenantRequestPayPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const createCheckout = useCreateCheckout();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!id || startedRef.current) return;
    startedRef.current = true;

    const startCheckout = async () => {
      try {
        const { url } = await createCheckout.mutateAsync(id);
        redirectToCheckout(url);
      } catch (error) {
        setIsRedirecting(false);
        toast.error(error instanceof Error ? error.message : "Payment failed");
      }
    };

    void startCheckout();
    // Intentionally run once per rental id — mutation object is unstable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/70 bg-card/90 p-8 text-center shadow-xl backdrop-blur">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            {isRedirecting ? (
              <Loader2 className="size-8 animate-spin text-emerald-600" />
            ) : (
              <CreditCard className="size-8 text-emerald-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isRedirecting ? "Redirecting to payment" : "Payment not available"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isRedirecting
                ? "Preparing your secure Stripe checkout session…"
                : "Please go back to your rental request and try again."}
            </p>
          </div>
          {!isRedirecting && (
            <div className="flex flex-col gap-3">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push("/dashboard/tenant/requests")}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Requests
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  startedRef.current = false;
                  setIsRedirecting(true);
                  startedRef.current = true;
                  createCheckout
                    .mutateAsync(id)
                    .then(({ url }) => redirectToCheckout(url))
                    .catch((error) => {
                      setIsRedirecting(false);
                      toast.error(
                        error instanceof Error ? error.message : "Payment failed"
                      );
                    });
                }}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
