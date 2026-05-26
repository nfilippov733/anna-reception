# ANNA Reception — Landing Page Design Spec

**Date:** 2026-05-26 · **Revision:** v3 (post-verification-council)
**Status:** Approved for implementation planning
**Revision notes:**
- **v2 (first council pass):** Reviewed by a 4-agent council (UX, Product, Critical-Thinker, Vertical-Expert). UK-first pivot, gastropub scoping, HIPAA→UK-aligned compliance, ROI ranges + source policy, trust-signal rewrite, §05 ↔ §06 swap, hero audit CTA → ghost button, integrations rebalanced UK-first, §3.4 CIS/VAT category-error fix, deposit-at-booking added (dental + beauty), human-in-the-loop fail-safe added, white-label open questions → launch-acceptance gates.
- **v3 (verification council pass):** Same 4 reviewers re-read v2. Applied: dropped "HIPAA-aligned for US" from §3.1 on UK-first launch (T1a); fixed §7 ↔ §14 FAQ drift (T1b); corrected dental integrations — Practice-Web moved to US row, Kodak duplicate removed, Cliniko + Systems for Dentists added (T1c); rewrote NHS payment-route phrasing (T1d, "NHS is not a membership plan"); feature strip reduced 7→6 tiles, dropped "60+ languages" for UK-first (T1e); added §13 audit re-entry banner replacing the removed compliance row (T1f + T2c); rewrote gastropub deposit copy (T1g, "8+ covers / private hire"); added build-time guard G8 for `[source: TBD]` tokens (T1h); pricing teaser gained range qualifier "£99–£299/mo" (T2a); test-call dropped from hero (T2b, zone discipline); §13 SOC2/uptime claims removed pending ANNA-owned certifications (T2c); deposit-at-booking copy hedged with "where your booking system supports it" (T3c). Decisions held: keep all 4 verticals equal launch (T3a); keep gastropub tile (T3b).
**Product:** ANNA Reception (white-label of newo.ai, sub-brand of ANNA.money)
**Audience:** Construction/trades · Beauty salons · Gastropubs · Dental clinics
**Market:** UK-first for v1; pricing in GBP (£). Internationalise in phase 2.
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
| Geographic market | UK-first for v1 | Cleans up brand/currency/trust/integrations coherence; phase 2 internationalises |
| Currency | GBP (£) | Matches UK-first launch |
| Primary CTA | Book a demo | High-intent path; user choice |
| Secondary CTAs | Free revenue audit + Make a test call | Cactus-style lead-magnet and zero-friction trial |
| Brand identity | Sub-brand of ANNA (green primary, playful no-nonsense tone, 3D iconography) | Inherits ANNA's UK SMB trust halo |
| Pricing on page | "From £99–£299/mo" teaser only; no full table | Drives demo bookings while filtering bad-fit leads |
| Conversion approach | Trust-led ANNA halo + Cactus-style revenue-leak mechanics | Hybrid: ANNA brand, Cactus tactics |
| ICP scope | All 4 verticals launch equally (no beachhead) | Trust the multi-vertical IA to self-segment via tile module + paid-ad URL params |
| Pubs scope | Gastropubs / reservation-led only (not wet-led) | Wet-led pubs don't take reservations; targeting would dilute conversion |

---

## 1. Information Architecture

Sixteen sections, single page, mobile-first. Sticky "Book a demo" engages at hero scroll-past (not section-gated).

