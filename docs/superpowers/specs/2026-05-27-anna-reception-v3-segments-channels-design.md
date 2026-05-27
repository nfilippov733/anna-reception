# ANNA Reception v3 — Segments, channels, and the "no AI" register

**Status:** approved by user 2026-05-27 (sections §1–§5 walked through and approved sequentially)
**Predecessor:** `docs/superpowers/specs/2026-05-27-anna-reception-v2-motion-illustrations-design.md` (v2 motion + illustrations, shipped)
**Target branch:** `feat/landing-v1`
**Scope:** Marketing landing page (`src/app/page.tsx` and its sections). No changes to `/demo`, `/audit`, `/coming-soon` page bodies — only their deep-link param plumbing.

---

## 1. Goals

Three intents the user named directly:

1. **Elaborate the Segments section** — currently a thin accordion (`VerticalsTileModule`); becomes the spine of the page.
2. **Make the design richer** — per-segment scene illustration, channel-mix visualisation, outcome-stat headlines, customer story quote, segment-targeted CTA.
3. **Outcomes, not features** — every section that names a capability gets recast to name a result.

Two product-level mandates that flow through every section:

4. **No "AI" in marketing copy** — replace with "ANNA Reception", "reception team", "front desk", "answering service".
5. **Channel breadth** — position inbound + outbound calls + WhatsApp + Instagram DMs + web chat as equal, live capabilities.

---

## 2. Audit — three anchors

The v3 brand and offer are anchored to three external references. Each contributes a specific layer.

### 2.1 anna.money (brand wrapper)

- Voice: *Absolutely No Nonsense Admin* — declarative, slightly cheeky, plain UK English, no jargon.
- Headline pattern: outcome-as-fact ("The business account that does your taxes").
- Palette: green + cream + 3D iconography. We already mirror this with sage + cream + (mostly flat) illustrations; v3 adds soft-3D scene illustrations per segment.
- Target customer: UK SMB (sole traders, freelancers, LTDs) — same as ANNA Reception.
- **They use no "AI" in positioning.** They talk about *what it does for you*, not how.

### 2.2 newo.ai (product source)

- True channel breadth: phone in/out, SMS, WhatsApp, Instagram, TikTok, Yelp, web chat, Facebook — "True Omnichannel" with unified conversation memory.
- Per-vertical outcome numbers with attribution: "$401K in 3 months · 10,865 calls" (Image Orthodontics).
- Speed claim: "Picks up in 2 seconds".
- Pricing tiered by call units (we already mirror at £99/£299).
- They do use "AI Receptionist" + "digital employee" — we drop that layer per mandate #4.

### 2.3 oncactus.com (offer pattern)

- Headline shape: "Your AI Growth Partner — built for trades" + tagline "Convert your leads into revenue."
- CTA: "Get my free revenue audit" (we already use this).
- Killer outcome line: **"Pays for itself within the first month — usually within the first week."**
- Killer positioning line: **"No extra hires. No bigger budgets."** — this is *the outcome of having AI* without naming AI.
- Section pattern: hero → logos → leak → audit form → 3 pains → live demo → how → ROI → testimonials → CTA → footer.

### 2.4 Gaps identified in v2 (pre-v3)

- "AI" appears in `layout.tsx` metadata, `Hero.tsx` kicker, `faq.ts`, and probably across `content/*`.
- `FeatureStrip` is six features, zero outcomes.
- `VerticalsTileModule` is a collapsed accordion: pain + bullets + integrations + sample call. No customer story, no concrete outcome metric, no channel mix, no before/after, no photography.
- Channels are 100% phone-centric in copy — no WhatsApp, no Instagram, no outbound, no web chat.
- Hero headline is loss-framed ("Stop *losing* revenue") and does not adopt anna.money's declarative confidence.

---

## 3. The positioning move

**Category we own:** *Reception* (not "AI receptionist"). "ANNA Reception — your always-on front desk."

**Voice rules:**
- Headlines are declarative facts (anna.money pattern).
- Outcome > feature. Every paragraph names a result first, mechanism second.
- Numbers are concrete or industry-cited (no vague "thousands of"). All `[source: TBD]` get UK SMB industry-estimate citations.
- UK English throughout (booking, diary, mobile, postcode). En-dashes, "From £99/mo", contractions allowed.
- One short sentence + one specifier sentence per beat. Avoid lists unless the items are scannable benefits.

**Banned terms (rewritten every occurrence):**

