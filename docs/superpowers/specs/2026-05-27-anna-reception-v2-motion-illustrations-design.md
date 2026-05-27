# ANNA Reception v2 — Motion & Illustrations Pass

**Date:** 2026-05-27 · **Revision:** v2 (post-council)
**Status:** Approved for implementation planning
**Companion to:**
- `2026-05-26-anna-reception-landing-design.md` (v3 IA + copy)
- `2026-05-26-anna-reception-redesign-design.md` (Editorial ANNA Warm visual layer)

**Revision history:**
- **v1 (2026-05-27):** Initial spec.
- **v2 (2026-05-27, post-council):** A 3-agent council (UX Designer · Frontend Engineer · Devil's Advocate) reviewed v1 at 75% consensus (Codex timed out; effective 2-reviewer council). Two layers **dropped** as actively harming the editorial-calm voice: Waveform "breathing" (broke play/idle affordance) and TrustStrip count-ups (slot-machine flicker on trust numbers). Four layers **refined**: Reveal translation amplitude bumped + fast-scroll guard + TestimonialWall redesign · Vertical illustrations gated by N→K candidate curation + scope narrowed to RoiCalculator only · SquiggleDivider ARIA fixed · Hero bob slowed. Four prerequisites **added**: performance budget + perf gate prerequisite · focus-within visibility · reduced-motion visual regression strategy · motion e2e coverage. Net effect: ~30-40% scope reduction, sharper feel.

This spec layers motion + illustration polish on top of the shipped Editorial ANNA Warm design. The IA, copy, conversion logic, and component primitives are unchanged.

---

## 0. Premise

The Editorial ANNA Warm redesign shipped (tag `v1-redesign`) and is followed by a critical-fix pass that eliminated visible placeholders. The page now renders cleanly: 102 vitest pass · 23 e2e pass · build passes G8 guard · 0 a11y violations.

The remaining gap is **felt liveness**. The page reads as a static editorial layout. Two things are missing:

1. **Motion** — `useScrollReveal` hook was created in Phase 2 of the redesign but never wired into any section. Grid sections (RevenueLeak, HowItWorks, FeatureStrip, Testimonials, Verticals, ROI picker) currently appear all-at-once.
2. **Custom illustrations** — every vertical uses the same Lucide stroke style in the RoiCalculator picker. PNG illustrations would add character at the picker's hero scale.

Two atmospheric details also land in this pass: SquiggleDivider for section transitions, and a slow Hero bob.

This spec adds those layers calibrated to the calm-and-confident voice from the v1 spec — motion serves liveness, not spectacle. The council's filter applied throughout: **motion must serve function or brand before it serves decoration.**

## 1. Scope

### In scope
- Wire scroll-reveal into 6 grid sections
- Build 2 new primitives: `Reveal`, `SquiggleDivider` (StatCounter removed post-council)
- Refactor `VerticalMark` to optionally render PNG illustration variant (RoiCalculator picker only)
- Generate 4 per-vertical engraved illustrations + 1 v2 hero via image-gen, with a curation gate
- Add slow micro-bob motion to the hero illustration
- Add a simple opacity fade-in to the TrustStrip cells (no count-ups, no stagger, no character pulses)
- Performance budget enforcement before shipping motion
- Focus-within visibility for keyboard users inside Reveal
- Reduced-motion visual regression strategy in Playwright
- Update visual regression baselines, axe sweep, reduced-motion sweep

### Out of scope (council-confirmed)
- **Waveform "breathing" idle state** — DROPPED. Breaks play/idle affordance (motion=active, stillness=ready is the correct UX). Current `Waveform.tsx` behaviour is preserved.
- **StatCounter count-ups, star stagger, `/` pulse** — DROPPED. Slot-machine tone undermines trust signals; Trustpilot stars are static for a reason; the `/` pulse is decoration masquerading as semantics.

### Deferred to v3
- IA changes (locked from v3 spec)
- Copy changes (locked from v3 spec)
- Dark mode (tokens defined; visual verification pass)
- Real customer logos / avatars / audio samples (marketing-owned)
- Decomposed-hero layered animation (single-PNG bob ships in v2)

## 2. Motion Layer

### 2.1 `<Reveal>` primitive (NEW)

Lightweight wrapper that applies scroll-reveal animation to its children. Built on the existing `useScrollReveal` hook (`src/lib/useScrollReveal.ts`).

**Props:**
```ts
{
  children: React.ReactNode;
  delayMs?: number;       // default 0; staggered siblings pass their index × stride
  className?: string;
}
```

**Behaviour:**
- Initial state: `opacity-0 translate-y-4` (16px — was 12px in v1; council flagged 12px as no-man's-land between fade and directional cue)
- Revealed state: `opacity-100 translate-y-0`
- Transition: 480ms `ease-out`, applies to `opacity` and `transform`
- One-shot per viewport (does not re-trigger on scroll out + back in)
- **Fast-scroll guard:** if the element enters viewport with ≥60% of its bounding box already visible (user scrolled fast and the IntersectionObserver fired late), `setRevealed(true)` immediately without applying the transition. Implemented by checking `entry.intersectionRatio` against a threshold; if exceeded, skip the animation phase entirely.
- **Focus-within visibility:** add a CSS rule that forces visibility when the element contains a focused descendant: `:has(:focus-visible)` or fallback `focus-within:opacity-100 focus-within:translate-y-0`. Prevents keyboard-tabbed elements from being invisible inside a not-yet-revealed Reveal.
- `prefers-reduced-motion`: revealed immediately, no transition class applied. Same focus-within fallback.

**Usage pattern:**
```tsx
<ol className="grid gap-12 md:grid-cols-3">
  {STATS.map((s, i) => (
    <Reveal key={s.num} delayMs={i * 60}>
      <li>...</li>
    </Reveal>
  ))}
</ol>
```

### 2.2 `useScrollReveal` enhancements

The hook's behaviour change to support fast-scroll guarding:

```ts
// Inside the IntersectionObserver callback, when isIntersecting:
if (entry.intersectionRatio >= 0.6) {
  // User scrolled fast; element is already mostly visible. Skip transition.
  setRevealed(true);
  io.disconnect();
  return;
}
// Otherwise normal reveal flow (current behaviour).
```

This requires raising the observer's `threshold` from `0.15` to `[0.15, 0.6]` so both thresholds fire. A new boolean output `instant: boolean` is returned alongside `revealed`; `Reveal` uses `instant` to skip the transition class.

Updated hook signature:
```ts
function useScrollReveal<T extends Element>(): [
  React.RefObject<T>,
  { revealed: boolean; instant: boolean }
]
```

Existing test file `src/lib/useScrollReveal.test.tsx` gains one new test for the fast-scroll path.

### 2.3 Sections wired

| Section | Items | Stagger stride |
|---|---|---|
| §04 RevenueLeak — 3 stanzas | 3 | 60ms |
| §07 HowItWorks — 3 numbered steps | 3 | 60ms |
| §10 FeatureStrip — 6 feature cells | 6 | 40ms |
| §09 TestimonialWall — 2 visual groups (see §2.4) | 2 | 120ms |
| §08 VerticalsTileModule — 4 collapsed tiles | 4 | 60ms |
| §06 RoiCalculator — 4 picker tiles | 4 | 60ms |

### 2.4 TestimonialWall stagger redesign (council fix)

v1 said "4 items, 80ms stride" but the actual layout is 1 PullQuote (col-span-2) + 2-item side stack + (when 4+ testimonials) a 3-item second row. An 80ms × 4-7 stagger across a non-aligned grid is unreadable as a sequence.

**New approach:** reveal as **2 visual groups**, keyed by reading order, with a 120ms stride between groups (not items):
1. **Group 1:** the hero PullQuote (cols 1-2)
2. **Group 2:** the side stack (col 3) + the second row, revealed together

Each group's children appear simultaneously (no intra-group stagger). The eye reads 2 clear arrival moments instead of 4-7 random ones.

### 2.5 Sections NOT wired (single-element, no stagger needed)
- §01 Header, §02 Hero, §05 AudioDemo, §11 IntegrationsMarquee, §12 PricingTeaser, §13 AuditReEntryBanner, §14 FaqAccordion, §15 FinalCtaBanner, §16 Footer

## 3. TrustStrip — simple opacity fade-in (council revision)

The TrustStrip (`§03 SocialProofLogos`) gets a single small motion treatment, NOT count-ups.

**All four cells fade in simultaneously** over 200ms `ease-out` when the strip enters viewport (using a single `Reveal` wrapper around the whole grid, not per-cell).

- No count-up animations on numerics (slot-machine tone undermines trust signals)
- No fade-in stagger on stars (Trustpilot is static for a reason)
- No pulse on the `/` character (decoration masquerading as semantics)
- `prefers-reduced-motion`: instant final state

This is implemented with the same `<Reveal>` primitive from §2.1 — no new `StatCounter` primitive needed.

```tsx
<Reveal className="...">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
    {SIGNALS.map(...)}
  </div>
</Reveal>
```

## 4. Per-Vertical Illustrations Layer

### 4.1 Curation gate (council addition)

Generating 4 independent gemini-3-pro-image calls with "same illustration family as hero" as the only style anchor is brittle — outputs will diverge subtly. **The curation gate:**

- Generate **2 candidates per vertical** (8 total generations) into `docs/superpowers/specs/mockups/vertical-candidates/`
- Reviewer (human or controller) picks **1 of 2** per vertical based on style consistency with the hero illustration
- Selected candidate moves to `public/assets/redesign/<vertical>.png`
- Discarded candidate optionally remains in candidates folder for future reference
- Total budget: 8 image-gen calls × ~$0.04 = ~$0.32

The implementation plan must include the curation step as an explicit task, not roll it into "generate assets."

### 4.2 Image-gen prompts (4 illustrations)

Each generated at 1024×1024 PNG with transparent background, engraved-line aesthetic matching the existing hero illustration.

| File | Subject |
|---|---|
| `public/assets/redesign/dental.png` | Stylised molar tooth with concentric scan-line waves resembling a sonar/X-ray pattern; small green pulse indicator beside it; engraved-line treatment, single 1.5px stroke in dark forest green ink, transparent background. Same illustration family as hero. |
| `public/assets/redesign/beauty.png` | Crossed open scissors and a fine-tooth comb in engraved-line style, with a small green sound wave arc above suggesting a phone ringing during a service; same stroke and palette as hero. |
| `public/assets/redesign/gastro.png` | Top-down view of a reservation table for two — plates, cutlery, a small ringing bell, a tiny calendar card showing "FRI · 7:30" — engraved-line. Same style as hero. |
| `public/assets/redesign/trades.png` | Crossed hammer and adjustable wrench above a small open tool case; tiny mobile phone with a single sound-wave arc to the side; engraved-line treatment matching hero. |

Each committed PNG carries a `// TODO: replace with marketing-approved assets` marker in `public/assets/redesign/README.md` (these are explicitly temporary stopgaps).

### 4.3 `<VerticalMark>` refactor — narrower scope

v1 wanted PNG illustration in both expanded VerticalTile AND RoiCalculator picker. Council flagged the icon→PNG morph inside a single tile (collapsed→expanded) as a rhythm break.

**Narrowed scope:** PNG illustrations used **only in the RoiCalculator picker** (4 tiles + selected-state header). The VerticalTile (`§08`) keeps Lucide icons in both collapsed and expanded states for visual consistency.

The `VerticalMark` component still gets the `variant?: "icon" | "illustration"` prop. It's just used in fewer places.

| Location | Variant |
|---|---|
| Collapsed `VerticalTile` row | `icon` (Lucide) |
| Expanded `VerticalTile` header | `icon` (Lucide) — keeps tile-level consistency |
| RoiCalculator picker tile (4 large tiles) | `illustration` (PNG) |
| RoiCalculator selected-state header | `illustration` (PNG) — matches picker visual |

### 4.4 v2 Hero illustration regen

Re-generate `public/assets/redesign/hero-illustration.png` with a cleaner prompt iteration. Curation gate applies: generate **2 candidates** at `docs/superpowers/specs/mockups/hero-v2-candidates/`, pick 1.

- Cleaner phone silhouette (fewer stray construction lines)
- More prominent on-screen waveform
- Better-positioned floating elements
- Slightly larger mint halo glow

Backup the existing v1 as `hero-illustration-v1.png` for A/B fallback. v2 ships at the primary path.

## 5. Squiggle Dividers Between Sections

### 5.1 `<SquiggleDivider>` primitive (NEW)

A horizontal sage-tinted squiggle ~16px tall, low-amplitude. Used sparingly between two specific section pairs.

**Implementation (council a11y fix — drop `role="separator"`):**
```tsx
<div aria-hidden="true" className="my-0 flex justify-center">
  <svg viewBox="0 0 240 16" className="w-48 text-sage/40" fill="none" aria-hidden="true">
    <path d="M0 8 C 20 0, 40 16, 60 8 S 100 0, 120 8 S 160 16, 180 8 S 220 0, 240 8"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
</div>
```

`role="separator" aria-hidden="true"` was self-cancelling in v1 — a separator IS a semantic landmark, and section landmarks (`<section aria-labelledby>`) already provide the semantic break. Plain decorative div with `aria-hidden` only.

### 5.2 Placement

Two placements only:
- Between §02 Hero and §03 SocialProofLogos
- Between §04 RevenueLeak and §05 AudioDemo

Not used elsewhere — preserves the "moment" of decoration. Existing in-page squiggle (§15 FinalCtaBanner corner) stays.

## 6. Hero Floating Elements Micro-Motion

### 6.1 CSS keyframe (council revision: slow it)

Council flagged 3.6s/4px as falling within the eye's saccade window during H1 reading. Slowed.

Add a `bob` keyframe to `tailwind.config.ts`:

```ts
keyframes: {
  bob: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%":      { transform: "translateY(-4px)" },
  },
}
animation: {
  bob: "bob 7s ease-in-out infinite",
}
```

Period extended to 7s. Amplitude unchanged (4px).

### 6.2 Implementation

```tsx
<Image
  src="/assets/redesign/hero-illustration.png"
  ...
  className="w-full h-auto motion-safe:animate-bob"
/>
```

The whole illustration bobs gently — no decomposition into layers in v2. Layered approach deferred to v3.

## 7. Performance Budget (council addition)

Before shipping any of this layer, the implementation plan MUST include:

### 7.1 Per-asset KB ceilings (enforced via CI)
- Hero illustration v2: ≤ 80 KB after optimization (current v1 is 524 KB — must be compressed)
- Per-vertical PNG (×4): ≤ 30 KB each after optimization → ≤ 120 KB combined
- Combined new asset budget: ≤ 200 KB

Optimization step in the plan: `npx @squoosh/cli` or `sharp` to convert PNGs to WebP with quality≈80, then check sizes. Commit only the optimized version.

### 7.2 Performance gate prerequisite
Lighthouse perf gate verification must run in CI **before** any of the motion layers merge. Adding ~250 KB of new assets + page-wide IntersectionObserver + transform animations across the entire page is exactly when CLS/INP regressions slip in unmeasured.

The implementation plan's Phase 0 includes:
1. Build production output (with env vars stubbed)
2. Run Lighthouse on the production build at desktop + mobile
3. Capture baseline (Performance ≥ 90 desktop / 80 mobile, CLS < 0.1, INP < 200ms)
4. ONLY after baseline is captured, proceed with motion phases
5. After each phase, re-run Lighthouse; regression > 5 points fails the phase

### 7.3 Bundle impact
- `Reveal` and `SquiggleDivider` are tree-shakeable; impact ≤ 1 KB minified+gzipped each
- No new dependencies introduced
- `useScrollReveal` hook already exists; the fast-scroll enhancement adds ~10 lines

## 8. Accessibility (council additions)

All motion respects `prefers-reduced-motion`:
- `Reveal` → children appear immediately in final state, no transition
- TrustStrip fade → instant final state
- `SquiggleDivider` → static decorative SVG, no animation in any mode
- Hero bob → `motion-safe:animate-bob` neutralizes under reduce

**Focus-within visibility (NEW):** `Reveal` must not hide focusable descendants from keyboard users. CSS rule:

```css
.reveal-hidden:has(:focus-visible),
.reveal-hidden:focus-within {
  opacity: 1 !important;
  transform: none !important;
}
```

Vitest test must exercise this: render a `Reveal` with a `<button>` child, programmatically focus the button before the reveal fires, assert the wrapper's computed `opacity` is 1.

**Heading hierarchy:** unchanged. `Reveal` is a transparent wrapper that does not introduce semantic landmarks.

**Contrast:** unchanged. Sage tokens already verified for WCAG AA in v1 a11y fix.

## 9. Visual Regression Strategy (council addition)

Animated content is flaky for pixel-diff visual regression. The strategy:

- All `tests/e2e/visual.spec.ts` snapshots are captured with **`prefers-reduced-motion: reduce` emulated**, ensuring deterministic final-state rendering.
- Use Playwright's `emulateMedia({ reducedMotion: 'reduce' })` in the test setup.
- The 5 existing breakpoint snapshots (375/768/1024/1440/1920) get re-baselined with reduce-motion emulation.
- A separate `tests/e2e/visual-motion.spec.ts` captures **3 keyframe states** of the hero bob (0%, 50%, 100%) for visual sanity, with no diff tolerance check — purely for review on PR.

## 10. Motion E2E Coverage (council addition)

Beyond unit tests, add 4 Playwright scenarios:

1. `reveal-scroll-flow.spec.ts` — scroll through the page; verify each grid section's items become visible (computed opacity transitions from 0 to 1).
2. `reveal-fast-scroll.spec.ts` — scroll past 3 sections in < 500ms; verify all items show final state without stagger pile-up.
3. `reveal-focus-within.spec.ts` — Tab through the page; verify focused elements never have computed opacity < 1.
4. `reveal-reduced-motion.spec.ts` — emulate reduced motion; verify all items are at final state on initial load.

## 11. File Map

### New primitives
- `src/components/primitives/Reveal.tsx` + `.test.tsx`
- `src/components/primitives/SquiggleDivider.tsx` + `.test.tsx`

### Refactored primitives
- `src/components/primitives/VerticalMark.tsx` (variant prop + PNG path)

### Hook refactor
- `src/lib/useScrollReveal.ts` (fast-scroll guard, returns `{ revealed, instant }`)
- `src/lib/useScrollReveal.test.tsx` (one new test for fast-scroll path)

### Section edits
- `src/components/sections/SocialProofLogos.tsx` (one `<Reveal>` around the grid; no count-ups)
- `src/components/sections/RevenueLeak.tsx` (Reveal stagger; place SquiggleDivider in `page.tsx` between this and AudioDemo)
- `src/components/sections/HowItWorks.tsx` (Reveal stagger)
- `src/components/sections/FeatureStrip.tsx` (Reveal stagger)
- `src/components/sections/TestimonialWall.tsx` (Reveal as 2 groups in reading order)
- `src/components/sections/VerticalsTileModule.tsx` (Reveal stagger)
- `src/components/sections/RoiCalculator.tsx` (Reveal stagger on picker + `variant="illustration"` on VerticalMark)
- `src/components/sections/Hero.tsx` (`animate-bob` on illustration; place SquiggleDivider in `page.tsx` after Hero)
- `src/app/page.tsx` (insert 2 `<SquiggleDivider>` between Hero↓SocialProof and RevenueLeak↓Audio)
- `src/components/sections/AudioDemo.tsx` (no change — Waveform refactor was dropped from v2)

### Config & assets
- `tailwind.config.ts` (new `bob` keyframe + animation, 7s period)
- `public/assets/redesign/hero-illustration.png` (regen v2; pick from 2 candidates; ≤ 80 KB optimized)
- `public/assets/redesign/hero-illustration-v1.png` (backup current)
- `public/assets/redesign/dental.png` (new; pick from 2 candidates; ≤ 30 KB optimized)
- `public/assets/redesign/beauty.png` (new; same)
- `public/assets/redesign/gastro.png` (new; same)
- `public/assets/redesign/trades.png` (new; same)
- `public/assets/redesign/README.md` (update inventory + temporary-asset notice)
- `docs/superpowers/specs/mockups/vertical-candidates/` (8 candidate PNGs, 4 selected)
- `docs/superpowers/specs/mockups/hero-v2-candidates/` (2 candidate PNGs, 1 selected)

### New tests
- `tests/e2e/visual-motion.spec.ts` (hero bob keyframe captures)
- `tests/e2e/reveal-scroll-flow.spec.ts`
- `tests/e2e/reveal-fast-scroll.spec.ts`
- `tests/e2e/reveal-focus-within.spec.ts`
- `tests/e2e/reveal-reduced-motion.spec.ts`

## 12. Acceptance criteria

- [ ] `<Reveal>` wired into 6 grid sections (RevenueLeak, HowItWorks, FeatureStrip, TestimonialWall as 2 groups, VerticalsTileModule, RoiCalculator picker)
- [ ] `useScrollReveal` returns `{ revealed, instant }`; fast-scroll guard fires above 0.6 intersection ratio
- [ ] TrustStrip uses a single Reveal wrapper (no count-ups, no per-cell stagger, no character animations)
- [ ] 4 per-vertical PNG illustrations exist and are loaded by `<VerticalMark variant="illustration" />` in RoiCalculator picker + selected-state header (NOT in VerticalTile expanded state)
- [ ] Curation gate executed: 2 candidates per vertical generated; 1 selected; selection documented in README
- [ ] v2 hero illustration replaces v1 (v1 retained as `hero-illustration-v1.png`); curation gate executed for hero too
- [ ] Hero illustration ≤ 80 KB optimized; each vertical PNG ≤ 30 KB optimized
- [ ] SquiggleDivider renders without `role="separator"` (decorative `aria-hidden` only)
- [ ] 2 SquiggleDivider placements live (Hero↓SocialProof, RevenueLeak↓Audio)
- [ ] Hero image has `motion-safe:animate-bob` with 7s period
- [ ] Lighthouse baseline captured before motion phases; Performance ≥ 90 desktop / 80 mobile after each phase; CLS < 0.1; INP < 200ms
- [ ] Focus-within visibility: keyboard-focused descendants of Reveal are always visible
- [ ] Visual regression baselines use `prefers-reduced-motion: reduce` emulation
- [ ] 4 new motion e2e scenarios pass
- [ ] All existing 102 vitest tests still pass; ≥4 new tests (Reveal, SquiggleDivider, VerticalMark variant, useScrollReveal fast-scroll)
- [ ] No new console errors, no a11y violations, no 404s
- [ ] `npm run build` passes including `check:placeholders`

## 13. Implementation Phasing (post-council)

1. **Phase 0 — Performance baseline (NEW, gate):** capture Lighthouse on the current production build; document scores. No motion code merges until this exists.
2. **Primitives:** `Reveal` (with fast-scroll guard + focus-within), `SquiggleDivider` (TDD per primitive).
3. **Hook refactor:** `useScrollReveal` returns `{ revealed, instant }` + threshold expansion.
4. **VerticalMark refactor:** `variant` prop.
5. **Asset curation:** generate 8 vertical candidates → pick 4. Generate 2 hero candidates → pick 1. Optimize all PNGs to KB ceilings. Update README.
6. **Tailwind config:** `bob` keyframe (7s period).
7. **Section wiring:** RevenueLeak, HowItWorks, FeatureStrip, TestimonialWall (2-group reveal), Verticals, RoiCalculator (Reveal + illustration variant), SocialProofLogos (single Reveal), Hero (animate-bob).
8. **SquiggleDivider placement:** Hero↓SocialProof, RevenueLeak↓Audio.
9. **E2E motion suite:** 4 new specs.
10. **Verification:** vitest, playwright (incl. axe + reduced-motion), visual regression with reduced-motion emulation, post-phase Lighthouse check, build smoke.
11. **Milestone tag:** `v2-motion-illustrations`.

## 14. References

- `2026-05-26-anna-reception-redesign-design.md` — v1 visual layer
- `2026-05-26-anna-reception-landing-design.md` — v3 IA + copy
- `src/lib/useScrollReveal.ts` — motion utility (already exists; will be enhanced)
- `public/assets/redesign/hero-illustration.png` — current hero (v1) to be replaced
- Council deliberation (this conversation): UX Designer (claude) + Devil's Advocate (gemini), 75% consensus, Codex timed out
