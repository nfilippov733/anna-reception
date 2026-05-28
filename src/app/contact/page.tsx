import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export const metadata = {
  title: "Contact — ANNA Reception",
  description: "Get in touch with ANNA Reception. Book a demo, call us, or request a revenue audit.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Contact</p>
      <h1 className="mt-4 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance">
        Talk to us.
      </h1>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        The fastest way to see ANNA in action is a three-minute demo with your menu and your booking system.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        <PhoneChip number={DEMO_PHONE} />
        <p className="text-sm text-fg-muted">Mon–Fri 9:00–18:00 UK</p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/demo" data-event="contact_cta_demo_clicked">Book a demo</Button>
        <Button variant="ghost" href="/audit" data-event="contact_cta_audit_clicked">Get my free revenue audit</Button>
      </div>
      <p className="mt-16 text-sm text-fg-muted">
        For corporate enquiries, see <a href="https://anna.money" className="text-primary underline-offset-4 hover:underline">anna.money</a>.
      </p>
    </section>
  );
}
