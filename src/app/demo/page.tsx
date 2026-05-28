import { DemoForm } from "./DemoForm";
import { readVerticalFromUrl } from "@/lib/urlParams";
import { VERTICALS } from "@/content/verticals";
import type { VerticalKey } from "@/lib/verticals";

type Props = { searchParams: Promise<{ v?: string }> };

export default async function DemoPage({ searchParams }: Props) {
  const params = await searchParams;
  const fakeUrl = new URL(`http://x/?v=${params.v ?? ""}`);
  const segment: VerticalKey | null = readVerticalFromUrl(fakeUrl);
  const segmentLabel = segment ? VERTICALS[segment].label.toLowerCase() : null;

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Book a demo</p>
      <h1 className="mt-4 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance">
        {segmentLabel
          ? `See ANNA take a ${segmentLabel} call.`
          : "See ANNA take a real call."}
      </h1>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Three-minute live demo with your menu, your tone, your booking system. We&apos;ll have ANNA on a test number by the end of the call.
      </p>
      <DemoForm initialSegment={segment ?? null} />
    </section>
  );
}
