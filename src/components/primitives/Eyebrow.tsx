import { cn } from "@/lib/cn";

type Props = { children: string; className?: string };

export function Eyebrow({ children, className }: Props) {
  return (
    <p className={cn("font-mono text-xs uppercase tracking-[0.16em] text-sage", className)}>
      {children.toUpperCase()}
    </p>
  );
}
