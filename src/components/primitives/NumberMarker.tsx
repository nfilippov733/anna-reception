import { cn } from "@/lib/cn";

type Props = { children: React.ReactNode; tone?: "primary" | "leak"; className?: string };

export function NumberMarker({ children, tone = "primary", className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "font-display italic text-display-md tabular-nums leading-none",
        tone === "leak" ? "text-leak" : "text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
