"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AMENITIES } from "@/constants";
import { propertySchema, type PropertyFormData } from "@/lib/validations";
import { useCategories } from "@/hooks/use-properties";
import type { Property } from "@/types";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function PropertyForm({ property, onSubmit, isSubmitting }: PropertyFormProps) {
  const { data: categories } = useCategories();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          address: property.address,
          city: property.city,
          state: property.state,
          country: property.country,
          zipCode: property.zipCode,
          images: property.images,
          amenities: property.amenities,
          categoryId: property.categoryId,
        }
      : {
          images: [""],
          amenities: [],
        },
  });

  const selectedAmenities = useWatch({ control, name: "amenities" }) || [];
  const images = useWatch({ control, name: "images" }) || [""];
  const categoryId = useWatch({ control, name: "categoryId" }) || "";

  const toggleAmenity = (amenity: string) => {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Title</Label>
          <Input placeholder="Modern 2BR Apartment" {...register("title")} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea rows={4} placeholder="Describe your property..." {...register("description")} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Price ($/month)</Label>
          <Input type="number" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={categoryId}
            onValueChange={(v) => v && setValue("categoryId", v, { shouldValidate: true })}
          >
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {(categories || []).map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Input type="number" {...register("bedrooms", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Input type="number" {...register("bathrooms", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Area (sqft)</Label>
          <Input type="number" {...register("area", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Input {...register("city")} />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Address</Label>
          <Input {...register("address")} />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input {...register("state")} />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input {...register("country")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image URLs</Label>
        {images.map((_, i) => (
          <Input
            key={i}
            placeholder="https://..."
            {...register(`images.${i}` as const)}
            onChange={(e) => {
              const next = [...images];
              next[i] = e.target.value;
              setValue("images", next, { shouldValidate: true });
            }}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setValue("images", [...images, ""])}
        >
          Add Image URL
        </Button>
        {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
        {errors.amenities && <p className="text-sm text-destructive">{errors.amenities.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="mr-2 size-4 animate-spin" />Saving...</>
        ) : (
          property ? "Update Property" : "Create Property"
        )}
      </Button>
    </form>
  );
}
