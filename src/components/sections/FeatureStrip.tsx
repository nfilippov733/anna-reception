import { FeatureIcon, type FeatureIconName } from "@/components/primitives/FeatureIcon";
import { Reveal } from "@/components/primitives/Reveal";

type Feature = {
  icon: FeatureIconName;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  { icon: "answer-24-7", title: "24/7 answer", body: "Picks up every call — 11pm, weekends, bank holidays." },
  { icon: "calendar", title: "Books in your calendar", body: "Writes the appointment straight into your booking system." },
  { icon: "sms", title: "SMS follow-up", body: "Sends confirmations, reminders, and audit summaries." },
  { icon: "transfer", title: "Smart human transfer", body: "Hands off to your team with the full conversation context in 1 SMS." },
  { icon: "deposit", title: "Deposit at booking", body: "Stripe SMS deposit collection — where your booking system supports it." },
  { icon: "integrations", title: "200+ integrations", body: "Plays nicely with the tools you already pay for." },
];

export function FeatureStrip() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-label="Core features">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-sage/30">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delayMs={i * 40}>
            <li
              className={[
                "p-8 border-b border-sage/30",
                i % 3 !== 0 ? "lg:border-l lg:border-sage/30" : "",
                i % 2 !== 0 ? "sm:border-l sm:border-sage/30 lg:border-l" : "",
              ].join(" ")}
            >
              <FeatureIcon name={f.icon} />
              <p className="mt-4 text-lg font-medium text-ink">{f.title}</p>
              <p className="mt-2 text-sm text-fg-muted">{f.body}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
