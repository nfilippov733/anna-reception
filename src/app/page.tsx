import { Hero } from "@/components/sections/Hero";
import { ChannelsRibbon } from "@/components/sections/ChannelsRibbon";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { ChannelDemos } from "@/components/sections/ChannelDemos";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SegmentsShowcase } from "@/components/sections/SegmentsShowcase";
import { TestimonialWall } from "@/components/sections/TestimonialWall";
import { OutcomeStrip } from "@/components/sections/OutcomeStrip";
import { IntegrationsMarquee } from "@/components/sections/IntegrationsMarquee";
import { HiringComparison } from "@/components/sections/HiringComparison";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { SquiggleDivider } from "@/components/primitives/SquiggleDivider";
import { readVerticalFromUrl } from "@/lib/urlParams";
import type { VerticalKey } from "@/lib/verticals";

type Props = { searchParams: Promise<{ v?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const fakeUrl = new URL(`http://x/?v=${params.v ?? ""}`);
  const initialVerticalFromUrl: VerticalKey | null = readVerticalFromUrl(fakeUrl);
  const initialVertical: VerticalKey = initialVerticalFromUrl ?? "dental";

  return (
    <>
      <Hero initialSegment={initialVerticalFromUrl ?? undefined} />
      <ChannelsRibbon />
      <SocialProofLogos />
      <SegmentsShowcase initialSegment={initialVertical} />
      <OutcomeStrip />
      <SquiggleDivider />
      <ChannelDemos initialSegment={initialVertical} />
      <RoiCalculator initialVertical={initialVertical} />
      <HowItWorks />
      <TestimonialWall />
      <IntegrationsMarquee />
      <HiringComparison />
      <PricingTeaser />
      <FaqAccordion />
      <FinalCtaBanner />
    </>
  );
}
