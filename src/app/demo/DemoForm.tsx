"use client";
import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { track } from "@/lib/analytics";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { VERTICALS } from "@/content/verticals";

type Props = { initialSegment: VerticalKey | null };

export function DemoForm({ initialSegment }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [segment, setSegment] = useState<VerticalKey | "">(initialSegment ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    track("demo_form_submitted", {
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
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Booked</p>
        <p className="mt-3 font-display text-2xl text-ink">We&apos;ll be in touch within the hour.</p>
        <p className="mt-3 text-fg-muted">
          Check your email for the calendar invite. Your demo will run for under three minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <div>
        <label htmlFor="name" className="block font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-md border border-sage/40 bg-bg px-4 py-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="business" className="block font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Business name
        </label>
        <input
          id="business"
          name="business"
          type="text"
          required
          autoComplete="organization"
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
        <Button type="submit" data-event="demo_form_submit_click">
          Book my demo
        </Button>
      </div>
    </form>
  );
}
