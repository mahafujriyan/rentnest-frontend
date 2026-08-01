import Link from "next/link";
import { Building2, Shield, Users, Zap } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/constants";

const values = [
  { icon: Shield, title: "Trust & Safety", desc: "Verified listings and secure payments for peace of mind." },
  { icon: Zap, title: "Fast & Simple", desc: "Find and rent properties in minutes, not weeks." },
  { icon: Users, title: "Community First", desc: "Connecting tenants and landlords seamlessly." },
  { icon: Building2, title: "Quality Listings", desc: "Premium properties across top cities nationwide." },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">About {APP_NAME}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We&apos;re on a mission to make renting simple, transparent, and delightful for every person.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="leading-relaxed text-muted-foreground">
            {APP_NAME} was founded with a simple idea: renting a home should be as easy as booking a hotel.
            We combine cutting-edge technology with a human-first approach to connect tenants with their
            perfect home and help landlords manage properties effortlessly.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Icon className="size-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
