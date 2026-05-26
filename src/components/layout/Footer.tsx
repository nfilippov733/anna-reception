import { PhoneChip } from "@/components/primitives/PhoneChip";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-alt mt-24">
      <div className="mx-auto max-w-page px-4 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold">ANNA Reception</div>
          <p className="mt-2 text-fg-muted">By ANNA — the business account 100,000+ UK businesses already use.</p>
          <PhoneChip number={DEMO_PHONE} className="mt-4" />
        </div>
        <div>
          <div className="font-medium">Product</div>
          <ul className="mt-2 space-y-1 text-fg-muted">
            <li><a href="#how-it-works" className="hover:underline">How it works</a></li>
            <li><a href="#verticals" className="hover:underline">Verticals</a></li>
            <li><a href="#pricing" className="hover:underline">Pricing</a></li>
            <li><a href="/demo" className="hover:underline">Book a demo</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Company</div>
          <ul className="mt-2 space-y-1 text-fg-muted">
            <li><a href="https://anna.money" className="hover:underline">ANNA Money</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Legal</div>
          <ul className="mt-2 space-y-1 text-fg-muted">
            <li><a href="/privacy" className="hover:underline">Privacy</a></li>
            <li><a href="/terms" className="hover:underline">Terms</a></li>
            <li className="text-xs">Absolute Financial Services Ltd. ANNA is a trading name. FCA reference TBD.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
