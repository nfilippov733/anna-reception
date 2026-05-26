import { cn } from "@/lib/cn";

type Props = { variant?: "full" | "mark"; className?: string };

export function Logo({ variant = "full", className }: Props) {
  return (
    <span
      role="img"
      aria-label="ANNA Reception, by ANNA"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-primary" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 22 L13 10 L17 22 M10.5 18 H15.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 22 V10 H22 a3 3 0 0 1 0 6 H19 M20.5 16 L23 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {variant === "full" && (
        <span className="text-lg font-semibold tracking-tight text-ink">
          ANNA Reception <span className="text-sage font-normal">by ANNA</span>
        </span>
      )}
    </span>
  );
}
