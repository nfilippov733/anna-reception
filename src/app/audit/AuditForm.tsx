"use client";
import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { track } from "@/lib/analytics";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { VERTICALS } from "@/content/verticals";

type Props = { initialSegment: VerticalKey | null };

export function AuditForm({ initialSegment }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [segment, setSegment] = useState<VerticalKey | "">(initialSegment ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    track("audit_form_submitted", {
      segment: (data.get("segment") as string) || "",
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-10 rounded-2xl border border-sage/40 bg-cream-deep p-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Audit on its way</p>
        <p className="mt-3 font-display text-2xl text-ink">Your audit is being prepared.</p>
        <p className="mt-3 text-fg-muted">
          We&apos;ll email a £-amount and the exact calls we&apos;d recover within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <div>
        <label htmlFor="website" className="block font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Your business website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          required
          placeholder="https://"
          autoComplete="url"
          className="mt-2 w-full rounded-md border border-sage/40 bg-bg px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-md border border-sage/40 bg-bg px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="missedPct" className="block font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Roughly what % of calls do you miss?
        </label>
        <input
          id="missedPct"
          name="missedPct"
          type="number"
          min="0"
          max="100"
          required
          placeholder="e.g. 30"
          className="mt-2 w-full rounded-md border border-sage/40 bg-bg px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="segment" className="block font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Your industry
        </label>
        <select
          id="segment"
          name="segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value as VerticalKey | "")}
          required
          className="mt-2 w-full rounded-md border border-sage/40 bg-bg px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Pick one&hellip;</option>
          {VERTICAL_KEYS.map((k) => (
            <option key={k} value={k}>
              {VERTICALS[k].label}
            </option>
          ))}
        </select>
      </div>
      <div className="pt-2">
        <Button type="submit" data-event="audit_form_submit_click">
          Get my audit
        </Button>
      </div>
    </form>
  );
}
