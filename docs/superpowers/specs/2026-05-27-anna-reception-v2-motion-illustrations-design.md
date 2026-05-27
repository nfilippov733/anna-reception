# ANNA Reception v2 — Motion & Illustrations Pass

**Date:** 2026-05-27 · **Revision:** v1
**Status:** Approved for implementation planning
**Companion to:**
- `2026-05-26-anna-reception-landing-design.md` (v3 IA + copy)
- `2026-05-26-anna-reception-redesign-design.md` (Editorial ANNA Warm visual layer)

This spec layers motion + illustration polish on top of the shipped Editorial ANNA Warm design. The IA, copy, conversion logic, and component primitives are unchanged.

---

## 0. Premise

The Editorial ANNA Warm redesign shipped (tag `v1-redesign`) and is followed by a critical-fix pass that eliminated visible placeholders. The page now renders cleanly: 102 vitest pass · 23 e2e pass · build passes G8 guard · 0 a11y violations.

The remaining gap is **felt liveness**. The page reads as a static editorial layout. Three things are missing:

1. **Motion** — `useScrollReveal` hook was created in Phase 2 of the redesign but never wired into any section. Grid sections (RevenueLeak, HowItWorks, FeatureStrip, Testimonials, Verticals, ROI picker) currently appear all-at-once.
2. **Custom illustrations** — every vertical uses the same Lucide stroke style. The hero illustration is one image; verticals are reduced to monoline icons.
3. **Atmospheric details** — squiggles only appear in §15. The AudioDemo waveform freezes when audio isn't playing. The hero is static.

This spec adds those three layers, scaled to the calm-and-confident voice from the v1 spec (no parallax, no magnetic cursor, no gradient meshes — motion conveys liveness, not spectacle).

## 1. Scope

### In scope
- Wire scroll-reveal into 6 grid sections
- Build 3 new primitives: `Reveal`, `StatCounter`, `SquiggleDivider`
- Refactor `Waveform` to support `breathing` idle state
- Refactor `VerticalMark` to optionally render PNG illustration variant
- Generate 4 per-vertical engraved illustrations + 1 v2 hero via image-gen
- Add micro-bob motion to hero floating elements
- Update visual regression baselines, axe sweep, reduced-motion sweep

### Out of scope
- IA changes (locked from v3 spec)
- Copy changes (locked from v3 spec)
- Dark mode (deferred to v3 — tokens already defined)
- Real customer logos / avatars / audio samples (marketing-owned)
- Lighthouse perf gate verification (will run in CI once env-injected production deploy exists)

## 2. Motion Layer

### 2.1 `<Reveal>` primitive (NEW)

Lightweight wrapper that applies scroll-reveal animation to its children. Built on the existing `useScrollReveal` hook (`src/lib/useScrollReveal.ts`).

**Props:**
```ts
{
  children: React.ReactNode;
  delayMs?: number;       // default 0; staggered siblings pass their index × stride
  stride?: number;        // default 60ms when used in lists
  className?: string;
}
```

**Behaviour:**
- Initial state: `opacity-0 translate-y-3`
- Revealed state: `opacity-100 translate-y-0`
- Transition: 480ms `ease-out`, applies to `opacity` and `transform`
- One-shot per viewport (does not re-trigger on scroll out + back in)
- `prefers-reduced-motion`: revealed immediately, no transition class applied

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

### 2.2 Sections wired

| Section | Items | Stagger stride |
|---|---|---|
| §04 RevenueLeak — 3 stanzas | 3 | 60ms |
| §07 HowItWorks — 3 numbered steps | 3 | 60ms |
| §10 FeatureStrip — 6 feature cells | 6 | 40ms |
| §09 TestimonialWall — 1 PullQuote + 3 figures | 4 | 80ms |
| §08 VerticalsTileModule — 4 collapsed tiles | 4 | 60ms |
| §06 RoiCalculator — 4 picker tiles | 4 | 60ms |

