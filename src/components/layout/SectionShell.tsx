import { Kicker } from "@/components/primitives/Kicker";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  kicker?: { number?: string; label: string };
  heading: React.ReactNode;
  subhead?: React.ReactNode;
  children: React.ReactNode;
  spacing?: "deep" | "medium" | "slim";
  ariaLabelledBy?: string;
  ariaLabel?: string;
  className?: string;
};

const PADDING: Record<NonNullable<Props["spacing"]>, string> = {
  deep: "py-24 md:py-32",
  medium: "py-16 md:py-20",
  slim: "py-8 md:py-12",
};

export function SectionShell({
  id,
  kicker,
  heading,
  subhead,
  children,
  spacing = "deep",
  ariaLabelledBy,
  ariaLabel,
  className,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn("mx-auto max-w-page px-4", PADDING[spacing], className)}
    >
      {kicker && <Kicker number={kicker.number} label={kicker.label} />}
      <div className={cn(kicker && "mt-4")}>{heading}</div>
      {subhead && (
        <p className="mt-4 text-lg md:text-xl text-fg-muted max-w-prose leading-[1.55]">
          {subhead}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}
