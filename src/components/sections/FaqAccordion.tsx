import { FAQ } from "@/content/faq";
import { AccordionItem } from "@/components/primitives/AccordionItem";

export function FaqAccordion() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-3xl md:text-5xl">Questions, then?</h2>
      <div className="mt-10 max-w-3xl">
        {FAQ.map((entry) => (
          <AccordionItem key={entry.q} title={entry.q}>
            <p>{entry.a}</p>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}