### 2.3 Sections NOT wired (single-element, no stagger needed)
- §01 Header, §02 Hero, §03 SocialProofLogos (uses StatCounter below), §05 AudioDemo, §11 IntegrationsMarquee, §12 PricingTeaser, §13 AuditReEntryBanner, §14 FaqAccordion, §15 FinalCtaBanner, §16 Footer

## 3. Stat Counter Layer (TrustStrip)

### 3.1 `<StatCounter>` primitive (NEW)

Wraps a numeric stat with a count-up animation from 0 to its display value when entering viewport. Uses the existing `AnimatedNumber` primitive under the hood.

**Props:**
```ts
{
  value: number;                // target value
  display?: string;             // override the rendered text (e.g. "100,000+" not "100000")
  format?: "plain" | "gbp";     // re-use AnimatedNumber's formatters
  className?: string;
}
```

**Behaviour:**
- On viewport-enter, counts from 0 → `value` over 600ms `ease-out`
- After settling, optionally renders `display` (so we can show "100,000+" but animate to 100000)
- `prefers-reduced-motion`: renders final `display` immediately

### 3.2 Special stat cells

Two of the four TrustStrip cells use `StatCounter` (the two with numerics):

| Cell | Value | Display |
|---|---|---|
| 1 | `100000` | "100,000+" |
| 4 | `3` | "3 min" |

The other two:

| Cell | Treatment |
|---|---|
| 2 | `★★★★★` — 5 spans, fade-in stagger 80ms each on viewport-enter |
| 3 | `24/7` — one-shot pulse on the `/` character (scale 1 → 1.15 → 1, 200ms ease-in-out) |

All four respect `prefers-reduced-motion` (instant final state).

## 4. Per-Vertical Illustrations Layer

### 4.1 Image-gen prompts (4 illustrations)

Each is generated via `gemini-3-pro-image`, output 1024×1024 PNG with transparent background, engraved-line aesthetic matching the existing hero illustration.

| File | Subject |
|---|---|
| `public/assets/redesign/dental.png` | Stylised molar tooth with concentric scan-line waves resembling a sonar/X-ray pattern; small green pulse indicator beside it; engraved-line treatment, single 1.5px stroke in dark forest green ink, transparent background. Same illustration family as hero. |
| `public/assets/redesign/beauty.png` | Crossed open scissors and a fine-tooth comb in engraved-line style, with a small green sound wave arc above suggesting a phone ringing during a service; same stroke and palette as hero. |
| `public/assets/redesign/gastro.png` | Top-down view of a reservation table for two — plates, cutlery, a small ringing bell, a tiny calendar card showing "FRI · 7:30" — engraved-line. Same style as hero. |
| `public/assets/redesign/trades.png` | Crossed hammer and adjustable wrench above a small open tool case; tiny mobile phone with a single sound-wave arc to the side; engraved-line treatment matching hero. |

### 4.2 `<VerticalMark>` refactor

Add a `variant?: "icon" | "illustration"` prop. Default `icon` (current Lucide behaviour). When `variant="illustration"`, render the corresponding PNG via `next/image` (48px–96px sizing typical).

**Where each variant is used:**

| Location | Variant | Reason |
|---|---|---|
| Collapsed `VerticalTile` row | `icon` | Small (40px); Lucide reads cleaner at that size |
| Expanded `VerticalTile` header | `illustration` | Larger; PNG illustration adds character |
| RoiCalculator picker tile | `illustration` | Hero-scale of 4-tile picker; deserves illustration |
| RoiCalculator selected-state header | `illustration` | Matches picker visual |

### 4.3 v2 Hero illustration regen

Re-generate `public/assets/redesign/hero-illustration.png` with a cleaner prompt iteration:
- Cleaner phone silhouette (fewer stray construction lines)
- More prominent on-screen waveform
- Better-positioned floating elements
- Slightly larger mint halo glow

Backup the v1 as `hero-illustration-v1.png` so we can A/B if needed.

## 5. AudioDemo Continuous Waveform

