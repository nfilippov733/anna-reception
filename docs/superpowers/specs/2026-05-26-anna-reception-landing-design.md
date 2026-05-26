# ANNA Reception — Landing Page Design Spec

**Date:** 2026-05-26
**Status:** Approved for implementation planning
**Product:** ANNA Reception (white-label of newo.ai, sub-brand of ANNA.money)
**Audience:** Construction/trades · Beauty salons · Pubs · Dental clinics
**Market:** Global English, pricing in GBP (£)
**Primary CTA:** Book a demo

---

## Reference inputs

- **anna.money** — visual system, voice, sub-brand parent (green primary, playful no-nonsense tone, 3D iconography, transparent pricing pattern).
- **newo.ai** — product engine (white-labelled underneath). Provides the AI agent, integrations catalogue, pricing tiers, multilingual capability, dashboard.
- **oncactus.com** — core conversion mechanics (revenue-leak framing, free-revenue-audit lead magnet, ROI calculator, "make a test call" zero-friction trial, numbers-driven copy, shorter focused page).

Cactus is single-vertical (trades) with a desert metaphor. ANNA Reception spans 4 verticals and inherits ANNA's brand — so we **borrow Cactus's mechanics, not its positioning**. The "revenue leak" framing unifies all 4 verticals: every clinic, salon, pub, and contractor loses money to missed calls.

---

## Strategic decisions (locked)

| Decision | Choice | Why |
|---|---|---|
| Vertical strategy | One page, 4 vertical sections (tile module) | Lowest SEO/content cost; matches newo.ai's proven IA |
| Geographic market | Global English | Widest TAM at launch |
| Currency | GBP (£) | ANNA-anchored; £ is globally recognisable |
| Primary CTA | Book a demo | High-intent path; user choice |
| Secondary CTAs | Free revenue audit + Make a test call | Cactus-style lead-magnet and zero-friction trial |
| Brand identity | Sub-brand of ANNA (green primary, playful no-nonsense tone, 3D iconography) | Inherits 100,000+-business trust halo |
| Pricing on page | "From £99/mo" teaser only; no full table | Drives demo bookings; full tiers inside funnel |
| Conversion approach | Trust-led ANNA halo + Cactus-style revenue-leak mechanics | Hybrid: ANNA brand, Cactus tactics |

Open tension flagged: "Global English" + "trust-led ANNA halo" weakens outside the UK. Mitigation — hero trust signals lean on universally readable proof (raw business count, Trustpilot stars, partner-logo grid). UK-specific regulators (FCA, MTD) surface only in footer fine print.

---

## 1. Information Architecture

Sixteen sections, single page, mobile-first. Sticky "Book a demo" visible from §03 onward.

```
01  Sticky header             ANNA Reception by ANNA · How it works · Pricing · Sign in
                              · "Book a demo" (primary)
                              · "Make a test call" phone chip (secondary, click-to-call)

02  Hero — leak-framed         Headline: "Stop losing revenue to missed calls."
                               Sub: "ANNA Reception answers, books, and follows up 24/7 —
                                    for dental clinics, salons, pubs, and trades."
                               CTAs: Book a demo (primary) · Get my free revenue audit (text link)
                               Trust signals: 5-star Trustpilot + "100,000+ businesses trust ANNA"

03  Social-proof logo strip   ~13 customer logos, marquee-scrolled (Cactus pattern)

04  Revenue-leak section      "Where your revenue is leaking" + 3 numbered problems with stats:
                                01 · 62% of small-business calls go unanswered → £___ lost/yr
                                02 · Web leads cool in 5 minutes → 9× drop in conversion
                                03 · Old quotes sit dead in your CRM → recoverable revenue

05  Interactive ROI calculator Inputs: vertical · avg job/ticket value · weekly call volume
                               Output: animated "£___ /month bleeding"
                                       + "ANNA Reception recovers £___"
                               CTA inline: "Get my full audit"

06  Live audio demo            30s polished call sample · play affordance · waveform animation
                               · "Read transcript" disclosure

07  How it works (3 steps)     Add your business → ANNA learns from your site → Calls answered 24/7

08  Verticals tile module      4 expandable tiles (Dental · Beauty · Pubs · Construction).
                               Collapsed: icon + hook + headline ROI stat.
                               Expanded: pain · audio sample · testimonial · integrations

09  Testimonial wall           3–5 named operators with photo, business, quote, metric

10  Feature strip (light)      6 tiles: 24/7 answer · Books in your calendar · 60+ languages
                               · SMS follow-up · Smart human transfer · 200+ integrations

11  Integrations marquee       ~20 logos: Google Calendar, Stripe, Square, Calendly, WhatsApp, etc.

12  Pricing teaser             Single card: "From £99/mo · No long contracts · Setup in 3 minutes"
                               → "Book a demo for full pricing"

13  Security & compliance      One-line row: SOC 2 Type II · GDPR · 256-bit · 99.99% uptime

14  FAQ accordion              6–8 questions, two tabs: About ANNA Reception · Setup & billing

15  Final CTA banner           "Time to stop missing calls." + demo CTA + test-call number
                               + green-squiggle decoration

16  Footer                     ANNA group nav · Reception sub-nav · social · regulatory fine print
```

