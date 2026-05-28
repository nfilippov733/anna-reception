"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { Logo } from "@/components/primitives/Logo";
import { cn } from "@/lib/cn";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-sage/30 transition-[padding] duration-200 motion-reduce:transition-none",
        scrolled ? "py-2" : "py-3"
      )}
    >
      <div className="mx-auto max-w-page flex items-center justify-between px-4">
        <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-ink hover:text-primary transition-colors">How it works</a>
          <a href="#pricing" className="text-ink hover:text-primary transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <PhoneChip number={DEMO_PHONE} className="hidden sm:inline-flex" />
          <Button href="/demo" data-event="hero_cta_demo_clicked">
            Book a demo
          </Button>
        </div>
      </div>
    </header>
  );
}
