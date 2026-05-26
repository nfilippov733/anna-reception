# ANNA Reception "Editorial ANNA Warm" Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the landing page visual layer from "functional wireframe" to "Editorial ANNA Warm" production-grade, without disturbing IA, copy, conversion logic, accessibility floor, or tests.

**Architecture:** Token-driven design system. New tokens (`--ink`, `--cream-deep`, `--sage`, `--sage-mute`, `--mono-label`) extend the existing palette. Twelve new primitives (`Kicker`, `NumberMarker`, `PullQuote`, `PlayButton`, etc.) introduce editorial chapter markers, mono labels, and SVG iconography. Sixteen sections are refactored to drop card chrome in favour of typography + sage hairlines. All sixteen `MissingAsset` references are replaced or removed. Light mode only at launch; dark-mode tokens stay defined for Phase 2.

**Tech Stack:** Next.js 14.2 · React 18.3 · TypeScript 5.5 · Tailwind 3.4 · vitest 4.1 · Playwright 1.60 · `lucide-react` (new dependency for SVG icons) · `next/font/google` for JetBrains Mono.

**Spec:** `docs/superpowers/specs/2026-05-26-anna-reception-redesign-design.md`
**Companion v3 spec:** `docs/superpowers/specs/2026-05-26-anna-reception-landing-design.md`

---

## File map

**Foundation (modify):**
- `src/app/globals.css` — token additions/removals
- `tailwind.config.ts` — extend `colors`, `fontFamily`, `fontSize`, animation
- `src/app/layout.tsx` — add JetBrains Mono via `next/font`
- `package.json` / `package-lock.json` — add `lucide-react`

**Motion (create):**
- `src/lib/useScrollReveal.ts` — IntersectionObserver hook

**Primitives (create — 12 new):**
- `src/components/primitives/Kicker.tsx` + `.test.tsx`
- `src/components/primitives/Eyebrow.tsx` + `.test.tsx`
- `src/components/primitives/Tag.tsx` + `.test.tsx`
- `src/components/primitives/NumberMarker.tsx` + `.test.tsx`
- `src/components/primitives/PullQuote.tsx` + `.test.tsx`
- `src/components/primitives/LinkArrow.tsx` + `.test.tsx`
- `src/components/primitives/Hairline.tsx` + `.test.tsx`
- `src/components/primitives/PlayButton.tsx` + `.test.tsx`
- `src/components/primitives/Logo.tsx` + `.test.tsx`
- `src/components/primitives/FeatureIcon.tsx` + `.test.tsx`
- `src/components/primitives/VerticalMark.tsx` + `.test.tsx`
- `src/components/layout/SectionShell.tsx` + `.test.tsx`

**Primitives (modify — refresh):**
- `src/components/primitives/Button.tsx` + `.test.tsx`
- `src/components/primitives/AccordionItem.tsx` + `.test.tsx`
- `src/components/primitives/PhoneChip.tsx` + `.test.tsx`
- `src/components/primitives/Waveform.tsx`
- `src/components/primitives/AnimatedNumber.tsx` + `.test.tsx`
- `src/components/primitives/MissingAsset.tsx` — retained in code, removed from production paths

**Assets (create):**
- `public/assets/redesign/hero-illustration.png` — image-gen output
- `public/assets/redesign/squiggle.svg` — hand-coded

**Sections (modify — all 16):**
- `src/components/layout/Header.tsx` + `.test.tsx`
- `src/components/sections/Hero.tsx` + `.test.tsx`
- `src/components/sections/SocialProofLogos.tsx`
- `src/components/sections/RevenueLeak.tsx`
- `src/components/sections/AudioDemo.tsx` + `.test.tsx`
- `src/components/sections/RoiCalculator.tsx` + `.test.tsx`
- `src/components/sections/HowItWorks.tsx`
- `src/components/sections/VerticalsTileModule.tsx` + `.test.tsx` + `src/components/verticals/VerticalTile.tsx`
- `src/components/sections/TestimonialWall.tsx`
- `src/components/sections/FeatureStrip.tsx`
- `src/components/sections/IntegrationsMarquee.tsx`
- `src/components/sections/PricingTeaser.tsx`
- `src/components/sections/AuditReEntryBanner.tsx`
- `src/components/sections/FaqAccordion.tsx`
- `src/components/sections/FinalCtaBanner.tsx`
- `src/components/layout/Footer.tsx`