**Length target:** ~6 viewport scrolls desktop, ~12 mobile.

---

## 2. Visual System

### Colour tokens

| Role | Token | Value | Use |
|---|---|---|---|
| Primary | `--anna-green` | ANNA brand green (sampled from anna.money) | CTAs, links, brand marks |
| On primary | `--on-primary` | `#0F172A` | Button labels |
| Accent | `--accent-electric` | electric blue | "AI" indicators (waveform, audio play), data-viz only |
| Surface | `--bg` | `#FFFFFF` / `#F8FAF7` | Page background, alt section banding |
| Foreground | `--fg` | `#0F172A` | Body text |
| Muted | `--fg-muted` | `#475569` | Sub-copy, captions |
| Border | `--border` | `#E2E8F0` | Card edges, dividers |
| Leak-danger | `--leak` | warm coral (softer than pure red) | Revenue-loss numbers in §04, §05 |
| Success | `--gain` | ANNA green | Revenue-recovered numbers |

Dark mode parity required (WCAG AA both modes). Use desaturated tonal variants, not inversion.

### Typography

- **Headings:** ANNA's existing display face (sampled from anna.money). Fallback: **Calistoga** for warmth.
- **Body:** **Inter** 16px base, 1.5 line-height, 65-ch max measure.
- **Numerals (ROI calc, leak figures):** tabular figures (`font-variant-numeric: tabular-nums`) to prevent layout shift as values animate.

### Iconography

- **3D rendered icons** for hero feature callouts — reuse ANNA's existing icon family pattern (`card-payment.webp`, `meter-tick.webp` style).
- **Flat SVG** (Lucide or Heroicons, single 1.5px stroke) for navigation and feature strip.
- **No emojis.** Playful tone comes from copy and illustration, never emoji.

### Motion

- 150–300ms easings; spring physics on CTA presses (scale 0.97 on press).
- Waveform animation on audio demo — continuous while playing, paused while idle.
- ROI calculator numbers animate with **counter roll** on input change (~400ms).
- `prefers-reduced-motion` — drop to instant transitions; waveform freezes to static gradient.

### Voice & tone

Sub-brand of ANNA: warm, plainspoken, slightly cheeky ("Absolutely No Nonsense Admin" pattern). Borrows Cactus's numeric muscle — every claim gets a number.

| Section | Tone |
|---|---|
| Hero | Confident, direct ("Stop losing revenue to missed calls.") |
| Leak (§04) | Blunt, almost confrontational ("Your phone rings. Nobody picks up. There goes £___ this month.") |
| Vertical tiles (§08) | Empathetic, vertical-specific ("Dentists hate missing a new-patient call. ANNA never does.") |
| Pricing, FAQ | Matter-of-fact, no salesy fluff |

**Avoid:** "revolutionize", "cutting-edge", "next-gen", "synergy", "transform your business". None appear on anna.money or oncactus.com.

---

## 3. Per-Vertical Content Matrix

