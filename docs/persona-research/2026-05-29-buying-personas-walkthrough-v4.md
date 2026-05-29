# ANNA Reception — Persona Walkthrough v4 (post audio + carousel + WhatsApp chat)

**Run:** 2026-05-29 · main at `94becaa`
**What changed since v3:** real per-segment call audio (voice card), richer
objection-handling dialogues across all 24 threads, full-width slide carousel
for segments (lucide chips + side arrows), lucide icons replacing glitchy PNGs,
ChannelDemos collapsed to Phone + WhatsApp-styled Chat, pricing full-width,
PullQuote stray-dot fix.
**v3 reference:** [`2026-05-29-buying-personas-walkthrough-v3.md`](./2026-05-29-buying-personas-walkthrough-v3.md)

---

## Headline: the two biggest unlocks this round

1. **Real audio closed the single longest-standing objection.** Every walkthrough
   since v1 flagged "no real audio" as the top open item (marketing-blocked).
   It's now live — each segment plays a ~20–25s two-voice call that *demonstrates
   objection handling*, not just a booking. This moves Sarah (dental) and James
   (trades) from "demo, but I need to hear it" to "I heard it."
2. **The chat demo now looks like the real thing.** Charlie's recurring doubt was
   "a stylised mock isn't my WhatsApp." The Chat tab is now authentic WhatsApp
   (teal header, green/white bubbles, ticks, wallpaper). Recognition is instant.

---

## Persona-by-persona

### 1. Dr. Sarah K. — Dental practice principal

**Channel reality:** phone-dominant (inbound 71%), low messaging.
**Journey on the live page:**
- Hero → segments carousel opens on Dental (lucide stethoscope chip, clean).
- **Voice card:** presses play, hears a new-patient crown-off call where the
  caller says *"I'm worried what it'll cost"* and ANNA answers with a flat £65
  exam price + "no surprises." This is the exact reassurance she gives patients.
