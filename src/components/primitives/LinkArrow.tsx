import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  href: string;
  className?: string;
  "data-event"?: string;
};

export function LinkArrow({ children, href, className, ...rest }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-ink underline decoration-sage/60 underline-offset-4 hover:text-primary hover:decoration-primary/60 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm",
        className
      )}
      data-event={rest["data-event"]}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