All four tiles share the same shape — collapsed card → expanded reveal. Same skeleton, different content.

### 3.1 Dental clinics

| Slot | Content |
|---|---|
| Card hook | "Never miss a new patient call." |
| Headline ROI | "Avg new-patient value: **£2,400 lifetime** — one missed call = one lost patient." |
| Pain framing | New-patient enquiries spike outside 9–5. Your reception is closed; your competitors' aren't. ANNA answers at 11pm, triages urgency, books an exam. |
| Audio sample (30s) | Caller: "Hi, my crown fell out, can someone see me tomorrow?" → ANNA: empathy + triage urgency + offers same-day emergency slot + collects DOB + confirms insurance type + SMSes the address. |
| Smart behaviours | Distinguishes emergency vs routine. Asks for insurance type. Routes after-hours calls vs in-hours overflow differently. Never gives clinical advice. |
| Testimonial slot | Practice principal · business name · "X new patients captured in month 1" |
| Integrations | Dentrix · Open Dental · NexHealth · Curve · Software of Excellence · Google Calendar |
| Compliance line | HIPAA-grade controls + GDPR |

### 3.2 Beauty salons

| Slot | Content |
|---|---|
| Card hook | "Book while you blow-dry." |
| Headline ROI | "Avg booking £65 · 30% of calls come while stylists' hands are full." |
| Pain framing | Phone rings mid-colour. You can't pick up. By the time you call back, she booked round the corner. ANNA knows your menu, your stylists, your slots. |
| Audio sample (30s) | Caller: "Can I book a balayage with Jess for Saturday?" → ANNA: checks Jess's calendar, offers 11am or 3pm, confirms add-on toner question, sends a calendar invite. |
| Smart behaviours | Knows service menu + price list. Knows which stylist does what. Handles deposit-required services. SMS confirmations. |
| Testimonial slot | Salon owner · business name · "Zero missed bookings since [month]" |
| Integrations | Treatwell · Fresha · Square Appointments · Booksy · Vagaro · Google Calendar |
| Compliance line | GDPR-compliant client data handling |

### 3.3 Pubs

| Slot | Content |
|---|---|
| Card hook | "Reservations don't have to ring out." |
| Headline ROI | "Avg 4-cover table £180 · busiest service = most missed calls." |
| Pain framing | 7pm Saturday. Phone rings. Floor is in the weeds. ANNA takes the booking, checks the floor plan, confirms allergens, asks about high chairs. |
| Audio sample (30s) | Caller: "Table for 6 Friday, 7:30?" → ANNA: checks availability + offers 7pm or 8pm + asks dietary requirements + collects deposit for groups of 6+ + SMS confirmation. |
| Smart behaviours | Reservations, private hire enquiries, allergen questions, deposit collection for large groups. Routes media/press calls to landlord. |
| Testimonial slot | Pub landlord · business name · "Weekend covers up X%" |
| Integrations | OpenTable · ResDiary · SevenRooms · Toast · Square for Restaurants · Tock |
| Compliance line | PCI-compliant deposit handling via Stripe |

### 3.4 Construction / Trades

| Slot | Content |
|---|---|
| Card hook | "Win the job while you're on the roof." |
| Headline ROI | "Avg call-out £450 · 60% of trade leads call >1 number." |
| Pain framing | Hands full. Drill running. Boots in mud. ANNA picks up first, captures the job, books the diary, SMSes a quote ETA. |
| Audio sample (30s) | Caller: "My boiler is leaking, can you come today?" → ANNA: triages emergency vs non-urgent + checks diary + offers afternoon slot + SMSes address-confirmation + flags emergency to mobile. |
| Smart behaviours | Emergency triage. Postcode/territory check. Quote-ETA promise. SMS with address + arrival window. "First to call back" advantage. |
| Testimonial slot | Trade owner · business name · "X jobs booked while on-site last month" |
| Integrations | Jobber · ServiceTitan · Housecall Pro · Tradify · ServiceM8 · Xero |
| Compliance line | CIS / VAT-aware where relevant |

### 3.5 ROI calculator (§05) — per-vertical inputs

