"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/features/property/property-form";
import { PropertyGridSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useProperty, useUpdateProperty } from "@/hooks/use-properties";
import type { PropertyFormData } from "@/lib/validations";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading, error, refetch } = useProperty(id);
  const updateProperty = useUpdateProperty();

  const onSubmit = async (data: PropertyFormData) => {
    try {
      await updateProperty.mutateAsync({
        id,
        data: { ...data, images: data.images.filter(Boolean) },
      });
      toast.success("Property updated!");
      router.push("/dashboard/landlord/properties");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update property");
    }
  };

  if (isLoading) return <PropertyGridSkeleton count={1} />;
  if (error || !property) return <ErrorState message={error?.message || "Property not found"} onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Property</h1>
        <p className="mt-1 text-muted-foreground">Update your property listing</p>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <PropertyForm property={property} onSubmit={onSubmit} isSubmitting={updateProperty.isPending} />
      </div>
    </div>
  );
}
