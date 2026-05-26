import { cn } from "@/lib/cn";

type Props = { number?: string; label: string; className?: string };

export function Kicker({ number, label, className }: Props) {
  return (
    <p
      aria-hidden="true"
      className={cn("font-mono text-xs uppercase tracking-[0.18em] text-mono-label", className)}
    >
      {number ? `${number} — ${label.toUpperCase()}` : label.toUpperCase()}
    </p>
  );
}