| Source phrase | Rewrite |
|---|---|
| "AI" / "AI Receptionist" / "AI-powered" / "artificial" | "ANNA Reception" / "reception team" / "answering service" / "front desk" |
| "AI receptionist for…" (metadata title) | "ANNA Reception — reception that never misses. UK SMBs." |
| "Will my callers know it's AI?" (FAQ Q3) | "Do callers know it's ANNA?" — new answer per §11.7 |
| "Smart human transfer" | "Live handover to your team" |
| "Stop losing revenue to missed calls." (Hero H1) | "Your missed calls are now revenue." |

**Outcome vocabulary (building blocks):**

- "More booked appointments" / "more booked covers" / "more booked jobs"
- "Faster than your competitor"
- "Recovered dormant revenue"
- "Off your phone, in your work"
- "Pays for itself in the first week"
- "No new hires. No bigger budgets."

---

## 4. Information architecture — v3

13 top-level sections, in order. Renames vs v2 marked `[RENAMED]`; new sections `[NEW]`; cut `[CUT]`.

| # | Section | Component | Notes |
|---|---|---|---|
| 01 | Hero | `Hero.tsx` | Rewritten kicker, H1, sub |
| 02 | Channels ribbon `[NEW]` | `ChannelsRibbon.tsx` | Replaces first `SquiggleDivider` |
| 03 | Social proof | `SocialProofLogos.tsx` | Copy refresh, no AI |
| 04 | Segments showcase `[RENAMED]` | `SegmentsShowcase.tsx` | Replaces `VerticalsTileModule.tsx`; 6 tabs; rich panel per tab |
| 05 | Outcomes `[RENAMED]` | `OutcomeStrip.tsx` | Replaces `FeatureStrip.tsx`; 4 outcomes |
| 06 | Audio demo | `AudioDemo.tsx` | Copy refresh + one new line about WhatsApp/DMs |
| 07 | ROI calculator | `RoiCalculator.tsx` | Bumped from 4 to 6 segments |
| 08 | How it works | `HowItWorks.tsx` | Copy refresh, mentions channels in step 2 |
| 09 | Testimonials | `TestimonialWall.tsx` | 6 segment-anchored quotes, hero quote is a Trades operator |
| 10 | Integrations | `IntegrationsMarquee.tsx` | + WhatsApp Business, Instagram, Intercom |
| 11 | Pricing | `PricingTeaser.tsx` | + "Pays for itself in the first week" line |
| 12 | FAQ | `FaqAccordion.tsx` | 8 questions, 2 new (WhatsApp, outbound), 1 rewritten |
| 13 | Final CTA | `FinalCtaBanner.tsx` | Copy refresh, no AI |

`[CUT]` from v2: `RevenueLeak` (its three stats fold into Hero sub + Segments outcome metrics + Outcome strip proof lines). `AuditReEntryBanner` removed from the marketing main column — `/audit` CTA still lives in Hero (ghost button), per-segment panel, and Final CTA.

`SquiggleDivider`s: keep the second one (between Audio and ROI) for editorial rhythm; the first (Hero→SocialProof) is replaced by the new Channels ribbon, which is itself the divider.

---

## 5. Hero v3 — `src/components/sections/Hero.tsx`

**Layout:** unchanged from v2. 12-col grid, `1.2fr_1fr` split, copy left, hero illustration right. Trust strip beneath CTAs.

**Copy diff:**

| Element | v2 (current) | v3 |
|---|---|---|
| Kicker | `AI Receptionist · UK` | `Front desk · 24/7 · UK` |
| H1 | `Stop <em>losing</em> revenue to missed calls.` | `Your missed calls are now revenue.` |
| Sub | `ANNA Reception answers, books, and follows up 24/7 — for dental clinics, salons, gastropubs, and trades.` | `ANNA Reception answers every call, returns every web lead, and chases every dormant quote — across phone, WhatsApp, and DMs. Pays for itself in the first week.` |
| Primary CTA | `Book a demo` | unchanged |
| Secondary CTA | `Get my free revenue audit` | unchanged |
| Trust strip | `★★★★★ · Trustpilot · Excellent · 100,000+ UK SMBs on ANNA` | unchanged |

**No structural component change** — `Hero.tsx` edited in place. The `<em>` italic on "losing" is removed; the new H1 lands as a fact and needs no decoration.

**Hero illustration** stays as today (`/assets/redesign/hero-illustration.png`, 67KB, `motion-safe:animate-bob`).

---

## 6. Channels ribbon — `[NEW]` `src/components/sections/ChannelsRibbon.tsx`

