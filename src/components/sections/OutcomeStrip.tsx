import { TrendingUp, Zap, RotateCcw, Hand, type LucideIcon } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker";
import { Reveal } from "@/components/primitives/Reveal";

type Outcome = { icon: LucideIcon; headline: string; proof: string };

const OUTCOMES: Outcome[] = [
  {
    icon: TrendingUp,
    headline: "More booked appointments.",
    proof: "Every call answered, every web lead returned, every dormant quote chased — 24/7.",
  },
  {
    icon: Zap,
    headline: "Faster than your competitor.",
    proof: "First call back wins the job. ANNA picks up in 2 seconds — your competitor's voicemail can't.",
  },
  {
    icon: RotateCcw,
    headline: "Recovered dormant revenue.",
    proof: "Outbound follow-ups on old quotes and no-shows turn cold pipeline into booked work.",
  },
  {
    icon: Hand,
    headline: "Off your phone, in your work.",
    proof: "Hands stay on the chair, the trowel, the keg. ANNA handles the rest.",
  },
];

export function OutcomeStrip() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="outcomes-heading">
      <Kicker number="05" label="The outcomes" />
      <h2 id="outcomes-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        What you actually get.
      </h2>
      <ul className="mt-16 grid md:grid-cols-2 border-t border-sage/30">
        {OUTCOMES.map(({ icon: Icon, headline, proof }, i) => (
          <Reveal
            as="li"
            key={headline}
            delayMs={i * 40}
            className={[
              "p-8 md:p-10 border-b border-sage/30",
              i % 2 !== 0 ? "md:border-l md:border-sage/30" : "",
            ].join(" ")}
          >
            <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
            <p className="mt-4 text-2xl font-medium text-ink leading-tight">{headline}</p>
            <p className="mt-3 text-fg-muted leading-[1.55] max-w-prose">{proof}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
