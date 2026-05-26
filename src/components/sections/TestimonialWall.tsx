import { TESTIMONIALS } from "@/content/testimonials";
import { Kicker } from "@/components/primitives/Kicker";
import { PullQuote } from "@/components/primitives/PullQuote";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function TestimonialWall() {
  const [hero, ...rest] = TESTIMONIALS;
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="testimonials-heading">
      <Kicker number="07" label="What operators tell us" />
      <h2 id="testimonials-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        What operators tell us.
      </h2>
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {hero && (
          <div className="md:col-span-2">
            <PullQuote
              quote={hero.quote}
              attribution={hero.name}
              role={hero.role}
              business=""
              metric={hero.metric}
            />
          </div>
        )}
        <div className="grid gap-8">
          {rest.slice(0, 2).map((t, i) => (
            <figure key={i}>
              <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.avatarSrc ? (
                  <Image src={t.avatarSrc} alt={t.name} width={40} height={40} className="rounded-full ring-2 ring-sage/40" />
                ) : (
                  <MissingAsset label={`avatar: ${t.name}`} width={40} height={40} />
                )}
                <div>
                  <div className="text-sm font-medium text-ink">{t.name}</div>
                  <div className="text-xs text-fg-muted">{t.role}</div>
                </div>
              </figcaption>
              <p className="mt-3 font-mono text-xs tabular-nums text-primary">{t.metric}</p>
            </figure>
          ))}
        </div>
      </div>
      {rest.length > 2 && (
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {rest.slice(2).map((t, i) => (
            <figure key={i}>
              <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.avatarSrc ? (
                  <Image src={t.avatarSrc} alt={t.name} width={40} height={40} className="rounded-full ring-2 ring-sage/40" />
                ) : (
                  <MissingAsset label={`avatar: ${t.name}`} width={40} height={40} />
                )}
                <div>
                  <div className="text-sm font-medium text-ink">{t.name}</div>
                  <div className="text-xs text-fg-muted">{t.role}</div>
                </div>
              </figcaption>
              <p className="mt-3 font-mono text-xs tabular-nums text-primary">{t.metric}</p>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
