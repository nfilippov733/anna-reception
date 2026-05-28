"use client";
import { useRef, useState } from "react";
import { Waveform } from "@/components/primitives/Waveform";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { PlayButton } from "@/components/primitives/PlayButton";
import { CHANNEL_DEMOS } from "@/content/channelDemos";
import type { VerticalKey } from "@/lib/verticals";
import { track } from "@/lib/analytics";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";
const GENERIC_AUDIO_SRC = process.env.NEXT_PUBLIC_GENERIC_AUDIO_SRC ?? "";

type Props = { segment: VerticalKey };

export function PhoneDemoPanel({ segment }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const thread = CHANNEL_DEMOS[segment].phone;
  const lastTurn = thread[thread.length - 1];
  const meta = lastTurn?.meta ?? "";
  const hasAudio = GENERIC_AUDIO_SRC.length > 0;

  function togglePlay() {
    if (!hasAudio) return;
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
      <div className="rounded-2xl border border-sage/40 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <PlayButton
            playing={playing}
            onToggle={hasAudio ? togglePlay : () => {}}
          />
          <Waveform playing={playing} />
        </div>
        {hasAudio && (
          <audio
            ref={ref}
            src={GENERIC_AUDIO_SRC}
            preload="metadata"
            onEnded={() => {
              setPlaying(false);
              track("audio_demo_completed_30s");
            }}
          />
        )}
        <div className="mt-6 border-t border-sage/30 pt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-mono-label">
            Sample transcript
          </p>
          <dl className="mt-4 space-y-3 max-w-prose">
            {thread.map((turn, i) => (
              <div key={i}>
                <dt className="font-mono text-xs tracking-wider uppercase text-mono-label">
                  {turn.from === "caller" ? "Caller" : <span className="text-primary">ANNA</span>}
                </dt>
                <dd className="mt-1 text-ink">{turn.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-mono-label">
            {meta}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-fg-muted">
        <span>Or hear her live yourself:</span>
        <PhoneChip number={DEMO_PHONE} />
      </div>
    </div>
  );
}
