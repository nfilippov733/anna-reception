import { TESTIMONIALS } from "@/content/testimonials";
import { Kicker } from "@/components/primitives/Kicker";
import { PullQuote } from "@/components/primitives/PullQuote";
import { Reveal } from "@/components/primitives/Reveal";

export function TestimonialWall() {
  const hero = TESTIMONIALS.find((t) => t.hero) ?? TESTIMONIALS[0];
  const rest = TESTIMONIALS.filter((t) => t !== hero);
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="testimonials-heading">
      <Kicker number="09" label="What operators tell us" />
      <h2 id="testimonials-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        What operators tell us.
      </h2>
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {hero && (
          <Reveal className="md:col-span-2">
            <PullQuote
              quote={hero.quote}
              attribution={hero.attribution}
              role=""
              business=""
              metric=""
            />
          </Reveal>
        )}
        <Reveal delayMs={120}>
          <div className="grid gap-8">
            {rest.slice(0, 2).map((t, i) => (
              <figure key={i}>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4">
                  <div className="text-sm text-fg-muted">{t.attribution}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
      {rest.length > 2 && (
        <Reveal delayMs={120}>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {rest.slice(2).map((t, i) => (
              <figure key={i}>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4">
                  <div className="text-sm text-fg-muted">{t.attribution}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      )}
      <p className="mt-12 font-mono text-xs uppercase tracking-[0.16em] text-mono-label text-center">
        Illustrative scenarios. Real customer testimonials replace these at launch.
      </p>
    </section>
  );
}
