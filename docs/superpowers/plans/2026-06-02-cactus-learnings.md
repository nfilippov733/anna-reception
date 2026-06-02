# Cactus-Learnings Landing Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an honest, drop-in-ready "Call ANNA" call-in section, gently tighten the page (15→14 sections by merging two untested sections), and polish the illustrative testimonials — without changing any tested component's behaviour.

**Architecture:** Approach A (additive + safe merges). New `HearAnna` section is self-contained. `IntegrationsMarquee` folds into `ComplementsBooking`; `SocialProofLogos` folds into `TestimonialWall`; both originals are deleted. `page.tsx` is reordered and Kicker numbers are renumbered to stay sequential. Tested components are only reordered or have a one-token Kicker/`id` edit (verified to have no test assertion on those).

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind, lucide-react icons, Vitest + Testing Library.

**Branch:** `feat/cactus-learnings` (already created; do not deploy). Baseline is green (44 test files, 166 tests pass).

**Spec:** `docs/superpowers/specs/2026-06-02-cactus-learnings-design.md`

---

## File Structure

- Create: `src/components/sections/HearAnna.tsx` — new call-in section.
- Create: `src/components/sections/HearAnna.test.tsx` — its tests.
- Create: `src/components/sections/ComplementsBooking.test.tsx` — lock the integrations merge.
- Create: `src/components/sections/TestimonialWall.test.tsx` — lock the stats merge + avatar.
- Modify: `src/lib/analytics.ts` — add `hear_anna_cta_clicked` event to the union.
- Modify: `src/components/sections/ChannelDemos.tsx` — add `id="channel-demos"`; Kicker `06`→`04`.
- Modify: `src/components/sections/SegmentsShowcase.tsx` — Kicker `04`→`05`.
- Modify: `src/components/sections/OutcomeStrip.tsx` — Kicker `05`→`06`.
- Modify: `src/components/sections/ComplementsBooking.tsx` — fold integrations chips; Kicker `10`→`09`.
- Modify: `src/components/sections/HiringComparison.tsx` — Kicker `11`→`10`.
- Modify: `src/components/sections/TestimonialWall.tsx` — fold stats strip + avatars; Kicker `09`→`11`.
- Modify: `src/app/page.tsx` — new imports + render order.
- Delete: `src/components/sections/IntegrationsMarquee.tsx`.
- Delete: `src/components/sections/SocialProofLogos.tsx`.

Final render order (content sections): Hero(01) · ChannelsRibbon(02) · **HearAnna(03)** · ChannelDemos(04) · SegmentsShowcase(05) · OutcomeStrip(06) · RoiCalculator(07) · HowItWorks(08) · ComplementsBooking(09) · HiringComparison(10) · TestimonialWall(11) · PricingTeaser(12) · FaqAccordion(13) · FinalCtaBanner(14). `SquiggleDivider` sits between OutcomeStrip and RoiCalculator.

---

## Task 1: Add the HearAnna analytics event

**Files:**
- Modify: `src/lib/analytics.ts`

- [ ] **Step 1: Add the event to the union**

In `src/lib/analytics.ts`, add a new member to the `AnalyticsEvent` union (place it right after the `hero_cta_audit_clicked` line):

```ts
  | { event: "hear_anna_cta_clicked" }
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat(analytics): add hear_anna_cta_clicked event"
```

---

## Task 2: HearAnna component (TDD)

**Files:**
- Create: `src/components/sections/HearAnna.test.tsx`
- Create: `src/components/sections/HearAnna.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/HearAnna.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HearAnna } from "./HearAnna";

describe("HearAnna", () => {
  it("renders the heading", () => {
    render(<HearAnna />);
    expect(screen.getByRole("heading", { level: 2, name: /Call ANNA/i })).toBeInTheDocument();
  });

  it("shows an honest 'launching soon' state, not a fake number", () => {
    render(<HearAnna />);
    expect(screen.getByText(/launching soon/i)).toBeInTheDocument();
    // No tel: link is rendered while the demo line is unset.
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
  });

  it("links the demo CTA and the sample-call anchor", () => {
    render(<HearAnna />);
    expect(screen.getByRole("link", { name: /Book a demo/i })).toHaveAttribute("href", "/demo");
    expect(screen.getByRole("link", { name: /hear a sample call/i })).toHaveAttribute(
      "href",
      "#channel-demos"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections/HearAnna.test.tsx`
