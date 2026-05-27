import { Hero } from "@/components/sections/Hero";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { RevenueLeak } from "@/components/sections/RevenueLeak";
import { AudioDemo } from "@/components/sections/AudioDemo";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { VerticalsTileModule } from "@/components/sections/VerticalsTileModule";
import { TestimonialWall } from "@/components/sections/TestimonialWall";
import { FeatureStrip } from "@/components/sections/FeatureStrip";
import { IntegrationsMarquee } from "@/components/sections/IntegrationsMarquee";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { AuditReEntryBanner } from "@/components/sections/AuditReEntryBanner";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { SquiggleDivider } from "@/components/primitives/SquiggleDivider";
import { readVerticalFromUrl } from "@/lib/urlParams";
import type { VerticalKey } from "@/lib/verticals";

type Props = { searchParams: Promise<{ v?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const fakeUrl = new URL(`http://x/?v=${params.v ?? ""}`);
  const initialVertical: VerticalKey | null = readVerticalFromUrl(fakeUrl);

  return (
    <>
      <Hero />
      <SquiggleDivider />
      <SocialProofLogos />
      <RevenueLeak />
      <SquiggleDivider />
      <AudioDemo />
      <RoiCalculator initialVertical={initialVertical} />
      <HowItWorks />
      <VerticalsTileModule />
      <TestimonialWall />
      <FeatureStrip />
      <IntegrationsMarquee />
      <PricingTeaser />
      <AuditReEntryBanner />
      <FaqAccordion />
      <FinalCtaBanner />
    </>
  );
}
