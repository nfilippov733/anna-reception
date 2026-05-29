import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import type { VerticalKey } from "@/lib/verticals";

type Props = { initialSegment?: VerticalKey };

export function Hero({ initialSegment }: Props = {}) {
  return (
    <section className="mx-auto max-w-page px-4 pt-12 pb-16 md:pt-20 md:pb-24" aria-labelledby="hero-headline">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <Kicker number="01" label="Front desk · 24/7 · UK" />
          <h1
            id="hero-headline"
            className="mt-6 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance"
          >
            Your missed calls are now revenue.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-prose leading-[1.55]">
            ANNA Reception answers every call, returns every web lead, and chases every dormant quote — across phone, WhatsApp, and DMs. Pays for itself in the first week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/demo" data-event="hero_cta_demo_clicked">Book a demo</Button>
            <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
            3-minute live demo on your booking system · no slides · no sales pressure
          </p>
          {(initialSegment === "dental" || initialSegment === "vet") && (
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
              ANNA never gives clinical advice · triage only · your team makes the calls
            </p>
          )}
          <div className="mt-10 inline-flex flex-wrap items-center gap-3 rounded-full border border-sage/40 bg-cream-deep/50 px-4 py-2.5">
            <span aria-label="Trustpilot rating: five stars" className="text-primary font-medium tracking-wider">★★★★★</span>
            <span className="font-mono text-xs uppercase tracking-wider text-mono-label">Trustpilot · Excellent</span>
            <span aria-hidden="true" className="text-sage">·</span>
            <span className="font-mono text-xs uppercase tracking-wider text-mono-label">100,000+ UK SMBs on ANNA</span>
          </div>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
            Phone · WhatsApp · Instagram DMs · Web chat — all one inbox
          </p>
        </div>
        <div aria-hidden="true" className="hidden md:block relative">
          <Image
            src="/assets/redesign/hero-illustration.png"
            alt=""
            width={800}
            height={1000}
            priority
            className="w-full h-auto motion-safe:animate-bob"
          />
        </div>
      </div>
    </section>
  );
}
