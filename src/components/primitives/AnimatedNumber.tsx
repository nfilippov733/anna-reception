"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  format: "gbp" | "int";
  className?: string;
  durationMs?: number;
};

function formatValue(v: number, format: "gbp" | "int"): string {
  if (format === "gbp") {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(v);
  }
  return new Intl.NumberFormat("en-GB").format(Math.round(v));
}

export function AnimatedNumber({ value, format, className, durationMs = 360 }: Props) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const startVal = from.current;
    const delta = value - startVal;
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - pct, 3); // ease-out cubic
      setDisplay(startVal + delta * eased);
      if (pct < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return (
    <span className={cn("tabular-nums", className)} aria-live="polite">
      {formatValue(display, format)}
    </span>
  );
}
