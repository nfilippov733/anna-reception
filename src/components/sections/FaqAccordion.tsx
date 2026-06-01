import { FAQ } from "@/content/faq";
import { AccordionItem } from "@/components/primitives/AccordionItem";
import { Kicker } from "@/components/primitives/Kicker";

export function FaqAccordion() {
  return (
    <section id="faq" className="mx-auto max-w-page px-4 py-24 md:py-32 scroll-mt-20" aria-labelledby="faq-heading">
      <Kicker number="13" label="Questions, then?" />
      <h2 id="faq-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Questions, then?
      </h2>
      <div className="mt-12 max-w-3xl">
        {FAQ.map((entry) => (
          <AccordionItem key={entry.q} title={entry.q}>
            <p className="text-fg-muted max-w-prose">{entry.a}</p>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}
