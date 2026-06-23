"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { ExploreSection } from "@/components/home/ExploreSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TrustBand } from "@/components/home/TrustBand";
import { ProviderCTA } from "@/components/home/ProviderCTA";

export function HomePageContent() {
  return (
    <div>
      <HeroSection />
      <HomeSearchSection />
      <ExploreSection />
      <HowItWorksSection />
      <TrustBand />
      <ProviderCTA />
    </div>
  );
}