### 5.1 `Waveform` refactor

Change the `playing: boolean` prop to behave as **always-animating** with two intensity modes:

```tsx
type Props = { playing: boolean };
```

(prop unchanged; behaviour change)

**Behaviour:**
- `playing=true`: existing dual-frequency wave at full amplitude (8–32px bar heights)
- `playing=false`: same wave, but bar heights scaled to ~40% (8–16px) and frequency divisors ~×1.5 slower
- `prefers-reduced-motion`: bars frozen at midline (8px), no animation in either mode

This produces a constant "breathing" effect — the audio card never looks dead, even when nothing is playing.

## 6. Squiggle Dividers Between Sections

### 6.1 `<SquiggleDivider>` primitive (NEW)

A horizontal sage-tinted squiggle ~16px tall, low-amplitude. Used sparingly between two specific section pairs.

**Implementation:**
```tsx
<div role="separator" aria-hidden="true" className="my-0 flex justify-center">
  <svg viewBox="0 0 240 16" className="w-48 text-sage/40" fill="none" aria-hidden="true">
    <path d="M0 8 C 20 0, 40 16, 60 8 S 100 0, 120 8 S 160 16, 180 8 S 220 0, 240 8"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
</div>
```

### 6.2 Placement

Two placements only:
- Between §02 Hero and §03 SocialProofLogos
- Between §04 RevenueLeak and §05 AudioDemo

Not used elsewhere — preserves the "moment" of decoration. Existing in-page squiggle (§15 FinalCtaBanner corner) stays.

## 7. Hero Floating Elements Micro-Motion

### 7.1 CSS keyframe

Add a `bob` keyframe to `tailwind.config.ts`:

```ts
keyframes: {
  bob: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%":      { transform: "translateY(-4px)" },
  },
}
animation: {
  bob: "bob 3.6s ease-in-out infinite",
  "bob-slow": "bob 4.8s ease-in-out infinite",
}
```

### 7.2 Implementation

The current hero illustration is a single PNG. To apply micro-motion to the **floating elements** (envelope, card chip, squiggle) without animating the whole image, we have two options:

**A) Keep PNG, apply `animate-bob` to the whole `<Image>`**
Simple but moves the entire phone too. Acceptable but cheaper.

**B) Decompose the hero into 2-3 layered PNGs (phone + floating elements separately) and apply different `animate-bob` durations to each layer**
Better visual effect, but doubles asset count.

**Decision:** Option A. The whole illustration bobs gently (3.6s, 4px amplitude). Reads as an alive, breathing scene without artifacting around individual elements. Layered approach can be a v3 refinement.

The hero illustration wrapper becomes:

```tsx
<Image
  src="/assets/redesign/hero-illustration.png"
  ...
  className="w-full h-auto motion-safe:animate-bob motion-reduce:animate-none"
/>
```

## 8. File Map

### New primitives
- `src/components/primitives/Reveal.tsx` + `.test.tsx`
- `src/components/primitives/StatCounter.tsx` + `.test.tsx`
- `src/components/primitives/SquiggleDivider.tsx` + `.test.tsx`

### Refactored primitives
- `src/components/primitives/Waveform.tsx` (breathing idle)
- `src/components/primitives/VerticalMark.tsx` (variant prop + PNG path)

### Section edits (wire `Reveal` and/or `StatCounter` and/or illustrations)
- `src/components/sections/SocialProofLogos.tsx` (StatCounter × 3)
- `src/components/sections/RevenueLeak.tsx` (Reveal stagger)
- `src/components/sections/HowItWorks.tsx` (Reveal stagger)
- `src/components/sections/FeatureStrip.tsx` (Reveal stagger)
- `src/components/sections/TestimonialWall.tsx` (Reveal stagger)
- `src/components/sections/VerticalsTileModule.tsx` (Reveal stagger + SquiggleDivider before §03)
- `src/components/verticals/VerticalTile.tsx` (illustration variant in expanded state)
- `src/components/sections/RoiCalculator.tsx` (Reveal stagger on picker + illustration variant)
- `src/components/sections/Hero.tsx` (`animate-bob` on illustration; squiggle below)
- `src/components/sections/AudioDemo.tsx` (no change — Waveform refactor cascades automatically)

