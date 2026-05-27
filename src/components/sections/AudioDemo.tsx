"use client";
import { useRef, useState } from "react";
import { Waveform } from "@/components/primitives/Waveform";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { PlayButton } from "@/components/primitives/PlayButton";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";
const GENERIC_AUDIO_SRC = process.env.NEXT_PUBLIC_GENERIC_AUDIO_SRC ?? "";

export function AudioDemo() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

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
        30 seconds of an actual call answered, triaged, and booked. Most callers don&apos;t realise it&apos;s ANNA.
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
          <div className="mt-6 border-t border-sage/30 pt-6">
            <p className="font-mono text-xs uppercase tracking-wider text-mono-label">
              Sample transcript
            </p>
            <div className="mt-4 space-y-3 max-w-prose">
              <p className="text-ink">
                <span className="font-mono text-xs tracking-wider text-mono-label uppercase">Caller</span>
                <br />
                Hi, do you have any availability tomorrow?
              </p>
              <p className="text-ink">
                <span className="font-mono text-xs tracking-wider text-primary uppercase">ANNA</span>
                <br />
                We&apos;ve got a 10am and a 2pm — which suits you better?
              </p>
              <p className="text-ink">
                <span className="font-mono text-xs tracking-wider text-mono-label uppercase">Caller</span>
                <br />
                10am, please.
              </p>
              <p className="text-ink">
                <span className="font-mono text-xs tracking-wider text-primary uppercase">ANNA</span>
                <br />
                Booked for 10am tomorrow. Confirmation just sent to your phone. Anything else?
              </p>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-mono-label">
              Audio sample available at launch · or hear her live now ↓
            </p>
          </div>
        )}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-fg-muted">
        <span>Or hear her live yourself:</span>
        <PhoneChip number={DEMO_PHONE} />
      </div>
    </section>
  );
}
