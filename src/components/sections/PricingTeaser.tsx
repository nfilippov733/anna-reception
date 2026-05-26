"use client";
import { Button } from "@/components/primitives/Button";
import { track } from "@/lib/analytics";

export function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-page px-4 py-16" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" className="font-display text-3xl md:text-5xl">Honest pricing.</h2>
      <div className="mt-10 rounded-2xl border border-border bg-bg-alt p-8 max-w-xl">
        <p className="font-display text-3xl">From £99–£299/mo</p>
        <p className="mt-2 text-fg-muted">depending on call volume · No long contracts · Setup in 3 minutes</p>
        <Button
          href="/demo"
          className="mt-6"
          data-event="pricing_teaser_clicked"
          onClick={() => track("pricing_teaser_clicked")}
        >
          Book a demo for full pricing
        </Button>
      </div>
    </section>
  );
}
