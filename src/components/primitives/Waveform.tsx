"use client";
import { useEffect, useRef } from "react";

type Props = { playing: boolean };

const BAR_COUNT = 32;

export function Waveform({ playing }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!playing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const svg = ref.current;
    if (!svg) return;
    const bars = svg.querySelectorAll<SVGRectElement>("rect");
    let raf = 0;
    function tick() {
      bars.forEach((bar, i) => {
        const a = Math.abs(Math.sin(Date.now() / 200 + i));
        const b = Math.abs(Math.sin(Date.now() / 530 + i * 0.7));
        const h = 8 + (a * 0.65 + b * 0.35) * 24;
        bar.setAttribute("height", String(h));
        bar.setAttribute("y", String((40 - h) / 2));
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <svg ref={ref} viewBox={`0 0 ${BAR_COUNT * 6} 40`} className="w-full h-12" aria-hidden="true">
      <defs>
        <linearGradient id="anna-wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--anna-green))" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(var(--anna-green))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--anna-green))" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <rect key={i} x={i * 6} y={16} width={4} height={8} rx={2} fill="url(#anna-wave)" />
      ))}
    </svg>
  );
}
