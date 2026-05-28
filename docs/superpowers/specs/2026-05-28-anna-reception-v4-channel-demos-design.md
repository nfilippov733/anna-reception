# ANNA Reception v4 — Channel demos (booking proof across all channels)

**Status:** approved by user 2026-05-28 (sections §1–§4 walked through and approved sequentially)
**Predecessor:** `docs/superpowers/specs/2026-05-27-anna-reception-v3-segments-channels-design.md` (v3 segments + channels + no-AI, shipped at tag `v3-segments-channels`)
**Target branch:** `feat/landing-v1`
**Scope:** Replace the single-channel phone demo (`AudioDemo.tsx`) with a tabbed 4-channel demos section (`ChannelDemos.tsx`) that proves booking flows on phone, WhatsApp, Instagram, and web chat — segment-aware via shared URL `?v=<key>` state.

---

## 0. Revisions

**2026-05-28 post-council revision:** applied 3 critical fixes flagged by the agent-tower council (UX Designer + Frontend Engineer personas, 82% consensus). Specifically:
- §6.6 added: `useSegmentParam` upgraded to broadcast/listen via a window CustomEvent so sibling sections (SegmentsShowcase, RoiCalculator, ChannelDemos) stay in sync after a client-side segment change. Closes a latent v3 bug that would otherwise ship through v4.
- §11.2 corrected: `/?v=construction` → `/?v=construction` (the data key is `construction`; display label is "Trades"). Three occurrences across §11.2 and §13.7 swept.
- §6.3 clarified: the Phone tab transcript is **always** rendered (segment-aware fallback). When `NEXT_PUBLIC_GENERIC_AUDIO_SRC` is configured, audio plays alongside the transcript rather than replacing it. Acceptance criterion 7 aligned.

All 11 additional post-council findings applied in revision `<commit-SHA-pending>` (2026-05-28). Spec is implementation-ready.

---

## 1. Goals

The v3 landing **claims** omnichannel — five channels in `ChannelsRibbon`, channel-mix percentages in each `SegmentPanel`, a FAQ entry on WhatsApp/DMs — but **proves only phone** (`AudioDemo` shows a single phone-call transcript). The marketing claim and the demonstrated capability are out of sync. This spec closes that gap with one new section.

Three concrete intents:

1. **Visual proof for messaging channels.** Render chat-thread mockups for WhatsApp, Instagram DM, and web chat alongside the existing phone audio. The visitor should see, not just read, that ANNA books on every channel.
2. **Segment-aware demos.** Each channel mockup adapts to the active segment (dental / beauty / pubs / construction / fitness / vet). Switching segments at the top of the page rolls through to the channel demos automatically — same URL `?v=<key>` already used by `SegmentsShowcase` and `RoiCalculator`.
3. **Stay on-brand, no trademark risk.** Mockups are stylized in the editorial ANNA palette (cream + sage + ink + terracotta) with subtle channel-distinguishing tints. No pixel-accurate recreation of WhatsApp green or Instagram gradients — that risks Meta takedowns and breaks the editorial direction set in v1.

Two structural mandates:

4. **Absorb the existing `AudioDemo`** as the Phone tab. One section block, four tabs. Keeps the page narrative coherent ("see it on every channel") and avoids doubling the "watch how it works" beat.
5. **Click-only tab interaction.** No auto-rotate or scroll-triggered demo reel. Aligns with the calm motion direction established in v2 and the `prefers-reduced-motion` discipline.

---

## 2. Audit — what changes between v3 and v4

| Page beat | v3 (current) | v4 |
|---|---|---|
| Channels ribbon (02) | unchanged | unchanged |
| Segments showcase (04) | unchanged | unchanged |
| Outcome strip (05) | unchanged | unchanged |
| **Audio/channel block (06)** | `AudioDemo.tsx` — single phone-call transcript | `ChannelDemos.tsx` — 4 tabs (Phone / WhatsApp / Instagram / Web chat), segment-aware |
| ROI (07) | unchanged | unchanged |
| Everything else | unchanged | unchanged |

This is a one-section swap. No IA reshuffle, no Kicker renumber.

Files deleted: `src/components/sections/AudioDemo.tsx` and its test.
Files created: 1 new section, 1 new sub-component, 1 new primitive, 1 new content file (see §6 and §7).

---

## 3. Voice rules (subset of v3 §3, applied to this section)

The voice rules from v3 still hold. For this section in particular:

- **Outcome > feature.** Every mockup ends with a booking confirmed, an emergency routed, a deposit link sent. Never just "we'll get back to you".
- **No "AI".** Mockups address the customer as ANNA introduces by business name. The narrator framing (Kicker, H2, sub) uses "ANNA Reception" / "ANNA" / "automated reception" — never "AI".
- **UK English.** "booked", "diary", "postcode", "mobile". Contractions allowed. En-dashes.
- **One or two short sentences per turn — max two.** Realistic chat cadence — confirm-and-prompt is the natural exception (e.g. "Booked. Address sent."). No paragraphs in bubbles. Three-sentence ANNA replies are forbidden — split them across turns.

