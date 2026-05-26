# ANNA Reception — Visual Redesign Design Spec ("Editorial ANNA Warm")

**Date:** 2026-05-26 · **Revision:** v1
**Status:** Approved for implementation planning
**Companion to:** `2026-05-26-anna-reception-landing-design.md` (v3) — that doc owns IA, copy, conversion flow, vertical content. This doc owns the visual layer that wraps it.
**Mockups:** `docs/superpowers/specs/mockups/direction-{a,b,c}-*.png` (direction selection artefacts)

---

## 0. Premise

The v3 spec produced a council-approved IA, copy, and conversion architecture. Implementation shipped (all 16 sections live, tests passing). The **visual layer reads as a functional wireframe**: uniform `rounded-2xl border border-border` cards, no iconography (FeatureStrip is text-only), emoji-as-icon anti-patterns (`▶ ⏸ 📞 ▾`), placeholder rectangle in hero, no editorial type discipline, identical rhythm across all 16 sections.

This spec elevates the visual layer to production-grade without disturbing IA, copy, conversion logic, accessibility floor, or tests.

**Direction chosen:** *Editorial ANNA Warm* — the editorial discipline of Direction B (Confident Mono) wrapped in the ANNA.money brand palette of Direction A. Magazine-cover typography, generous whitespace, mono chapter markers, thin engraved-line illustrations — all sitting on warm cream surfaces with ANNA forest-green primary and sage hairline structure.

## 1. Scope & non-goals

### In scope (this redesign)
- Design system: tokens, type scale, motion language, layout rhythm
- All 16 section component visuals
- 18 component primitives (6 existing refreshed/kept/retired + 12 new)
- Replacement of every emoji-as-icon with SVG
- Stub asset generation (hero illustration, vertical marks, feature icons, decoration) via Google image-gen
- One IA addition: editorial chapter markers (01–10) above major sections
- Light mode only

