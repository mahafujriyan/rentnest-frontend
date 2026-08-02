"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLandlordProperties, useDeleteProperty, useToggleAvailability } from "@/hooks/use-properties";
import { formatPrice } from "@/lib/format";

export default function LandlordPropertiesPage() {
  const { data: properties, isLoading, error, refetch } = useLandlordProperties();
  const deleteProperty = useDeleteProperty();
  const toggleAvailability = useToggleAvailability();

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty.mutateAsync(id);
      toast.success("Property deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleToggle = async (id: string, isAvailable: boolean) => {
    try {
      await toggleAvailability.mutateAsync({ id, isAvailable });
      toast.success(isAvailable ? "Property is now available" : "Property marked unavailable");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="mt-1 text-muted-foreground">Manage your listed properties</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard/landlord/properties/new"><Plus className="mr-2 size-4" />Add Property</Link>
        </Button>
      </div>

      {!properties || properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Create your first property listing to start receiving requests."
          action={
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard/landlord/properties/new">Create Property</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop"}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{property.title}</h3>
                  <Badge variant={property.isAvailable ? "default" : "secondary"}>
                    {property.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{property.city} · {formatPrice(property.price)}/mo</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={property.isAvailable}
                    onCheckedChange={(checked) => handleToggle(property.id, checked)}
                  />
                  <span className="text-xs text-muted-foreground">Available</span>
                </div>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/dashboard/landlord/properties/${property.id}/edit`}><Pencil className="size-4" /></Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger className="inline-flex size-9 items-center justify-center rounded-lg border text-destructive hover:bg-destructive/10">
                    <Trash2 className="size-4" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete property?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(property.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
