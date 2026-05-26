const STEPS = [
  { num: "1", title: "Add your business", body: "Paste your website. ANNA learns your menu, hours, team, and tone." },
  { num: "2", title: "ANNA learns it", body: "She gets familiar with your booking flow, your prices, and your common objections." },
  { num: "3", title: "Calls answered 24/7", body: "From the second you flip the switch, ANNA picks up every call — at 11pm, on bank holidays, when you're on-site." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-page px-4 py-16" aria-labelledby="how-heading">
      <h2 id="how-heading" className="font-display text-3xl md:text-5xl">Set up in three minutes.</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.num} className="rounded-2xl border border-border p-6 bg-bg">
            <span className="font-mono text-primary text-sm">Step {s.num}</span>
            <p className="mt-3 text-xl font-medium">{s.title}</p>
            <p className="mt-3 text-fg-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
