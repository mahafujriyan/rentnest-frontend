"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyGridSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useProperties, useCategories } from "@/hooks/use-properties";

export function FeaturedProperties() {
  const { data: properties, isLoading, error, refetch } = useProperties({ limit: 6 });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Properties</h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked rentals just for you
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/properties">
              View all
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {isLoading && <PropertyGridSkeleton count={6} />}
        {error && <ErrorState message={error.message} onRetry={() => refetch()} />}
        {properties && properties.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 6).map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}
        {properties && properties.length === 0 && (
          <p className="text-center text-muted-foreground">No properties available yet.</p>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/properties">View all properties</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">
            Find the perfect property type for your needs
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(categories || []).map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/properties?category=${category.id}`}
                className="group flex flex-col items-center rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl dark:bg-emerald-900/30">
                  🏠
                </div>
                <h3 className="font-semibold group-hover:text-emerald-600">
                  {category.name}
                </h3>
                {category._count && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category._count.properties} properties
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularCities() {
  const cities = [
    { name: "New York", count: 120, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop" },
    { name: "Los Angeles", count: 98, image: "https://images.unsplash.com/photo-1580654712603-eb43229aff4d?w=400&h=300&fit=crop" },
    { name: "Chicago", count: 76, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop" },
    { name: "Miami", count: 65, image: "https://images.unsplash.com/photo-1514214246283-d427a95a798d?w=400&h=300&fit=crop" },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Popular Cities</h2>
          <p className="mt-2 text-muted-foreground">Explore rentals in top destinations</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city, i) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/properties?city=${encodeURIComponent(city.name)}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-sm text-white/80">{city.count}+ properties</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
