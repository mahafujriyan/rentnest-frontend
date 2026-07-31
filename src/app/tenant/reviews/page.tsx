"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reviewSchema, type ReviewFormData } from "@/lib/validations";
import { reviewService } from "@/services";
import { useRentals } from "@/hooks/use-rentals";

export default function TenantReviewsPage() {
  const { data: rentals } = useRentals();
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");

  const completedRentals = rentals?.filter(
    (r) => r.status === "COMPLETED" || r.status === "ACTIVE"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!selectedProperty) {
      toast.error("Please select a property");
      return;
    }
    try {
      await reviewService.create({ ...data, propertyId: selectedProperty });
      toast.success("Review submitted!");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="mt-1 text-muted-foreground">Share your experience with properties</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
            <Star className="mr-2 size-4" />
            Write Review
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Property</Label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>
                    {(completedRentals || []).map((r) => (
                      <SelectItem key={r.propertyId} value={r.propertyId}>
                        {r.property?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input type="number" min={1} max={5} {...register("rating")} />
                {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Comment</Label>
                <Textarea placeholder="Share your experience..." {...register("comment")} />
                {errors.comment && <p className="text-sm text-destructive">{errors.comment.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                Submit Review
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <EmptyState
        title="Your reviews will appear here"
        description="Complete a rental to leave a review for the property."
        icon={<Star className="size-8 text-muted-foreground" />}
      />
    </div>
  );
}
