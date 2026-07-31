"use client";

import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const city = formData.get("city") as string;
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Find Your Perfect
            <span className="block text-emerald-200">Rental Home</span>
          </h1>
          <p className="mt-6 text-lg text-emerald-100 md:text-xl">
            Discover thousands of verified rental properties. From cozy apartments
            to spacious houses — your next home is just a search away.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md sm:flex-row"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-emerald-200" />
              <Input
                name="city"
                placeholder="City, neighborhood, or address"
                className="h-12 border-0 bg-white pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Search className="mr-2 size-4" />
              Search
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200">
            <span>Popular: New York</span>
            <span>Los Angeles</span>
            <span>Chicago</span>
            <span>Miami</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
