import { AuditForm } from "./AuditForm";
import { readVerticalFromUrl } from "@/lib/urlParams";
import { VERTICALS } from "@/content/verticals";
import type { VerticalKey } from "@/lib/verticals";

type Props = { searchParams: Promise<{ v?: string }> };

export default async function AuditPage({ searchParams }: Props) {
  const params = await searchParams;
  const fakeUrl = new URL(`http://x/?v=${params.v ?? ""}`);
  const segment: VerticalKey | null = readVerticalFromUrl(fakeUrl);

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Free revenue audit</p>
      <h1 className="mt-4 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance">
        {segment ? VERTICALS[segment].auditH1 : "How much your business is leaking — in pounds."}
      </h1>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Tell us your business URL and your missed-call estimate. We&apos;ll come back within 24 hours with a £-amount and the exact calls we&apos;d recover.
      </p>
      <AuditForm initialSegment={segment ?? null} />
    </section>
  );
}