```
01  Sticky header             ANNA Reception by ANNA · How it works · Pricing · Sign in
                              · "Book a demo" (primary)
                              · "Make a test call" phone chip (secondary, click-to-call)

02  Hero — leak-framed         Headline: "Stop losing revenue to missed calls."
                               Sub: "ANNA Reception answers, books, and follows up 24/7 —
                                    for dental clinics, salons, gastropubs, and trades."
                               CTAs: Book a demo (primary, solid green) ·
                                     Get my free revenue audit (ghost button, same height)
                               Trust signals: 5-star Trustpilot
                                              + "From the team behind 100,000+ business accounts"

03  Social-proof logo strip   ~13 customer logos, marquee-scrolled (Cactus pattern)

04  Revenue-leak section      "Where your revenue is leaking" + 3 numbered problems with stats:
                                01 · 62% of small-business calls go unanswered → £___ lost/yr
                                02 · Web leads cool in 5 minutes → 9× drop in conversion
                                03 · Old quotes sit dead in your CRM → recoverable revenue
                              [Source citations under each stat — see §3.5 for source policy]

05  Live audio demo            30s polished call sample · play affordance · waveform animation
                               · "Read transcript" disclosure
                              [Moved before the calculator: proof first, then personalise]

06  Interactive ROI calculator Step 1: Vertical picker (auto-select if URL has `?v=`)
                               Step 2: Inputs (avg job/ticket value · weekly call volume ·
                                      missed-call % — pre-filled with vertical-typical defaults)
                               Output: animated "£___ /month bleeding"
                                       + "ANNA Reception recovers £___"
                               CTA inline: "Get my full audit"

07  How it works (3 steps)     Add your business → ANNA learns from your site → Calls answered 24/7

08  Verticals tile module      4 expandable tiles (Dental · Beauty · Gastropubs · Construction).
                               Collapsed: icon + hook + headline ROI stat.
                               Expanded: pain · audio sample · testimonial · integrations

09  Testimonial wall           3–5 named operators with photo, business, quote, metric

10  Feature strip (light)      6 tiles: 24/7 answer · Books in your calendar · SMS follow-up
                               · Smart human transfer (with full call context)
                               · Deposit at booking (Stripe via SMS, where supported)
                               · 200+ integrations
                              [60+ languages dropped for UK-first v1; restore in phase 2]

11  Integrations marquee       ~20 logos: Google Calendar, Stripe, Square, Calendly, WhatsApp, etc.

12  Pricing teaser             Single card: "From £99–£299/mo (depending on call volume) ·
                               No long contracts · Setup in 3 minutes"
                               → "Book a demo for full pricing"
                              [Range qualifier added per PM review — filters bad-fit leads
                               before they reach the demo team]

13  Audit re-entry banner     Slim row: "Skipped the calculator? Get your free revenue audit →"
                               + single ghost-button audit CTA
                              [Closing-zone toehold for comparison-shopper Path B per UX review]
                              [Old §13 'Security & compliance' row removed — claims are
                               newo.ai's, not ANNA's; surfacing them as ANNA's risks
                               misrepresentation. Re-add when ANNA owns the certifications.]

14  FAQ accordion              6–8 questions, single flat accordion (no tabs — tabs-in-accordion is double disclosure per UX review). Must include one question on the human-transfer fail-safe.

15  Final CTA banner           "Time to stop missing calls." + demo CTA (primary)
                               + test-call number (tertiary, no audit CTA here)
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
| Leak-danger | `--leak` | warm coral (softer than pure red) | Revenue-loss numbers in §04, §06 |
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

**Always surface (the #1 buyer objection — front-foot it):** "When ANNA can't answer, she transfers to your team with the full transcript in 1 SMS." Appears as a feature-strip tile (§1 §10), as a sentence in §6 tech notes, and once in the FAQ (§14).

---

## 3. Per-Vertical Content Matrix

All four tiles share the same shape — collapsed card → expanded reveal. Same skeleton, different content.

### 3.1 Dental clinics

| Slot | Content |
|---|---|
| Card hook | "Never miss a new patient call." |
| Headline ROI | "Avg new-patient lifetime value: **£1,800–£3,000** *[source: TBD]* — one missed call = one lost patient." |
| Pain framing | New-patient enquiries spike outside 9–5. Your reception is closed; your competitors' aren't. ANNA answers at 11pm, triages urgency, books an exam. |
| Audio sample (30s) | Caller: "Hi, my crown fell out, can someone see me tomorrow?" → ANNA: empathy + triage urgency + offers same-day emergency slot + collects DOB + confirms payment route (NHS band + exemption status / Denplan or Practice Plan / private / US insurance) + SMSes the address. |
| Smart behaviours | Distinguishes emergency vs routine · confirms payment route · routes after-hours vs in-hours overflow differently · **takes deposit at booking via Stripe SMS (where your booking system supports it)** · never gives clinical advice. |
| Testimonial slot | Practice principal · business name · "X new patients captured in month 1" |
| Integrations | **UK:** Dentally · SOE/EXACT · Carestream R4 · Systems for Dentists · Cliniko · **US/intl:** Dentrix · Open Dental · NexHealth · Curve · Practice-Web · Google Calendar |
| Compliance line | UK GDPR & DPA 2018 · ISO 27001-aligned (re-add HIPAA when US launches in phase 2) |

### 3.2 Beauty salons

| Slot | Content |
|---|---|
| Card hook | "Book while you blow-dry." |
| Headline ROI | "Avg booking £40–£90 · 30% of calls come while stylists' hands are full *[source: TBD]*." |
| Pain framing | Phone rings mid-colour. You can't pick up. By the time you call back, she booked round the corner. ANNA knows your menu, your stylists, your slots. |
| Audio sample (30s) | Caller: "Can I book a balayage with Jess for Saturday?" → ANNA: checks Jess's calendar, offers 11am or 3pm, confirms add-on toner question, sends a calendar invite. |
| Smart behaviours | Knows service menu + price list · knows which stylist does what · **takes deposit at booking via Stripe SMS for colour/extension services (where your booking system supports it)** · SMS confirmations. |
| Testimonial slot | Salon owner · business name · "Zero missed bookings since [month]" |
| Integrations | **UK/EU:** Phorest · Timely · Treatwell · Fresha · Booksy · **US:** Square Appointments · Vagaro · Google Calendar |
| Compliance line | UK GDPR & DPA 2018-compliant client data handling |

### 3.3 Gastropubs (reservation-led only — not wet-led)

| Slot | Content |
|---|---|
| Card hook | "Reservations don't have to ring out." |
| Headline ROI | "Avg 4-cover gastro table £140–£220 · busiest service = most missed calls *[source: TBD]*." |
| Pain framing | 7pm Saturday. Phone rings. Floor is in the weeds. ANNA takes the booking, checks the floor plan, confirms allergens, asks about high chairs. |
| Audio sample (30s) | Caller: "Table for 6 Friday, 7:30?" → ANNA: checks availability + offers 7pm or 8pm + flags dietary requirements for the kitchen + SMS confirmation. (For 8+ covers or private hire she adds: "We take a small deposit via SMS to hold the booking — alright?") |
| Smart behaviours | Reservations · private hire enquiries · **flags dietary requirements (FSA 14-allergen) at booking; confirmed at service** · **deposit via Stripe SMS for private hire / 8+ covers** · routes media/press calls to landlord. |
| Testimonial slot | Pub landlord · business name · "Weekend covers up X%" |
| Integrations | OpenTable · ResDiary · SevenRooms · Toast · Square for Restaurants · Tock |
| Compliance line | PCI-compliant deposit handling via Stripe |
| Not for | Wet-led pubs that don't take reservations — those don't have a leak this product fixes. Stated explicitly in copy to filter wasted demos. |

### 3.4 Construction / Trades

| Slot | Content |
|---|---|
| Card hook | "Win the job while you're on the roof." |
| Headline ROI | "Avg repair £180 · avg install £1,200 · 60% of trade leads call ≥2 numbers *[source: TBD]*." |
| Pain framing | Hands full. Drill running. Boots in mud. ANNA picks up first, captures the job, books the diary, SMSes a quote ETA. |
| Audio sample (30s) | Caller: "My boiler is leaking, can you come today?" → ANNA: "Is the stop-tap off? Is water reaching the boiler housing?" — triages emergency vs non-urgent + checks diary + offers afternoon slot + SMSes address-confirmation + flags emergency to mobile. |
| Smart behaviours | Emergency triage (stop-tap, isolation, safety qs) · postcode/territory check · quote-ETA promise · SMS with address + arrival window · "first to call back" advantage · **captures Gas Safe / NICEIC number on quote enquiries** · clean handoff to Xero/QuickBooks. |
| Testimonial slot | Trade owner · business name · "X jobs booked while on-site last month" |
| Integrations | **UK:** simPRO · Commusoft · Joblogic · Fergus · Powered Now · Tradify · **US/intl:** Jobber · Housecall Pro · ServiceM8 · Xero · (ServiceTitan listed but enterprise — not the £99/mo persona) |
| Compliance line | UK GDPR & DPA 2018 |

### 3.5 ROI calculator (§06) — per-vertical inputs

| Vertical | Inputs | Output |
|---|---|---|
| Dental | avg new-patient value · new-patient calls/week · missed-call % | £/month at risk |
| Beauty | avg ticket value · bookings/week · missed-call % | £/month at risk |
| Gastropubs | avg cover spend · reservations/week · missed-call % | £/month at risk |
| Construction | avg job value · enquiries/week · missed-call % | £/month at risk |

**No default vertical.** Step 1 is a vertical picker (4 tiles). If URL has `?v=dental|beauty|pubs|construction`, that vertical auto-selects. Otherwise the picker waits. No anchoring with someone else's economics.

**Source policy for stat citations:** every headline ROI number in §3.1–§3.4 and every input default in this calculator must cite an industry-body source in small-print (`*[Source: X 2025]*`). Placeholders marked `*[source: TBD]*` must be resolved before launch — list owner: ANNA marketing.

---

## 4. Conversion Flow & CTA Paths

Three entry points to one goal (qualified demo booked); visitors self-select.

### Path A — Book a demo (primary)

```
Hero "Book a demo" → /demo form (5 fields: name · business name · vertical · phone · email)
  → Calendly-style slot picker → Confirmation + "Make a test call now" upsell
  → Calendar invite email + SMS reminder