---

## 4. Section position + IA

```
01 Hero
02 Channels ribbon
03 Social proof
04 Segments showcase
05 Outcome strip
─── SquiggleDivider ───
06 Channel demos          ← [REPLACED] was AudioDemo
07 ROI calculator
08 How it works
09 Testimonials
10 Integrations
11 Pricing
12 FAQ
13 Final CTA
```

Section 06 is the only line that changes. The `<SquiggleDivider />` between OutcomeStrip and section 06 is preserved.

### 4.1 page.tsx diff

`src/app/page.tsx` swaps the import and JSX:

```diff
- import { AudioDemo } from "@/components/sections/AudioDemo";
+ import { ChannelDemos } from "@/components/sections/ChannelDemos";
  ...
- <AudioDemo />
+ <ChannelDemos initialSegment={initialVertical} />
```

`initialVertical` is the same `VerticalKey` that `RoiCalculator` and `SegmentsShowcase` already receive.

---

## 5. Section shape, layout, copy

### 5.1 Header

```
Kicker:   06 · Channel demos
H2:       See it on every channel.
Sub:      Booking-ready conversations on phone, WhatsApp, Instagram, and your website.
```

The H2 makes the declarative claim — fits anna.money's declarative-fact pattern (see v3 §3 voice rules). The Kicker label is distinct per the project rule established in commit `2b60fd8`.

### 5.2 Tab strip

Below the header, a 4-tab strip:

```
[ Phone* ] [ WhatsApp ] [ Instagram ] [ Web chat ]
   ─── active
```

Each tab button: lucide icon (top, 24px) + label (below, `font-display text-lg`). Active state: 2px sage underline (12px wide, mt-1) + `text-ink`. Inactive: `text-fg-muted` + transparent underline. Hover: `text-ink` (lifts colour).

Tab strip uses `flex` on desktop (4 across), `grid grid-cols-2` on tablet (2×2), single column on mobile.

| Channel | Icon (lucide) | Label |
|---|---|---|
| phone | `PhoneIncoming` | Phone |
| whatsapp | `MessageCircle` | WhatsApp |
| instagram | `Instagram` | Instagram |
| web | `MessagesSquare` | Web chat |

`Instagram` is now available from `lucide-react` 0.577 (bumped in Sprint C). No `Camera` substitute.

### 5.3 Panel

Below the tab strip, a single panel that swaps content based on the active channel × active segment. Panel container is `<div role="tabpanel">` with `tabIndex={0}` and ARIA wiring per §9.

The panel container does NOT enforce a min-height. Tab clicks are user-initiated, so layout shifts on tab swap do not count toward CLS (the metric excludes shifts within 500ms of user input). The section's downstream content (ROI calculator) will reflow naturally when the visitor changes channels — acceptable.

**Phone panel layout:**

```
┌────────────────────────────────────────────────────────┐
│ ▶  ∼∼∼∼ Waveform ∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼  │
│ ──────────────────────────────────────────────────── │
│ Sample transcript                                    │
│                                                       │
│ CALLER                                                │
│ Hi, my crown fell out yesterday.                     │
│                                                       │
│ ANNA                                                  │
│ I can fit you in at 16:30.                           │
│                                                       │
│ ... 4 turns total ...                                │
│                                                       │
│ Audio sample available at launch · or hear her live ↓│
└────────────────────────────────────────────────────────┘
```

Reuses `PlayButton` + `Waveform` primitives. Transcript is segment-aware (see §7). Beneath transcript: existing "Or hear her live yourself: [PhoneChip]" affordance (kept from `AudioDemo`).

**Messaging panel layout** (WhatsApp / Instagram / Web chat):

```
┌────────────────────────────────────────────────────────┐
│ [icon]  Channel name                                  │
│         Business booking thread                        │
│ ──────────────────────────────────────────────────── │
│                                                       │
│ ┌─ caller ─┐                                          │
│ │ tinted bubble L                                     │
│ │ "Hi, can I book…"                                   │
│ └──────────┘                                          │
│                                                       │
│            ┌─ ANNA ─────────────┐                     │
│            │ cream bubble R     │                     │
│            │ "Sure, 11am works" │                     │
│            └────────────────────┘                     │
│                                                       │
│ ... 4–6 turns total ...                              │
│                                                       │
│ Calendar invite ↗ / SMS confirmation ✓ / etc.        │
└────────────────────────────────────────────────────────┘
```

`MessagingThread` (new primitive — see §6.4) renders the bubble pattern. Channel tint applied per §8.

### 5.4 Footer CTAs

```
[ Book a demo ]    [ Get my free revenue audit ↗ ]
```

Two buttons mirroring Hero. Each carries the **active segment** in the href so the form pre-fills:

- `Book a demo` → `/demo?v=<active segment>` · event `channel_demos_demo_clicked` · payload `{ segment, channel }`
- `Get my free revenue audit` → `/audit?v=<active segment>` · event `channel_demos_audit_clicked` · payload `{ segment, channel }`

The `channel` in the analytics payload is the channel tab the user clicked from. Helps GTM see which channel sold the demo.