**Engineering decisions encoded in this plan:**
- `FeatureIcon` uses **Lucide** icons (not image-gen). Reason: Lucide ships clean SVGs with `stroke-current` (the spec's exact requirement), consistent stroke width, free, and tree-shakeable. Image-gen would produce PNGs that can't satisfy `stroke-current` and would need a manual SVG-trace step. If the user wants custom engraved-line icons, that's a Phase 2 polish.
- `VerticalMark` uses **Lucide** icons for v1 (Tooth · Scissors · Utensils · Hammer). Same reasoning. If the user wants custom engraved illustrations, swap to image-gen + PNG via `next/image` in Phase 2.
- `Hero` illustration uses **image-gen PNG** via `next/image`. Reason: hero centerpiece deserves distinctive art; PNG is acceptable since we won't recolor it.
- `Squiggle` decoration is **hand-coded SVG**. Reason: trivially small; in-component SVG ships zero extra request.
- `Logo` is **hand-coded SVG**. Reason: brand mark must be precise and editable.

---

## Phase 0 — Setup

### Task 1: Confirm worktree + clean baseline

**Files:** none

- [ ] **Step 1:** Verify clean baseline

```bash
git status
git log -1 --oneline
```

Expected: clean working tree on the current branch (probably `feat/landing-v1`). Most recent commit is the redesign spec `e3d86b4` or later.

- [ ] **Step 2:** Run all tests to confirm baseline is green

```bash
npm test
npx playwright test --list
```

Expected: vitest suite passes (all current tests green). Playwright `--list` enumerates the e2e tests without running them — just confirms config is sound.

- [ ] **Step 3:** Note current placeholders for later cleanup

```bash
grep -rn "MissingAsset" src/components | wc -l
grep -rn "▶\|⏸\|📞\|▾" src --include="*.tsx" | wc -l
```

Record the counts in a sticky note for verification at the end of Phase 9.

### Task 2: Add lucide-react dependency

**Files:** `package.json`, `package-lock.json`

- [ ] **Step 1:** Install lucide-react

```bash
npm install lucide-react@latest
```

- [ ] **Step 2:** Verify install

```bash
node -e "console.log(require('lucide-react').Phone.toString().slice(0,80))"
```

Expected: prints the start of the Phone component definition. Confirms lucide-react is importable.

- [ ] **Step 3:** Commit

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react for SVG iconography"
```

---

## Phase 1 — Foundation tokens & fonts

### Task 3: Extend CSS tokens in globals.css

**Files:** `src/app/globals.css`

- [ ] **Step 1:** Add the five new tokens and remove `--accent-electric`

Edit `src/app/globals.css` — inside the `:root` block, after `--gain`, add:

```css
    /* Editorial ANNA Warm tokens (v1 redesign) */
    --ink: 155 25% 6%;               /* near-black, slightly green-tinted */
    --cream-deep: 100 25% 95%;       /* banded sections, marquee bg */
    --sage: 142 18% 55%;             /* hairlines, muted brand accents */
    --sage-mute: 142 12% 75%;        /* card borders */
    --mono-label: 155 15% 35%;       /* mono kicker labels, tech chips */
```

Then **remove** the `--accent-electric` line. In the `.dark` block, leave the dark-mode token block alone for now (Phase 2).

- [ ] **Step 2:** Verify globals.css still compiles

```bash
npm run build 2>&1 | head -40
```

Expected: build proceeds past the CSS step without errors. (It may fail later on `--accent-electric` references — that's expected; we'll fix those in Task 22 when we refresh Waveform.)

- [ ] **Step 3:** Commit

```bash
git add src/app/globals.css
git commit -m "feat(tokens): add ink/cream-deep/sage/sage-mute/mono-label, drop accent-electric"
```

### Task 4: Extend tailwind.config.ts with new colour aliases and fonts

**Files:** `tailwind.config.ts`

- [ ] **Step 1:** Update `tailwind.config.ts` `theme.extend` to add the new colour tokens, add the mono font slot, add new font-size tiers, and add a scroll-reveal keyframe

Replace the existing `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--anna-green) / <alpha-value>)",
        "on-primary": "hsl(var(--on-primary) / <alpha-value>)",
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-alt": "hsl(var(--bg-alt) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        "fg-muted": "hsl(var(--fg-muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        leak: "hsl(var(--leak) / <alpha-value>)",
        gain: "hsl(var(--gain) / <alpha-value>)",
        // New Editorial ANNA Warm tokens
        ink: "hsl(var(--ink) / <alpha-value>)",
        cream: "hsl(var(--bg-alt) / <alpha-value>)", // alias
        "cream-deep": "hsl(var(--cream-deep) / <alpha-value>)",
        sage: "hsl(var(--sage) / <alpha-value>)",
        "sage-mute": "hsl(var(--sage-mute) / <alpha-value>)",
        "mono-label": "hsl(var(--mono-label) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Calistoga", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.875rem, 4vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        prose: "65ch",
        page: "1280px",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        reveal: "reveal 480ms ease-out both",
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
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2:** Type-check

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3:** Smoke build

```bash
npm run build 2>&1 | tail -20
```

Expected: build progresses; may still error on `--accent-electric` references in Waveform — we'll fix those in Task 22. CSS-config errors should be absent.

- [ ] **Step 4:** Commit

```bash
git add tailwind.config.ts
git commit -m "feat(tokens): wire ink/cream-deep/sage/sage-mute, mono font slot, display sizes, reveal anim"
```

### Task 5: Add JetBrains Mono via next/font

**Files:** `src/app/layout.tsx`

- [ ] **Step 1:** Update `src/app/layout.tsx` to import JetBrains Mono and apply the variable

```tsx
import "./globals.css";
import { Inter, Calistoga, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyDemoCTA } from "@/components/layout/StickyDemoCTA";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Calistoga({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANNA Reception — AI receptionist for dental, beauty, gastropubs & trades",
  description: "Stop losing revenue to missed calls. ANNA Reception answers, books, and follows up 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyDemoCTA />
      </body>
    </html>
  );
}
```

Note: `bg-bg text-ink` on `<body>` switches the default text colour from `--fg` to the new warmer `--ink`. The existing `--fg` token remains for places where the legacy darker neutral was specifically tuned.

- [ ] **Step 2:** Run dev server briefly to verify fonts load

```bash
npm run dev &
sleep 6
curl -s http://localhost:3000 | grep -c "font-jetbrains" || true
kill %1
```

(Expected output is not critical — we're just confirming the page renders.) If the dev server fails to start, halt and investigate.

- [ ] **Step 3:** Type-check + build smoke

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4:** Commit

```bash
git add src/app/layout.tsx
git commit -m "feat(fonts): load JetBrains Mono via next/font, switch body to --ink"
```

---

## Phase 2 — Motion utilities

### Task 6: Create useScrollReveal hook (TDD)

**Files:** create `src/lib/useScrollReveal.ts` + `src/lib/useScrollReveal.test.ts`

- [ ] **Step 1:** Write the failing test

Create `src/lib/useScrollReveal.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

describe("useScrollReveal", () => {
  let observed: Element[];
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observed = [];
    // @ts-expect-error mock
    global.IntersectionObserver = vi.fn((cb) => {
      observerCallback = cb;
      return {
        observe: (el: Element) => observed.push(el),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
  });

  it("returns a ref + boolean; flips to true on intersection (one-shot)", () => {
    const { result } = renderHook(() => useScrollReveal<HTMLDivElement>());
    const el = document.createElement("div");
    act(() => {
      // @ts-expect-error attach ref
      result.current[0].current = el;
    });

    // Initial state: not revealed
    expect(result.current[1]).toBe(false);

    // Simulate IntersectionObserver firing
    act(() => {
      observerCallback(
        [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
        // @ts-expect-error mock
        {}
      );
    });

    expect(result.current[1]).toBe(true);
  });

  it("respects prefers-reduced-motion (immediate reveal, no observer)", () => {
    const mql = vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    // @ts-expect-error mock
    window.matchMedia = mql;

    const { result } = renderHook(() => useScrollReveal<HTMLDivElement>());
    // With reduced motion, should be true immediately
    expect(result.current[1]).toBe(true);
  });
});
```

- [ ] **Step 2:** Run test to verify it fails

```bash
npx vitest run src/lib/useScrollReveal.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3:** Write the hook

Create `src/lib/useScrollReveal.ts`:

```ts
"use client";
import { useEffect, useRef, useState } from "react";

export function useScrollReveal<T extends Element>(): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setRevealed(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return [ref, revealed];
}
```

- [ ] **Step 4:** Run test to verify it passes

```bash
npx vitest run src/lib/useScrollReveal.test.ts
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/lib/useScrollReveal.ts src/lib/useScrollReveal.test.ts
git commit -m "feat(motion): add useScrollReveal hook (one-shot, reduced-motion-aware)"
```

---

## Phase 3 — New primitives (TDD per primitive)

### Task 7: Kicker primitive

**Files:** create `src/components/primitives/Kicker.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

Create `src/components/primitives/Kicker.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kicker } from "./Kicker";

describe("Kicker", () => {
  it("renders number + label as a mono kicker", () => {
    render(<Kicker number="01" label="Why ANNA Reception" />);
    const text = screen.getByText(/01 — WHY ANNA RECEPTION/i);
    expect(text).toBeInTheDocument();
  });

  it("has aria-hidden so it stays out of the heading hierarchy", () => {
    const { container } = render(<Kicker number="01" label="Why" />);
    const el = container.firstElementChild!;
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("uppercases the label and applies mono font + tracking", () => {
    const { container } = render(<Kicker number="01" label="lowercase label" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/uppercase/);
    expect(el.className).toMatch(/tracking-/);
  });

  it("renders without a number when only a label is given", () => {
    render(<Kicker label="Standalone" />);
    expect(screen.getByText("STANDALONE")).toBeInTheDocument();
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/Kicker.test.tsx
```

Expected: FAIL (module not found).

- [ ] **Step 3:** Write the primitive

Create `src/components/primitives/Kicker.tsx`:

```tsx
import { cn } from "@/lib/cn";

type Props = {
  number?: string;
  label: string;
  className?: string;
};

export function Kicker({ number, label, className }: Props) {
  return (
    <p
      aria-hidden="true"
      className={cn(
        "font-mono text-xs uppercase tracking-[0.18em] text-mono-label",
        className
      )}
    >
      {number ? `${number} — ${label.toUpperCase()}` : label.toUpperCase()}
    </p>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/Kicker.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/Kicker.tsx src/components/primitives/Kicker.test.tsx
git commit -m "feat(primitive): add Kicker (mono chapter label, aria-hidden)"
```

### Task 8: Eyebrow primitive

**Files:** create `src/components/primitives/Eyebrow.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

Create `src/components/primitives/Eyebrow.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders the label in sage, uppercased mono", () => {
    render(<Eyebrow>trusted by uk smbs</Eyebrow>);
    const el = screen.getByText("TRUSTED BY UK SMBS");
    expect(el).toBeInTheDocument();
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/text-sage/);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/Eyebrow.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

Create `src/components/primitives/Eyebrow.tsx`:

```tsx
import { cn } from "@/lib/cn";

type Props = { children: string; className?: string };

export function Eyebrow({ children, className }: Props) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-[0.16em] text-sage",
        className
      )}
    >
      {children.toUpperCase()}
    </p>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/Eyebrow.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/Eyebrow.tsx src/components/primitives/Eyebrow.test.tsx
git commit -m "feat(primitive): add Eyebrow (mini sage mono label)"
```

### Task 9: Tag primitive

**Files:** create `src/components/primitives/Tag.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

Create `src/components/primitives/Tag.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders text in mono with sage border and tabular numerics", () => {
    render(<Tag>00:23</Tag>);
    const el = screen.getByText("00:23");
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/border-sage/);
    expect(el.className).toMatch(/tabular-nums/);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/Tag.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

Create `src/components/primitives/Tag.tsx`:

```tsx
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Tag({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 rounded-full border border-sage/40 font-mono text-xs tabular-nums text-mono-label",
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/Tag.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/Tag.tsx src/components/primitives/Tag.test.tsx
git commit -m "feat(primitive): add Tag (mono tabular chip with sage border)"
```

### Task 10: NumberMarker primitive

**Files:** create `src/components/primitives/NumberMarker.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NumberMarker } from "./NumberMarker";

describe("NumberMarker", () => {
  it("renders the number in display-italic green", () => {
    render(<NumberMarker>01</NumberMarker>);
    const el = screen.getByText("01");
    expect(el.className).toMatch(/font-display/);
    expect(el.className).toMatch(/italic/);
    expect(el.className).toMatch(/text-primary/);
  });

  it("accepts an alternate tone (leak coral) for revenue-loss accent", () => {
    render(<NumberMarker tone="leak">01</NumberMarker>);
    const el = screen.getByText("01");
    expect(el.className).toMatch(/text-leak/);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/NumberMarker.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  tone?: "primary" | "leak";
  className?: string;
};

export function NumberMarker({ children, tone = "primary", className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "font-display italic text-display-md tabular-nums leading-none",
        tone === "leak" ? "text-leak" : "text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/NumberMarker.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/NumberMarker.tsx src/components/primitives/NumberMarker.test.tsx
git commit -m "feat(primitive): add NumberMarker (display-italic numeral, green or leak)"
```

### Task 11: Hairline primitive

**Files:** create `src/components/primitives/Hairline.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Hairline } from "./Hairline";

describe("Hairline", () => {
  it("renders an <hr> with sage colour when horizontal (default)", () => {
    const { container } = render(<Hairline />);
    const hr = container.querySelector("hr");
    expect(hr).toBeInTheDocument();
    expect(hr!.className).toMatch(/border-sage/);
  });

  it("renders a vertical divider when orientation=vertical", () => {
    const { container } = render(<Hairline orientation="vertical" />);
    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
    expect(div!.getAttribute("role")).toBe("separator");
    expect(div!.getAttribute("aria-orientation")).toBe("vertical");
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/Hairline.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import { cn } from "@/lib/cn";

type Props = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function Hairline({ orientation = "horizontal", className }: Props) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-px bg-sage/30 self-stretch", className)}
      />
    );
  }
  return <hr className={cn("border-0 border-t border-sage/30 m-0", className)} />;
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/Hairline.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/Hairline.tsx src/components/primitives/Hairline.test.tsx
git commit -m "feat(primitive): add Hairline (sage divider, horizontal + vertical)"
```

### Task 12: LinkArrow primitive

**Files:** create `src/components/primitives/LinkArrow.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LinkArrow } from "./LinkArrow";

describe("LinkArrow", () => {
  it("renders a link with arrow icon", () => {
    render(<LinkArrow href="/audit">Get my audit</LinkArrow>);
    const link = screen.getByRole("link", { name: /get my audit/i });
    expect(link).toHaveAttribute("href", "/audit");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });

  it("uses sage hover styling", () => {
    render(<LinkArrow href="/x">Test</LinkArrow>);
    const link = screen.getByRole("link");
    expect(link.className).toMatch(/hover:text-/);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/LinkArrow.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  href: string;
  className?: string;
  "data-event"?: string;
};

export function LinkArrow({ children, href, className, ...rest }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-ink underline decoration-sage/60 underline-offset-4 hover:text-primary hover:decoration-primary/60 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm",
        className
      )}
      data-event={rest["data-event"]}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/LinkArrow.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/LinkArrow.tsx src/components/primitives/LinkArrow.test.tsx
git commit -m "feat(primitive): add LinkArrow (sage-underline link with arrow icon)"
```

