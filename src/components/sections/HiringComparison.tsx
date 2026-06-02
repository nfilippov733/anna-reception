"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { AnimatedNumber } from "@/components/primitives/AnimatedNumber";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

// ANNA's entry tier (Sole Trader, £99/mo) is the comparison anchor in both
// modes — the cheapest plan still beats a hire or a pay-per-call service.
const ANNA_SOLE_ANNUAL = 99 * 12;
// Employer NI + pension + holiday/sick cover + recruitment, amortised.
const LOADED_MULTIPLIER = 1.25;
// Typical UK pay-per-call answering service rate.
const SERVICE_PER_CALL = 1.2;

type Mode = "receptionist" | "service";

const ANNA_PROS = [
  "24/7/365 — every call, every night",
  "Books straight into your calendar",
  "Phone, WhatsApp, Instagram & web",
  "Flat monthly fee — never per-call",
];

const RECEPTIONIST_CONS = [
  "40 hrs/week · 9–5, Mon–Fri",
  "Nothing after hours or weekends",
  "Sick days, holidays, turnover",
  "Weeks to hire and train",
];

const SERVICE_CONS = [
  "Reads a script, takes a message",
  "Can't book into your calendar",
  "Phone only — no WhatsApp or DMs",
  "Per-call fees climb with volume",
];

export function HiringComparison() {
  const [mode, setMode] = useState<Mode>("receptionist");
  const [salary, setSalary] = useState(28000);
  const [calls, setCalls] = useState(150);

  const loaded = Math.round(salary * LOADED_MULTIPLIER);
  const serviceAnnual = Math.round(calls * SERVICE_PER_CALL * 12);
  const altCost = mode === "receptionist" ? loaded : serviceAnnual;
  const annaAnnual = ANNA_SOLE_ANNUAL;
  const annaPlan = "Sole Trader";
  const annaCaption = "£99/mo + VAT";
  const savings = Math.max(0, altCost - ANNA_SOLE_ANNUAL);

  const onSalary = (v: number) => {
    const clamped = Math.min(45000, Math.max(20000, v || 0));
    setSalary(clamped);
    track("hiring_comparison_changed", { salary: clamped });
  };
  const onCalls = (v: number) => {
    const clamped = Math.min(500, Math.max(20, v || 0));
    setCalls(clamped);
    track("hiring_comparison_changed", { salary: clamped });
  };

  const altLabel = mode === "receptionist" ? "In-house hire" : "Answering service";
  const altCaption =
    mode === "receptionist"
      ? "True cost incl. NI, pension, holiday & sick cover"
      : `At ~£1.20/call · ${calls} calls/month`;
  const altCons = mode === "receptionist" ? RECEPTIONIST_CONS : SERVICE_CONS;

  return (
    <section id="hiring" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="hiring-heading">
      <Kicker number="10" label="vs the alternatives" />
      <h2 id="hiring-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Cheaper than the front desk you&rsquo;d hire.
      </h2>
      <p className="mt-4 max-w-prose text-lg leading-[1.55] text-fg-muted">
        A front-desk hire answers 9–5. An answering service just takes a message. ANNA Reception answers
        everything, all the time — and actually books it.
      </p>

      {/* Mode toggle */}
      <div role="group" aria-label="Compare against" className="mt-8 inline-flex rounded-full border border-sage/40 p-1">
        {(["receptionist", "service"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              mode === m ? "bg-primary text-white" : "text-fg-muted hover:text-ink"
            )}
          >
            {m === "receptionist" ? "In-house hire" : "Answering service"}
          </button>
        ))}
      </div>

      {/* Input — salary or call volume */}
      <div className="mt-8">
        {mode === "receptionist" ? (
          <label className="block max-w-md">
            <span className="font-mono text-xs uppercase tracking-wider text-mono-label">
              A front-desk salary (£/year)
            </span>
            <input
              type="number"
              inputMode="numeric"
              aria-label="Front-desk salary per year"
              value={salary}
              min={20000}
              max={45000}
              step={1000}
              onChange={(e) => onSalary(Number(e.target.value))}
              className="mt-1 w-full border-0 border-b-2 border-sage/30 bg-transparent px-0 py-3 font-display text-3xl tabular-nums text-ink focus:border-primary focus:outline-none transition-colors"
            />
            <input
              type="range"
              aria-label="Front-desk salary slider"
              value={salary}
              min={20000}
              max={45000}
              step={1000}
              onChange={(e) => onSalary(Number(e.target.value))}
              className="mt-4 w-full accent-primary"
            />
          </label>
        ) : (
          <label className="block max-w-md">
            <span className="font-mono text-xs uppercase tracking-wider text-mono-label">
              Calls a month
            </span>
            <input
              type="number"
              inputMode="numeric"
              aria-label="Calls per month"
              value={calls}
              min={20}
              max={500}
              step={10}
              onChange={(e) => onCalls(Number(e.target.value))}
              className="mt-1 w-full border-0 border-b-2 border-sage/30 bg-transparent px-0 py-3 font-display text-3xl tabular-nums text-ink focus:border-primary focus:outline-none transition-colors"
            />
            <input
              type="range"
              aria-label="Calls per month slider"
              value={calls}
              min={20}
              max={500}
              step={10}
              onChange={(e) => onCalls(Number(e.target.value))}
              className="mt-4 w-full accent-primary"
            />
          </label>
        )}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* The alternative */}
        <div className="rounded-2xl border border-sage-mute p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-mono-label">{altLabel}</p>
          <p className="mt-2 font-display text-display-md leading-none tabular-nums text-leak">
            <AnimatedNumber value={altCost} format="gbp" />
            <span className="text-base text-fg-muted">/yr</span>
          </p>
          <p className="mt-2 text-xs text-fg-muted">{altCaption}</p>
          <ul className="mt-6 space-y-2">
            {altCons.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-ink">
                <X aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leak" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ANNA */}
        <div className="rounded-2xl border-2 border-primary bg-cream-deep p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-ink">ANNA Reception · {annaPlan}</p>
          <p className="mt-2 font-display text-display-md leading-none tabular-nums text-ink">
            <AnimatedNumber value={annaAnnual} format="gbp" />
            <span className="text-base text-fg-muted">/yr + VAT</span>
          </p>
          <p className="mt-2 text-xs text-fg-muted">{annaCaption} · no contract · cancel anytime</p>
          <ul className="mt-6 space-y-2">
            {ANNA_PROS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-ink">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        {mode === "receptionist" ? (
          <p className="font-display text-2xl text-ink">
            You save <AnimatedNumber value={savings} format="gbp" className="text-primary" />
            <span className="text-fg-muted"> /year — and never miss a call.</span>
          </p>
        ) : savings > 0 ? (
          <p className="max-w-xl font-display text-2xl text-ink">
            You save <AnimatedNumber value={savings} format="gbp" className="text-primary" />
            <span className="text-fg-muted"> /year — and ANNA books the appointment, not just a message.</span>
          </p>
        ) : (
          <p className="max-w-xl font-display text-2xl text-ink">
            <span className="text-primary">ANNA books the appointment</span>
            <span className="text-fg-muted"> — flat £99/mo, no per-call fees, on every channel.</span>
          </p>
        )}
        <Button href="/demo" data-event="pricing_teaser_clicked" onClick={() => track("pricing_teaser_clicked")}>
          Book a demo
        </Button>
      </div>
    </section>
  );
}
