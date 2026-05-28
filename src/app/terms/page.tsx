export const metadata = {
  title: "Terms — ANNA Reception",
  description: "ANNA Reception terms of service.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Terms</p>
      <h1 className="mt-4 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance">
        Terms of service.
      </h1>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        ANNA Reception is provided by Absolute Financial Services Ltd, trading as ANNA. Service terms are governed by the ANNA group customer agreement.
      </p>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Read the full customer agreement at <a href="https://anna.money/terms-and-conditions" className="text-primary underline-offset-4 hover:underline">anna.money/terms-and-conditions</a>.
      </p>
      <h2 className="mt-12 font-display text-2xl text-ink">Service summary</h2>
      <ul className="mt-4 space-y-3 text-fg-muted max-w-prose leading-[1.55]">
        <li>· From £99/month. No long contracts. Cancel anytime from the dashboard.</li>
        <li>· Pricing tiered by call volume — see the <a href="/#pricing" className="text-primary underline-offset-4 hover:underline">pricing section</a>.</li>
        <li>· Two months&apos; notice for material changes to the service.</li>
        <li>· Disputes governed by the law of England and Wales.</li>
      </ul>
    </section>
  );
}
