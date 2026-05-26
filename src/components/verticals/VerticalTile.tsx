"use client";
import { useState } from "react";
import { AccordionItem } from "@/components/primitives/AccordionItem";
import type { VerticalContent } from "@/lib/verticals";
import { Waveform } from "@/components/primitives/Waveform";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import { track } from "@/lib/analytics";

type Props = { content: VerticalContent };

export function VerticalTile({ content }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <AccordionItem
      title={
        <div className="flex flex-col items-start">
          <span className="text-lg font-medium">{content.label}</span>
          <span className="text-fg-muted text-sm mt-1">{content.cardHook}</span>
          <span className="text-leak text-sm mt-2 font-mono">{content.headlineRoi}</span>
        </div>
      }
      onToggle={(open) => open && track("vertical_tile_expanded", { vertical: content.key })}
    >
      <div className="grid gap-6 md:grid-cols-2 pt-4">
        <div>
          <h4 className="font-medium">The pain</h4>
          <p className="mt-2 text-sm">{content.painFraming}</p>
          <h4 className="mt-4 font-medium">What ANNA does</h4>
          <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
            {content.smartBehaviours.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Hear a {content.label.toLowerCase()} call</h4>
          <div className="mt-3 rounded-xl border border-border bg-bg p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause sample" : "Play sample"}
                className="h-10 w-10 rounded-full bg-primary text-on-primary flex items-center justify-center"
              >
                {playing ? "⏸" : "▶"}
              </button>
              <Waveform playing={playing} />
            </div>
            <p className="mt-3 text-xs text-fg-muted">{content.audioSampleScript}</p>
          </div>
          <h4 className="mt-4 font-medium">Works with</h4>
          <p className="mt-2 text-sm">
            <span className="font-medium">UK:</span> {content.integrationsUk.join(" · ")}<br />
            <span className="font-medium">US/intl:</span> {content.integrationsUsIntl.join(" · ")}
          </p>
          <h4 className="mt-4 font-medium">Testimonial slot</h4>
          <p className="mt-2 text-sm text-fg-muted">{content.testimonialSlot}</p>
          <MissingAsset label={`testimonial: ${content.label}`} />
          <p className="mt-3 text-xs text-fg-muted">{content.complianceLine}</p>
        </div>
      </div>
    </AccordionItem>
  );
}