- Pain line + featureChips ("Distinguishes emergency vs routine · Confirms
  payment route") read like her workflow.

**v3 open → status:**
- *"No real audio"* → ✅ **CLOSED.** Audible, and it handles a price objection.
- *"Clinical safety"* → ✅ holds (FAQ + vet/dental welfare line on Hero).
- *"No dental-specific customer count"* → 🟡 still marketing-blocked.

**Conversion:** **demo + audit, high confidence (▲ from v3).** Her main blocker is gone.

---

### 2. Charlie R. — Beauty salon owner (IG/WhatsApp heavy)

**Channel reality:** WhatsApp 35% + Instagram 10% — the messaging persona.
**Journey:**
- Clicks **Chat** tab → sees an authentic WhatsApp thread: a client asking to
  reschedule ("stuck at work — can I push it?") and ANNA moving the slot *with
  the deposit carried over*. Green bubbles, ticks, "Rebooked ✓" pill.
- Her own testimonial ("Every WhatsApp gets a reply in under a minute — even on
  a Sunday") is in the wall.

**v3 open → status:**
- *"Mock isn't my WhatsApp"* → ✅ **CLOSED** — the Chat UI is now WhatsApp-authentic.
- *"WhatsApp Business number ownership"* → 🟡 still a demo-call question (FAQ
  addresses it: "your verified business account").

**Conversion:** **books demo, highest messaging confidence (▲).** WhatsApp
authenticity is the clincher she was waiting for.

---

### 3. Emma & Joe — Gastropub (now reservation-led)

**Journey:**
- Chat tab (pubs) shows a **big-group deposit objection** ("bit much for a
  casual thing") handled — deposit explained as redeemable, plus a no-deposit
  fallback offered. Exactly their hesitation.
- Phone audio: no-availability → alternative slot + coeliac flagged to kitchen.
- FSA-allergen featureChip still present.

**Conversion:** **demo this week (▲ slightly).** Objection handling for big
groups + allergens is visible before the call.

---

### 4. James W. — Trades (emergency, first-to-call-back)

**Journey:**
- **Voice card (construction):** hears the boiler-flood call — ANNA's *"is the
  stop-tap off?"* safety triage, then "call-out's £89, quoted before any work,"
  then "Mark's two streets away." Emotional + practical resonance, now audible.
- Chat (trades): an out-of-area enquiry where ANNA *honestly says it's not their
  patch* and sends trusted referrals — a trust signal he doesn't expect.
- Gas Safe featureChip + £10K/mo believable ROI.

**v3 open → status:**
- *"+44 7946 number reads as placeholder"* → 🟢 softened (Sample badge); real
  production number still recommended.

**Conversion:** **demo, highest emotional pull (▲).** The audible emergency
triage is the moment it clicks. The honest out-of-area referral *builds trust
rather than overpromising* — a standout.

---

### 5. Maya R. — Fitness studio

**Journey:**
- Chat (fitness) shows a **price/lock-in objection**: "£18 drop-in, bit steep" →
  ANNA explains the £65 unlimited membership + free week, no card needed. Then a
  separate "hate being locked in" → "no lock-in, cancel anytime." Hits her two
  objections head-on.
- Phone audio: nervous first-timer reassured into a free beginner class.
- Mindbody in marquee; voice FAQ present.

**v3 open → status:**
- *"ROI shows raw £, not class-fill"* → 🟡 still deferred (UI extension).

**Conversion:** **demo + audit (= to ▲).** The chat's price + lock-in handling
is new reassurance; class-fill ROI metric is the only soft gap left.

---

### 6. Dr. Macleod — Vet practice

**Journey:**
- **Voice card (vet):** hears the most important call for him — a vomiting-dog
  emergency where ANNA gathers blood/ingestion info, then *routes to the on-call
  vet without giving clinical advice* ("don't try to make her sick, stay on the
  line"). His core safety concern, now audible.
- Chat (vet): a 2-days-off-food enquiry triaged as "not blue-light, but let's
  see her today" — measured, not alarmist.

**v3 open → status:**
- *"Clinical-safety as a top concern"* → ✅ **CLOSED audibly** (was FAQ-only).
- *"RCVS framing"* → 🟡 partial (compliance row, no RCVS-specific line).

**Conversion:** **audit first → strong demo follow-up (▲).** Hearing ANNA triage
*and refuse to advise* is the proof he needed.

---

## Conversion intent matrix

| Persona | v3 verdict | v4 verdict | Δ | Decisive new element |
|---|---|---|---|---|
| Sarah (dental) | demo + audit | demo + audit, **real-audio confidence** | ▲ | Audible price-objection call |
| **Charlie (beauty)** | demo + ownership Q | demo, **WhatsApp authenticity clinches** | ▲▲ | Real WhatsApp-styled chat |
| Emma & Joe (pubs) | demo this week | demo this week, objections pre-answered | ▲ | Big-group deposit handled in chat |
| **James (trades)** | demo, high emotion | demo, **audible emergency triage** | ▲▲ | Voice call + honest out-of-area referral |
| Maya (fitness) | demo + audit | demo + audit, price/lock-in pre-answered | = / ▲ | Chat handles £/contract objections |
| Macleod (vet) | audit → demo | audit → demo, **clinical safety audible** | ▲ | Voice call: triage, no advice, route |

**6 of 6 strengthen or hold; 2 jump a full tier (Charlie, James).** The real audio
+ authentic WhatsApp chat + objection-handling dialogues convert the two demo
sections from "claims" into "proof you can see and hear."

---

## What's still open (unchanged from v3 — marketing/ops, not page bugs)

| # | Item | Why |
|---|---|---|
| 1 | Real segment-anchored customer counts ("X clinics use ANNA") | Needs real numbers from sales |
| 2 | Real Trustpilot widget (currently static ★★★★★) | Needs Trustpilot integration |
| 3 | Production demo phone number (replace 020 7946 Ofcom-fiction range) | Operational |
| 4 | Fitness ROI: surface class-fill metric alongside £ | RoiCalculator UI extension |
| 5 | RCVS-specific compliance line for vets | Optional P3 copy |

## Bottom line

The page now *demonstrates* what it used to *assert*. Every persona can press
play and hear ANNA handle their hardest call, or open Chat and watch her work an
objection in a WhatsApp thread that looks exactly like their phone. The
remaining gaps are all real-data / ops items, not design or proof gaps.
