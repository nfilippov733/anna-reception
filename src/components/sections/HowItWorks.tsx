import { Kicker } from "@/components/primitives/Kicker";
import { NumberMarker } from "@/components/primitives/NumberMarker";
import { Reveal } from "@/components/primitives/Reveal";

const STEPS = [
  {
    num: "01",
    title: "Add your business",
    body: "Paste your website. ANNA learns your menu, hours, team, and tone.",
  },
  {
    num: "02",
    title: "ANNA learns it",
    body: "ANNA learns your menu, your booking flow, and your channels — phone, WhatsApp, Instagram, web.",
  },
  {
    num: "03",
    title: "Calls answered 24/7",
    body: "From the second you flip the switch, ANNA picks up every call — at 11pm, on bank holidays, when you're on-site.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="how-heading">
      <Kicker number="05" label="Set up in three minutes" />
      <h2 id="how-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Set up in three minutes.
      </h2>
      <ol className="mt-16 grid gap-16 md:grid-cols-3 md:gap-8 relative">
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-sage/40"
        />
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.num} delayMs={i * 60} className="relative">
            <NumberMarker>{s.num}</NumberMarker>
            <p className="mt-6 text-xl font-medium text-ink leading-tight">{s.title}</p>
            <p className="mt-3 text-fg-muted max-w-prose">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
