"use client";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
};

export function Reveal({ children, delayMs = 0, className }: Props) {
  const [ref, state] = useScrollReveal<HTMLDivElement>();

  const baseClasses = "transition-[opacity,transform] ease-out";
  const hiddenClasses = "opacity-0 translate-y-4";
  const revealedClasses = "opacity-100 translate-y-0";
  const transitionDuration = state.instant ? "" : "duration-[480ms]";
  const focusOverride = "focus-within:opacity-100 focus-within:translate-y-0";

  return (
    <div
      ref={ref}
      style={delayMs && !state.instant ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={cn(
        baseClasses,
        transitionDuration,
        state.revealed ? revealedClasses : hiddenClasses,
        focusOverride,
        className
      )}
    >
      {children}
    </div>
  );
}