```
Friction: ~90s. For decision-makers who already want AI reception. Email field is mandatory — the calendar-invite promise depends on it.

### Path B — Free revenue audit (lead-magnet)

```
Hero/§06 "Get my free revenue audit" → /audit wizard (3 steps)
  Step 1: Pick vertical (4 tiles, or auto-from `?v=`)
  Step 2: Inputs (avg ticket · calls/week · estimated miss %) — live £ leak animates
          [leak number visible BEFORE the email gate — proof first, capture second]
  Step 3: "Want the full audit emailed?" → email + phone capture
  → Thank-you screen: "Audit on its way. While you wait, hear ANNA take a call →"
    (inline Path C test-call CTA — no force-funnel into Path A)
  → Email delivers 1-page PDF: their leak £ · projected ANNA recovery £ · demo CTA inside the PDF
```
Friction: ~3 min. For comparison shoppers, late-night researchers. The leak number becomes *their* number. The PDF carries the demo CTA; the thank-you screen does not bait-and-switch into a demo form.

### Path C — Make a test call (zero-friction)

```
Header phone chip / §05 audio-demo module / §15 final banner / footer "+44 XXX XXX XXXX"
  → All platforms: `tel:` link (click-to-copy fallback on legacy desktop browsers).
  → Calls a live demo agent ("ANNA Reception" generic persona)
  → SMS follow-up: "Thanks for trying ANNA. Book a demo to set up yours →"
