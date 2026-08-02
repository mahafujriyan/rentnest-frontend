"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Calendar,
  Check,
  MapPin,
  Star,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/layout/public-layout";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyGridSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProperty, useProperties } from "@/hooks/use-properties";
import { useCreateRental } from "@/hooks/use-rentals";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice } from "@/lib/format";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading, error, refetch } = useProperty(id);
  const { data: related } = useProperties({ category: property?.categoryId, limit: 3 });
  const createRental = useCreateRental();
  const { isAuthenticated } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRequest = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${id}`);
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    try {
      await createRental.mutateAsync({
        propertyId: id,
        startDate,
        endDate,
        message,
      });
      toast.success("Rental request submitted!");
      setDialogOpen(false);
      router.push("/dashboard/tenant/requests");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request");
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <PropertyGridSkeleton count={1} />
        </div>
      </PublicLayout>
    );
  }

  if (error || !property) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <ErrorState message={error?.message || "Property not found"} onRetry={() => refetch()} />
        </div>
      </PublicLayout>
    );
  }

  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/properties">
            <ArrowLeft className="mr-2 size-4" />
            Back to properties
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src={images[selectedImage]}
                alt={property.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                      selectedImage === i ? "border-emerald-600" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{property.title}</h1>
                  <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-4" />
                    {property.address}, {property.city}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                <Badge variant="secondary" className="gap-1">
                  <BedDouble className="size-3.5" /> {property.bedrooms} beds
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Bath className="size-3.5" /> {property.bathrooms} baths
                </Badge>
                {property.area && (
                  <Badge variant="secondary">{property.area} sqft</Badge>
                )}
                {property.category && (
                  <Badge className="bg-emerald-600">{property.category.name}</Badge>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </div>

            {property.amenities?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Amenities</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border bg-muted/30 p-8 text-center">
              <MapPin className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 font-medium">{property.city}, {property.state || property.country}</p>
              <p className="text-sm text-muted-foreground">Map view coming soon</p>
            </div>

            {property.landlord && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="size-5" />
                    Landlord Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{property.landlord.name}</p>
                  <p className="text-sm text-muted-foreground">{property.landlord.email}</p>
                </CardContent>
              </Card>
            )}

            {property.reviews && property.reviews.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Reviews</h2>
                <div className="mt-4 space-y-4">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.user?.name}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Request to Rent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!property.isAvailable ? (
                  <p className="text-center text-destructive">This property is currently unavailable</p>
                ) : (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
                      <Calendar className="mr-2 size-4" />
                      Request Rental
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Rental Request</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Message (optional)</Label>
                          <Textarea
                            placeholder="Tell the landlord about yourself..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleRequest}
                          disabled={createRental.isPending}
                        >
                          {createRental.isPending ? "Submitting..." : "Submit Request"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <div className="rounded-xl bg-muted/50 p-4 text-sm">
                  <p className="font-medium">Monthly Rent</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatPrice(property.price)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related Properties</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related
                .filter((p) => p.id !== property.id)
                .slice(0, 3)
                .map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
