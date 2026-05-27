import { INTEGRATION_LOGOS } from "@/content/integrations";

export function IntegrationsMarquee() {
  // Render integration names as text chips for now; SVG logo sprite to come from marketing.
  const names = INTEGRATION_LOGOS.map((l) => l.name);
  return (
    <section className="border-y border-sage/30 bg-cream-deep" aria-label="Integrations">
      <div className="mx-auto max-w-page px-4 py-12 md:py-16">
        <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Works with the tools you already use · 200+ integrations
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 max-w-4xl mx-auto">
          {names.map((name) => (
            <li
              key={name}
              className="inline-flex items-center h-8 px-3 rounded-full border border-sage/40 font-mono text-xs tracking-wide text-ink"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
