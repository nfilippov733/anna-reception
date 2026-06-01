"use client";
import { useEffect, useRef, useState } from "react";
import { Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Waveform } from "@/components/primitives/Waveform";
import { PlayButton } from "@/components/primitives/PlayButton";
import { CHANNEL_DEMOS } from "@/content/channelDemos";
import type { VerticalKey } from "@/lib/verticals";
import { track } from "@/lib/analytics";

type Props = {
  segment: VerticalKey;
  // Topic switcher — cycle the call being sampled, right at the player.
  segmentLabel?: string;
  onPrev?: () => void;
  onNext?: () => void;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PhoneDemoPanel({ segment, segmentLabel, onPrev, onNext }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const thread = CHANNEL_DEMOS[segment].phone;
  const lastTurn = thread[thread.length - 1];
  const meta = lastTurn?.meta ?? "";
  const audioSrc = `/assets/audio/${segment}.mp3`;

  // Switching call topic swaps the audio source — stop and reset the player.
  useEffect(() => {
    const a = ref.current;
    if (a) {
      a.pause();
      a.load();
    }
    setPlaying(false);
    setElapsed(0);
  }, [segment]);

  function togglePlay() {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
      track("audio_demo_played");
    }
  }

  return (
    <div>
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-sage/40 bg-gradient-to-br from-cream-deep via-cream-deep to-sage-soft/50 p-8 md:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-2xl"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium text-ink">ANNA · your front desk</p>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
              {playing ? "On the call…" : "Live sample call"}
            </p>
          </div>
          <span className="ml-auto font-display text-2xl tabular-nums text-ink">{formatTime(elapsed)}</span>
        </div>

        <div className="relative mt-8 flex items-center gap-5">
          <div className="relative shrink-0">
            {playing && (
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full bg-primary/30 motion-reduce:hidden"
              />
            )}
            <PlayButton playing={playing} onToggle={togglePlay} className="relative" />
          </div>
          <div className="flex-1">
            <Waveform playing={playing} />
          </div>
        </div>

        <audio
          ref={ref}
          src={audioSrc}
          preload="metadata"
          onTimeUpdate={(e) => setElapsed(Math.floor(e.currentTarget.currentTime))}
          onEnded={() => {
            setPlaying(false);
            setElapsed(0);
            track("audio_demo_completed_30s");
          }}
        />

        {segmentLabel && onPrev && onNext && (
          <div className="relative mt-6 flex items-center justify-center gap-4 border-t border-sage/30 pt-5">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous call type"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sage/40 bg-bg text-ink transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-[150px] text-center" aria-live="polite">
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mono-label">
                Sample call
              </span>
              <span className="font-medium text-ink">{segmentLabel}</span>
            </span>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next call type"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sage/40 bg-bg text-ink transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Full transcript stays in the DOM for screen readers, hidden visually —
            the voice case speaks for itself. */}
        <div className="sr-only">
          <p>Sample transcript</p>
          <dl>
            {thread.map((turn, i) => (
              <div key={i}>
                <dt>{turn.from === "caller" ? "Caller" : "ANNA"}</dt>
                <dd>{turn.text}</dd>
              </div>
            ))}
          </dl>
          {meta && <p>{meta}</p>}
        </div>
      </div>
    </div>
  );
}
