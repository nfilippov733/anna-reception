import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS } from "@/lib/verticals";
import { VerticalTile } from "@/components/verticals/VerticalTile";

export function VerticalsTileModule() {
  return (
    <section id="verticals" className="mx-auto max-w-page px-4 py-16" aria-labelledby="verticals-heading">
      <h2 id="verticals-heading" className="font-display text-3xl md:text-5xl">Built for how you actually run.</h2>
      <p className="mt-3 text-fg-muted max-w-prose">
        Tap a tile to hear a real call, see the integrations, and read the operator&apos;s story.
      </p>
      <div className="mt-10 rounded-2xl border border-border overflow-hidden">
        {VERTICAL_KEYS.map((k) => (
          <VerticalTile key={k} content={VERTICALS[k]} />
        ))}
      </div>
    </section>
  );
}
