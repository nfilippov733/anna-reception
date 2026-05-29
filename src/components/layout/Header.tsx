"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { Logo } from "@/components/primitives/Logo";
import { cn } from "@/lib/cn";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";
const DEMO_PHONE_HREF = `tel:${DEMO_PHONE.replace(/\s+/g, "")}`;

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
        <div className="flex items-center gap-2 sm:gap-3">
          <PhoneChip number={DEMO_PHONE} className="hidden sm:inline-flex" />
          {/* Mobile-only tap-to-call — the header is sticky, so the sample line
              stays one tap away throughout the page. */}
          <a
            href={DEMO_PHONE_HREF}
            aria-label={`Call the ANNA sample line on ${DEMO_PHONE}`}
            data-event="header_cta_call_clicked"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sage/40 text-ink transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:hidden"
          >
            <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
          </a>
          <Button href="/demo" data-event="header_cta_demo_clicked">
            Book a demo
          </Button>
        </div>
      </div>
    </header>
  );
}