---

## 6. Component structure

### 6.1 File layout

**Create:**
- `src/components/sections/ChannelDemos.tsx` — section wrapper, tab strip, panel router, footer CTAs
- `src/components/sections/ChannelDemos.test.tsx`
- `src/components/channels/PhoneDemoPanel.tsx` — Phone tab body
- `src/components/channels/PhoneDemoPanel.test.tsx`
- `src/components/channels/MessagingThread.tsx` — chat-bubble renderer (channel-tinted)
- `src/components/channels/MessagingThread.test.tsx`
- `src/content/channelDemos.ts` — all 24 threads (6 segments × 4 channels)
- `src/lib/useChannelTab.ts` — local state hook for active channel tab (lightweight, no URL persistence)
- `src/lib/useChannelTab.test.tsx`

**Modify:**
- `src/app/page.tsx` — swap AudioDemo → ChannelDemos (§4.1)
- `src/lib/analytics.ts` — add 3 events: `channel_tab_changed`, `channel_demos_demo_clicked`, `channel_demos_audit_clicked`
- `src/app/globals.css` — add 3 new tokens (`--terracotta`, `--terracotta-soft`, `--sage-soft`, `--ink-soft`); Tailwind config picks them up via `extend.colors`
- `tailwind.config.ts` — extend `colors` map with the new tokens

**Delete:**
- `src/components/sections/AudioDemo.tsx`
- `src/components/sections/AudioDemo.test.tsx`

### 6.2 `ChannelDemos.tsx` — top-level section

```tsx
"use client";
type Props = { initialSegment: VerticalKey };
```

Responsibilities:
1. Subscribe to `useSegmentParam(initialSegment)` (shared with SegmentsShowcase) → `activeSegment`
2. Hold local channel state via `useChannelTab()` → `activeChannel` + `selectChannel`
3. Render Kicker + H2 + sub
4. Render tab strip (4 buttons, ARIA tablist, roving tabindex, Arrow/Home/End nav)
5. Render the active panel: `<PhoneDemoPanel>` if channel === phone, otherwise `<MessagingThread>` with the right thread + channel tint
6. Render footer CTAs with segment-aware hrefs

Tab strip uses the same keyboard-nav pattern as `SegmentsShowcase` (see `src/components/sections/SegmentsShowcase.tsx` lines 28–52 for reference).

Tab-change side effects:
- Fire `track("channel_tab_changed", { segment: activeSegment, channel: nextChannel })`
- Local state only — no URL update for channel

### 6.3 `PhoneDemoPanel.tsx` — Phone tab body

```tsx
type Props = { segment: VerticalKey };
```

Wraps PlayButton + Waveform + transcript + PhoneChip. Transcript is segment-aware — pulled from `CHANNEL_DEMOS[segment].phone` (see §7).

**Revised contract (post-council):** the segment-aware transcript is **always rendered**, regardless of whether real audio is wired. Audio is an optional add-on that augments the visible transcript — it does not replace it. This keeps the Phone tab segment-aware in production once `NEXT_PUBLIC_GENERIC_AUDIO_SRC` lands.

- If `NEXT_PUBLIC_GENERIC_AUDIO_SRC` is empty: PlayButton is rendered but disabled (`aria-disabled="true"`, no click handler), Waveform shows static idle bars, transcript visible, meta line shows the segment-specific fallback from `CHANNEL_DEMOS[segment].phone.at(-1).meta` (e.g. *"Audio sample available at launch"*).
- If `NEXT_PUBLIC_GENERIC_AUDIO_SRC` is present: PlayButton is interactive, Waveform animates while playing, transcript stays visible the entire time.
- Fires `audio_demo_played` and `audio_demo_completed_30s` analytics events (already in the union).

The component does NOT render its own Kicker/H2 — those live on the parent `ChannelDemos`.

### 6.4 `MessagingThread.tsx` — chat-bubble renderer

```tsx
type Props = { thread: Thread; channel: "whatsapp" | "instagram" | "web" };
```

Pure render. No state. Layout:

- Container: `<div>` with `aria-label="Messaging thread"`.
- Header row: lucide icon (`MessageCircle` / `Instagram` / `MessagesSquare`) + channel name + caption "Business booking thread" / "Direct message" / "Web chat".
- Thread: `<ol role="list">` with `<li>` per turn.
- Bubble: rounded `rounded-2xl` with channel-tinted bg for `caller`, `bg-cream-deep` for `anna`. Caller bubble left-aligned (`mr-auto max-w-[80%]`). ANNA bubble right-aligned (`ml-auto max-w-[80%]`). 12–16px padding.
- Meta line: small text below the last bubble, `font-mono text-xs uppercase tracking-wider text-mono-label`.

Channel tints applied via:

```tsx
const incomingBg = {
  whatsapp: "bg-sage-soft",
  instagram: "bg-terracotta-soft",
  web: "bg-ink-soft",
}[channel];
```

### 6.6 `useSegmentParam` upgrade (cross-section sync)

