"use client";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";

export function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="pricing-heading">
      <Kicker number="08" label="Honest pricing" />
      <h2 id="pricing-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Honest pricing.
      </h2>
      <div className="mt-12 rounded-3xl border border-sage/40 p-8 md:p-12 max-w-2xl">
        <p className="font-display text-display-xl text-ink leading-none tabular-nums">
          From £99–£299<span className="text-display-md text-fg-muted">/mo</span>
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Depending on call volume · No long contracts · Setup in 3 minutes
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Pays for itself in the first week · Cancel anytime
        </p>
        <Button
          href="/demo"
          className="mt-8"
          data-event="pricing_teaser_clicked"
          onClick={() => track("pricing_teaser_clicked")}
        >
          Book a demo for full pricing
        </Button>
      </div>
    </section>
  );
}
