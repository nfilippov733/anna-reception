import {
  Clock,
  CalendarDays,
  MessageSquareText,
  Repeat2,
  CreditCard,
  Puzzle,
} from "lucide-react";
import { cn } from "@/lib/cn";

export const FEATURE_ICONS = {
  "answer-24-7": Clock,
  "calendar": CalendarDays,
  "sms": MessageSquareText,
  "transfer": Repeat2,
  "deposit": CreditCard,
  "integrations": Puzzle,
} as const;

export type FeatureIconName = keyof typeof FEATURE_ICONS;

type Props = { name: FeatureIconName; className?: string };

export function FeatureIcon({ name, className }: Props) {
  const Icon = FEATURE_ICONS[name];
  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.5}
      className={cn("h-8 w-8 text-primary", className)}
    />
  );
}
