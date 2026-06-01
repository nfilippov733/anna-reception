# Persona pass — new pricing + "vs hiring" calculator

**Run:** 2026-06-01 · main at `a1c9d57` (live on Vercel)
**Scope:** how the two new conversion elements land per persona —
(1) expandable pricing tiers with per-tier detail + "Start with {tier}",
(2) the "vs hiring a receptionist" salary calculator (section 10).

---

## The two new elements

**Pricing (fixed the "broken" feel).** Three tiers, each a clickable card that
expands to show what's included + a "Start with {tier}" CTA → /demo?plan=X.
Standard opens by default. Each tier carries a "typical for…" blurb so buyers
self-select: Solo (~50 calls, single location), Standard (~150 calls, busy
single site), Multi-site (300+ / 2+ locations).

**Hiring calculator.** Salary slider → true loaded annual cost (×1.25 for
NI/pension/holiday/sick) vs ANNA £2,148/yr, with a coverage pros/cons split
(24/7 vs 9–5, never off sick, live in 3 min) and an animated "You save
£32,852/year — and never miss a call."

---

## Per-persona

### 🦷 Dr. Sarah K. — Dental
- **Calculator:** runs a clinic that *employs* reception staff — the comparison
  is literally her alternative. At a £28k receptionist (loaded £35k) vs £2.1k,
  "save £32,852" is a board-ready number.
- **Pricing:** Standard £179 — *"~150 calls/month, typical for a busy single-site
  practice"* — is unmistakably her tier. Expanded detail (every channel,
  outbound recovery, deposit via Stripe, priority support) reads as a clinical
  workflow, not a feature dump.
- **Verdict:** the calculator gives her the CFO line; pricing is pre-budgeted. **▲**

### 💇 Charlie R. — Beauty
- **Calculator:** smaller salon — she likely doesn't employ a dedicated
  receptionist, so "you'd save £32k" is less literal. It still anchors ANNA as
  trivially cheap vs the cost of a hire she's *considered*.
- **Pricing:** Solo £99 (single location, phone + WhatsApp) fits her better than
  Standard — and the expandable detail lets her see that without a sales call.
- **Verdict:** pricing self-selection is the win; calculator is reinforcement. **=/▲**

### 🍺 Emma & Joe — Gastropub
- **Calculator:** pubs weigh host/front-of-house staff — direct swap. Loaded
  salary vs ANNA lands hard.
- **Pricing:** Standard for a busy single site; Multi-site if they add a second.
- **Verdict:** strong cost case. **▲**

### 🔧 James W. — Trades
- **Calculator:** sole trader — he'd *never* hire a receptionist, so his real
  alternative is "miss the call" (covered by the ROI leak calc, not this one).
  Here the value is reframing: a human is £35k, ANNA is £99/mo — **trivially
  cheap**, removes any "is it worth it?" doubt.
- **Pricing:** Solo £99 (single location) is clearly his. One tap to see it.
- **Verdict:** pricing fit + "cheap vs a human" anchor. **▲**
- ⚠️ *Note:* for true sole-traders the calculator's "you'd save £32k" slightly
  overstates their real alternative. It still works as an anchor, and the ROI
  calc covers the missed-call case — but worth watching if trades are a primary
  segment.

### 🏋 Maya R. — Fitness
- **Calculator:** studios run a staffed front desk — direct comparison, big
  saving.
- **Pricing:** Standard fits; expandable detail surfaces outbound recovery
  (class-fill / trial follow-ups) she cares about.
- **Verdict:** strong. **▲**

### 🐾 Dr. Macleod — Vet
- **Calculator:** vet practices employ reception staff — the most literal swap of
  all six; the saving is large and credible.
- **Pricing:** Standard / Multi-site for a multi-vet practice; "no long
  contracts · cancel anytime" answers his "what's the catch at this price?"
- **Verdict:** the calculator turns "too cheap to be real" into "cheaper than the
  person I already pay." **▲**

---

## Conversion read

| Persona | Calculator fit | Pricing fit | Net |
|---|---|---|---|
| Sarah (dental) | Direct swap — CFO number | Standard, pre-budgeted | ▲ |
| Charlie (beauty) | Anchor (not literal) | Solo self-select | =/▲ |
| Emma & Joe (pubs) | Direct swap | Standard/Multi | ▲ |
| James (trades) | Anchor "trivially cheap" | Solo self-select | ▲ |
| Maya (fitness) | Direct swap | Standard | ▲ |
| Macleod (vet) | Strongest swap | Standard/Multi · no-catch | ▲ |

**5 of 6 weigh a real receptionist hire → the calculator is a direct,
quantified swap. For the sole-trader (James) it's a "cheaper than a human"
anchor.** Across all six the expandable pricing kills the previous "is this
broken?" feel and lets each buyer self-select a tier without a sales call.

**Two calculators now cover both alternatives a buyer weighs:**
- ROI calc (section 7) — cost of *missing* calls.
- Hiring calc (section 10) — cost of the *human* who'd answer them.

## Open / watch
- Sole-trader framing on the hiring calc (see James note) — fine as an anchor,
  but if trades become primary, consider a copy tweak ("vs an answering service"
  toggle) so the alternative matches.
- Pricing numbers (£99/£179/£299) are still illustrative — confirm with
  commercial before any paid traffic.