The current `src/lib/useSegmentParam.ts` reads `?v=` only on mount and writes via `history.replaceState` without firing any event. Sibling sections that subscribe to the hook (SegmentsShowcase, RoiCalculator, and the new ChannelDemos) hold independent state — when one calls `select()`, the others never learn. v3 didn't surface this because initial SSR synced everyone through `searchParams`; v4's cross-section promise (segment-change rolls through to ChannelDemos) requires real client-side sync.

Modify `src/lib/useSegmentParam.ts`:

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for sibling-driven segment changes (NEW).
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
      // Broadcast (NEW). Self-listen is harmless: handler short-circuits on `=== active`.
      window.dispatchEvent(new CustomEvent<SegmentChangedDetail>(SEGMENT_CHANGED, { detail: { segment: k } }));
    }
  };

  return [active, select];
}
```

Event name is namespaced (`anna:`) to avoid collision with anything else on `window`. No external dependency, no context provider — minimal change, full sync.

New test in `src/lib/useSegmentParam.test.tsx` (+1 case):

```ts
it("syncs across instances via the anna:segment-changed event", () => {
  // Mount two probes. select() on one updates the other's state.
  // (Verify by re-rendering and checking the second probe sees the new value.)
});
```

### 6.5 `useChannelTab` hook

```ts
import { DEMO_CHANNELS, type DemoChannel } from "@/content/channelDemos";

export function useChannelTab(initial: DemoChannel = "phone"): [DemoChannel, (k: DemoChannel) => void];
```

`DemoChannel` and `DEMO_CHANNELS` are defined once in `src/content/channelDemos.ts` (§7) and imported here — no duplication.

Lightweight `useState` wrapper. Default initial: `"phone"`. Validates on `selectChannel` against `DEMO_CHANNELS`. No URL persistence — channel choice is ephemeral.

(Why not just `useState` inline? — a hook lets us write a small focused test for "ignores invalid channel keys" and matches the pattern of `useSegmentParam`.)

---

## 7. Content data (`src/content/channelDemos.ts`)

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

export const CHANNEL_DEMOS: Record<VerticalKey, Record<DemoChannel, Thread>> = { /* see below */ };
```

24 threads total — 6 segments × 4 channels each. Phone transcripts are short (3–4 turns); messaging threads are 4–6 turns.

### 7.1 dental

**phone:**
```
caller: "Hi, my crown fell out yesterday."
anna:   "I can fit you in at 16:30 with Dr. Patel."
caller: "Yes please."
anna:   "Booked. SMS on its way."
meta:   "Audio sample available at launch"
```

**whatsapp:**
```
caller: "Hi, my crown fell out yesterday. Can someone see me today?"
anna:   "I can fit you in at 16:30 with Dr. Patel — does that work?"
caller: "Yes please"
anna:   "Booked. Are you Denplan or NHS?"
caller: "NHS Band 2"
anna:   "Noted. Address + 30-min arrival window sent to your phone."
meta:   "SMS confirmation ✓"
```

**instagram:**
```
caller: "Hey, saw your reel on Invisalign. Do you do free consults?"
anna:   "We do — 20-min consult, no charge. Any preferred day?"
caller: "Wednesday afternoon?"
anna:   "14:00 or 16:00 with Dr. Patel?"
caller: "14:00"
anna:   "Booked. Calendar invite + clinic address in DMs."
meta:   "Calendar invite ↗"
```

**web:**
```
caller: "Looking for a new dentist — do you take new NHS patients?"
anna:   "We do — taking new NHS patients. Earliest exam is Thu 10:30 with Dr. Patel."
caller: "Anything earlier in the morning?"
anna:   "Wed 08:30 just opened — yours if you'd like."
caller: "Yes"
anna:   "Booked. I'll text the address and a quick health-form link."
meta:   "SMS sent ✓"
```

### 7.2 beauty

**phone:**
```
caller: "Can I book a balayage with Jess for Saturday?"
anna:   "11:00 or 15:00 — both 3 hrs."
caller: "15:00 please."
anna:   "Booked. Deposit link incoming."
meta:   "Audio sample available at launch"
```

**whatsapp:**
```
caller: "Hi, can I book a balayage with Jess for Saturday?"
anna:   "Jess has 11:00 or 15:00 Saturday — both 3 hrs. Add a toner?"
caller: "15:00 with toner please"
anna:   "Booked. £40 deposit holds it — link?"
caller: "Yep"
anna:   "Sent. See you Sat at 15:00 ✓"
meta:   "Mane Studio Manchester"
```

**instagram:**
```
caller: "Saw your reel of the bridal trial yesterday — do you do those?"
anna:   "We do! Trial £85, day-of from £230. Date in mind?"
caller: "Saturday 13 June afternoon"
anna:   "Trial available 13:00 or 16:00 Sat 13 Jun. Which?"
caller: "16:00 please"
anna:   "Held. Sending confirmation + day-of quote."
meta:   "Calendar invite ↗"
```

