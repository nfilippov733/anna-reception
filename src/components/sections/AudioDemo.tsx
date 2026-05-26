"use client";
import { useRef, useState } from "react";
import { Waveform } from "@/components/primitives/Waveform";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import { PlayButton } from "@/components/primitives/PlayButton";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";
const GENERIC_AUDIO_SRC = process.env.NEXT_PUBLIC_GENERIC_AUDIO_SRC ?? "";
const TRANSCRIPT =
  "ANNA: Good afternoon, ANNA Reception. Caller: Hi, do you have any availability tomorrow? ANNA: We've got a 10am and a 2pm — which suits? …";

export function AudioDemo() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

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
    <section className="mx-auto max-w-page px-4 py-16 md:py-20" aria-labelledby="audio-heading">
      <Kicker number="03" label="Hear ANNA take a real call" />
      <h2 id="audio-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Hear ANNA take a real call.
      </h2>
      <p className="mt-4 text-lg text-fg-muted max-w-prose leading-[1.55]">
        30 seconds of an actual call answered, triaged, and booked. Most callers don&apos;t realise it&apos;s AI.
      </p>
      <div className="mt-10 rounded-2xl border border-sage/40 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <PlayButton playing={playing} onToggle={togglePlay} />
          <Waveform playing={playing} />
        </div>
        {GENERIC_AUDIO_SRC ? (
          <audio
            ref={ref}
            src={GENERIC_AUDIO_SRC}
            preload="metadata"
            onEnded={() => {
              setPlaying(false);
              track("audio_demo_completed_30s");
            }}
          />
        ) : (
          <div className="mt-4">
            <MissingAsset label="audio: generic 30s call sample" />
          </div>
        )}
        <button
          type="button"
          aria-expanded={showTranscript}
          onClick={() => setShowTranscript((v) => !v)}
          className="mt-4 font-mono text-xs uppercase tracking-wider text-mono-label hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          {showTranscript ? "Hide transcript ↑" : "Read transcript ↓"}
        </button>
        <div role="region" aria-label="Transcript" hidden={!showTranscript} className="mt-3 text-sm text-fg-muted max-w-prose">
          {TRANSCRIPT}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-fg-muted">
        <span>Or hear her live yourself:</span>
        <PhoneChip number={DEMO_PHONE} />
      </div>
    </section>
  );
}
