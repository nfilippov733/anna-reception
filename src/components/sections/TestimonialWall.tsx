import { TESTIMONIALS } from "@/content/testimonials";
import { Kicker } from "@/components/primitives/Kicker";
import { PullQuote } from "@/components/primitives/PullQuote";
import { Reveal } from "@/components/primitives/Reveal";

// Trust stats folded in from the retired SocialProofLogos strip.
const SIGNALS = [
  { stat: "100,000+", label: "UK SMBs on ANNA" },
  { stat: "★★★★★", label: "Trustpilot · Excellent" },
  { stat: "24/7", label: "Reception, every day" },
  { stat: "200+", label: "Tools integrated" },
];

// Initials for an in-brand avatar mark, derived from the attribution name.
// "James W. · Westfield…" → "JW"; "Emma & Joe · …" → "EJ".
function initials(attribution: string): string {
  const name = attribution.split("·")[0] ?? "";
  const words = name.split(/\s+/).filter((w) => /[A-Za-z]/.test(w[0] ?? ""));
  return words.slice(0, 2).map((w) => (w[0] ?? "").toUpperCase()).join("");
}

export function TestimonialWall() {
  const hero = TESTIMONIALS.find((t) => t.hero) ?? TESTIMONIALS[0];
  const rest = TESTIMONIALS.filter((t) => t !== hero);
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="testimonials-heading">
      <Kicker number="11" label="What operators tell us" />
      <h2 id="testimonials-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        What operators tell us.
      </h2>

      <Reveal>
        <div className="mt-10 grid grid-cols-2 gap-y-6 gap-x-8 rounded-2xl border border-sage/30 bg-cream-deep p-8 md:grid-cols-4">
          {SIGNALS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-ink tabular-nums leading-none">
                {s.stat}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-mono-label">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {hero && (
          <Reveal className="md:col-span-2">
            <PullQuote quote={hero.quote} attribution={hero.attribution} role="" business="" metric="" />
          </Reveal>
        )}
        <Reveal delayMs={120}>
          <div className="grid gap-8">
            {rest.slice(0, 2).map((t, i) => (
              <figure key={i}>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/20 font-display text-sm text-ink"
                  >
                    {initials(t.attribution)}
                  </span>
                  <span className="text-sm text-fg-muted">{t.attribution}</span>
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
                <figcaption className="mt-4 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/20 font-display text-sm text-ink"
                  >
                    {initials(t.attribution)}
                  </span>
                  <span className="text-sm text-fg-muted">{t.attribution}</span>
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
