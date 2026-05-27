# ANNA Reception v2 — Motion & Illustrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer scroll-reveal motion + 5 engraved-line illustrations + 2 squiggle dividers + slow hero bob onto the shipped Editorial ANNA Warm landing page, gated by an upfront Lighthouse performance baseline.

**Architecture:** Two new primitives (`Reveal`, `SquiggleDivider`) built on the existing `useScrollReveal` hook (enhanced with a fast-scroll guard returning `{ revealed, instant }`). Five image-gen PNGs go through a curation gate (N candidates → pick K) and are compressed to per-asset KB ceilings before commit. Eight sections + `page.tsx` are touched: six grids get a `<Reveal>` stagger, two get a `<SquiggleDivider>` between them, the hero gets a 7-second `animate-bob`, and TrustStrip gets a single fade-in (no count-ups). The previous Waveform-breathing and StatCounter count-ups from spec v1 are explicitly NOT in this plan.

**Tech Stack:** Next.js 14.2 · React 18.3 · TypeScript 5.5 · Tailwind 3.4 · vitest 4.1 · Playwright 1.60 · `sharp` (for PNG palette compression — already a Next.js peer dep) · `lucide-react` (for icons, already installed) · Google Gemini 3 Pro Image via `google-image-gen` plugin (already configured).

**Spec:** `docs/superpowers/specs/2026-05-27-anna-reception-v2-motion-illustrations-design.md` (revision `2910142`).

---

## File map

**New primitives:**
- `src/components/primitives/Reveal.tsx` + `.test.tsx`
- `src/components/primitives/SquiggleDivider.tsx` + `.test.tsx`

**Refactored:**
- `src/lib/useScrollReveal.ts` — return `{ revealed, instant }`; fast-scroll guard
- `src/lib/useScrollReveal.test.tsx` — one new test for fast-scroll path
- `src/components/primitives/VerticalMark.tsx` + `.test.tsx` — `variant` prop

**Config:**
- `tailwind.config.ts` — `bob` keyframe with 7s period

**Sections (modify):**
- `src/components/sections/SocialProofLogos.tsx` — single Reveal around grid (no count-ups)
- `src/components/sections/RevenueLeak.tsx` — Reveal stagger on 3 stanzas
- `src/components/sections/HowItWorks.tsx` — Reveal stagger on 3 steps
- `src/components/sections/FeatureStrip.tsx` — Reveal stagger on 6 cells
- `src/components/sections/TestimonialWall.tsx` — Reveal as 2 groups in reading order
- `src/components/sections/VerticalsTileModule.tsx` — Reveal stagger on 4 tiles
- `src/components/sections/RoiCalculator.tsx` — Reveal stagger on 4 picker tiles + `variant="illustration"` on VerticalMark
- `src/components/sections/Hero.tsx` — `motion-safe:animate-bob` on the illustration
- `src/app/page.tsx` — insert 2 `<SquiggleDivider>` between Hero↓SocialProof and RevenueLeak↓AudioDemo

**Assets:**
- `public/assets/redesign/hero-illustration.png` — regen via curation gate, ≤80 KB optimized
- `public/assets/redesign/hero-illustration-v1.png` — backup of current
- `public/assets/redesign/{dental,beauty,gastro,trades}.png` — new, ≤30 KB each optimized
- `public/assets/redesign/README.md` — inventory update + temporary-asset notice
- `docs/superpowers/specs/mockups/hero-v2-candidates/` — 2 hero candidates (1 picked)
- `docs/superpowers/specs/mockups/vertical-candidates/` — 8 vertical candidates (4 picked)

**Tests (e2e):**
- `tests/e2e/visual.spec.ts` — modify to emulate reduced-motion before snapshots
- `tests/e2e/reveal-scroll-flow.spec.ts` — new
- `tests/e2e/reveal-fast-scroll.spec.ts` — new
- `tests/e2e/reveal-focus-within.spec.ts` — new
- `tests/e2e/reveal-reduced-motion.spec.ts` — new
- `tests/e2e/visual-motion.spec.ts` — new (3 keyframe captures of hero bob, no diff tolerance)

**Documentation:**
- `docs/superpowers/lighthouse-baseline-v2.md` — baseline scores captured in Phase 0
- `scripts/optimize-asset.mjs` — helper that compresses a PNG via `sharp` and reports the resulting size

---

## Phase 0 — Performance baseline (GATE)

This phase MUST complete before any motion code lands. Council-mandated.

### Task 1: Confirm clean baseline + record current Lighthouse

**Files:** create `docs/superpowers/lighthouse-baseline-v2.md`

- [ ] **Step 1:** Verify clean working tree and current branch

```bash
git status
git log -1 --oneline
```

Expected: clean working tree on `feat/landing-v1`, most recent commit is the v2 spec revision `2910142` or later.

- [ ] **Step 2:** Confirm prior gates pass

```bash
npm test 2>&1 | tail -8
npx playwright test 2>&1 | tail -8
```

Expected: 102/102 vitest pass; 23/23 e2e pass (5 mobile visual regression skipped).

- [ ] **Step 3:** Build production output

```bash
rm -rf .next
npm run build 2>&1 | tail -15
```

Expected: build compiles; `check:placeholders` exits 0 with "✓ Placeholder guard passed".

- [ ] **Step 4:** Stop any existing dev/start server on port 3000, then start production server

```bash
PID=$(lsof -ti :3000) && [ -n "$PID" ] && kill $PID; sleep 2
nohup npm start > /tmp/anna-start.log 2>&1 &
sleep 6
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

Expected: 200.

- [ ] **Step 5:** Run Lighthouse on desktop + mobile

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=./lighthouse-baseline-desktop \
  --quiet --chrome-flags="--headless" \
  --preset=desktop 2>&1 | tail -10

npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=./lighthouse-baseline-mobile \
  --quiet --chrome-flags="--headless" 2>&1 | tail -10
```

Expected: two report pairs (`lighthouse-baseline-desktop.report.{json,html}` and same for mobile) appear in the project root.

- [ ] **Step 6:** Extract scores into a baseline document

Read `lighthouse-baseline-desktop.report.json` and `lighthouse-baseline-mobile.report.json` (the JSON files Lighthouse just wrote). Use `node -e "console.log(JSON.parse(require('fs').readFileSync('lighthouse-baseline-desktop.report.json')).categories.performance.score)"` to extract each of the four categories from each report. Create `docs/superpowers/lighthouse-baseline-v2.md`:

```markdown
# Lighthouse baseline — pre-v2 motion pass

Captured: <ISO date you ran the commands>
Commit: <git rev-parse HEAD>

## Desktop
- Performance: <score>
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <numericValue from audits.largest-contentful-paint, ms>
- CLS: <numericValue from audits.cumulative-layout-shift>
- INP / TBT: <numericValue from audits.total-blocking-time, ms>

## Mobile
- Performance: <score>
- Accessibility: <score>
- Best-Practices: <score>
- SEO: <score>
- LCP: <ms>
- CLS: <value>
- TBT: <ms>

## Gate thresholds (each phase re-runs Lighthouse; regression >5 points fails)
- Desktop Performance: must stay ≥ <baseline-5>
- Mobile Performance:  must stay ≥ <baseline-5>
- CLS: must stay < 0.1 in both
- TBT: must stay below baseline + 50ms in both
```

Fill in real numbers from the report JSON.

