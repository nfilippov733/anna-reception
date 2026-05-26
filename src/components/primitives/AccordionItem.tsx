"use client";
import { useId, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
};

export function AccordionItem({ title, children, defaultOpen = false, onToggle, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const headerRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      onToggle?.(false);
      headerRef.current?.focus();
    }
  }

  return (
    <div className={cn("border-b border-sage/30", className)} onKeyDown={handleKey}>
      <button
        ref={headerRef}
        id={`${id}-header`}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={handleClick}
        className="flex w-full items-center justify-between py-4 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="font-medium text-ink">{title}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-5 w-5 text-mono-label transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-header`}
        hidden={!open}
        className="pb-4 text-fg-muted"
      >
        {children}
      </div>
    </div>
  );
}
