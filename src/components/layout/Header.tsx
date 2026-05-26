import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-page flex items-center justify-between px-4 py-3">
        <a href="/" className="text-lg font-semibold tracking-tight">
          ANNA Reception <span className="text-fg-muted font-normal">by ANNA</span>
        </a>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="hover:underline">How it works</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <a href="/sign-in" className="hover:underline">Sign in</a>
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
