"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker";
import { VerticalMark } from "@/components/primitives/VerticalMark";
import { SegmentPanel } from "@/components/segments/SegmentPanel";
import { useSegmentParam } from "@/lib/useSegmentParam";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const KICKER_LETTERS = ["a", "b", "c", "d", "e", "f"];
const AUTO_ADVANCE_MS = 6000;

type Props = { initialSegment: VerticalKey };

export function SegmentsShowcase({ initialSegment }: Props) {
  const [active, select] = useSegmentParam(initialSegment);
  const activeIndex = VERTICAL_KEYS.indexOf(active);
  const tabRefs = useRef<Record<VerticalKey, HTMLButtonElement | null>>(
    {} as Record<VerticalKey, HTMLButtonElement | null>
  );
  const regionRef = useRef<HTMLDivElement | null>(null);

  // Slide direction for the enter animation (1 = forward, -1 = back).
  const [dir, setDir] = useState<1 | -1>(1);
  // Auto-advance gates: pause on hover/focus, stop for good once the user
  // engages, only run while on-screen, and honour reduced-motion.
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  const moveTo = (idx: number, focusTab: boolean) => {
    const target = (idx + VERTICAL_KEYS.length) % VERTICAL_KEYS.length;
    const k = VERTICAL_KEYS[target] as VerticalKey;
    setDir(target >= activeIndex || (activeIndex === VERTICAL_KEYS.length - 1 && target === 0) ? 1 : -1);
    select(k);
    track("segment_tab_changed", { segment: k });
    if (focusTab) tabRefs.current[k]?.focus();
  };

  const handleSelect = (k: VerticalKey) => {
    setEngaged(true);
    moveTo(VERTICAL_KEYS.indexOf(k), false);
  };
  const goNext = () => {
    setEngaged(true);
    moveTo(activeIndex + 1, false);
  };
  const goPrev = () => {
    setEngaged(true);
    moveTo(activeIndex - 1, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        setEngaged(true);
        moveTo(activeIndex + 1, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        setEngaged(true);
        moveTo(activeIndex - 1, true);
        break;
      case "Home":
        e.preventDefault();
        setEngaged(true);
        moveTo(0, true);
        break;
      case "End":
        e.preventDefault();
        setEngaged(true);
        moveTo(VERTICAL_KEYS.length - 1, true);
        break;
    }
  };

  // Reduced-motion preference.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Only auto-advance while the carousel is actually on screen.
  useEffect(() => {
    const el = regionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance until the user engages.
  useEffect(() => {
    if (reduced || engaged || paused || !visible) return;
    const id = setInterval(() => {
      moveTo(VERTICAL_KEYS.indexOf(active) + 1, false);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, engaged, paused, visible, active]);

  return (
    <section
      id="segments"
      className="mx-auto max-w-page px-4 py-24 md:py-32"
      aria-labelledby="segments-heading"
    >
      <Kicker number="05" label="Built for how you actually run" />
      <h2
        id="segments-heading"
        className="mt-6 font-display text-display-lg text-ink text-balance"
      >
        Built for how you actually run.
      </h2>

      <div
        ref={regionRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Segment showcase"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          role="tablist"
          aria-label="Segment selector"
          onKeyDown={handleKeyDown}
          className="mt-12 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2",
                  "transition-colors duration-200 motion-reduce:transition-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "border-primary bg-cream-deep text-ink"
                    : "border-sage/40 text-fg-muted hover:border-sage hover:text-ink"
                )}
              >
                <VerticalMark vertical={k} variant="icon" className="h-4 w-4" />
                <span className="text-sm font-medium">{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* On md+ the panel is inset (md:px-14) so the side arrows sit in a
            reserved gutter — no overflow, no overlap with content. */}
        <div className="relative mt-10 md:px-14">
          <div className="overflow-hidden">
            <div
              key={active}
              className="animate-segment-in"
              style={{ "--seg-from": dir === 1 ? "1.5rem" : "-1.5rem" } as CSSProperties}
            >
              <SegmentPanel
                content={VERTICALS[active]}
                panelId={`segment-panel-${active}`}
                labelledBy={`segment-tab-${active}`}
                kickerLetter={KICKER_LETTERS[activeIndex] ?? "a"}
              />
            </div>
          </div>

          {/* Side arrows — desktop only, vertically centred in the gutter. */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous segment"
            className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sage/40 bg-cream-deep text-ink shadow-md transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:flex"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next segment"
            className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sage/40 bg-cream-deep text-ink shadow-md transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:flex"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Controls: dots always; arrows here on mobile (side arrows take over on md+). */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous segment"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/40 text-ink transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          {/* Decorative position indicators — keyboard nav lives in the labelled
              chips + arrows, so these stay out of the a11y tree. */}
          <div className="flex items-center gap-2" aria-hidden="true">
            {VERTICAL_KEYS.map((k) => (
              <span
                key={k}
                role="presentation"
                onClick={() => handleSelect(k)}
                className={cn(
                  "h-2 cursor-pointer rounded-full transition-all duration-200 motion-reduce:transition-none",
                  k === active ? "w-6 bg-primary" : "w-2 bg-sage/40 hover:bg-sage"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next segment"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/40 text-ink transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
