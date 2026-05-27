# ANNA Reception v3 — Segments, Channels, and the "no AI" register — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the v3 landing: scrub all "AI" terminology, add an omnichannel ribbon (5 channels), expand Segments into a tabbed rich-panel showcase (6 segments — adds Fitness + Vet), recast FeatureStrip as a 4-outcome strip, refresh downstream copy for outcome-first voice.

**Architecture:** Next.js 14 App Router. Most work is component-level: 1 renamed section (`FeatureStrip` → `OutcomeStrip`), 1 replaced section (`VerticalsTileModule` → `SegmentsShowcase`), 1 net-new section (`ChannelsRibbon`), 3 cut sections (`RevenueLeak`, `AuditReEntryBanner`, `VerticalsTileModule`), 1 deleted helper (`VerticalTile`). New primitives: `ChannelChip`. New segment-scope modules: `ChannelMixBar`, `SegmentPanel`, `useSegmentParam`. Server-side URL `?v=<key>` already wired in `page.tsx`; we extend it for deep links.

**Tech Stack:** Next.js 14.2 (App Router) · React 18.3 · TypeScript 5.5 · Tailwind 3.4 · lucide-react · Calistoga/Inter/JetBrains Mono via `next/font/google` · Vitest 4.1 + @testing-library/react + jsdom · Playwright 1.60 + axe-core · sharp (asset compression) · google-image-gen plugin (`gemini-3-pro-image`).

**Spec reference:** [`docs/superpowers/specs/2026-05-27-anna-reception-v3-segments-channels-design.md`](../specs/2026-05-27-anna-reception-v3-segments-channels-design.md)

---

## File Structure

### Create

- `src/components/sections/ChannelsRibbon.tsx` — 5-channel ribbon between Hero and SocialProof
- `src/components/sections/ChannelsRibbon.test.tsx`
- `src/components/sections/OutcomeStrip.tsx` — 4-outcome strip (replaces FeatureStrip)
- `src/components/sections/OutcomeStrip.test.tsx`
- `src/components/sections/SegmentsShowcase.tsx` — tabbed showcase, 6 tabs (replaces VerticalsTileModule)
- `src/components/sections/SegmentsShowcase.test.tsx`
- `src/components/segments/SegmentPanel.tsx` — rich per-segment panel
- `src/components/segments/SegmentPanel.test.tsx`
- `src/components/segments/ChannelMixBar.tsx` — proportional bar + legend
- `src/components/segments/ChannelMixBar.test.tsx`
- `src/components/primitives/ChannelChip.tsx` — icon+label chip
- `src/components/primitives/ChannelChip.test.tsx`
- `src/lib/useSegmentParam.ts` — URL `?v=<key>` ↔ state sync
- `src/lib/useSegmentParam.test.tsx`
- `tests/e2e/segments-tabs.spec.ts` — Playwright deep-link + keyboard + tab swap
- `tests/e2e/channels-ribbon.spec.ts` — Playwright visual baseline
- `docs/superpowers/lighthouse-baseline-v3.md` — pre/post Lighthouse numbers
- `public/assets/redesign/segments/dental.png` — 720×900 ≤60KB
- `public/assets/redesign/segments/beauty.png`
- `public/assets/redesign/segments/pubs.png`
- `public/assets/redesign/segments/trades.png`
- `public/assets/redesign/segments/fitness.png`
- `public/assets/redesign/segments/vet.png`
- `public/assets/redesign/fitness.png` — 384px-wide VerticalMark, ≤30KB
- `public/assets/redesign/vet.png`

### Modify

- `src/app/page.tsx` — new section order; remove RevenueLeak/AuditReEntryBanner/first SquiggleDivider; insert ChannelsRibbon; replace VerticalsTileModule with SegmentsShowcase; rename FeatureStrip → OutcomeStrip
- `src/app/layout.tsx` — metadata title + description
- `src/components/sections/Hero.tsx` — kicker, H1, sub copy
- `src/components/sections/AudioDemo.tsx` — kicker + AI-strip + new WhatsApp/DMs line
- `src/components/sections/HowItWorks.tsx` — step 2 copy
- `src/components/sections/RoiCalculator.tsx` — 6 segments dropdown
- `src/components/sections/TestimonialWall.tsx` — 6 segment-anchored quotes
- `src/components/sections/IntegrationsMarquee.tsx` — + WhatsApp/Instagram/Intercom
- `src/components/sections/PricingTeaser.tsx` — second meta-row "Pays for itself"
- `src/components/sections/SocialProofLogos.tsx` — stat labels outcome-flavoured
- `src/components/sections/FinalCtaBanner.tsx` — final pitch copy
- `src/content/faq.ts` — rewrite 8 entries (1 new, 1 changed, 1 cut)
- `src/content/verticals.ts` — extend with `outcomeStat`, `customerStory`, `channelMix`, `demoCtaLabel`; add fitness + vet
- `src/content/testimonials.ts` — 6 segment-anchored quotes
- `src/lib/verticals.ts` — extend `VerticalKey` union; extend `VerticalContent` type; extend `VERTICAL_KEYS`
- `src/components/primitives/VerticalMark.tsx` — add fitness + vet to icon & illustration maps
- `scripts/check-source-placeholders.mjs` — add "AI Receptionist" / `\bAI\b` guard against marketing copy

### Delete

- `src/components/sections/RevenueLeak.tsx` — cut (content folds into Hero sub + Segments outcome metrics + OutcomeStrip proof lines)
- `src/components/sections/FeatureStrip.tsx` — replaced by OutcomeStrip (not renamed via git mv — new content)
- `src/components/sections/AuditReEntryBanner.tsx` — cut
- `src/components/sections/VerticalsTileModule.tsx` — replaced by SegmentsShowcase
- `src/components/sections/VerticalsTileModule.test.tsx`
- `src/components/verticals/VerticalTile.tsx` — subsumed by SegmentPanel

---

## Phase 0 — Baseline + Gates

### Task 0.1: Capture Lighthouse baseline v3

**Files:**
- Create: `docs/superpowers/lighthouse-baseline-v3.md`

- [ ] **Step 1: Ensure dev server is built**

```bash
npm run build && npm run start &
sleep 5
```

Expected: server listening on `http://localhost:3000`.

- [ ] **Step 2: Run Lighthouse desktop**

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=desktop \
  --output=json --output-path=./lighthouse-desktop-v3-baseline.json \
  --quiet --chrome-flags="--headless"
```

Expected: JSON report written.

- [ ] **Step 3: Run Lighthouse mobile**

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=./lighthouse-mobile-v3-baseline.json \
  --quiet --chrome-flags="--headless"
```

Expected: JSON report written.

- [ ] **Step 4: Write `lighthouse-baseline-v3.md`**

```markdown
# Lighthouse baseline — pre-v3 segments + channels pass

**Captured:** 2026-05-27 (post-v2 milestone tag `v2-motion-illustrations`)
**Commit:** <git rev-parse HEAD>

## Desktop (pre-v3)
- Performance: <score>
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <ms>
- CLS: <value>
- TBT: <ms>

## Mobile (pre-v3)
- Performance: <score>
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <ms>
- CLS: <value>
- TBT: <ms>

## Gate thresholds (each phase re-runs Lighthouse; regression >5 points fails)
- Desktop Performance: must stay ≥ baseline − 5
- Mobile Performance: must stay ≥ baseline − 5
- CLS: must stay < 0.1 in both
- TBT: must stay ≤ baseline + 50ms in both
- A11y, BP, SEO: must not regress below baseline

## v3 results
(Filled in by Phase 8.)
```

Read the numbers off `lighthouse-desktop-v3-baseline.json` and `lighthouse-mobile-v3-baseline.json` and fill in `<score>`, `<ms>`, `<value>` placeholders before committing. Use `node -e "const r=require('./lighthouse-desktop-v3-baseline.json'); console.log(r.categories.performance.score*100, r.audits['largest-contentful-paint'].numericValue);"` for quick extraction.

- [ ] **Step 5: Kill the dev server, commit baseline doc**

```bash
pkill -f "next start" || true
git add docs/superpowers/lighthouse-baseline-v3.md
git commit -m "docs(perf): capture Lighthouse baseline pre-v3 segments+channels"
```

### Task 0.2: Add "AI" guard to placeholder check script

**Files:**
- Modify: `scripts/check-source-placeholders.mjs`
- Test: ad-hoc verified by Step 4 below

- [ ] **Step 1: Add "AI" string scan to `FORBIDDEN`**

Edit `scripts/check-source-placeholders.mjs`. Replace `const FORBIDDEN = ["[source: TBD]", "[MISSING ASSET]"];` with:

```js
// Static string tokens that must NEVER appear in compiled marketing output.
const FORBIDDEN = ["[source: TBD]", "[MISSING ASSET]"];

// Regex patterns (whole-word match) flagged as marketing-vocab violations per v3 spec §3.
const FORBIDDEN_PATTERNS = [
  { name: "AI Receptionist", re: /AI\s+Receptionist/gi },
  { name: "standalone AI mention", re: /\bAI\b/g },
  { name: "artificial intelligence", re: /\bartificial\s+intelligence\b/gi },
];
```

- [ ] **Step 2: Update walk loop to also scan regex patterns**

Replace the loop body (lines 19-30) with:

```js
for (const root of SCAN_ROOTS) {
  try {
    for (const file of walk(root)) {
      const content = readFileSync(file, "utf8");
      for (const token of FORBIDDEN) {
        if (content.includes(token)) hits.push(`${file} contains "${token}"`);
      }
      for (const { name, re } of FORBIDDEN_PATTERNS) {
        const matches = content.match(re);
        if (matches && matches.length > 0) {
          hits.push(`${file} contains "${name}" (${matches.length}×)`);
        }
      }
    }
  } catch {
    /* directory may not exist yet — ignore */
  }
}
```

- [ ] **Step 3: Update the error footer**

Replace the error footer `console.error("\nResolve placeholder tokens before deploying.\n");` with:

```js
console.error('\nResolve placeholder/vocab violations before deploying.\nv3 spec §3 bans "AI" wording in marketing copy.\n');
```

- [ ] **Step 4: Run guard against current build (expected to FAIL — current copy still has "AI")**

```bash
npm run build 2>&1 | tail -25
```

Expected: build succeeds but `check:placeholders` step fails with multiple `"AI Receptionist"` and `"standalone AI mention"` hits in `.next/server/...` HTML. **This is correct — Phase 1 fixes them.**

- [ ] **Step 5: Commit the guard (broken build temporarily acceptable on a feature branch)**

```bash
git add scripts/check-source-placeholders.mjs
git commit -m "build: extend placeholder guard to ban AI vocab in compiled marketing output

Pre-Phase-1 scrub: build will fail check:placeholders until copy is rewritten."
```

---

## Phase 1 — Vocabulary scrub + Hero + FAQ + Metadata

Every text-facing change in this phase makes the placeholder guard happier. By the end of Phase 1, `npm run build` should pass.

### Task 1.1: Rewrite Hero kicker, H1, and sub

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/Hero.test.tsx`

- [ ] **Step 1: Update Hero test for new copy**

Replace `src/components/sections/Hero.test.tsx` body with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the v3 kicker, headline, and sub", () => {
    render(<Hero />);
    expect(screen.getByText(/Front desk · 24\/7 · UK/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /Your missed calls are now revenue\./i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/answers every call, returns every web lead, and chases every dormant quote/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Pays for itself in the first week/i)).toBeInTheDocument();
  });

  it("does not contain the word 'AI'", () => {
    const { container } = render(<Hero />);
    expect(container.textContent ?? "").not.toMatch(/\bAI\b/);
  });

  it("renders both primary and secondary CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /Book a demo/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get my free revenue audit/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/sections/Hero.test.tsx
```

Expected: 3 failed (current copy still has "AI Receptionist · UK" and old H1).

- [ ] **Step 3: Update `Hero.tsx`**

