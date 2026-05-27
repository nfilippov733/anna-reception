import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  icon: LucideIcon;
  label: string;
  size?: "sm" | "md";
  value?: string;
  className?: string;
};

export function ChannelChip({ icon: Icon, label, size = "md", value, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        size === "sm" ? "text-sm" : "text-base",
        className
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5", "text-sage shrink-0")}
      />
      <span className="text-ink">{label}</span>
      {value && (
        <span className="ml-auto font-mono text-xs tabular-nums text-mono-label">{value}</span>
      )}
    </span>
  );
}
