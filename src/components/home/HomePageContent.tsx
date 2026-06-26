"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { ExploreSection } from "@/components/home/ExploreSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { StatsBand } from "@/components/home/StatsBand";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TrustBand } from "@/components/home/TrustBand";
import { ProviderCTA } from "@/components/home/ProviderCTA";

export function HomePageContent() {
  return (
    <div>
      <HeroSection />
      <HomeSearchSection />
      {/* Anchor pour le chevron scroll-down */}
      <div id="explore" />
      <ExploreSection />
      <StatsBand />
      <HowItWorksSection />
      <TestimonialsSection />
      <TrustBand />
      <ProviderCTA />
    </div>
  );
}
