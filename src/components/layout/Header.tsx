"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Logo } from "@/components/primitives/Logo";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Channels", href: "#channels" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

        <nav aria-label="Sections" className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-ink hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button href="/demo" data-event="header_cta_demo_clicked">
            Book a demo
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sage/40 text-ink transition-colors hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="md:hidden border-t border-sage/30 bg-bg px-4 py-2"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-ink hover:text-primary transition-colors border-b border-sage/20 last:border-0"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
