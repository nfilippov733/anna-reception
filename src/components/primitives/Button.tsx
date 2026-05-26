import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  "data-event"?: string;
};

const base =
  "inline-flex items-center justify-center min-h-[44px] px-5 rounded-full text-base font-medium transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary/90",
  ghost: "bg-transparent text-ink border border-ink/20 hover:border-ink/50",
};

export function Button({ children, variant = "primary", href, onClick, type = "button", className, ...rest }: ButtonProps) {
  const classes = cn(base, variants[variant], className);
  const event = rest["data-event"];
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} data-event={event}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes} data-event={event}>
      {children}
    </button>
  );
}
