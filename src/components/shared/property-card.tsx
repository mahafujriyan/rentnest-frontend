"use client";

import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const image = property.images?.[0] || "/placeholder-property.jpg";
  const rating = property.averageRating || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/properties/${property.id}`}>
        <Card className="group overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!property.isAvailable && (
              <Badge className="absolute left-3 top-3 bg-destructive">
                Unavailable
              </Badge>
            )}
            {property.category && (
              <Badge className="absolute right-3 top-3 bg-emerald-600/90 backdrop-blur-sm">
                {property.category.name}
              </Badge>
            )}
          </div>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 font-semibold transition-colors group-hover:text-emerald-600">
                {property.title}
              </h3>
              {rating > 0 && (
                <div className="flex shrink-0 items-center gap-1 text-sm">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="line-clamp-1">
                {property.city}
                {property.state ? `, ${property.state}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BedDouble className="size-3.5" />
                {property.bedrooms} beds
              </span>
              <span className="flex items-center gap-1">
                <Bath className="size-3.5" />
                {property.bathrooms} baths
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-emerald-600">
                {formatPrice(property.price)}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