**web:**
```
caller: "Hi — looking for partial highlights this week"
anna:   "Welcome. Wed 14:00 or Thu 10:00 with Maya — both 90 min, £120."
caller: "Wed 14:00"
anna:   "Name for the booking + a small deposit?"
caller: "Lisa K, yes"
anna:   "Booked Lisa — see you Wed at 14:00."
meta:   "Confirmation emailed ✓"
```

### 7.3 pubs

**phone:**
```
caller: "Table for 6 Friday around 19:30?"
anna:   "19:00 or 20:00 — kitchen's slammed at 19:30."
caller: "20:00."
anna:   "Booked. Allergens to flag?"
meta:   "Audio sample available at launch"
```

**whatsapp:**
```
caller: "Table for 6 Friday around 19:30?"
anna:   "19:00 or 20:00 Friday works — kitchen's slammed at 19:30. Allergens?"
caller: "20:00. One gluten-free"
anna:   "Got it — flagged to the chef. High chair?"
caller: "Yes, one"
anna:   "Booked. Confirmation + cancellation link sent."
meta:   "The Black Swan, Cotswolds"
```

**instagram:**
```
caller: "Hi! Following you for ages. Any chance of 4 covers Sunday roast?"
anna:   "Roast service runs 12:00–17:00. 13:30 or 15:00 — which?"
caller: "13:30"
anna:   "Names for the booking?"
caller: "Tom + 3"
anna:   "Booked Tom. See you 13:30 Sunday."
meta:   "Calendar invite ↗"
```

**web:**
```
caller: "Hi, looking to book a private dining room for 14 people in June."
anna:   "Sat 14 Jun or Sat 21 Jun both have the snug free. Set menu from £42pp."
caller: "Sat 14 Jun please"
anna:   "Reserved. £150 holds it — payment link?"
caller: "Yes"
anna:   "Sent. Set-menu options follow by email."
meta:   "Email confirmation ✓"
```

### 7.4 construction

**phone:**
```
caller: "Boiler leaking, water everywhere."
anna:   "Is the stop-tap off?"
caller: "Just turned it."
anna:   "Mark D in your postcode 14:00 — holding the slot."
meta:   "Audio sample available at launch"
```

**whatsapp:**
```
caller: "Boiler leaking, water everywhere. Can you come today?"
anna:   "First — is the stop-tap off?"
caller: "Just turned it"
anna:   "Mark D is in your postcode at 14:00. I'm holding the slot — confirm?"
caller: "Yes please"
anna:   "Held. Mark will text his ETA. Address + plate ID sent."
meta:   "DJ Plumbing & Gas"
```

**instagram:**
```
caller: "Hi, saw your kitchen refit reel. Do you quote for similar?"
anna:   "We do — full-day site visit, no charge. Postcode?"
caller: "NW1"
anna:   "In your area. Thu morning or Fri afternoon?"
caller: "Thu morning"
anna:   "Booked. Mark will arrive 09:30 with the survey kit."
meta:   "Calendar invite ↗"
```

**web:**
```
caller: "Looking for a quote on a bathroom rip-out + retile"
anna:   "Happy to. Photos help — drop 4–6 here or a Drive link?"
caller: "Sent 5 photos"
anna:   "Cheers — quoting £4,200–£5,800 ballpark, full quote inside 24h. Best email?"
caller: "rob.t@email.com"
anna:   "Got it Rob. Full quote by Thursday."
meta:   "Quote ETA confirmed ✓"
```

### 7.5 fitness

**phone:**
```
caller: "Do you have a 6pm spin tonight?"
anna:   "18:00 full, 18:45 has 4 bikes left."
caller: "Yes."
anna:   "Held. First class is free."
meta:   "Audio sample available at launch"
```

**whatsapp:**
```
caller: "Do you have a 6pm spin class tonight?"
anna:   "Tonight's 18:00 is full — 18:45 has 4 bikes left. Want one?"
caller: "Yes"
anna:   "Held. First class is free. Any cycling experience?"
caller: "Some"
anna:   "Noted. Studio doors open 18:30. See you tonight."
meta:   "Form Studio Bristol"
```

**instagram:**
```
caller: "Hey — friend keeps recommending you. When's the next beginner class?"
anna:   "Mon 19:00 and Wed 07:00 are beginner-friendly. Either work?"
caller: "Mon 19:00"
anna:   "Booked your free trial. Bring water, trainers, that's it."
caller: "Mat?"
anna:   "We supply mats. See you Mon 19:00."
meta:   "Calendar invite ↗"
```

**web:**
```
caller: "Hi, comparing memberships. Got a list of class times?"
anna:   "Membership £65/mo — unlimited classes, free trial week. Want me to book yours?"
caller: "Yes — what's available tomorrow?"
anna:   "07:00 spin, 12:15 HIIT, 18:00 yoga. Pick one?"
caller: "12:15 HIIT"
anna:   "Booked. Welcome email + timetable on its way."
meta:   "Email confirmation ✓"
```

### 7.6 vet

**phone:**
```
caller: "My dog's been vomiting two hours."
anna:   "Any blood? Anything unusual she ate?"
caller: "No blood, chewed a plant."
anna:   "Routing now to Dr. Chen on call."
meta:   "Emergency triage — routed"
```

