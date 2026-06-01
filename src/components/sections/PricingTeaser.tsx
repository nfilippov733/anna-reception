"use client";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Tier = {
  key: string;
  name: string;
  price: string;
  blurb: string;
  features: string[];
  recommended?: boolean;
};

// Plan names follow the ANNA Money house style — plain, confident, scale-based
// ("Business" / "Big Business").
const TIERS: Tier[] = [
  {
    key: "sole",
    name: "Sole Trader",
    price: "£99",
    blurb: "Up to ~50 booking calls/month. Single location.",
    features: [
      "Up to ~50 booking calls/month",
      "Phone + WhatsApp",
      "Single location",
      "200+ integrations",
      "SMS confirmations",
      "Cancel anytime",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: "£179",
    blurb: "~150 calls/month. Typical for a busy single-site practice.",
    recommended: true,
    features: [
      "Everything in Sole Trader",
      "~150 calls/month",
      "Every channel — phone, WhatsApp, Instagram, web",
      "Outbound recovery (no-shows + dormant quotes)",
      "Deposit collection via Stripe",
      "Priority support",
    ],
  },
  {
    key: "big",
    name: "Big Business",
    price: "£299",
    blurb: "300+ calls or 2+ locations. Custom quote on request.",
    features: [
      "Everything in Business",
      "300+ calls or 2+ locations",
      "Multi-location call routing",
      "Custom integrations",
      "Dedicated onboarding",
      "Custom quote on request",
    ],
  },
];

export function PricingTeaser() {
  // Business (the recommended tier) starts open so its detail is visible.
  const [openKey, setOpenKey] = useState<string | null>("business");

  const toggle = (key: string) => {
    setOpenKey((prev) => {
      const next = prev === key ? null : key;
      if (next) track("pricing_tier_expanded", { plan: next });
      return next;
    });
  };

  return (
    <section id="pricing" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="pricing-heading">
      <Kicker number="11" label="Honest pricing" />
      <h2 id="pricing-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Honest pricing.
      </h2>

      <div className="mt-12 rounded-3xl border border-sage/40 p-6 md:p-10">
        <p className="font-display text-display-xl text-ink leading-none tabular-nums">
          From £99–£299<span className="text-display-md text-fg-muted">/mo</span>
          <span className="ml-2 align-top text-base font-mono uppercase tracking-[0.18em] text-mono-label">+ VAT</span>
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Depending on call volume · No long contracts · Setup in 3 minutes
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Pays for itself in the first week · Cancel anytime · All prices + VAT
        </p>

        {/* 14-day trial highlight */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-primary/40 bg-cream-deep px-4 py-3">
          <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-sm text-ink">
            <span className="font-semibold">14-day free trial</span> on the full Business plan — no card, cancel anytime.
          </span>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const isOpen = openKey === tier.key;
            const panelId = `tier-panel-${tier.key}`;
            return (
              <li key={tier.key}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-xl border transition-colors",
                    tier.recommended ? "border-2 border-primary bg-cream-deep" : "border-sage/30 hover:border-sage"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(tier.key)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-start gap-3 rounded-xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink">{tier.name}</span>
                        {tier.recommended && (
                          <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-display text-2xl leading-none tabular-nums text-ink">
                        {tier.price}
                        <span className="text-base text-fg-muted">/mo</span>
                        <span className="ml-1 text-xs text-fg-muted">+ VAT</span>
                      </p>
                      <p className="mt-2 text-xs text-fg-muted">{tier.blurb}</p>
                    </div>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 text-mono-label transition-transform duration-200 motion-reduce:transition-none",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div id={panelId} className="px-4 pb-4">
                      <ul className="space-y-2 border-t border-sage/30 pt-4">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-ink">
                            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        href={`/demo?plan=${tier.key}`}
                        variant={tier.recommended ? "primary" : "ghost"}
                        className="mt-5 w-full justify-center"
                        data-event="pricing_tier_cta_clicked"
                        onClick={() => track("pricing_tier_cta_clicked", { plan: tier.key })}
                      >
                        {tier.recommended ? "Start 14-day free trial" : `Start with ${tier.name}`}
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <Button
          href="/demo"
          variant="ghost"
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
