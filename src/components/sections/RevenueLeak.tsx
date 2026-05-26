import { Kicker } from "@/components/primitives/Kicker";
import { NumberMarker } from "@/components/primitives/NumberMarker";

type LeakStat = {
  num: string;
  tone: "leak" | "primary";
  headline: string;
  subline: string;
  source?: string;
};

const STATS: LeakStat[] = [
  {
    num: "01",
    tone: "leak",
    headline: "62% of small-business calls go unanswered.",
    subline: "Every missed call is a customer you never knew you could win.",
    source: "Source: BT SMB Voice Report 2024",
  },
  {
    num: "02",
    tone: "primary",
    headline: "Web leads cool in 5 minutes.",
    subline: "Wait 30 minutes and your conversion rate drops 9×.",
    source: "Source: Harvard Business Review 2011",
  },
  {
    num: "03",
    tone: "primary",
    headline: "Old quotes sit dead in your CRM.",
    subline: "Reactivating dormant leads is the cheapest revenue you'll ever win.",
  },
];

export function RevenueLeak() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="leak-heading">
      <Kicker number="02" label="Where the leak is" />
      <h2 id="leak-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Where your revenue is leaking.
      </h2>
      <ol className="mt-16 grid gap-12 md:grid-cols-3">
        {STATS.map((s) => (
          <li key={s.num}>
            <NumberMarker tone={s.tone}>{s.num}</NumberMarker>
            <p className="mt-6 text-2xl font-medium text-ink leading-tight">{s.headline}</p>
            <p className="mt-3 text-fg-muted max-w-prose">{s.subline}</p>
            {s.source && (
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-mono-label">
                {s.source}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
