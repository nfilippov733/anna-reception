# ANNA Reception — Persona Walkthrough v3 (post messaging-weave)

**Run:** 2026-05-29 · feat/landing-v1 at `c5f711e`
**Method:** Re-walk the same 6 personas. Specifically check whether WhatsApp/Instagram now run as a sub-current through the page (was the user's ask after v2: "Whats/Instagram коммуникация пронизывала так же хорошо страницу как и посыл со звонками, не на равне, но представлена").
**v2 reference:** [`2026-05-29-buying-personas-walkthrough-v2.md`](./2026-05-29-buying-personas-walkthrough-v2.md)

---

## What changed since v2 (the channel-weave batch)

| # | Surface | Edit | Phone/messaging emphasis |
|---|---|---|---|
| 1 | Hero | Caption strip under trust pill: "Phone · WhatsApp · Instagram DMs · Web chat — all one inbox" | phone listed first; mono caption is secondary to h1 |
| 2 | OutcomeStrip #2 | "Faster than your competitor" proof now reads: "Calls in 2 seconds. WhatsApp and Instagram DMs in under a minute. First reply wins the job — your competitor's voicemail and unread inbox can't." | calls anchor the line; messaging named explicitly |
| 3 | HowItWorks | Step 3 title: "Calls answered 24/7" → "Answered 24/7 — every channel". Body extended: "every call, every WhatsApp thread, and every DM". Channel-icon footer below the 3 steps: "Same flow runs on Phone · WhatsApp · Instagram DMs · Web chat" | phone primary by icon color (terracotta) vs secondary (sage) |
| 4 | RoiCalculator | Inputs renamed across all 6 verticals: "calls per week" → "enquiries per week"; "% of those calls missed" → "% missed across channels". Subhead caption: "Enquiries = calls + WhatsApp + Instagram DMs + web chat" | leak calculation now includes messaging volume conceptually |
| 5 | TestimonialWall | Beauty (Charlie R.) quote: "Zero missed bookings since we switched" → "Every WhatsApp gets a reply in under a minute — even on a Sunday." Also updated in beauty segment panel. | one of six testimonials is now explicitly messaging-anchored |
| 6 | FAQ | Added 2 entries: "How fast does ANNA reply to WhatsApp and DMs?" + "Will ANNA's WhatsApp and DM replies sound like a robot?" Total messaging FAQs: 3 (was 1) | reassurance for messaging-skeptical buyers |

Also incidentally fixed pre-existing PricingTeaser a11y violation (text-primary on cream-deep failed 4.5:1 AA).

---

## Persona-by-persona delta

### 1. Dr. Sarah K. (dental) — phone-anchored

**Messaging exposure:** Hero caption, OutcomeStrip #2, HowItWorks footer.
**Segment panel channelMix:** Inbound 71% · Outbound 18% · WhatsApp 11% · IG 0%.
**Regression check on her primary mental model:**
- H1 still "Your missed calls are now revenue." — unchanged. ✅
- Per-segment H1 "See ANNA book a new patient." — unchanged. ✅
- RoiCalculator label "% missed across channels" — slightly broader than v2's "% missed". Caption clarifies enquiries = calls + WhatsApp + DMs + web chat. For dental specifically the messaging volume is so low (11%) that "enquiries" feels almost identical to "calls". No friction.
- Compliance row + clinical-advice FAQ unchanged.

**Verdict:** No regression. Books demo + audit with same confidence as v2.

---

### 2. Charlie R. (beauty) — IG/WhatsApp heavy buyer (the persona this batch is for)

**Channel mix:** Inbound 40% · Outbound 15% · **WhatsApp 35%** · **Instagram 10%** · Web 0%.
**v2 open objection:** "Will WhatsApp Business number stay mine?" — still demo-call territory but messaging-pervasive signals address her broader "is this primarily a phone product?" anxiety.

**Where messaging now lands for her:**
- **Hero caption** (Phone · WhatsApp · Instagram DMs · Web chat — all one inbox) on the very first scroll — proves breadth before she has to dig.
- **ChannelsRibbon** (existing) — full 5-channel breakdown, no change.
- **Beauty segment panel** — outcome stat already explicitly WhatsApp-rooted ("£62K booked covers · 2,140 WhatsApp bookings in 90 days"). Channel mix bar shows WhatsApp 35% + IG 10%. featureChips ("Knows your menu + which stylist · Deposit at booking via Stripe SMS") apply across channels.
- **Beauty customerStory** rewritten messaging-first: "Every WhatsApp gets a reply in under a minute — even on a Sunday." Charlie reads herself in this quote, not Mark-the-trade.
- **OutcomeStrip #2** explicitly addresses her speed-of-reply concern on WhatsApp + IG.
- **HowItWorks footer** — same flow on every channel. Tells her the booking logic isn't different on phone vs DMs.
- **RoiCalculator** — "enquiries per week" includes her DM volume. The leak figure now reflects her real customer flow, not just calls.
- **TestimonialWall** — Charlie's testimonial is now the messaging-anchored proof line in the 6-quote grid.
- **FAQ** — 3 messaging entries reassure her on reply latency (under a minute) and tone consistency.

**Verdict:** **Strongest delta of any persona.** Charlie's "is this primarily for phone shops?" hesitation closes. WhatsApp ownership question remains the only demo-call topic.

**Conversion intent:** demo with high IG-proof confidence (was: demo with IG-proof + ownership concern).

---

### 3. Emma & Joe (gastropub) — moderate messaging (WhatsApp 15% + IG 10%)

**Where messaging lands:**
- Hero caption + OutcomeStrip + HowItWorks footer apply.
- Pubs segment panel: existing ChannelMixBar shows their split clearly.
- RoiCalculator framing: "% missed across channels" — broader than v2's call-only framing matches their reality.
- FSA-allergen featureChip (E.1 from Sprint E) unchanged. Outbound opt-in framing unchanged.

**Quote in TestimonialWall:** "Our Saturday covers are up 23%." Still phone-implicit. Acceptable — not every quote should be messaging-anchored, and Joe + Emma's primary channel is still inbound calls (65%).

**Verdict:** No regression. Slight confidence boost on product breadth. Same "demo Monday morning" intent.

---

### 4. James W. (trades) — phone-anchored emotional buyer (WhatsApp 10%, IG 0%)

**Regression check on his primary mental model:**
- Hero h1 unchanged. Emergency-callout framing still present in segment H1 ("See ANNA win an emergency callout").
- Trades segment panel: Inbound 60% + Outbound 25% + WhatsApp 10% — phone primary intact.
- **RoiCalculator missedPct label intentionally KEPT bespoke** ("% lost to faster competitor") — his mental model is "first to call back wins". Did not generalize to "% missed across channels" because that would dilute the competitive-urgency framing he resonates with.
- Gas Safe / NICEIC featureChip unchanged.

**Where messaging lands for him:**
- Hero caption + OutcomeStrip #2 + HowItWorks footer signal product breadth — doesn't conflict with his job-on-roof scenario.
- RoiCalculator avgValue label generalized to "Lead enquiries per week" but the % label preserves his framing.

**Verdict:** No regression. Strongest emotional connection unchanged. WhatsApp 10% acknowledged but not promoted at his expense.

---

### 5. Maya R. (fitness) — messaging-moderate (WhatsApp 20% + IG 10%)

**v2 open objection:** ROI calc doesn't surface class-fill metric (still deferred to next sprint).

**Where messaging now lands:**
- Hero caption + OutcomeStrip #2 + HowItWorks footer apply.
- Fitness segment panel: WhatsApp 20% + IG 10% (existing channelMix).
- RoiCalculator now: "Trial enquiries per week" + "% missed across channels". For Maya — who runs IG ads + WhatsApp follow-ups — this is more honest than "trial calls per week".
- Mindbody + voice FAQ unchanged.

**TestimonialWall quote:** "Class fill is at 94% on weeknights." Still phone-implicit but believable.

**Verdict:** No regression. Slight boost: her IG/WhatsApp ad funnel is now reflected in the leak calc framing. Maya books demo + audit with the same confidence as v2 + the new omnichannel reinforcement.

---

### 6. Dr. Macleod (vet) — clinical-safety conscious (WhatsApp 15%, IG 5%, web 10%)

**Where messaging lands:**
- Hero caption, OutcomeStrip #2, HowItWorks footer apply.
- Vet segment panel: existing channelMix shows phone-heavy + moderate WhatsApp.
- Clinical-advice FAQ + featureChip + compliance row all unchanged.
- New FAQ "How fast does ANNA reply to WhatsApp and DMs?" reassures him that messaging triage is as fast as phone triage.

**Verdict:** No regression. Confidence improves marginally: he sees the product handles his after-hours messaging volume (some owners DM photos of symptoms), not only phone triage.

---

## Conversion intent matrix

| Persona | v2 verdict | v3 verdict | Δ |
|---|---|---|---|
| Sarah (dental) | demo + audit, confident | demo + audit, same | = |
| **Charlie (beauty)** | **demo, IG-proof + WhatsApp ownership Q** | **demo, IG-proof + messaging-pervasive reassurance · ownership still demo-call Q** | **+1** |
| Emma & Joe (pubs) | demo same week | demo same week, broader product perception | +0.5 |
| James (trades) | demo, highest emotion | demo, highest emotion (unchanged) | = |
| Maya (fitness) | demo + audit + Mindbody clincher | demo + audit + Mindbody + leak framing now honest | +0.5 |
| Macleod (vet) | audit first + clinical safety closed | audit first + messaging triage reassurance | +0.5 |

**3 of 6 personas show stronger conversion signal. 3 of 6 hold parity. None regress.**

The intended persona (Charlie) shows the largest delta — which is exactly the goal of this batch.

---

## What's still open (P3 polish candidates)

| # | Item | Notes |
|---|---|---|
| 25 | Fitness/Pubs testimonial quotes phone-implicit | Could messaging-anchor 1-2 more for variety. Currently 1/6 (Charlie) is messaging-led. Going to 2/6 would feel more proportional. |
| 26 | Hero illustration is phone-only (waveform inside iPhone) | For IG-heavy buyers, adding a WhatsApp bubble or IG glyph orbiting the phone would reinforce the channel caption visually. Marketing-blocked (Google image gen would need new asset). |
| 27 | Hero channel-caption sits below the trust pill (just below fold at 1440 viewport-1) | Works as intended — caption rewards first scroll. Tighter Hero could fold it in, but illustration is doing important storytelling. Accept as-is. |
| 28 | Real per-segment WhatsApp + IG ChatThread audio/transcripts | Same blocker as v2 P1 #6 (marketing recording). |

## What was unchanged on purpose

- **H1 "Your missed calls are now revenue."** — remains primary anchor. Messaging is sub-current, not equal weight (per user spec).
- **Phone tab is first in ChannelDemos** — same reason.
- **Trades missedPct label "% lost to faster competitor"** — preserved for James's competitive mental model.
- **5 testimonial quotes still phone-implicit** — proportional. Only Charlie's was rewritten because she's the IG-heavy persona.

---

## Bottom line

Messaging now runs as a sub-current through **6 of 13 page sections** (Hero, ChannelsRibbon, SegmentsShowcase, OutcomeStrip, ChannelDemos, HowItWorks, RoiCalculator, TestimonialWall, FAQ — with channel-explicit copy or icons). Was 3 of 13 at v2 (ChannelsRibbon, ChannelDemos, SegmentsShowcase). Phone-primary buyers show no regression because the h1, primary CTA, illustration, and segment H1s are unchanged.

**The user's brief is satisfied:** WhatsApp/Instagram are visible across the page without being on equal footing with calls. Charlie's perception of product breadth closes a soft objection from v1+v2.
