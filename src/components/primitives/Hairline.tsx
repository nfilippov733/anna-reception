import { cn } from "@/lib/cn";

type Props = { orientation?: "horizontal" | "vertical"; className?: string };

export function Hairline({ orientation = "horizontal", className }: Props) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-px bg-sage/30 self-stretch", className)}
      />
    );
  }
  return <hr className={cn("border-0 border-t border-sage/30 m-0", className)} />;
}