Expected: FAIL — cannot resolve `./HearAnna`.

- [ ] **Step 3: Write the component**

Create `src/components/sections/HearAnna.tsx`:

```tsx
"use client";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";

// Set to the live demo number (e.g. "+44 20 1234 5678") once the AI call-in
// line is ready. Until then the card renders an honest "launching soon" state —
// never a fake number.
const DEMO_LINE: string | null = null;

export function HearAnna() {
  return (
    <section
      id="hear-anna"
      className="mx-auto max-w-page px-4 py-24 md:py-32"
      aria-labelledby="hear-anna-heading"
    >
      <Kicker number="03" label="Hear it yourself" />
      <h2
        id="hear-anna-heading"
        className="mt-6 font-display text-display-lg text-ink text-balance"
      >
        Call ANNA. Hear it for yourself.
      </h2>
      <p className="mt-4 max-w-prose text-lg leading-[1.55] text-fg-muted">
        The fastest way to judge a front desk is to ring it. A live line where you can call
        ANNA and book a test appointment is launching soon.
      </p>

      <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-sage/40 bg-cream-deep p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PhoneCall className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            {DEMO_LINE ? (
              <a
                href={`tel:${DEMO_LINE.replace(/\s+/g, "")}`}
                className="rounded-sm font-display text-3xl tabular-nums text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-event="hear_anna_cta_clicked"
                onClick={() => track("hear_anna_cta_clicked")}
              >
                {DEMO_LINE}
              </a>
            ) : (
              <p className="font-display text-2xl text-ink" aria-disabled="true">
                Live demo line — launching soon
              </p>
            )}
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
              Book a demo to hear ANNA on your own site today
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            href="/demo"
            data-event="hear_anna_cta_clicked"
            onClick={() => track("hear_anna_cta_clicked")}
          >
            Book a demo
          </Button>
          <a
            href="#channel-demos"
            className="font-mono text-xs uppercase tracking-[0.18em] text-mono-label hover:text-primary"
          >
            Or hear a sample call ↓
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/sections/HearAnna.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HearAnna.tsx src/components/sections/HearAnna.test.tsx
git commit -m "feat(hear-anna): honest, placeholder-ready call-in section"
```

---

## Task 3: Wire HearAnna into the page, add ChannelDemos anchor id, reorder

**Files:**
- Modify: `src/components/sections/ChannelDemos.tsx:78-82` (add `id`, Kicker `06`→`04`)
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Confirm the ChannelDemos test does not assert the section id or kicker**

Run: `grep -n "channel-demos\b\|aria-labelledby\|Channel demos\|\"06\"\|\"04\"" src/components/sections/ChannelDemos.test.tsx`
Expected: no matches (the test asserts tabs/CTAs/analytics only). If any match appears, stop and reconcile before editing.

- [ ] **Step 2: Add the anchor id and renumber the kicker on ChannelDemos**

In `src/components/sections/ChannelDemos.tsx`, change the `<section>` open tag and the Kicker:

```tsx
    <section
      id="channel-demos"
      className="mx-auto max-w-page px-4 py-16 md:py-20"
      aria-labelledby="channel-demos-heading"
    >
      <Kicker number="04" label="Channel demos" />
```

- [ ] **Step 3: Rewrite page.tsx render order and imports**

In `src/app/page.tsx`, remove the `SocialProofLogos` and `IntegrationsMarquee` imports, add the `HearAnna` import, and replace the JSX body. The import block becomes:

```tsx
import { Hero } from "@/components/sections/Hero";
import { ChannelsRibbon } from "@/components/sections/ChannelsRibbon";
import { HearAnna } from "@/components/sections/HearAnna";
import { ChannelDemos } from "@/components/sections/ChannelDemos";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SegmentsShowcase } from "@/components/sections/SegmentsShowcase";
import { TestimonialWall } from "@/components/sections/TestimonialWall";
import { OutcomeStrip } from "@/components/sections/OutcomeStrip";
import { ComplementsBooking } from "@/components/sections/ComplementsBooking";
import { HiringComparison } from "@/components/sections/HiringComparison";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { SquiggleDivider } from "@/components/primitives/SquiggleDivider";
import { readVerticalFromUrl } from "@/lib/urlParams";
import type { VerticalKey } from "@/lib/verticals";
```

