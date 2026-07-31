"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyGridSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PropertyFiltersPanel } from "@/features/property/property-filters-panel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProperties, useCategories } from "@/hooks/use-properties";
import type { PropertyFilters } from "@/types";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: PropertyFilters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      city: searchParams.get("city") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
      bathrooms: searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined,
      sortBy: (searchParams.get("sortBy") as PropertyFilters["sortBy"]) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as PropertyFilters["sortOrder"]) || "desc",
    }),
    [searchParams]
  );

  const { data: properties, isLoading, error, refetch } = useProperties(filters);
  const { data: categories } = useCategories();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/properties?${params.toString()}`);
    },
    [searchParams, router]
  );

  const clearFilters = () => router.push("/properties");
  const hasFilters = Array.from(searchParams.keys()).length > 0;

  const filterPanel = (
    <PropertyFiltersPanel
      filters={filters}
      categories={categories}
      hasFilters={hasFilters}
      onUpdateFilter={updateFilter}
      onClearFilters={clearFilters}
    />
  );

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Properties</h1>
          <p className="mt-1 text-muted-foreground">
            {properties ? `${properties.length} properties found` : "Loading..."}
          </p>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Filters</h2>
              {filterPanel}
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Sheet>
                <SheetTrigger className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium lg:hidden">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{filterPanel}</div>
                </SheetContent>
              </Sheet>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(v) => {
                  if (!v) return;
                  const [sortBy, sortOrder] = v.split("-");
                  updateFilter("sortBy", sortBy);
                  updateFilter("sortOrder", sortOrder);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading && <PropertyGridSkeleton count={6} />}
            {error && <ErrorState message={error.message} onRetry={() => refetch()} />}
            {properties && properties.length === 0 && (
              <EmptyState
                title="No properties found"
                description="Try adjusting your filters or search criteria."
                action={
                  hasFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  ) : undefined
                }
              />
            )}
            {properties && properties.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