| Vertical | Inputs | Output |
|---|---|---|
| Dental | avg new-patient value · new-patient calls/week · missed-call % | £/month at risk |
| Beauty | avg ticket value · bookings/week · missed-call % | £/month at risk |
| Pubs | avg cover spend · reservations/week · missed-call % | £/month at risk |
| Construction | avg job value · enquiries/week · missed-call % | £/month at risk |

**Default vertical** when first opening the calculator: **Dental** (highest LTV → biggest leak number → most dramatic reveal).

---

## 4. Conversion Flow & CTA Paths

Three entry points to one goal (qualified demo booked); visitors self-select.

### Path A — Book a demo (primary)

```
Hero "Book a demo" → /demo form (4 fields: name · business name · vertical · phone)
  → Calendly-style slot picker → Confirmation + "Make a test call now" upsell
  → Calendar invite email + SMS reminder
```
Friction: ~90s. For decision-makers who already want AI reception.

### Path B — Free revenue audit (lead-magnet)

```
Hero/§05 "Get my free revenue audit" → /audit wizard (3 steps)
  Step 1: Pick vertical (4 tiles)
  Step 2: Inputs (avg ticket · calls/week · estimated miss %) — live £ leak animates
  Step 3: "Want the full audit emailed?" → email + phone capture → Path A confirmation
  → Email delivers 1-page PDF: their leak £ · projected ANNA recovery £ · demo CTA
```
Friction: ~3 min. For comparison shoppers, late-night researchers. The leak number becomes *their* number.

### Path C — Make a test call (zero-friction)

```
Header/Hero/Final banner "+44 XXX XXX XXXX"
  → Mobile: click-to-call. Desktop: click-to-copy.
  → Calls a live demo agent ("ANNA Reception" generic persona)
  → SMS follow-up: "Thanks for trying ANNA. Book a demo to set up yours →"
```
Friction: 30s. For sceptics ("does it really sound human?"). Hearing the AI persuades more than any feature list.

### CTA placement rules

- **Primary "Book a demo":** sticky header (all scroll), hero, after §05, after §08, §15 final banner.
- **Secondary "Free audit":** hero (text link under primary), inline §05 CTA, final banner.
- **Tertiary "Test call":** header right-side phone chip, hero subline, footer.

One primary CTA per viewport. Secondary CTAs never compete for visual weight.

### Form rules

- Demo form: 4 fields max. Inline validation on blur, not keystroke.
- Audit wizard: progressive disclosure, one decision per screen. Live £ leak number shown on Step 2 *before* asking for email.
- Both forms: vertical pre-selected if URL contains `?v=dental|beauty|pubs|construction` (paid-ad parameter).

### Tracking events

- `hero_cta_demo_clicked` · `hero_cta_audit_clicked` · `hero_cta_call_clicked`
- `audio_demo_played` · `audio_demo_completed_30s`
- `roi_calculator_started` · `roi_calculator_completed` · `roi_calculator_leak_value`
- `vertical_tile_expanded` (with vertical name)
- `pricing_teaser_clicked`
- `demo_submitted` (with vertical, source path A/B)
- `test_call_initiated` (mobile only — desktop is copy-only)

---

## 5. Responsive, Accessibility, Performance

### Breakpoints
375 · 768 · 1024 · 1440. Mobile-first. No horizontal scroll anywhere.

### Mobile specifics
- Sticky header collapses to logo + "Book a demo" pill + hamburger.
- §05 ROI calculator stacks input → result vertically; result number stays in viewport.
- §08 vertical tiles become single-column accordion (not 2×2 grid).
- §11 integrations marquee — keep horizontal, slower scroll.
- Phone chip uses `tel:` link on mobile, click-to-copy on desktop.

### Accessibility (WCAG 2.1 AA, both light + dark)

- All text ≥ 4.5:1 contrast on its background; large display headings ≥ 3:1.
- Audio demo: transcript via "Read transcript" disclosure. Required — audio is the proof; deaf users need parity.
- ROI calculator: number changes announced via `aria-live="polite"`.
- Animations respect `prefers-reduced-motion`: counter-rolls become instant, waveform freezes.
- Focus rings visible (2–4px). Never `outline: none`.
- Vertical tiles: `aria-expanded` toggles; keyboard `Enter`/`Space` opens; `Esc` closes.
- Form errors: inline + summary at top with anchor links (multi-error case).

