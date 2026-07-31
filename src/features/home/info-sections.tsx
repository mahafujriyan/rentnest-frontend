"use client";

import { motion } from "framer-motion";
import { Search, Key, Star, Shield } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Properties",
    description: "Browse thousands of verified rental listings with advanced filters.",
  },
  {
    icon: Key,
    title: "Request to Rent",
    description: "Submit a rental request and connect directly with landlords.",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Pay safely through Stripe with full payment protection.",
  },
  {
    icon: Star,
    title: "Move In & Review",
    description: "Enjoy your new home and share your experience with friends.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-2 text-muted-foreground">
            Four simple steps to your new home
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                <step.icon className="size-7" />
              </div>
              <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Step {i + 1}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const benefits = [
  { title: "Verified Listings", description: "Every property is verified by our team for quality and accuracy." },
  { title: "Secure Payments", description: "Stripe-powered payments with full fraud protection and receipts." },
  { title: "24/7 Support", description: "Our support team is always ready to help with any questions." },
  { title: "Smart Matching", description: "AI-powered recommendations based on your preferences and budget." },
];

export function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose RentNest?
            </h2>
            <p className="mt-4 text-muted-foreground">
              We make finding and renting properties simple, secure, and stress-free.
            </p>
            <div className="mt-8 space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <span className="text-sm font-bold text-emerald-600">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-950/30 dark:to-blue-950/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-emerald-600">10K+</p>
                <p className="mt-2 text-lg text-muted-foreground">Happy Renters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Sarah Johnson", role: "Tenant", text: "Found my dream apartment in just 2 days. The process was seamless!", rating: 5 },
  { name: "Michael Chen", role: "Landlord", text: "Listing my properties on RentNest has been incredibly easy and profitable.", rating: 5 },
  { name: "Emily Davis", role: "Tenant", text: "The secure payment system gave me peace of mind. Highly recommend!", rating: 5 },
];

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Stay Updated</h2>
          <p className="mt-2 text-emerald-100">
            Get the latest properties and deals delivered to your inbox.
          </p>
          <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl border-0 px-4 py-3 text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