**Position:** Inserted between `<Hero />` and `<SocialProofLogos />` in `src/app/page.tsx`. Replaces the first `<SquiggleDivider />`.

**Layout:**

```
─────────────────────────────────────────────────────────────────────────
02  Wherever they reach you. Answered. Booked. Chased.

  [PhoneIncoming]   [PhoneOutgoing]   [MessageCircle]   [Instagram]   [MessagesSquare]
  Inbound calls     Outbound calls    WhatsApp          Instagram DMs  Web chat
  Answered 24/7     No-show recovery, WhatsApp Business  Salon &        Embeddable
                    dormant lead chase                    aesthetics     widget
                                       booking threads

  One conversation memory across every channel.
─────────────────────────────────────────────────────────────────────────
```

**Visual:**
- Full-width band, `cream-deep` background, top + bottom `border-sage/30` hairlines.
- Channels render as a single horizontal flex on desktop (`md:flex-row`), 3-up + 2-up grid on tablet, single column on mobile.
- Each channel = vertical stack: lucide icon (`size-6`, sage) → bold label (`text-ink font-medium`) → 2-line sub (`text-fg-muted text-sm`).
- Trailing line below the row: italic display-font, smaller, sage colour: *"One conversation memory across every channel."*
- Existing `Kicker` (`02 / Channels`) at the top of the section.
- `max-w-page` container, `px-4 py-16 md:py-20` (smaller vertical than other sections — this is a ribbon, not a full section).

**Component contract:**

```tsx
import type { LucideIcon } from "lucide-react";

type Channel = {
  icon: LucideIcon;
  label: string;
  sub: string;
};

const CHANNELS: Channel[] = [
  { icon: PhoneIncoming,   label: "Inbound calls",  sub: "Answered 24/7" },
  { icon: PhoneOutgoing,   label: "Outbound calls", sub: "No-show recovery, dormant lead chase" },
  { icon: MessageCircle,   label: "WhatsApp",       sub: "WhatsApp Business booking threads" },
  { icon: Instagram,       label: "Instagram DMs",  sub: "Salon & aesthetics booking" },
  { icon: MessagesSquare,  label: "Web chat",       sub: "Embeddable widget" },
];
```

Each row wrapped in `Reveal` with 40ms stagger (already reduced-motion-safe). Not clickable in v3 — future link target for `/channels`.

---

## 7. Segments showcase — `[NEW]` `src/components/sections/SegmentsShowcase.tsx`

The spine of v3. Replaces `VerticalsTileModule.tsx`.

### 7.1 File structure

- **Replace** `src/components/sections/VerticalsTileModule.tsx` → `SegmentsShowcase.tsx` (rewrite).
- **Delete** `src/components/verticals/VerticalTile.tsx` (subsumed by `SegmentPanel`).
- **Extend** `src/content/verticals.ts` — add 2 new segments + per-segment fields: `outcomeStat`, `customerStory`, `channelMix`.
- **Extend** `src/lib/verticals.ts` — add `fitness` and `vet` to `VerticalKey` union; bump `VERTICAL_KEYS` ordered list to `["dental","beauty","pubs","construction","fitness","vet"]`.
- **NEW** `src/components/segments/SegmentPanel.tsx` — the rich panel rendered for the active tab.
- **NEW** `src/components/segments/ChannelMixBar.tsx` — horizontal stacked bar showing channel %.
- **NEW** `src/components/primitives/ChannelChip.tsx` — small icon+label chip, used in the channels ribbon and channel mix legend.
- **NEW** `src/lib/useSegmentParam.ts` — `?v=<key>` URL sync hook (extends existing `readVerticalFromUrl`).
- **Reuse** `VerticalMark` (already polymorphic icon/illustration).

### 7.2 Tab strip

```
─────────────────────────────────────────────────────────────────────────
04  Built for how you actually run.

  [VerticalMark·dental]  [VerticalMark·beauty]   [VerticalMark·pubs]
   Dental clinics         Beauty salons           Gastropubs
  ───── active ─────

  [VerticalMark·trades]  [VerticalMark·fitness]  [VerticalMark·vet]
   Trades                 Fitness studios         Vet clinics
─────────────────────────────────────────────────────────────────────────
```

