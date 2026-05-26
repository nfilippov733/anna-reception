import { Hammer, Scissors, Stethoscope, Utensils, type LucideIcon } from "lucide-react";
import type { VerticalKey } from "@/lib/verticals";
import { cn } from "@/lib/cn";

const ICONS: Record<VerticalKey, LucideIcon> = {
  dental: Stethoscope,
  beauty: Scissors,
  pubs: Utensils,
  construction: Hammer,
};

type Props = { vertical: VerticalKey; className?: string };

export function VerticalMark({ vertical, className }: Props) {
  const Icon = ICONS[vertical];
  return (
    <Icon
      aria-hidden={true}
      strokeWidth={1.25}
      className={cn("h-12 w-12 text-primary", className)}
    />
  );
}
