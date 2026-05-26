type LeakStat = { num: string; headline: string; subline: string };

const STATS: LeakStat[] = [
  {
    num: "01",
    headline: "62% of small-business calls go unanswered.",
    subline: "Every missed call is a customer you never knew you could win. [source: TBD]",
  },
  {
    num: "02",
    headline: "Web leads cool in 5 minutes.",
    subline: "Wait 30 minutes and your conversion rate drops 9×. [source: TBD]",
  },
  {
    num: "03",
    headline: "Old quotes sit dead in your CRM.",
    subline: "Reactivating dormant leads is the cheapest revenue you'll ever win.",
  },
];

export function RevenueLeak() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-labelledby="leak-heading">
      <h2 id="leak-heading" className="font-display text-3xl md:text-5xl">Where your revenue is leaking.</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {STATS.map((s) => (
          <li key={s.num} className="rounded-2xl border border-border p-6 bg-bg">
            <span className="font-mono text-leak text-sm">{s.num}</span>
            <p className="mt-3 text-xl font-medium">{s.headline}</p>
            <p className="mt-3 text-fg-muted text-sm">{s.subline}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