### Config & assets
- `tailwind.config.ts` (new `bob` keyframe + animations)
- `public/assets/redesign/hero-illustration.png` (regen)
- `public/assets/redesign/hero-illustration-v1.png` (backup current)
- `public/assets/redesign/dental.png` (new)
- `public/assets/redesign/beauty.png` (new)
- `public/assets/redesign/gastro.png` (new)
- `public/assets/redesign/trades.png` (new)
- `public/assets/redesign/README.md` (update inventory)

## 9. Accessibility

All motion respects `prefers-reduced-motion`:
- `Reveal` → children appear immediately in final state, no transition
- `StatCounter` → renders final `display` immediately, no count-up
- TrustStrip star stagger / `24/7` pulse → no animation
- `Waveform` → frozen at midline in both modes
- Hero bob → `motion-reduce:animate-none` already in classes

Heading hierarchy: unchanged. `Reveal` is a transparent wrapper that does not introduce semantic landmarks. `StatCounter` and `SquiggleDivider` are `aria-hidden` where appropriate (the squiggle is decorative, the stat counter's parent already has a semantic label).

Contrast: unchanged. Sage tokens already verified for WCAG AA in v1 a11y fix.

## 10. Acceptance criteria

- [ ] `<Reveal>` wired into 6 grid sections (RevenueLeak, HowItWorks, FeatureStrip, TestimonialWall, VerticalsTileModule, RoiCalculator picker)
- [ ] TrustStrip 4 cells use motion (counter ×2, star stagger, `/` pulse) with reduced-motion fallback
- [ ] 4 per-vertical PNG illustrations exist and are loaded by `<VerticalMark variant="illustration" />` in RoiCalculator picker + expanded VerticalTile
- [ ] v2 hero illustration replaces v1 (or v1 retained as `hero-illustration-v1.png` while v2 ships at the primary path)
- [ ] `Waveform` breathes in idle mode (40% amplitude when `playing=false`); frozen at midline under reduced-motion
- [ ] 2 `<SquiggleDivider>` placements live between Hero↓SocialProof and RevenueLeak↓Audio
- [ ] Hero image has `motion-safe:animate-bob`
- [ ] All existing 102 vitest tests still pass; ≥6 new tests covering new primitives + reduced-motion paths
- [ ] Playwright e2e + axe + visual regression baselines updated, all green
- [ ] No new console errors, no a11y violations, no 404s
- [ ] `npm run build` passes including `check:placeholders`

## 11. Implementation Phasing (indicative)

1. **Primitives:** `Reveal`, `StatCounter`, `SquiggleDivider` (TDD per primitive)
2. **Refactors:** `Waveform` breathing, `VerticalMark` variant, `tailwind.config.ts` `bob` keyframe
3. **Assets:** image-gen × 5 (4 verticals + 1 hero v2)
4. **Section wiring:** RevenueLeak, HowItWorks, FeatureStrip, TestimonialWall, Verticals, RoiCalculator (each picks up Reveal + illustrations + SquiggleDivider)
5. **Polish:** Hero bob, SocialProofLogos StatCounter
6. **Verification:** vitest, e2e, axe, visual regression baselines, reduced-motion sweep
7. **Milestone tag:** `v2-motion-illustrations`

## 12. References

- `2026-05-26-anna-reception-redesign-design.md` — v1 visual layer
- `2026-05-26-anna-reception-landing-design.md` — v3 IA + copy
- `src/lib/useScrollReveal.ts` — motion utility (already exists)
- `src/components/primitives/AnimatedNumber.tsx` — counter-roll under StatCounter
- `public/assets/redesign/hero-illustration.png` — current hero (v1) to be replaced