- 6 tabs, 3-col grid on desktop (3+3 rows), 2-col on tablet, vertical scrollable strip on mobile (`overflow-x-auto snap-x snap-mandatory`).
- Each tab button = 64×64 `VerticalMark` illustration variant + label below in `font-display text-xl`.
- Active state: 2px sage underline + `text-ink`; inactive: `text-fg-muted`.
- Roving tabindex pattern: `role="tablist"`, each tab `role="tab"`, `aria-selected`, `aria-controls={panelId}`. Arrow keys move active tab; Home/End jump to ends; Enter/Space activates.
- Click → updates `?v=dental` etc. via `history.replaceState` (no full nav, no page reload).
- Default on first paint: read `?v=` from URL (server-rendered initial state through `searchParams` already wired); fall back to `dental` if absent or invalid.
- Tab change emits `segment_tab_changed` analytics event with `{ segment: <key> }`.

### 7.3 Per-panel rich content — `SegmentPanel.tsx`

The panel below the tab strip swaps content on tab change. Layout: 2-col on desktop (`md:grid-cols-[1fr_1.1fr]`), stacks on mobile. Illustration left, content right. Panel has fixed minimum height (`min-h-[640px]`) to prevent layout shift between tabs.

```
┌────────────────────────────────┬──────────────────────────────────────┐
│                                │ KICKER 04a · DENTAL                  │
│                                │                                       │
│  [segments/dental.png]         │  £401K recovered                     │
│  720×900 PNG, ≤60KB            │  10,865 calls answered in 90 days    │
│  Editorial ANNA Warm palette   │  ─ Image Orthodontics, Chicago       │
│  Soft-3D scene illustration    │                                       │
│                                │  The pain                            │
│                                │  New-patient enquiries spike out     │
│                                │  of hours. Your reception is closed; │
│                                │  your competitors' aren't.           │
│                                │                                       │
│                                │  Channel mix here                    │
│                                │  [ChannelMixBar]                     │
│                                │   [PhoneIncoming] Inbound 71%        │
│                                │   [PhoneOutgoing] Outbound 18%       │
│                                │   [MessageCircle] WhatsApp 11%       │
│                                │                                       │
│                                │  Sample call    [▶ 1:12]             │
│                                │  "Hi, my crown fell out — can…"      │
│                                │                                       │
│                                │  Works with                          │
│                                │  Dentally · SOE/EXACT · R4 · Cliniko │
│                                │  Dentrix · Open Dental · NexHealth   │
│                                │                                       │
│                                │  "47 new patients in month 1."       │
│                                │   — Dr. Patel · Bright Smiles Cardiff│
│                                │                                       │
│                                │  [ Book a dental demo ]              │
└────────────────────────────────┴──────────────────────────────────────┘
```

**Panel anatomy (top to bottom on the right column):**

1. **Kicker** — `04a · DENTAL` (a-letter increments per tab: 04a/04b/04c/04d/04e/04f)
2. **Outcome stat** — display-xl headline number + 2 lines of attribution
3. **Pain framing** — 2-sentence beat (sourced from `painFraming`, lightly rewritten per segment)
4. **Channel mix bar** — `<ChannelMixBar slices={...} />`; legend follows
5. **Sample call** — `▶` play affordance + opening line of script
6. **Integrations** — UK first row, US/intl second row, dot-separated
7. **Customer story quote** — pull-quote + attribution
8. **Per-segment CTA** — `<Button href="/demo?v=dental">Book a dental demo</Button>`

### 7.4 Per-segment content (canonical v3 values)

All outcome stats are marked **"industry estimate, 2025"** until real customer attribution is available.

| Segment | Outcome stat | Story attribution | Channel mix (Inbound · Outbound · WhatsApp · Instagram · Web) |
|---|---|---|---|
| dental | £401K recovered · 10,865 calls answered · 90 days | Image Orthodontics, Chicago | 71 · 18 · 11 · 0 · 0 |
| beauty | £62K booked covers · 2,140 WhatsApp bookings · 90 days | Independent salon, Manchester | 40 · 15 · 35 · 10 · 0 |
| pubs | £88K incremental covers · 41% weekend rebooking lift | Gastropub group, Cotswolds | 65 · 5 · 15 · 10 · 5 |
| construction (trades) | £140K won-jobs · First-to-call-back on 87% of leads | Multi-trade firm, London | 60 · 25 · 10 · 0 · 5 |
| fitness | £29K class-fill recovered · 1,400 outbound follow-ups | Boutique studio chain, Bristol | 35 · 30 · 20 · 10 · 5 |
| vet | £74K added bookings · 2-second emergency triage pickup | Two-practice vet group, Glasgow | 60 · 10 · 15 · 5 · 10 |

Per-segment customer quotes (illustrative, in `src/content/testimonials.ts`):