The returned JSX becomes:

```tsx
  return (
    <>
      <Hero initialSegment={initialVerticalFromUrl ?? undefined} />
      <ChannelsRibbon />
      <HearAnna />
      <ChannelDemos initialSegment={initialVertical} />
      <SegmentsShowcase initialSegment={initialVertical} />
      <OutcomeStrip />
      <SquiggleDivider />
      <RoiCalculator initialVertical={initialVertical} />
      <HowItWorks />
      <ComplementsBooking />
      <HiringComparison />
      <TestimonialWall />
      <PricingTeaser />
      <FaqAccordion />
      <FinalCtaBanner />
    </>
  );
```

(Leave the `HomePage` function signature, `params`, `fakeUrl`, `initialVerticalFromUrl`, and `initialVertical` lines unchanged.)

- [ ] **Step 4: Verify ChannelDemos tests still pass**

Run: `npx vitest run src/components/sections/ChannelDemos.test.tsx`
Expected: PASS (all tests).

- [ ] **Step 5: Typecheck (page.tsx no longer references deleted-soon imports)**

Run: `npx tsc --noEmit`
Expected: no errors. (The old section files still exist at this point; they are simply no longer imported.)

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/sections/ChannelDemos.tsx
git commit -m "feat(page): insert HearAnna, reorder sections, add #channel-demos anchor"
```

---

## Task 4: Merge IntegrationsMarquee into ComplementsBooking

**Files:**
- Create: `src/components/sections/ComplementsBooking.test.tsx`
- Modify: `src/components/sections/ComplementsBooking.tsx`
- Delete: `src/components/sections/IntegrationsMarquee.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/ComplementsBooking.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ComplementsBooking } from "./ComplementsBooking";

