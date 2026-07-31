"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How do I search for properties?",
    a: "Use our advanced search with filters for location, price, bedrooms, bathrooms, and amenities. Browse results in grid view with sorting options.",
  },
  {
    q: "How does the rental request process work?",
    a: "Find a property you like, submit a rental request with your preferred dates, and wait for the landlord to approve. Once approved, you can proceed with payment.",
  },
  {
    q: "Is payment secure?",
    a: "Yes! All payments are processed through Stripe, ensuring bank-level security and fraud protection for every transaction.",
  },
  {
    q: "Can I list my property as a landlord?",
    a: "Absolutely! Register as a landlord, create your property listing with photos and details, and start receiving rental requests from verified tenants.",
  },
  {
    q: "What if I need to cancel a rental?",
    a: "Cancellation policies vary by property. Visit the landlord through your dashboard or reach out to our support team for assistance.",
  },
];

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border bg-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left font-medium"
              >
                {faq.q}
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="border-t px-4 pb-4 pt-2 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
