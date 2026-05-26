import { cn } from "@/lib/cn";

type Props = { children: React.ReactNode; className?: string };

export function Tag({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 rounded-full border border-sage/40 font-mono text-xs tabular-nums text-mono-label",
        className
      )}
    >
      {children}
    </span>
  );
}
