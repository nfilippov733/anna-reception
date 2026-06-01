import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";

export function FinalCtaBanner() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-label="Final call to action">
      <div className="relative rounded-3xl bg-cream-deep p-12 md:p-20 text-center overflow-hidden">
        <span aria-hidden="true" className="absolute -bottom-4 -right-4 w-48 text-primary opacity-30">
          <svg viewBox="0 0 120 24" fill="none" className="w-full h-auto">
            <path
              d="M2 12 C 12 2, 22 22, 32 12 S 52 2, 62 12 S 82 22, 92 12 S 112 2, 118 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
        <div className="relative">
          <Kicker number="14" label="Time to stop missing calls" className="!text-mono-label text-center" />
          <h2 className="mt-6 font-display text-display-xl text-ink text-balance">
            Stop letting the phone steal your day. Set up in three minutes, paid back in the first week.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" data-event="final_cta_demo_clicked">
              Book a demo
            </Button>
            <Button variant="ghost" href="#roi" data-event="final_cta_audit_clicked">
              See your revenue leak
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