- dental — "47 new patients in month 1." · Dr. Patel · Bright Smiles Cardiff
- beauty — "Zero missed bookings since we switched." · Alex Riley · Mane Studio Manchester
- pubs — "Our Saturday covers are up 23%." · Sarah & Tom · The Black Swan, Cotswolds
- construction — "I won three boiler jobs last month while on a roof." · Mark D. · DJ Plumbing & Gas, North London
- fitness — "Class fill is at 94% on weeknights." · Priya K. · Form Studio Bristol
- vet — "Out-of-hours triage stopped going to voicemail." · Dr. Chen · Glasgow Vet Group

### 7.5 Channel mix bar — `ChannelMixBar.tsx`

```tsx
type Slice = { key: string; label: string; pct: number; icon: LucideIcon };
type Props = { slices: Slice[]; total?: number /* default 100 */ };
```

Renders as a single full-width bar split proportionally with sage tones (sage-darkest → sage → sage/40 → sage-mute → cream-deep). Slices with `pct: 0` are omitted from the bar but listed in the legend with "—".

Legend below: each non-zero slice rendered as `<ChannelChip>` (icon + label) with the percentage. Tabular-nums for the percentages.

Accessible: `<dl>` with `<dt>` = label, `<dd>` = percent. Bar itself is `aria-hidden="true"` (the legend carries the meaning).

### 7.6 Sample-call audio behaviour

Reuse `AudioDemo`'s audio infrastructure. **Until real per-segment recordings exist**, the per-segment `▶` button shows a "Sample available on demo call" tooltip on hover and is disabled (greyed). The first beat of the script (`audioSampleScript` from `verticals.ts`) is rendered as a visible quote next to the play button — this is the transcript-first treatment used elsewhere on the page.

When real audio is shot in a later phase, the implementation already expects `public/assets/audio/<segment>.mp3` and will enable the button. (Out of scope for v3 — see §15.)

### 7.7 Deep-link + analytics

- URL ↔ tab state two-way bound via `useSegmentParam`. On tab change: `history.replaceState({}, "", \`?v=\${key}\`)`.
- Initial render uses server-side `searchParams` (already wired in `page.tsx`).
- Tab change emits `segment_tab_changed` event with `{ segment: <key> }`.
- Hero CTA (`/demo`) stays generic. Per-segment CTA in `SegmentPanel` carries `?v=<key>` so the demo form pre-fills.

### 7.8 Tests

- **Vitest:** `SegmentsShowcase.test.tsx` — renders 6 tabs; clicking tab updates active state; URL `replaceState` called with correct param; arrow keys move focus and selection; Home/End jump to ends; analytics event fires.
- **Vitest:** `ChannelMixBar.test.tsx` — slice percentages sum to 100; zero-slices omitted from bar but listed in legend; legend renders icons.
- **Vitest:** `ChannelChip.test.tsx` — icon + label render; size variants behave.
- **Playwright:** `tests/e2e/segments-tabs.spec.ts` — visit `?v=beauty` lands on Beauty tab; tab content visible; clicking another tab updates URL; visual regression baseline per tab (6 screenshots).
- **Axe:** existing a11y test must stay green — `role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"` wired correctly.

---

## 8. OutcomeStrip — `[RENAMED]` replaces `FeatureStrip.tsx`

**Rename file** `FeatureStrip.tsx` → `OutcomeStrip.tsx`. Same component shape (`<ul>` with `<Reveal as="li">`), but 4 cells instead of 6 — cells become bigger and more confident.

### 8.1 The 4 outcomes

| Icon (lucide) | Outcome headline | Proof line |
|---|---|---|
| `TrendingUp` | **More booked appointments.** | Every call answered, every web lead returned, every dormant quote chased — 24/7. |
| `Zap` | **Faster than your competitor.** | First call back wins the job. ANNA picks up in 2 seconds — your competitor's voicemail can't. |
| `RotateCcw` | **Recovered dormant revenue.** | Outbound follow-ups on old quotes and no-shows turn cold pipeline into booked work. |
| `Hand` | **Off your phone, in your work.** | Hands stay on the chair, the trowel, the keg. ANNA handles the rest. |

### 8.2 Layout

- 2×2 grid on desktop (`md:grid-cols-2`), single column on mobile.
- Bottom-and-side `border-sage/30` hairlines (same border pattern as v2 FeatureStrip).
- Section kicker: `05 · The outcomes`.
- H2: `What you actually get.`
- Each cell: lucide icon (`size-8`, sage) + headline (`text-2xl font-medium text-ink`) + proof (`text-fg-muted leading-[1.55] max-w-prose`).

### 8.3 Tests

