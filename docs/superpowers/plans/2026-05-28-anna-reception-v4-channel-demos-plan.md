# ANNA Reception v4 — Channel Demos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-channel `AudioDemo` at landing section 06 with a tabbed `ChannelDemos` section that proves booking flows on Phone / WhatsApp / Instagram / Web chat — segment-aware via shared URL `?v=<key>` state, 24 chat-thread mockups stylized in the editorial ANNA palette.

**Architecture:** One new section (`ChannelDemos.tsx`) holds local channel-tab state and subscribes to the existing `useSegmentParam` hook for segment state. The hook is upgraded to broadcast/listen via `anna:segment-changed` CustomEvent so sibling sections (SegmentsShowcase, RoiCalculator) stay in sync after client-side segment changes. Tab panel routes to `PhoneDemoPanel` (audio + transcript) or `MessagingThread` (channel-tinted chat bubbles). All 24 threads live in one content file; new visual tokens (`--terracotta`, plus 3 soft washes) extend the palette without breaking existing utilities.

**Tech Stack:** Next.js 14.2 (App Router) · React 18.3 · TypeScript 5.5 · Tailwind 3.4 · lucide-react 0.577 · Calistoga/Inter/JetBrains Mono via `next/font/google` · Vitest 4.1 + @testing-library/react + jsdom · Playwright 1.60 + axe-core.

**Spec reference:** [`docs/superpowers/specs/2026-05-28-anna-reception-v4-channel-demos-design.md`](../specs/2026-05-28-anna-reception-v4-channel-demos-design.md)

---

## File Structure

### Create

- `src/components/sections/ChannelDemos.tsx` — section: kicker, H2, sub, tab strip, panel router, footer CTAs
- `src/components/sections/ChannelDemos.test.tsx`
- `src/components/channels/PhoneDemoPanel.tsx` — Phone tab body
- `src/components/channels/PhoneDemoPanel.test.tsx`
- `src/components/channels/MessagingThread.tsx` — chat-bubble renderer
- `src/components/channels/MessagingThread.test.tsx`
- `src/content/channelDemos.ts` — 24 threads + types (`DemoChannel`, `Thread`, `ThreadTurn`, `CHANNEL_DEMOS`, `DEMO_CHANNELS`)
- `src/lib/useChannelTab.ts` — local channel-tab state hook
- `src/lib/useChannelTab.test.tsx`
- `tests/e2e/channel-demos.spec.ts` — Playwright (functional + 10 visual baselines)
- `docs/superpowers/v4-bundle-baseline-bytes.txt` — pre-v4 chunk-byte total
- `docs/superpowers/lighthouse-baseline-v4.md` — pre + post Lighthouse + gate verdict

### Modify

- `src/app/globals.css` — add 4 tokens (`--terracotta`, `--terracotta-soft`, `--sage-soft`, `--ink-soft`)
- `tailwind.config.ts` — extend `colors` map with the new tokens
- `src/lib/useSegmentParam.ts` — broadcast/listen `anna:segment-changed`
- `src/lib/useSegmentParam.test.tsx` — +1 case for cross-instance sync
- `src/lib/analytics.ts` — add 3 events: `channel_tab_changed`, `channel_demos_demo_clicked`, `channel_demos_audit_clicked`
- `src/app/page.tsx` — swap `AudioDemo` → `ChannelDemos`

### Delete

- `src/components/sections/AudioDemo.tsx`
- `src/components/sections/AudioDemo.test.tsx`

---

## Phase 0 — Baselines

### Task 0.1: Capture pre-v4 bundle baseline

**Files:**
- Create: `docs/superpowers/v4-bundle-baseline-bytes.txt`

- [ ] **Step 1: Build clean (kill stale dev server first if running)**

```bash
pkill -f "next start" 2>/dev/null; pkill -f "next dev" 2>/dev/null; true
npm run build 2>&1 | tail -5
```

Expected: build succeeds, last line shows `✓ Placeholder guard passed`.

- [ ] **Step 2: Sum static JS chunk bytes and stash**

```bash
du -b .next/static/chunks/*.js | awk '{s+=$1} END {print s}' > docs/superpowers/v4-bundle-baseline-bytes.txt
cat docs/superpowers/v4-bundle-baseline-bytes.txt
```

Expected: a single integer (sum of bytes across all top-level `.next/static/chunks/*.js`). Typical post-Sprint-C value is in the 100,000–400,000 range. Don't assert an exact number — just that the file holds a positive integer.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/v4-bundle-baseline-bytes.txt
git commit -m "docs(perf): capture pre-v4 static-chunk bundle baseline"
```

### Task 0.2: Capture Lighthouse v4 baseline doc

**Files:**
- Create: `docs/superpowers/lighthouse-baseline-v4.md`

- [ ] **Step 1: Start production server in the background**

```bash
(npm run start &) && sleep 5
```

Expected: server listening on `http://localhost:3000`.

- [ ] **Step 2: Run Lighthouse desktop**

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=desktop \
  --output=json --output-path=./lighthouse-desktop-v4-baseline.json \
  --quiet --chrome-flags="--headless"
```

Expected: JSON written.

- [ ] **Step 3: Run Lighthouse mobile**

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=./lighthouse-mobile-v4-baseline.json \
  --quiet --chrome-flags="--headless"
```

Expected: JSON written.

- [ ] **Step 4: Extract the 7 numbers per preset**

For each of `lighthouse-desktop-v4-baseline.json` and `lighthouse-mobile-v4-baseline.json`, extract via:

```bash
node -e "const r=require('./lighthouse-desktop-v4-baseline.json'); console.log({perf:Math.round(r.categories.performance.score*100),a11y:Math.round(r.categories.accessibility.score*100),bp:Math.round(r.categories['best-practices'].score*100),seo:Math.round(r.categories.seo.score*100),lcp:Math.round(r.audits['largest-contentful-paint'].numericValue),cls:r.audits['cumulative-layout-shift'].numericValue.toFixed(3),tbt:Math.round(r.audits['total-blocking-time'].numericValue)});"
```

Run the same for the mobile JSON. Note the 7 numbers per preset.

- [ ] **Step 5: Write `docs/superpowers/lighthouse-baseline-v4.md`**

```markdown
# Lighthouse baseline — pre-v4 channel demos

**Captured:** 2026-05-28 (post-Sprint-C, before v4 implementation begins)
**Commit:** <run `git rev-parse HEAD` and paste full SHA>

## Desktop (pre-v4)
- Performance: <score>
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <ms> ms
- CLS: <value>
- TBT: <ms> ms

## Mobile (pre-v4)
- Performance: <score>
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <ms> ms
- CLS: <value>
- TBT: <ms> ms

## Gate thresholds (each phase re-runs Lighthouse; regression >5 points fails)
- Desktop Performance: must stay ≥ baseline − 5
- Mobile Performance: must stay ≥ baseline − 5
- CLS: must stay < 0.1 in both
- TBT: must stay ≤ baseline + 50 ms in both
- A11y, BP, SEO: must not regress below baseline

## v4 results
(Filled in by Phase 6.)
```

Replace the `<score>` / `<ms>` / `<value>` placeholders with the numbers from Step 4. Replace the `<git rev-parse HEAD>` block with the actual commit SHA.

- [ ] **Step 6: Kill server, commit doc**

```bash
pkill -f "next start" || true
git add docs/superpowers/lighthouse-baseline-v4.md
git commit -m "docs(perf): capture Lighthouse baseline pre-v4 channel-demos"
```

Leave `lighthouse-desktop-v4-baseline.json` and `lighthouse-mobile-v4-baseline.json` as untracked working artifacts (matching v2/v3 baseline pattern).

---

## Phase 1 — Visual tokens

### Task 1.1: Add 4 CSS tokens to `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read current `globals.css` (only the `:root` block matters)**

```bash
grep -n -- "--ink\|--cream\|--sage\|--mono-label\|:root" src/app/globals.css | head -20
```

Find the `:root { ... }` block. Identify the last token line before the closing `}`.

- [ ] **Step 2: Add 4 tokens at the end of the `:root` block**

In `src/app/globals.css`, inside the existing `:root { ... }` block (before the closing `}`), append:

```css
  --terracotta: 17 55% 52%;          /* warm clay accent — Instagram tint */
  --terracotta-soft: 17 55% 92%;     /* light wash for incoming Instagram bubbles */
  --sage-soft: 142 22% 92%;          /* light wash for incoming WhatsApp bubbles */
  --ink-soft: 155 25% 92%;           /* light wash for incoming Web chat bubbles */
```

