"use client";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = { playing: boolean; onToggle: () => void; className?: string };

export function PlayButton({ playing, onToggle, className }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause sample call" : "Play sample call"}
      className={cn(
        "relative h-14 w-14 rounded-full bg-primary text-on-primary flex items-center justify-center transition-transform duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100",
        className
      )}
    >
      {playing ? (
        <Pause aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Play aria-hidden="true" className="h-5 w-5 translate-x-0.5" />
      )}
    </button>
  );
}