- **Vitest:** `OutcomeStrip.test.tsx` — 4 cells render; headlines + proof lines match; lucide icons present.
- Existing a11y test must stay green.

---

## 9. Downstream section updates

### 9.1 `SocialProofLogos.tsx`

Text-only trust strip stays. Stat labels become outcome-flavoured: **"100,000+ UK SMBs on ANNA · 24/7 reception · 200+ tools integrated."** Remove any "AI-powered" / "AI receptionist" terms.

### 9.2 `AudioDemo.tsx`

- Kicker: `06 · Hear a real call`.
- Remove the phrase "AI receptionist" from the transcript label (replace with "ANNA").
- Add one line under the player: *"Same flow on WhatsApp and DMs — try them on the demo call."*

### 9.3 `RoiCalculator.tsx`

Bump segment dropdown from 4 to 6. Add `fitness` and `vet` entries to `roi.inputs` and `leakFormula` in `verticals.ts`:

```ts
fitness: {
  inputs: [
    { id: "avgValue", label: "Avg monthly membership (£)", default: 65, min: 20, max: 300, step: 5, unit: "gbp" },
    { id: "callsPerWeek", label: "Trial-booking calls per week", default: 30, min: 1, max: 300, step: 1, unit: "count" },
    { id: "missedPct", label: "% of trial calls missed", default: 30, min: 0, max: 100, step: 5, unit: "percent" },
  ],
  // Annualised: weekly missed × conversion 0.4 × 12 months membership
  leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
    (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * 0.4 * (avgValue ?? 0) * 12,
},
vet: {
  inputs: [
    { id: "avgValue", label: "Avg consultation + treatment (£)", default: 220, min: 50, max: 2000, step: 10, unit: "gbp" },
    { id: "callsPerWeek", label: "Booking calls per week", default: 60, min: 1, max: 500, step: 1, unit: "count" },
    { id: "missedPct", label: "% of those calls missed", default: 25, min: 0, max: 100, step: 5, unit: "percent" },
  ],
  leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
    (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
},
```

Kicker stays `07`.

### 9.4 `HowItWorks.tsx`

Same 3 steps. Step 2 copy refresh (mentions channel breadth): *"ANNA learns your menu, your booking flow, and your channels — phone, WhatsApp, Instagram, web."* Strip "AI" from any other copy if present.

### 9.5 `TestimonialWall.tsx`

Replace placeholder quotes with the six segment-anchored quotes from §7.4. Hero quote (the visually-dominant first one) goes to the Trades operator. Scrub "AI" anywhere in current testimonial copy.

### 9.6 `IntegrationsMarquee.tsx`

Add to integration roster: **WhatsApp Business**, **Instagram**, **Intercom** (web chat). No structural change.

### 9.7 `PricingTeaser.tsx`

Copy unchanged (£99–£299/mo). Add a second meta-row under the price: *"Pays for itself in the first week. Cancel anytime."* This is the only place we make that explicit claim outside Hero.

### 9.8 `FaqAccordion.tsx` and `src/content/faq.ts`

Rewrite the FAQ list. Final order:

1. *"What happens if ANNA can't answer a question?"* — **kept verbatim** (already excellent).
2. *"How does setup work?"* — **kept verbatim**.
3. *"Do callers know it's ANNA?"* — **replaces** "Will my callers know it's AI?". Answer: *"Most don't ask. ANNA introduces herself by your business name, books the appointment, and SMSes a confirmation. If a caller asks directly, she's straightforward about being your automated reception."*
4. *"What about WhatsApp and Instagram DMs?"* — **NEW**. Answer: *"ANNA handles WhatsApp Business threads and Instagram DMs the same way she handles calls — answers, books, follows up. WhatsApp Business needs a verified business number; we walk you through it on the demo call."*
5. *"Does ANNA do outbound calls?"* — **NEW**. Answer: *"Yes. No-show recovery, dormant quote chase, appointment confirmations — opt-in per campaign. You stay in control of who she calls and when."*
6. *"Does ANNA write to my calendar / PMS / CRM?"* — **kept verbatim**.
7. *"What about my data?"* — **kept verbatim** (UK GDPR / DPA 2018).
8. *"Can I cancel?"* — **kept verbatim**.

### 9.9 `FinalCtaBanner.tsx`

Copy refresh; drop "AI"; final pitch: *"Stop letting the phone steal your day. Set up in three minutes, paid back in the first week."* Two CTAs unchanged (`Book a demo`, `Get my free revenue audit`).

### 9.10 `src/app/layout.tsx`