- [ ] **Step 3: Verify the tokens parse**

```bash
grep -nE "^\s+--(terracotta|terracotta-soft|sage-soft|ink-soft):" src/app/globals.css
```

Expected: 4 lines, all under `:root`.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(tokens): add v4 channel-tint tokens (terracotta + 3 soft washes)"
```

### Task 1.2: Extend Tailwind colors map

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Read the colors extend block**

```bash
grep -nE "colors:|terracotta|sage-soft" tailwind.config.ts | head -10
```

Find the `extend.colors` map in `tailwind.config.ts`.

- [ ] **Step 2: Append 4 entries to the colors map**

In `tailwind.config.ts`, find the existing `extend.colors` object (it should have `ink`, `bg`, `cream-deep`, `sage`, `sage-mute`, `mono-label`, `primary`, etc.). Add inside the same object:

```ts
        terracotta: "hsl(var(--terracotta) / <alpha-value>)",
        "terracotta-soft": "hsl(var(--terracotta-soft) / <alpha-value>)",
        "sage-soft": "hsl(var(--sage-soft) / <alpha-value>)",
        "ink-soft": "hsl(var(--ink-soft) / <alpha-value>)",
```

(Match the indentation and quoting style of the surrounding entries — they all use the `hsl(var(--token) / <alpha-value>)` pattern.)

- [ ] **Step 3: Smoke-test that the build picks up the new utilities**

```bash
npm run build 2>&1 | tail -5
```

Expected: build succeeds, `✓ Placeholder guard passed`.

Then test that the new utilities actually exist in compiled CSS:

```bash
grep -oE "(bg|text)-(terracotta|terracotta-soft|sage-soft|ink-soft)\b" .next/static/css/*.css | sort -u
```

Expected: **empty result is fine** — Tailwind tree-shakes unused classes; no source file references them yet. The smoke test will land in Task 3.3 (MessagingThread) when the classes get used.

Verify the config is parseable by re-grepping:

```bash
grep -E "terracotta|sage-soft|ink-soft" tailwind.config.ts | head -10
```

Expected: 4 hits.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(tokens): extend Tailwind colors with terracotta + 3 soft washes"
```

---

## Phase 2 — Content data

### Task 2.1: Create `channelDemos.ts` with all 24 threads + types

**Files:**
- Create: `src/content/channelDemos.ts`

This task ships the entire content file in one shot. No tests in this task — the threads are static data; type contracts get exercised by Phase 3+ component tests.

- [ ] **Step 1: Create the file with types and all 24 threads**

Create `src/content/channelDemos.ts`:

```ts
import type { VerticalKey } from "@/lib/verticals";

export type DemoChannel = "phone" | "whatsapp" | "instagram" | "web";

export const DEMO_CHANNELS: DemoChannel[] = ["phone", "whatsapp", "instagram", "web"];

export type ThreadTurn = {
  from: "caller" | "anna";
  text: string;
  meta?: string;
};

export type Thread = ThreadTurn[];

// All 24 threads mirror spec v4 §7.1–§7.6 verbatim. Edit copy here only.

export const CHANNEL_DEMOS: Record<VerticalKey, Record<DemoChannel, Thread>> = {
  dental: {
    phone: [
      { from: "caller", text: "Hi, my crown fell out yesterday." },
      { from: "anna", text: "I can fit you in at 16:30 with Dr. Patel." },
      { from: "caller", text: "Yes please." },
      { from: "anna", text: "Booked. SMS on its way.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Hi, my crown fell out yesterday. Can someone see me today?" },
      { from: "anna", text: "I can fit you in at 16:30 with Dr. Patel — does that work?" },
      { from: "caller", text: "Yes please" },
      { from: "anna", text: "Booked. Are you Denplan or NHS?" },
      { from: "caller", text: "NHS Band 2" },
      { from: "anna", text: "Noted. Address + 30-min arrival window sent to your phone.", meta: "SMS confirmation ✓" },
    ],
    instagram: [
      { from: "caller", text: "Hey, saw your reel on Invisalign. Do you do free consults?" },
      { from: "anna", text: "We do — 20-min consult, no charge. Any preferred day?" },
      { from: "caller", text: "Wednesday afternoon?" },
      { from: "anna", text: "14:00 or 16:00 with Dr. Patel?" },
      { from: "caller", text: "14:00" },
      { from: "anna", text: "Booked. Calendar invite + clinic address in DMs.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Looking for a new dentist — do you take new NHS patients?" },
      { from: "anna", text: "We do — taking new NHS patients. Earliest exam is Thu 10:30 with Dr. Patel." },
      { from: "caller", text: "Anything earlier in the morning?" },
      { from: "anna", text: "Wed 08:30 just opened — yours if you'd like." },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Booked. I'll text the address and a quick health-form link.", meta: "SMS sent ✓" },
    ],
  },

  beauty: {
    phone: [
      { from: "caller", text: "Can I book a balayage with Jess for Saturday?" },
      { from: "anna", text: "11:00 or 15:00 — both 3 hrs." },
      { from: "caller", text: "15:00 please." },
      { from: "anna", text: "Booked. Deposit link incoming.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Hi, can I book a balayage with Jess for Saturday?" },
      { from: "anna", text: "Jess has 11:00 or 15:00 Saturday — both 3 hrs. Add a toner?" },
      { from: "caller", text: "15:00 with toner please" },
      { from: "anna", text: "Booked. £40 deposit holds it — link?" },
      { from: "caller", text: "Yep" },
      { from: "anna", text: "Sent. See you Sat at 15:00 ✓", meta: "Mane Studio Manchester" },
    ],
    instagram: [
      { from: "caller", text: "Saw your reel of the bridal trial yesterday — do you do those?" },
      { from: "anna", text: "We do! Trial £85, day-of from £230. Date in mind?" },
      { from: "caller", text: "Saturday 13 June afternoon" },
      { from: "anna", text: "Trial available 13:00 or 16:00 Sat 13 Jun. Which?" },
      { from: "caller", text: "16:00 please" },
      { from: "anna", text: "Held. Sending confirmation + day-of quote.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Hi — looking for partial highlights this week" },
      { from: "anna", text: "Welcome. Wed 14:00 or Thu 10:00 with Maya — both 90 min, £120." },
      { from: "caller", text: "Wed 14:00" },
      { from: "anna", text: "Name for the booking + a small deposit?" },
      { from: "caller", text: "Lisa K, yes" },
      { from: "anna", text: "Booked Lisa — see you Wed at 14:00.", meta: "Confirmation emailed ✓" },
    ],
  },

  pubs: {
    phone: [
      { from: "caller", text: "Table for 6 Friday around 19:30?" },
      { from: "anna", text: "19:00 or 20:00 — kitchen's slammed at 19:30." },
      { from: "caller", text: "20:00." },
      { from: "anna", text: "Booked. Allergens to flag?", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Table for 6 Friday around 19:30?" },
      { from: "anna", text: "19:00 or 20:00 Friday works — kitchen's slammed at 19:30. Allergens?" },
      { from: "caller", text: "20:00. One gluten-free" },
      { from: "anna", text: "Got it — flagged to the chef. High chair?" },
      { from: "caller", text: "Yes, one" },
      { from: "anna", text: "Booked. Confirmation + cancellation link sent.", meta: "The Black Swan, Cotswolds" },
    ],
    instagram: [
      { from: "caller", text: "Hi! Following you for ages. Any chance of 4 covers Sunday roast?" },
      { from: "anna", text: "Roast service runs 12:00–17:00. 13:30 or 15:00 — which?" },
      { from: "caller", text: "13:30" },
      { from: "anna", text: "Names for the booking?" },
      { from: "caller", text: "Tom + 3" },
      { from: "anna", text: "Booked Tom. See you 13:30 Sunday.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Hi, looking to book a private dining room for 14 people in June." },
      { from: "anna", text: "Sat 14 Jun or Sat 21 Jun both have the snug free. Set menu from £42pp." },
      { from: "caller", text: "Sat 14 Jun please" },
      { from: "anna", text: "Reserved. £150 holds it — payment link?" },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Sent. Set-menu options follow by email.", meta: "Email confirmation ✓" },
    ],
  },

  construction: {
    phone: [
      { from: "caller", text: "Boiler leaking, water everywhere." },
      { from: "anna", text: "Is the stop-tap off?" },
      { from: "caller", text: "Just turned it." },
      { from: "anna", text: "Mark D in your postcode 14:00 — holding the slot.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Boiler leaking, water everywhere. Can you come today?" },
      { from: "anna", text: "First — is the stop-tap off?" },
      { from: "caller", text: "Just turned it" },
      { from: "anna", text: "Mark D is in your postcode at 14:00. I'm holding the slot — confirm?" },
      { from: "caller", text: "Yes please" },
      { from: "anna", text: "Held. Mark will text his ETA. Address + plate ID sent.", meta: "DJ Plumbing & Gas" },
    ],
    instagram: [
      { from: "caller", text: "Hi, saw your kitchen refit reel. Do you quote for similar?" },
      { from: "anna", text: "We do — full-day site visit, no charge. Postcode?" },
      { from: "caller", text: "NW1" },
      { from: "anna", text: "In your area. Thu morning or Fri afternoon?" },
      { from: "caller", text: "Thu morning" },
      { from: "anna", text: "Booked. Mark will arrive 09:30 with the survey kit.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Looking for a quote on a bathroom rip-out + retile" },
      { from: "anna", text: "Happy to. Photos help — drop 4–6 here or a Drive link?" },
      { from: "caller", text: "Sent 5 photos" },
      { from: "anna", text: "Cheers — quoting £4,200–£5,800 ballpark, full quote inside 24h. Best email?" },
      { from: "caller", text: "rob.t@email.com" },
      { from: "anna", text: "Got it Rob. Full quote by Thursday.", meta: "Quote ETA confirmed ✓" },
    ],
  },

  fitness: {
    phone: [
      { from: "caller", text: "Do you have a 6pm spin tonight?" },
      { from: "anna", text: "18:00 full, 18:45 has 4 bikes left." },
      { from: "caller", text: "Yes." },
      { from: "anna", text: "Held. First class is free.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Do you have a 6pm spin class tonight?" },
      { from: "anna", text: "Tonight's 18:00 is full — 18:45 has 4 bikes left. Want one?" },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Held. First class is free. Any cycling experience?" },
      { from: "caller", text: "Some" },
      { from: "anna", text: "Noted. Studio doors open 18:30. See you tonight.", meta: "Form Studio Bristol" },
    ],
    instagram: [
      { from: "caller", text: "Hey — friend keeps recommending you. When's the next beginner class?" },
      { from: "anna", text: "Mon 19:00 and Wed 07:00 are beginner-friendly. Either work?" },
      { from: "caller", text: "Mon 19:00" },
      { from: "anna", text: "Booked your free trial. Bring water, trainers, that's it." },
      { from: "caller", text: "Mat?" },
      { from: "anna", text: "We supply mats. See you Mon 19:00.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Hi, comparing memberships. Got a list of class times?" },
      { from: "anna", text: "Membership £65/mo — unlimited classes, free trial week. Want me to book yours?" },
      { from: "caller", text: "Yes — what's available tomorrow?" },
      { from: "anna", text: "07:00 spin, 12:15 HIIT, 18:00 yoga. Pick one?" },
      { from: "caller", text: "12:15 HIIT" },
      { from: "anna", text: "Booked. Welcome email + timetable on its way.", meta: "Email confirmation ✓" },
    ],
  },

  vet: {
    phone: [
      { from: "caller", text: "My dog's been vomiting two hours." },
      { from: "anna", text: "Any blood? Anything unusual she ate?" },
      { from: "caller", text: "No blood, chewed a plant." },
      { from: "anna", text: "Routing now to Dr. Chen on call.", meta: "Emergency triage — routed" },
    ],
    whatsapp: [
      { from: "caller", text: "My dog's been vomiting two hours, won't drink. Is this urgent?" },
      { from: "anna", text: "Routing to Dr. Chen on call — quick, has she eaten anything unusual or shown any blood?" },
      { from: "caller", text: "No blood, but she chewed a plant earlier" },
      { from: "anna", text: "Got it. She'll ring you back in under 5 min." },
      { from: "caller", text: "Thank you" },
      { from: "anna", text: "Address sent for if she asks you to come in.", meta: "SMS sent ✓" },
    ],
    instagram: [
      { from: "caller", text: "Hi, our neighbour swears by you. Mittens needs her booster — when's available?" },
      { from: "anna", text: "Happy to check. Cat's name + your postcode?" },
      { from: "caller", text: "Mittens, EH3" },
      { from: "anna", text: "Mittens is due her 3-year booster. Sat 11:00 or Tue 17:00?" },
      { from: "caller", text: "Sat 11:00" },
      { from: "anna", text: "Booked. Bring her vaccination card if you have it.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "We just moved — registering 2 cats with a new practice. Process?" },
      { from: "anna", text: "Welcome — new-pet exam is £45 each. Email + previous vet name to request records?" },
      { from: "caller", text: "jen@email.com, prev vet was West End Vets" },
      { from: "anna", text: "I'll request records. Earliest joint exam: Wed 15:30." },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Booked Jen. Confirmation + new-pet form link sent.", meta: "Email confirmation ✓" },
    ],
  },
};
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

Expected: clean (no new errors). The content file is consumed by no other file yet — types are self-contained.

- [ ] **Step 3: Quick structural sanity**

```bash
node -e "const m=require('./src/content/channelDemos.ts'); console.log('cannot run TS directly, OK');"
```

That'll error (TS file). Skip — TypeScript already verified.

Instead, count thread arrays via grep:

```bash
grep -cE "^\s+(phone|whatsapp|instagram|web): \[" src/content/channelDemos.ts
```

Expected: `24` (6 segments × 4 channels).

- [ ] **Step 4: Commit**

```bash
git add src/content/channelDemos.ts
git commit -m "feat(content): v4 channelDemos — 24 segment-aware threads + types"
```

---

## Phase 3 — Hooks + primitives

### Task 3.1: Upgrade `useSegmentParam` to broadcast/listen

**Files:**
- Modify: `src/lib/useSegmentParam.ts`
- Modify: `src/lib/useSegmentParam.test.tsx`

Follow TDD: write the new failing test first.

- [ ] **Step 1: Add the failing cross-instance-sync test**

Open `src/lib/useSegmentParam.test.tsx`. At the bottom of the existing `describe("useSegmentParam", () => { ... })` block (before the closing `})`), add:

```tsx
  it("syncs across instances via the anna:segment-changed event", () => {
    // Two probes mounted side-by-side. select() on one updates the other.
    let probeAActive: VerticalKey | undefined;
    let probeBActive: VerticalKey | undefined;
    let probeASelect: ((k: VerticalKey) => void) | undefined;
    render(
      <>
        <Probe
          initial="dental"
          onState={(a, s) => {
            probeAActive = a;
            probeASelect = s;
          }}
        />
        <Probe
          initial="dental"
          onState={(a) => {
            probeBActive = a;
          }}
        />
      </>
    );
    expect(probeAActive).toBe("dental");
    expect(probeBActive).toBe("dental");
    act(() => probeASelect!("fitness"));
    expect(probeAActive).toBe("fitness");
    expect(probeBActive).toBe("fitness");
  });
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/lib/useSegmentParam.test.tsx
```

Expected: 4 pass + 1 fail (the new sync test). The current implementation reads URL on mount and writes via replaceState without broadcasting; probe B never learns.

- [ ] **Step 3: Replace `src/lib/useSegmentParam.ts` with the broadcast/listen version**

Replace the entire file with:

```ts
"use client";
import { useEffect, useState } from "react";
import { VERTICAL_KEYS, isVerticalKey, type VerticalKey } from "@/lib/verticals";

const SEGMENT_CHANGED = "anna:segment-changed";

type SegmentChangedDetail = { segment: VerticalKey };

export function useSegmentParam(
  initial: VerticalKey
): [VerticalKey, (k: VerticalKey) => void] {
  const [active, setActive] = useState<VerticalKey>(initial);

  // On mount, read ?v= from URL. If it's a valid key and differs from `initial`,
  // adopt it so client-side hydration honours deep links.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get("v");
    if (v && isVerticalKey(v) && v !== active) {
      setActive(v);
    }
    // Intentionally run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for sibling-driven segment changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SegmentChangedDetail>).detail;
      if (detail && isVerticalKey(detail.segment) && detail.segment !== active) {
        setActive(detail.segment);
      }
    };
    window.addEventListener(SEGMENT_CHANGED, handler);
    return () => window.removeEventListener(SEGMENT_CHANGED, handler);
  }, [active]);

  const select = (k: VerticalKey) => {
    if (!VERTICAL_KEYS.includes(k)) return;
    setActive(k);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("v", k);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
      // Broadcast. Self-listen is harmless: handler short-circuits on `=== active`.
      window.dispatchEvent(new CustomEvent<SegmentChangedDetail>(SEGMENT_CHANGED, { detail: { segment: k } }));
    }
  };

  return [active, select];
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/lib/useSegmentParam.test.tsx
```

Expected: 5 passed (existing 4 + new sync test).

- [ ] **Step 5: Full vitest sweep to confirm no regression**

```bash
npm test 2>&1 | tail -5
```

Expected: all 143+ pre-existing cases continue to pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/useSegmentParam.ts src/lib/useSegmentParam.test.tsx
git commit -m "feat(hook): useSegmentParam broadcasts anna:segment-changed for cross-section sync"
```

### Task 3.2: Create `useChannelTab` hook

**Files:**
- Create: `src/lib/useChannelTab.ts`
- Create: `src/lib/useChannelTab.test.tsx`

Follow TDD.

- [ ] **Step 1: Write failing test**

Create `src/lib/useChannelTab.test.tsx`:

```tsx
import { render, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect } from "react";
import { useChannelTab } from "./useChannelTab";
import type { DemoChannel } from "@/content/channelDemos";

function Probe({
  initial,
  onState,
}: {
  initial?: DemoChannel;
  onState: (active: DemoChannel, select: (k: DemoChannel) => void) => void;
}) {
  const [active, select] = useChannelTab(initial);
  useEffect(() => {
    onState(active, select);
  });
  return null;
}

describe("useChannelTab", () => {
  it("defaults to 'phone' when no initial is provided", () => {
    let lastActive: DemoChannel | undefined;
    render(<Probe onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("phone");
  });

  it("accepts an explicit initial value", () => {
    let lastActive: DemoChannel | undefined;
    render(<Probe initial="whatsapp" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("whatsapp");
  });

  it("select() updates state", () => {
    let lastActive: DemoChannel | undefined;
    let lastSelect: ((k: DemoChannel) => void) | undefined;
    render(
      <Probe
        onState={(a, s) => {
          lastActive = a;
          lastSelect = s;
        }}
      />
    );
    act(() => lastSelect!("instagram"));
    expect(lastActive).toBe("instagram");
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/lib/useChannelTab.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement hook**

Create `src/lib/useChannelTab.ts`:

```ts
"use client";
import { useState } from "react";
import { DEMO_CHANNELS, type DemoChannel } from "@/content/channelDemos";

export function useChannelTab(
  initial: DemoChannel = "phone"
): [DemoChannel, (k: DemoChannel) => void] {
  const [active, setActive] = useState<DemoChannel>(initial);

  const select = (k: DemoChannel) => {
    if (!DEMO_CHANNELS.includes(k)) return;
    setActive(k);
  };

  return [active, select];
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/lib/useChannelTab.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/useChannelTab.ts src/lib/useChannelTab.test.tsx
git commit -m "feat(hook): useChannelTab — local channel-tab state with validation"
```

### Task 3.3: Create `MessagingThread` primitive

**Files:**
- Create: `src/components/channels/MessagingThread.tsx`
- Create: `src/components/channels/MessagingThread.test.tsx`

Follow TDD.

- [ ] **Step 1: Write failing test**

Create `src/components/channels/MessagingThread.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MessagingThread } from "./MessagingThread";
import type { Thread } from "@/content/channelDemos";

const SAMPLE: Thread = [
  { from: "caller", text: "Hi, can I book?" },
  { from: "anna", text: "Sure — 11am works." },
  { from: "caller", text: "Yes please" },
  { from: "anna", text: "Booked.", meta: "SMS sent ✓" },
];

describe("MessagingThread", () => {
  it("renders one list item per turn", () => {
    render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });

  it("applies bg-sage-soft for whatsapp incoming bubbles", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    const incoming = container.querySelectorAll('[data-role="caller-bubble"]');
    expect(incoming.length).toBeGreaterThan(0);
    expect(incoming[0].className).toMatch(/bg-sage-soft/);
  });

  it("applies bg-terracotta-soft for instagram incoming bubbles", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="instagram" />);
    const incoming = container.querySelector('[data-role="caller-bubble"]');
    expect(incoming?.className).toMatch(/bg-terracotta-soft/);
  });

  it("applies bg-ink-soft for web incoming bubbles", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="web" />);
    const incoming = container.querySelector('[data-role="caller-bubble"]');
    expect(incoming?.className).toMatch(/bg-ink-soft/);
  });

  it("renders meta line when present, omits when absent", () => {
    render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    expect(screen.getByText(/SMS sent/i)).toBeInTheDocument();
    const without: Thread = [{ from: "caller", text: "Hi" }];
    const { queryByText } = render(<MessagingThread thread={without} channel="whatsapp" />);
    expect(queryByText(/SMS sent/i)).not.toBeInTheDocument();
  });

  it("aligns caller bubbles left (mr-auto) and ANNA bubbles right (ml-auto)", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    const callerBubble = container.querySelector('[data-role="caller-bubble"]');
    const annaBubble = container.querySelector('[data-role="anna-bubble"]');
    expect(callerBubble?.className).toMatch(/mr-auto/);
    expect(annaBubble?.className).toMatch(/ml-auto/);
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/channels/MessagingThread.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `MessagingThread`**

Create `src/components/channels/MessagingThread.tsx`:

```tsx
import { MessageCircle, Instagram, MessagesSquare, type LucideIcon } from "lucide-react";
import type { Thread } from "@/content/channelDemos";
import { cn } from "@/lib/cn";

type Channel = "whatsapp" | "instagram" | "web";

type Props = {
  thread: Thread;
  channel: Channel;
};

const CHANNEL_META: Record<Channel, { icon: LucideIcon; label: string; caption: string; iconColor: string; incomingBg: string }> = {
  whatsapp: {
    icon: MessageCircle,
    label: "WhatsApp",
    caption: "Business booking thread",
    iconColor: "text-sage",
    incomingBg: "bg-sage-soft",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram",
    caption: "Direct message",
    iconColor: "text-terracotta",
    incomingBg: "bg-terracotta-soft",
  },
  web: {
    icon: MessagesSquare,
    label: "Web chat",
    caption: "Web chat",
    iconColor: "text-ink",
    incomingBg: "bg-ink-soft",
  },
};

export function MessagingThread({ thread, channel }: Props) {
  const { icon: Icon, label, caption, iconColor, incomingBg } = CHANNEL_META[channel];
  const lastTurn = thread[thread.length - 1];
  const meta = lastTurn?.meta;

  return (
    <div aria-label="Messaging thread">
      <div className="flex items-center gap-3 pb-4 border-b border-sage/30">
        <Icon className={cn("h-6 w-6", iconColor)} aria-hidden="true" />
        <div>
          <p className="font-medium text-ink">{label}</p>
          <p className="text-xs text-fg-muted">{caption}</p>
        </div>
      </div>
      <ol role="list" aria-label="Booking conversation" className="mt-6 flex flex-col gap-3">
        {thread.map((turn, i) => {
          const isCaller = turn.from === "caller";
          const bubbleRole = isCaller ? "caller-bubble" : "anna-bubble";
          const speakerLabel = isCaller ? "Customer" : "ANNA";
          return (
            <li key={i} className="flex">
              <div
                data-role={bubbleRole}
                aria-label={`${speakerLabel}: ${turn.text}`}
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-[80%] leading-snug text-ink",
                  isCaller ? cn(incomingBg, "mr-auto") : "bg-cream-deep ml-auto"
                )}
              >
                {turn.text}
              </div>
            </li>
          );
        })}
      </ol>
      {meta && (
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-mono-label">
          <span className="sr-only">Status: </span>
          {meta}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/channels/MessagingThread.test.tsx
```

Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/channels/MessagingThread.tsx src/components/channels/MessagingThread.test.tsx
git commit -m "feat(channels): MessagingThread primitive — channel-tinted chat bubbles"
```

### Task 3.4: Create `PhoneDemoPanel` primitive

**Files:**
- Create: `src/components/channels/PhoneDemoPanel.tsx`
- Create: `src/components/channels/PhoneDemoPanel.test.tsx`

Follow TDD.

- [ ] **Step 1: Write failing test**

Create `src/components/channels/PhoneDemoPanel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneDemoPanel } from "./PhoneDemoPanel";

describe("PhoneDemoPanel", () => {
  it("renders PlayButton and Waveform primitives", () => {
    const { container } = render(<PhoneDemoPanel segment="dental" />);
    // PlayButton renders a <button> with aria-label including "Play"
    const playBtn = container.querySelector('button[aria-label*="lay" i]');
    expect(playBtn).not.toBeNull();
    // Waveform renders an SVG or container with data-testid="waveform" — we accept either
    const waveform =
      container.querySelector('[data-testid="waveform"]') ?? container.querySelector("svg");
    expect(waveform).not.toBeNull();
  });

  it("renders segment-aware transcript when no audio src configured", () => {
    render(<PhoneDemoPanel segment="beauty" />);
    // Beauty phone turn 1: "Can I book a balayage with Jess for Saturday?"
    expect(screen.getByText(/balayage with Jess/i)).toBeInTheDocument();
    // Last turn meta: "Audio sample available at launch"
    expect(screen.getByText(/Audio sample available at launch/i)).toBeInTheDocument();
  });

  it("renders all 4 turns of the construction phone transcript", () => {
    render(<PhoneDemoPanel segment="construction" />);
    expect(screen.getByText(/Boiler leaking, water everywhere/i)).toBeInTheDocument();
    expect(screen.getByText(/Is the stop-tap off\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Just turned it/i)).toBeInTheDocument();
    expect(screen.getByText(/Mark D in your postcode/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/channels/PhoneDemoPanel.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `PhoneDemoPanel`**

Create `src/components/channels/PhoneDemoPanel.tsx`:

```tsx
"use client";
import { useRef, useState } from "react";
import { Waveform } from "@/components/primitives/Waveform";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { PlayButton } from "@/components/primitives/PlayButton";
import { CHANNEL_DEMOS } from "@/content/channelDemos";
import type { VerticalKey } from "@/lib/verticals";
import { track } from "@/lib/analytics";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";
const GENERIC_AUDIO_SRC = process.env.NEXT_PUBLIC_GENERIC_AUDIO_SRC ?? "";

type Props = { segment: VerticalKey };

export function PhoneDemoPanel({ segment }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const thread = CHANNEL_DEMOS[segment].phone;
  const lastTurn = thread[thread.length - 1];
  const meta = lastTurn?.meta ?? "";
  const hasAudio = GENERIC_AUDIO_SRC.length > 0;

  function togglePlay() {
    if (!hasAudio) return;
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
      track("audio_demo_played");
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-sage/40 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <PlayButton
            playing={playing}
            onToggle={hasAudio ? togglePlay : () => {}}
            aria-disabled={!hasAudio || undefined}
          />
          <Waveform playing={playing} />
        </div>
        {hasAudio && (
          <audio
            ref={ref}
            src={GENERIC_AUDIO_SRC}
            preload="metadata"
            onEnded={() => {
              setPlaying(false);
              track("audio_demo_completed_30s");
            }}
          />
        )}
        <div className="mt-6 border-t border-sage/30 pt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-mono-label">
            Sample transcript
          </p>
          <dl className="mt-4 space-y-3 max-w-prose">
            {thread.map((turn, i) => (
              <div key={i}>
                <dt className="font-mono text-xs tracking-wider uppercase text-mono-label">
                  {turn.from === "caller" ? "Caller" : <span className="text-primary">ANNA</span>}
                </dt>
                <dd className="mt-1 text-ink">{turn.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-mono-label">
            {meta}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-fg-muted">
        <span>Or hear her live yourself:</span>
        <PhoneChip number={DEMO_PHONE} />
      </div>
    </div>
  );
}
```

Note: the `PlayButton` primitive at `src/components/primitives/PlayButton.tsx` accepts `playing` and `onToggle` props. We pass an `aria-disabled` attribute conditional on `hasAudio` — when `GENERIC_AUDIO_SRC` is empty, the button is rendered but the toggle is a no-op (and `aria-disabled="true"` is set so assistive tech announces it).

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/channels/PhoneDemoPanel.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/channels/PhoneDemoPanel.tsx src/components/channels/PhoneDemoPanel.test.tsx
git commit -m "feat(channels): PhoneDemoPanel — segment-aware transcript + optional audio"
```

---

## Phase 4 — Section component

### Task 4.1: Create `ChannelDemos` section

**Files:**
- Create: `src/components/sections/ChannelDemos.tsx`
- Create: `src/components/sections/ChannelDemos.test.tsx`
- Modify: `src/lib/analytics.ts` (add 3 events)

Follow TDD.

- [ ] **Step 1: Extend `src/lib/analytics.ts` with 3 new events**

In `src/lib/analytics.ts`, find the `AnalyticsEvent` union. Add these three entries:

```ts
  | { event: "channel_tab_changed"; segment: VerticalKey; channel: "phone" | "whatsapp" | "instagram" | "web" }
  | { event: "channel_demos_demo_clicked"; segment: VerticalKey; channel: "phone" | "whatsapp" | "instagram" | "web" }
  | { event: "channel_demos_audit_clicked"; segment: VerticalKey; channel: "phone" | "whatsapp" | "instagram" | "web" }
```

(Place them grouped together with other channel/demo events. The existing union already imports `VerticalKey` from `./verticals`.)

- [ ] **Step 2: Write failing test**

Create `src/components/sections/ChannelDemos.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ChannelDemos } from "./ChannelDemos";

describe("ChannelDemos", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });

  it("renders 4 tabs (Phone / WhatsApp / Instagram / Web chat)", () => {
    render(<ChannelDemos initialSegment="dental" />);
    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(screen.getByRole("tab", { name: /Phone/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /WhatsApp/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Web chat/i })).toBeInTheDocument();
  });

  it("selects Phone tab initially", () => {
    render(<ChannelDemos initialSegment="dental" />);
    expect(screen.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
  });

  it("clicking a tab updates aria-selected and swaps panel content", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="beauty" />);
    const whatsappTab = screen.getByRole("tab", { name: /WhatsApp/i });
    await user.click(whatsappTab);
    expect(whatsappTab).toHaveAttribute("aria-selected", "true");
    // Beauty WhatsApp turn 1: "Hi, can I book a balayage with Jess for Saturday?"
    expect(screen.getByText(/can I book a balayage/i)).toBeInTheDocument();
  });

  it("ArrowRight from Phone moves to WhatsApp", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const phone = screen.getByRole("tab", { name: /Phone/i });
    phone.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /WhatsApp/i })).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowLeft from Phone wraps to Web chat", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const phone = screen.getByRole("tab", { name: /Phone/i });
    phone.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Web chat/i })).toHaveAttribute("aria-selected", "true");
  });

  it("Home jumps to Phone, End jumps to Web chat", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const instagram = screen.getByRole("tab", { name: /Instagram/i });
    instagram.focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Web chat/i })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
  });

  it("panel content uses the initialSegment prop", () => {
    render(<ChannelDemos initialSegment="construction" />);
    // Construction phone turn 1: "Boiler leaking, water everywhere."
    expect(screen.getByText(/Boiler leaking/i)).toBeInTheDocument();
  });

  it("footer CTAs carry ?v=<segment> in href", () => {
    render(<ChannelDemos initialSegment="vet" />);
    const demoCta = screen.getByRole("link", { name: /Book a demo/i });
    const auditCta = screen.getByRole("link", { name: /Get my free revenue audit/i });
    expect(demoCta).toHaveAttribute("href", "/demo?v=vet");
    expect(auditCta).toHaveAttribute("href", "/audit?v=vet");
  });

  it("clicking a tab fires channel_tab_changed with { segment, channel } payload", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="fitness" />);
    const dataLayer = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const beforeLen = dataLayer.length;
    await user.click(screen.getByRole("tab", { name: /Instagram/i }));
    const fired = dataLayer.slice(beforeLen).find((e) => e.event === "channel_tab_changed");
    expect(fired).toBeTruthy();
    expect(fired).toMatchObject({ event: "channel_tab_changed", segment: "fitness", channel: "instagram" });
  });
});
```

- [ ] **Step 3: Run test, expect FAIL**

```bash
npm test -- src/components/sections/ChannelDemos.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 4: Implement `ChannelDemos`**

Create `src/components/sections/ChannelDemos.tsx`:

```tsx
"use client";
import { useRef } from "react";
import {
  PhoneIncoming,
  MessageCircle,
  Instagram,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { MessagingThread } from "@/components/channels/MessagingThread";
import { PhoneDemoPanel } from "@/components/channels/PhoneDemoPanel";
import { CHANNEL_DEMOS, DEMO_CHANNELS, type DemoChannel } from "@/content/channelDemos";
import { useChannelTab } from "@/lib/useChannelTab";
import { useSegmentParam } from "@/lib/useSegmentParam";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { VerticalKey } from "@/lib/verticals";

type Props = { initialSegment: VerticalKey };

const TAB_META: Record<DemoChannel, { icon: LucideIcon; label: string }> = {
  phone: { icon: PhoneIncoming, label: "Phone" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp" },
  instagram: { icon: Instagram, label: "Instagram" },
  web: { icon: MessagesSquare, label: "Web chat" },
};

export function ChannelDemos({ initialSegment }: Props) {
  const [activeSegment] = useSegmentParam(initialSegment);
  const [activeChannel, selectChannel] = useChannelTab("phone");
  const tabRefs = useRef<Record<DemoChannel, HTMLButtonElement | null>>({} as Record<DemoChannel, HTMLButtonElement | null>);
  const activeIndex = DEMO_CHANNELS.indexOf(activeChannel);

  const handleSelect = (k: DemoChannel) => {
    selectChannel(k);
    track("channel_tab_changed", { segment: activeSegment, channel: k });
  };

  const moveTo = (idx: number) => {
    const k = DEMO_CHANNELS[(idx + DEMO_CHANNELS.length) % DEMO_CHANNELS.length] as DemoChannel;
    handleSelect(k);
    tabRefs.current[k]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveTo(0);
        break;
      case "End":
        e.preventDefault();
        moveTo(DEMO_CHANNELS.length - 1);
        break;
    }
  };

  const panelId = `channel-panel-${activeChannel}`;
  const tabId = `channel-tab-${activeChannel}`;

  return (
    <section
      className="mx-auto max-w-page px-4 py-16 md:py-20"
      aria-labelledby="channel-demos-heading"
    >
      <Kicker number="06" label="Channel demos" />
      <h2
        id="channel-demos-heading"
        className="mt-6 font-display text-display-lg text-ink text-balance"
      >
        See it on every channel.
      </h2>
      <p className="mt-4 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Booking-ready conversations on phone, WhatsApp, Instagram, and your website.
      </p>

      <div
        role="tablist"
        aria-label="Channel selector"
        onKeyDown={handleKeyDown}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
      >
        {DEMO_CHANNELS.map((c) => {
          const { icon: Icon, label } = TAB_META[c];
          const isActive = c === activeChannel;
          return (
            <button
              key={c}
              ref={(el) => {
                tabRefs.current[c] = el;
              }}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`channel-panel-${c}`}
              id={`channel-tab-${c}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(c)}
              className={cn(
                "flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive ? "text-ink" : "text-fg-muted hover:text-ink"
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="font-display text-lg">{label}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-0.5 w-12 transition-colors duration-200 motion-reduce:transition-none",
                  isActive ? "bg-sage" : "bg-transparent"
                )}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        tabIndex={0}
        className="mt-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      >
        {activeChannel === "phone" ? (
          <PhoneDemoPanel segment={activeSegment} />
        ) : (
          <MessagingThread
            thread={CHANNEL_DEMOS[activeSegment][activeChannel]}
            channel={activeChannel}
          />
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button
          href={`/demo?v=${activeSegment}`}
          data-event="channel_demos_demo_clicked"
          onClick={() =>
            track("channel_demos_demo_clicked", { segment: activeSegment, channel: activeChannel })
          }
        >
          Book a demo
        </Button>
        <Button
          variant="ghost"
          href={`/audit?v=${activeSegment}`}
          data-event="channel_demos_audit_clicked"
          onClick={() =>
            track("channel_demos_audit_clicked", { segment: activeSegment, channel: activeChannel })
          }
        >
          Get my free revenue audit
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run test, expect PASS**

```bash
npm test -- src/components/sections/ChannelDemos.test.tsx
```

Expected: 9 passed.

- [ ] **Step 6: Full vitest sweep**

```bash
npm test 2>&1 | tail -5
```

Expected: 143 (pre-Phase-3) + 1 (sync) + 3 (channel tab) + 6 (thread) + 3 (phone) + 9 (channel demos) = 165 cases pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/ChannelDemos.tsx src/components/sections/ChannelDemos.test.tsx src/lib/analytics.ts
git commit -m "feat(section): ChannelDemos — 4 tabs, ARIA tablist, keyboard nav, segment-aware panels"
```

---

## Phase 5 — Wire into page + delete AudioDemo

### Task 5.1: Swap AudioDemo → ChannelDemos in page.tsx; delete AudioDemo files

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/sections/AudioDemo.tsx`
- Delete: `src/components/sections/AudioDemo.test.tsx`

- [ ] **Step 1: Edit `src/app/page.tsx`**

In `src/app/page.tsx`:
1. Change the import line `import { AudioDemo } from "@/components/sections/AudioDemo";` to `import { ChannelDemos } from "@/components/sections/ChannelDemos";`
2. Change the JSX `<AudioDemo />` to `<ChannelDemos initialSegment={initialVertical} />`

The complete updated `page.tsx` should match:

```tsx
import { Hero } from "@/components/sections/Hero";
import { ChannelsRibbon } from "@/components/sections/ChannelsRibbon";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { ChannelDemos } from "@/components/sections/ChannelDemos";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SegmentsShowcase } from "@/components/sections/SegmentsShowcase";
import { TestimonialWall } from "@/components/sections/TestimonialWall";
import { OutcomeStrip } from "@/components/sections/OutcomeStrip";
import { IntegrationsMarquee } from "@/components/sections/IntegrationsMarquee";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { SquiggleDivider } from "@/components/primitives/SquiggleDivider";
import { readVerticalFromUrl } from "@/lib/urlParams";
import type { VerticalKey } from "@/lib/verticals";

type Props = { searchParams: Promise<{ v?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const fakeUrl = new URL(`http://x/?v=${params.v ?? ""}`);
  const initialVertical: VerticalKey = readVerticalFromUrl(fakeUrl) ?? "dental";

  return (
    <>
      <Hero />
      <ChannelsRibbon />
      <SocialProofLogos />
      <SegmentsShowcase initialSegment={initialVertical} />
      <OutcomeStrip />
      <SquiggleDivider />
      <ChannelDemos initialSegment={initialVertical} />
      <RoiCalculator initialVertical={initialVertical} />
      <HowItWorks />
      <TestimonialWall />
      <IntegrationsMarquee />
      <PricingTeaser />
      <FaqAccordion />
      <FinalCtaBanner />
    </>
  );
}
```

- [ ] **Step 2: Delete the AudioDemo files**

```bash
git rm src/components/sections/AudioDemo.tsx src/components/sections/AudioDemo.test.tsx
```

- [ ] **Step 3: Verify no orphan references to AudioDemo**

```bash
grep -rE "AudioDemo" src/ tests/ --include="*.ts" --include="*.tsx" 2>/dev/null
```

Expected: empty.

- [ ] **Step 4: Run vitest + build**

```bash
npm test 2>&1 | tail -5
npm run build 2>&1 | tail -10
```

Expected: all tests pass, build succeeds, `✓ Placeholder guard passed`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(page): wire ChannelDemos at section 06; delete AudioDemo"
```

---

## Phase 6 — Verification

### Task 6.1: Playwright functional spec

**Files:**
- Create: `tests/e2e/channel-demos.spec.ts`

This task creates ONLY the functional tests (not the visual baselines — those land in Task 6.2 so the snapshots commit cleanly on their own).

- [ ] **Step 1: Create the functional spec**

Create `tests/e2e/channel-demos.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Channel demos — functional", () => {
  test("Phone tab is selected by default on plain /", async ({ page }) => {
    await page.goto("/");
    const phoneTab = page.getByRole("tab", { name: /Phone/i });
    await expect(phoneTab).toHaveAttribute("aria-selected", "true");
  });

  test("visiting /?v=beauty shows beauty phone transcript", async ({ page }) => {
    await page.goto("/?v=beauty");
    await expect(page.getByText(/balayage with Jess/i)).toBeVisible();
  });

  test("clicking WhatsApp tab swaps panel; URL ?v= unchanged", async ({ page }) => {
    await page.goto("/?v=beauty");
    await page.getByRole("tab", { name: /WhatsApp/i }).click();
    await expect(page).toHaveURL(/[?&]v=beauty\b/);
    // Beauty WhatsApp turn 1
    await expect(page.getByText(/can I book a balayage/i)).toBeVisible();
  });

  test("change segment via URL re-renders panel for current channel", async ({ page }) => {
    await page.goto("/?v=beauty");
    await page.getByRole("tab", { name: /WhatsApp/i }).click();
    await expect(page.getByText(/can I book a balayage/i)).toBeVisible();
    await page.goto("/?v=construction");
    await page.getByRole("tab", { name: /WhatsApp/i }).click();
    // Construction WhatsApp turn 1
    await expect(page.getByText(/Boiler leaking, water everywhere/i)).toBeVisible();
  });

  test("clicking a segment tab in SegmentsShowcase updates ChannelDemos panel without reload", async ({ page }) => {
    await page.goto("/?v=dental");
    await page.getByRole("tab", { name: /WhatsApp/i }).first().click();
    // Dental WhatsApp turn 1
    await expect(page.getByText(/Hi, my crown fell out/i)).toBeVisible();

    // Click the Fitness segment tab in SegmentsShowcase (above ChannelDemos).
    // SegmentsShowcase tablist is labelled "Segment selector"; ChannelDemos tablist is "Channel selector".
    const segmentsList = page.getByRole("tablist", { name: /Segment selector/i });
    await segmentsList.getByRole("tab", { name: /Fitness studios/i }).click();

    // ChannelDemos panel should now show fitness WhatsApp turn 1 — without a page reload.
    await expect(page.getByText(/Do you have a 6pm spin class tonight/i)).toBeVisible();
  });

  test("ArrowRight cycles channel tabs", async ({ page }) => {
    await page.goto("/?v=dental");
    const phoneTab = page.getByRole("tab", { name: /Phone/i });
    await phoneTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /WhatsApp/i })).toHaveAttribute("aria-selected", "true");
  });

  test("Home and End jump tabs", async ({ page }) => {
    await page.goto("/?v=dental");
    await page.getByRole("tab", { name: /Instagram/i }).focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: /Web chat/i })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
  });
});
```

- [ ] **Step 2: Run the functional spec**

```bash
npm run test:e2e -- tests/e2e/channel-demos.spec.ts
```

Expected: 7 passed.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/channel-demos.spec.ts
git commit -m "test(e2e): v4 ChannelDemos functional + cross-section sync"
```

### Task 6.2: Playwright visual baselines (10 screenshots)

**Files:**
- Modify: `tests/e2e/channel-demos.spec.ts` (append visual tests + their snapshot directory)

- [ ] **Step 1: Append the visual-regression block**

Add this block to the end of `tests/e2e/channel-demos.spec.ts`, BELOW the existing `test.describe("Channel demos — functional", ...)` block:

```ts
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 800 };

const CHANNEL_TABS = [
  { key: "phone", label: /Phone/i },
  { key: "whatsapp", label: /WhatsApp/i },
  { key: "instagram", label: /Instagram/i },
  { key: "web", label: /Web chat/i },
] as const;

async function snapPanel(page: import("@playwright/test").Page, name: string) {
  const section = page.locator('section[aria-labelledby="channel-demos-heading"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(section).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.02 });
}

test.describe("Channel demos — visual baselines", () => {
  for (const tab of CHANNEL_TABS) {
    test(`desktop 1440 · ?v=beauty · ${tab.key}`, async ({ browser }) => {
      const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: DESKTOP });
      const page = await ctx.newPage();
      await page.goto("/?v=beauty");
      await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: tab.label }).click();
      await snapPanel(page, `channel-demos-desktop-beauty-${tab.key}`);
      await ctx.close();
    });
  }

  for (const tab of CHANNEL_TABS) {
    test(`mobile 375 · ?v=beauty · ${tab.key}`, async ({ browser }) => {
      const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: MOBILE });
      const page = await ctx.newPage();
      await page.goto("/?v=beauty");
      await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: tab.label }).click();
      await snapPanel(page, `channel-demos-mobile-beauty-${tab.key}`);
      await ctx.close();
    });
  }

  test("desktop 1440 · ?v=vet · whatsapp (longest WA thread)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: DESKTOP });
    const page = await ctx.newPage();
    await page.goto("/?v=vet");
    await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: /WhatsApp/i }).click();
    await snapPanel(page, "channel-demos-desktop-vet-whatsapp");
    await ctx.close();
  });

  test("desktop 1440 · ?v=construction · web (longest Web thread)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: DESKTOP });
    const page = await ctx.newPage();
    await page.goto("/?v=construction");
    await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: /Web chat/i }).click();
    await snapPanel(page, "channel-demos-desktop-construction-web");
    await ctx.close();
  });
});
```

- [ ] **Step 2: Generate the 10 visual baselines**

```bash
npm run test:e2e -- tests/e2e/channel-demos.spec.ts --update-snapshots
```

Expected: 10 new PNG files in `tests/e2e/channel-demos.spec.ts-snapshots/`. List them:

```bash
ls tests/e2e/channel-demos.spec.ts-snapshots/
```

Expected: 10 files matching `channel-demos-{desktop,mobile}-{beauty,vet,construction}-{phone,whatsapp,instagram,web}-chromium-desktop-darwin.png` (or similar — Playwright suffixes per-project).

Eyeball at least 3 of them in a previewer to confirm the rendered layout makes sense (no broken styling, bubbles wrap correctly on mobile).

- [ ] **Step 3: Re-run without `--update-snapshots` to confirm green**

```bash
npm run test:e2e -- tests/e2e/channel-demos.spec.ts
```

Expected: 17 passed (7 functional + 10 visual).

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/channel-demos.spec.ts tests/e2e/channel-demos.spec.ts-snapshots
git commit -m "test(visual): v4 ChannelDemos — 10 baselines (4 desktop + 4 mobile + 2 longest-thread)"
```

### Task 6.3: Re-baseline whole-page visual regression

**Files:**
- Modify: `tests/e2e/visual.spec.ts-snapshots/*.png` (regenerated)

The whole-page baselines from v3 captured the old `AudioDemo`; the new `ChannelDemos` section is a different height and layout. Re-baseline.

- [ ] **Step 1: Update existing landing snapshots**

```bash
npm run test:e2e -- tests/e2e/visual.spec.ts --update-snapshots
```

Expected: snapshots regenerated.

- [ ] **Step 2: Run full Playwright sweep**

```bash
npm run test:e2e 2>&1 | tail -10
```

Expected: all pass (functional + channel-demos visual + whole-page visual + segments visual + a11y + reveal motion).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/visual.spec.ts-snapshots
git commit -m "test(visual): re-baseline landing snapshots for v4 ChannelDemos"
```

### Task 6.4: Lighthouse v4 run + bundle delta + populate baseline doc

**Files:**
- Modify: `docs/superpowers/lighthouse-baseline-v4.md`

- [ ] **Step 1: Build + serve**

```bash
pkill -f "next start" 2>/dev/null; true
npm run build && (npm run start &) && sleep 5
```

- [ ] **Step 2: Lighthouse desktop + mobile**

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=desktop \
  --output=json --output-path=./lighthouse-desktop-v4-post.json \
  --quiet --chrome-flags="--headless"

npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=./lighthouse-mobile-v4-post.json \
  --quiet --chrome-flags="--headless"
```

- [ ] **Step 3: Measure bundle delta**

```bash
POST=$(du -b .next/static/chunks/*.js | awk '{s+=$1} END {print s}')
PRE=$(cat docs/superpowers/v4-bundle-baseline-bytes.txt)
DELTA=$((POST - PRE))
echo "PRE=$PRE POST=$POST DELTA=$DELTA bytes (target ≤ 5120)"
```

Expected: `DELTA` ≤ 5120 (5KB gzipped equivalent — note `du -b` measures raw bytes; gzipped is roughly ~30–40% of raw, so a raw delta of ~15000 still likely meets the 5KB gzipped target. If raw delta exceeds 15000, investigate.)

- [ ] **Step 4: Kill server**

```bash
pkill -f "next start" || true
```

- [ ] **Step 5: Populate `## v4 results` in `docs/superpowers/lighthouse-baseline-v4.md`**

Read the two `*-v4-post.json` files using the same extraction script from Task 0.2 Step 4. Compute Δs vs the pre-v4 baseline.

Replace the `(Filled in by Phase 6.)` line in `docs/superpowers/lighthouse-baseline-v4.md` with this block. Fill the placeholders.

```markdown
## v4 results

**Captured:** 2026-05-28 post-implementation
**Commit:** <run `git rev-parse HEAD` and paste full SHA>

### Desktop v4
- Performance: <score> (Δ vs pre-v4)
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <ms> ms (Δ vs pre-v4)
- CLS: <value>
- TBT: <ms> ms

### Mobile v4
- Performance: <score> (Δ vs pre-v4)
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <ms> ms (Δ vs pre-v4)
- CLS: <value>
- TBT: <ms> ms

### Bundle delta
- Pre-v4 static-chunk total: <PRE> bytes
- Post-v4 static-chunk total: <POST> bytes
- Delta: <DELTA> bytes (target ≤ 5120 gzipped ≈ 15000 raw)

### Gate verdict
- ✅/❌ Desktop Performance: <score> ≥ <baseline − 5>
- ✅/❌ Mobile Performance: <score> ≥ <baseline − 5>
- ✅/❌ CLS: <desktop> / <mobile> both < 0.1
- ✅/❌ TBT: <desktop> ms / <mobile> ms both ≤ baseline + 50 ms
- ✅/❌ Bundle delta: <DELTA> bytes ≤ target
- ✅/❌ A11y, BP, SEO: no regression vs baseline
```

Fill every placeholder with the actual measurement. Use ✅ where a gate passes and ❌ where it fails. If any gate fails, mark the task as DONE_WITH_CONCERNS in the implementer report and explain in the doc which gate failed.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/lighthouse-baseline-v4.md
git commit -m "docs(perf): Lighthouse v4 results + bundle delta + gate verdict"
```

### Task 6.5: Final sweep + milestone tag

**Files:**
- (no source changes — verification + tag)

- [ ] **Step 1: Full vitest sweep**

```bash
npm test 2>&1 | tail -5
```

Expected: all pass — count should be ~162 (143 pre-Phase-3 + 1 sync test + 3 useChannelTab + 6 MessagingThread + 3 PhoneDemoPanel + 9 ChannelDemos − 0 AudioDemo deletions if AudioDemo had a test file). Note: AudioDemo had a test (`AudioDemo.test.tsx`) so subtract its case count from the total (the v3 AudioDemo test had 1 case; verify by checking if `143 − 1 + 22 = 164`).

Whatever the exact number, the run must show `0 failed`.

- [ ] **Step 2: Full Playwright sweep**

```bash
npm run test:e2e 2>&1 | tail -10
```

Expected: all pass — including the 17 new ChannelDemos tests + re-baselined whole-page snapshots + all existing axe / segments / motion specs.

- [ ] **Step 3: Build + placeholder guard**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ Placeholder guard passed`.

- [ ] **Step 4: Verify acceptance criteria from spec §13**

```bash
# §13.1 — AudioDemo gone
grep -rEn "\bAudioDemo\b" src/ tests/ --include="*.ts" --include="*.tsx" 2>/dev/null

# §13.4 — 4 lucide channel icons present in ChannelDemos
grep -E "PhoneIncoming|MessageCircle|Instagram|MessagesSquare" src/components/sections/ChannelDemos.tsx

# §13.14 — 4 new tokens in globals.css and used in MessagingThread
grep -E "^\s+--(terracotta|terracotta-soft|sage-soft|ink-soft)" src/app/globals.css
grep -E "bg-(sage-soft|terracotta-soft|ink-soft)" src/components/channels/MessagingThread.tsx
```

Expected:
- AudioDemo grep: empty.
- 4 lucide icons present (4 matching lines).
- 4 token lines in `globals.css`.
- 3 `bg-*-soft` references in `MessagingThread.tsx`.

- [ ] **Step 5: Milestone commit + tag**

```bash
git commit --allow-empty -m "milestone: v4 channel demos — all gates green"
git tag v4-channel-demos
```

- [ ] **Step 6: Push branch + tag**

```bash
git push origin feat/landing-v1
git push origin v4-channel-demos
```

The user typically then asks to merge `feat/landing-v1` into `main` separately — that's outside this plan's scope.

---

## Self-Review

### Spec coverage check

Walk through each spec section and verify a task implements it:

| Spec section | Task(s) |
|---|---|
| §0 Revisions (post-council) | §6.6 fix lands in Task 3.1; §11.2 fix lands in Task 6.1 (`?v=construction`); §6.3 fix lands in Task 3.4 |
| §1 Goals | All tasks |
| §2 v3→v4 audit | Task 5.1 (swap + delete AudioDemo) |
| §3 Voice rules | Task 2.1 (content respects rule; vocab guard enforces no AI in compiled output via Task 6.5) |
| §4 IA position | Task 5.1 (page.tsx swap) |
| §5.1 Header (Kicker "Channel demos") | Task 4.1 |
| §5.2 Tab strip (icons + labels) | Task 4.1 |
| §5.3 Panel (no min-h) | Task 4.1 |
| §5.4 Footer CTAs (segment-aware hrefs + analytics) | Task 4.1 |
| §6.1 File layout | Phases 2–5 collectively |
| §6.2 ChannelDemos component | Task 4.1 |
| §6.3 PhoneDemoPanel (transcript always rendered) | Task 3.4 |
| §6.4 MessagingThread (channel-tinted bubbles + meta) | Task 3.3 |
| §6.5 useChannelTab | Task 3.2 |
| §6.6 useSegmentParam broadcast/listen | Task 3.1 |
| §7 24 threads | Task 2.1 |
| §8 Tokens + Tailwind extend | Tasks 1.1 + 1.2 |
| §8.3 Channel tints in MessagingThread | Task 3.3 |
| §8.4 Motion (200ms opacity fade, reduced-motion safe) | Task 4.1 |
| §9 A11y (tablist, tabpanel, MessagingThread semantic) | Tasks 3.3 + 4.1 |
| §10 Perf gates (incl. bundle ≤ 5KB) | Tasks 0.1, 0.2, 6.4 |
| §11.1 Vitest cases (~19) | Tasks 3.1, 3.2, 3.3, 3.4, 4.1 |
| §11.2 Playwright e2e | Tasks 6.1, 6.2, 6.3 |
| §11.3 Axe | Existing test stays green — Task 6.5 verifies |
| §11.4 Vocab guard | Task 6.5 |
| §11.5 Bundle gate | Tasks 0.1, 6.4 |
| §12 Out of scope (deferred) | not implemented (correct) |
| §13 Acceptance criteria | Task 6.5 verifies each |

All spec sections covered. No gaps.

### Placeholder scan

Searched for "TBD", "TODO", "fill in", "implement later", "similar to" — none present (the only "TBD" appears inside the spec's own §11.4 description, not in the plan).

### Type consistency

- `DemoChannel = "phone" | "whatsapp" | "instagram" | "web"` defined once in `src/content/channelDemos.ts` (Task 2.1), imported in `useChannelTab` (Task 3.2), `ChannelDemos` (Task 4.1).
- `VerticalKey` imported from `@/lib/verticals` consistently in Tasks 2.1, 3.1, 3.4, 4.1.
- `Thread` / `ThreadTurn` exported from `channelDemos.ts` in Task 2.1, consumed by `MessagingThread.test.tsx` and `PhoneDemoPanel.tsx`.
- `useSegmentParam(initialSegment: VerticalKey)` signature unchanged from v3; Task 3.1 preserves the public contract while adding broadcast/listen.
- `useChannelTab(initial: DemoChannel = "phone")` signature consistent between Task 3.2 implementation and Task 4.1 consumer.
- 3 new analytics events (`channel_tab_changed`, `channel_demos_demo_clicked`, `channel_demos_audit_clicked`) — all carry `{ segment: VerticalKey; channel: DemoChannel }`. Task 4.1 Step 1 adds them to the union with the same payload shape Task 4.1 Step 4 fires.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-28-anna-reception-v4-channel-demos-plan.md`. Two execution options:

1. **Subagent-Driven (recommended)** — controller dispatches a fresh subagent per task, reviews between tasks, fast iteration. Matches how v2, v3, and Sprints A/B/C were executed.
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Which approach?
