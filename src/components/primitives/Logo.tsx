import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = { variant?: "full" | "mark"; className?: string };

export function Logo({ variant = "full", className }: Props) {
  return (
    <span
      role="img"
      aria-label="Reception, by ANNA"
      className={cn("inline-flex items-center gap-2", className)}
    >
      {variant === "full" ? (
        <span className="inline-flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight text-ink">Reception</span>
          <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
            by
            <Image
              src="/assets/brand/anna-wordmark.svg"
              alt="ANNA"
              width={44}
              height={16}
              className="h-3.5 w-auto"
            />
          </span>
        </span>
      ) : (
        <Image
          src="/assets/brand/anna-wordmark.svg"
          alt="ANNA"
          width={88}
          height={32}
          className="h-6 w-auto"
        />
      )}
    </span>
  );
}