describe("ComplementsBooking", () => {
  it("keeps its headline", () => {
    render(<ComplementsBooking />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Keeps your booking system/i })
    ).toBeInTheDocument();
  });

  it("shows the folded-in integrations strip", () => {
    render(<ComplementsBooking />);
    expect(screen.getByText(/Works with the tools you already use/i)).toBeInTheDocument();
    // A chip name that does NOT appear in the intro paragraph copy.
    expect(screen.getByText("QuickBooks")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections/ComplementsBooking.test.tsx`
Expected: FAIL on the second test — "QuickBooks" / "Works with the tools" not present yet.

- [ ] **Step 3: Add the import, renumber the kicker, append the integrations strip**

In `src/components/sections/ComplementsBooking.tsx`:

Change the imports at the top to add the integrations content:

```tsx
import { PhoneIncoming, CalendarCheck, Check, X, ArrowRight } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker";
import { INTEGRATION_LOGOS } from "@/content/integrations";
```

Renumber the kicker (was `number="10"`):

```tsx
      <Kicker number="09" label="Works with your booking system" />
```

Replace the closing paragraph (the `ANNA is the front desk —` line) so the integrations strip follows it, keeping that paragraph intact:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/sections/ComplementsBooking.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Delete the now-merged IntegrationsMarquee**

```bash
git rm src/components/sections/IntegrationsMarquee.tsx
```

- [ ] **Step 6: Typecheck (confirm nothing still imports IntegrationsMarquee)**

Run: `grep -rn "IntegrationsMarquee" src/ ; npx tsc --noEmit`
Expected: grep returns nothing; tsc has no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/ComplementsBooking.tsx src/components/sections/ComplementsBooking.test.tsx
git commit -m "feat(complements): fold integrations strip in, retire IntegrationsMarquee"
```

---

## Task 5: Merge SocialProofLogos into TestimonialWall + polish avatars

**Files:**
- Create: `src/components/sections/TestimonialWall.test.tsx`
- Modify: `src/components/sections/TestimonialWall.tsx`
- Delete: `src/components/sections/SocialProofLogos.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/TestimonialWall.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TestimonialWall } from "./TestimonialWall";

describe("TestimonialWall", () => {
  it("keeps the heading and the honesty note", () => {
    render(<TestimonialWall />);
    expect(
      screen.getByRole("heading", { level: 2, name: /What operators tell us/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Illustrative scenarios/i)).toBeInTheDocument();
  });

  it("shows the folded-in trust stats", () => {
    render(<TestimonialWall />);
    expect(screen.getByText("100,000+")).toBeInTheDocument();
    expect(screen.getByText(/Trustpilot/i)).toBeInTheDocument();
  });

  it("renders in-brand initial avatars for the secondary quotes", () => {
    render(<TestimonialWall />);
    // "Dr. Patel · Bright Smiles Cardiff" → initials DP
    expect(screen.getByText("DP")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections/TestimonialWall.test.tsx`
Expected: FAIL — "100,000+" and "DP" not present yet.

- [ ] **Step 3: Rewrite TestimonialWall with the stats strip, avatars, and renumbered kicker**

Replace the entire contents of `src/components/sections/TestimonialWall.tsx` with:

```tsx
import { TESTIMONIALS } from "@/content/testimonials";
import { Kicker } from "@/components/primitives/Kicker";
import { PullQuote } from "@/components/primitives/PullQuote";
import { Reveal } from "@/components/primitives/Reveal";

// Trust stats folded in from the retired SocialProofLogos strip.
const SIGNALS = [
  { stat: "100,000+", label: "UK SMBs on ANNA" },
  { stat: "★★★★★", label: "Trustpilot · Excellent" },
  { stat: "24/7", label: "Reception, every day" },
  { stat: "200+", label: "Tools integrated" },
];

// Initials for an in-brand avatar mark, derived from the attribution name.
// "James W. · Westfield…" → "JW"; "Emma & Joe · …" → "EJ".
function initials(attribution: string): string {
  const name = attribution.split("·")[0] ?? "";
  const words = name.split(/\s+/).filter((w) => /[A-Za-z]/.test(w[0] ?? ""));
  return words.slice(0, 2).map((w) => (w[0] ?? "").toUpperCase()).join("");
}

export function TestimonialWall() {
  const hero = TESTIMONIALS.find((t) => t.hero) ?? TESTIMONIALS[0];
  const rest = TESTIMONIALS.filter((t) => t !== hero);
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="testimonials-heading">
      <Kicker number="11" label="What operators tell us" />
      <h2 id="testimonials-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        What operators tell us.
      </h2>

      <Reveal>
        <div className="mt-10 grid grid-cols-2 gap-y-6 gap-x-8 rounded-2xl border border-sage/30 bg-cream-deep p-8 md:grid-cols-4">
          {SIGNALS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-ink tabular-nums leading-none">
                {s.stat}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-mono-label">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {hero && (
          <Reveal className="md:col-span-2">
            <PullQuote quote={hero.quote} attribution={hero.attribution} role="" business="" metric="" />
          </Reveal>
        )}
        <Reveal delayMs={120}>
          <div className="grid gap-8">
            {rest.slice(0, 2).map((t, i) => (
              <figure key={i}>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/20 font-display text-sm text-ink"
                  >
                    {initials(t.attribution)}
                  </span>
                  <span className="text-sm text-fg-muted">{t.attribution}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
      {rest.length > 2 && (
        <Reveal delayMs={120}>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {rest.slice(2).map((t, i) => (
              <figure key={i}>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/20 font-display text-sm text-ink"
                  >
                    {initials(t.attribution)}
                  </span>
                  <span className="text-sm text-fg-muted">{t.attribution}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      )}
      <p className="mt-12 font-mono text-xs uppercase tracking-[0.16em] text-mono-label text-center">
        Illustrative scenarios. Real customer testimonials replace these at launch.
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/sections/TestimonialWall.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Delete the now-merged SocialProofLogos**

```bash
git rm src/components/sections/SocialProofLogos.tsx
```

- [ ] **Step 6: Typecheck (confirm nothing still imports SocialProofLogos)**

Run: `grep -rn "SocialProofLogos" src/ ; npx tsc --noEmit`
Expected: grep returns nothing; tsc has no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/TestimonialWall.tsx src/components/sections/TestimonialWall.test.tsx
git commit -m "feat(testimonials): fold trust stats in, add in-brand avatars, retire SocialProofLogos"
```

---

## Task 6: Renumber remaining Kickers for sequential order

**Files:**
- Modify: `src/components/sections/SegmentsShowcase.tsx:125` (Kicker `04`→`05`)
- Modify: `src/components/sections/OutcomeStrip.tsx:33` (Kicker `05`→`06`)
- Modify: `src/components/sections/HiringComparison.tsx:74` (Kicker `11`→`10`)

(ChannelDemos `06`→`04` was already done in Task 3. ComplementsBooking `10`→`09` and TestimonialWall `09`→`11` were done in Tasks 4–5. Hero 01, ChannelsRibbon 02, HearAnna 03, RoiCalculator 07, HowItWorks 08, PricingTeaser 12, FaqAccordion 13, FinalCtaBanner 14 are already correct.)

- [ ] **Step 1: Confirm the affected tests don't assert kicker numbers**

Run: `grep -n "\"04\"\|\"05\"\|\"06\"\|\"10\"\|\"11\"\|Built for how\|outcomes\|VS THE ALTERNATIVES" src/components/sections/SegmentsShowcase.test.tsx src/components/sections/OutcomeStrip.test.tsx src/components/sections/HiringComparison.test.tsx`
Expected: no kicker-number matches (these tests assert behaviour/values, not the kicker). If a match appears, reconcile before editing.

- [ ] **Step 2: Renumber SegmentsShowcase**

In `src/components/sections/SegmentsShowcase.tsx`:

```tsx
      <Kicker number="05" label="Built for how you actually run" />
```

- [ ] **Step 3: Renumber OutcomeStrip**

In `src/components/sections/OutcomeStrip.tsx`:

```tsx
      <Kicker number="06" label="The outcomes" />
```

- [ ] **Step 4: Renumber HiringComparison**

In `src/components/sections/HiringComparison.tsx`:

```tsx
      <Kicker number="10" label="vs the alternatives" />
```

- [ ] **Step 5: Verify the three components' tests still pass**

Run: `npx vitest run src/components/sections/SegmentsShowcase.test.tsx src/components/sections/OutcomeStrip.test.tsx src/components/sections/HiringComparison.test.tsx`
Expected: PASS (all).

- [ ] **Step 6: Confirm the full kicker sequence reads 01–14 with no gaps/dupes**

Run: `grep -rhn 'Kicker number=' src/components/sections/ | grep -o 'number="[0-9]*"' | sort`
Expected: exactly `number="01"` … `number="14"`, each appearing once.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/SegmentsShowcase.tsx src/components/sections/OutcomeStrip.tsx src/components/sections/HiringComparison.tsx
git commit -m "chore(sections): renumber kickers for the tightened order"
```

---

## Task 7: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Full test suite**

Run: `npx vitest run`
Expected: all test files pass (count = previous 44 files + 3 new test files = 47 files; tests all green). HearAnna/ComplementsBooking/TestimonialWall tests included.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Production build (catches strict-TS issues vitest misses)**

Note: per project convention `next build` can leave a running `next dev` serving stale CSS. If a dev server is running for visual checks, stop it first or restart it after.

Run: `npx next build`
Expected: build succeeds; `check:placeholders` (run via `npm run build`) is not required here but may be run for completeness.

- [ ] **Step 4: Visual check on the dev server (desktop + mobile)**

Start `npm run dev` and verify:
- HearAnna renders the "launching soon" state (no fake number); "Or hear a sample call ↓" scrolls to the audio player (`#channel-demos`).
- ComplementsBooking shows the integration chips under the front-desk line.
- TestimonialWall shows the stats strip, initial avatars, and the illustrative note.
- Kicker numbers read 01→14 sequentially while scrolling.
- No horizontal overflow; mobile stacks cleanly.

- [ ] **Step 5: Final no-op commit guard**

Run: `git status`
Expected: clean working tree. Do NOT merge to `main` or push — branch stays local pending the user's decision.

---

## Spec Coverage Check

- Call-in block (honest, placeholder-ready, drop-in `DEMO_LINE`) → Tasks 1–2.
- Placed above ChannelDemos with "hear a sample" anchor → Tasks 2–3.
- Merge IntegrationsMarquee → ComplementsBooking → Task 4.
- Merge SocialProofLogos → TestimonialWall → Task 5.
- Reorder + kicker renumber (sequential 01–14) → Tasks 3, 4, 5, 6.
- Polish illustrative proof (in-brand avatars, keep illustrative note) → Task 5.
- Tested components untouched except inert Kicker/`id` edits, each guarded by a pre-edit grep → Tasks 3, 6.
- Verification (vitest + tsc + build + visual), branch only, no deploy → Task 7.
