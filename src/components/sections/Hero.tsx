import { Button } from "@/components/primitives/Button";

export function Hero() {
  return (
    <section className="mx-auto max-w-page px-4 pt-12 pb-16 md:pt-20 md:pb-24" aria-labelledby="hero-headline">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <h1 id="hero-headline" className="font-display text-4xl md:text-6xl leading-tight tracking-tight">
            Stop losing revenue to missed calls.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-prose">
            ANNA Reception answers, books, and follows up 24/7 — for dental clinics, salons, gastropubs, and trades.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/demo" data-event="hero_cta_demo_clicked">Book a demo</Button>
            <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
            <span aria-label="Trustpilot rating">★★★★★ Trustpilot</span>
            <span>·</span>
            <span>From the team behind 100,000+ business accounts</span>
          </div>
        </div>
        <div aria-hidden="true" className="hidden md:block">
          {/* Hero device mockup is sourced by ANNA design (spec §7). Placeholder shape: */}
          <div className="aspect-[3/4] rounded-3xl bg-bg-alt border border-border" />
        </div>
      </div>
    </section>
  );
}
