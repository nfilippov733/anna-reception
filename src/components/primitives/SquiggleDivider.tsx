import { cn } from "@/lib/cn";

type Props = { className?: string };

export function SquiggleDivider({ className }: Props) {
  return (
    <div aria-hidden="true" className={cn("my-0 flex justify-center", className)}>
      <svg
        viewBox="0 0 240 16"
        className="w-48 text-sage/40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 8 C 20 0, 40 16, 60 8 S 100 0, 120 8 S 160 16, 180 8 S 220 0, 240 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
