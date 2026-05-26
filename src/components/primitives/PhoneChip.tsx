import { Phone } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  number: string;
  className?: string;
};

export function PhoneChip({ number, className }: Props) {
  const href = `tel:${number.replace(/\s+/g, "")}`;
  return (
    <a
      href={href}
      aria-label={`Test call ANNA Reception on ${number}`}
      data-event="header_cta_call_clicked"
      className={cn(
        "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-bg text-ink border border-sage/40 hover:border-sage transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <Phone aria-hidden="true" className="h-4 w-4 text-primary" />
      <span className="tabular-nums font-mono text-sm">{number}</span>
    </a>
  );
}
