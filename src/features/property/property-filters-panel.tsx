"use client";

import { X } from "lucide-react";
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
import type { Category, PropertyFilters } from "@/types";

interface PropertyFiltersPanelProps {
  filters: PropertyFilters;
  categories?: Category[];
  hasFilters: boolean;
  onUpdateFilter: (key: string, value: string | null) => void;
  onClearFilters: () => void;
}

export function PropertyFiltersPanel({
  filters,
  categories,
  hasFilters,
  onUpdateFilter,
  onClearFilters,
}: PropertyFiltersPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Search properties..."
          defaultValue={filters.search || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdateFilter("search", (e.target as HTMLInputElement).value || null);
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
              onUpdateFilter("city", (e.target as HTMLInputElement).value || null);
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => onUpdateFilter("category", v === "all" ? null : v)}
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
          onValueCommitted={(value) => {
            const vals = Array.isArray(value) ? value : [value];
            const min = vals[0] ?? 0;
            const max = vals[1] ?? 5000;
            onUpdateFilter("minPrice", min > 0 ? String(min) : null);
            onUpdateFilter("maxPrice", max < 10000 ? String(max) : null);
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
            onValueChange={(v) => onUpdateFilter("bedrooms", v === "any" ? null : v)}
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
            onValueChange={(v) => onUpdateFilter("bathrooms", v === "any" ? null : v)}
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
        <Button variant="outline" className="w-full" onClick={onClearFilters}>
          <X className="mr-2 size-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
