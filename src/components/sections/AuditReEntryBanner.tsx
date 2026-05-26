import { LinkArrow } from "@/components/primitives/LinkArrow";

export function AuditReEntryBanner() {
  return (
    <section className="mx-auto max-w-page px-4">
      <div className="border-y border-sage/30 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-lg text-ink">Skipped the calculator? Get your free revenue audit emailed.</p>
        <LinkArrow href="/audit" data-event="hero_cta_audit_clicked">
          Get my free revenue audit
        </LinkArrow>
      </div>
    </section>
  );
}
