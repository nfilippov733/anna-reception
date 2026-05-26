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
        "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-bg-alt text-fg border border-border hover:border-fg/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <span aria-hidden="true">📞</span>
      <span className="tabular-nums">{number}</span>
    </a>
  );
}
