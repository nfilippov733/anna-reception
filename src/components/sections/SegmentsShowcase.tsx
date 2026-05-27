"use client";
import { useRef } from "react";
import { Kicker } from "@/components/primitives/Kicker";
import { VerticalMark } from "@/components/primitives/VerticalMark";
import { SegmentPanel } from "@/components/segments/SegmentPanel";
import { useSegmentParam } from "@/lib/useSegmentParam";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const KICKER_LETTERS = ["a", "b", "c", "d", "e", "f"];

type Props = { initialSegment: VerticalKey };

export function SegmentsShowcase({ initialSegment }: Props) {
  const [active, select] = useSegmentParam(initialSegment);
  const activeIndex = VERTICAL_KEYS.indexOf(active);
  const tabRefs = useRef<Record<VerticalKey, HTMLButtonElement | null>>({} as Record<VerticalKey, HTMLButtonElement | null>);

  const handleSelect = (k: VerticalKey) => {
    select(k);
    track("segment_tab_changed", { segment: k });
  };

  const moveTo = (idx: number) => {
    const k = VERTICAL_KEYS[(idx + VERTICAL_KEYS.length) % VERTICAL_KEYS.length] as VerticalKey;
    handleSelect(k);
    tabRefs.current[k]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveTo(0);
        break;
      case "End":
        e.preventDefault();
        moveTo(VERTICAL_KEYS.length - 1);
        break;
    }
  };

  return (
    <section
      id="segments"
      className="mx-auto max-w-page px-4 py-24 md:py-32"
      aria-labelledby="segments-heading"
    >
      <Kicker number="04" label="Built for how you actually run" />
      <h2
        id="segments-heading"
        className="mt-6 font-display text-display-lg text-ink text-balance"
      >
        Built for how you actually run.
      </h2>

      <div
        role="tablist"
        aria-label="Segment selector"
        onKeyDown={handleKeyDown}
        className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        {VERTICAL_KEYS.map((k) => {
          const v = VERTICALS[k];
          const isActive = k === active;
          return (
            <button
              key={k}
              ref={(el) => {
                tabRefs.current[k] = el;
              }}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`segment-panel-${k}`}
              id={`segment-tab-${k}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(k)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive ? "text-ink" : "text-fg-muted hover:text-ink"
              )}
            >
              <VerticalMark vertical={k} variant="illustration" className="h-16 w-16" />
              <span className="font-display text-xl">{v.label}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-0.5 w-12 transition-colors duration-200 motion-reduce:transition-none",
                  isActive ? "bg-sage" : "bg-transparent"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-12">
        <SegmentPanel
          content={VERTICALS[active]}
          panelId={`segment-panel-${active}`}
          labelledBy={`segment-tab-${active}`}
          kickerLetter={KICKER_LETTERS[activeIndex] ?? "a"}
        />
      </div>
    </section>
  );
}
