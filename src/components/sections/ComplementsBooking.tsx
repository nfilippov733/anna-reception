import { PhoneIncoming, CalendarCheck, Check, X, ArrowRight } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker";
import { INTEGRATION_LOGOS } from "@/content/integrations";

const SYSTEM_DOES = [
  { ok: true, text: "Online self-service bookings" },
  { ok: true, text: "Reminders & payments" },
  { ok: false, text: "Doesn't answer the phone at 11pm" },
  { ok: false, text: "Doesn't reply to WhatsApp or DMs" },
  { ok: false, text: "Doesn't chase no-shows or dormant quotes" },
];

const ANNA_DOES = [
  { ok: true, text: "Answers every call, WhatsApp & DM — 24/7" },
  { ok: true, text: "Triages, then books into the system you already use" },
  { ok: true, text: "Chases no-shows and dormant quotes" },
  { ok: true, text: "Catches the callers who'll never use an app" },
];

export function ComplementsBooking() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="complements-heading">
      <Kicker number="09" label="Works with your booking system" />
      <h2 id="complements-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Keeps your booking system. Answers everything it can&rsquo;t.
      </h2>
      <p className="mt-4 max-w-prose text-lg leading-[1.55] text-fg-muted">
        Fresha, Dentally, OpenTable, Mindbody — they take the bookings people make online. They don&rsquo;t
        answer the phone, reply to a DM, or chase. ANNA does — and writes every booking straight back into
        the system you already run.
      </p>

      {/* Flow: where the bookings come from → ANNA → your system */}
      <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-sage/40 px-4 py-3">
          <PhoneIncoming className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="text-sm text-ink">Calls · WhatsApp · Instagram · web chat</span>
        </div>
        <ArrowRight className="mx-auto h-5 w-5 shrink-0 rotate-90 text-mono-label sm:rotate-0" aria-hidden="true" />
        <div className="flex flex-1 items-center gap-3 rounded-xl border-2 border-primary bg-cream-deep px-4 py-3">
          <span className="font-medium text-ink">ANNA answers &amp; books</span>
        </div>
        <ArrowRight className="mx-auto h-5 w-5 shrink-0 rotate-90 text-mono-label sm:rotate-0" aria-hidden="true" />
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-sage/40 px-4 py-3">
          <CalendarCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="text-sm text-ink">Your calendar / PMS</span>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-sage-mute p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-mono-label">Your booking system</p>
          <p className="mt-2 text-ink">Great at self-service.</p>
          <ul className="mt-6 space-y-2">
            {SYSTEM_DOES.map((item) => (
              <li key={item.text} className="flex items-start gap-2 text-sm text-ink">
                {item.ok ? (
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <X aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leak" />
                )}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-cream-deep p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-ink">ANNA, your front desk</p>
          <p className="mt-2 text-ink">Great at everyone who doesn&rsquo;t self-serve.</p>
          <ul className="mt-6 space-y-2">
            {ANNA_DOES.map((item) => (
              <li key={item.text} className="flex items-start gap-2 text-sm text-ink">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 font-display text-2xl text-ink text-balance">
        ANNA is the front desk — <span className="text-fg-muted">not another booking page.</span>
      </p>

      <div className="mt-12 border-t border-sage/30 pt-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Works with the tools you already use · 200+ integrations
        </p>
        <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          {INTEGRATION_LOGOS.map((l) => (
            <li
              key={l.name}
              className="inline-flex h-8 items-center rounded-full border border-sage/40 px-3 font-mono text-xs tracking-wide text-ink"
            >
              {l.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
