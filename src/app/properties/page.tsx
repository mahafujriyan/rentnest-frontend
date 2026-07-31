"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyGridSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Search properties..."
          defaultValue={filters.search || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("search", (e.target as HTMLInputElement).value || null);
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>City</Label>
        <Input
          placeholder="Enter city"
          defaultValue={filters.city || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("city", (e.target as HTMLInputElement).value || null);
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => updateFilter("category", v === "all" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(categories || []).map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range</Label>
        <Slider
          defaultValue={[filters.minPrice || 0, filters.maxPrice || 5000]}
          max={10000}
          step={100}
          onValueCommitted={([min, max]) => {
            updateFilter("minPrice", min > 0 ? String(min) : null);
            updateFilter("maxPrice", max < 10000 ? String(max) : null);
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${filters.minPrice || 0}</span>
          <span>${filters.maxPrice || "5000+"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select
            value={filters.bedrooms?.toString() || "any"}
            onValueChange={(v) => updateFilter("bedrooms", v === "any" ? null : v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select
            value={filters.bathrooms?.toString() || "any"}
            onValueChange={(v) => updateFilter("bathrooms", v === "any" ? null : v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 size-4" />
          Clear Filters
        </Button>
      )}
    </div>
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
              <FilterPanel />
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
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(v) => {
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