```
Friction: 30s. For sceptics ("does it really sound human?"). Hearing the AI persuades more than any feature list.

### CTA placement rules

- **Primary "Book a demo":** sticky header (engages at hero scroll-past), hero (solid green), after §06 ROI calc, after §08 verticals, §15 final banner.
- **Secondary "Free audit":** hero (**ghost button** at same height as primary — promoted from text link per UX review), inline §06 CTA. *Not* repeated in the final banner.
- **Tertiary "Test call":** header right-side phone chip, §05 audio-demo module, footer. **Not in the hero** — zone discipline.

One primary CTA per viewport. Final banner shows only **demo + test-call** (audit lives inside the PDF, not in the closing banner — keeps the closer focused).

**Zone discipline (PM call):**
- Hero zone = book demo.
- Calculator zone (§06) = audit.
- Audio-demo zone (§05) = test call.
Each zone has one primary, no triple-stacked CTAs anywhere.

### Form rules

- Demo form: 5 fields (name · business name · vertical · phone · email). Inline validation on blur, not keystroke.
- Audit wizard: progressive disclosure, one decision per screen. Live £ leak number shown on Step 2 *before* asking for email.
- Both forms: vertical pre-selected if URL contains `?v=dental|beauty|pubs|construction` (paid-ad parameter).

### Tracking events

- `hero_cta_demo_clicked` · `hero_cta_audit_clicked` · `header_cta_call_clicked` (phone chip, not hero)
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
- §06 ROI calculator stacks input → result vertically; result number stays in viewport.
- §08 vertical tiles become single-column accordion (not 2×2 grid).
- §11 integrations marquee — keep horizontal, slower scroll.
- Phone chip uses `tel:` link on all platforms (modern desktop OSes route to FaceTime/Phone Link/Skype). Click-to-copy is a fallback only on browsers without `tel:` handler, surfaced as a "Copy number" microcopy beneath the chip.

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

### Pre-launch acceptance gates (NOT implementation details — launch blockers)

Each of these is a launch blocker per PM review. Resolve before public soft-launch, not during.

| # | Gate | Risk if unresolved |
|---|---|---|
| G1 | Does newo.ai expose a pricing API the audit wizard can query, or do we hardcode the £99 / £299 / £499 / £799 tiers? | Hardcoded tiers drift; API dependency adds infra risk. Pick one, document it. |
| G2 | Where does the demo-booked record land — newo's CRM, ANNA's CRM, or both? | Attribution, sales ownership, follow-up SLA all depend on this. |
| G3 | Who handles SMS sending for audit-completion and demo-confirmation flows — ANNA's stack or newo's? | Sender ID, opt-in compliance, deliverability monitoring. |
| G4 | **White-label scope: does the caller hear "ANNA Reception, how can I help?" end-to-end, or does newo branding leak (dashboard footer, status pages, support emails, SMS sender)?** | Single most dangerous gate. If newo leaks anywhere customer-visible, the ANNA trust promise breaks. Audit every touchpoint. |
| G5 | Who owns the demo phone number? ANNA-provisioned via Twilio/newo, or a shared newo pool number? | Affects portability and SLA. |
| G6 | Incident escalation — when the AI fails on a call, who gets paged: ANNA support, newo support, or the customer's nominated number? | Customer-facing failure ownership. |
| G7 | Data processor terms — is ANNA the controller and newo the processor (likely), and is the DPA signed? | UK GDPR Article 28 compliance. |
| G8 | **Build-time guard for `[source: TBD]` tokens.** CI must fail any deploy where the literal string `[source: TBD]` appears in compiled page output. | Without this, unresolved ROI citations ship as visible page text — credibility collapse. Enforced by deploy pipeline, not by review. |

### Human-in-the-loop fail-safe (front-foot the #1 buyer objection)

When ANNA can't answer a question or detects out-of-scope intent (clinical advice, complex private hire, legal/regulatory query), she:

1. Apologises briefly and offers a transfer.
2. Live-transfers to the customer's nominated escalation number with the full conversation context spoken in 1 sentence ("This is ANNA — caller wants X, I couldn't help with Y, handing over").
3. Simultaneously SMSes the full transcript to the same number so the human picking up has the written record.
4. If no human picks up the transfer, books a callback slot and SMSes the caller with the confirmation.

This flow must be surfaced on the landing page (§10 feature strip "Smart human transfer with full call context", §14 FAQ) — it converts sceptics faster than any benefit claim.

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
| Generic audio sample × 1 (hero/§05) | Newo + ANNA marketing | Most polished, neutral vertical |
| Customer logo strip × ~13 | ANNA marketing | Real customers, signed permissions |
| Testimonials × 4 (one per vertical) | ANNA marketing | Photo + name + business + quote + ROI stat |
| 3D feature icons | ANNA design | Reuse existing ANNA icon family |
| Hero device mockup | ANNA design | Phone showing live call answered + transcript |
| Integration logos × ~20 | Newo (existing assets) | SVG sprite |
| FAQ copy (6–8 Qs) | ANNA copywriting | Single flat accordion; must include one question on human-transfer fail-safe |
| Demo phone number | ANNA telephony | Provisioned via newo, displayed in header + footer |
| Audit-PDF template | ANNA design | 1-pager, vertical-aware, leak + recovery £ + demo CTA |

---

## 8. Out of Scope (for v1)

- Dynamic hero copy based on referrer / paid-ad source (deferred — picked Approach C, not B).
- Multilingual landing copy (English only at launch — UK-first; phase 2 internationalises).
- Per-vertical deep-dive pages (only the tile module on the single page).
- Customer dashboard preview / screenshots on the landing (lives inside the demo flow).
- Comparison-vs-competitors table (newo.ai has one; we omit until we have our own positioning data).
- Blog / resources section (deferred to phase 2).