### Performance gates

- LCP < 2.5s · CLS < 0.1 · INP < 200ms (Core Web Vitals pass).
- Hero image: WebP + AVIF with `width`/`height` declared.
- Audio demo: lazy-loaded MP3, no autoplay. ≤200 KB per sample (5 total: 1 generic + 4 vertical).
- 3D iconography: WebP (matches existing ANNA assets); preload only hero icons.
- Fonts: `font-display: swap`; preload only heading face + Inter regular.
- Integrations grid: SVG sprite, not 20 separate requests.
- ROI calculator: pure client-side calc; no API call until form submit.

---

## 6. Tech Notes & White-Label Boundaries

### From newo.ai (white-labelled)

- AI agent (voice, conversation logic, multilingual, integrations).
- Phone-number provisioning + call routing.
- 200+ integrations catalogue.
- Dashboard/admin app (re-skinned to ANNA palette + logo).
- Pricing tiers (we mirror the structure but expose only £99/mo teaser).

### Owned by ANNA

- This landing page, copy, design system, brand assets.
- `/demo`, `/audit`, `/pricing` funnel pages.
- Audit-PDF generator (server-side render with ANNA branding).
- Demo phone number for test calls (ANNA-provisioned, routed to a pre-configured newo agent).
- Analytics + attribution.
- SEO + content strategy.

### Open boundary questions (flag for product/eng)

- Does newo.ai expose an API the audit wizard can query for live pricing, or do we hardcode the £99 / £299 / £499 / £799 tiers from their public page?
- Where does the demo-booked record land — newo's CRM, ANNA's CRM, or both?
- Who handles SMS sending for audit-completion and demo-confirmation flows — ANNA's stack or newo's?
- White-label scope: does the caller hear "ANNA Reception, how can I help?" end-to-end, or does newo branding leak anywhere (e.g. dashboard footer, status pages, support emails)?

### Stack assumption (subject to ANNA's choice)

- Marketing site on **Next.js** (matches anna.money's apparent stack — SSR good for SEO and image optimization).
- **Tailwind** + ANNA's existing design tokens.
- **Framer Motion** for ROI counter-roll + waveform.
- Forms via **react-hook-form** + **Zod**.
- Hosted on Vercel (or matching existing anna.money infra).

---

## 7. Assets & Copy To Source Before Build

| Asset | Owner | Notes |
|---|---|---|
| Vertical audio samples × 4 (30s each) | Newo + ANNA marketing | Scripted per §3, recorded with production AI voice |
| Generic audio sample × 1 (hero/§06) | Newo + ANNA marketing | Most polished, neutral vertical |
| Customer logo strip × ~13 | ANNA marketing | Real customers, signed permissions |
| Testimonials × 4 (one per vertical) | ANNA marketing | Photo + name + business + quote + ROI stat |
| 3D feature icons | ANNA design | Reuse existing ANNA icon family |
| Hero device mockup | ANNA design | Phone showing live call answered + transcript |
| Integration logos × ~20 | Newo (existing assets) | SVG sprite |
| FAQ copy (~8 Qs) | ANNA copywriting | Two tabs: About / Setup & billing |
| Demo phone number | ANNA telephony | Provisioned via newo, displayed in header + footer |
| Audit-PDF template | ANNA design | 1-pager, vertical-aware, leak + recovery £ + demo CTA |

---

## 8. Out of Scope (for v1)

- Dynamic hero copy based on referrer / paid-ad source (deferred — picked Approach C, not B).
- Multilingual landing copy (Global English only at launch).
- Per-vertical deep-dive pages (only the tile module on the single page).
- Customer dashboard preview / screenshots on the landing (lives inside the demo flow).
- Comparison-vs-competitors table (newo.ai has one; we omit until we have our own positioning data).
- Blog / resources section (deferred to phase 2).