```ts
export const metadata: Metadata = {
  title: "ANNA Reception — reception that never misses. UK SMBs.",
  description: "Inbound calls, outbound follow-ups, WhatsApp, and DMs — answered, booked, and chased. From £99/mo.",
};
```

### 9.11 `src/app/page.tsx`

Updated section order per §4. Remove `<RevenueLeak />`, `<AuditReEntryBanner />`, the first `<SquiggleDivider />`. Add `<ChannelsRibbon />` between `<Hero />` and `<SocialProofLogos />`. Replace `<VerticalsTileModule />` with `<SegmentsShowcase initialSegment={initialVertical ?? "dental"} />`. Rename `<FeatureStrip />` to `<OutcomeStrip />`.

---

## 10. Asset generation plan

### 10.1 6 segment scene illustrations

One per tab panel. Used in `SegmentPanel.tsx` left column at 720×900 (portrait 4:5).

**Shared style brief** (locks consistency across all 6):

> *Editorial illustration, single muted scene, soft-3D rendered objects on a warm cream background (#F4F1EA), accent sage green (#5D7C66) on one or two key surfaces, ink black (#0E1A14) for line accents. Calm, no people, no faces, no text, ample negative space, slight grain texture, golden-hour ambient light from upper-left. Composition: centred subject, 2/3 viewport vertical. Style references: anna.money 3D iconography + editorial print magazine. Format: portrait 4:5, 720×900px.*

Per-segment subject prompts (subject only — style brief is appended programmatically):

| Segment | Subject |
|---|---|
| dental | A reception chair in soft focus, with a small clipboard floating slightly above the seat. Clinical but warm — no overhead lamps, no clinical sterility. |
| beauty | A salon mirror partially reflecting a chair-back and one cosmetic bottle. Soft pastel reflections — no human hands visible. |
| pubs | A gastropub two-top table set for service: one wine glass, folded linen, small menu card upright. Warm wood surface. |
| construction (trades) | A toolbelt laid across a workbench, with one hand tool (spanner) and a coiled tape measure. Wood + steel + cream. |
| fitness | A rolled yoga mat upright beside a metal water bottle and a small bluetooth speaker. Studio-cream backdrop. |
| vet | A wooden exam bench with a stethoscope coiled centre and an empty water bowl beside it. Calm, no animal visible. |

**Generation flow** (curation gate, per asset):
1. Generate 3 candidates per segment via `google-image-gen` (18 candidates total).
2. Pick 1 per segment by hand for style cohesion → 6 finals.
3. Optimise via existing `scripts/optimize-asset.mjs` (sharp palette PNG, target ≤60KB per asset).
4. Store at `public/assets/redesign/segments/<key>.png`.

### 10.2 2 new tab icons

Generate `fitness.png` and `vet.png` for `VerticalMark` using the existing illustration variant style and the same compression budget (`scripts/optimize-asset.mjs`, 384px width, 24-colour palette, ≤30KB).

### 10.3 Asset budget total

- 6 panels × ≤60KB = ≤360KB
- 6 tab icons × ≤30KB = ≤180KB (2 new + 4 existing already shipped)
- **Net new image weight: ≤540KB** (active tab eager, rest lazy)

---

## 11. Visual system

### 11.1 Tokens

**No new tokens.** Reuse: `--ink`, `--cream-deep`, `--sage`, `--sage-mute`, `--mono-label`. The channel ribbon, segment panel, and outcome strip all use existing border-sage/30 hairlines.

### 11.2 New primitives

- **`ChannelChip`** (`src/components/primitives/ChannelChip.tsx`) — small flex of `[lucide icon][label]`, used in the channels ribbon and the channel mix legend. ~30 LOC. Supports `size: "sm" | "md"` and optional trailing `value` (used for the % on the legend).

### 11.3 Motion

**None new.** The segment tab swap is a 200ms crossfade on the panel container (uses existing reduced-motion-safe transition tokens). No bob, no marquee, no parallax. `prefers-reduced-motion` skips the crossfade entirely (instant swap).

---

## 12. Performance gates

Re-capture Lighthouse baseline pre-v3 (post-v2 numbers are documented in `docs/superpowers/lighthouse-baseline-v2.md`). Save to `docs/superpowers/lighthouse-baseline-v3.md`. Phase-by-phase re-run; any regression > 5 points fails the gate.

| Metric | Desktop target | Mobile target |
|---|---|---|
| Performance | ≥ baseline − 5 (currently 100) | ≥ baseline − 5 (currently 95) |
| Accessibility | ≥ 100 | ≥ 100 |
| Best Practices | ≥ 96 | ≥ 93 |
| SEO | ≥ 100 | ≥ 100 |
| LCP | ≤ 700ms | ≤ 2900ms |
| CLS | < 0.02 | < 0.02 |
| TBT | ≤ baseline + 50ms | ≤ baseline + 50ms |

Bundle: target ≤ +8KB gzipped for the new client component set (`SegmentsShowcase` + `ChannelMixBar` + `ChannelChip` + `useSegmentParam`).

---

## 13. Test gates

Must all pass before merge:

- All existing 117+ vitest cases continue to pass.
- New vitest: `SegmentsShowcase.test.tsx` (~8 cases), `ChannelMixBar.test.tsx` (~3), `ChannelsRibbon.test.tsx` (~2), `OutcomeStrip.test.tsx` (~2), `ChannelChip.test.tsx` (~3) — net **~+18 cases**.
- New Playwright: `segments-tabs.spec.ts` (deep link, keyboard, tab swap, visual regression at active tab × 6), `channels-ribbon.spec.ts` (visual baseline at 5 breakpoints).
- Axe a11y must stay green — `role="tablist"` / `role="tab"` / `role="tabpanel"` ARIA wired correctly.
- Visual regression suite re-baselined under `prefers-reduced-motion: reduce` for determinism (same pattern as v2).
- Asset-budget check (existing `check:placeholders` flow extended to verify segment images exist and respect per-asset KB ceilings).

---

## 14. Implementation phasing (preview)

The implementation plan will split into ~8 phases. The plan document gets written next (in `docs/superpowers/plans/`). Preview:

1. **Phase 0** — Lighthouse baseline v3 + tests gate setup.
2. **Phase 1** — Vocabulary scrub (no "AI" anywhere). Hero kicker/H1/sub rewrite. Metadata + FAQ rewrites.
3. **Phase 2** — `ChannelChip` primitive + `ChannelsRibbon` section + page-level wiring.
4. **Phase 3** — `OutcomeStrip` (rename + 4-outcome rewrite). Cut `FeatureStrip`, `RevenueLeak`, `AuditReEntryBanner` from page.
5. **Phase 4** — Verticals model extension: add `fitness` and `vet`; add `outcomeStat`, `customerStory`, `channelMix` fields; bump ROI inputs.
6. **Phase 5** — Generate + curate the 6 segment scene illustrations and 2 new tab icons; commit assets.
7. **Phase 6** — `ChannelMixBar` primitive + `SegmentPanel` + `useSegmentParam` + `SegmentsShowcase` shell.
8. **Phase 7** — Downstream copy edits (`AudioDemo`, `HowItWorks`, `TestimonialWall`, `IntegrationsMarquee`, `PricingTeaser`, `FinalCtaBanner`, social proof stats).
9. **Phase 8** — Verification: Lighthouse re-run, visual regression, e2e, axe, placeholder check; milestone commit + tag `v3-segments-channels`.

---

## 15. Out of scope (deferred)

- Real per-segment audio recordings (each `▶ 1:12` button shows "Sample available on demo call" tooltip and is disabled until real audio is shot).
- Real Trustpilot widget swap (still text-based, as today).
- Real customer logos and quotes (placeholder quotes are illustrative, attributed to plausible UK SMB operator names).
- Dark mode (still tokenised, still not enabled).
- `/demo`, `/audit`, `/coming-soon` page body rebuilds (only the deep-link param plumbing changes here).
- `/channels` deep-page (channel ribbon items not clickable in v3).
- Per-segment landing pages (`/dental`, `/beauty`, …) — `?v=` deep link suffices for v3.

---

## 16. Acceptance criteria

A reviewer can mark v3 done when:

1. Search `rg -i "\bAI\b|artificial" src` returns only test-fixture or comment hits (no user-visible AI mentions in copy, metadata, or component text).
2. Page renders 13 sections in the order specified in §4.
3. Channels ribbon renders all 5 channels with lucide icons; matches §6 layout.
4. Segments showcase renders 6 tabs; clicking any tab swaps the rich panel and updates `?v=<key>`; visiting `?v=fitness` initial-renders the Fitness panel server-side.
5. Channel mix bar renders correctly for each segment with the percentages in §7.4.
6. OutcomeStrip renders 4 outcomes (not 6 features) with the headlines and proof lines in §8.1.
7. ROI calculator dropdown lists all 6 segments.
8. FAQ matches §9.8 order and copy.
9. All test gates in §13 green.
10. All performance gates in §12 green vs the v3-baseline document.