**whatsapp:**
```
caller: "My dog's been vomiting two hours, won't drink. Is this urgent?"
anna:   "Routing to Dr. Chen on call — quick, has she eaten anything unusual or shown any blood?"
caller: "No blood, but she chewed a plant earlier"
anna:   "Got it. She'll ring you back in under 5 min."
caller: "Thank you"
anna:   "Address sent for if she asks you to come in."
meta:   "SMS sent ✓"
```

**instagram:**
```
caller: "Hi, our neighbour swears by you. Mittens needs her booster — when's available?"
anna:   "Happy to check. Cat's name + your postcode?"
caller: "Mittens, EH3"
anna:   "Mittens is due her 3-year booster. Sat 11:00 or Tue 17:00?"
caller: "Sat 11:00"
anna:   "Booked. Bring her vaccination card if you have it."
meta:   "Calendar invite ↗"
```

**web:**
```
caller: "We just moved — registering 2 cats with a new practice. Process?"
anna:   "Welcome — new-pet exam is £45 each. Email + previous vet name to request records?"
caller: "jen@email.com, prev vet was West End Vets"
anna:   "I'll request records. Earliest joint exam: Wed 15:30."
caller: "Yes"
anna:   "Booked Jen. Confirmation + new-pet form link sent."
meta:   "Email confirmation ✓"
```

---

## 8. Tokens + visual system

### 8.1 New tokens (in `src/app/globals.css`)

```css
:root {
  /* ... existing tokens unchanged ... */
  --terracotta: 17 55% 52%;          /* warm clay accent — Instagram tint */
  --terracotta-soft: 17 55% 92%;     /* light wash for incoming Instagram bubbles */
  --sage-soft: 142 22% 92%;          /* light wash for incoming WhatsApp bubbles */
  --ink-soft: 155 25% 92%;           /* light wash for incoming Web chat bubbles */
}
```

These extend the v1/v3 palette (cream + sage + ink + mono-label) with one new accent (terracotta) and three soft variants for bubble backgrounds. The terracotta is the canonical anna.money clay accent (see palette memory).

### 8.2 Tailwind extend

In `tailwind.config.ts`, extend the colors map:

```ts
colors: {
  // ... existing ...
  terracotta: "hsl(var(--terracotta) / <alpha-value>)",
  "terracotta-soft": "hsl(var(--terracotta-soft) / <alpha-value>)",
  "sage-soft": "hsl(var(--sage-soft) / <alpha-value>)",
  "ink-soft": "hsl(var(--ink-soft) / <alpha-value>)",
},
```

### 8.3 Channel tint map

| Channel | Header icon | Header icon colour | Incoming bubble | Outgoing bubble |
|---|---|---|---|---|
| phone | (no header — uses Waveform) | — | (no bubbles — uses transcript text rows) | — |
| whatsapp | `MessageCircle` | `text-sage` | `bg-sage-soft text-ink` | `bg-cream-deep text-ink` |
| instagram | `Instagram` | `text-terracotta` | `bg-terracotta-soft text-ink` | `bg-cream-deep text-ink` |
| web | `MessagesSquare` | `text-ink` | `bg-ink-soft text-ink` | `bg-cream-deep text-ink` |

All incoming-bubble backgrounds are ~92% lightness. Against `text-ink` (HSL `155 25% 6%`) all four combinations exceed WCAG AA 4.5:1 contrast (verified algebraically; light bg ≥ 88%, dark fg ≤ 10% lightness → contrast ≥ 8:1).

### 8.4 Motion

Tab swap = 200ms opacity fade on the panel container only. No translate, no scale. `prefers-reduced-motion: reduce` skips the fade entirely (instant swap, panel container has no `transition` class under the media query). Same pattern as v3 `SegmentsShowcase`.

No bubble animations. No typing indicators. No "delivered → read" tick transitions. The mockups are static.

---

## 9. Accessibility

### 9.1 Tab strip

- Container: `role="tablist"` + `aria-label="Channel selector"`.
- Each tab button: `role="tab"`, `aria-selected={isActive}`, `aria-controls={panelId}`, `id={tabId}`, `tabIndex={isActive ? 0 : -1}` (roving).
- Keyboard:
  - Arrow Right / Down → next channel (wraps to first after web)
  - Arrow Left / Up → previous channel (wraps to last from phone)
  - Home → phone tab
  - End → web chat tab
  - Enter / Space → activates the focused tab (same as click)
- Focus ring: `focus-visible:ring-2 focus-visible:ring-primary` (same as `SegmentsShowcase` tabs).

### 9.2 Panel

- `<div role="tabpanel" id={panelId} aria-labelledby={tabId} tabIndex={0}>`.
- `tabIndex={0}` lets keyboard users scroll the panel content with arrow keys after Tab-stepping past the strip.

### 9.3 MessagingThread

- Container: `<ol role="list">` with `aria-label="Booking conversation"`.
- Each turn: `<li>`. Each bubble: `aria-label` constructed as `"<from name>: <text>"` (e.g. *"Customer: Hi, can I book a balayage"*, *"ANNA: Sure, 11am works"*).
- Meta line: `<p className="…">` with visually-hidden prefix `"Status: "` for screen readers.

