import { Button } from "@/components/primitives/Button";

export const metadata = {
  title: "About ANNA Reception — by ANNA",
  description: "ANNA Reception is the always-on front desk for UK SMBs, by the team behind ANNA — the business account 100,000+ businesses use.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">About</p>
      <h1 className="mt-4 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance">
        Built by the team behind ANNA.
      </h1>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        ANNA Reception is the always-on front desk for UK small businesses — built by the same team behind <a href="https://anna.money" className="text-primary underline-offset-4 hover:underline">ANNA</a>, the business account used by 100,000+ UK SMBs.
      </p>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        We answer every call, return every web lead, and chase every dormant quote — across phone, WhatsApp, and DMs. So you can do the work that pays.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/demo" data-event="about_cta_demo_clicked">Book a demo</Button>
        <Button variant="ghost" href="/#roi" data-event="about_cta_audit_clicked">See your revenue leak</Button>
      </div>
    </section>
  );
}
