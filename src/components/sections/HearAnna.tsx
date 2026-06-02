"use client";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";

// Set to the live demo number (e.g. "+44 20 1234 5678") once the AI call-in
// line is ready. Until then the card renders an honest "launching soon" state —
// never a fake number.
const DEMO_LINE: string | null = null;

export function HearAnna() {
  return (
    <section
      id="hear-anna"
      className="mx-auto max-w-page px-4 py-24 md:py-32"
      aria-labelledby="hear-anna-heading"
    >
      <Kicker number="03" label="Hear it yourself" />
      <h2
        id="hear-anna-heading"
        className="mt-6 font-display text-display-lg text-ink text-balance"
      >
        Call ANNA. Hear it for yourself.
      </h2>
      <p className="mt-4 max-w-prose text-lg leading-[1.55] text-fg-muted">
        The fastest way to judge a front desk is to ring it. A live call-in line is coming —
        book a demo today and hear ANNA answer on your own site straight away.
      </p>

      <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-sage/40 bg-cream-deep p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PhoneCall className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            {DEMO_LINE ? (
              <a
                href={`tel:${DEMO_LINE.replace(/\s+/g, "")}`}
                className="rounded-sm font-display text-3xl tabular-nums text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-event="hear_anna_cta_clicked"
                onClick={() => track("hear_anna_cta_clicked")}
              >
                {DEMO_LINE}
              </a>
            ) : (
              <p className="font-display text-2xl text-ink">
                Live demo line — launching soon
              </p>
            )}
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
              Book a demo to hear ANNA on your own site today
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            href="/demo"
            data-event="hear_anna_cta_clicked"
            onClick={() => track("hear_anna_cta_clicked")}
          >
            Book a demo
          </Button>
          <a
            href="#channel-demos"
            className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label hover:text-primary"
          >
            Or hear a sample call <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