Replace the contents of `src/components/sections/Hero.tsx` with:

```tsx
import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";

export function Hero() {
  return (
    <section className="mx-auto max-w-page px-4 pt-12 pb-16 md:pt-20 md:pb-24" aria-labelledby="hero-headline">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <Kicker number="01" label="Front desk · 24/7 · UK" />
          <h1
            id="hero-headline"
            className="mt-6 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance"
          >
            Your missed calls are now revenue.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-prose leading-[1.55]">
            ANNA Reception answers every call, returns every web lead, and chases every dormant quote — across phone, WhatsApp, and DMs. Pays for itself in the first week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/demo" data-event="hero_cta_demo_clicked">Book a demo</Button>
            <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
          </div>
          <div className="mt-10 inline-flex flex-wrap items-center gap-3 rounded-full border border-sage/40 bg-cream-deep/50 px-4 py-2.5">
            <span aria-label="Trustpilot rating: five stars" className="text-primary font-medium tracking-wider">★★★★★</span>
            <span className="font-mono text-xs uppercase tracking-wider text-mono-label">Trustpilot · Excellent</span>
            <span aria-hidden="true" className="text-sage">·</span>
            <span className="font-mono text-xs uppercase tracking-wider text-mono-label">100,000+ UK SMBs on ANNA</span>
          </div>
        </div>
        <div aria-hidden="true" className="hidden md:block relative">
          <Image
            src="/assets/redesign/hero-illustration.png"
            alt=""
            width={800}
            height={1000}
            priority
            className="w-full h-auto motion-safe:animate-bob"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/sections/Hero.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/Hero.test.tsx
git commit -m "feat(hero): v3 — outcome-with-revenue headline, omnichannel sub, no AI"
```

### Task 1.2: Update metadata in layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update metadata**

In `src/app/layout.tsx`, replace the `metadata` export block (lines 17-20) with:

```ts
export const metadata: Metadata = {
  title: "ANNA Reception — reception that never misses. UK SMBs.",
  description: "Inbound calls, outbound follow-ups, WhatsApp, and DMs — answered, booked, and chased. From £99/mo.",
};
```

- [ ] **Step 2: Verify with grep**

```bash
grep -E "AI|Receptionist" src/app/layout.tsx
```

Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(meta): v3 — title and description drop AI vocab"
```

### Task 1.3: Rewrite FAQ list

**Files:**
- Modify: `src/content/faq.ts`

- [ ] **Step 1: Replace FAQ array**

Replace the contents of `src/content/faq.ts` with:

```ts
export type FaqEntry = { q: string; a: string };

// Spec v3 §9.8: 8 entries; new questions on WhatsApp/DMs and outbound.
export const FAQ: FaqEntry[] = [
  {
    q: "What happens if ANNA can't answer a caller's question?",
    a: "She apologises briefly, transfers the call live to your nominated number with a one-sentence handover, and SMSes the full transcript so your team has the written record. If no human picks up, she books a callback and texts the caller.",
  },
  {
    q: "How does setup work?",
    a: "Paste your website on the demo call; ANNA learns your menu, hours, and tone in about three minutes. We'll have her live on a test number within the same call.",
  },
  {
    q: "Do callers know it's ANNA?",
    a: "Most don't ask. ANNA introduces herself by your business name, books the appointment, and SMSes a confirmation. If a caller asks directly, she's straightforward about being your automated reception.",
  },
  {
    q: "What about WhatsApp and Instagram DMs?",
    a: "ANNA handles WhatsApp Business threads and Instagram DMs the same way she handles calls — answers, books, follows up. WhatsApp Business needs a verified business number; we walk you through it on the demo call.",
  },
  {
    q: "Does ANNA do outbound calls?",
    a: "Yes. No-show recovery, dormant quote chase, appointment confirmations — opt-in per campaign. You stay in control of who she calls and when.",
  },
  {
    q: "Does ANNA write to my calendar / PMS / CRM?",
    a: "Yes, where the integration supports it. See the full list — 200+ integrations including Dentally, Phorest, simPRO, OpenTable, Xero, Google Calendar.",
  },
  {
    q: "What about my data?",
    a: "ANNA Reception is built on a UK GDPR / DPA 2018 footing. Conversation data is stored encrypted; you control retention.",
  },
  {
    q: "Can I cancel?",
    a: "Any time. No long contracts. Cancel from the dashboard.",
  },
];
```

- [ ] **Step 2: Verify with grep**

```bash
grep -E "\\bAI\\b" src/content/faq.ts
```

Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/content/faq.ts
git commit -m "feat(faq): v3 — 8 entries, WhatsApp + outbound questions, no AI"
```

### Task 1.4: Scrub residual AI mentions across src/

**Files:**
- Modify: any matching `src/**/*.{ts,tsx}` files

- [ ] **Step 1: Find remaining "AI" mentions**

```bash
grep -rEn "\\bAI\\b|AI Receptionist|artificial intelligence" src/ \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules
```

Expected: hits in `src/content/testimonials.ts`, `src/content/customerLogos.ts`, possibly other files.

- [ ] **Step 2: For each hit, replace with v3 vocabulary**

Apply these replacements:
- `"AI Receptionist"` / `"AI receptionist"` → `"ANNA Reception"`
- `"AI-powered"` → drop the word, leave the rest (e.g., "AI-powered scheduling" → "automated scheduling")
- `"AI"` standalone in marketing copy → `"ANNA"` (when referring to the product) or `"automated"` (adjective)

Run grep again after each file to make sure changes stuck. The intent: zero hits when the grep from Step 1 is re-run.

- [ ] **Step 3: Re-run grep to verify**

```bash
grep -rEn "\\bAI\\b|AI Receptionist|artificial intelligence" src/ \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules
```

Expected: no matches.

- [ ] **Step 4: Run full vitest**

```bash
npm test
```

Expected: all 117+ existing cases plus the 3 Hero cases continue to pass.

- [ ] **Step 5: Run the build (placeholder guard should now PASS)**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Placeholder guard passed` at the end.

- [ ] **Step 6: Commit**

```bash
git add -A src/
git commit -m "feat(copy): v3 vocabulary scrub — replace 'AI' across all source"
```

---

## Phase 2 — ChannelChip primitive + ChannelsRibbon section

### Task 2.1: ChannelChip primitive

**Files:**
- Create: `src/components/primitives/ChannelChip.tsx`
- Test: `src/components/primitives/ChannelChip.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/primitives/ChannelChip.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneIncoming } from "lucide-react";
import { ChannelChip } from "./ChannelChip";

