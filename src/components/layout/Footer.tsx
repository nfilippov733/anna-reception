import { PhoneChip } from "@/components/primitives/PhoneChip";
import { Logo } from "@/components/primitives/Logo";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Footer() {
  return (
    <footer className="border-t border-sage/30 bg-cream mt-24">
      <div className="mx-auto max-w-page px-4 py-16 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <Logo variant="mark" />
          <div className="mt-4 font-semibold text-ink">ANNA Reception</div>
          <p className="mt-2 text-fg-muted">By ANNA — the business account 100,000+ UK businesses already use.</p>
          <PhoneChip number={DEMO_PHONE} className="mt-4" />
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-mono-label">Product</div>
          <ul className="mt-3 space-y-2 text-fg-muted">
            <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a></li>
            <li><a href="#verticals" className="hover:text-primary transition-colors">Verticals</a></li>
            <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
            <li><a href="/demo" className="hover:text-primary transition-colors">Book a demo</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-mono-label">Company</div>
          <ul className="mt-3 space-y-2 text-fg-muted">
            <li><a href="https://anna.money" className="hover:text-primary transition-colors">ANNA Money</a></li>
            <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-mono-label">Legal</div>
          <ul className="mt-3 space-y-2 text-fg-muted">
            <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy</a></li>
            <li><a href="/terms" className="hover:text-primary transition-colors">Terms</a></li>
          </ul>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-mono-label">
            UK GDPR · DPA 2018 · ICO registered · ISO 27001-aligned · PCI-compliant deposits via Stripe
          </p>
          <p className="mt-6 text-xs text-fg-muted">Absolute Financial Services Ltd. ANNA is a trading name. See anna.money for regulatory information.</p>
        </div>
      </div>
    </footer>
  );
}
