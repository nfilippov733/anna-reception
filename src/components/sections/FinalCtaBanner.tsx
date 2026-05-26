import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function FinalCtaBanner() {
  return (
    <section className="mx-auto max-w-page px-4 py-20" aria-label="Final call to action">
      <div className="rounded-3xl bg-primary text-on-primary p-10 text-center">
        <h2 className="font-display text-3xl md:text-5xl">Time to stop missing calls.</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/demo" data-event="hero_cta_demo_clicked" className="bg-on-primary text-primary border border-on-primary hover:brightness-95">
            Book a demo
          </Button>
          <PhoneChip number={DEMO_PHONE} className="bg-on-primary/10 border-on-primary/30 text-on-primary" />
        </div>
      </div>
    </section>
  );
}
