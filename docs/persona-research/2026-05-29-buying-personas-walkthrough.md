# ANNA Reception — Buying Persona Walkthrough

**Run:** 2026-05-29 · v4 (tag `v4-channel-demos`, commit `5dc30a5`)
**Method:** Live Chrome walkthrough of `http://localhost:3000/` and `?v=<segment>` variants + `/demo` + `/audit` forms. Each persona "narrates" their visit; objections and improvements captured verbatim from their POV.
**Output:** Cross-persona priority list at §7. Implementation tasks separate.

## Personas

1. [Dr. Sarah K. — Dental principal](#1-dr-sarah-k--dental-principal-2-locations)
2. [Alex Riley — Beauty salon owner](#2-alex-riley--beauty-salon-owner-1-location-growing)
3. [Tom + Sarah J. — Gastropub landlords](#3-tom--sarah-j--gastropub-landlords)
4. [Mark D. — Plumber, owner-operator](#4-mark-d--plumber-owner-operator)
5. [Priya K. — Fitness studio founder](#5-priya-k--fitness-studio-founder)
6. [Dr. James Chen — Vet practice partner](#6-dr-james-chen--vet-practice-partner)
7. [Cross-persona priority list](#7-cross-persona-priority-list)

---

## 1. Dr. Sarah K. — Dental principal, 2 locations

**Profile:** 38. NHS + private mix, 2 South Wales practices, ~£1.8M turnover, 4 dentists, 1 receptionist per site. Time-poor (chairside half the day). Tech-aware but allergic to long sales cycles — found ANNA via Google after a Friday-night WhatsApp complaint from a patient who couldn't reach reception.

**Goal on landing:** *"Can this actually book new NHS + private patients at 8pm without my reception fielding it Monday? And what about GDPR — I can't have call recordings sitting in California."*

**Walkthrough notes:**
- Hero "Your missed calls are now revenue." — **clicks immediately.** She estimates 30%+ of evening calls go to voicemail.
- Trust strip "100,000+ UK SMBs on ANNA" — registers, but she wants to see *dental* customers specifically. Nothing in the strip says "X clinics".
- Segments tab → opens **Dental clinics** automatically. £401K recovered, 47 new patients quote (Dr. Patel · Bright Smiles Cardiff). Sarah recognises the Cardiff geography — credibility +1. **But** she sees "industry estimate, 2025" → mentally downgrades the £401K figure.
- Channel mix bar: Inbound 71%, Outbound 18%, WhatsApp 11%. Likes that — matches her real flow.
- "Sample call" block under the tab — text-only description ("Caller: 'Hi, my crown fell out…' → ANNA: empathy + triage urgency + offers same-day emergency slot…"). She **wants to hear the call**, not read the synopsis.
- Channel demos (06) Phone tab → reads transcript: 4 turns, ends "Audio sample available at launch". **Friction** — promised "Hear ANNA take a real call" but no audio. Sarah is exactly the person who'd judge by tone of voice.
- ROI calculator: defaults £2,400 LTV × 15 calls/wk × 30% missed = £43,200/mo bleeding. £518K/year. Sarah's first reaction: "that's not real for *my* practice, give me a sanity check."
- FAQ: "What about my data?" → "UK GDPR / DPA 2018 footing. Conversation data is stored encrypted; you control retention." Good enough at this stage. She'd want DPA-2018 lawful basis + DPIA + data residency on the demo call.
- Footer: legal pages exist. Sarah clicks Privacy — sees the stub pointing back at anna.money. Acceptable.

**Top 3 objections:**
1. **No real audio.** A receptionist's voice is the product. Reading a transcript is not proof.
2. **No dental-specific social proof.** Quote from Cardiff is good but: "*how many actual UK dental practices use this?*" — she can't tell. 100,000+ UK SMBs ≠ 100,000+ clinics.
3. **No data residency callout.** "GDPR-compliant" is the floor. She wants "UK-resident infrastructure" or "EU data residency" on the page, not just in a privacy stub.

**Top 3 improvements she'd request:**
1. Per-segment audio sample on Phone tab. Even 20-second clip beats a transcript.
2. Customer count per segment ("X dental clinics use ANNA", "X salons", etc.) — segment-anchored credibility.
3. Data + clinical-safety FAQ block: "ANNA never gives clinical advice" (✓ already in the dental smartBehaviours) but put it on the FAQ, not buried.

**Verdict:** Books a demo. Audit form too — she wants the £ figure for her actual numbers. **Will hesitate on the demo CTA because she has no idea what the call duration will be**: the form says "three-minute live demo" but the page doesn't tell her ahead of clicking.

---

## 2. Alex Riley — Beauty salon owner, 1 location growing

**Profile:** 32. Mane Studio, Manchester (3 stylists, 1 colour tech). £350k turnover. Books mostly Treatwell + Phorest + WhatsApp. **Her real channel is Instagram DMs** — half the brides come from reels. She doesn't read landing pages — she scrolls and watches mockups.

**Goal on landing:** *"Does this actually book through Instagram? I don't want another phone-only thing — I already screen calls."*

**Walkthrough notes:**
- Hero says "phone, WhatsApp, and DMs" in the sub. **Click +1** — she registers DMs immediately.
- Channels ribbon (02): Inbound calls / Outbound calls / **WhatsApp / Instagram DMs** / Web chat. She scans the 5 chips, sees "Salon & aesthetics booking" under Instagram DMs sub. **First positive moment.**
- Segments tab → she clicks **Beauty salons**. £62K booked covers, 2,140 WhatsApp bookings in 90 days. Channel mix: WhatsApp 35% / Inbound 40% / Instagram 10% / Outbound 15%. Story quote "Zero missed bookings since we switched — Alex Riley · Mane Studio Manchester." She sees her own first name in the testimonial and **immediately wonders if it's fake** (it is — illustrative).
- Channel demos (06) → clicks **WhatsApp tab**. Mockup of Jess balayage thread. Looks like a chat, on-brand cream-sage. ✓
- Clicks **Instagram tab** — same thread shape, terracotta-tinted bubbles. Mockup uses the bridal reel scenario. **She actually pauses and reads the whole thread.** Conversion moment.
- ROI: changes default for beauty (£65 avg × 40 calls/wk × 25% missed = £2,600/month). The number feels too small to be life-changing.
- Footer "By ANNA — the business account 100,000+ UK businesses already use." — she's never heard of anna.money. **Confused** — is this an accounting product? A banking product? A reception product?
- /demo form → H1: **"See ANNA take a beauty salons call."** ← she notices "salons" is plural and slightly grammatically off. Minor turnoff.

**Top 3 objections:**
1. **Mocked-up chat isn't her chat.** The bubbles are stylized, not the real WhatsApp/Instagram UI. She worries customers won't trust an ANNA-branded thread; will the real WhatsApp Business number be hers or ANNA's?
2. **"Alex Riley · Mane Studio Manchester" feels fake** when she's literally Alex Riley running a Manchester salon. Illustrative copy hits too close — she's suspicious.
3. **Pricing is "£99–£299/mo"** but no breakdown. For 40 booking calls/week she'd want a number, not a range.

**Top 3 improvements:**
1. **Add a small "screenshot mode" toggle on the WhatsApp/Instagram mockup**: switch between editorial (current) and pixel-accurate. Editorial sells the brand; pixel-accurate proves it works.
2. **Real verified-business badge on WhatsApp mockup** — and explain on the page that the number stays the salon's, not ANNA's.
3. **Per-segment pricing example** — "for a ~40-call-a-week salon, £179/mo is the typical band". Removes the "£99 or £299?" guess.

**Verdict:** Books a demo. **Likely to convert on the Instagram-DM proof specifically.** She'll come into the demo asking "how does the WhatsApp Business verification work?"

---

## 3. Tom + Sarah J. — Gastropub landlords

**Profile:** Two-up landlords, mid-40s, run a 60-cover gastropub in the Cotswolds. Friday/Saturday they're in the kitchen and on the floor. Sarah does the books, Tom runs front-of-house. Phone rings 30+ times during Saturday service.

**Goal on landing:** *"We just need someone to answer the bloody phone on Friday at 7pm and not get the allergens wrong."*

**Walkthrough notes:**
- Hero — registers but they're not literally "missed calls = lost revenue" people. They lose covers, not deals. **They want to see the words "table" or "cover" in the headline.**
- Segments → **Gastropubs** tab. "£88K incremental covers · 41% weekend rebooking lift". Story quote: "Our Saturday covers are up 23% — Sarah & Tom · The Black Swan, Cotswolds." Tom and Sarah read this and again: **suspicious about their own names appearing**. Footnote says "Illustrative scenarios" but only at section 09 (Testimonials), not on the segment story quote.
- Sample call (dental crown is what they see by default on landing, dental sample script). Sarah switches to Gastropubs tab → sees text describing the "Table for 6 Friday, 7:30" interaction. **She wants to know one specific thing: does ANNA actually know it's a Friday or does the operator have to flag it?** Not in the copy.
- FAQ "Does ANNA write to my calendar / PMS / CRM?" → mentions OpenTable. ✓
- They scroll all the way down looking for "What if a guest changes their party size last minute?" — not addressed.
- Channel mix for pubs: Inbound 65 / Outbound 5 / WhatsApp 15 / Instagram 10 / Web 5. **Outbound 5% is the wrong frame for them** — they don't want ANNA calling guests; they want her not to lose them on intake. Outbound % feels like a "we'll spam your customers" signal.
- Pricing: "From £99–£299/mo · Pays for itself in the first week" — they like the simplicity but want a per-cover or per-call breakdown. £299 for a busy gastro feels low (they expect £500+).

**Top 3 objections:**
1. **No mention of allergens / FSA 14-allergen handling on the page.** Spec includes it (dental smartBehaviours mentions FSA 14-allergen), but the landing doesn't surface it for gastro readers. This is **the** food-service objection.
2. **"Outbound calls" line in Channels ribbon scares them** — they don't want their guests cold-called. "No-show recovery, dormant lead chase" is fine; the framing on the channel chip doesn't say "you control opt-in per campaign" (that's only in the FAQ).
3. **Self-named testimonial** — same as Alex. Tom and Sarah of the Black Swan looks made-up *because they are them*.

**Top 3 improvements:**
1. Surface FSA 14-allergen handling on the Gastropub segment panel as a chip ("Allergens flagged at booking, confirmed at service").
2. Reframe Channels ribbon Outbound chip: "Outbound calls — opt-in only" so it doesn't scare reservation-led venues.
3. Move the "Illustrative scenarios" disclaimer to be visible *under the segments showcase quote*, not only on the testimonial wall.

**Verdict:** Book a demo — but only if Tom does it on Monday morning. Friction: they need the booking system to be in the integration list. OpenTable is there → ✓.

---

## 4. Mark D. — Plumber, owner-operator

**Profile:** 41. Solo plumber, North London, 1 apprentice. £180k revenue. Phone in pocket, hands wet most days. Found landing via Cactus comparison shopping (oncactus.com is the v3 spec direct comparison anchor).

**Goal on landing:** *"Pick up when I can't. Don't give shit advice. Don't be expensive. Don't sound like a robot."*

**Walkthrough notes:**
- Hero "Your missed calls are now revenue" — **immediate click**. He's the exact target.
- Trust strip — gets the 24/7 immediately.
- Segments → Trades tab. £140K won-jobs, "First-to-call-back on 87% of leads". Story quote: "I won three boiler jobs last month while on a roof — Mark D. · DJ Plumbing & Gas, North London." **He literally is a Mark in North London who does boilers. He is now suspicious that this site is talking *at* him in a slightly creepy way.**
- "The pain" copy: "Hands full. Drill running. Boots in mud." ← he reads this twice. **This is the only segment where he feels seen.**
- Channel mix bar: Inbound 60 / Outbound 25 / WhatsApp 10 / Web 5. Outbound 25% is the thing he doesn't currently do but knows he should. Hook lands.
- Sample call: "Boiler leaking, can you come today?" → "Is the stop-tap off? Is water reaching the boiler housing?" — **this is where Mark exhales**. Triage that doesn't give clinical advice. Smart.
- Channel demos (06) → he clicks WhatsApp. Mockup of Mark D in NW1 holding the boiler slot. Sees his own postcode area. **Both reassuring and creepy.**
- ROI: £350 avg × 25 calls/wk × 45% missed = £15,750/mo. **He doesn't believe 45% missed**. Defaults are too high for his lens; he believes he answers ~70%.
- Pricing £99-£299/mo: ✓ acceptable.

**Top 3 objections:**
1. **Stupid defaults on ROI calculator.** 45% missed for trades feels like a sales trick. He'd rather start at 20-25%.
2. **No mention of Gas Safe / NICEIC handling on the landing**, despite the spec saying "Captures Gas Safe / NICEIC number on quote enquiries". That's a real differentiator for trades.
3. **Phone number in header `+44 20 7946 0000`** — that's the BBC-style fictional reserved range. Mark spotted it instantly. He thinks the page is a demo of itself, not a real product.

**Top 3 improvements:**
1. ROI defaults that match each segment's reality (trades 25%, not 45%).
2. Surface Gas Safe + NICEIC capture on the Trades segment panel.
3. Real demo phone number (or label clearly "test line — connects to ANNA demo").

**Verdict:** Books a demo. Highest emotional connection of any persona. **But he'll grumble about the 45% default on the demo call** ("you tried to sell me by inflating the leak").

---

## 5. Priya K. — Fitness studio founder

**Profile:** 28. Form Studio, Bristol (1 studio, opening 2nd). Boutique HIIT + spin. 600 active members, £50k/mo recurring. Smart, fast reader, marketing-aware. Uses Mindbody + WhatsApp + Instagram. Founder-led brand — *she* is the studio's voice.

**Goal on landing:** *"I need someone to handle trial-booking calls during morning classes without sounding generic. And I need outbound to fill the 11am slots that always die."*

**Walkthrough notes:**
- Hero — "answers every call, returns every web lead, and chases every dormant quote" — **immediate**. The "chases every dormant quote" hook is exactly what Priya wants: dead trial leads that never converted to memberships.
- Segments → Fitness studios tab. £29K class-fill recovered. 1,400 outbound follow-ups in 90 days. Quote: "Class fill is at 94% on weeknights — Priya K. · Form Studio Bristol." **Priya literally is Priya K. Form Studio Bristol.** Same name-collision objection as Alex and Mark.
- Channel mix: Inbound 35 / Outbound 30 / WhatsApp 20 / Instagram 10 / Web 5. **30% outbound is exactly right for her lens** (class-fill chase is the killer use case).
- "Sample call" copy: "Do you have a 6pm spin class tonight?" → ANNA checks timetable + offers 6:45pm + asks experience + books trial. Solid.
- Channel demos → she clicks Instagram and reads the "Hey — friend keeps recommending you" thread. Hits her acquisition pattern.
- ROI: £65 mo × 30 calls/wk × 30% missed × 0.4 conversion × 12 months = £2,808 — feels low. (She mentally computes £33K/year, which is real but she expected ANNA to *promise* more given the "chase every dormant quote" Hero promise.)
- FAQ: "Does ANNA do outbound calls?" → "Yes. No-show recovery, dormant quote chase, appointment confirmations — opt-in per campaign." **Perfect answer.**
- Footer ANNA Money link — she clicks it. anna.money loads, she sees the business-account positioning. **Mild confusion clears**: ah, it's a sister product. Trust +1.

**Top 3 objections:**
1. **No founder-voice control.** Priya's studio is *her* — she wants to clone *her* phone manner, not a default ANNA voice. Page doesn't mention voice customization.
2. **ROI for fitness undersells.** Annualizing £33K is real but boring. Spec said £29K class-fill recovered + 1,400 outbound. Show *those* numbers in the calculator, not raw monthly bleeding.
3. **Mindbody not in the integrations marquee.** Spec says it's in `integrationsUk` for fitness, but the marquee on the landing shows only the v1/v2 generic list (Treatwell, OpenTable, Dentally, etc.). Mindbody is missing.

**Top 3 improvements:**
1. "Voice match" callout: a feature chip or FAQ entry on whether the receptionist can be coached to use the founder's phrases.
2. Per-segment ROI mode: show *both* monthly bleeding AND segment-specific outcome (e.g., "class fill recovered" for fitness, "covers recovered" for pubs).
3. Audit + expand Integrations marquee per segment.

**Verdict:** Books a demo + audit. Will push hard on voice cloning during the call.

---

## 6. Dr. James Chen — Vet practice partner

**Profile:** 45. Two-practice group, Glasgow + Stirling. £1.2M turnover. RCVS-regulated, sits on the practice owners' WhatsApp group. Came via word-of-mouth from a peer practice. Buying mindset: "*one* clinical-safety mistake and I lose my licence."

**Goal on landing:** *"Triage that doesn't give clinical advice. Out-of-hours routing that's verifiable. Will it call a stressed pet owner at 9pm without sounding cold?"*

**Walkthrough notes:**
- Hero — generic. The phrase "missed calls are now revenue" feels mercenary for a vet. **He wishes the headline acknowledged welfare** even briefly.
- Segments → Vet clinics tab. "£74K added bookings · 2-second emergency triage pickup". Quote: "Out-of-hours triage stopped going to voicemail — Dr. Chen · Glasgow Vet Group." Same self-named collision problem.
- "The pain" copy: "9pm. A worried owner calls. Your line is on voicemail. ANNA picks up, triages whether it's emergency or 'wait till morning'…" **Hits.**
- Sample call: vomiting dog, ANNA asks structured triage questions (food, blood, lethargy), routes emergency, **disclaimer: "Never gives clinical advice — routes to vet"**. ✓ This is what Chen needs to see.
- Channel mix: Inbound 60 / Outbound 10 / WhatsApp 15 / Instagram 5 / Web 10. Outbound 10% feels right (vaccination booster reminders).
- Smart behaviours list mentions: "Flags species-specific concerns to clinician on call". ✓
- FAQ: "What about my data?" answers GDPR but **doesn't mention RCVS or clinical-record handling**.
- Pricing — £99-£299 feels low for a two-practice vet group. He'd assume £400+/mo per location.

**Top 3 objections:**
1. **Clinical-safety claim isn't a top-level FAQ.** It's buried in the segment "smart behaviours" list. For a vet, this is the gating concern.
2. **RCVS / GMC / professional-body framing absent.** A vet sees compliance language; ANNA's is GDPR-only.
3. **Pricing too cheap.** Counter-intuitive but true: at £99/mo for a 2-practice vet group, he wonders what the catch is. He wants tiered visibility.

**Top 3 improvements:**
1. Add an FAQ entry: "Does ANNA give clinical advice?" with explicit "No — she triages and routes. Clinical decisions stay with your team."
2. Add a small compliance-row on the page (UK GDPR · DPA 2018 · ICO registered · ISO 27001-aligned) near pricing or footer.
3. Per-practice tier pricing example: "For a single-location practice, expect £179/mo. Multi-site groups call for a custom quote."

**Verdict:** Books an audit, NOT a demo first. He wants the £ figure on the table before he commits 30 minutes of a senior partner's time.

---

## 7. Cross-persona priority list

### 🔴 P0 — Real bugs / blockers (fix before merge)

| # | Issue | Source | Found by |
|---|---|---|---|
| 1 | `/demo?v=beauty` H1: **"See ANNA take a beauty salons call."** — plural noun in a singular sentence. Same for `gastropubs`, `trades`. | `src/app/demo/page.tsx` segment-aware H1 template | Alex (#2) |
| 2 | `/audit?v=construction` H1: **"How much your trades is leaking — in pounds."** — singular/plural mismatch, and "your trades" is ungrammatical. | `src/app/audit/page.tsx` segment-aware H1 template | Mark (#4) |
| 3 | **Self-named testimonials cause uncanny-valley distrust.** Personas in 4 of 6 segments share a first name + city with the illustrative quote. "Mark D. · DJ Plumbing North London" reads as targeting, not credibility. | `src/content/testimonials.ts` + `src/content/verticals.ts` `customerStory` | Alex (#2), Tom+Sarah (#3), Mark (#4), Priya (#5), Chen (#6) |
| 4 | "Illustrative scenarios" disclaimer is only on the testimonial wall (§09). The segment showcase quote at §04 has no such disclaimer — readers assume it's real. | `src/components/segments/SegmentPanel.tsx` | All 6 |
| 5 | Demo phone `+44 20 7946 0000` is the **UK fictional reserved range** (BBC drama style). Tradesmen + dentists notice. Looks like a placeholder. | `src/components/layout/Header.tsx`, `Footer.tsx`, `AudioDemo` → ChannelDemos PhoneDemoPanel | Mark (#4) |

### 🟡 P1 — High-leverage UX improvements (sprint after merge)

| # | Improvement | Demand from |
|---|---|---|
| 6 | **Per-segment audio sample on Phone tab.** "Audio sample available at launch" is the single biggest credibility gap. Sarah (dental) and Chen (vet) won't fully convert without hearing tone. | Sarah (#1), Chen (#6) |
| 7 | **Segment-anchored social proof.** Show how many *clinics / salons / pubs / trades / studios / vets* use ANNA. "100,000+ UK SMBs" is too broad to convince a segment lead. | Sarah (#1), Chen (#6) |
| 8 | **Pricing tier visibility.** "£99–£299/mo" is too vague. Add per-segment typical band ("for a 40-call-a-week salon, £179/mo") or 3-tier comparison. | Alex (#2), Chen (#6) |
| 9 | **Per-segment ROI defaults are wrong.** Trades 45% missed is implausible; fitness shows raw monthly £ instead of segment-flavor metric (class-fill). Surface segment-specific outcome alongside the raw £. | Mark (#4), Priya (#5) |
| 10 | **Voice / brand customization callout** — does ANNA learn the founder's phrasing? Currently only "she learns your menu, hours, and tone" — but no proof of voice control. | Priya (#5) |
| 11 | **Pre-CTA expectations** — `Book a demo` doesn't say "3 minutes, no slide deck" *until you click*. Add a micro-line under the Hero CTA: "3-minute live demo on your booking system. No slides." | Sarah (#1) |

### 🟢 P2 — Segment-specific surface improvements

| # | Improvement | Segment |
|---|---|---|
| 12 | Surface FSA 14-allergen handling on the Gastropub segment panel as a chip. | pubs |
| 13 | Surface Gas Safe / NICEIC capture on the Trades segment panel. | construction |
| 14 | Add Mindbody / TeamUp / Glofox / ClubRight to the Integrations marquee (currently missing). | fitness |
| 15 | Reframe Channels ribbon Outbound chip with "opt-in only" sub: "Outbound calls · Opt-in per campaign". | pubs (#3 fear), all |
| 16 | New FAQ entry: "Does ANNA give clinical advice?" with explicit "No — she triages and routes." | vet, dental |
| 17 | Compliance row near pricing or footer: "UK GDPR · DPA 2018 · ICO registered". | vet, dental, all regulated |

### ⚪ P3 — Polish / nice-to-have

| # | Improvement |
|---|---|
| 18 | Trust strip stat label de-dup: "100,000+ UK SMBs on ANNA" (stat) + "100,000+ UK SMBs on ANNA" (sublabel) — same text twice. Distinct sublabel. |
| 19 | Mention what ANNA Money does in the Footer copy ("by ANNA — the business account…") so first-time visitors don't get confused about parent vs. child product. |
| 20 | Hero sub micro-edit for vets/dentals: lead with "Answer every patient call" instead of "your missed calls are now revenue" — welfare-conscious framing for healthcare verticals (could be vertical-detected via `?v=`). |

---

## Method note

This walkthrough used the v4 landing at `localhost:3000` (commit `5dc30a5`, post `v4-channel-demos` tag). Persona reactions are synthesised from product-led marketing patterns for UK SMBs in each vertical — they reflect known objection patterns rather than interviewed real customers. Pre-launch, the recommended next step is to validate P0 + P1 with 2–3 real interviews per segment (especially dental and vet, which carry the most compliance gravity).
