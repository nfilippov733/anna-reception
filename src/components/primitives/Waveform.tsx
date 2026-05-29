"use client";
import { useEffect, useRef } from "react";

type Props = { playing: boolean };

const BAR_COUNT = 44;
const GAP = 7;
const VIEW_H = 56;

// Frozen, organic-looking silhouette so the resting state reads as a waveform,
// not a flat row of dots.
const IDLE = Array.from({ length: BAR_COUNT }, (_, i) => {
  const a = Math.abs(Math.sin(i * 0.5));
  const b = Math.abs(Math.sin(i * 0.17 + 1.3));
  return 6 + (a * 0.6 + b * 0.4) * 24;
});

export function Waveform({ playing }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const bars = svg.querySelectorAll<SVGRectElement>("rect");

    const resetToIdle = () => {
      bars.forEach((bar, i) => {
        const h = IDLE[i];
        bar.setAttribute("height", String(h));
        bar.setAttribute("y", String((VIEW_H - h) / 2));
      });
    };

    if (!playing) {
      resetToIdle();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const tick = () => {
      const t = Date.now();
      bars.forEach((bar, i) => {
        const a = Math.abs(Math.sin(t / 200 + i));
        const b = Math.abs(Math.sin(t / 530 + i * 0.7));
        const h = 8 + (a * 0.6 + b * 0.4) * (VIEW_H - 12);
        bar.setAttribute("height", String(h));
        bar.setAttribute("y", String((VIEW_H - h) / 2));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${BAR_COUNT * GAP} ${VIEW_H}`}
      className="h-14 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="anna-wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--anna-green))" stopOpacity="0.4" />
          <stop offset="50%" stopColor="hsl(var(--anna-green))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--anna-green))" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {IDLE.map((h, i) => (
        <rect
          key={i}
          x={i * GAP}
          y={(VIEW_H - h) / 2}
          width={3.5}
          height={h}
          rx={1.75}
          fill="url(#anna-wave)"
        />
      ))}
    </svg>
  );
}
