import { Button } from "@/components/primitives/Button";

export function AuditReEntryBanner() {
  return (
    <section className="mx-auto max-w-page px-4">
      <div className="rounded-2xl bg-bg-alt border border-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-lg">Skipped the calculator? Get your free revenue audit emailed.</p>
        <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
      </div>
    </section>
  );
}
