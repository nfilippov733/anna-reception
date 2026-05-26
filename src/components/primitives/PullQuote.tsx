import { cn } from "@/lib/cn";

type Props = {
  quote: string;
  attribution: string;
  role: string;
  business: string;
  metric: string;
  className?: string;
};

export function PullQuote({ quote, attribution, role, business, metric, className }: Props) {
  return (
    <figure className={cn("relative pl-10 md:pl-14", className)}>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 font-display italic text-sage text-6xl md:text-7xl leading-none select-none"
      >
        &ldquo;
      </span>
      <blockquote className="font-display italic text-display-md text-ink leading-tight">
        {quote}
      </blockquote>
      <figcaption className="mt-6">
        <div className="text-base font-medium text-ink">{attribution}</div>
        <div className="text-sm text-fg-muted">
          {role} · {business}
        </div>
        <div className="mt-2 font-mono text-xs tabular-nums text-primary">{metric}</div>
      </figcaption>
    </figure>
  );
}
