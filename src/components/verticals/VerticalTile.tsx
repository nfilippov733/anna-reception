"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { VerticalContent } from "@/lib/verticals";
import { VerticalMark } from "@/components/primitives/VerticalMark";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

type Props = { content: VerticalContent };

export function VerticalTile({ content }: Props) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next) track("vertical_tile_expanded", { vertical: content.key });
      return next;
    });
  };

  return (
    <div
      className={cn(
        "border-b border-sage/30 transition-colors duration-200 motion-reduce:transition-none",
        open && "bg-cream-deep"
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={handleToggle}
        className="flex w-full items-center gap-6 py-8 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <VerticalMark vertical={content.key} className="h-10 w-10 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-display text-2xl text-ink">{content.label}</div>
          <p className="mt-1 text-fg-muted">{content.cardHook}</p>
        </div>
        <span className="hidden md:block max-w-xs text-right font-mono text-xs tabular-nums text-mono-label leading-snug">
          {content.headlineRoi}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-5 w-5 text-mono-label flex-shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-8 grid gap-6 md:grid-cols-2 md:gap-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">The pain</p>
            <p className="mt-3 text-ink leading-[1.55]">{content.painFraming}</p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">What ANNA does</p>
            <ul className="mt-3 space-y-2 text-ink">
              {content.smartBehaviours.map((b) => (
                <li key={b} className="flex gap-2">
                  <span aria-hidden="true" className="text-sage">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="md:hidden mt-6 font-mono text-xs tabular-nums text-mono-label leading-snug">
              {content.headlineRoi}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Works with</p>
            <p className="mt-3 text-ink leading-[1.55]">
              <span className="font-medium">UK:</span> {content.integrationsUk.join(" · ")}
            </p>
            <p className="mt-2 text-ink leading-[1.55]">
              <span className="font-medium">US/intl:</span> {content.integrationsUsIntl.join(" · ")}
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Sample call</p>
            <p className="mt-3 text-fg-muted text-sm leading-[1.55]">{content.audioSampleScript}</p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Compliance</p>
            <p className="mt-3 text-fg-muted text-sm">{content.complianceLine}</p>
          </div>
        </div>
      )}
    </div>
  );
}