### Out of scope
- IA changes beyond chapter markers (the 16 sections, their order, and the 3 CTA paths are locked from v3)
- Copy rewrites (v3 copy is council-approved; this spec adjusts chrome, not voice)
- Dark mode (tokens stay defined; visual verification pass is Phase 2)
- Real customer logos, integration logos, testimonial avatars, audio samples, Trustpilot badge — ANNA marketing owns these; we provide tasteful placeholders only where strictly needed
- White-label gate decisions (G1–G8 from v3 spec) — unaffected
- Source citations (`[source: TBD]` resolution remains v3's content task)
- Internationalisation, dark mode, mobile-app, dashboard, demo/audit funnel pages

## 2. Foundation tokens

### 2.1 Colour

Extend the existing `globals.css` token system. Keep everything that exists; add five tokens; remove one.

| Token | HSL (light) | Use | Status |
|---|---|---|---|
| `--anna-green` | `142 71% 26%` | Primary CTA, emphasised word in headline, NumberMarker, active iconography | exists |
| `--on-primary` | `0 0% 100%` | Text on primary green | exists |
| `--ink` | `155 25% 6%` | Headlines, primary body text (slightly green-tinted near-black — warmer than pure black) | **NEW** |
| `--fg` | `222 47% 11%` | Mid-weight body (kept for compatibility) | exists |
| `--fg-muted` | `215 16% 47%` | Sub-copy, captions | exists |
| `--cream` | `100 33% 98%` | Section background (warm off-white) — alias for existing `--bg-alt` | exists |
| `--cream-deep` | `100 25% 95%` | Banded sections, marquee bg, hero panel | **NEW** |
| `--sage` | `142 18% 55%` | Hairlines, dividers, muted brand accents, open-quote glyph | **NEW** |
| `--sage-mute` | `142 12% 75%` | Card borders, replacing the cold `--border` for component edges | **NEW** |
| `--border` | `220 13% 91%` | Kept only for legacy edges where neutral grey is correct | exists |
| `--leak` | `16 90% 40%` | Revenue-loss numerals (§04, §06) — one moment per page max | exists |
| `--gain` | `142 71% 26%` | Recovery numerals (= `--anna-green`) | exists |
| `--mono-label` | `155 15% 35%` | Mono kicker labels (`01 — WHY ANNA RECEPTION`), tech chips | **NEW** |
| ~~`--accent-electric`~~ | ~~`217 91% 60%`~~ | **Remove** — electric blue conflicts with green trust-halo; nothing in the spec uses it once the waveform recolours | **REMOVE** |

Dark-mode token block in `globals.css` stays defined but is not visually verified this phase.

### 2.2 Typography

Three font families, all already loaded via `next/font`:

- **Calistoga** (display, serif) — `--font-display`, exists
- **Inter** (body, sans) — `--font-inter`, exists
- **JetBrains Mono** (labels + tech chips) — `--font-mono`, **NEW** (one Google Font addition)

Type scale (Tailwind classes):

| Tier | Family | Size (mobile → desktop) | Tracking | Line-height | Use |
|---|---|---|---|---|---|
| Display-XL | Calistoga | `text-5xl md:text-7xl lg:text-8xl` (48→72→96px) | `tracking-tight` | `1.05` | Hero headline + at most two designated "moments" per page (pricing price in §12, closing headline in §15) |
| Display-LG | Calistoga | `text-4xl md:text-6xl` (36→64px) | `tracking-tight` | `1.1` | Section H2 |
| Display-MD | Calistoga | `text-3xl md:text-5xl` (30→48px) | `tracking-tight` | `1.15` | Subsection H3, oversized pricing |
| Display-italic | Calistoga italic | inherits parent | inherits | inherits | One emphasised word in a headline |
| Lead | Inter 400 | `text-lg md:text-xl` (18→20px) | normal | `1.55` | Hero subhead, lead paragraphs |
| Body | Inter 400 | `text-base` (16px) | normal | `1.65` | Default body |
| Caption | Inter 500 | `text-sm` (14px) | normal | `1.5` | Helper text, captions |
| Mono-kicker | JetBrains Mono 500 | `text-xs` (12px) | `tracking-[0.18em]` uppercase | `1` | Chapter labels (`01 — WHY ANNA RECEPTION`) |
| Mono-chip | JetBrains Mono 400 | `text-xs tabular-nums` (12px) | normal | `1` | Tech chips (`00:23`, `dental`, `+44 …`) |

**Rules:**
- All numerals representing money/counts/durations: `tabular-nums`
- All headlines: `text-balance` (modern CSS; ignored gracefully where unsupported)
- All body paragraphs: `max-w-prose` (65ch)
- Emphasis in headlines: italic, never colour. Colour emphasis (`text-anna-green`) reserved for a single word in the hero only (e.g. *losing*).

### 2.3 Layout & rhythm

- `max-w-page` (1280px) container — unchanged
- Section vertical padding alternates between **deep** (`py-24 md:py-32`) and **medium** (`py-16 md:py-20`) for editorial pacing. Banded sections (logos, marquee, audit banner) get `py-8 md:py-12`.
- **Hairline vertical column dividers** visible only on `>lg` viewports. Two thin `border-sage/20` lines at the page-content gutters give the page a magazine-grid undertone without being heavy.
- **Hairline horizontal dividers between major sections** use `border-sage/30`.
- Card chrome philosophy: **remove most cards**. Default to typography + whitespace as the structure. Where a card is required (audio-demo panel, pricing teaser, vertical tile, testimonial), use `border-sage-mute` (subtle warm border), no shadow, no fill — let the cream surface show through.

### 2.4 Motion (calm)

| Animation | Duration | Easing | Reduced-motion fallback |
|---|---|---|---|
| Button press | 220ms | `ease-out`, `scale-[0.97]` | Static |
| AnimatedNumber counter-roll | 360ms | `ease-out` | Instant value set |
| Accordion expand | 220ms | `ease-out`, height + opacity | Instant toggle |
| Scroll-reveal (one-shot per viewport) | 480ms | `ease-out`, fade + 12px translate-y, 60ms stagger across siblings | All elements visible immediately |
| Hover sage-border highlight | 150ms | `ease-out`, border-color only — no lift, no scale | Static (no hover effect) |
| Waveform (audio playing) | continuous | sine-bar | Frozen mid-gradient |
| Sticky CTA slide-up | 200ms | `ease-out` | Snap-toggle |

**Forbidden:**
- Parallax (the page reads as text, not as a scene)
- Magnetic cursor, gradient-mesh backgrounds, ambient hero animations
- Page-load reveals on H1 (the hero is editorial; it must be readable immediately)
- Any motion that fights the plainspoken voice

All motion respects `prefers-reduced-motion`. Tests must cover this (a Playwright reduced-motion smoke already exists; extend it).

## 3. Primitives — refresh + new

| # | Primitive | Status | Change / definition |
|---|---|---|---|
| 1 | `Button` | refresh | Replace hover `brightness-95` with explicit `bg-anna-green-hover` token (one shade darker). Confirm spring scale on press. |
| 2 | `AccordionItem` | refresh | Replace `▾` unicode caret with Lucide `<ChevronDown>` SVG; rotate-animate on open; replace `border-border` with `border-sage-mute` |
| 3 | `PhoneChip` | refresh | Replace 📞 emoji with Lucide `<Phone>` SVG; `border-sage/40`; tabular-nums on the number |
| 4 | `Waveform` | refresh | Recolour: linear gradient from `--anna-green` to a lighter sage tip. Remove `--accent-electric` reference. Slight rhythm variance (mix sine + offset) |
| 5 | `AnimatedNumber` | keep | Tighten to 360ms / ease-out |
| 6 | `MissingAsset` | retire | Replace every usage with a real stub from the asset-generation pass, or with semantic SVG fallback |
| 7 | `Kicker` | **new** | Renders mono-kicker text (`01 — WHY ANNA RECEPTION`). Props: `number?: string`, `label: string`. Used by `SectionShell`. |
| 8 | `Eyebrow` | **new** | Mini-label above subsection H3. Sage colour, normal mono casing. |
| 9 | `PlayButton` | **new** | SVG play/pause toggle in a 56×56 ANNA-green pill. Subtle pulsing ring when idle (respects reduced-motion). Replaces `▶/⏸` unicode. |
| 10 | `Tag` | **new** | Mono chip for `00:23`, `dental clinic`, `+44 …`. Sage hairline border, no fill, 24px height. |
| 11 | `NumberMarker` | **new** | Display-italic ANNA-green numeral (`01`, `02`, `03`) for editorial step markers. Display-MD size by default. |
| 12 | `PullQuote` | **new** | Large testimonial quote treatment. Sage open-quote glyph (oversized italic Calistoga `"`), body in Display-MD italic, attribution in Inter regular below. |
| 13 | `LinkArrow` | **new** | Inline link with thin `→` (Lucide `<ArrowRight>`), sage hover. For "or hear ANNA take a call →" style affordances. |
| 14 | `Hairline` | **new** | Sage horizontal divider — `<hr className="border-sage/30" />` wrapped for consistency. Also has a vertical variant for column dividers. |
| 15 | `SectionShell` | **new** | Wrapper component that normalises every major section. Props: `kicker?: { number: string; label: string }`, `heading: ReactNode`, `subhead?: ReactNode`, `children`. Handles section padding, max-width, kicker rendering, and scroll-reveal wiring. |
| 16 | `Logo` | **new** | SVG mark — `AR` monogram (engraved-line) + wordmark `ANNA Reception`. Used in header and footer. |
| 17 | `FeatureIcon` | **new** | Thin-stroke SVG icon component, sourced from stub-asset set. 32×32 box, `stroke-current`. |
| 18 | `VerticalMark` | **new** | Engraved-line illustration per vertical (4 stubs). Used in §06 vertical picker and §08 tiles. 48×48 box. |

All new primitives ship with vitest tests covering: render, a11y, reduced-motion, keyboard behaviour where interactive.

## 4. Per-section visual moves

The IA, copy, and conversion logic of each section is unchanged from v3. This table describes only the visual treatment.

| § | Section | Visual treatment |
|---|---|---|
| 01 | Header | SVG `<Logo>` replaces text wordmark. Sage hairline below header. Phone chip uses new SVG. On scroll-past-hero, header shrinks `py-3 → py-2`, surface stays `bg-cream/90 backdrop-blur`. |
| 02 | **Hero** | `Kicker 01 — AI RECEPTIONIST · UK`. Display-XL headline on two lines, one word italic (`losing`). Lead 18-20px Inter. Two CTAs (green pill + ghost outline). Trust strip: 5-star SVG + Trustpilot label + ANNA halo line on one row. Right column: engraved-line phone-with-waves illustration (stub asset). Subtle scroll-affordance `↓ keep reading` in mono below CTAs on desktop only. |
| 03 | SocialProofLogos | `bg-cream-deep`. Slower marquee (45s). Eyebrow `TRUSTED BY UK SMBs` in mono-kicker style. Logos remain `MissingAsset` until ANNA marketing ships real ones. |
| 04 | **RevenueLeak** | `Kicker 02 — WHERE THE LEAK IS`. Display-LG headline. Three stat *stanzas* (not cards): `NumberMarker` italic green + headline + body + mono source caption. One coral `--leak` accent allowed in the first stanza's number. No card chrome. |
| 05 | **AudioDemo** | `Kicker 03 — HEAR ANNA TAKE A REAL CALL`. Display-LG headline. Large editorial card (sage hairline only). `PlayButton` SVG. `Waveform` in ANNA-green gradient. `LinkArrow` "Read transcript" disclosure. Below the card: "Or hear her live yourself" + sage-bordered `PhoneChip`. |
| 06 | **RoiCalculator** | `Kicker 04 — SEE YOUR LEAK IN 30 SECONDS`. Display-LG headline. Step 1 vertical picker: 4 large tiles with `VerticalMark` engraved illustrations, no card chrome until hover (sage border appears). Step 2 inputs: borderless until focus, then sage ring. Output panel: leak number in Display-XL coral, gain number in Display-MD ANNA-green directly below. `LinkArrow` "Get my full audit". |
| 07 | **HowItWorks** | `Kicker 05 — SET UP IN THREE MINUTES`. Display-LG headline. Three `NumberMarker` stanzas connected by a thin sage hairline-curve running through them (SVG, simple cubic Bézier). No card chrome. |
| 08 | **VerticalsTileModule** | `Kicker 06 — BUILT FOR HOW YOU ACTUALLY RUN`. Display-LG headline. 4 tile rows with sage-hairline dividers between (no outer card). Collapsed: `VerticalMark` + hook + headline ROI. Expanded: smooth height animation (220ms), background gets `bg-cream-deep` tint, pain + audio sample + testimonial + integrations + compliance line stack vertically. |
| 09 | **TestimonialWall** | `Kicker 07 — WHAT OPERATORS TELL US`. Display-LG headline. Magazine grid: one large `PullQuote` (the strongest) spanning 2 columns + three smaller testimonials below. Open-quote glyph sage italic. Attribution: name + role + business + metric in mono. |
| 10 | FeatureStrip | No kicker (it's a specs strip). Six features as a 3×2 grid (desktop) / 2×3 (tablet) / 1×6 (mobile). Each: `FeatureIcon` engraved-line + title (Inter 500) + body (Inter 400 muted). Sage-hairline grid lines between cells. No card chrome. |
| 11 | IntegrationsMarquee | `bg-cream-deep`. Mono caption above marquee: `200+ INTEGRATIONS · ALWAYS GROWING`. Logos remain `MissingAsset` until shipped. |
| 12 | **PricingTeaser** | `Kicker 08 — HONEST PRICING`. Display-LG headline. Then the price treatment: `From £99–£299/mo` in Display-XL (this *is* the hero of this section). Mono caption directly below: `DEPENDING ON CALL VOLUME · NO LONG CONTRACTS · SETUP IN 3 MINUTES`. Single sage-hairline rectangle around the price block (no fill). Green pill CTA below. |
| 13 | AuditReEntryBanner | Slim row with sage hairlines above and below. One sentence in Lead + ghost CTA `LinkArrow` style. |
| 14 | **FaqAccordion** | `Kicker 09 — QUESTIONS, THEN?`. Display-LG headline. SVG chevron in `AccordionItem`. Sage hairline dividers between Q's. Open state: question stays bold ink, answer in body-muted. |
| 15 | **FinalCtaBanner** | `Kicker 10 — TIME TO STOP MISSING CALLS`. Full-bleed `bg-cream-deep` slab (not green — let the green primary live on the CTA itself). Display-XL headline centered. Green pill CTA + `PhoneChip` in a centered row. ANNA green-squiggle decoration in one corner (single signature touch). |
| 16 | Footer | `Logo` monogram top-left. Existing 4-column structure preserved. Sage divider above the legal fine-print line. All link hover states use `text-anna-green underline`. |

## 5. Asset generation (image-gen, ~$0.40)

Generated stubs (saved to `public/assets/redesign/`):

1. **Hero illustration** — engraved-line phone with concentric sound waves, two-channel composition, transparent background, 1600×1200 — for §02 hero right column
2. **VerticalMark × 4** — engraved-line illustrations:
   - `dental.svg` — stylised tooth
   - `beauty.svg` — scissors + comb
   - `gastro.svg` — fork + knife
   - `trades.svg` — hammer + spanner
   — each 256×256 box, transparent
3. **FeatureIcon × 6** — engraved-line icons (consistent stroke width):
   - `clock-24-7.svg` — 24/7 answering
   - `calendar.svg` — booking
   - `sms.svg` — SMS follow-up
   - `transfer.svg` — smart human transfer
   - `deposit.svg` — Stripe deposit
   - `integrations.svg` — integrations
   — each 96×96 box, transparent
4. **Green squiggle decoration** — single SVG-traced ANNA-style flourish for §15 corner
5. **HowItWorks connector** — handled in component code via inline SVG, not image-gen

**Not generated (ANNA marketing-sourced or licensed):**
- Customer logos × ~13
- Integration logos × ~20 (most are public brand assets)
- Testimonial avatars × 4 (real photos)
- Trustpilot 5-star badge SVG (download from Trustpilot brand kit)
- Audio samples × 5

Image-gen prompts and outputs land in `docs/superpowers/specs/mockups/assets/` (then SVG-traced and committed to `public/assets/redesign/`).

## 6. Accessibility — what changes

The v3 a11y floor is preserved. The redesign improves it in two specific ways:

1. **Removes every emoji-as-icon** (`▶ ⏸ 📞 ▾`) — screen readers no longer announce them inconsistently across platforms. All replaced by `aria-hidden` SVGs with descriptive button/link labels.
2. **Adds proper kicker semantics** — `Kicker` renders as `<p aria-hidden="true">` so it doesn't pollute screen-reader heading hierarchy. The section's H2 remains the only h-level marker.

All other a11y guarantees from v3 stand:
- ≥4.5:1 contrast on all text against its background (sage tokens calibrated for this — verify with axe after build)
- Visible focus rings (2-4px) preserved on every primitive
- Reduced-motion respected across all animations (table in §2.4)
- Keyboard navigation: Enter/Space on accordion, Tab order in calculator, Esc closes expanded tiles
- ARIA live regions on calculator number changes — preserved

## 7. Performance — what changes

| Metric | Constraint | Spec impact |
|---|---|---|
| LCP | < 2.5s | Hero illustration must be ≤80KB optimised SVG; if raster, preload + WebP |
| CLS | < 0.1 | All new images declare `width`/`height`; chapter kickers reserve their line height in CSS |
| INP | < 200ms | Scroll-reveal uses `IntersectionObserver` (one-shot), not `scroll` event |
| Bundle | Minimise | Lucide icons tree-shaken individually (`import { Phone } from "lucide-react"`); JetBrains Mono subset to Latin Basic |
| Fonts | `font-display: swap` | Already enforced via `next/font`; add JetBrains Mono with same swap |

Lighthouse target: ≥95 Performance, ≥95 Accessibility, ≥95 Best-Practices, ≥95 SEO on desktop and ≥90 on mobile.

## 8. Suggested implementation phasing

This spec produces the design; the **plan doc** (next step) will break this into ordered tasks. Indicative phasing for that plan:

1. **Foundation:** tokens (extend `globals.css`, `tailwind.config.ts`), type primitives, motion utilities, new primitive components (`Kicker`, `Eyebrow`, `Tag`, `NumberMarker`, `Hairline`, `SectionShell`, `LinkArrow`, `PullQuote`, `PlayButton`, `Logo`, `FeatureIcon`, `VerticalMark`). All shipped with tests.
2. **Primitive refresh:** `Button`, `AccordionItem`, `PhoneChip`, `Waveform`, `AnimatedNumber` — update with new tokens and icon swap. Existing tests must still pass.
3. **Asset generation:** generate the 11 stubs via image-gen, SVG-trace where applicable, commit to `public/assets/redesign/`.
4. **Section pass 1 (above-the-fold):** Header, Hero, RevenueLeak, AudioDemo, RoiCalculator. End-to-end Playwright snapshot.
5. **Section pass 2 (mid-page):** HowItWorks, VerticalsTileModule, TestimonialWall, FeatureStrip.
6. **Section pass 3 (closing):** IntegrationsMarquee, PricingTeaser, AuditReEntryBanner, FaqAccordion, FinalCtaBanner, Footer.
7. **Polish & verification:** axe a11y pass, Lighthouse perf pass, reduced-motion sweep, mobile breakpoint sweep, keyboard/screen-reader sweep, visual regression snapshots committed.

## 9. Acceptance criteria

The redesign is complete when:

- [ ] All emoji-as-icon usages replaced with SVG (`▶ ⏸ 📞 ▾`)
- [ ] Every major section (§02, §04, §05, §06, §07, §08, §09, §12, §14, §15) renders a `Kicker` chapter marker
- [ ] No section uses the legacy `rounded-2xl border border-border` pattern as its primary structure (typography is structure)
- [ ] All 18 primitives exist with passing vitest tests
- [ ] Hero right column renders a real engraved-line illustration (stub or final)
- [ ] FeatureStrip (§10) renders 6 thin-line icons (stub or final)
- [ ] RoiCalculator (§06) vertical picker renders 4 `VerticalMark` illustrations
- [ ] Playwright e2e suite passes (including reduced-motion + axe smoke)
- [ ] Lighthouse: Perf ≥95 / A11y ≥95 / BP ≥95 / SEO ≥95 (desktop), ≥90 (mobile)
- [ ] Visual regression: 5 viewport snapshots (375, 768, 1024, 1440, 1920) committed
- [ ] `MissingAsset` component is no longer rendered on any production code path (it may remain in code as a dev/test affordance)
- [ ] No `[source: TBD]` literal text appears in compiled output (G8 from v3 — enforced; this redesign does not block on resolving content, only on the chrome being ready to host resolved citations)

## 10. References

- **v3 spec** — `2026-05-26-anna-reception-landing-design.md` (IA, copy, conversion, vertical content)
- **Direction mockups** — `mockups/direction-a-editorial-warm.png`, `mockups/direction-b-confident-mono.png`, `mockups/direction-c-audio-first-technical.png`
- **Direction chosen** — synthesis: Direction B's editorial discipline + Direction A's ANNA palette
- **External brand anchors** — ANNA.money (palette, voice, sub-brand parent), Cactus (revenue-leak mechanics + minimalism)
- **UX rules applied** — touch ≥44pt, contrast ≥4.5:1, reduced-motion respected, no emoji-as-icon, semantic color tokens (via ui-ux-pro-max audit)
