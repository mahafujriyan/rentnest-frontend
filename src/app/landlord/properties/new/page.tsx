"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/features/property/property-form";
import { useCreateProperty } from "@/hooks/use-properties";
import type { PropertyFormData } from "@/lib/validations";

export default function CreatePropertyPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();

  const onSubmit = async (data: PropertyFormData) => {
    try {
      await createProperty.mutateAsync({
        ...data,
        images: data.images.filter(Boolean),
      });
      toast.success("Property created successfully!");
      router.push("/dashboard/landlord/properties");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create property");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Property</h1>
        <p className="mt-1 text-muted-foreground">Add a new property listing</p>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <PropertyForm onSubmit={onSubmit} isSubmitting={createProperty.isPending} />
      </div>
    </div>
  );
}
