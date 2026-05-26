import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";

export function Hero() {
  return (
    <section className="mx-auto max-w-page px-4 pt-12 pb-16 md:pt-20 md:pb-24" aria-labelledby="hero-headline">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <Kicker number="01" label="AI Receptionist · UK" />
          <h1
            id="hero-headline"
            className="mt-6 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance"
          >
            Stop <em className="not-italic md:italic text-primary">losing</em> revenue to missed calls.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-prose leading-[1.55]">
            ANNA Reception answers, books, and follows up 24/7 — for dental clinics, salons, gastropubs, and trades.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/demo" data-event="hero_cta_demo_clicked">Book a demo</Button>
            <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
            <span aria-label="Trustpilot rating: five stars" className="text-primary font-medium">★★★★★</span>
            <span>Trustpilot</span>
            <span aria-hidden="true">·</span>
            <span>From the team behind 100,000+ business accounts</span>
          </div>
        </div>
        <div aria-hidden="true" className="hidden md:block relative">
          <Image
            src="/assets/redesign/hero-illustration.png"
            alt=""
            width={800}
            height={1000}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
