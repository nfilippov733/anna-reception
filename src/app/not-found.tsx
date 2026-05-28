import { Button } from "@/components/primitives/Button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">404</p>
      <h1 className="mt-4 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance">
        That call didn&apos;t connect.
      </h1>
      <p className="mt-6 text-lg text-fg-muted max-w-prose leading-[1.55]">
        The page you tried to reach doesn&apos;t exist. Head back to the front desk — ANNA can take it from here.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/" data-event="not_found_home_clicked">Back to home</Button>
        <Button variant="ghost" href="/demo" data-event="not_found_demo_clicked">Book a demo</Button>
      </div>
    </section>
  );
}
