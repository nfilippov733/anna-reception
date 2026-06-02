# Cactus-Learnings Landing Page Improvements — Design

**Date:** 2026-06-02
**Branch:** `feat/cactus-learnings`
**Status:** Approved (design), pending implementation plan
**Constraint:** Do not break anything already shipped. Branch only — do not deploy.

## Background

A competitive review of [oncactus.com](https://oncactus.com) (a US trades-focused AI
receptionist) surfaced four areas where their landing page outperforms ours. The user
selected three to act on this round:

1. A live **"Call ANNA"** call-in demo block (Cactus's strongest conversion asset).
2. **Tightening** the page (currently 15 content sections) — gentle merge, no content lost.
3. **Polishing the illustrative proof** in-brand (no new motif, no real photos required).

The user explicitly skipped the "sharpen problem copy" item.

## Goals

- Add a call-in demo section that is **honest** (no fake phone number) and **drop-in ready**
  for a real number later.
- Reduce section count from 15 → 14 by merging genuinely overlapping, **untested** sections,
  and reorder to front-load the "experience it" moment.
- Make the illustrative testimonials visually stronger while keeping the honest
  "illustrative" labelling.
- Keep every tested component's internals untouched. All tests stay green.

## Non-Goals

- No live phone number wiring (no working AI line exists yet).
- No real customer photos (none available; honesty constraint).
- No new brand mascot/motif.
- No problem-copy rewrite.
- No deploy. No merge to `main` in this spec's scope.

## Current State (reference)

Page assembly in `src/app/page.tsx`, render order:

```
Hero → ChannelsRibbon → SocialProofLogos → SegmentsShowcase → OutcomeStrip →
SquiggleDivider → ChannelDemos → RoiCalculator → HowItWorks → TestimonialWall →
ComplementsBooking → IntegrationsMarquee → HiringComparison → PricingTeaser →
FaqAccordion → FinalCtaBanner
```

**Components with tests** (internals must NOT change): `ChannelDemos`, `ChannelsRibbon`,
`FinalCtaBanner`, `Hero`, `HiringComparison`, `OutcomeStrip`, `PricingTeaser`,
`RoiCalculator`, `SegmentsShowcase`.

**Components without tests** (safe to edit/merge): `SocialProofLogos`,
`IntegrationsMarquee`, `ComplementsBooking`, `TestimonialWall`, `HowItWorks`,
`FaqAccordion`.

Relevant facts found during grounding:
- `SocialProofLogos` is a **stats strip** (100,000+ UK SMBs, ★★★★★ Trustpilot, 24/7,
  200+ tools) on `bg-cream-deep`, not quotes. It currently provides early trust after the
  hero. The Hero already carries its own Trustpilot/100k trust line, so the early trust is
  not lost if this strip moves down.
- `IntegrationsMarquee` renders `INTEGRATION_LOGOS` from `@/content/integrations` as text
  chips under "Works with the tools you already use · 200+ integrations".
- `ComplementsBooking` is the "Keeps your booking system. Answers everything it can't."
  section — same "works with your existing tools" theme as the marquee.
- `TestimonialWall` pulls `TESTIMONIALS` from `@/content/testimonials`, renders a hero
  pull-quote + grid, and already ends with: "Illustrative scenarios. Real customer
  testimonials replace these at launch."
- Sections use a sequential `Kicker number="NN"` label; reordering requires renumbering.

## Approach

**Approach A — Additive + safe merges** (chosen). Build the call-in block as a brand-new
component (zero risk). Tighten by merging only untested sections and reordering in
`page.tsx`. Polish testimonials in place. Renumber kickers. Tested components are at most
reordered in `page.tsx` (which has no test).

Rejected:
- **B — Demo hub** (fold call-in into `ChannelDemos`): edits a tested component. ✗ against
  the no-break constraint.
- **C — Phased**: ship call-in now, tighten later. Slower; not needed since A is low-risk.

## Detailed Design

### Workstream 1 — `HearAnna` section (new)

New file: `src/components/sections/HearAnna.tsx`. Client component only if needed for the
analytics click handler (match the pattern used by `PricingTeaser`).

- `id="hear-anna"`, wrapped in the standard `<section className="mx-auto max-w-page px-4
  py-24 md:py-32">` shell with a `Kicker` and `h2` "Call ANNA. Hear it for yourself."
- A **phone-number card** driven by a module constant:
  ```ts
  // Set to the live demo number when the AI line is ready; until then the card
  // renders a "launching soon" state — never a fake number.
  const DEMO_LINE: string | null = null;
  ```
  - When `DEMO_LINE === null`: render a disabled/"Live demo line — launching soon" state
    (muted pill, `aria-disabled`), NOT a fake number.
  - When set: render the number as a `tel:` link, prominent (`font-display`,
    `tabular-nums`), callable.
- **Primary CTA:** "Book a demo" (active, real) → `/demo`, with
  `track("hear_anna_cta_clicked")`.
- **Secondary:** text link "Or hear a sample call ↓" anchoring to `#channel-demos` (the
  existing audio player). Requires `ChannelDemos` to expose `id="channel-demos"` on its
  section wrapper — adding an `id` attribute only, no logic change, so its test stays green
  (confirm the test does not assert on absence of the id).
- Honesty line under the card: "Live call-in is launching soon — book a demo to hear ANNA
  on your own site today."
- Icons: lucide only (e.g. `PhoneCall`), no emoji.
- Placement: directly **above** `ChannelDemos` so the live audio sample carries the block
  while the call-in line is pending.
- Not added to the header nav (nav stays at 6 items); revisit once the line is live.

### Workstream 2 — Gentle tightening (15 → 14 content sections)

**Merge 1 — `IntegrationsMarquee` → `ComplementsBooking`.** Move the 200+-integration chip
list (from `@/content/integrations`) into `ComplementsBooking` as a sub-block under its
existing content. Delete `IntegrationsMarquee.tsx` and its `page.tsx` import/usage. The
"200+ integrations" stat also appears in `SocialProofLogos`, so this removes a duplicate.

**Merge 2 — `SocialProofLogos` → `TestimonialWall`.** Move the four stat tiles into the top
of `TestimonialWall` as a stats strip above the quotes, forming one consolidated "proof"
section. Delete `SocialProofLogos.tsx` and its `page.tsx` import/usage. Early Trustpilot
trust is preserved by the Hero's own trust line.

**Reorder** `page.tsx` to the final order below. `SquiggleDivider` placement is adjusted to
still sit between two content blocks (keep one decorative divider mid-page; exact placement
at implementer's discretion, visually verified).

Final content order:

| # | Section | Kicker | Change |
|---|---------|--------|--------|
| 1 | Hero | — | unchanged |
| 2 | ChannelsRibbon | 02 | unchanged |
| 3 | **HearAnna** | 03 | NEW |
| 4 | ChannelDemos | 04 | moved up; add `id="channel-demos"` |
| 5 | SegmentsShowcase | 05 | unchanged |
| 6 | OutcomeStrip | 06 | unchanged |
| 7 | RoiCalculator | 07 | unchanged |
| 8 | HowItWorks | 08 | unchanged |
| 9 | ComplementsBooking | 09 | + integrations chips folded in |
| 10 | HiringComparison | 10 | unchanged |
| 11 | TestimonialWall | 11 | + social-proof stats folded in, polished |
| 12 | PricingTeaser | 12 | unchanged |
| 13 | FaqAccordion | 13 | unchanged |
| 14 | FinalCtaBanner | — | unchanged |

Kicker numbers above are the target post-reorder labels. Renumber every `Kicker number`
prop to match this sequence (Hero and FinalCtaBanner have no kicker). Verify no other copy
references a stale section number.

### Workstream 3 — Polish illustrative proof

In the merged `TestimonialWall`:
- Give each quote an in-brand **avatar mark**: a circle (terracotta or sage tint) with the
  person's initials in `font-display`, line-art aesthetic. Derive initials from the
  existing `attribution` field; no new data needed. No emoji, no lucide needed (initials
  are text).
- Keep the existing honesty line: "Illustrative scenarios. Real customer testimonials
  replace these at launch."
- Keep the `PullQuote` hero treatment; add the avatar to the secondary/grid quotes (and to
  the hero quote if it reads well).

## Data / Interfaces

- No changes to `@/content/integrations` or `@/content/testimonials` data shapes; both are
  re-consumed by their new host sections.
- `HearAnna` owns a single module-level `DEMO_LINE` constant as its only configuration
  surface.
- Analytics: add `hear_anna_cta_clicked` via the existing `track()` util, matching the
  established event-name pattern.

## Testing & Verification

- Existing `vitest` suite must stay green; do not modify tested components' behaviour.
  Reordering in `page.tsx` (untested) and adding an `id` to `ChannelDemos` must not break
  `ChannelDemos.test.tsx` — confirm by reading the test before editing.
- Run `next build` before declaring done (catches strict-TS issues vitest misses, per
  project convention).
- Manual visual check on the dev server at desktop + mobile widths:
  - HearAnna "coming soon" state renders honestly (no fake number) and the "hear a sample"
    anchor scrolls to the audio player.
  - Merged ComplementsBooking shows the integration chips.
  - Merged TestimonialWall shows stats strip + polished avatars + illustrative note.
  - Kicker numbers read sequentially top-to-bottom.
  - No horizontal overflow; mobile stacks cleanly.
- Branch only; no deploy. Do not merge to `main` as part of this work unless the user asks.

## Risks & Mitigations

- **Risk:** removing `SocialProofLogos` drops early trust. **Mitigation:** Hero retains its
  own Trustpilot/100k line; stats relocate into the proof section, not deleted.
- **Risk:** reordering shifts kicker numbers and leaves stale labels. **Mitigation:**
  explicit renumber pass + grep for hard-coded section numbers in copy.
- **Risk:** adding `id` to `ChannelDemos` breaks its test. **Mitigation:** read the test
  first; an added attribute should be inert, but verify.
- **Risk:** "coming soon" call-in reads as vaporware. **Mitigation:** pair with the active
  audio sample directly below and a real "Book a demo" CTA, so the block has live value now.

## Out of Scope / Follow-ups

- Wiring a real `DEMO_LINE` number once the AI line exists (flip the constant, render
  `tel:`).
- Adding HearAnna to the header nav once the line is live.
- Real customer photos replacing illustrative avatars at launch.
