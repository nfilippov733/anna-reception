const FEATURES = [
  { title: "24/7 answer", body: "Picks up every call — 11pm, weekends, bank holidays." },
  { title: "Books in your calendar", body: "Writes the appointment straight into your booking system." },
  { title: "SMS follow-up", body: "Sends confirmations, reminders, and audit summaries." },
  { title: "Smart human transfer", body: "Hands off to your team with the full conversation context in 1 SMS." },
  { title: "Deposit at booking", body: "Stripe SMS deposit collection — where your booking system supports it." },
  { title: "200+ integrations", body: "Plays nicely with the tools you already pay for." },
];

export function FeatureStrip() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-label="Core features">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="rounded-2xl border border-border p-6 bg-bg-alt">
            <p className="font-medium">{f.title}</p>
            <p className="mt-2 text-sm text-fg-muted">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
