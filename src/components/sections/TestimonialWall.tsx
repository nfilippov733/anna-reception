import { TESTIMONIALS } from "@/content/testimonials";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function TestimonialWall() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="font-display text-3xl md:text-5xl">What operators tell us.</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="rounded-2xl border border-border bg-bg p-6">
            <blockquote className="text-fg">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              {t.avatarSrc ? (
                <Image src={t.avatarSrc} alt={t.name} width={40} height={40} className="rounded-full" />
              ) : (
                <MissingAsset label={`avatar: ${t.name}`} width={40} height={40} />
              )}
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-fg-muted">{t.role}</div>
              </div>
            </figcaption>
            <p className="mt-3 text-sm text-leak font-mono">{t.metric}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
