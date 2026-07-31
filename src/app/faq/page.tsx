"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How do I search for properties?", a: "Browse our properties page and use filters for city, price, bedrooms, and amenities to find your perfect home." },
  { q: "How does the rental request process work?", a: "Find a property, submit a rental request with your preferred dates, and wait for landlord approval. Once approved, complete payment via Stripe." },
  { q: "What payment methods are accepted?", a: "We accept all major credit and debit cards through our secure Stripe payment integration." },
  { q: "Can I list my property as a landlord?", a: "Yes! Register as a landlord, access your dashboard, and create property listings in minutes." },
  { q: "How do I cancel a rental request?", a: "Contact support or manage pending requests from your tenant dashboard." },
  { q: "Is my personal information secure?", a: "Absolutely. We use JWT authentication, encrypted connections, and never share your data with third parties." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground">Everything you need to know about RentNest</p>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border">
              <button
                className="flex w-full items-center justify-between p-4 text-left font-medium"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <ChevronDown className={cn("size-4 shrink-0 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="border-t px-4 pb-4 pt-2 text-muted-foreground">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
