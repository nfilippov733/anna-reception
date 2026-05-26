"use client";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS } from "@/lib/verticals";
import { VerticalTile } from "@/components/verticals/VerticalTile";
import { Kicker } from "@/components/primitives/Kicker";

export function VerticalsTileModule() {
  return (
    <section id="verticals" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="verticals-heading">
      <Kicker number="06" label="Built for how you actually run" />
      <h2 id="verticals-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Built for how you actually run.
      </h2>
      <p className="mt-4 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Tap a tile to hear a real call, see the integrations, and read the operator&apos;s story.
      </p>
      <div className="mt-12 border-t border-sage/30">
        {VERTICAL_KEYS.map((k) => (
          <VerticalTile key={k} content={VERTICALS[k]} />
        ))}
      </div>
    </section>
  );
}