describe("ChannelChip", () => {
  it("renders icon and label", () => {
    render(<ChannelChip icon={PhoneIncoming} label="Inbound calls" />);
    expect(screen.getByText("Inbound calls")).toBeInTheDocument();
  });

  it("renders trailing value when provided", () => {
    render(<ChannelChip icon={PhoneIncoming} label="Inbound calls" value="71%" />);
    expect(screen.getByText("71%")).toBeInTheDocument();
  });

  it("applies small size variant", () => {
    const { container } = render(<ChannelChip icon={PhoneIncoming} label="WhatsApp" size="sm" />);
    expect(container.firstChild).toHaveClass("text-sm");
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/primitives/ChannelChip.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement primitive**

Create `src/components/primitives/ChannelChip.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  icon: LucideIcon;
  label: string;
  size?: "sm" | "md";
  value?: string;
  className?: string;
};

export function ChannelChip({ icon: Icon, label, size = "md", value, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        size === "sm" ? "text-sm" : "text-base",
        className
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5", "text-sage shrink-0")}
      />
      <span className="text-ink">{label}</span>
      {value && (
        <span className="ml-auto font-mono text-xs tabular-nums text-mono-label">{value}</span>
      )}
    </span>
  );
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/primitives/ChannelChip.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/primitives/ChannelChip.tsx src/components/primitives/ChannelChip.test.tsx
git commit -m "feat(primitive): add ChannelChip — icon+label+optional value"
```

### Task 2.2: ChannelsRibbon section

**Files:**
- Create: `src/components/sections/ChannelsRibbon.tsx`
- Test: `src/components/sections/ChannelsRibbon.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/sections/ChannelsRibbon.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChannelsRibbon } from "./ChannelsRibbon";

describe("ChannelsRibbon", () => {
  it("renders all 5 channels with labels", () => {
    render(<ChannelsRibbon />);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(screen.getByText("Inbound calls")).toBeInTheDocument();
    expect(screen.getByText("Outbound calls")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Instagram DMs")).toBeInTheDocument();
    expect(screen.getByText("Web chat")).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<ChannelsRibbon />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Wherever they reach you/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the closing line", () => {
    render(<ChannelsRibbon />);
    expect(
      screen.getByText(/One conversation memory across every channel/i)
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/sections/ChannelsRibbon.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement ChannelsRibbon**

Create `src/components/sections/ChannelsRibbon.tsx`:

```tsx
import {
  PhoneIncoming,
  PhoneOutgoing,
  MessageCircle,
  Instagram,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker";
import { Reveal } from "@/components/primitives/Reveal";

type Channel = { icon: LucideIcon; label: string; sub: string };

const CHANNELS: Channel[] = [
  { icon: PhoneIncoming, label: "Inbound calls", sub: "Answered 24/7" },
  { icon: PhoneOutgoing, label: "Outbound calls", sub: "No-show recovery, dormant lead chase" },
  { icon: MessageCircle, label: "WhatsApp", sub: "WhatsApp Business booking threads" },
  { icon: Instagram, label: "Instagram DMs", sub: "Salon & aesthetics booking" },
  { icon: MessagesSquare, label: "Web chat", sub: "Embeddable widget" },
];

export function ChannelsRibbon() {
  return (
    <section className="bg-cream-deep border-y border-sage/30" aria-labelledby="channels-heading">
      <div className="mx-auto max-w-page px-4 py-16 md:py-20">
        <Kicker number="02" label="Channels" />
        <h2
          id="channels-heading"
          className="mt-6 font-display text-display-md text-ink text-balance max-w-2xl"
        >
          Wherever they reach you. Answered. Booked. Chased.
        </h2>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {CHANNELS.map(({ icon: Icon, label, sub }, i) => (
            <Reveal as="li" key={label} delayMs={i * 40}>
              <Icon className="h-6 w-6 text-sage" aria-hidden="true" />
              <p className="mt-3 font-medium text-ink">{label}</p>
              <p className="mt-1 text-sm text-fg-muted leading-snug">{sub}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 font-display italic text-sage text-lg">
          One conversation memory across every channel.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/sections/ChannelsRibbon.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ChannelsRibbon.tsx src/components/sections/ChannelsRibbon.test.tsx
git commit -m "feat(section): ChannelsRibbon — 5 channels, omnichannel positioning"
```

### Task 2.3: Wire ChannelsRibbon into page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Edit `src/app/page.tsx`**

Replace lines 1-46 with:

```tsx
import { Hero } from "@/components/sections/Hero";
import { ChannelsRibbon } from "@/components/sections/ChannelsRibbon";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { RevenueLeak } from "@/components/sections/RevenueLeak";
import { AudioDemo } from "@/components/sections/AudioDemo";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { VerticalsTileModule } from "@/components/sections/VerticalsTileModule";
import { TestimonialWall } from "@/components/sections/TestimonialWall";
import { FeatureStrip } from "@/components/sections/FeatureStrip";
import { IntegrationsMarquee } from "@/components/sections/IntegrationsMarquee";
import { PricingTeaser } from "@/components/sections/PricingTeaser";
import { AuditReEntryBanner } from "@/components/sections/AuditReEntryBanner";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCtaBanner } from "@/components/sections/FinalCtaBanner";
import { SquiggleDivider } from "@/components/primitives/SquiggleDivider";
import { readVerticalFromUrl } from "@/lib/urlParams";
import type { VerticalKey } from "@/lib/verticals";

type Props = { searchParams: Promise<{ v?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const fakeUrl = new URL(`http://x/?v=${params.v ?? ""}`);
  const initialVertical: VerticalKey | null = readVerticalFromUrl(fakeUrl);

  return (
    <>
      <Hero />
      <ChannelsRibbon />
      <SocialProofLogos />
      <RevenueLeak />
      <SquiggleDivider />
      <AudioDemo />
      <RoiCalculator initialVertical={initialVertical} />
      <HowItWorks />
      <VerticalsTileModule />
      <TestimonialWall />
      <FeatureStrip />
      <IntegrationsMarquee />
      <PricingTeaser />
      <AuditReEntryBanner />
      <FaqAccordion />
      <FinalCtaBanner />
    </>
  );
}
```

Note: only the import of `ChannelsRibbon` is added and the first `<SquiggleDivider />` is replaced by `<ChannelsRibbon />`. The cuts of RevenueLeak and AuditReEntryBanner happen in Phase 3 — keeping them here for now keeps the page renderable.

- [ ] **Step 2: Build to verify nothing breaks**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Placeholder guard passed` and successful build.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(page): wire ChannelsRibbon between Hero and SocialProof"
```

---

## Phase 3 — OutcomeStrip + cut FeatureStrip, RevenueLeak, AuditReEntryBanner

### Task 3.1: Create OutcomeStrip

**Files:**
- Create: `src/components/sections/OutcomeStrip.tsx`
- Test: `src/components/sections/OutcomeStrip.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/sections/OutcomeStrip.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OutcomeStrip } from "./OutcomeStrip";

describe("OutcomeStrip", () => {
  it("renders 4 outcomes", () => {
    render(<OutcomeStrip />);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });

  it("renders each outcome headline", () => {
    render(<OutcomeStrip />);
    expect(screen.getByText("More booked appointments.")).toBeInTheDocument();
    expect(screen.getByText("Faster than your competitor.")).toBeInTheDocument();
    expect(screen.getByText("Recovered dormant revenue.")).toBeInTheDocument();
    expect(screen.getByText("Off your phone, in your work.")).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<OutcomeStrip />);
    expect(
      screen.getByRole("heading", { level: 2, name: /What you actually get\./i })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/sections/OutcomeStrip.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement OutcomeStrip**

Create `src/components/sections/OutcomeStrip.tsx`:

```tsx
import { TrendingUp, Zap, RotateCcw, Hand, type LucideIcon } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker";
import { Reveal } from "@/components/primitives/Reveal";

type Outcome = { icon: LucideIcon; headline: string; proof: string };

const OUTCOMES: Outcome[] = [
  {
    icon: TrendingUp,
    headline: "More booked appointments.",
    proof: "Every call answered, every web lead returned, every dormant quote chased — 24/7.",
  },
  {
    icon: Zap,
    headline: "Faster than your competitor.",
    proof: "First call back wins the job. ANNA picks up in 2 seconds — your competitor's voicemail can't.",
  },
  {
    icon: RotateCcw,
    headline: "Recovered dormant revenue.",
    proof: "Outbound follow-ups on old quotes and no-shows turn cold pipeline into booked work.",
  },
  {
    icon: Hand,
    headline: "Off your phone, in your work.",
    proof: "Hands stay on the chair, the trowel, the keg. ANNA handles the rest.",
  },
];

export function OutcomeStrip() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="outcomes-heading">
      <Kicker number="05" label="The outcomes" />
      <h2 id="outcomes-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        What you actually get.
      </h2>
      <ul className="mt-16 grid md:grid-cols-2 border-t border-sage/30">
        {OUTCOMES.map(({ icon: Icon, headline, proof }, i) => (
          <Reveal
            as="li"
            key={headline}
            delayMs={i * 40}
            className={[
              "p-8 md:p-10 border-b border-sage/30",
              i % 2 !== 0 ? "md:border-l md:border-sage/30" : "",
            ].join(" ")}
          >
            <Icon className="h-8 w-8 text-sage" aria-hidden="true" />
            <p className="mt-4 text-2xl font-medium text-ink leading-tight">{headline}</p>
            <p className="mt-3 text-fg-muted leading-[1.55] max-w-prose">{proof}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/sections/OutcomeStrip.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/OutcomeStrip.tsx src/components/sections/OutcomeStrip.test.tsx
git commit -m "feat(section): OutcomeStrip — 4 outcomes replace 6 features"
```

### Task 3.2: Cut FeatureStrip, RevenueLeak, AuditReEntryBanner from page

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/sections/FeatureStrip.tsx`
- Delete: `src/components/sections/RevenueLeak.tsx`
- Delete: `src/components/sections/AuditReEntryBanner.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx` with v3 IA**

Replace the file with:

```tsx
import { Hero } from "@/components/sections/Hero";
import { ChannelsRibbon } from "@/components/sections/ChannelsRibbon";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { AudioDemo } from "@/components/sections/AudioDemo";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { VerticalsTileModule } from "@/components/sections/VerticalsTileModule";
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
  const initialVertical: VerticalKey | null = readVerticalFromUrl(fakeUrl);

  return (
    <>
      <Hero />
      <ChannelsRibbon />
      <SocialProofLogos />
      <VerticalsTileModule />
      <OutcomeStrip />
      <SquiggleDivider />
      <AudioDemo />
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

Note: `VerticalsTileModule` is still used here — it's replaced by `SegmentsShowcase` in Phase 6. Section order matches spec §4 except the placeholder.

- [ ] **Step 2: Delete the three cut sections**

```bash
git rm src/components/sections/FeatureStrip.tsx \
       src/components/sections/RevenueLeak.tsx \
       src/components/sections/AuditReEntryBanner.tsx
```

- [ ] **Step 3: Verify no other file imports the deleted sections**

```bash
grep -rE "FeatureStrip|RevenueLeak|AuditReEntryBanner" src/ tests/ \
  --include="*.ts" --include="*.tsx"
```

Expected: no matches.

- [ ] **Step 4: Run vitest + build**

```bash
npm test && npm run build 2>&1 | tail -5
```

Expected: all tests pass, `✓ Placeholder guard passed`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(page): v3 IA — cut RevenueLeak, FeatureStrip, AuditReEntryBanner; insert OutcomeStrip"
```

---

## Phase 4 — Verticals model extension (fitness + vet + new fields)

### Task 4.1: Extend `VerticalKey` union and content type

**Files:**
- Modify: `src/lib/verticals.ts`

- [ ] **Step 1: Replace `src/lib/verticals.ts`**

Replace the entire file with:

```ts
export type VerticalKey = "dental" | "beauty" | "pubs" | "construction" | "fitness" | "vet";

export const VERTICAL_KEYS: VerticalKey[] = ["dental", "beauty", "pubs", "construction", "fitness", "vet"];

export function isVerticalKey(v: string): v is VerticalKey {
  return (VERTICAL_KEYS as string[]).includes(v);
}

export type ChannelKey = "inbound" | "outbound" | "whatsapp" | "instagram" | "web";

export type OutcomeStat = {
  headline: string;          // e.g. "£401K recovered"
  attribution: string;       // e.g. "10,865 calls answered in 90 days — Image Orthodontics, Chicago"
};

export type CustomerStory = {
  quote: string;             // e.g. "47 new patients in month 1."
  attribution: string;       // e.g. "Dr. Patel · Bright Smiles Cardiff"
};

export type ChannelMixSlice = {
  key: ChannelKey;
  label: string;             // display label, e.g. "Inbound"
  pct: number;               // 0-100
};

export type VerticalContent = {
  key: VerticalKey;
  label: string;
  cardHook: string;
  headlineRoi: string;
  painFraming: string;
  audioSampleScript: string;
  smartBehaviours: string[];
  testimonialSlot: string;
  integrationsUk: string[];
  integrationsUsIntl: string[];
  complianceLine: string;
  // v3 additions
  outcomeStat: OutcomeStat;
  customerStory: CustomerStory;
  channelMix: ChannelMixSlice[];
  demoCtaLabel: string;
  roi: {
    inputs: Array<{
      id: string;
      label: string;
      default: number;
      min: number;
      max: number;
      step: number;
      unit: "gbp" | "count" | "percent";
    }>;
    leakFormula: (inputs: Record<string, number>) => number;
  };
};
```

- [ ] **Step 2: Run TypeScript check (expect failures in `verticals.ts` and `RoiCalculator.tsx`)**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: many TS errors referencing missing `outcomeStat`, `customerStory`, etc., and missing `fitness`/`vet` keys. These get fixed by Task 4.2 and Task 7.8.

- [ ] **Step 3: Commit (intermediate broken state is acceptable on a feature branch)**

```bash
git add src/lib/verticals.ts
git commit -m "feat(types): extend VerticalKey with fitness+vet; add v3 fields to VerticalContent"
```

### Task 4.2: Extend `src/content/verticals.ts` with new fields and 2 new segments

**Files:**
- Modify: `src/content/verticals.ts`

- [ ] **Step 1: Replace `src/content/verticals.ts`**

Replace the entire file with:

```ts
import type { VerticalContent, VerticalKey } from "@/lib/verticals";

// All copy here mirrors spec v3 §7.4. Edit copy only by editing this file.

export const VERTICALS: Record<VerticalKey, VerticalContent> = {
  dental: {
    key: "dental",
    label: "Dental clinics",
    cardHook: "Never miss a new patient call.",
    headlineRoi: "Avg new-patient lifetime value: £1,800–£3,000 [Source: industry estimate, 2025] — one missed call = one lost patient.",
    painFraming:
      "New-patient enquiries spike outside 9–5. Your reception is closed; your competitors' aren't. ANNA answers at 11pm, triages urgency, books an exam.",
    audioSampleScript:
      'Caller: "Hi, my crown fell out, can someone see me tomorrow?" → ANNA: empathy + triage urgency + offers same-day emergency slot + collects DOB + confirms payment route (NHS band + exemption status / Denplan or Practice Plan / private / US insurance) + SMSes the address.',
    smartBehaviours: [
      "Distinguishes emergency vs routine",
      "Confirms payment route",
      "Routes after-hours vs in-hours overflow differently",
      "Takes deposit at booking via Stripe SMS (where your booking system supports it)",
      "Never gives clinical advice",
    ],
    testimonialSlot: "Practice principal · business name · 'X new patients captured in month 1'",
    integrationsUk: ["Dentally", "SOE/EXACT", "Carestream R4", "Systems for Dentists", "Cliniko"],
    integrationsUsIntl: ["Dentrix", "Open Dental", "NexHealth", "Curve", "Practice-Web", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018 · ISO 27001-aligned",
    outcomeStat: {
      headline: "£401K recovered",
      attribution: "10,865 calls answered in 90 days — industry estimate, 2025",
    },
    customerStory: {
      quote: "47 new patients in month 1.",
      attribution: "Dr. Patel · Bright Smiles Cardiff",
    },
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 71 },
      { key: "outbound", label: "Outbound", pct: 18 },
      { key: "whatsapp", label: "WhatsApp", pct: 11 },
      { key: "instagram", label: "Instagram DMs", pct: 0 },
      { key: "web", label: "Web chat", pct: 0 },
    ],
    demoCtaLabel: "Book a dental demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg new-patient lifetime value (£)", default: 2400, min: 500, max: 10000, step: 100, unit: "gbp" },
        { id: "callsPerWeek", label: "New-patient calls per week", default: 15, min: 1, max: 200, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 30, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },

  beauty: {
    key: "beauty",
    label: "Beauty salons",
    cardHook: "Book while you blow-dry.",
    headlineRoi: "Avg booking £40–£90 · 30% of calls come while stylists' hands are full [Source: industry estimate, 2025].",
    painFraming:
      "Phone rings mid-colour. You can't pick up. By the time you call back, she booked round the corner. ANNA knows your menu, your stylists, your slots.",
    audioSampleScript:
      'Caller: "Can I book a balayage with Jess for Saturday?" → ANNA: checks Jess\'s calendar, offers 11am or 3pm, confirms add-on toner question, sends a calendar invite.',
    smartBehaviours: [
      "Knows service menu + price list",
      "Knows which stylist does what",
      "Takes deposit at booking via Stripe SMS for colour/extension services (where your booking system supports it)",
      "SMS confirmations",
    ],
    testimonialSlot: "Salon owner · business name · 'Zero missed bookings since [month]'",
    integrationsUk: ["Phorest", "Timely", "Treatwell", "Fresha", "Booksy"],
    integrationsUsIntl: ["Square Appointments", "Vagaro", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018-compliant client data handling",
    outcomeStat: {
      headline: "£62K booked covers",
      attribution: "2,140 WhatsApp bookings in 90 days — industry estimate, 2025",
    },
    customerStory: {
      quote: "Zero missed bookings since we switched.",
      attribution: "Alex Riley · Mane Studio Manchester",
    },
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 40 },
      { key: "outbound", label: "Outbound", pct: 15 },
      { key: "whatsapp", label: "WhatsApp", pct: 35 },
      { key: "instagram", label: "Instagram DMs", pct: 10 },
      { key: "web", label: "Web chat", pct: 0 },
    ],
    demoCtaLabel: "Book a beauty demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg booking value (£)", default: 65, min: 10, max: 500, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 40, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 25, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },

  pubs: {
    key: "pubs",
    label: "Gastropubs",
    cardHook: "Reservations don't have to ring out.",
    headlineRoi: "Avg 4-cover gastro table £140–£220 · busiest service = most missed calls [Source: industry estimate, 2025].",
    painFraming:
      "7pm Saturday. Phone rings. Floor is in the weeds. ANNA takes the booking, checks the floor plan, confirms allergens, asks about high chairs. Reservation-led gastropubs only — not wet-led.",
    audioSampleScript:
      'Caller: "Table for 6 Friday, 7:30?" → ANNA: checks availability + offers 7pm or 8pm + flags dietary requirements for the kitchen + SMS confirmation. For 8+ covers or private hire she adds: "We take a small deposit via SMS to hold the booking — alright?"',
    smartBehaviours: [
      "Reservations",
      "Private hire enquiries",
      "Flags dietary requirements (FSA 14-allergen) at booking; confirmed at service",
      "Deposit via Stripe SMS for private hire / 8+ covers",
      "Routes media/press calls to landlord",
    ],
    testimonialSlot: "Pub landlord · business name · 'Weekend covers up X%'",
    integrationsUk: ["OpenTable", "ResDiary", "SevenRooms"],
    integrationsUsIntl: ["Toast", "Square for Restaurants", "Tock"],
    complianceLine: "PCI-compliant deposit handling via Stripe",
    outcomeStat: {
      headline: "£88K incremental covers",
      attribution: "41% weekend rebooking lift — industry estimate, 2025",
    },
    customerStory: {
      quote: "Our Saturday covers are up 23%.",
      attribution: "Sarah & Tom · The Black Swan, Cotswolds",
    },
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 65 },
      { key: "outbound", label: "Outbound", pct: 5 },
      { key: "whatsapp", label: "WhatsApp", pct: 15 },
      { key: "instagram", label: "Instagram DMs", pct: 10 },
      { key: "web", label: "Web chat", pct: 5 },
    ],
    demoCtaLabel: "Book a gastropub demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg cover spend (£)", default: 45, min: 10, max: 200, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 80, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 35, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4 * 4,
    },
  },

  construction: {
    key: "construction",
    label: "Trades",
    cardHook: "Win the job while you're on the roof.",
    headlineRoi: "Avg repair £180 · avg install £1,200 · 60% of trade leads call ≥2 numbers [Source: industry estimate, 2025].",
    painFraming:
      "Hands full. Drill running. Boots in mud. ANNA picks up first, captures the job, books the diary, SMSes a quote ETA.",
    audioSampleScript:
      'Caller: "My boiler is leaking, can you come today?" → ANNA: "Is the stop-tap off? Is water reaching the boiler housing?" — triages emergency vs non-urgent + checks diary + offers afternoon slot + SMSes address-confirmation + flags emergency to mobile.',
    smartBehaviours: [
      "Emergency triage (stop-tap, isolation, safety qs)",
      "Postcode/territory check",
      "Quote-ETA promise",
      "SMS with address + arrival window",
      "First to call back advantage",
      "Captures Gas Safe / NICEIC number on quote enquiries",
      "Clean handoff to Xero/QuickBooks",
    ],
    testimonialSlot: "Trade owner · business name · 'X jobs booked while on-site last month'",
    integrationsUk: ["simPRO", "Commusoft", "Joblogic", "Fergus", "Powered Now", "Tradify"],
    integrationsUsIntl: ["Jobber", "Housecall Pro", "ServiceM8", "Xero", "ServiceTitan (enterprise — not £99/mo persona)"],
    complianceLine: "UK GDPR & DPA 2018",
    outcomeStat: {
      headline: "£140K won-jobs",
      attribution: "First-to-call-back on 87% of leads — industry estimate, 2025",
    },
    customerStory: {
      quote: "I won three boiler jobs last month while on a roof.",
      attribution: "Mark D. · DJ Plumbing & Gas, North London",
    },
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 60 },
      { key: "outbound", label: "Outbound", pct: 25 },
      { key: "whatsapp", label: "WhatsApp", pct: 10 },
      { key: "instagram", label: "Instagram DMs", pct: 0 },
      { key: "web", label: "Web chat", pct: 5 },
    ],
    demoCtaLabel: "Book a trades demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg job value (£)", default: 350, min: 50, max: 5000, step: 50, unit: "gbp" },
        { id: "callsPerWeek", label: "Lead calls per week", default: 25, min: 1, max: 300, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls lost to faster competitor", default: 45, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },

  fitness: {
    key: "fitness",
    label: "Fitness studios",
    cardHook: "Fill the class while you teach it.",
    headlineRoi: "Avg monthly membership £50–£90 · trial calls peak at 6pm [Source: industry estimate, 2025].",
    painFraming:
      "Phone rings during a 7am HIIT class. By the time you wrap, the lead is at the studio round the corner. ANNA picks up, books a trial, follows up to convert it.",
    audioSampleScript:
      'Caller: "Do you have a 6pm spin class tonight?" → ANNA: checks the timetable + offers 6pm or 6:45pm + asks about prior cycling experience + sends a calendar invite + books a free trial.',
    smartBehaviours: [
      "Knows class timetable + capacity",
      "Books trials",
      "Outbound: class-fill chase for low-occupancy slots",
      "Outbound: trial → membership conversion follow-ups",
      "SMS confirmations + reschedules",
    ],
    testimonialSlot: "Studio owner · business name · 'Class fill at 94% on weeknights'",
    integrationsUk: ["Mindbody", "TeamUp", "Glofox", "ClubRight"],
    integrationsUsIntl: ["Mindbody", "ClassPass", "Mariana Tek", "Pike13", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018",
    outcomeStat: {
      headline: "£29K class-fill recovered",
      attribution: "1,400 outbound follow-ups in 90 days — industry estimate, 2025",
    },
    customerStory: {
      quote: "Class fill is at 94% on weeknights.",
      attribution: "Priya K. · Form Studio Bristol",
    },
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 35 },
      { key: "outbound", label: "Outbound", pct: 30 },
      { key: "whatsapp", label: "WhatsApp", pct: 20 },
      { key: "instagram", label: "Instagram DMs", pct: 10 },
      { key: "web", label: "Web chat", pct: 5 },
    ],
    demoCtaLabel: "Book a fitness demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg monthly membership (£)", default: 65, min: 20, max: 300, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Trial-booking calls per week", default: 30, min: 1, max: 300, step: 1, unit: "count" },
        { id: "missedPct", label: "% of trial calls missed", default: 30, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      // Annualised: weekly missed × conversion 0.4 × 12 months membership
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * 0.4 * (avgValue ?? 0) * 12,
    },
  },

  vet: {
    key: "vet",
    label: "Vet clinics",
    cardHook: "Triage every call, never miss an emergency.",
    headlineRoi: "Avg consultation + treatment £150–£300 · out-of-hours triage is the moat [Source: industry estimate, 2025].",
    painFraming:
      "9pm. A worried owner calls. Your line is on voicemail. ANNA picks up, triages whether it's emergency or 'wait till morning', books the slot, SMSes the address.",
    audioSampleScript:
      'Caller: "My dog has been vomiting for two hours, is this urgent?" → ANNA: asks structured triage questions (food eaten, blood, lethargy) + routes emergency to on-call mobile + books non-urgent for morning + SMSes address + practice clinical-advice disclaimer.',
    smartBehaviours: [
      "Structured emergency triage (vomiting, bleeding, breathing, ingestion)",
      "Never gives clinical advice — routes to vet",
      "Books routine consults",
      "SMS address + arrival window",
      "Flags species-specific concerns to clinician on call",
    ],
    testimonialSlot: "Practice principal · business name · 'Out-of-hours triage stopped going to voicemail'",
    integrationsUk: ["RxWorks", "VetIT", "Provet Cloud", "Robovet"],
    integrationsUsIntl: ["ezyVet", "AVImark", "Cornerstone", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018 · clinical-disclaimer-aware",
    outcomeStat: {
      headline: "£74K added bookings",
      attribution: "2-second emergency triage pickup — industry estimate, 2025",
    },
    customerStory: {
      quote: "Out-of-hours triage stopped going to voicemail.",
      attribution: "Dr. Chen · Glasgow Vet Group",
    },
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 60 },
      { key: "outbound", label: "Outbound", pct: 10 },
      { key: "whatsapp", label: "WhatsApp", pct: 15 },
      { key: "instagram", label: "Instagram DMs", pct: 5 },
      { key: "web", label: "Web chat", pct: 10 },
    ],
    demoCtaLabel: "Book a vet demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg consultation + treatment (£)", default: 220, min: 50, max: 2000, step: 10, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 60, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 25, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },
};
```

- [ ] **Step 2: Update existing verticals test if needed**

Read `src/content/verticals.test.ts`:

```bash
cat src/content/verticals.test.ts
```

If the test enumerates keys with a hardcoded array of 4, expand to 6. Otherwise the existing assertions (each segment has required fields) will catch new fields automatically. If unsure, run vitest and see what breaks.

- [ ] **Step 3: Run vitest**

```bash
npm test -- src/content/verticals.test.ts
```

Expected: passes. If existing test enumerates segment count, update the expected count to 6.

- [ ] **Step 4: Run full TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: only errors in `RoiCalculator.tsx` and `VerticalMark.tsx` referencing missing `fitness`/`vet` icon entries (fixed in Task 4.3 and Task 7.8). Other files type-check.

- [ ] **Step 5: Commit**

```bash
git add src/content/verticals.ts src/content/verticals.test.ts
git commit -m "feat(content): v3 verticals — add fitness+vet, outcomeStat, customerStory, channelMix"
```

### Task 4.3: Extend VerticalMark for fitness + vet

**Files:**
- Modify: `src/components/primitives/VerticalMark.tsx`

- [ ] **Step 1: Update VerticalMark**

Replace `src/components/primitives/VerticalMark.tsx` with:

```tsx
import Image from "next/image";
import {
  Hammer,
  Scissors,
  Stethoscope,
  Utensils,
  Dumbbell,
  PawPrint,
  type LucideIcon,
} from "lucide-react";
import type { VerticalKey } from "@/lib/verticals";
import { cn } from "@/lib/cn";

const ICONS: Record<VerticalKey, LucideIcon> = {
  dental: Stethoscope,
  beauty: Scissors,
  pubs: Utensils,
  construction: Hammer,
  fitness: Dumbbell,
  vet: PawPrint,
};

const ILLUSTRATION_BASENAMES: Record<VerticalKey, string> = {
  dental: "dental",
  beauty: "beauty",
  pubs: "gastro",
  construction: "trades",
  fitness: "fitness",
  vet: "vet",
};

type Props = {
  vertical: VerticalKey;
  variant?: "icon" | "illustration";
  className?: string;
};

export function VerticalMark({ vertical, variant = "icon", className }: Props) {
  if (variant === "illustration") {
    const basename = ILLUSTRATION_BASENAMES[vertical];
    return (
      <Image
        src={`/assets/redesign/${basename}.png`}
        alt=""
        width={96}
        height={96}
        aria-hidden="true"
        className={cn("h-12 w-12 object-contain", className)}
      />
    );
  }
  const Icon = ICONS[vertical];
  return (
    <Icon
      aria-hidden={true}
      strokeWidth={1.25}
      className={cn("h-12 w-12 text-primary", className)}
    />
  );
}
```

Note: the illustration variant for `fitness` and `vet` references `public/assets/redesign/{fitness,vet}.png` — those files don't exist yet. The tab strip uses these via Image; until Phase 5 generates them, the `<Image>` will 404 at runtime. The icon variant works immediately.

- [ ] **Step 2: Update VerticalMark test**

Replace `src/components/primitives/VerticalMark.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VerticalMark } from "./VerticalMark";
import { VERTICAL_KEYS } from "@/lib/verticals";

describe("VerticalMark", () => {
  it("renders an icon for every vertical key in the icon variant", () => {
    for (const k of VERTICAL_KEYS) {
      const { container, unmount } = render(<VerticalMark vertical={k} />);
      const svg = container.querySelector("svg");
      expect(svg, `icon should render for ${k}`).not.toBeNull();
      unmount();
    }
  });

  it("renders an image for every vertical key in the illustration variant", () => {
    for (const k of VERTICAL_KEYS) {
      const { container, unmount } = render(<VerticalMark vertical={k} variant="illustration" />);
      const img = container.querySelector("img");
      expect(img, `image should render for ${k}`).not.toBeNull();
      unmount();
    }
  });
});
```

- [ ] **Step 3: Run vitest**

```bash
npm test -- src/components/primitives/VerticalMark.test.tsx
```

Expected: 2 passed (both iterate 6 keys).

- [ ] **Step 4: Commit**

```bash
git add src/components/primitives/VerticalMark.tsx src/components/primitives/VerticalMark.test.tsx
git commit -m "feat(primitive): VerticalMark — add fitness (Dumbbell) and vet (PawPrint)"
```

---

## Phase 5 — Generate the 6 segment scene illustrations + 2 new tab marks

### Task 5.1: Set up image generation environment

**Files:**
- (no source files yet — environment verification)

- [ ] **Step 1: Verify google-image-gen plugin setup**

```bash
/Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0/scripts/check_env.sh
```

Expected: env check succeeds. If it fails, the user needs to set `GOOGLE_AI_API_KEY` in `~/.config/google-image-gen/.env`.

- [ ] **Step 2: Sync deps**

```bash
cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv sync && cd -
```

Expected: deps installed.

- [ ] **Step 3: Create asset target directory**

```bash
mkdir -p /Users/nfilippov/ANNA-Reception/public/assets/redesign/segments
mkdir -p /Users/nfilippov/ANNA-Reception/tmp/segment-candidates
```

- [ ] **Step 4: Commit directory marker**

```bash
echo "# Generated segment scene illustrations (spec v3 §10.1)" > public/assets/redesign/segments/README.md
git add public/assets/redesign/segments/README.md
git commit -m "chore(assets): scaffold segments directory for v3 scene illustrations"
```

### Task 5.2: Generate the 6 segment scene candidates

**Files:**
- Create: `tmp/segment-candidates/<segment>_{1,2,3}.png` (18 candidates, intermediate)

- [ ] **Step 1: Prepare style brief and per-segment subjects**

Use this combined prompt format for each candidate (subject + style brief appended):

> `<subject>. Editorial illustration, single muted scene, soft-3D rendered objects on a warm cream background (#F4F1EA), accent sage green (#5D7C66) on one or two key surfaces, ink black (#0E1A14) for line accents. Calm, no people, no faces, no text, ample negative space, slight grain texture, golden-hour ambient light from upper-left. Composition: centred subject, 2/3 viewport vertical. Style references: anna.money 3D iconography + editorial print magazine.`

Per-segment subjects:
- **dental** — "A reception chair in soft focus, with a small clipboard floating slightly above the seat. Clinical but warm — no overhead lamps, no clinical sterility."
- **beauty** — "A salon mirror partially reflecting a chair-back and one cosmetic bottle. Soft pastel reflections — no human hands visible."
- **pubs** — "A gastropub two-top table set for service: one wine glass, folded linen, small menu card upright. Warm wood surface."
- **trades** — "A toolbelt laid across a workbench, with one hand tool (spanner) and a coiled tape measure. Wood + steel + cream."
- **fitness** — "A rolled yoga mat upright beside a metal water bottle and a small bluetooth speaker. Studio-cream backdrop."
- **vet** — "A wooden exam bench with a stethoscope coiled centre and an empty water bowl beside it. Calm, no animal visible."

- [ ] **Step 2: Generate 3 candidates for dental**

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && \
  uv run python main.py --cwd "$ORIG_CWD" \
    tmp/segment-candidates/dental.png \
    "A reception chair in soft focus, with a small clipboard floating slightly above the seat. Clinical but warm — no overhead lamps, no clinical sterility. Editorial illustration, single muted scene, soft-3D rendered objects on a warm cream background (#F4F1EA), accent sage green (#5D7C66) on one or two key surfaces, ink black (#0E1A14) for line accents. Calm, no people, no faces, no text, ample negative space, slight grain texture, golden-hour ambient light from upper-left. Composition: centred subject, 2/3 viewport vertical. Style references: anna.money 3D iconography + editorial print magazine." \
    "A reception chair in soft focus, with a small clipboard floating slightly above the seat. Clinical but warm — no overhead lamps, no clinical sterility. Editorial illustration, single muted scene, soft-3D rendered objects on a warm cream background (#F4F1EA), accent sage green (#5D7C66) on one or two key surfaces, ink black (#0E1A14) for line accents. Calm, no people, no faces, no text, ample negative space, slight grain texture, golden-hour ambient light from upper-left. Composition: centred subject, 2/3 viewport vertical. Style references: anna.money 3D iconography + editorial print magazine." \
    "A reception chair in soft focus, with a small clipboard floating slightly above the seat. Clinical but warm — no overhead lamps, no clinical sterility. Editorial illustration, single muted scene, soft-3D rendered objects on a warm cream background (#F4F1EA), accent sage green (#5D7C66) on one or two key surfaces, ink black (#0E1A14) for line accents. Calm, no people, no faces, no text, ample negative space, slight grain texture, golden-hour ambient light from upper-left. Composition: centred subject, 2/3 viewport vertical. Style references: anna.money 3D iconography + editorial print magazine." \
    --aspect 4:5
```

Expected: 3 PNGs at `tmp/segment-candidates/dental_1.png`, `dental_2.png`, `dental_3.png`.

- [ ] **Step 3: Generate 3 candidates each for beauty, pubs, trades, fitness, vet**

Repeat Step 2's pattern for each subject. The plugin generates numbered outputs when multiple prompts are passed. Verify each segment produces 3 candidates before moving on.

- [ ] **Step 4: Visual review and curate finals**

Open each set of 3 in the file viewer / quick-look. For each segment, pick **the 1 candidate** that best matches the shared style brief (palette adherence, no people, calm composition). Note the chosen number — e.g. `dental_2.png` is the keeper.

- [ ] **Step 5: No commit yet — intermediates stay in `tmp/`**

`tmp/` is in `.gitignore` (verify: `grep "^tmp" .gitignore`). If not, add it:

```bash
echo "tmp/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore tmp/ asset candidates"
```

### Task 5.3: Optimise and ship the 6 segment scenes

**Files:**
- Modify: `scripts/optimize-asset.mjs` (review/extend if needed)
- Create: `public/assets/redesign/segments/{dental,beauty,pubs,trades,fitness,vet}.png`

- [ ] **Step 1: Inspect `scripts/optimize-asset.mjs`**

```bash
cat scripts/optimize-asset.mjs
```

The script accepts source path, target path, target-width, and quality. For segment scenes the spec sets ≤60KB ceiling and a portrait 4:5 ratio. Resize target: 720 width (height auto via aspect).

- [ ] **Step 2: Run optimizer for dental (assume `dental_2` was chosen)**

```bash
node scripts/optimize-asset.mjs \
  tmp/segment-candidates/dental_2.png \
  public/assets/redesign/segments/dental.png \
  --width 720 --quality 55 --colors 28
```

(If the script's flag names differ, run `node scripts/optimize-asset.mjs --help` first and adjust. The repo's existing script handled hero-illustration compression at the 67KB target — the same flags apply here.)

Verify file size:

```bash
ls -lh public/assets/redesign/segments/dental.png
```

Expected: ≤60KB. If larger, drop `--quality` by 5 or `--colors` by 4 and re-run.

- [ ] **Step 3: Repeat for beauty, pubs, trades, fitness, vet**

Each pick goes through the same pipeline. Stop at 60KB ceiling; bisect quality if needed. Map source filename to target:

| Pick | Target |
|---|---|
| `tmp/segment-candidates/dental_N.png` | `public/assets/redesign/segments/dental.png` |
| `tmp/segment-candidates/beauty_N.png` | `public/assets/redesign/segments/beauty.png` |
| `tmp/segment-candidates/pubs_N.png` | `public/assets/redesign/segments/pubs.png` |
| `tmp/segment-candidates/trades_N.png` | `public/assets/redesign/segments/trades.png` |
| `tmp/segment-candidates/fitness_N.png` | `public/assets/redesign/segments/fitness.png` |
| `tmp/segment-candidates/vet_N.png` | `public/assets/redesign/segments/vet.png` |

- [ ] **Step 4: Verify total payload**

```bash
du -ch public/assets/redesign/segments/*.png | tail -1
```

Expected: total ≤360KB.

- [ ] **Step 5: Commit**

```bash
git add public/assets/redesign/segments/
git commit -m "feat(assets): 6 v3 segment scene illustrations (≤60KB each, palette-PNG)"
```

### Task 5.4: Generate + ship 2 new tab marks (fitness, vet)

**Files:**
- Create: `public/assets/redesign/fitness.png`
- Create: `public/assets/redesign/vet.png`

- [ ] **Step 1: Generate 3 candidates each for fitness and vet tab marks**

Same style brief as the scene illustrations, but smaller crop / icon-tight subject. Use these subject prompts:

- **fitness tab mark** — "A single dumbbell, three-quarter angle, soft cream background, sage green grip, slight grain. Minimal. Centred. Square crop."
- **vet tab mark** — "A coiled stethoscope, three-quarter angle, soft cream background, sage green tubing, slight grain. Minimal. Centred. Square crop."

Run via google-image-gen with `--aspect 1:1`.

- [ ] **Step 2: Pick the best of 3 for each**

Manual visual review per Task 5.2 Step 4 pattern.

- [ ] **Step 3: Optimise to ≤30KB at 384px width**

```bash
node scripts/optimize-asset.mjs \
  tmp/segment-candidates/fitness-mark_N.png \
  public/assets/redesign/fitness.png \
  --width 384 --quality 50 --colors 24

node scripts/optimize-asset.mjs \
  tmp/segment-candidates/vet-mark_N.png \
  public/assets/redesign/vet.png \
  --width 384 --quality 50 --colors 24
```

Verify each is ≤30KB.

- [ ] **Step 4: Commit**

```bash
git add public/assets/redesign/fitness.png public/assets/redesign/vet.png
git commit -m "feat(assets): fitness + vet tab marks for VerticalMark (≤30KB each)"
```

---

## Phase 6 — useSegmentParam + ChannelMixBar + SegmentPanel + SegmentsShowcase

### Task 6.1: `useSegmentParam` hook

**Files:**
- Create: `src/lib/useSegmentParam.ts`
- Test: `src/lib/useSegmentParam.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/lib/useSegmentParam.test.tsx`:

```tsx
import { render, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEffect } from "react";
import { useSegmentParam } from "./useSegmentParam";
import type { VerticalKey } from "./verticals";

function Probe({
  initial,
  onState,
}: {
  initial: VerticalKey;
  onState: (
    active: VerticalKey,
    select: (k: VerticalKey) => void
  ) => void;
}) {
  const [active, select] = useSegmentParam(initial);
  useEffect(() => {
    onState(active, select);
  });
  return null;
}

describe("useSegmentParam", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("returns the initial segment if URL has no ?v= param", () => {
    let lastActive: VerticalKey | undefined;
    render(<Probe initial="dental" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("dental");
  });

  it("reads ?v= from URL on mount if present and valid", () => {
    window.history.replaceState({}, "", "/?v=beauty");
    let lastActive: VerticalKey | undefined;
    render(<Probe initial="dental" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("beauty");
  });

  it("ignores invalid ?v= values", () => {
    window.history.replaceState({}, "", "/?v=bogus");
    let lastActive: VerticalKey | undefined;
    render(<Probe initial="dental" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("dental");
  });

  it("select() updates state and URL", () => {
    let select: ((k: VerticalKey) => void) | undefined;
    let lastActive: VerticalKey | undefined;
    render(
      <Probe
        initial="dental"
        onState={(a, s) => {
          lastActive = a;
          select = s;
        }}
      />
    );
    act(() => select!("fitness"));
    expect(lastActive).toBe("fitness");
    expect(window.location.search).toBe("?v=fitness");
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/lib/useSegmentParam.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement hook**

Create `src/lib/useSegmentParam.ts`:

```ts
"use client";
import { useEffect, useState } from "react";
import { VERTICAL_KEYS, isVerticalKey, type VerticalKey } from "@/lib/verticals";

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

  const select = (k: VerticalKey) => {
    if (!VERTICAL_KEYS.includes(k)) return;
    setActive(k);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("v", k);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  return [active, select];
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/lib/useSegmentParam.test.tsx
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/useSegmentParam.ts src/lib/useSegmentParam.test.tsx
git commit -m "feat(lib): useSegmentParam hook — URL ?v= ↔ state sync"
```

### Task 6.2: `ChannelMixBar` primitive

**Files:**
- Create: `src/components/segments/ChannelMixBar.tsx`
- Test: `src/components/segments/ChannelMixBar.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/segments/ChannelMixBar.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneIncoming, PhoneOutgoing, MessageCircle } from "lucide-react";
import { ChannelMixBar } from "./ChannelMixBar";

const SLICES = [
  { key: "inbound" as const, label: "Inbound", pct: 71, icon: PhoneIncoming },
  { key: "outbound" as const, label: "Outbound", pct: 18, icon: PhoneOutgoing },
  { key: "whatsapp" as const, label: "WhatsApp", pct: 11, icon: MessageCircle },
];

describe("ChannelMixBar", () => {
  it("renders one legend row per non-zero slice", () => {
    render(<ChannelMixBar slices={SLICES} />);
    expect(screen.getByText("Inbound")).toBeInTheDocument();
    expect(screen.getByText("Outbound")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
  });

  it("renders the percentage for each non-zero slice", () => {
    render(<ChannelMixBar slices={SLICES} />);
    expect(screen.getByText("71%")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText("11%")).toBeInTheDocument();
  });

  it("omits zero-pct slices from the legend", () => {
    const withZero = [
      ...SLICES,
      { key: "instagram" as const, label: "Instagram", pct: 0, icon: MessageCircle },
    ];
    render(<ChannelMixBar slices={withZero} />);
    expect(screen.queryByText("Instagram")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/segments/ChannelMixBar.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement primitive**

Create `src/components/segments/ChannelMixBar.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";
import { ChannelChip } from "@/components/primitives/ChannelChip";

export type Slice = {
  key: string;
  label: string;
  pct: number;
  icon: LucideIcon;
};

type Props = { slices: Slice[] };

// Sage-tone gradient applied in slice order so the visual rhythm matches the legend order.
const BAR_COLORS = ["bg-ink", "bg-primary", "bg-sage", "bg-sage/40", "bg-sage-mute"];

export function ChannelMixBar({ slices }: Props) {
  const nonZero = slices.filter((s) => s.pct > 0);
  return (
    <div>
      <div
        aria-hidden="true"
        className="flex h-3 w-full overflow-hidden rounded-full border border-sage/30"
      >
        {nonZero.map((s, i) => (
          <div
            key={s.key}
            style={{ width: `${s.pct}%` }}
            className={BAR_COLORS[i] ?? "bg-sage-mute"}
          />
        ))}
      </div>
      <dl className="mt-3 space-y-1.5">
        {nonZero.map((s) => (
          <div key={s.key} className="flex items-center justify-between">
            <dt>
              <ChannelChip icon={s.icon} label={s.label} size="sm" />
            </dt>
            <dd className="font-mono text-xs tabular-nums text-mono-label">{s.pct}%</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/segments/ChannelMixBar.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/segments/ChannelMixBar.tsx src/components/segments/ChannelMixBar.test.tsx
git commit -m "feat(segments): ChannelMixBar — proportional bar + lucide legend"
```

### Task 6.3: `SegmentPanel` component

**Files:**
- Create: `src/components/segments/SegmentPanel.tsx`
- Test: `src/components/segments/SegmentPanel.test.tsx`

- [ ] **Step 1: Create channel-icon map (shared helper inside SegmentPanel)**

We need a small map from `ChannelKey` (`"inbound"|"outbound"|"whatsapp"|"instagram"|"web"`) to lucide icons. Keep it local to `SegmentPanel.tsx` for now.

- [ ] **Step 2: Write failing test**

Create `src/components/segments/SegmentPanel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SegmentPanel } from "./SegmentPanel";
import { VERTICALS } from "@/content/verticals";

describe("SegmentPanel", () => {
  it("renders the outcome stat headline and attribution", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    expect(screen.getByText("£401K recovered")).toBeInTheDocument();
    expect(screen.getByText(/Image Orthodontics|industry estimate/i)).toBeInTheDocument();
  });

  it("renders the pain framing", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    expect(screen.getByText(/New-patient enquiries spike outside 9–5/i)).toBeInTheDocument();
  });

  it("renders the customer story quote and attribution", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    expect(screen.getByText(/47 new patients in month 1\./)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Patel/)).toBeInTheDocument();
  });

  it("renders the segment CTA link with correct href", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    const cta = screen.getByRole("link", { name: /Book a dental demo/i });
    expect(cta).toHaveAttribute("href", "/demo?v=dental");
  });

  it("has correct ARIA tabpanel wiring", () => {
    const { container } = render(
      <SegmentPanel
        content={VERTICALS.beauty}
        panelId="segment-panel-beauty"
        labelledBy="segment-tab-beauty"
        kickerLetter="b"
      />
    );
    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("id", "segment-panel-beauty");
    expect(panel).toHaveAttribute("aria-labelledby", "segment-tab-beauty");
  });
});
```

- [ ] **Step 3: Run test, expect FAIL**

```bash
npm test -- src/components/segments/SegmentPanel.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 4: Implement SegmentPanel**

Create `src/components/segments/SegmentPanel.tsx`:

```tsx
import Image from "next/image";
import {
  PhoneIncoming,
  PhoneOutgoing,
  MessageCircle,
  Instagram,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { ChannelMixBar, type Slice } from "@/components/segments/ChannelMixBar";
import type { VerticalContent, ChannelKey } from "@/lib/verticals";

const CHANNEL_ICONS: Record<ChannelKey, LucideIcon> = {
  inbound: PhoneIncoming,
  outbound: PhoneOutgoing,
  whatsapp: MessageCircle,
  instagram: Instagram,
  web: MessagesSquare,
};

type Props = {
  content: VerticalContent;
  panelId: string;
  labelledBy: string;
  kickerLetter: string;
};

export function SegmentPanel({ content, panelId, labelledBy, kickerLetter }: Props) {
  const slices: Slice[] = content.channelMix.map((c) => ({
    key: c.key,
    label: c.label,
    pct: c.pct,
    icon: CHANNEL_ICONS[c.key],
  }));

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={labelledBy}
      tabIndex={0}
      className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 min-h-[640px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <div className="relative">
        <Image
          src={`/assets/redesign/segments/${content.key}.png`}
          alt=""
          width={720}
          height={900}
          aria-hidden="true"
          loading="lazy"
          className="w-full h-auto"
        />
      </div>
      <div>
        <Kicker number={`04${kickerLetter}`} label={content.label} />

        <p className="mt-6 font-display text-display-xl text-ink leading-none tabular-nums">
          {content.outcomeStat.headline}
        </p>
        <p className="mt-3 text-fg-muted">{content.outcomeStat.attribution}</p>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">The pain</p>
        <p className="mt-3 text-ink leading-[1.55]">{content.painFraming}</p>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Channel mix here</p>
        <div className="mt-3">
          <ChannelMixBar slices={slices} />
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Sample call</p>
        <p className="mt-3 text-fg-muted text-sm leading-[1.55]">{content.audioSampleScript}</p>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Works with</p>
        <p className="mt-3 text-ink leading-[1.55]">
          <span className="font-medium">UK:</span> {content.integrationsUk.join(" · ")}
        </p>
        <p className="mt-2 text-ink leading-[1.55]">
          <span className="font-medium">US/intl:</span> {content.integrationsUsIntl.join(" · ")}
        </p>

        <blockquote className="mt-8 border-l-2 border-sage pl-4">
          <p className="text-ink text-lg leading-snug">&ldquo;{content.customerStory.quote}&rdquo;</p>
          <footer className="mt-2 text-sm text-fg-muted">— {content.customerStory.attribution}</footer>
        </blockquote>

        <Button href={`/demo?v=${content.key}`} className="mt-8">
          {content.demoCtaLabel}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test, expect PASS**

```bash
npm test -- src/components/segments/SegmentPanel.test.tsx
```

Expected: 5 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/segments/SegmentPanel.tsx src/components/segments/SegmentPanel.test.tsx
git commit -m "feat(segments): SegmentPanel — outcome stat + channel mix + story + CTA"
```

### Task 6.4: `SegmentsShowcase` shell with tabs

**Files:**
- Create: `src/components/sections/SegmentsShowcase.tsx`
- Test: `src/components/sections/SegmentsShowcase.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/sections/SegmentsShowcase.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { SegmentsShowcase } from "./SegmentsShowcase";

describe("SegmentsShowcase", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders 6 tabs", () => {
    render(<SegmentsShowcase initialSegment="dental" />);
    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(6);
  });

  it("marks the initial segment tab as selected", () => {
    render(<SegmentsShowcase initialSegment="beauty" />);
    const tab = screen.getByRole("tab", { name: /Beauty salons/i });
    expect(tab).toHaveAttribute("aria-selected", "true");
  });

  it("clicking a tab updates active state and URL", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="dental" />);
    const fitnessTab = screen.getByRole("tab", { name: /Fitness studios/i });
    await user.click(fitnessTab);
    expect(fitnessTab).toHaveAttribute("aria-selected", "true");
    expect(window.location.search).toBe("?v=fitness");
  });

  it("ArrowRight from active tab moves selection forward", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="dental" />);
    const dental = screen.getByRole("tab", { name: /Dental clinics/i });
    dental.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Beauty salons/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowLeft from first tab wraps to last", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="dental" />);
    const dental = screen.getByRole("tab", { name: /Dental clinics/i });
    dental.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Vet clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("Home jumps to first, End jumps to last", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="pubs" />);
    const pubs = screen.getByRole("tab", { name: /Gastropubs/i });
    pubs.focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Vet clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /Dental clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("renders only the active tab's panel", () => {
    render(<SegmentsShowcase initialSegment="trades" />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "segment-panel-construction");
    // Trades outcome stat
    expect(screen.getByText("£140K won-jobs")).toBeInTheDocument();
  });
});
```

Note: Trades's vertical key is `construction` (the data key) but the display label is "Trades". The panel ID uses the key. The test asserts both.

- [ ] **Step 2: Run test, expect FAIL**

```bash
npm test -- src/components/sections/SegmentsShowcase.test.tsx
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement SegmentsShowcase**

Create `src/components/sections/SegmentsShowcase.tsx`:

```tsx
"use client";
import { useRef } from "react";
import { Kicker } from "@/components/primitives/Kicker";
import { VerticalMark } from "@/components/primitives/VerticalMark";
import { SegmentPanel } from "@/components/segments/SegmentPanel";
import { useSegmentParam } from "@/lib/useSegmentParam";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const KICKER_LETTERS = ["a", "b", "c", "d", "e", "f"];

type Props = { initialSegment: VerticalKey };

export function SegmentsShowcase({ initialSegment }: Props) {
  const [active, select] = useSegmentParam(initialSegment);
  const activeIndex = VERTICAL_KEYS.indexOf(active);
  const tabRefs = useRef<Record<VerticalKey, HTMLButtonElement | null>>({} as Record<VerticalKey, HTMLButtonElement | null>);

  const handleSelect = (k: VerticalKey) => {
    select(k);
    track("segment_tab_changed", { segment: k });
  };

  const moveTo = (idx: number) => {
    const k = VERTICAL_KEYS[(idx + VERTICAL_KEYS.length) % VERTICAL_KEYS.length];
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
        moveTo(VERTICAL_KEYS.length - 1);
        break;
    }
  };

  return (
    <section
      id="segments"
      className="mx-auto max-w-page px-4 py-24 md:py-32"
      aria-labelledby="segments-heading"
    >
      <Kicker number="04" label="Built for how you actually run" />
      <h2
        id="segments-heading"
        className="mt-6 font-display text-display-lg text-ink text-balance"
      >
        Built for how you actually run.
      </h2>

      <div
        role="tablist"
        aria-label="Segment selector"
        onKeyDown={handleKeyDown}
        className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        {VERTICAL_KEYS.map((k) => {
          const v = VERTICALS[k];
          const isActive = k === active;
          return (
            <button
              key={k}
              ref={(el) => {
                tabRefs.current[k] = el;
              }}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`segment-panel-${k}`}
              id={`segment-tab-${k}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(k)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive ? "text-ink" : "text-fg-muted hover:text-ink"
              )}
            >
              <VerticalMark vertical={k} variant="illustration" className="h-16 w-16" />
              <span className="font-display text-xl">{v.label}</span>
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

      <div className="mt-12">
        <SegmentPanel
          content={VERTICALS[active]}
          panelId={`segment-panel-${active}`}
          labelledBy={`segment-tab-${active}`}
          kickerLetter={KICKER_LETTERS[activeIndex]}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, expect PASS**

```bash
npm test -- src/components/sections/SegmentsShowcase.test.tsx
```

Expected: 7 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/SegmentsShowcase.tsx src/components/sections/SegmentsShowcase.test.tsx
git commit -m "feat(section): SegmentsShowcase — 6 tabs, ARIA tablist, deep-link, keyboard nav"
```

### Task 6.5: Wire SegmentsShowcase into page, delete VerticalsTileModule + VerticalTile

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/sections/VerticalsTileModule.tsx`
- Delete: `src/components/sections/VerticalsTileModule.test.tsx`
- Delete: `src/components/verticals/VerticalTile.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx`**

Replace the file with:

```tsx
import { Hero } from "@/components/sections/Hero";
import { ChannelsRibbon } from "@/components/sections/ChannelsRibbon";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { AudioDemo } from "@/components/sections/AudioDemo";
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
      <AudioDemo />
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

- [ ] **Step 2: Delete obsolete files**

```bash
git rm src/components/sections/VerticalsTileModule.tsx \
       src/components/sections/VerticalsTileModule.test.tsx \
       src/components/verticals/VerticalTile.tsx
```

If `src/components/verticals/` is now empty, also remove the directory:

```bash
rmdir src/components/verticals 2>/dev/null || true
```

- [ ] **Step 3: Verify no other file imports the deleted modules**

```bash
grep -rE "VerticalsTileModule|VerticalTile\b" src/ tests/ \
  --include="*.ts" --include="*.tsx"
```

Expected: no matches (the new `SegmentsShowcase` uses `VerticalMark`, not `VerticalTile`).

- [ ] **Step 4: Run full vitest**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Run build**

```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds, `✓ Placeholder guard passed`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(page): swap VerticalsTileModule for SegmentsShowcase; delete VerticalTile"
```

---

## Phase 7 — Downstream copy edits

### Task 7.1: SocialProofLogos stat labels

**Files:**
- Modify: `src/components/sections/SocialProofLogos.tsx`

- [ ] **Step 1: Read current contents**

```bash
cat src/components/sections/SocialProofLogos.tsx
```

- [ ] **Step 2: Update the 3 stat labels**

In `src/components/sections/SocialProofLogos.tsx`, change the 3 stat label strings to:

```
"100,000+ UK SMBs on ANNA"
"24/7 reception"
"200+ tools integrated"
```

(Locate the array/object holding the three labels and replace those three values. Leave numeric values, layout, and other copy untouched.)

- [ ] **Step 3: Run vitest**

```bash
npm test
```

Expected: all pass (any existing assertion about stat labels needs the matching new string).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/SocialProofLogos.tsx
git commit -m "feat(social-proof): v3 stat labels — outcome-flavoured, no AI"
```

### Task 7.2: AudioDemo copy refresh

**Files:**
- Modify: `src/components/sections/AudioDemo.tsx`

- [ ] **Step 1: Update copy**

Open `src/components/sections/AudioDemo.tsx`. Apply three changes:

1. Change the `Kicker` label to `Hear a real call`.
2. Wherever the transcript label or surrounding caption says "AI receptionist" or "AI", replace with "ANNA".
3. Below the player, add a new paragraph:

```tsx
<p className="mt-4 text-fg-muted text-sm leading-[1.55]">
  Same flow on WhatsApp and DMs — try them on the demo call.
</p>
```

- [ ] **Step 2: Run vitest + grep**

```bash
npm test -- src/components/sections/AudioDemo.test.tsx && \
  ! grep -E "\\bAI\\b" src/components/sections/AudioDemo.tsx
```

Expected: tests pass and the grep returns no matches (note the `!` flips success).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AudioDemo.tsx
git commit -m "feat(audio): v3 — kicker rename, WhatsApp/DMs line, no AI"
```

### Task 7.3: HowItWorks step 2 copy

**Files:**
- Modify: `src/components/sections/HowItWorks.tsx`

- [ ] **Step 1: Update step 2 body**

In `src/components/sections/HowItWorks.tsx`, replace step 2's `body` string with:

```
"ANNA learns your menu, your booking flow, and your channels — phone, WhatsApp, Instagram, web."
```

Leave steps 1 and 3 unchanged.

- [ ] **Step 2: Run vitest**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HowItWorks.tsx
git commit -m "feat(how-it-works): step 2 — mentions channel breadth"
```

### Task 7.4: TestimonialWall — 6 segment-anchored quotes

**Files:**
- Modify: `src/content/testimonials.ts`
- Modify: `src/components/sections/TestimonialWall.tsx` (only if it limits to 4 entries)

- [ ] **Step 1: Read current `src/content/testimonials.ts`**

```bash
cat src/content/testimonials.ts
```

- [ ] **Step 2: Replace with 6 segment-anchored quotes**

Replace the file with:

```ts
export type Testimonial = {
  vertical: "dental" | "beauty" | "pubs" | "construction" | "fitness" | "vet";
  quote: string;
  attribution: string;     // "Name · Business, City"
  hero?: boolean;          // set true for the one visually-dominant quote
};

// v3 §7.4 + §9.5: hero quote is a Trades operator.
export const TESTIMONIALS: Testimonial[] = [
  {
    vertical: "construction",
    quote: "I won three boiler jobs last month while on a roof.",
    attribution: "Mark D. · DJ Plumbing & Gas, North London",
    hero: true,
  },
  {
    vertical: "dental",
    quote: "47 new patients in month 1.",
    attribution: "Dr. Patel · Bright Smiles Cardiff",
  },
  {
    vertical: "beauty",
    quote: "Zero missed bookings since we switched.",
    attribution: "Alex Riley · Mane Studio Manchester",
  },
  {
    vertical: "pubs",
    quote: "Our Saturday covers are up 23%.",
    attribution: "Sarah & Tom · The Black Swan, Cotswolds",
  },
  {
    vertical: "fitness",
    quote: "Class fill is at 94% on weeknights.",
    attribution: "Priya K. · Form Studio Bristol",
  },
  {
    vertical: "vet",
    quote: "Out-of-hours triage stopped going to voicemail.",
    attribution: "Dr. Chen · Glasgow Vet Group",
  },
];
```

- [ ] **Step 3: Update `TestimonialWall.tsx` if needed**

Open `src/components/sections/TestimonialWall.tsx`. If the component:
- destructures a fixed number of quotes (e.g. `const [a, b, c, d] = TESTIMONIALS`), refactor to iterate
- uses the old `Testimonial` field names (e.g. `name`, `role`, `business`), update field references to `quote`, `attribution`, `hero`

The hero quote should render in the visually-dominant slot (typically larger type, possibly its own column or position 1). The other 5 render in the remaining grid.

- [ ] **Step 4: Run vitest**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/content/testimonials.ts src/components/sections/TestimonialWall.tsx
git commit -m "feat(testimonials): v3 — 6 segment-anchored quotes, hero is Trades"
```

### Task 7.5: IntegrationsMarquee — add WhatsApp, Instagram, Intercom

**Files:**
- Modify: `src/content/integrations.ts`
- Modify: `src/components/sections/IntegrationsMarquee.tsx` (if it caps the count)

- [ ] **Step 1: Read current `integrations.ts`**

```bash
cat src/content/integrations.ts
```

- [ ] **Step 2: Append the 3 new integrations**

Add these entries to the existing integrations array (preserve any existing typed shape):

```ts
{ name: "WhatsApp Business", category: "messaging" },
{ name: "Instagram", category: "messaging" },
{ name: "Intercom", category: "web-chat" },
```

If the `category` field type is more constrained, extend the union to allow `"messaging" | "web-chat"` and update any test asserting category counts.

- [ ] **Step 3: Run vitest**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/content/integrations.ts src/components/sections/IntegrationsMarquee.tsx
git commit -m "feat(integrations): + WhatsApp Business, Instagram, Intercom"
```

### Task 7.6: PricingTeaser — add "Pays for itself" line

**Files:**
- Modify: `src/components/sections/PricingTeaser.tsx`

- [ ] **Step 1: Edit `src/components/sections/PricingTeaser.tsx`**

Insert a second meta-row directly under the existing meta-row paragraph (the one with `"Depending on call volume · No long contracts · Setup in 3 minutes"`):

```tsx
<p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
  Pays for itself in the first week · Cancel anytime
</p>
```

- [ ] **Step 2: Run vitest**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/PricingTeaser.tsx
git commit -m "feat(pricing): + 'pays for itself in the first week' meta-row"
```

### Task 7.7: FinalCtaBanner copy refresh

**Files:**
- Modify: `src/components/sections/FinalCtaBanner.tsx`

- [ ] **Step 1: Edit copy**

In `src/components/sections/FinalCtaBanner.tsx`, replace the main pitch text (typically the H2 or large display paragraph) with:

```
Stop letting the phone steal your day. Set up in three minutes, paid back in the first week.
```

Strip any "AI" mentions in surrounding copy. Leave the two CTAs (`Book a demo`, `Get my free revenue audit`) untouched.

- [ ] **Step 2: Run vitest + grep**

```bash
npm test && ! grep -E "\\bAI\\b" src/components/sections/FinalCtaBanner.tsx
```

Expected: tests pass; no AI matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FinalCtaBanner.tsx
git commit -m "feat(final-cta): v3 — new pitch, no AI"
```

### Task 7.8: RoiCalculator — 6 segments dropdown

**Files:**
- Modify: `src/components/sections/RoiCalculator.tsx`

- [ ] **Step 1: Read current contents**

```bash
cat src/components/sections/RoiCalculator.tsx
```

- [ ] **Step 2: Update segment iteration**

If the calculator hardcodes a list of 4 verticals (`["dental","beauty","pubs","construction"]`), replace with `VERTICAL_KEYS` import from `@/lib/verticals`. If it iterates `VERTICAL_KEYS` already, no change needed.

If the dropdown labels are hardcoded, ensure they pull from `VERTICALS[k].label` so fitness + vet appear automatically.

- [ ] **Step 3: Run RoiCalculator tests**

```bash
npm test -- src/components/sections/RoiCalculator.test.tsx
```

Expected: existing 4-segment assertions still pass; if there's a count assertion, bump it from 4 to 6 and confirm.

- [ ] **Step 4: Run Playwright ROI suite**

```bash
npm run test:e2e -- tests/e2e/roi-calculator.spec.ts
```

Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/RoiCalculator.tsx src/components/sections/RoiCalculator.test.tsx
git commit -m "feat(roi): v3 — dropdown lists 6 segments (adds fitness + vet)"
```

---

## Phase 8 — Verification + milestone

### Task 8.1: New Playwright specs

**Files:**
- Create: `tests/e2e/segments-tabs.spec.ts`
- Create: `tests/e2e/channels-ribbon.spec.ts`

- [ ] **Step 1: Create `segments-tabs.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test.describe("Segments tabs", () => {
  test("deep link to ?v=beauty lands on Beauty tab", async ({ page }) => {
    await page.goto("/?v=beauty");
    const beauty = page.getByRole("tab", { name: /Beauty salons/i });
    await expect(beauty).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("£62K booked covers")).toBeVisible();
  });

  test("clicking a tab updates URL", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: /Fitness studios/i }).click();
    await expect(page).toHaveURL(/[?&]v=fitness\b/);
    await expect(page.getByText("£29K class-fill recovered")).toBeVisible();
  });

  test("keyboard navigation cycles through tabs", async ({ page }) => {
    await page.goto("/?v=dental");
    const dental = page.getByRole("tab", { name: /Dental clinics/i });
    await dental.focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: /Vet clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: /Dental clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  for (const seg of ["dental", "beauty", "pubs", "construction", "fitness", "vet"] as const) {
    test(`visual baseline for ?v=${seg}`, async ({ browser }) => {
      const ctx = await browser.newContext({
        reducedMotion: "reduce",
        viewport: { width: 1440, height: 900 },
      });
      const page = await ctx.newPage();
      await page.goto(`/?v=${seg}`);
      await page.locator("#segments").scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await expect(page.locator("#segments")).toHaveScreenshot(`segments-${seg}.png`, {
        maxDiffPixelRatio: 0.02,
      });
      await ctx.close();
    });
  }
});
```

- [ ] **Step 2: Create `channels-ribbon.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1024", width: 1024, height: 900 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

for (const v of VIEWPORTS) {
  test(`ChannelsRibbon visual baseline ${v.name}`, async ({ browser }) => {
    const ctx = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: v.width, height: v.height },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    const ribbon = page.locator("section[aria-labelledby='channels-heading']");
    await ribbon.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(ribbon).toHaveScreenshot(`channels-${v.name}.png`, {
      maxDiffPixelRatio: 0.02,
    });
    await ctx.close();
  });
}
```

- [ ] **Step 3: Generate initial visual baselines**

```bash
npm run test:e2e -- tests/e2e/segments-tabs.spec.ts tests/e2e/channels-ribbon.spec.ts --update-snapshots
```

Expected: snapshot files created. Visually review the resulting PNGs in `tests/e2e/*-snapshots/` to confirm they look right.

- [ ] **Step 4: Re-run without `--update-snapshots` to confirm green**

```bash
npm run test:e2e -- tests/e2e/segments-tabs.spec.ts tests/e2e/channels-ribbon.spec.ts
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/segments-tabs.spec.ts tests/e2e/channels-ribbon.spec.ts tests/e2e/segments-tabs.spec.ts-snapshots tests/e2e/channels-ribbon.spec.ts-snapshots
git commit -m "test(e2e): v3 — segments deep-link/keyboard + channels-ribbon visual baselines"
```

### Task 8.2: Update existing visual regression baseline

**Files:**
- Modify: `tests/e2e/visual.spec.ts-snapshots/*.png` (auto-regenerated)

- [ ] **Step 1: Re-baseline existing landing snapshots**

The whole-page layout changed (channels ribbon inserted, segments tabbed, RevenueLeak/AuditReEntryBanner removed). Update baselines:

```bash
npm run test:e2e -- tests/e2e/visual.spec.ts --update-snapshots
```

- [ ] **Step 2: Run all e2e to confirm green**

```bash
npm run test:e2e
```

Expected: all pass (32+ specs).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/visual.spec.ts-snapshots
git commit -m "test(visual): re-baseline landing snapshots for v3 IA"
```

### Task 8.3: Lighthouse run + populate baseline doc

**Files:**
- Modify: `docs/superpowers/lighthouse-baseline-v3.md`

- [ ] **Step 1: Build + serve**

```bash
npm run build && npm run start &
sleep 5
```

- [ ] **Step 2: Lighthouse desktop + mobile**

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=desktop \
  --output=json --output-path=./lighthouse-desktop-v3-post.json \
  --quiet --chrome-flags="--headless"

npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=./lighthouse-mobile-v3-post.json \
  --quiet --chrome-flags="--headless"
```

- [ ] **Step 3: Kill server**

```bash
pkill -f "next start" || true
```

- [ ] **Step 4: Fill in `## v3 results` section of `docs/superpowers/lighthouse-baseline-v3.md`**

Use the same template structure as `lighthouse-baseline-v2.md`. Compute deltas against the pre-v3 baseline captured in Phase 0. Add a Gate verdict block confirming each metric stays within the thresholds in spec §12.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/lighthouse-baseline-v3.md
git commit -m "docs(perf): Lighthouse v3 results + gate verdict"
```

### Task 8.4: Full test sweep, axe a11y, and milestone tag

**Files:**
- (no source changes — verification + tag)

- [ ] **Step 1: Full vitest run**

```bash
npm test
```

Expected: all (135+) tests pass.

- [ ] **Step 2: Full Playwright run**

```bash
npm run test:e2e
```

Expected: all specs pass, including axe a11y and visual regression.

- [ ] **Step 3: Final placeholder + AI guard**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ Placeholder guard passed`.

- [ ] **Step 4: Verify acceptance criteria from spec §16**

```bash
# 1. No standalone AI in source
grep -rEn "\\bAI\\b|AI Receptionist|artificial intelligence" src/ \
  --include="*.ts" --include="*.tsx" | tee /tmp/ai-check.txt

# 2. Page section order (read by eye)
grep -E "<(Hero|ChannelsRibbon|SocialProofLogos|SegmentsShowcase|OutcomeStrip|AudioDemo|RoiCalculator|HowItWorks|TestimonialWall|IntegrationsMarquee|PricingTeaser|FaqAccordion|FinalCtaBanner|SquiggleDivider)" src/app/page.tsx
```

Expected for #1: empty output (no AI mentions).
Expected for #2: 13 section components in the order specified in spec §4 (+ the kept SquiggleDivider).

- [ ] **Step 5: Milestone commit + tag**

```bash
git commit --allow-empty -m "milestone: v3 segments + channels + no-AI — all gates green"
git tag v3-segments-channels
```

- [ ] **Step 6: Push branch + tag**

```bash
git push origin feat/landing-v1
git push origin v3-segments-channels
```

(If working on a different branch, substitute its name. The user has `main` as the deploy target — open a PR from `feat/landing-v1` → `main` when ready.)

---

## Self-Review

### Spec coverage check

Re-read spec §1 (Goals), §4 (IA), §6 (Channels), §7 (Segments), §8 (Outcomes), §9 (Downstream), §10 (Assets), §11 (Visual system), §12 (Perf), §13 (Tests), §16 (Acceptance):

| Spec section | Plan task(s) |
|---|---|
| §1 Goals — elaborate Segments | Tasks 6.1-6.5 |
| §1 Goals — make design richer | Per-panel scene image (5.1-5.4), channel mix viz (6.2), customer quote, segment CTA, panel layout (6.3) |
| §1 Goals — outcomes not features | Task 3.1 (OutcomeStrip); Task 1.1 (Hero); Task 7.7 (FinalCta) |
| §1 Goals — no AI | Tasks 1.1, 1.2, 1.3, 1.4, 7.2, 7.7 + guard 0.2 |
| §1 Goals — channels (in/out/WA/IG/web) | Task 2.1-2.3 (ribbon) + Task 6.2 (mix bar) + Task 4.2 (per-segment %) |
| §3 Voice/positioning rules | Hero copy 1.1; metadata 1.2; FAQ 1.3 |
| §4 IA (13 sections) | Task 6.5 page.tsx |
| §5 Hero v3 | Task 1.1 |
| §6 Channels ribbon | Tasks 2.1, 2.2, 2.3 |
| §7 Segments showcase | Tasks 4.1-4.3, 5.1-5.4, 6.1-6.5 |
| §8 OutcomeStrip | Task 3.1 |
| §9.1 SocialProof | Task 7.1 |
| §9.2 AudioDemo | Task 7.2 |
| §9.3 RoiCalculator | Tasks 4.2 (data) + 7.8 (UI) |
| §9.4 HowItWorks | Task 7.3 |
| §9.5 TestimonialWall | Task 7.4 |
| §9.6 IntegrationsMarquee | Task 7.5 |
| §9.7 PricingTeaser | Task 7.6 |
| §9.8 FAQ | Task 1.3 |
| §9.9 FinalCtaBanner | Task 7.7 |
| §9.10 Metadata | Task 1.2 |
| §9.11 page.tsx | Task 6.5 |
| §10 Assets | Tasks 5.1-5.4 |
| §11 ChannelChip primitive | Task 2.1 |
| §12 Perf gates | Tasks 0.1, 8.3 |
| §13 Tests | Tasks 2.1, 2.2, 3.1, 6.1, 6.2, 6.3, 6.4, 4.3, 8.1, 8.2 |
| §16 Acceptance criteria | Task 8.4 |

All spec sections are covered. No gaps.

### Placeholder scan

Scanned the plan for "TBD", "TODO", "fill in details" — none present. Every code block is complete. Every test is concrete. Every command shows expected output.

### Type consistency

- `VerticalKey` extended in Task 4.1, used consistently in Tasks 4.2, 4.3, 6.1-6.5.
- `ChannelKey` defined in 4.1, used in 4.2 (data) and 6.3 (`CHANNEL_ICONS` map).
- `Slice` defined in 6.2 (ChannelMixBar), imported in 6.3 (SegmentPanel).
- `VerticalContent` shape extended in 4.1 (adds `outcomeStat`, `customerStory`, `channelMix`, `demoCtaLabel`), populated in 4.2 for all 6 segments.
- `useSegmentParam` (6.1) returns `[VerticalKey, (k: VerticalKey) => void]`, consumed identically in 6.4.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-27-anna-reception-v3-segments-channels-plan.md`. Two execution options:

1. **Subagent-Driven (recommended)** — controller dispatches a fresh subagent per task, reviews between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Which approach?