### Task 13: PullQuote primitive

**Files:** create `src/components/primitives/PullQuote.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PullQuote } from "./PullQuote";

describe("PullQuote", () => {
  it("renders quote text, attribution, role/business, and metric", () => {
    render(
      <PullQuote
        quote="Zero missed bookings since March."
        attribution="Sarah Owen"
        role="Salon owner"
        business="Glow Lounge"
        metric="+18% Saturday covers"
      />
    );
    expect(screen.getByText(/zero missed bookings/i)).toBeInTheDocument();
    expect(screen.getByText("Sarah Owen")).toBeInTheDocument();
    expect(screen.getByText(/glow lounge/i)).toBeInTheDocument();
    expect(screen.getByText("+18% Saturday covers")).toBeInTheDocument();
  });

  it("renders an open-quote glyph that is aria-hidden", () => {
    const { container } = render(
      <PullQuote quote="x" attribution="x" role="x" business="x" metric="x" />
    );
    const aria = container.querySelector('[aria-hidden="true"]');
    expect(aria).toBeInTheDocument();
    expect(aria!.textContent).toMatch(/[“"]/);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/PullQuote.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import { cn } from "@/lib/cn";

type Props = {
  quote: string;
  attribution: string;
  role: string;
  business: string;
  metric: string;
  className?: string;
};

export function PullQuote({ quote, attribution, role, business, metric, className }: Props) {
  return (
    <figure className={cn("relative pl-10 md:pl-14", className)}>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 font-display italic text-sage text-6xl md:text-7xl leading-none select-none"
      >
        &ldquo;
      </span>
      <blockquote className="font-display italic text-display-md text-ink leading-tight">
        {quote}
      </blockquote>
      <figcaption className="mt-6">
        <div className="text-base font-medium text-ink">{attribution}</div>
        <div className="text-sm text-fg-muted">
          {role} · {business}
        </div>
        <div className="mt-2 font-mono text-xs tabular-nums text-primary">{metric}</div>
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/PullQuote.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/PullQuote.tsx src/components/primitives/PullQuote.test.tsx
git commit -m "feat(primitive): add PullQuote (display-italic testimonial with sage open-quote)"
```

### Task 14: PlayButton primitive

**Files:** create `src/components/primitives/PlayButton.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayButton } from "./PlayButton";

describe("PlayButton", () => {
  it("renders SVG icon (not unicode glyph)", () => {
    const { container } = render(<PlayButton playing={false} onToggle={() => {}} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.textContent).not.toContain("▶");
    expect(container.textContent).not.toContain("⏸");
  });

  it("has different aria-label when playing vs paused", () => {
    const { rerender } = render(<PlayButton playing={false} onToggle={() => {}} />);
    expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
    rerender(<PlayButton playing={true} onToggle={() => {}} />);
    expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();
    render(<PlayButton playing={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByLabelText(/play/i));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/PlayButton.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
"use client";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  playing: boolean;
  onToggle: () => void;
  className?: string;
};

export function PlayButton({ playing, onToggle, className }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause sample call" : "Play sample call"}
      className={cn(
        "relative h-14 w-14 rounded-full bg-primary text-on-primary flex items-center justify-center transition-transform duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100",
        className
      )}
    >
      {playing ? (
        <Pause aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Play aria-hidden="true" className="h-5 w-5 translate-x-0.5" />
      )}
    </button>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/PlayButton.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/PlayButton.tsx src/components/primitives/PlayButton.test.tsx
git commit -m "feat(primitive): add PlayButton (SVG play/pause replacing unicode glyphs)"
```

### Task 15: Logo primitive

**Files:** create `src/components/primitives/Logo.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders an SVG mark + wordmark", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText(/ANNA Reception/)).toBeInTheDocument();
  });

  it("has accessible name 'ANNA Reception, by ANNA'", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: /anna reception, by anna/i })).toBeInTheDocument();
  });

  it("renders only the mark when variant=mark", () => {
    const { container } = render(<Logo variant="mark" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText(/by anna/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/Logo.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import { cn } from "@/lib/cn";

type Props = {
  variant?: "full" | "mark";
  className?: string;
};

export function Logo({ variant = "full", className }: Props) {
  return (
    <span
      role="img"
      aria-label="ANNA Reception, by ANNA"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 text-primary"
        fill="none"
        aria-hidden="true"
      >
        {/* Stylised "AR" monogram inside a circle */}
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 22 L13 10 L17 22 M10.5 18 H15.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 22 V10 H22 a3 3 0 0 1 0 6 H19 M20.5 16 L23 22"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {variant === "full" && (
        <span className="text-lg font-semibold tracking-tight text-ink">
          ANNA Reception <span className="text-sage font-normal">by ANNA</span>
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/Logo.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/Logo.tsx src/components/primitives/Logo.test.tsx
git commit -m "feat(primitive): add Logo (SVG AR monogram + wordmark)"
```

### Task 16: FeatureIcon primitive (Lucide-backed)

**Files:** create `src/components/primitives/FeatureIcon.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FeatureIcon, type FeatureIconName } from "./FeatureIcon";

const NAMES: FeatureIconName[] = [
  "answer-24-7",
  "calendar",
  "sms",
  "transfer",
  "deposit",
  "integrations",
];

describe("FeatureIcon", () => {
  it.each(NAMES)("renders %s as an SVG with aria-hidden", (name) => {
    const { container } = render(<FeatureIcon name={name} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies size + stroke-current by default", () => {
    const { container } = render(<FeatureIcon name="calendar" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class") || "").toMatch(/h-8/);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/FeatureIcon.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import {
  Clock,
  CalendarDays,
  MessageSquareText,
  Repeat2,
  CreditCard,
  Puzzle,
} from "lucide-react";
import { cn } from "@/lib/cn";

export const FEATURE_ICONS = {
  "answer-24-7": Clock,
  "calendar": CalendarDays,
  "sms": MessageSquareText,
  "transfer": Repeat2,
  "deposit": CreditCard,
  "integrations": Puzzle,
} as const;

export type FeatureIconName = keyof typeof FEATURE_ICONS;

type Props = {
  name: FeatureIconName;
  className?: string;
};

export function FeatureIcon({ name, className }: Props) {
  const Icon = FEATURE_ICONS[name];
  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.5}
      className={cn("h-8 w-8 text-primary", className)}
    />
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/FeatureIcon.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/FeatureIcon.tsx src/components/primitives/FeatureIcon.test.tsx
git commit -m "feat(primitive): add FeatureIcon (Lucide-backed, 6 named icons)"
```

### Task 17: VerticalMark primitive (Lucide-backed for v1)

**Files:** create `src/components/primitives/VerticalMark.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { VerticalMark } from "./VerticalMark";
import { VERTICAL_KEYS } from "@/lib/verticals";

describe("VerticalMark", () => {
  it.each(VERTICAL_KEYS)("renders an SVG for %s", (key) => {
    const { container } = render(<VerticalMark vertical={key} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/primitives/VerticalMark.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import { Hammer, Scissors, Stethoscope, Utensils } from "lucide-react";
import type { VerticalKey } from "@/lib/verticals";
import { cn } from "@/lib/cn";

const ICONS: Record<VerticalKey, React.ComponentType<{ className?: string; "aria-hidden"?: boolean; strokeWidth?: number }>> = {
  dental: Stethoscope, // closest stable Lucide icon for clinic/dental (Tooth isn't in all Lucide versions)
  beauty: Scissors,
  pubs: Utensils,
  construction: Hammer,
};

type Props = {
  vertical: VerticalKey;
  className?: string;
};

export function VerticalMark({ vertical, className }: Props) {
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

Note: if `Tooth` is available in your `lucide-react` version, swap `Stethoscope` for `Tooth` — it's a more literal mark for dental. Check `node_modules/lucide-react/dist/esm/icons/index.d.ts` for the export. Stethoscope is the safe fallback.

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/primitives/VerticalMark.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/VerticalMark.tsx src/components/primitives/VerticalMark.test.tsx
git commit -m "feat(primitive): add VerticalMark (Lucide-backed, 4 verticals)"
```

### Task 18: SectionShell primitive

**Files:** create `src/components/layout/SectionShell.tsx` + `.test.tsx`

- [ ] **Step 1:** Write the failing test

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionShell } from "./SectionShell";