### 9.4 PhoneDemoPanel

- Existing `PlayButton` already has `aria-label`. No change.
- Transcript: `<dl>` with `<dt>` for the speaker ("Caller" / "ANNA") and `<dd>` for the line. Same semantic structure as v3 `AudioDemo` transcript fallback.

### 9.5 Contrast

All four channel-tinted bubble backgrounds tested against `text-ink` per §8.3. All pass WCAG AA. The mono-label meta line (`text-mono-label` = HSL `155 15% 35%`) on `bg-bg` (cream) tested at AA — passes (computed contrast ~5.4:1).

---

## 10. Performance gates

Re-baseline Lighthouse pre-implementation (post-Sprint-C). Phase verification re-runs Lighthouse and gate-checks against the new baseline.

| Metric | Desktop target | Mobile target |
|---|---|---|
| Performance | ≥ baseline − 5 (currently 100) | ≥ baseline − 5 (currently 95) |
| Accessibility | ≥ 100 | ≥ 100 |
| Best Practices | ≥ 96 | ≥ 93 |
| SEO | ≥ 100 | ≥ 100 |
| LCP | ≤ 700ms | ≤ 2900ms |
| CLS | < 0.02 | < 0.02 |
| TBT | ≤ baseline + 50ms | ≤ baseline + 50ms |

Bundle delta target: ≤ **+5KB gzipped** for the four new client components + content file + hook + tint tokens. No new image assets (mockups are pure CSS+text).

CLS gates: tab-swap layout shift is user-initiated (excluded from CLS by the spec definition — only shifts within 500ms of user input are excluded; tab clicks qualify). No `min-h` enforcement needed.

---

## 11. Test gates

### 11.1 Vitest (new cases)

- `ChannelDemos.test.tsx` — 9 cases:
  - renders 4 tabs (Phone / WhatsApp / Instagram / Web chat)
  - Phone is initially selected (`aria-selected="true"`)
  - clicking a tab updates `aria-selected` and swaps panel content
  - Arrow Right from Phone moves to WhatsApp
  - Arrow Left from Phone wraps to Web chat
  - Home from any tab jumps to Phone; End jumps to Web chat
  - panel content swaps based on `initialSegment` prop (e.g. `initialSegment="beauty"` shows beauty thread when WhatsApp tab is active)
  - footer CTAs carry `?v=<segment>` in href
  - clicking a tab fires `channel_tab_changed` analytics with `{ segment, channel }` payload
- `MessagingThread.test.tsx` — 4 cases:
  - renders one `<li>` per turn
  - applies `bg-sage-soft` for whatsapp incoming, `bg-terracotta-soft` for instagram incoming, `bg-ink-soft` for web incoming
  - renders meta line when `meta` field present, omits otherwise
  - ANNA bubbles have `ml-auto`, caller bubbles have `mr-auto`
- `PhoneDemoPanel.test.tsx` — 3 cases:
  - renders PlayButton + Waveform primitives
  - renders segment-aware transcript (passing `segment="beauty"` shows beauty phone text)
  - renders "Audio sample available at launch" meta when no audio src configured
- `useChannelTab.test.tsx` — 3 cases:
  - returns initial value (`"phone"` default, configurable)
  - `selectChannel` updates state
  - `selectChannel` ignores invalid values

Net new: **~19 vitest cases**.

### 11.2 Playwright e2e

- `tests/e2e/channel-demos.spec.ts`:
  - functional: visit `/?v=beauty`, Phone tab is selected, panel shows beauty phone transcript
  - functional: click WhatsApp tab, URL `?v=` unchanged (still `beauty`), panel swaps to beauty WhatsApp thread
  - functional: change segment via URL to `/?v=construction`, panel re-renders with construction thread (whichever channel is active)
  - functional (NEW post-council): click a segment tab in SegmentsShowcase while ChannelDemos is mounted with its WhatsApp tab active; assert ChannelDemos panel re-renders the new segment's WhatsApp thread without a page reload. Verifies the `anna:segment-changed` broadcast wiring from §6.6.
  - keyboard: Arrow keys cycle through tabs
  - **visual regression: 10 baseline screenshots**, all captured under `prefers-reduced-motion: reduce` for determinism (matches v2/v3 visual specs).

    - Desktop 1440 × `?v=beauty`: 4 baselines (one per channel)
    - Mobile 375 × `?v=beauty`: 4 baselines (one per channel) — confirms tab strip 2×2 layout and bubble wrapping
    - Desktop 1440 × `?v=vet`, WhatsApp tab only: 1 baseline — longest WhatsApp thread (6 turns), confirms vertical expansion
    - Desktop 1440 × `?v=construction`, Web chat tab only: 1 baseline — longest Web chat thread (6 turns), confirms content overflow handling

### 11.3 Axe

Existing axe test (`tests/e2e/a11y.spec.ts`) must remain green. ARIA tablist pattern + bubble semantics verified inline.

