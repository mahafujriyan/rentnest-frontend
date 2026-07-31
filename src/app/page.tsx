import { PublicLayout } from "@/components/layout/public-layout";
import { HeroSection } from "@/features/home/hero-section";
import {
  FeaturedProperties,
  CategoriesSection,
  PopularCities,
} from "@/features/home/featured-sections";
import {
  HowItWorks,
  BenefitsSection,
  TestimonialsSection,
  NewsletterSection,
} from "@/features/home/info-sections";
import { HomeFAQ } from "@/features/home/faq-section";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturedProperties />
      <CategoriesSection />
      <PopularCities />
      <HowItWorks />
      <BenefitsSection />
      <TestimonialsSection />
      <HomeFAQ />
      <NewsletterSection />
    </PublicLayout>
  );
}