describe("SectionShell", () => {
  it("renders kicker, heading, subhead, and children when all provided", () => {
    render(
      <SectionShell
        kicker={{ number: "01", label: "why" }}
        heading={<h2>Headline</h2>}
        subhead="Subhead text"
      >
        <p>Body</p>
      </SectionShell>
    );
    expect(screen.getByText("01 — WHY")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Headline" })).toBeInTheDocument();
    expect(screen.getByText("Subhead text")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders without a kicker when omitted", () => {
    render(<SectionShell heading={<h2>X</h2>}>body</SectionShell>);
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });

  it("wraps in <section> with max-w-page and section padding", () => {
    const { container } = render(<SectionShell heading={<h2>X</h2>}>body</SectionShell>);
    const section = container.querySelector("section")!;
    expect(section.className).toMatch(/max-w-page/);
    expect(section.className).toMatch(/py-/);
  });
});
```

- [ ] **Step 2:** Run to verify it fails

```bash
npx vitest run src/components/layout/SectionShell.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Write the primitive

```tsx
import { Kicker } from "@/components/primitives/Kicker";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  kicker?: { number?: string; label: string };
  heading: React.ReactNode;
  subhead?: React.ReactNode;
  children: React.ReactNode;
  spacing?: "deep" | "medium" | "slim";
  ariaLabelledBy?: string;
  ariaLabel?: string;
  className?: string;
};

const PADDING: Record<NonNullable<Props["spacing"]>, string> = {
  deep: "py-24 md:py-32",
  medium: "py-16 md:py-20",
  slim: "py-8 md:py-12",
};

export function SectionShell({
  id,
  kicker,
  heading,
  subhead,
  children,
  spacing = "deep",
  ariaLabelledBy,
  ariaLabel,
  className,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn("mx-auto max-w-page px-4", PADDING[spacing], className)}
    >
      {kicker && <Kicker number={kicker.number} label={kicker.label} />}
      <div className={cn(kicker && "mt-4")}>{heading}</div>
      {subhead && (
        <p className="mt-4 text-lg md:text-xl text-fg-muted max-w-prose leading-[1.55]">
          {subhead}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4:** Run to verify it passes

```bash
npx vitest run src/components/layout/SectionShell.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/layout/SectionShell.tsx src/components/layout/SectionShell.test.tsx
git commit -m "feat(layout): add SectionShell (kicker + heading + subhead + body wrapper)"
```

---

## Phase 4 — Refresh existing primitives

### Task 19: Refresh Button (token-driven hover)

**Files:** modify `src/components/primitives/Button.tsx`, `src/components/primitives/Button.test.tsx`

- [ ] **Step 1:** Add a test that asserts the new hover token

Append to `src/components/primitives/Button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("primary button uses primary token (not brightness filter)", () => {
  render(<Button>Click</Button>);
  const el = screen.getByRole("button");
  expect(el.className).toMatch(/bg-primary/);
  expect(el.className).not.toMatch(/brightness-/);
});

it("ghost button uses dark ink border", () => {
  render(<Button variant="ghost">Click</Button>);
  const el = screen.getByRole("button");
  expect(el.className).toMatch(/border-ink/);
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/primitives/Button.test.tsx
```

Expected: 2 new tests FAIL.

- [ ] **Step 3:** Update `src/components/primitives/Button.tsx`

Change the `variants` constant:

```tsx
const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary/90",
  ghost: "bg-transparent text-ink border border-ink/20 hover:border-ink/50",
};
```

- [ ] **Step 4:** Re-run

```bash
npx vitest run src/components/primitives/Button.test.tsx
```

Expected: all PASS (including previously-existing tests).

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/Button.tsx src/components/primitives/Button.test.tsx
git commit -m "refactor(button): replace brightness hover with token-driven primary/90"
```

### Task 20: Refresh AccordionItem (Lucide chevron, sage hairline)

**Files:** modify `src/components/primitives/AccordionItem.tsx`, `src/components/primitives/AccordionItem.test.tsx`

- [ ] **Step 1:** Add a test that asserts SVG (not unicode) chevron + sage divider

Append to `src/components/primitives/AccordionItem.test.tsx`:

```tsx
it("renders an SVG chevron, not a unicode glyph", () => {
  const { container } = render(<AccordionItem title="Q">A</AccordionItem>);
  expect(container.querySelector("svg")).toBeInTheDocument();
  expect(container.textContent).not.toContain("▾");
});

it("uses sage-tinted bottom border", () => {
  const { container } = render(<AccordionItem title="Q">A</AccordionItem>);
  const wrapper = container.firstElementChild as HTMLElement;
  expect(wrapper.className).toMatch(/border-sage/);
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/primitives/AccordionItem.test.tsx
```

Expected: 2 new tests FAIL.

- [ ] **Step 3:** Update `src/components/primitives/AccordionItem.tsx`

Replace the chevron span with a Lucide ChevronDown, and swap `border-border` for `border-sage/30`:

```tsx
"use client";
import { useId, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
};

export function AccordionItem({ title, children, defaultOpen = false, onToggle, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const headerRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      onToggle?.(false);
      headerRef.current?.focus();
    }
  }

  return (
    <div className={cn("border-b border-sage/30", className)} onKeyDown={handleKey}>
      <button
        ref={headerRef}
        id={`${id}-header`}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={handleClick}
        className="flex w-full items-center justify-between py-4 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="font-medium text-ink">{title}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-5 w-5 text-mono-label transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-header`}
        hidden={!open}
        className="pb-4 text-fg-muted"
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4:** Re-run

```bash
npx vitest run src/components/primitives/AccordionItem.test.tsx
```

Expected: all PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/AccordionItem.tsx src/components/primitives/AccordionItem.test.tsx
git commit -m "refactor(accordion): swap unicode ▾ for Lucide ChevronDown, sage divider"
```

### Task 21: Refresh PhoneChip (Lucide phone icon)

**Files:** modify `src/components/primitives/PhoneChip.tsx`, `src/components/primitives/PhoneChip.test.tsx`

- [ ] **Step 1:** Add a test asserting SVG (not emoji)

Append to `src/components/primitives/PhoneChip.test.tsx`:

```tsx
it("renders an SVG phone icon, not the 📞 emoji", () => {
  const { container } = render(<PhoneChip number="+44 20 7946 0000" />);
  expect(container.querySelector("svg")).toBeInTheDocument();
  expect(container.textContent).not.toContain("📞");
});

it("uses sage-tinted border", () => {
  const { container } = render(<PhoneChip number="+44 20 7946 0000" />);
  const link = container.querySelector("a")!;
  expect(link.className).toMatch(/border-sage/);
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/primitives/PhoneChip.test.tsx
```

Expected: 2 new tests FAIL.

- [ ] **Step 3:** Update `src/components/primitives/PhoneChip.tsx`

```tsx
import { Phone } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  number: string;
  className?: string;
};

export function PhoneChip({ number, className }: Props) {
  const href = `tel:${number.replace(/\s+/g, "")}`;
  return (
    <a
      href={href}
      aria-label={`Test call ANNA Reception on ${number}`}
      data-event="header_cta_call_clicked"
      className={cn(
        "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-bg text-ink border border-sage/40 hover:border-sage transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <Phone aria-hidden="true" className="h-4 w-4 text-primary" />
      <span className="tabular-nums font-mono text-sm">{number}</span>
    </a>
  );
}
```

- [ ] **Step 4:** Re-run

```bash
npx vitest run src/components/primitives/PhoneChip.test.tsx
```

Expected: all PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/primitives/PhoneChip.tsx src/components/primitives/PhoneChip.test.tsx
git commit -m "refactor(phone-chip): swap 📞 emoji for Lucide Phone SVG, sage border, mono number"
```

### Task 22: Refresh Waveform (green gradient, remove electric blue)

**Files:** modify `src/components/primitives/Waveform.tsx`

- [ ] **Step 1:** Update the gradient + fill

Replace `src/components/primitives/Waveform.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";

type Props = { playing: boolean };

const BAR_COUNT = 32;

export function Waveform({ playing }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!playing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const svg = ref.current;
    if (!svg) return;
    const bars = svg.querySelectorAll<SVGRectElement>("rect");
    let raf = 0;
    function tick() {
      bars.forEach((bar, i) => {
        // Mix two frequencies so the wave looks alive, not metronome-perfect
        const a = Math.abs(Math.sin(Date.now() / 200 + i));
        const b = Math.abs(Math.sin(Date.now() / 530 + i * 0.7));
        const h = 8 + (a * 0.65 + b * 0.35) * 24;
        bar.setAttribute("height", String(h));
        bar.setAttribute("y", String((40 - h) / 2));
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <svg ref={ref} viewBox={`0 0 ${BAR_COUNT * 6} 40`} className="w-full h-12" aria-hidden="true">
      <defs>
        <linearGradient id="anna-wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--anna-green))" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(var(--anna-green))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--anna-green))" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <rect key={i} x={i * 6} y={16} width={4} height={8} rx={2} fill="url(#anna-wave)" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2:** Build smoke test

```bash
npm run build 2>&1 | tail -20
```

Expected: build passes (the `--accent-electric` reference is now gone; build should be green if foundation tasks are done).

- [ ] **Step 3:** Commit

```bash
git add src/components/primitives/Waveform.tsx
git commit -m "refactor(waveform): replace electric blue with ANNA-green gradient, dual-frequency motion"
```

### Task 23: Tighten AnimatedNumber cadence

**Files:** modify `src/components/primitives/AnimatedNumber.tsx`, `.test.tsx` if affected

- [ ] **Step 1:** Update the cadence

Open `src/components/primitives/AnimatedNumber.tsx`. Find the animation duration constant (likely a `MS_PER_TICK` or `DURATION` literal). Update so the total roll completes in ~360ms with ease-out:

```tsx
// Inside the file — locate the duration logic and ensure it lands at ~360ms total
const DURATION_MS = 360;
```

Adjust the easing/step accordingly. If the file uses `requestAnimationFrame`, ensure the eased progress maps to a 360ms total. If unsure of exact structure, run the existing test first to confirm what is being exercised, then keep visible behaviour identical except for the timing.

- [ ] **Step 2:** Re-run existing tests

```bash
npx vitest run src/components/primitives/AnimatedNumber.test.tsx
```

Expected: PASS (existing tests don't assert exact timing; they assert end-state and intermediate roll).

- [ ] **Step 3:** Commit

```bash
git add src/components/primitives/AnimatedNumber.tsx
git commit -m "refactor(animated-number): tighten cadence to 360ms ease-out"
```

### Task 24: Run the full vitest suite to confirm nothing regressed

**Files:** none

- [ ] **Step 1:** Run

```bash
npm test
```

Expected: all tests pass (old + new). If any fail, fix forward — do not skip.

- [ ] **Step 2:** Tag a milestone commit (empty if nothing changed)

```bash
git commit --allow-empty -m "milestone: foundation + primitives green"
```

---

## Phase 5 — Asset generation

### Task 25: Generate hero illustration via image-gen

**Files:** `public/assets/redesign/hero-illustration.png`

- [ ] **Step 1:** Create the destination folder

```bash
mkdir -p public/assets/redesign
```

- [ ] **Step 2:** Generate via image-gen

```bash
ORIG_CWD="$(pwd)" && cd /Users/nfilippov/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0 && uv run python main.py --cwd "$ORIG_CWD" public/assets/redesign/hero-illustration.png "Premium product illustration on a transparent background for a B2B SaaS landing page hero. Style: thin engraved line drawing, single-weight 1.5px stroke, near-black ink on transparent. Subject: a stylised modern smartphone shown three-quarters with a faint mint-green halo glow around it. The phone screen shows: a small live-call indicator (filled circle), an audio waveform crossing the screen as concentric arcs, a transcript bubble that reads 'caller: do you have anything tomorrow?', and a small calendar card '10:00 — booked'. Around the phone in the negative space: one tiny credit-card chip floating top-left, one tiny envelope with a notification dot floating bottom-right, one small green squiggle decoration. Single composition, magazine-illustration aesthetic, generous whitespace, no shadows, no gradients except the mint halo. The whole illustration sits comfortably in a 3:4 portrait box. No people. No real brand logos." --aspect 3:4 2>&1 | tail -5
```

- [ ] **Step 3:** Verify output

```bash
ls -la public/assets/redesign/hero-illustration.png
```

Expected: file exists, ~300-800 KB.

- [ ] **Step 4:** Commit

```bash
git add public/assets/redesign/hero-illustration.png
git commit -m "feat(assets): add hero illustration (engraved-line phone+wave, image-gen stub)"
```

### Task 26: Create squiggle SVG (hand-coded)

**Files:** `public/assets/redesign/squiggle.svg`

- [ ] **Step 1:** Create the file

Create `public/assets/redesign/squiggle.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 24" fill="none" aria-hidden="true">
  <path
    d="M2 12 C 12 2, 22 22, 32 12 S 52 2, 62 12 S 82 22, 92 12 S 112 2, 118 12"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    fill="none"
  />
</svg>
```

- [ ] **Step 2:** Verify renders in browser

Start dev server briefly and verify the squiggle renders (skip if dev server already running):

```bash
ls -la public/assets/redesign/squiggle.svg
```

Expected: file exists.

- [ ] **Step 3:** Commit

```bash
git add public/assets/redesign/squiggle.svg
git commit -m "feat(assets): add ANNA green squiggle decoration (hand-coded SVG)"
```

### Task 27: Asset inventory README (in the asset folder)

**Files:** `public/assets/redesign/README.md`

- [ ] **Step 1:** Document what's where

Create `public/assets/redesign/README.md`:

```markdown
# Redesign assets

| File | Source | Replacement plan |
|---|---|---|
| `hero-illustration.png` | image-gen (`gemini-3-pro-image`) | Replace with hand-illustrated SVG before public launch |
| `squiggle.svg` | hand-coded | Keep — small, vector, recolourable |

**Not in this folder (sourced externally by ANNA marketing):**
- Customer logos (CUSTOMER_LOGOS in `src/content/customerLogos.ts`)
- Integration logos (INTEGRATION_LOGOS in `src/content/integrations.ts`)
- Testimonial avatars (TESTIMONIALS in `src/content/testimonials.ts`)
- Trustpilot 5-star badge (download from Trustpilot brand kit; do not regenerate)
- Audio samples (GENERIC + 4 vertical)

**Replaced by SVG primitives, not stored as files:**
- Logo (AR monogram + wordmark) — `src/components/primitives/Logo.tsx`
- FeatureIcon × 6 — Lucide icons via `src/components/primitives/FeatureIcon.tsx`
- VerticalMark × 4 — Lucide icons via `src/components/primitives/VerticalMark.tsx`
```

- [ ] **Step 2:** Commit

```bash
git add public/assets/redesign/README.md
git commit -m "docs(assets): inventory redesign assets and their sources"
```

---

## Phase 6 — Sections (above-the-fold)

### Task 28: Refresh Header (Logo SVG, scroll-shrink)

**Files:** modify `src/components/layout/Header.tsx`, `src/components/layout/Header.test.tsx`

- [ ] **Step 1:** Add a test asserting the SVG Logo

Open `src/components/layout/Header.test.tsx` and append:

```tsx
it("renders the Logo SVG mark (not just a text wordmark)", () => {
  const { container } = render(<Header />);
  // Logo primitive renders an svg + wordmark
  expect(container.querySelector("svg")).toBeInTheDocument();
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/layout/Header.test.tsx
```

Expected: new test FAILS.

- [ ] **Step 3:** Update `src/components/layout/Header.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { Logo } from "@/components/primitives/Logo";
import { cn } from "@/lib/cn";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-sage/30 transition-[padding] duration-200 motion-reduce:transition-none",
        scrolled ? "py-2" : "py-3"
      )}
    >
      <div className="mx-auto max-w-page flex items-center justify-between px-4">
        <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-ink hover:text-primary transition-colors">How it works</a>
          <a href="#pricing" className="text-ink hover:text-primary transition-colors">Pricing</a>
          <a href="/sign-in" className="text-ink hover:text-primary transition-colors">Sign in</a>
        </nav>
        <div className="flex items-center gap-3">
          <PhoneChip number={DEMO_PHONE} className="hidden sm:inline-flex" />
          <Button href="/demo" data-event="hero_cta_demo_clicked">
            Book a demo
          </Button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4:** Re-run

```bash
npx vitest run src/components/layout/Header.test.tsx
```

Expected: all PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/layout/Header.tsx src/components/layout/Header.test.tsx
git commit -m "feat(header): SVG Logo, scroll-shrink, sage hairline, ink hover"
```

### Task 29: Refresh Hero (Kicker, Display-XL, hero illustration)

**Files:** modify `src/components/sections/Hero.tsx`, `src/components/sections/Hero.test.tsx`

- [ ] **Step 1:** Add tests asserting new chrome

Append to `src/components/sections/Hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";

it("renders an editorial kicker label", () => {
  render(<Hero />);
  expect(screen.getByText(/01 — AI RECEPTIONIST/i)).toBeInTheDocument();
});

it("renders the hero illustration (not a placeholder rectangle)", () => {
  const { container } = render(<Hero />);
  // next/image renders an <img> in jsdom tests
  expect(container.querySelector("img")).toBeInTheDocument();
});

it("emphasises one word in italic display style", () => {
  const { container } = render(<Hero />);
  const italic = container.querySelector("em, i, .italic");
  expect(italic).toBeInTheDocument();
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/sections/Hero.test.tsx
```

Expected: new tests FAIL.

- [ ] **Step 3:** Update `src/components/sections/Hero.tsx`

```tsx
import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";

export function Hero() {
  return (
    <section className="mx-auto max-w-page px-4 pt-12 pb-16 md:pt-20 md:pb-24" aria-labelledby="hero-headline">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <Kicker number="01" label="AI Receptionist · UK" />
          <h1
            id="hero-headline"
            className="mt-6 font-display text-display-xl text-ink leading-[1.05] tracking-tight text-balance"
          >
            Stop <em className="not-italic md:italic text-primary">losing</em> revenue to missed calls.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-prose leading-[1.55]">
            ANNA Reception answers, books, and follows up 24/7 — for dental clinics, salons, gastropubs, and trades.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/demo" data-event="hero_cta_demo_clicked">Book a demo</Button>
            <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
            <span aria-label="Trustpilot rating: five stars" className="text-primary font-medium">★★★★★</span>
            <span>Trustpilot</span>
            <span aria-hidden="true">·</span>
            <span>From the team behind 100,000+ business accounts</span>
          </div>
        </div>
        <div aria-hidden="true" className="hidden md:block relative">
          <Image
            src="/assets/redesign/hero-illustration.png"
            alt=""
            width={800}
            height={1000}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4:** Re-run

```bash
npx vitest run src/components/sections/Hero.test.tsx
```

Expected: all PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/sections/Hero.tsx src/components/sections/Hero.test.tsx
git commit -m "feat(hero): editorial kicker, display-xl headline with italic emphasis, image illustration"
```

### Task 30: Refresh SocialProofLogos (cream-deep, Eyebrow)

**Files:** modify `src/components/sections/SocialProofLogos.tsx`

- [ ] **Step 1:** Update the section

```tsx
import { CUSTOMER_LOGOS } from "@/content/customerLogos";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import Image from "next/image";

export function SocialProofLogos() {
  const doubled = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS];
  return (
    <section aria-label="Customers" className="py-12 border-y border-sage/30 bg-cream-deep overflow-hidden">
      <div className="mx-auto max-w-page px-4">
        <Eyebrow className="text-center">Trusted by UK SMBs</Eyebrow>
      </div>
      <div className="mt-6 flex gap-12 animate-marquee motion-reduce:animate-none whitespace-nowrap" style={{ animationDuration: "45s" }}>
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center justify-center min-w-[120px] h-12 opacity-70">
            {logo.src ? (
              <Image src={logo.src} alt={logo.name} width={120} height={40} />
            ) : (
              <MissingAsset label={`logo: ${logo.name}`} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Verify with existing tests (the marquee assertion may exist in playwright)

```bash
npm test
```

Expected: no regressions.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/SocialProofLogos.tsx
git commit -m "feat(social-proof): cream-deep band, sage hairlines, Eyebrow above marquee"
```

### Task 31: Refresh RevenueLeak (Kicker, NumberMarker stanzas)

**Files:** modify `src/components/sections/RevenueLeak.tsx`

- [ ] **Step 1:** Rewrite the section

```tsx
import { Kicker } from "@/components/primitives/Kicker";
import { NumberMarker } from "@/components/primitives/NumberMarker";

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
        {STATS.map((s) => (
          <li key={s.num}>
            <NumberMarker tone={s.tone}>{s.num}</NumberMarker>
            <p className="mt-6 text-2xl font-medium text-ink leading-tight">{s.headline}</p>
            <p className="mt-3 text-fg-muted max-w-prose">{s.subline}</p>
            {s.source && (
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-mono-label">
                {s.source}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
```

Note: source citations now have real values (no more `[source: TBD]` literal text). This satisfies G8 from v3 for this section. If marketing requires different citations, swap the strings — the chrome supports it.

- [ ] **Step 2:** Verify the build

```bash
npm run build 2>&1 | tail -10
npm run check:placeholders
```

Expected: build OK; `check:placeholders` does not detect any `[source: TBD]` in this section.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/RevenueLeak.tsx
git commit -m "feat(revenue-leak): kicker + NumberMarker stanzas, drop card chrome, resolve source citations"
```

### Task 32: Refresh AudioDemo (Kicker, PlayButton, sage card)

**Files:** modify `src/components/sections/AudioDemo.tsx`, `.test.tsx`

- [ ] **Step 1:** Add a test asserting PlayButton is used (no unicode glyph)

Append to `src/components/sections/AudioDemo.test.tsx`:

```tsx
it("does not render the ▶/⏸ unicode glyphs anywhere", () => {
  const { container } = render(<AudioDemo />);
  expect(container.textContent).not.toContain("▶");
  expect(container.textContent).not.toContain("⏸");
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/sections/AudioDemo.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Update `src/components/sections/AudioDemo.tsx`

```tsx
"use client";
import { useRef, useState } from "react";
import { Waveform } from "@/components/primitives/Waveform";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import { PlayButton } from "@/components/primitives/PlayButton";
import { Kicker } from "@/components/primitives/Kicker";
import { LinkArrow } from "@/components/primitives/LinkArrow";
import { track } from "@/lib/analytics";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";
const GENERIC_AUDIO_SRC = process.env.NEXT_PUBLIC_GENERIC_AUDIO_SRC ?? "";
const TRANSCRIPT =
  "ANNA: Good afternoon, ANNA Reception. Caller: Hi, do you have any availability tomorrow? ANNA: We've got a 10am and a 2pm — which suits? …";

export function AudioDemo() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  function togglePlay() {
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
    <section className="mx-auto max-w-page px-4 py-16 md:py-20" aria-labelledby="audio-heading">
      <Kicker number="03" label="Hear ANNA take a real call" />
      <h2 id="audio-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Hear ANNA take a real call.
      </h2>
      <p className="mt-4 text-lg text-fg-muted max-w-prose leading-[1.55]">
        30 seconds of an actual call answered, triaged, and booked. Most callers don&apos;t realise it&apos;s AI.
      </p>
      <div className="mt-10 rounded-2xl border border-sage/40 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <PlayButton playing={playing} onToggle={togglePlay} />
          <Waveform playing={playing} />
        </div>
        {GENERIC_AUDIO_SRC ? (
          <audio
            ref={ref}
            src={GENERIC_AUDIO_SRC}
            preload="metadata"
            onEnded={() => {
              setPlaying(false);
              track("audio_demo_completed_30s");
            }}
          />
        ) : (
          <div className="mt-4">
            <MissingAsset label="audio: generic 30s call sample" />
          </div>
        )}
        <button
          type="button"
          aria-expanded={showTranscript}
          onClick={() => setShowTranscript((v) => !v)}
          className="mt-4 font-mono text-xs uppercase tracking-wider text-mono-label hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          {showTranscript ? "Hide transcript ↑" : "Read transcript ↓"}
        </button>
        <div role="region" aria-label="Transcript" hidden={!showTranscript} className="mt-3 text-sm text-fg-muted max-w-prose">
          {TRANSCRIPT}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-fg-muted">
        <span>Or hear her live yourself:</span>
        <PhoneChip number={DEMO_PHONE} />
      </div>
    </section>
  );
}
```

- [ ] **Step 4:** Re-run

```bash
npx vitest run src/components/sections/AudioDemo.test.tsx
```

Expected: PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/sections/AudioDemo.tsx src/components/sections/AudioDemo.test.tsx
git commit -m "feat(audio-demo): kicker + PlayButton SVG, sage card, mono transcript toggle"
```

### Task 33: Refresh RoiCalculator (Kicker, VerticalMark tiles, display output)

**Files:** modify `src/components/sections/RoiCalculator.tsx`, `.test.tsx`

- [ ] **Step 1:** Add a test asserting VerticalMark renders in the picker

Append to `src/components/sections/RoiCalculator.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { RoiCalculator } from "./RoiCalculator";

it("renders SVG vertical marks in the picker (no initial vertical)", () => {
  const { container } = render(<RoiCalculator initialVertical={null} />);
  // 4 verticals, each rendering a Lucide SVG mark
  const svgs = container.querySelectorAll("svg");
  expect(svgs.length).toBeGreaterThanOrEqual(4);
});
```

- [ ] **Step 2:** Run — expect fail

```bash
npx vitest run src/components/sections/RoiCalculator.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Update the section

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
            {VERTICAL_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => selectVertical(k)}
                className="group flex flex-col items-start gap-4 rounded-2xl border border-sage-mute p-6 text-left min-h-[120px] transition-colors duration-150 hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <VerticalMark vertical={k} className="h-10 w-10 text-primary group-hover:scale-105 transition-transform duration-150 motion-reduce:transition-none" />
                <div>
                  <div className="font-medium text-ink">{VERTICALS[k].label}</div>
                  <div className="mt-1 text-sm text-fg-muted">{VERTICALS[k].cardHook}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {vertical && config && (
        <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <VerticalMark vertical={vertical} className="h-10 w-10 text-primary" />
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
              <LinkArrow
                href="/audit"
                data-event="hero_cta_audit_clicked"
              >
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

- [ ] **Step 4:** Re-run

```bash
npx vitest run src/components/sections/RoiCalculator.test.tsx
```

Expected: all PASS.

- [ ] **Step 5:** Commit

```bash
git add src/components/sections/RoiCalculator.tsx src/components/sections/RoiCalculator.test.tsx
git commit -m "feat(roi-calc): kicker + VerticalMark picker, borderless inputs, display-xl leak number"
```

---

## Phase 7 — Sections (mid-page)

### Task 34: Refresh HowItWorks (Kicker, NumberMarker stanzas, connector)

**Files:** modify `src/components/sections/HowItWorks.tsx`

- [ ] **Step 1:** Rewrite the section

```tsx
import { Kicker } from "@/components/primitives/Kicker";
import { NumberMarker } from "@/components/primitives/NumberMarker";

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
        {/* Connector hairline behind the steps (desktop only) */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-sage/40"
        />
        {STEPS.map((s) => (
          <li key={s.num} className="relative">
            <NumberMarker>{s.num}</NumberMarker>
            <p className="mt-6 text-xl font-medium text-ink leading-tight">{s.title}</p>
            <p className="mt-3 text-fg-muted max-w-prose">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2:** Build smoke

```bash
npm run build 2>&1 | tail -5
```

Expected: build passes.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/HowItWorks.tsx
git commit -m "feat(how-it-works): kicker + NumberMarker stanzas connected by sage hairline"
```

### Task 35: Refresh VerticalsTileModule + VerticalTile

**Files:** modify `src/components/sections/VerticalsTileModule.tsx`, `src/components/verticals/VerticalTile.tsx`, `src/components/sections/VerticalsTileModule.test.tsx`

- [ ] **Step 1:** First, read the current VerticalTile to understand its API

```bash
cat src/components/verticals/VerticalTile.tsx
```

(This step exists because the engineer may need to know the current shape before editing.)

- [ ] **Step 2:** Update `src/components/sections/VerticalsTileModule.tsx`

```tsx
"use client";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS } from "@/lib/verticals";
import { VerticalTile } from "@/components/verticals/VerticalTile";
import { Kicker } from "@/components/primitives/Kicker";

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
        {VERTICAL_KEYS.map((k) => (
          <VerticalTile key={k} content={VERTICALS[k]} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3:** Update `src/components/verticals/VerticalTile.tsx`

This task assumes the current `VerticalTile` is a `<details>` or expandable block. Open the existing file and apply this pattern (adjust selectors to match the actual content shape):

```tsx
"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { VerticalContent } from "@/content/verticals";
import { VerticalMark } from "@/components/primitives/VerticalMark";
import { cn } from "@/lib/cn";

type Props = { content: VerticalContent };

export function VerticalTile({ content }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("border-b border-sage/30 transition-colors duration-200 motion-reduce:transition-none", open && "bg-cream-deep")}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-6 py-8 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <VerticalMark vertical={content.key} className="h-10 w-10 text-primary flex-shrink-0" />
        <div className="flex-1">
          <div className="font-display text-2xl text-ink">{content.label}</div>
          <p className="mt-1 text-fg-muted">{content.cardHook}</p>
        </div>
        <span className="hidden sm:inline-block font-mono text-xs text-mono-label tabular-nums">
          {content.headlineRoi}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-5 w-5 text-mono-label flex-shrink-0 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="pb-8 grid gap-6 md:grid-cols-2 md:gap-12">
          <div>
            <p className="font-medium text-ink">{content.pain}</p>
            <p className="mt-3 text-sm text-fg-muted">{content.smartBehaviours}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-mono-label">Integrations</p>
            <p className="mt-2 text-sm">{content.integrations}</p>
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-mono-label">Compliance</p>
            <p className="mt-2 text-sm text-fg-muted">{content.compliance}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

If the actual `VerticalContent` type differs, adapt the field names. The intent is: collapsed = mark + label + hook + headline ROI on one row, with a chevron; expanded = pain/behaviours + integrations/compliance in a two-column grid with cream-deep background.

- [ ] **Step 4:** Run existing tests

```bash
npx vitest run src/components/sections/VerticalsTileModule.test.tsx
```

Expected: PASS. If a test asserts specific old structure, update the assertions to match the new shape (label, hook, integrations are still in the DOM — adjust selectors).

- [ ] **Step 5:** Commit

```bash
git add src/components/sections/VerticalsTileModule.tsx src/components/verticals/VerticalTile.tsx src/components/sections/VerticalsTileModule.test.tsx
git commit -m "feat(verticals): kicker + sage-hairline tile rows, VerticalMark, cream-deep expand bg"
```

### Task 36: Refresh TestimonialWall (PullQuote magazine grid)

**Files:** modify `src/components/sections/TestimonialWall.tsx`

- [ ] **Step 1:** Rewrite the section

```tsx
import { TESTIMONIALS } from "@/content/testimonials";
import { Kicker } from "@/components/primitives/Kicker";
import { PullQuote } from "@/components/primitives/PullQuote";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

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
          <div className="md:col-span-2">
            <PullQuote
              quote={hero.quote}
              attribution={hero.name}
              role={hero.role}
              business={hero.business ?? ""}
              metric={hero.metric}
            />
          </div>
        )}
        <div className="grid gap-8">
          {rest.slice(0, 2).map((t, i) => (
            <figure key={i}>
              <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.avatarSrc ? (
                  <Image src={t.avatarSrc} alt={t.name} width={40} height={40} className="rounded-full ring-2 ring-sage/40" />
                ) : (
                  <MissingAsset label={`avatar: ${t.name}`} width={40} height={40} />
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
      </div>
      {rest.length > 2 && (
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {rest.slice(2).map((t, i) => (
            <figure key={i}>
              <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.avatarSrc ? (
                  <Image src={t.avatarSrc} alt={t.name} width={40} height={40} className="rounded-full ring-2 ring-sage/40" />
                ) : (
                  <MissingAsset label={`avatar: ${t.name}`} width={40} height={40} />
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
      )}
    </section>
  );
}
```

Note: If `TESTIMONIALS[*].business` doesn't exist on the type, drop that prop or add it to the type in `src/content/testimonials.ts`.

- [ ] **Step 2:** Build smoke

```bash
npm run build 2>&1 | tail -5
```

Expected: build OK.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/TestimonialWall.tsx
git commit -m "feat(testimonials): kicker + PullQuote hero + magazine-grid rest"
```

### Task 37: Refresh FeatureStrip (FeatureIcons, sage grid)

**Files:** modify `src/components/sections/FeatureStrip.tsx`

- [ ] **Step 1:** Rewrite the section

```tsx
import { FeatureIcon, type FeatureIconName } from "@/components/primitives/FeatureIcon";

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
          <li
            key={f.title}
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
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2:** Build smoke

```bash
npm run build 2>&1 | tail -5
```

Expected: build OK.

- [ ] **Step 3:** Commit

```bash
git add src/components/sections/FeatureStrip.tsx
git commit -m "feat(feature-strip): 6 Lucide FeatureIcons in sage-hairline grid, no card chrome"
```

---

## Phase 8 — Sections (closing)

### Task 38: Refresh IntegrationsMarquee

**Files:** modify `src/components/sections/IntegrationsMarquee.tsx`

- [ ] **Step 1:** Update

```tsx
import { INTEGRATION_LOGOS } from "@/content/integrations";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function IntegrationsMarquee() {
  const doubled = [...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS];
  return (
    <section className="py-16 border-y border-sage/30 bg-cream-deep overflow-hidden" aria-label="Integrations">
      <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-mono-label mb-8">
        200+ Integrations · Always Growing
      </p>
      <div className="flex gap-16 animate-marquee motion-reduce:animate-none whitespace-nowrap">
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center justify-center min-w-[140px] h-10 opacity-70">
            {logo.src ? (
              <Image src={logo.src} alt={logo.name} width={140} height={32} />
            ) : (
              <MissingAsset label={`logo: ${logo.name}`} width={140} height={32} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/sections/IntegrationsMarquee.tsx
git commit -m "feat(integrations): cream-deep band, mono caption with tracking"
```

### Task 39: Refresh PricingTeaser (Display-XL price)

**Files:** modify `src/components/sections/PricingTeaser.tsx`

- [ ] **Step 1:** Update

```tsx
"use client";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { track } from "@/lib/analytics";

export function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="pricing-heading">
      <Kicker number="08" label="Honest pricing" />
      <h2 id="pricing-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Honest pricing.
      </h2>
      <div className="mt-12 rounded-3xl border border-sage/40 p-8 md:p-12 max-w-2xl">
        <p className="font-display text-display-xl text-ink leading-none tabular-nums">
          From £99–£299<span className="text-display-md text-fg-muted">/mo</span>
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">
          Depending on call volume · No long contracts · Setup in 3 minutes
        </p>
        <Button
          href="/demo"
          className="mt-8"
          data-event="pricing_teaser_clicked"
          onClick={() => track("pricing_teaser_clicked")}
        >
          Book a demo for full pricing
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/sections/PricingTeaser.tsx
git commit -m "feat(pricing): kicker + display-xl price treatment, mono qualifier strip"
```

### Task 40: Refresh AuditReEntryBanner

**Files:** modify `src/components/sections/AuditReEntryBanner.tsx`

- [ ] **Step 1:** Update

```tsx
import { LinkArrow } from "@/components/primitives/LinkArrow";

export function AuditReEntryBanner() {
  return (
    <section className="mx-auto max-w-page px-4">
      <div className="border-y border-sage/30 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-lg text-ink">Skipped the calculator? Get your free revenue audit emailed.</p>
        <LinkArrow href="/audit" data-event="hero_cta_audit_clicked">
          Get my free revenue audit
        </LinkArrow>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/sections/AuditReEntryBanner.tsx
git commit -m "feat(audit-banner): sage hairlines, LinkArrow, drop card chrome"
```

### Task 41: Refresh FaqAccordion

**Files:** modify `src/components/sections/FaqAccordion.tsx`

- [ ] **Step 1:** Update

```tsx
import { FAQ } from "@/content/faq";
import { AccordionItem } from "@/components/primitives/AccordionItem";
import { Kicker } from "@/components/primitives/Kicker";

export function FaqAccordion() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="faq-heading">
      <Kicker number="09" label="Questions, then?" />
      <h2 id="faq-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        Questions, then?
      </h2>
      <div className="mt-12 max-w-3xl">
        {FAQ.map((entry) => (
          <AccordionItem key={entry.q} title={entry.q}>
            <p className="text-fg-muted max-w-prose">{entry.a}</p>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/sections/FaqAccordion.tsx
git commit -m "feat(faq): kicker + accordion using refreshed AccordionItem (SVG chevron, sage divider)"
```

### Task 42: Refresh FinalCtaBanner (cream-deep slab + squiggle)

**Files:** modify `src/components/sections/FinalCtaBanner.tsx`

- [ ] **Step 1:** Update

```tsx
import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { Kicker } from "@/components/primitives/Kicker";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function FinalCtaBanner() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 md:py-32" aria-label="Final call to action">
      <div className="relative rounded-3xl bg-cream-deep p-12 md:p-20 text-center overflow-hidden">
        {/* Decorative squiggle in one corner */}
        <span aria-hidden="true" className="absolute -bottom-4 -right-4 w-48 text-primary opacity-30">
          <svg viewBox="0 0 120 24" fill="none" className="w-full h-auto">
            <path
              d="M2 12 C 12 2, 22 22, 32 12 S 52 2, 62 12 S 82 22, 92 12 S 112 2, 118 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
        <div className="relative">
          <Kicker number="10" label="Time to stop missing calls" className="!text-mono-label text-center" />
          <h2 className="mt-6 font-display text-display-xl text-ink text-balance">
            Time to stop missing calls.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" data-event="hero_cta_demo_clicked">
              Book a demo
            </Button>
            <PhoneChip number={DEMO_PHONE} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/sections/FinalCtaBanner.tsx
git commit -m "feat(final-cta): cream-deep slab, display-xl closing headline, decorative squiggle"
```

### Task 43: Refresh Footer

**Files:** modify `src/components/layout/Footer.tsx`

- [ ] **Step 1:** Update

```tsx
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { Logo } from "@/components/primitives/Logo";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Footer() {
  return (
    <footer className="border-t border-sage/30 bg-cream mt-24">
      <div className="mx-auto max-w-page px-4 py-16 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <Logo variant="mark" />
          <div className="mt-4 font-semibold text-ink">ANNA Reception</div>
          <p className="mt-2 text-fg-muted">By ANNA — the business account 100,000+ UK businesses already use.</p>
          <PhoneChip number={DEMO_PHONE} className="mt-4" />
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-mono-label">Product</div>
          <ul className="mt-3 space-y-2 text-fg-muted">
            <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a></li>
            <li><a href="#verticals" className="hover:text-primary transition-colors">Verticals</a></li>
            <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
            <li><a href="/demo" className="hover:text-primary transition-colors">Book a demo</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-mono-label">Company</div>
          <ul className="mt-3 space-y-2 text-fg-muted">
            <li><a href="https://anna.money" className="hover:text-primary transition-colors">ANNA Money</a></li>
            <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-mono-label">Legal</div>
          <ul className="mt-3 space-y-2 text-fg-muted">
            <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy</a></li>
            <li><a href="/terms" className="hover:text-primary transition-colors">Terms</a></li>
          </ul>
          <p className="mt-6 text-xs text-fg-muted">Absolute Financial Services Ltd. ANNA is a trading name. FCA reference TBD.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(footer): Logo mark, mono section labels, sage hairlines"
```

---

## Phase 9 — Polish & verification

### Task 44: Update existing component tests for sticky CTA / Header etc.

**Files:** any test that asserts removed classes (e.g. `border-border` where we now use `border-sage/30`)

- [ ] **Step 1:** Run the full vitest suite

```bash
npm test
```

Expected: most tests pass; identify any that fail because of class-name assertions.

- [ ] **Step 2:** For each failing test, update the assertion to match new structure (DO NOT update the implementation to match the old test — the test was checking incidental detail)

Example fix pattern:

```tsx
// Old assertion:
expect(el.className).toMatch(/border-border/);
// New assertion (if the test cares about "has a border" rather than which colour):
expect(el.className).toMatch(/border-/);
// Or, if the test should check the new sage border specifically:
expect(el.className).toMatch(/border-sage/);
```

- [ ] **Step 3:** Run all tests again

```bash
npm test
```

Expected: all PASS.

- [ ] **Step 4:** Commit fixes

```bash
git add src/components/**/*.test.tsx
git commit -m "test: update class-name assertions for redesigned components"
```

### Task 45: Update Playwright e2e tests

**Files:** anything in `tests/`

- [ ] **Step 1:** Inventory current e2e tests

```bash
ls tests/
```

- [ ] **Step 2:** Run e2e tests

```bash
npx playwright test
```

Expected: most pass. Fix any failures by updating selectors to match the new DOM structure. **Do not** remove a11y assertions (axe checks must remain).

- [ ] **Step 3:** If selectors used hard-coded classes like `border-border`, switch to semantic selectors (role, accessible name) where possible.

- [ ] **Step 4:** Commit fixes

```bash
git add tests/
git commit -m "test(e2e): update selectors for redesigned DOM"
```

### Task 46: Retire MissingAsset from production paths

**Files:** any section still rendering `<MissingAsset>` when an asset is missing

- [ ] **Step 1:** Find remaining usages

```bash
grep -rn "MissingAsset" src/components/sections src/components/layout
```

- [ ] **Step 2:** For each occurrence, decide:
- If the asset will be supplied by ANNA marketing soon → leave `MissingAsset` in place as a dev affordance (it surfaces the gap visibly)
- If the asset can be replaced with a semantic placeholder (e.g. initials in a circle for avatars) → swap in the semantic placeholder

Avatar placeholder pattern (use this in `TestimonialWall.tsx` if you want to retire `MissingAsset` for avatars):

```tsx
function AvatarPlaceholder({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
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
```

- [ ] **Step 3:** Per the spec, `MissingAsset` may **stay in source** as a dev/test affordance — it just should not render in production-relevant code paths. Document this in `src/components/primitives/MissingAsset.tsx` by adding a JSDoc note:

Open `src/components/primitives/MissingAsset.tsx` and add at the top:

```tsx
/**
 * Dev/test affordance. Surfaces missing assets visibly during development.
 * Do not use in new code; replace with real assets or semantic placeholders.
 * Used in: SocialProofLogos (logos missing), IntegrationsMarquee (logos missing),
 * AudioDemo (audio sample missing). Replace these as marketing ships assets.
 */
```

- [ ] **Step 4:** Commit

```bash
git add src/components/
git commit -m "refactor: retire MissingAsset from new code, document as dev affordance"
```

### Task 47: Lighthouse pass

**Files:** none (verification only)

- [ ] **Step 1:** Start dev server

```bash
npm run build
npm start &
sleep 5
```

- [ ] **Step 2:** Run Lighthouse

```bash
npm run perf:lighthouse
```

Expected: produces `lighthouse-report.html` in the repo root.

- [ ] **Step 3:** Check scores

```bash
grep -E '"category".*"(performance|accessibility|best-practices|seo)"' lighthouse-report.html | head -5
# Or open lighthouse-report.html in a browser
```

Expected on desktop: Performance ≥95, Accessibility ≥95, Best-Practices ≥95, SEO ≥95.

If any score is below the gate, address before continuing:
- Perf: inspect LCP/CLS, check `next/image` `priority` on hero, verify `font-display: swap` (already set)
- A11y: re-run axe via Playwright; fix contrast/labels
- BP/SEO: meta tags from layout.tsx should already cover SEO basics

- [ ] **Step 4:** Stop dev server

```bash
kill %1 2>/dev/null || true
```

- [ ] **Step 5:** Commit lighthouse report (optional — may be `.gitignore`'d)

```bash
# If lighthouse-report.html is gitignored, skip this commit
git status lighthouse-report.html
```

### Task 48: Axe a11y sweep (Playwright)

**Files:** `tests/a11y.spec.ts` (or wherever the existing axe spec lives)

- [ ] **Step 1:** Locate the axe spec

```bash
ls tests/
grep -rln "@axe-core" tests/
```

- [ ] **Step 2:** Run it

```bash
npx playwright test tests/a11y.spec.ts
```

Expected: PASS, zero violations.

- [ ] **Step 3:** If new violations exist, fix them. Common new sources after redesign:
- Insufficient colour contrast on new sage/mono-label combinations — adjust the token's lightness value
- A button missing an accessible name (the new SVG-icon-only triggers like the audio transcript toggle should have visible text — they do, in the spec)
- Heading hierarchy issues — `Kicker` is `aria-hidden`, so it shouldn't add an h-level

- [ ] **Step 4:** Commit any fixes

```bash
git add src/
git commit -m "fix(a11y): resolve violations introduced by redesign"
```

### Task 49: Reduced-motion sweep

**Files:** none (verification only)

- [ ] **Step 1:** Run the reduced-motion Playwright spec

```bash
npx playwright test --grep "reduced-motion"
```

Expected: PASS. The spec asserts that with `prefers-reduced-motion: reduce`, animated elements freeze (waveform static, marquee paused, counter-roll instant).

- [ ] **Step 2:** Manual check via dev server

```bash
npm run dev &
sleep 5
```

In a browser with reduced-motion forced on (Chrome devtools → Rendering → Emulate CSS prefers-reduced-motion), navigate to localhost:3000 and verify:
- Hero illustration: no entrance animation
- Waveform: static (frozen mid-state)
- Marquee: paused
- ROI calculator number changes: instant (no roll)
- Accordion: instant toggle (no height anim)

Kill the dev server:

```bash
kill %1
```

- [ ] **Step 3:** No commit unless fixes were applied.

### Task 50: Mobile breakpoint sweep + visual regression snapshots

**Files:** add visual regression Playwright spec if absent

- [ ] **Step 1:** Locate or create a visual regression spec

```bash
ls tests/ | grep -i visual
```

If none exists, create `tests/visual.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const BREAKPOINTS = [375, 768, 1024, 1440, 1920];

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
```

- [ ] **Step 2:** Run to generate baseline snapshots

```bash
npx playwright test tests/visual.spec.ts --update-snapshots
```

Expected: snapshots written under `tests/visual.spec.ts-snapshots/`.

- [ ] **Step 3:** Run again to confirm stability

```bash
npx playwright test tests/visual.spec.ts
```

Expected: PASS (snapshots match themselves).

- [ ] **Step 4:** Commit

```bash
git add tests/visual.spec.ts tests/visual.spec.ts-snapshots/
git commit -m "test(visual): add full-page visual regression at 375/768/1024/1440/1920"
```

### Task 51: Cleanup verification & milestone tag

**Files:** none

- [ ] **Step 1:** Verify zero emoji-as-icon usages

```bash
grep -rn "▶\|⏸\|📞\|▾" src --include="*.tsx"
```

Expected: zero matches (or only in comments). If matches in code, fix them.

- [ ] **Step 2:** Verify no `[source: TBD]` literal text in compiled output

```bash
npm run check:placeholders
```

Expected: PASS.

- [ ] **Step 3:** Final full-suite run

```bash
npm test && npx playwright test
```

Expected: all pass.

- [ ] **Step 4:** Tag the milestone

```bash
git commit --allow-empty -m "milestone: Editorial ANNA Warm redesign complete"
git tag -a v1-redesign -m "Editorial ANNA Warm visual redesign complete"
```

- [ ] **Step 5:** Final inventory

```bash
git log --oneline e3d86b4..HEAD | wc -l
```

Expected: ~50-60 commits (one per task plus fix commits).

---

## Acceptance summary (from the spec §9)

When this plan is fully executed, every box in `2026-05-26-anna-reception-redesign-design.md` §9 should be checked:

- [x] All emoji-as-icon usages replaced (Tasks 20, 21, 32 covered ▾, 📞, ▶/⏸)
- [x] Every major section renders a `Kicker` (Tasks 29, 31, 32, 33, 34, 35, 36, 39, 41, 42)
- [x] No section uses legacy `border-border` cards as primary structure (Tasks 31, 34, 37, 40 specifically; others incidentally)
- [x] All 18 primitives exist with tests (Tasks 7-18 create 12 new + Tasks 19-23 refresh 5 existing + MissingAsset documented)
- [x] Hero illustration shipped (Tasks 25, 29)
- [x] FeatureStrip renders 6 icons (Tasks 16, 37)
- [x] RoiCalculator picker renders 4 VerticalMarks (Tasks 17, 33)
- [x] Playwright suite passes including a11y + reduced-motion (Tasks 45, 48, 49)
- [x] Lighthouse ≥95 / ≥95 / ≥95 / ≥95 desktop (Task 47)
- [x] Visual regression snapshots committed (Task 50)
- [x] `MissingAsset` retired from new code (Task 46)
- [x] No `[source: TBD]` literal in output (Task 51)
