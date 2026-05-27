import Image from "next/image";
import {
  Hammer,
  Scissors,
  Stethoscope,
  Utensils,
  Dumbbell,
  PawPrint,
  type LucideIcon,
} from "lucide-react";
import type { VerticalKey } from "@/lib/verticals";
import { cn } from "@/lib/cn";

const ICONS: Record<VerticalKey, LucideIcon> = {
  dental: Stethoscope,
  beauty: Scissors,
  pubs: Utensils,
  construction: Hammer,
  fitness: Dumbbell,
  vet: PawPrint,
};

const ILLUSTRATION_BASENAMES: Record<VerticalKey, string> = {
  dental: "dental",
  beauty: "beauty",
  pubs: "gastro",
  construction: "trades",
  fitness: "fitness",
  vet: "vet",
};

type Props = {
  vertical: VerticalKey;
  variant?: "icon" | "illustration";
  className?: string;
};

export function VerticalMark({ vertical, variant = "icon", className }: Props) {
  if (variant === "illustration") {
    const basename = ILLUSTRATION_BASENAMES[vertical];
    return (
      <Image
        src={`/assets/redesign/${basename}.png`}
        alt=""
        width={96}
        height={96}
        aria-hidden="true"
        className={cn("h-12 w-12 object-contain", className)}
      />
    );
  }
  const Icon = ICONS[vertical];
  return (
    <Icon
      aria-hidden={true}
      strokeWidth={1.25}
      className={cn("h-12 w-12 text-primary", className)}
    />
  );
}
