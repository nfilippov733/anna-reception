export const metadata = {
  title: "Privacy — ANNA Reception",
  description: "ANNA Reception privacy policy.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Privacy</p>
      <h1 className="mt-4 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance">
        Privacy.
      </h1>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        ANNA Reception is a product of Absolute Financial Services Ltd, trading as ANNA. Our processing of personal data is governed by the ANNA group privacy policy.
      </p>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Read the full policy at <a href="https://anna.money/privacy-policy" className="text-primary underline-offset-4 hover:underline">anna.money/privacy-policy</a>.
      </p>
      <h2 className="mt-12 font-display text-2xl text-ink">Call data</h2>
      <p className="mt-4 text-fg-muted max-w-prose leading-[1.55]">
        Conversation data captured by ANNA Reception (call recordings, transcripts, SMS confirmations) is stored encrypted on UK-resident infrastructure. You control retention from the dashboard. We do not sell or share conversation data with third parties for marketing.
      </p>
      <h2 className="mt-12 font-display text-2xl text-ink">Compliance</h2>
      <p className="mt-4 text-fg-muted max-w-prose leading-[1.55]">
        UK GDPR · Data Protection Act 2018 · ISO 27001-aligned. PCI-compliant deposit handling via Stripe.
      </p>
    </section>
  );
}
