"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";

type Props = {
  // Used by tests to control state; in production the component reads scroll itself.
  active?: boolean;
};

export function StickyDemoCTA({ active: forcedActive }: Props = {}) {
  const [active, setActive] = useState(forcedActive ?? false);

  useEffect(() => {
    if (forcedActive !== undefined) {
      setActive(forcedActive);
      return;
    }
    function onScroll() {
      // Hero ends at roughly 600px; engage sticky once user scrolls past it.
      setActive(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forcedActive]);

  return (
    <div
      data-testid="sticky-cta"
      data-active={active}
      className={cn(
        "fixed bottom-4 inset-x-4 z-30 md:hidden flex justify-center transition-transform duration-200 motion-reduce:transition-none",
        active ? "translate-y-0" : "translate-y-[200%]"
      )}
    >
      <Button href="/demo" className="shadow-lg" data-event="sticky_cta_demo_clicked">
        Book a demo
      </Button>
    </div>
  );
}