### 11.4 Vocab guard

`scripts/check-source-placeholders.mjs` (the Phase-0-v3 build guard) continues to scan compiled output for `AI`, `AI Receptionist`, `artificial intelligence`, `[source: TBD]`, `[MISSING ASSET]`. The new content must not introduce any of these.

### 11.5 Bundle-size gate

The v4 bundle delta target is ≤ +5KB gzipped over the post-Sprint-C baseline. Capture the baseline in Phase 0 (pre-implementation) and re-measure in Phase 6 (verification). Manual check, no new tooling.

Phase 0 capture:

```bash
npm run build
du -b .next/static/chunks/*.js | awk '{s+=$1} END {print s}' > docs/superpowers/v4-bundle-baseline-bytes.txt
```

Phase 6 verify:

```bash
npm run build
POST=$(du -b .next/static/chunks/*.js | awk '{s+=$1} END {print s}')
PRE=$(cat docs/superpowers/v4-bundle-baseline-bytes.txt)
echo "Delta: $((POST - PRE)) bytes (target ≤ 5120 = 5KB)"
```

If delta exceeds 5KB unrationalized, investigate (likely culprits: lucide-react tree-shake regression, content file weight, or unintended primitive imports). Document the delta in the v4 Lighthouse baseline doc.

### 11.6 Total gate

- 143 (post-Sprint-C) vitest cases → ~161 after v4
- ~60 Playwright specs → ~65 after v4 (1 new spec file with ~3 functional + 4 visual)
- Build's `check:placeholders` step continues to pass
- Axe a11y stays green

---

## 12. Out of scope (deferred)

- Real per-segment audio recordings (Phone tab keeps transcript fallback — same as v3)
- Real per-segment audio for messaging tabs (text-only, no inline audio)
- Independent channel-tab URL deep-linking (`?c=whatsapp`) — channel state stays local-only
- Auto-rotate / scroll-triggered demo reel
- Animated typing indicators / delivery ticks / "ANNA is typing…" affordances
- Per-segment customer photos in the messaging thread headers
- Inline calendar embed / Stripe deposit link mockup
- Mobile-specific gesture nav (swipe between tabs) — keyboard + click only
- Real Trustpilot widget, real customer logos, real per-segment quotes — deferred from v3, still deferred
- `/coming-soon` page rebuild — was deleted in Sprint C, no plans to revive
- Adding more segments beyond the six in `VERTICAL_KEYS`

---

## 13. Acceptance criteria

A reviewer can mark v4 done when:

1. `src/components/sections/AudioDemo.tsx` and its test are deleted; `git grep AudioDemo` returns no source/test matches.
2. `src/app/page.tsx` imports `ChannelDemos` and renders it at the same position the old `AudioDemo` occupied.
3. The page renders Kicker `06`, H2 `See it on every channel.`, and the channel sub.
4. 4 tabs render with the correct labels and lucide icons (`PhoneIncoming` / `MessageCircle` / `Instagram` / `MessagesSquare`).
5. Phone tab is selected on first paint.
6. Clicking any tab swaps the panel content; URL `?v=` is unchanged by channel-tab clicks.
7. Visiting `/?v=fitness` renders the fitness phone transcript in the Phone tab. Clicking WhatsApp swaps to the fitness WhatsApp thread.
8. Keyboard Arrow / Home / End cycle through the tabs with focus following.
9. MessagingThread renders one `<li>` per turn; channel-tinted incoming bubbles for whatsapp/instagram/web match §8.3.
10. Footer CTAs render `Book a demo` and `Get my free revenue audit`; hrefs carry `?v=<active segment>`.
11. Lighthouse re-baselined; all gates from §10 pass.
12. All vitest + Playwright gates in §11 pass.
13. Vocab guard (`check:placeholders`) continues to pass — no "AI" leak in any new copy.
14. New tokens `--terracotta`, `--terracotta-soft`, `--sage-soft`, `--ink-soft` exist in `globals.css` and are referenced via Tailwind utility classes in `MessagingThread`.

---

## 14. Implementation phasing (preview)

The plan document gets written next (in `docs/superpowers/plans/`). Expected shape — 6 phases, ~14 tasks:

- **Phase 0** — Lighthouse re-baseline post-Sprint-C → `docs/superpowers/lighthouse-baseline-v4.md`
- **Phase 1** — Visual tokens: `globals.css` adds 4 tokens; `tailwind.config.ts` extends. Test by writing a smoke test that the tokens resolve.
- **Phase 2** — Content data: create `src/content/channelDemos.ts` with all 24 threads + type exports.
- **Phase 3** — Primitives: `MessagingThread` + `PhoneDemoPanel` + `useChannelTab` (TDD each).
- **Phase 4** — Section: `ChannelDemos.tsx` with tab strip, panel router, footer CTAs (TDD).
- **Phase 5** — Wire into page: swap AudioDemo → ChannelDemos in `page.tsx`; delete AudioDemo files.
- **Phase 6** — Verification: e2e specs, visual baselines, Lighthouse re-run, milestone commit, tag `v4-channel-demos`.