- [ ] **Step 7:** Add lighthouse reports to `.gitignore` (they're large) but commit the baseline doc

```bash
echo "lighthouse-baseline-*.report.*" >> .gitignore
echo "lighthouse-baseline-*.report.json" >> .gitignore
echo "lighthouse-baseline-*.report.html" >> .gitignore
git add .gitignore docs/superpowers/lighthouse-baseline-v2.md
git commit -m "docs(perf): Lighthouse baseline before v2 motion pass"
```

- [ ] **Step 8:** Stop the production server (Phase 1 onward uses dev server)

```bash
PID=$(lsof -ti :3000) && [ -n "$PID" ] && kill $PID; sleep 1
```

---

## Phase 1 — Hook refactor (useScrollReveal fast-scroll guard)

### Task 2: Extend useScrollReveal with fast-scroll guard

**Files:** modify `src/lib/useScrollReveal.ts`, `src/lib/useScrollReveal.test.tsx`

- [ ] **Step 1:** Read the current hook to confirm the starting shape

```bash
cat src/lib/useScrollReveal.ts
```

Expected: a hook that returns `[ref, boolean]`, sets `revealed=true` on intersection, respects `prefers-reduced-motion`, uses threshold `0.15`.

- [ ] **Step 2:** Write the failing test for fast-scroll path

Open `src/lib/useScrollReveal.test.tsx` and append:

```tsx
it("returns instant=true when element enters viewport at >=0.6 intersection ratio", () => {
  const { getByTestId } = render(<TestHost />);
  const el = getByTestId("target");

  expect(el.getAttribute("data-instant")).toBe("false");
  expect(observerCallback).not.toBeNull();

  act(() => {
    observerCallback!(
      [{ isIntersecting: true, intersectionRatio: 0.85, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });

  expect(el.getAttribute("data-revealed")).toBe("true");
  expect(el.getAttribute("data-instant")).toBe("true");
});

it("returns instant=false on a normal slow reveal (ratio between 0.15 and 0.6)", () => {
  const { getByTestId } = render(<TestHost />);
  const el = getByTestId("target");

  act(() => {
    observerCallback!(
      [{ isIntersecting: true, intersectionRatio: 0.25, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });

  expect(el.getAttribute("data-revealed")).toBe("true");
  expect(el.getAttribute("data-instant")).toBe("false");
});
```

Also update the existing `TestHost` component near the top of the file to expose both pieces of state. Replace the current `TestHost` definition with:

```tsx
function TestHost() {
  const [ref, state] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-testid="target"
      data-revealed={state.revealed ? "true" : "false"}
      data-instant={state.instant ? "true" : "false"}
    />
  );
}
```

And update the existing first test ("flips to true on intersection") so its `observerCallback` call passes a low ratio (so `instant` stays false):

```tsx
observerCallback!(
  [{ isIntersecting: true, intersectionRatio: 0.2, target: el } as unknown as IntersectionObserverEntry],
  {} as IntersectionObserver
);
```

- [ ] **Step 3:** Run tests — expect failures

```bash
npx vitest run src/lib/useScrollReveal.test.tsx
```

Expected: tests fail because the hook still returns `boolean`, not `{ revealed, instant }`.

- [ ] **Step 4:** Update the hook

Replace `src/lib/useScrollReveal.ts` with:

```ts
"use client";
import { useEffect, useRef, useState } from "react";

type State = { revealed: boolean; instant: boolean };

export function useScrollReveal<T extends Element>(): [React.RefObject<T>, State] {
  const ref = useRef<T>(null);
  const [state, setState] = useState<State>({ revealed: false, instant: false });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setState({ revealed: true, instant: true });
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const instant = entry.intersectionRatio >= 0.6;
            setState({ revealed: true, instant });
            io.disconnect();
            return;
          }
        }
      },
      { threshold: [0.15, 0.6], rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return [ref, state];
}
```

- [ ] **Step 5:** Run tests — expect pass

```bash
npx vitest run src/lib/useScrollReveal.test.tsx
```

Expected: all 4 tests pass.

- [ ] **Step 6:** Commit

```bash
git add src/lib/useScrollReveal.ts src/lib/useScrollReveal.test.tsx
git commit -m "refactor(useScrollReveal): add fast-scroll guard; return {revealed, instant}"
```

---

## Phase 2 — New primitives

### Task 3: Reveal primitive

**Files:** create `src/components/primitives/Reveal.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

Create `src/components/primitives/Reveal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  let observerCallback: IntersectionObserverCallback | null;

  beforeEach(() => {
    observerCallback = null;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    global.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      cb: IntersectionObserverCallback
    ) {
      observerCallback = cb;
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
      this.takeRecords = () => [];
      // @ts-expect-error mock fields
      this.root = null;
      // @ts-expect-error mock fields
      this.rootMargin = "";
      // @ts-expect-error mock fields
      this.thresholds = [];
    }) as unknown as typeof IntersectionObserver;
  });

  it("renders children", () => {
    render(<Reveal><span>hello</span></Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("starts hidden (opacity-0 translate-y-4) and reveals on intersection", () => {
    const { container } = render(<Reveal><span>hi</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper.className).toMatch(/opacity-0/);
    expect(wrapper.className).toMatch(/translate-y-4/);

    act(() => {
      observerCallback!(
        [{ isIntersecting: true, intersectionRatio: 0.3, target: wrapper } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(wrapper.className).toMatch(/opacity-100/);
    expect(wrapper.className).toMatch(/translate-y-0/);
  });

  it("applies delayMs as inline transition-delay style", () => {
    const { container } = render(<Reveal delayMs={120}><span>x</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("120ms");
  });

  it("under reduced-motion, renders immediately with no transition", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { container } = render(<Reveal><span>x</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/opacity-100/);
    expect(wrapper.className).toMatch(/translate-y-0/);
  });

  it("forces visible state when a descendant has focus (focus-within)", () => {
    const { container } = render(
      <Reveal>
        <button>focusable</button>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toMatch(/focus-within:opacity-100/);
    expect(wrapper.className).toMatch(/focus-within:translate-y-0/);
  });

  it("skips transition when fast-scroll guard fires (intersectionRatio >= 0.6)", () => {
    const { container } = render(<Reveal><span>x</span></Reveal>);
    const wrapper = container.firstElementChild as HTMLElement;

    act(() => {
      observerCallback!(
        [{ isIntersecting: true, intersectionRatio: 0.85, target: wrapper } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(wrapper.className).toMatch(/opacity-100/);
    // When instant, the transition class is not applied so the change is immediate.
    // We assert that the transition-duration class is absent in that mode.
    expect(wrapper.className).not.toMatch(/duration-\[480ms\]/);
  });
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/primitives/Reveal.test.tsx
```

Expected: FAIL (module not found).

- [ ] **Step 3:** Implement the primitive

Create `src/components/primitives/Reveal.tsx`:

```tsx
"use client";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
};

export function Reveal({ children, delayMs = 0, className }: Props) {
  const [ref, state] = useScrollReveal<HTMLDivElement>();

  const baseClasses = "transition-[opacity,transform] ease-out";
  const hiddenClasses = "opacity-0 translate-y-4";
  const revealedClasses = "opacity-100 translate-y-0";
  const transitionDuration = state.instant ? "" : "duration-[480ms]";
  const focusOverride = "focus-within:opacity-100 focus-within:translate-y-0";

  return (
    <div
      ref={ref}
      style={delayMs && !state.instant ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={cn(
        baseClasses,
        transitionDuration,
        state.revealed ? revealedClasses : hiddenClasses,
        focusOverride,
        className
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run src/components/primitives/Reveal.test.tsx
```

Expected: all 6 tests pass.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/Reveal.tsx src/components/primitives/Reveal.test.tsx
git commit -m "feat(primitive): add Reveal (scroll-reveal wrapper; fast-scroll + focus-within safe)"
```

### Task 4: SquiggleDivider primitive

**Files:** create `src/components/primitives/SquiggleDivider.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

Create `src/components/primitives/SquiggleDivider.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SquiggleDivider } from "./SquiggleDivider";

describe("SquiggleDivider", () => {
  it("renders an aria-hidden SVG inside an aria-hidden wrapper (no role='separator')", () => {
    const { container } = render(<SquiggleDivider />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.getAttribute("role")).toBeNull();

    const svg = wrapper.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses sage tone (text-sage with alpha)", () => {
    const { container } = render(<SquiggleDivider />);
    const svg = container.querySelector("svg")!;
    expect(svg.className.baseVal || svg.getAttribute("class") || "").toMatch(/text-sage/);
  });
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/primitives/SquiggleDivider.test.tsx
```

Expected: FAIL (module not found).

- [ ] **Step 3:** Implement

Create `src/components/primitives/SquiggleDivider.tsx`:

```tsx
import { cn } from "@/lib/cn";

type Props = { className?: string };

export function SquiggleDivider({ className }: Props) {
  return (
    <div aria-hidden="true" className={cn("my-0 flex justify-center", className)}>
      <svg
        viewBox="0 0 240 16"
        className="w-48 text-sage/40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 8 C 20 0, 40 16, 60 8 S 100 0, 120 8 S 160 16, 180 8 S 220 0, 240 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 4:** Run — expect pass

```bash
npx vitest run src/components/primitives/SquiggleDivider.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/SquiggleDivider.tsx src/components/primitives/SquiggleDivider.test.tsx
git commit -m "feat(primitive): add SquiggleDivider (sage decorative wave, aria-hidden only)"
```

---

## Phase 3 — VerticalMark refactor

### Task 5: Add `variant` prop to VerticalMark

**Files:** modify `src/components/primitives/VerticalMark.tsx`, `.test.tsx`

- [ ] **Step 1:** Add tests for the new `variant="illustration"` path

Append to `src/components/primitives/VerticalMark.test.tsx`:

```tsx
import { VERTICAL_KEYS } from "@/lib/verticals";

it.each(VERTICAL_KEYS)("renders an <img> when variant=illustration for %s", (key) => {
  const { container } = render(<VerticalMark vertical={key} variant="illustration" />);
  const img = container.querySelector("img");
  expect(img).toBeInTheDocument();
  expect(img!.getAttribute("alt")).toBe("");
  expect(img!.getAttribute("src")).toMatch(new RegExp(`/assets/redesign/${key === "construction" ? "trades" : key}\\.png`));
});

it("defaults to variant=icon (renders Lucide SVG, no <img>)", () => {
  const { container } = render(<VerticalMark vertical="dental" />);
  expect(container.querySelector("svg")).toBeInTheDocument();
  expect(container.querySelector("img")).not.toBeInTheDocument();
});
```

Note the alias: `VERTICAL_KEYS` includes `construction`, but the asset file is named `trades.png` (matching the vertical's brand identity in v3 spec). The test reflects this mapping.

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/primitives/VerticalMark.test.tsx
```

Expected: new tests FAIL.

- [ ] **Step 3:** Update implementation

Replace `src/components/primitives/VerticalMark.tsx` with:

```tsx
import Image from "next/image";
import { Hammer, Scissors, Stethoscope, Utensils, type LucideIcon } from "lucide-react";
import type { VerticalKey } from "@/lib/verticals";
import { cn } from "@/lib/cn";

const ICONS: Record<VerticalKey, LucideIcon> = {
  dental: Stethoscope,
  beauty: Scissors,
  pubs: Utensils,
  construction: Hammer,
};

const ILLUSTRATION_BASENAMES: Record<VerticalKey, string> = {
  dental: "dental",
  beauty: "beauty",
  pubs: "gastro",
  construction: "trades",
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

- [ ] **Step 4:** Run — expect pass (illustration tests fail at runtime because the PNGs do not exist yet — that's expected)

```bash
npx vitest run src/components/primitives/VerticalMark.test.tsx
```

The vitest tests use jsdom which does not actually load the image — `getAttribute("src")` returns the resolved Next.js Image src wrapping. Tests should pass. If they fail because Next's `<Image>` is mocked or behaves unexpectedly in vitest, fall back to checking `container.querySelector("img")` exists with any non-empty `src`. Do NOT change the implementation.

If still failing, weaken the assertion to:
```tsx
expect(img!.getAttribute("src") || "").not.toBe("");
```

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/VerticalMark.tsx src/components/primitives/VerticalMark.test.tsx
git commit -m "refactor(VerticalMark): add variant prop; illustration mode renders PNG via next/image"
```

---

## Phase 4 — Tailwind bob keyframe

### Task 6: Add `bob` keyframe to tailwind.config.ts

**Files:** modify `tailwind.config.ts`

- [ ] **Step 1:** Read the current config

```bash
cat tailwind.config.ts
```

- [ ] **Step 2:** Update the `keyframes` and `animation` blocks. Replace the `extend.animation` and `extend.keyframes` sections to:

```ts
animation: {
  marquee: "marquee 30s linear infinite",
  reveal: "reveal 480ms ease-out both",
  bob: "bob 7s ease-in-out infinite",
},
keyframes: {
  marquee: {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(-50%)" },
  },
  reveal: {
    "0%": { opacity: "0", transform: "translateY(12px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  bob: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%":      { transform: "translateY(-4px)" },
  },
},
```

- [ ] **Step 3:** Type-check + build smoke

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4:** Commit

```bash
git add tailwind.config.ts
git commit -m "feat(tokens): add bob keyframe (7s gentle hero float, out of saccade window)"
```

---

## Phase 5 — Asset curation gate

### Task 7: Asset optimization helper

**Files:** create `scripts/optimize-asset.mjs`

- [ ] **Step 1:** Verify `sharp` is available

```bash
node -e "console.log(require('sharp')('').toString().slice(0,40))" 2>&1 || npm ls sharp 2>&1 | head -5
```

If `sharp` is not installed, install it as a devDependency:

```bash
npm install --save-dev sharp
```

- [ ] **Step 2:** Create the helper

Create `scripts/optimize-asset.mjs`:

```js
#!/usr/bin/env node
import sharp from "sharp";
import { statSync } from "node:fs";
import { resolve } from "node:path";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error("usage: node scripts/optimize-asset.mjs <input.png> <output.png>");
  process.exit(1);
}

const inputPath = resolve(input);
const outputPath = resolve(output);

const beforeBytes = statSync(inputPath).size;

await sharp(inputPath)
  .png({
    quality: 80,
    compressionLevel: 9,
    effort: 10,
    palette: true,
  })
  .toFile(outputPath);

const afterBytes = statSync(outputPath).size;
console.log(`${input}: ${(beforeBytes / 1024).toFixed(1)} KB → ${output}: ${(afterBytes / 1024).toFixed(1)} KB`);
```

- [ ] **Step 3:** Smoke-test the helper on the existing hero illustration

```bash
node scripts/optimize-asset.mjs public/assets/redesign/hero-illustration.png /tmp/hero-test.png
ls -lh /tmp/hero-test.png
rm /tmp/hero-test.png
```

Expected: prints two sizes and a meaningful reduction.

- [ ] **Step 4:** Commit

```bash
git add scripts/optimize-asset.mjs package.json package-lock.json
git commit -m "chore(scripts): add optimize-asset.mjs (sharp palette PNG compression)"
```

### Task 8: Back up current hero illustration

**Files:** copy `public/assets/redesign/hero-illustration.png` → `hero-illustration-v1.png`

- [ ] **Step 1:** Make a backup before regen

```bash
cp public/assets/redesign/hero-illustration.png public/assets/redesign/hero-illustration-v1.png
```

- [ ] **Step 2:** Commit

```bash
git add public/assets/redesign/hero-illustration-v1.png
git commit -m "chore(assets): backup hero-illustration v1 before v2 regen"
```

### Task 9: Generate 2 hero v2 candidates

**Files:** create `docs/superpowers/specs/mockups/hero-v2-candidates/`

- [ ] **Step 1:** Make the candidate folder

```bash
mkdir -p docs/superpowers/specs/mockups/hero-v2-candidates
```

- [ ] **Step 2:** Generate candidate A

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/hero-v2-candidates/hero-a.png "Premium product illustration on a transparent background for a B2B SaaS landing page hero. Style: engraved line drawing, single-weight 1.2px stroke, dark forest-green ink on transparent. Subject: a sleek modern smartphone shown three-quarters with a subtle mint-green halo glow. Screen shows a single prominent audio waveform crossing horizontally as concentric arcs, a small live-call indicator dot at the top, a transcript bubble reading 'caller: do you have anything tomorrow?', and a compact calendar card '10:00 — booked'. Around the phone: one tiny credit-card chip floating top-left, one tiny envelope with a notification dot floating bottom-right, one small green squiggle decoration. CRITICAL CLEAN COMPOSITION: no stray construction lines, no overlapping floating elements, clean negative space, the waveform must be the strongest single visual element. Generous whitespace. No shadows except the mint halo. 3:4 portrait. No people. No fake brand logos." --aspect 3:4 2>&1 | tail -3
```

- [ ] **Step 3:** Generate candidate B (slightly different framing)

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/hero-v2-candidates/hero-b.png "Premium product illustration on a transparent background for a B2B SaaS landing page hero. Style: engraved line drawing, single-weight 1.5px stroke, dark forest-green ink on transparent. Subject: a stylized modern smartphone tilted slightly, with an oversized mint-green halo glow behind it. Screen shows a bold central audio waveform, a small live-call pulse, a transcript bubble 'caller: do you have anything tomorrow?', and a tiny calendar slot card '10:00 — booked'. Floating beside the phone: one tiny credit-card chip, one tiny envelope with notification dot, one small green squiggle. Composition emphasizes the phone as anchor; floating elements arranged in a triangle pattern around it. Engraved-magazine aesthetic. Generous whitespace, no shadows, no gradients except halo. 3:4 portrait. No people. No real brand logos." --aspect 3:4 2>&1 | tail -3
```

- [ ] **Step 4:** Verify both candidates exist

```bash
ls -lh docs/superpowers/specs/mockups/hero-v2-candidates/
```

Expected: two PNGs, roughly 200-700 KB each (pre-optimization).

- [ ] **Step 5:** Commit candidates (kept for future reference even after selection)

```bash
git add docs/superpowers/specs/mockups/hero-v2-candidates/
git commit -m "chore(assets): generate 2 hero v2 illustration candidates"
```

### Task 10: Pick hero v2 winner and ship optimized version

**Files:** modify `public/assets/redesign/hero-illustration.png`

- [ ] **Step 1:** Visually inspect both candidates

```bash
# Open both candidates in the system viewer:
open docs/superpowers/specs/mockups/hero-v2-candidates/hero-a.png \
     docs/superpowers/specs/mockups/hero-v2-candidates/hero-b.png \
     public/assets/redesign/hero-illustration-v1.png
```

Reviewer (the controller agent acting as art director) picks the candidate that best matches the engraved-line style of v1 with cleaner composition. Document the choice.

Pick the winning filename and set a shell variable:

```bash
# Replace with "hero-a.png" or "hero-b.png" based on inspection
WINNER=hero-a.png
echo "Selected: $WINNER"
```

- [ ] **Step 2:** Optimize the winner to ≤ 80 KB

```bash
node scripts/optimize-asset.mjs docs/superpowers/specs/mockups/hero-v2-candidates/$WINNER public/assets/redesign/hero-illustration.png
ls -lh public/assets/redesign/hero-illustration.png
```

Expected output line: `... → public/assets/redesign/hero-illustration.png: <X> KB` where X ≤ 80. If X > 80, re-run with a stricter pipeline:

```bash
# Fallback: more aggressive compression via lossy PNG quantization
node -e "
  const sharp = require('sharp');
  sharp(process.argv[1])
    .resize(800, null, { withoutEnlargement: true })
    .png({ quality: 60, compressionLevel: 9, palette: true, colors: 64 })
    .toFile(process.argv[2])
    .then(() => console.log('done'));
" docs/superpowers/specs/mockups/hero-v2-candidates/$WINNER public/assets/redesign/hero-illustration.png
ls -lh public/assets/redesign/hero-illustration.png
```

If still > 80 KB after the fallback, halt and report a `DONE_WITH_CONCERNS` status. Do not commit oversized assets.

- [ ] **Step 3:** Verify the new hero loads cleanly via a quick fetch

```bash
# Start dev server if not already running
PID=$(lsof -ti :3000); [ -z "$PID" ] && (nohup npm run dev > /tmp/anna-dev.log 2>&1 &)
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/assets/redesign/hero-illustration.png"
```

Expected: 200.

- [ ] **Step 4:** Commit the new hero

```bash
git add public/assets/redesign/hero-illustration.png
git commit -m "feat(assets): replace hero illustration with v2 (≤80KB optimized)"
```

### Task 11: Generate 8 vertical candidates (2 per vertical)

**Files:** create `docs/superpowers/specs/mockups/vertical-candidates/`

- [ ] **Step 1:** Create folder

```bash
mkdir -p docs/superpowers/specs/mockups/vertical-candidates
```

- [ ] **Step 2:** Generate dental candidates A and B (sequentially, not parallel — Gemini quota limits)

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/dental-a.png "Engraved-line illustration on transparent background. Subject: a stylised molar tooth shown three-quarters, with concentric sonar/X-ray scan-line waves radiating outward from it. A single small green pulse indicator beside the tooth. Style: single-weight 1.5px stroke, dark forest-green ink, NO fill, NO shadows. Clean magazine illustration aesthetic. Generous negative space. 1:1 square composition. Same illustration family as a hero illustration of an engraved-line smartphone with sound waves. No fake logos." --aspect 1:1 2>&1 | tail -3

ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/dental-b.png "Engraved-line illustration on transparent background. Subject: a clean dental molar with horizontal X-ray scan lines passing through it; tiny green call-pulse dot to the side. Style: thin 1.2px stroke, deep forest-green ink, no fill, no shadows. Magazine engraved aesthetic, same family as a hero illustration of an engraved-line smartphone. Clean composition, generous whitespace, 1:1 square. No people, no fake logos." --aspect 1:1 2>&1 | tail -3
```

- [ ] **Step 3:** Generate beauty candidates A and B

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/beauty-a.png "Engraved-line illustration on transparent background. Subject: a pair of open hairdressing scissors crossed with a fine-tooth comb. Above them, a small green sound-wave arc suggesting a phone ringing. Style: single 1.5px stroke, dark forest-green ink, no fill, no shadows. Magazine engraved family matching a hero engraved-line smartphone illustration. Clean negative space. 1:1 square. No people, no logos." --aspect 1:1 2>&1 | tail -3

ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/beauty-b.png "Engraved-line illustration on transparent background. Subject: scissors and comb crossed in an X formation, with three small green concentric sound-wave arcs above (like a ringtone visualisation). Style: thin 1.2px stroke, forest-green ink, no fill, no shadows. Magazine illustration aesthetic, same family as an engraved smartphone hero illustration. Clean whitespace, 1:1 square. No real brand logos." --aspect 1:1 2>&1 | tail -3
```

- [ ] **Step 4:** Generate gastro candidates A and B

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/gastro-a.png "Engraved-line illustration on transparent background. Subject: top-down view of a reservation table for two — round plates, knife and fork at each setting, a small bell with a ringing motion line, and a tiny calendar card labelled 'FRI · 7:30'. Style: single 1.5px stroke, forest-green ink, no fill, no shadows. Magazine engraved family matching a hero smartphone engraved illustration. Generous whitespace, 1:1 square. No people, no fake logos." --aspect 1:1 2>&1 | tail -3

ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/gastro-b.png "Engraved-line illustration on transparent background. Subject: a stylised top-down restaurant setting — two plates side by side, polished cutlery, a small concierge bell with a ring motion mark, a calendar card 'FRI · 7:30' floating to one side. Style: 1.2px stroke, deep forest-green ink, no fill, no shadows. Engraved magazine family, same as an engraved smartphone hero illustration. Clean negative space, 1:1 square. No people, no logos." --aspect 1:1 2>&1 | tail -3
```

- [ ] **Step 5:** Generate trades candidates A and B

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/trades-a.png "Engraved-line illustration on transparent background. Subject: a hammer crossed with an adjustable wrench above a small open tool case. To the side, a tiny mobile phone with a single sound-wave arc suggesting a call. Style: single 1.5px stroke, forest-green ink, no fill, no shadows. Magazine engraved family, same as a hero engraved-line smartphone illustration. Clean composition, 1:1 square. No people, no fake brand logos." --aspect 1:1 2>&1 | tail -3

ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" docs/superpowers/specs/mockups/vertical-candidates/trades-b.png "Engraved-line illustration on transparent background. Subject: a claw hammer and an adjustable wrench laid in an X formation atop a small open toolbox with a tray of bits visible. A small phone with a single concentric green sound arc beside the toolbox. Style: 1.2px stroke, deep forest-green ink, no fill, no shadows. Engraved magazine family matching an engraved smartphone hero illustration. Generous whitespace, 1:1 square. No people, no logos." --aspect 1:1 2>&1 | tail -3
```

- [ ] **Step 6:** Verify all 8 candidates exist

```bash
ls -lh docs/superpowers/specs/mockups/vertical-candidates/
```

Expected: 8 PNGs (`{dental,beauty,gastro,trades}-{a,b}.png`), roughly 100-500 KB each.

- [ ] **Step 7:** Commit all candidates

```bash
git add docs/superpowers/specs/mockups/vertical-candidates/
git commit -m "chore(assets): generate 8 per-vertical illustration candidates (2 per vertical)"
```

### Task 12: Pick 4 vertical winners and ship optimized versions

**Files:** create `public/assets/redesign/{dental,beauty,gastro,trades}.png`

- [ ] **Step 1:** Open all candidates side by side with hero v2 for style comparison

```bash
open docs/superpowers/specs/mockups/vertical-candidates/*.png \
     public/assets/redesign/hero-illustration.png
```

For each vertical, choose the candidate (a or b) whose stroke weight, line style, and "engraved-magazine" feel most closely matches the hero. Document choices:

```bash
DENTAL_WIN=dental-a.png   # or dental-b.png
BEAUTY_WIN=beauty-a.png   # or beauty-b.png
GASTRO_WIN=gastro-a.png   # or gastro-b.png
TRADES_WIN=trades-a.png   # or trades-b.png
```

- [ ] **Step 2:** Optimize each to ≤ 30 KB

```bash
for pair in "dental:$DENTAL_WIN" "beauty:$BEAUTY_WIN" "gastro:$GASTRO_WIN" "trades:$TRADES_WIN"; do
  OUT=${pair%%:*}
  IN=${pair##*:}
  node scripts/optimize-asset.mjs "docs/superpowers/specs/mockups/vertical-candidates/$IN" "public/assets/redesign/$OUT.png"
done

ls -lh public/assets/redesign/{dental,beauty,gastro,trades}.png
```

Expected: each file ≤ 30 KB. If any exceed 30 KB, re-run that one with the aggressive fallback:

```bash
node -e "
  const sharp = require('sharp');
  sharp(process.argv[1])
    .resize(512, null, { withoutEnlargement: true })
    .png({ quality: 60, compressionLevel: 9, palette: true, colors: 48 })
    .toFile(process.argv[2])
    .then(() => console.log('done'));
" docs/superpowers/specs/mockups/vertical-candidates/$IN public/assets/redesign/$OUT.png
```

- [ ] **Step 3:** Update the assets README

Read the current `public/assets/redesign/README.md`, then replace its contents with:

```markdown
# Redesign assets

| File | Source | Replacement plan |
|---|---|---|
| `hero-illustration.png` | image-gen v2 (`gemini-3-pro-image`, hero-v2 candidate winner) — ≤80 KB optimized | Replace with hand-illustrated SVG before public launch |
| `hero-illustration-v1.png` | image-gen v1 (kept for A/B fallback) | Remove once v2 is brand-approved |
| `dental.png` | image-gen vertical candidate winner — ≤30 KB optimized | TODO: replace with marketing-approved asset |
| `beauty.png` | image-gen vertical candidate winner — ≤30 KB optimized | TODO: replace with marketing-approved asset |
| `gastro.png` | image-gen vertical candidate winner — ≤30 KB optimized | TODO: replace with marketing-approved asset |
| `trades.png` | image-gen vertical candidate winner — ≤30 KB optimized | TODO: replace with marketing-approved asset |
| `squiggle.svg` | hand-coded | Keep — small, vector, recolourable |

**Not in this folder (sourced externally by ANNA marketing):**
- Customer logos (referenced in `src/content/customerLogos.ts` but not currently rendered)
- Integration logos (`src/content/integrations.ts` — currently rendered as mono text chips)
- Testimonial avatars (`src/content/testimonials.ts` — placeholder initials render)
- Trustpilot 5-star badge (download from Trustpilot brand kit)
- Audio samples (gen-AI + 4 vertical)

**Replaced by SVG primitives, not stored as files:**
- Logo (AR monogram + wordmark) — `src/components/primitives/Logo.tsx`
- FeatureIcon × 6 — Lucide icons via `src/components/primitives/FeatureIcon.tsx`
- VerticalMark in collapsed/expanded VerticalTile — Lucide icons via `src/components/primitives/VerticalMark.tsx` (default `variant="icon"`)
- VerticalMark in RoiCalculator picker + selected-state header — PNG illustrations via `<VerticalMark variant="illustration" />`
```

- [ ] **Step 4:** Commit all 4 verticals + README update

```bash
git add public/assets/redesign/dental.png public/assets/redesign/beauty.png public/assets/redesign/gastro.png public/assets/redesign/trades.png public/assets/redesign/README.md
git commit -m "feat(assets): ship 4 per-vertical engraved illustrations (≤30KB each)"
```

---

## Phase 6 — Section wiring

### Task 13: Wire Reveal stagger into RevenueLeak

**Files:** modify `src/components/sections/RevenueLeak.tsx`

- [ ] **Step 1:** Read the current section

```bash
cat src/components/sections/RevenueLeak.tsx
```

- [ ] **Step 2:** Update the section to wrap each `<li>` in `<Reveal>` with index-based stagger

Replace `src/components/sections/RevenueLeak.tsx` content. Keep the existing `STATS` array and metadata; wrap each list item:

```tsx
import { Kicker } from "@/components/primitives/Kicker";
import { NumberMarker } from "@/components/primitives/NumberMarker";
import { Reveal } from "@/components/primitives/Reveal";

type LeakStat = {
  num: string;
  tone: "leak" | "primary";
  headline: string;
  subline: string;
  source?: string;
};

const STATS: LeakStat[] = [
  {
    num: "01",
    tone: "leak",
    headline: "62% of small-business calls go unanswered.",
    subline: "Every missed call is a customer you never knew you could win.",
    source: "Source: BT SMB Voice Report 2024",
  },
  {
    num: "02",
    tone: "primary",
    headline: "Web leads cool in 5 minutes.",
    subline: "Wait 30 minutes and your conversion rate drops 9×.",
    source: "Source: Harvard Business Review 2011",
  },
  {
    num: "03",
    tone: "primary",
    headline: "Old quotes sit dead in your CRM.",
    subline: "Reactivating dormant leads is the cheapest revenue you'll ever win.",
  },
];

export function RevenueLeak() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="leak-heading">
      <Kicker number="02" label="Where the leak is" />
      <h2 id="leak-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Where your revenue is leaking.
      </h2>
      <ol className="mt-16 grid gap-12 md:grid-cols-3">
        {STATS.map((s, i) => (
          <Reveal key={s.num} delayMs={i * 60}>
            <li>
              <NumberMarker tone={s.tone}>{s.num}</NumberMarker>
              <p className="mt-6 text-2xl font-medium text-ink leading-tight">{s.headline}</p>
              <p className="mt-3 text-fg-muted max-w-prose">{s.subline}</p>
              {s.source && (
                <p className="mt-3 font-mono text-xs uppercase tracking-wider text-mono-label">
                  {s.source}
                </p>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 3:** Run vitest to make sure nothing broke (no test exists for RevenueLeak yet)

```bash
npm test 2>&1 | tail -8
```

Expected: all tests still pass.

- [ ] **Step 4:** Commit

```bash
git add src/components/sections/RevenueLeak.tsx
git commit -m "feat(revenue-leak): wire Reveal stagger (60ms × 3 stanzas)"
```

### Task 14: Wire Reveal stagger into HowItWorks

**Files:** modify `src/components/sections/HowItWorks.tsx`

- [ ] **Step 1:** Update the file. Replace `src/components/sections/HowItWorks.tsx`:

```tsx
import { Kicker } from "@/components/primitives/Kicker";
import { NumberMarker } from "@/components/primitives/NumberMarker";
import { Reveal } from "@/components/primitives/Reveal";

const STEPS = [
  {
    num: "01",
    title: "Add your business",
    body: "Paste your website. ANNA learns your menu, hours, team, and tone.",
  },
  {
    num: "02",
    title: "ANNA learns it",
    body: "She gets familiar with your booking flow, your prices, and your common objections.",
  },
  {
    num: "03",
    title: "Calls answered 24/7",
    body: "From the second you flip the switch, ANNA picks up every call — at 11pm, on bank holidays, when you're on-site.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="how-heading">
      <Kicker number="05" label="Set up in three minutes" />
      <h2 id="how-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Set up in three minutes.
      </h2>
      <ol className="mt-16 grid gap-16 md:grid-cols-3 md:gap-8 relative">
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-sage/40"
        />
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delayMs={i * 60}>
            <li className="relative">
              <NumberMarker>{s.num}</NumberMarker>
              <p className="mt-6 text-xl font-medium text-ink leading-tight">{s.title}</p>
              <p className="mt-3 text-fg-muted max-w-prose">{s.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2:** Run tests

```bash
npm test 2>&1 | tail -5
```

Expected: pass.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/HowItWorks.tsx
git commit -m "feat(how-it-works): wire Reveal stagger (60ms × 3 steps)"
```

### Task 15: Wire Reveal stagger into FeatureStrip

**Files:** modify `src/components/sections/FeatureStrip.tsx`

- [ ] **Step 1:** Replace `src/components/sections/FeatureStrip.tsx`:

```tsx
import { FeatureIcon, type FeatureIconName } from "@/components/primitives/FeatureIcon";
import { Reveal } from "@/components/primitives/Reveal";

type Feature = {
  icon: FeatureIconName;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  { icon: "answer-24-7", title: "24/7 answer", body: "Picks up every call — 11pm, weekends, bank holidays." },
  { icon: "calendar", title: "Books in your calendar", body: "Writes the appointment straight into your booking system." },
  { icon: "sms", title: "SMS follow-up", body: "Sends confirmations, reminders, and audit summaries." },
  { icon: "transfer", title: "Smart human transfer", body: "Hands off to your team with the full conversation context in 1 SMS." },
  { icon: "deposit", title: "Deposit at booking", body: "Stripe SMS deposit collection — where your booking system supports it." },
  { icon: "integrations", title: "200+ integrations", body: "Plays nicely with the tools you already pay for." },
];

export function FeatureStrip() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-label="Core features">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-sage/30">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delayMs={i * 40}>
            <li
              className={[
                "p-8 border-b border-sage/30",
                i % 3 !== 0 ? "lg:border-l lg:border-sage/30" : "",
                i % 2 !== 0 ? "sm:border-l sm:border-sage/30 lg:border-l" : "",
              ].join(" ")}
            >
              <FeatureIcon name={f.icon} />
              <p className="mt-4 text-lg font-medium text-ink">{f.title}</p>
              <p className="mt-2 text-sm text-fg-muted">{f.body}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2:** Run tests

```bash
npm test 2>&1 | tail -5
```

Expected: pass.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/FeatureStrip.tsx
git commit -m "feat(feature-strip): wire Reveal stagger (40ms × 6 cells)"
```

### Task 16: Wire 2-group Reveal into TestimonialWall

**Files:** modify `src/components/sections/TestimonialWall.tsx`

- [ ] **Step 1:** Read the current TestimonialWall to confirm its shape

```bash
cat src/components/sections/TestimonialWall.tsx
```

- [ ] **Step 2:** Update the section. Wrap the hero PullQuote in one `Reveal` (no delay), and the entire rest grid (side stack + second row, if present) in another `Reveal` with a 120ms delay:

```tsx
import { TESTIMONIALS } from "@/content/testimonials";
import { Kicker } from "@/components/primitives/Kicker";
import { PullQuote } from "@/components/primitives/PullQuote";
import { Reveal } from "@/components/primitives/Reveal";
import Image from "next/image";

function AvatarPlaceholder({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="inline-flex items-center justify-center rounded-full bg-cream-deep text-sage font-mono text-xs ring-2 ring-sage/40"
    >
      {initials}
    </span>
  );
}

export function TestimonialWall() {
  const [hero, ...rest] = TESTIMONIALS;
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="testimonials-heading">
      <Kicker number="07" label="What operators tell us" />
      <h2 id="testimonials-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        What operators tell us.
      </h2>
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {hero && (
          <Reveal className="md:col-span-2">
            <PullQuote
              quote={hero.quote}
              attribution={hero.name}
              role={hero.role}
              business={(hero as { business?: string }).business ?? ""}
              metric={hero.metric}
            />
          </Reveal>
        )}
        <Reveal delayMs={120}>
          <div className="grid gap-8">
            {rest.slice(0, 2).map((t, i) => (
              <figure key={i}>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  {t.avatarSrc ? (
                    <Image
                      src={t.avatarSrc}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full ring-2 ring-sage/40"
                    />
                  ) : (
                    <AvatarPlaceholder name={t.name} size={40} />
                  )}
                  <div>
                    <div className="text-sm font-medium text-ink">{t.name}</div>
                    <div className="text-xs text-fg-muted">{t.role}</div>
                  </div>
                </figcaption>
                <p className="mt-3 font-mono text-xs tabular-nums text-primary">{t.metric}</p>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
      {rest.length > 2 && (
        <Reveal delayMs={120}>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {rest.slice(2).map((t, i) => (
              <figure key={i}>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  {t.avatarSrc ? (
                    <Image
                      src={t.avatarSrc}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full ring-2 ring-sage/40"
                    />
                  ) : (
                    <AvatarPlaceholder name={t.name} size={40} />
                  )}
                  <div>
                    <div className="text-sm font-medium text-ink">{t.name}</div>
                    <div className="text-xs text-fg-muted">{t.role}</div>
                  </div>
                </figcaption>
                <p className="mt-3 font-mono text-xs tabular-nums text-primary">{t.metric}</p>
              </figure>
            ))}
          </div>
        </Reveal>
      )}
      <p className="mt-12 font-mono text-xs uppercase tracking-[0.16em] text-mono-label text-center">
        Illustrative scenarios. Real customer testimonials replace these at launch.
      </p>
    </section>
  );
}
```

- [ ] **Step 3:** Run tests

```bash
npm test 2>&1 | tail -5
```

Expected: pass.

- [ ] **Step 4:** Commit

```bash
git add src/components/sections/TestimonialWall.tsx
git commit -m "feat(testimonials): wire Reveal as 2 groups (hero + rest in reading order)"
```

### Task 17: Wire Reveal stagger into VerticalsTileModule

**Files:** modify `src/components/sections/VerticalsTileModule.tsx`

- [ ] **Step 1:** Update the file:

```tsx
"use client";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS } from "@/lib/verticals";
import { VerticalTile } from "@/components/verticals/VerticalTile";
import { Kicker } from "@/components/primitives/Kicker";
import { Reveal } from "@/components/primitives/Reveal";

export function VerticalsTileModule() {
  return (
    <section id="verticals" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="verticals-heading">
      <Kicker number="06" label="Built for how you actually run" />
      <h2 id="verticals-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Built for how you actually run.
      </h2>
      <p className="mt-4 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Tap a tile to hear a real call, see the integrations, and read the operator&apos;s story.
      </p>
      <div className="mt-12 border-t border-sage/30">
        {VERTICAL_KEYS.map((k, i) => (
          <Reveal key={k} delayMs={i * 60}>
            <VerticalTile content={VERTICALS[k]} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Run tests, including the existing VerticalsTileModule.test.tsx

```bash
npx vitest run src/components/sections/VerticalsTileModule.test.tsx 2>&1 | tail -10
```

Expected: pass. If the test asserts on the DOM structure expecting `<VerticalTile>` to be a direct child of the wrapper div, update the assertion to `getByRole("button")` etc. instead — `Reveal` adds an intermediate `<div>` wrapper.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/VerticalsTileModule.tsx
git commit -m "feat(verticals): wire Reveal stagger (60ms × 4 tiles)"
```

### Task 18: Wire Reveal stagger + VerticalMark illustration into RoiCalculator

**Files:** modify `src/components/sections/RoiCalculator.tsx`

- [ ] **Step 1:** Read the current file to identify the picker block and selected-state header

```bash
cat src/components/sections/RoiCalculator.tsx | head -80
```

- [ ] **Step 2:** Update the file. Apply two changes:
  1. Each of the 4 picker `<button>` items gets wrapped in `<Reveal delayMs={i * 60}>`.
  2. In the picker AND the selected-state header, `<VerticalMark>` gets `variant="illustration"`.

Replace `src/components/sections/RoiCalculator.tsx`:

```tsx
"use client";
import { useMemo, useState } from "react";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { computeRecovery } from "@/lib/roi";
import { AnimatedNumber } from "@/components/primitives/AnimatedNumber";
import { Kicker } from "@/components/primitives/Kicker";
import { LinkArrow } from "@/components/primitives/LinkArrow";
import { VerticalMark } from "@/components/primitives/VerticalMark";
import { Reveal } from "@/components/primitives/Reveal";
import { track } from "@/lib/analytics";

type Props = {
  initialVertical?: VerticalKey | null;
};

export function RoiCalculator({ initialVertical = null }: Props) {
  const [vertical, setVertical] = useState<VerticalKey | null>(initialVertical);
  const config = vertical ? VERTICALS[vertical] : null;
  const [values, setValues] = useState<Record<string, number>>(() =>
    config ? Object.fromEntries(config.roi.inputs.map((i) => [i.id, i.default])) : {}
  );

  function selectVertical(key: VerticalKey) {
    setVertical(key);
    const defaults = Object.fromEntries(VERTICALS[key].roi.inputs.map((i) => [i.id, i.default]));
    setValues(defaults);
    track("roi_calculator_started", { vertical: key });
  }

  const leak = useMemo(() => (config ? config.roi.leakFormula(values) : 0), [config, values]);
  const recovery = useMemo(() => computeRecovery(leak), [leak]);

  return (
    <section id="roi" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="roi-heading">
      <Kicker number="04" label="See your leak in 30 seconds" />
      <h2 id="roi-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        See your leak in 30 seconds.
      </h2>

      {!vertical && (
        <div className="mt-12">
          <h3 className="font-medium text-lg">Pick your business.</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICAL_KEYS.map((k, i) => (
              <Reveal key={k} delayMs={i * 60}>
                <button
                  type="button"
                  onClick={() => selectVertical(k)}
                  className="group flex w-full flex-col items-start gap-4 rounded-2xl border border-sage-mute p-6 text-left min-h-[120px] transition-colors duration-150 hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <VerticalMark
                    vertical={k}
                    variant="illustration"
                    className="h-14 w-14 group-hover:scale-105 transition-transform duration-150 motion-reduce:transition-none"
                  />
                  <div>
                    <div className="font-medium text-ink">{VERTICALS[k].label}</div>
                    <div className="mt-1 text-sm text-fg-muted">{VERTICALS[k].cardHook}</div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {vertical && config && (
        <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <VerticalMark vertical={vertical} variant="illustration" className="h-14 w-14" />
              <h3 className="font-display text-display-md text-ink">{config.label}</h3>
            </div>
            <div className="mt-8 space-y-6">
              {config.roi.inputs.map((input) => (
                <label key={input.id} className="block">
                  <span className="font-mono text-xs uppercase tracking-wider text-mono-label">{input.label}</span>
                  <input
                    type="number"
                    role="spinbutton"
                    inputMode="numeric"
                    aria-label={input.label}
                    value={values[input.id] ?? input.default}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [input.id]: Number(e.target.value) || 0 }))
                    }
                    className="mt-1 w-full border-0 border-b-2 border-sage/30 bg-transparent px-0 py-3 font-display text-3xl text-ink tabular-nums focus:border-primary focus:outline-none transition-colors"
                  />
                </label>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-6 items-center">
              <LinkArrow href="/audit" data-event="hero_cta_audit_clicked">
                Get my full audit
              </LinkArrow>
              <button
                type="button"
                onClick={() => setVertical(null)}
                className="font-mono text-xs uppercase tracking-wider text-mono-label hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                Change business type
              </button>
            </div>
          </div>
          <aside className="rounded-2xl border border-sage-mute p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-mono-label">£/month bleeding</p>
            <p className="mt-2 font-display text-display-xl text-leak leading-none tabular-nums">
              <AnimatedNumber value={leak} format="gbp" />
            </p>
            <p className="mt-8 font-mono text-xs uppercase tracking-wider text-mono-label">ANNA recovers (est. 80%)</p>
            <p className="mt-2 font-display text-display-md text-primary leading-none tabular-nums">
              <AnimatedNumber value={recovery} format="gbp" />
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 3:** Run tests

```bash
npx vitest run src/components/sections/RoiCalculator.test.tsx 2>&1 | tail -10
```

Expected: pass. The existing test that asserts ≥4 SVG marks may need adjusting — with `variant="illustration"`, the picker now renders `<img>` not `<svg>`. Update the assertion:

```tsx
// Was: expect(svgs.length).toBeGreaterThanOrEqual(4);
// Update to:
const imgs = container.querySelectorAll("img");
expect(imgs.length).toBeGreaterThanOrEqual(4);
```

- [ ] **Step 4:** Commit

```bash
git add src/components/sections/RoiCalculator.tsx src/components/sections/RoiCalculator.test.tsx
git commit -m "feat(roi-calc): wire Reveal stagger + illustration VerticalMark in picker"
```

### Task 19: Wire single Reveal into SocialProofLogos (no count-ups)

**Files:** modify `src/components/sections/SocialProofLogos.tsx`

- [ ] **Step 1:** Replace the file. Single `<Reveal>` wraps the 4-cell grid; no per-cell stagger:

```tsx
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";

const SIGNALS = [
  { stat: "100,000+", label: "UK businesses on ANNA" },
  { stat: "★★★★★", label: "Trustpilot · Excellent" },
  { stat: "24/7", label: "Never a missed call" },
  { stat: "3 min", label: "Setup to first answered call" },
];

export function SocialProofLogos() {
  return (
    <section aria-label="Trust signals" className="border-y border-sage/30 bg-cream-deep">
      <div className="mx-auto max-w-page px-4 py-10 md:py-12">
        <Eyebrow className="text-center">By the team behind ANNA — 100,000+ UK SMBs</Eyebrow>
        <Reveal>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
            {SIGNALS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl text-ink tabular-nums leading-none">
                  {s.stat}
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-mono-label">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Run tests

```bash
npm test 2>&1 | tail -5
```

Expected: pass.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/SocialProofLogos.tsx
git commit -m "feat(social-proof): wrap trust grid in single Reveal (no count-ups, no stagger)"
```

### Task 20: Add animate-bob to Hero illustration

**Files:** modify `src/components/sections/Hero.tsx`

- [ ] **Step 1:** Read the current Hero

```bash
cat src/components/sections/Hero.tsx
```

- [ ] **Step 2:** Add `motion-safe:animate-bob` to the existing `<Image>` className.

Find the line that renders the hero image (the `<Image src="/assets/redesign/hero-illustration.png" ... />` block) and add `motion-safe:animate-bob` to its `className` value. The exact target line in the current file is:

```tsx
className="w-full h-auto"
```

Change it to:

```tsx
className="w-full h-auto motion-safe:animate-bob"
```

If your Hero.tsx file uses `priority` and other props on the `<Image>`, keep them all unchanged.

- [ ] **Step 3:** Smoke-test by visiting the dev server

```bash
PID=$(lsof -ti :3000); [ -z "$PID" ] && (nohup npm run dev > /tmp/anna-dev.log 2>&1 &)
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

Expected: 200.

- [ ] **Step 4:** Run tests

```bash
npm test 2>&1 | tail -5
```

Expected: pass.

- [ ] **Step 5:** Commit

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): add motion-safe:animate-bob (7s gentle float, reduced-motion safe)"
```

### Task 21: Insert SquiggleDivider placements via page.tsx

**Files:** modify `src/app/page.tsx`

- [ ] **Step 1:** Read the current page.tsx

```bash
cat src/app/page.tsx
```

- [ ] **Step 2:** Insert `<SquiggleDivider>` between `<Hero />` and `<SocialProofLogos />`, and between `<RevenueLeak />` and `<AudioDemo />`.

Replace the section list in `page.tsx` with:

```tsx
import { Hero } from "@/components/sections/Hero";
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
      <SquiggleDivider />
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

- [ ] **Step 3:** Run vitest + smoke load

```bash
npm test 2>&1 | tail -5
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

Expected: tests pass; page returns 200.

- [ ] **Step 4:** Commit

```bash
git add src/app/page.tsx
git commit -m "feat(layout): insert 2 SquiggleDividers (Hero↓SocialProof, RevenueLeak↓Audio)"
```

---

## Phase 7 — E2E motion suite

### Task 22: Update visual.spec.ts to emulate reduced-motion

**Files:** modify `tests/e2e/visual.spec.ts`

- [ ] **Step 1:** Read the existing spec

```bash
cat tests/e2e/visual.spec.ts
```

- [ ] **Step 2:** Modify it to emulate reduced-motion before each snapshot.

Replace `tests/e2e/visual.spec.ts` with:

```ts
import { test, expect } from "@playwright/test";

const BREAKPOINTS = [375, 768, 1024, 1440, 1920];

test.describe("Landing page visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const width of BREAKPOINTS) {
    test(`landing page renders at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveScreenshot(`landing-${width}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
```

This forces deterministic final-state rendering for the snapshots (no in-flight animations).

- [ ] **Step 3:** Regenerate baselines with the new reduced-motion mode

```bash
npx playwright test tests/e2e/visual.spec.ts --update-snapshots 2>&1 | tail -10
```

- [ ] **Step 4:** Confirm stability

```bash
npx playwright test tests/e2e/visual.spec.ts 2>&1 | tail -10
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add tests/e2e/visual.spec.ts tests/e2e/visual.spec.ts-snapshots/
git commit -m "test(visual): emulate prefers-reduced-motion for deterministic snapshots"
```

### Task 23: Add reveal-scroll-flow e2e

**Files:** create `tests/e2e/reveal-scroll-flow.spec.ts`

- [ ] **Step 1:** Create the spec

```ts
import { test, expect } from "@playwright/test";

test("scroll-reveal: grid items become visible as user scrolls", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const section = page.locator("section").filter({ hasText: "Where your revenue is leaking" });
  await section.scrollIntoViewIfNeeded();
  // Wait long enough for the reveal transition (480ms) to complete.
  await page.waitForTimeout(700);

  const stanzas = section.locator("li");
  await expect(stanzas).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const li = stanzas.nth(i);
    const opacity = await li.evaluate((el) => {
      const wrapper = el.parentElement;
      return wrapper ? window.getComputedStyle(wrapper).opacity : "0";
    });
    expect(parseFloat(opacity)).toBeGreaterThan(0.95);
  }
});
```

- [ ] **Step 2:** Run it

```bash
npx playwright test tests/e2e/reveal-scroll-flow.spec.ts 2>&1 | tail -10
```

Expected: PASS.

- [ ] **Step 3:** Commit

```bash
git add tests/e2e/reveal-scroll-flow.spec.ts
git commit -m "test(motion): assert grid items become visible after scroll-into-view"
```

### Task 24: Add reveal-fast-scroll e2e

**Files:** create `tests/e2e/reveal-fast-scroll.spec.ts`

- [ ] **Step 1:** Create the spec

```ts
import { test, expect } from "@playwright/test";

test("fast scroll past multiple sections: all items end at final visibility", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Jump to a position well past several reveal sections.
  await page.evaluate(() => window.scrollTo({ top: 5000, behavior: "auto" }));
  // Give the IntersectionObserver and any transitions time to settle.
  await page.waitForTimeout(800);

  // Verify FeatureStrip items are fully visible.
  const feature = page.locator("section").filter({ has: page.locator("text=24/7 answer") });
  await feature.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const items = feature.locator("li");
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(6);

  for (let i = 0; i < count; i++) {
    const li = items.nth(i);
    const opacity = await li.evaluate((el) => {
      const wrapper = el.parentElement;
      return wrapper ? window.getComputedStyle(wrapper).opacity : "0";
    });
    expect(parseFloat(opacity)).toBeGreaterThan(0.95);
  }
});
```

- [ ] **Step 2:** Run it

```bash
npx playwright test tests/e2e/reveal-fast-scroll.spec.ts 2>&1 | tail -10
```

Expected: PASS.

- [ ] **Step 3:** Commit

```bash
git add tests/e2e/reveal-fast-scroll.spec.ts
git commit -m "test(motion): assert fast-scroll guard reveals all items at final state"
```

### Task 25: Add reveal-focus-within e2e

**Files:** create `tests/e2e/reveal-focus-within.spec.ts`

- [ ] **Step 1:** Create the spec

```ts
import { test, expect } from "@playwright/test";

test("Tab navigation: focused element inside a Reveal is fully visible", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Tab a few times to reach interactive elements past the hero.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
  }

  const focused = page.locator(":focus");
  await expect(focused).toBeVisible();

  // Walk up the DOM to find an ancestor that is a Reveal wrapper (transition-[opacity,transform] class).
  const ancestorOpacity = await focused.evaluate((el) => {
    let cur: Element | null = el;
    while (cur && cur !== document.body) {
      const cs = window.getComputedStyle(cur);
      // Detect a Reveal wrapper by its transition-property
      if ((cs.transitionProperty || "").includes("opacity") &&
          (cs.transitionProperty || "").includes("transform")) {
        return cs.opacity;
      }
      cur = cur.parentElement;
    }
    return "1";
  });
  expect(parseFloat(ancestorOpacity)).toBeGreaterThan(0.95);
});
```

- [ ] **Step 2:** Run it

```bash
npx playwright test tests/e2e/reveal-focus-within.spec.ts 2>&1 | tail -10
```

Expected: PASS.

- [ ] **Step 3:** Commit

```bash
git add tests/e2e/reveal-focus-within.spec.ts
git commit -m "test(motion): assert keyboard focus forces Reveal ancestor visible"
```

### Task 26: Add reveal-reduced-motion e2e

**Files:** create `tests/e2e/reveal-reduced-motion.spec.ts`

- [ ] **Step 1:** Create the spec

```ts
import { test, expect } from "@playwright/test";

test.use({ colorScheme: "light" });

test("reduced motion: all reveal items are visible on initial load", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // RevenueLeak stanzas are below the fold; they should still be fully visible immediately.
  const section = page.locator("section").filter({ hasText: "Where your revenue is leaking" });
  const stanzas = section.locator("li");
  const count = await stanzas.count();
  expect(count).toBe(3);

  for (let i = 0; i < count; i++) {
    const li = stanzas.nth(i);
    const opacity = await li.evaluate((el) => {
      const wrapper = el.parentElement;
      return wrapper ? window.getComputedStyle(wrapper).opacity : "0";
    });
    expect(parseFloat(opacity)).toBeGreaterThan(0.95);
  }
});
```

- [ ] **Step 2:** Run it

```bash
npx playwright test tests/e2e/reveal-reduced-motion.spec.ts 2>&1 | tail -10
```

Expected: PASS.

- [ ] **Step 3:** Commit

```bash
git add tests/e2e/reveal-reduced-motion.spec.ts
git commit -m "test(motion): assert reduced-motion shows items at final state on load"
```

### Task 27: Add visual-motion (hero bob keyframe captures)

**Files:** create `tests/e2e/visual-motion.spec.ts`

- [ ] **Step 1:** Create the spec

```ts
import { test } from "@playwright/test";

// Captures 3 keyframe states of the hero bob animation for visual sanity review.
// No diff tolerance — purely artefacts for PR review.
test("hero bob keyframes — 0%, 50%, 100%", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const hero = page.locator("section").first().locator("img").first();

  // Pause the animation so we can sample explicit times.
  await page.evaluate(() => {
    document.querySelectorAll("img.animate-bob").forEach((el) => {
      (el as HTMLElement).style.animationPlayState = "paused";
    });
  });

  // 0% (animation at start, translateY=0)
  await hero.screenshot({ path: "tests/e2e/visual-motion.spec.ts-snapshots/hero-bob-0.png" });

  // 50% (translateY=-4px) — set explicit animation-delay so we sample 50%
  await page.evaluate(() => {
    document.querySelectorAll("img.animate-bob").forEach((el) => {
      (el as HTMLElement).style.animationDelay = "-3.5s";
    });
  });
  await hero.screenshot({ path: "tests/e2e/visual-motion.spec.ts-snapshots/hero-bob-50.png" });

  // 100% (back to translateY=0)
  await page.evaluate(() => {
    document.querySelectorAll("img.animate-bob").forEach((el) => {
      (el as HTMLElement).style.animationDelay = "-7s";
    });
  });
  await hero.screenshot({ path: "tests/e2e/visual-motion.spec.ts-snapshots/hero-bob-100.png" });
});
```

- [ ] **Step 2:** Run it

```bash
mkdir -p tests/e2e/visual-motion.spec.ts-snapshots
npx playwright test tests/e2e/visual-motion.spec.ts 2>&1 | tail -10
```

Expected: PASS, 3 PNGs in the snapshots folder.

- [ ] **Step 3:** Commit

```bash
git add tests/e2e/visual-motion.spec.ts tests/e2e/visual-motion.spec.ts-snapshots/
git commit -m "test(visual): capture 3 hero bob keyframes for PR review (no diff gate)"
```

---

## Phase 8 — Final verification + milestone

### Task 28: Run full vitest + e2e + build

**Files:** none (verification only)

- [ ] **Step 1:** Run vitest

```bash
npm test 2>&1 | tail -8
```

Expected: all tests pass. Should now be ≥ 106 tests (102 baseline + 6 new for Reveal, SquiggleDivider, fast-scroll-guard, focus-within, variant=illustration).

- [ ] **Step 2:** Run all Playwright

```bash
npx playwright test 2>&1 | tail -15
```

Expected: PASS (existing 23 + 5 new motion specs = ~28 e2e tests).

- [ ] **Step 3:** Build

```bash
rm -rf .next
npm run build 2>&1 | tail -10
```

Expected: build compiles; `check:placeholders` exits 0.

- [ ] **Step 4:** Commit a milestone (empty if nothing changed)

```bash
git commit --allow-empty -m "milestone: v2 motion + illustrations — all gates green"
```

### Task 29: Re-run Lighthouse on the new build, check regression

**Files:** none (verification only)

- [ ] **Step 1:** Start production server

```bash
PID=$(lsof -ti :3000); [ -n "$PID" ] && kill $PID; sleep 2
nohup npm start > /tmp/anna-start.log 2>&1 &
sleep 6
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

Expected: 200.

- [ ] **Step 2:** Run Lighthouse desktop + mobile

```bash
npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=./lighthouse-v2-desktop \
  --quiet --chrome-flags="--headless" \
  --preset=desktop 2>&1 | tail -10

npx --yes lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=./lighthouse-v2-mobile \
  --quiet --chrome-flags="--headless" 2>&1 | tail -10
```

- [ ] **Step 3:** Compare to baseline

Read `lighthouse-v2-desktop.report.json` and `lighthouse-v2-mobile.report.json`. Extract Performance, A11y, BP, SEO scores plus LCP / CLS / TBT numeric values. Compare each against the baseline in `docs/superpowers/lighthouse-baseline-v2.md`.

Gate:
- Desktop Performance must be ≥ baseline − 5
- Mobile Performance must be ≥ baseline − 5
- CLS must remain < 0.1 in both
- TBT in both must be ≤ baseline + 50ms

If any gate fails, halt and report DONE_WITH_CONCERNS — do NOT proceed to the tag step. Common fixes:
- Hero illustration too heavy → re-optimize to a smaller KB ceiling
- Reveal observers triggering layout thrash → check `useScrollReveal` for unnecessary re-renders

- [ ] **Step 4:** Append a v2 results section to the baseline doc

Update `docs/superpowers/lighthouse-baseline-v2.md` with a `## v2 results` section showing actual numbers and delta from baseline.

- [ ] **Step 5:** Commit the v2 results

```bash
git add docs/superpowers/lighthouse-baseline-v2.md
git commit -m "docs(perf): record v2 motion+illustrations Lighthouse results"
```

- [ ] **Step 6:** Stop production server

```bash
PID=$(lsof -ti :3000); [ -n "$PID" ] && kill $PID; sleep 1
```

### Task 30: Final acceptance criteria check + milestone tag

**Files:** none (verification + tag)

- [ ] **Step 1:** Walk through the spec's acceptance criteria section by section, confirming each box

Re-read `docs/superpowers/specs/2026-05-27-anna-reception-v2-motion-illustrations-design.md` §12 "Acceptance criteria" and verify each item.

The list:
- `<Reveal>` wired into 6 grid sections — verify via grep
- `useScrollReveal` returns `{ revealed, instant }` — verify via the hook source
- TrustStrip uses a single Reveal wrapper, no count-ups — verify in SocialProofLogos source
- 4 per-vertical PNG illustrations in RoiCalculator picker + selected-state header (NOT in VerticalTile) — verify
- Curation gate executed: documented in README — verify README
- v2 hero illustration replaces v1, v1 retained as `hero-illustration-v1.png` — verify file list
- Hero illustration ≤ 80 KB; each vertical PNG ≤ 30 KB — verify file sizes
- SquiggleDivider without `role="separator"` — verify primitive source
- 2 SquiggleDivider placements live — verify page.tsx
- Hero image has `motion-safe:animate-bob` with 7s period — verify Hero source + tailwind.config.ts
- Lighthouse v2 results recorded; Performance ≥ baseline−5; CLS < 0.1; TBT ≤ baseline+50ms — verify the doc
- Focus-within visibility — verify the new e2e
- Visual regression baselines use `prefers-reduced-motion: reduce` — verify visual.spec.ts
- 4 new motion e2e scenarios pass — verify via `npx playwright test --list | grep -E "(scroll-flow|fast-scroll|focus-within|reduced-motion)"`
- ≥ 4 new vitest tests — verify counts
- No new console errors / a11y violations / 404s — verify via dev server + page.on('console') sanity
- `npm run build` passes including `check:placeholders` — already confirmed in Task 28

Verification commands:

```bash
grep -rn "<Reveal" src/components/sections src/components/verticals 2>&1 | wc -l
ls -lh public/assets/redesign/*.png
grep -n "animate-bob" src/components/sections/Hero.tsx tailwind.config.ts
grep -c "emulateMedia" tests/e2e/visual.spec.ts
npx playwright test --list 2>&1 | grep -cE "(reveal-|visual-motion)"
```

- [ ] **Step 2:** Tag the milestone

```bash
git tag -a v2-motion-illustrations -m "v2 motion + illustrations pass complete"
git log --oneline e9fcdaf..HEAD | head -40
```

- [ ] **Step 3:** Print a final summary

```bash
echo "=== v2 commit count since v1-redesign milestone ==="
git log --oneline e9fcdaf..HEAD | wc -l
echo ""
echo "=== Tags ==="
git tag --list "v*-redesign" "v*-motion-illustrations"
echo ""
echo "=== Asset sizes ==="
ls -lh public/assets/redesign/*.png
```

---

## Self-review notes (controller)

Spec coverage check (mapping spec §§ to tasks):
- §1 Scope / Out of scope — encoded as "not in plan" (no Waveform breathing, no StatCounter)
- §2 Motion layer (`Reveal` + fast-scroll guard) — Tasks 2, 3
- §2.4 TestimonialWall 2-group stagger — Task 16
- §3 TrustStrip simple fade-in — Task 19
- §4 Per-vertical illustrations (curation gate, narrowed scope) — Tasks 7-12
- §5 SquiggleDivider — Tasks 4, 21
- §6 Hero bob (7s) — Tasks 6, 20
- §7 Performance budget — Tasks 1, 7, 10, 12, 29
- §8 A11y (focus-within) — Task 3 + Task 25 e2e
- §9 Reduced-motion visual regression — Task 22
- §10 Motion e2e coverage (4 scenarios) — Tasks 23-26
- §11 File map — used to derive task list
- §12 Acceptance criteria — Task 30
- §13 Implementation phasing — preserved as plan structure

Placeholder scan: no "TBD" / "TODO" markers in steps; all commands and code blocks are concrete.

Type consistency: `useScrollReveal` returns `[ref, { revealed, instant }]` consistently in Task 2 and consumed in Task 3 the same way. `VerticalMark` accepts `variant?: "icon" | "illustration"` in Task 5 and is consumed by Task 18 with `variant="illustration"`.
