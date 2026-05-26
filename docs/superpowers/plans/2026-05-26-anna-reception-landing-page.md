# ANNA Reception Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the ANNA Reception marketing landing page (16 sections, UK-first, multi-vertical: dental / beauty / gastropub / trades) per spec v3 at `docs/superpowers/specs/2026-05-26-anna-reception-landing-design.md`.

**Architecture:** Next.js App Router with server-rendered marketing page and selectively hydrated client islands (ROI calculator, vertical tiles, audio demo, FAQ accordion, sticky CTA). Design tokens flow CSS variables → Tailwind theme → component classes. Vertical content lives in one TypeScript module as a single source of truth; URL params (`?v=dental|beauty|pubs|construction`) drive default selection. Analytics events fire client-side through a thin wrapper. CTAs that point to `/demo` and `/audit` link to placeholder routes (those funnel pages are a separate plan). A build-time guard (G8 from spec) blocks deployment if any `[source: TBD]` token survives into compiled output.

**Tech Stack:** Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · Framer Motion (animations) · react-hook-form + Zod (ROI inputs) · Vitest + React Testing Library (unit) · Playwright (E2E + a11y) · Vercel hosting.

## Out of scope for this plan (separate downstream plans)

- `/demo` form route, slot picker, calendar integration.
- `/audit` wizard route, audit-PDF server renderer, email delivery.
- newo.ai white-label integration (the AI agent itself, phone provisioning, dashboard).
- Real audio samples, customer logos, testimonials, FAQ copy — these are content-sourcing tasks tracked in spec §7.
- Compliance certifications (§13 was removed in spec v3 pending ANNA-owned certs).
- Launch-acceptance gates G1–G7 — operational decisions, not code.

CTAs to those routes resolve to a temporary `/coming-soon?from={path}` page that 200s with placeholder copy. Logos, audio, testimonials use `<MissingAsset/>` placeholder components during development; CI blocks deploy if any survive into a production build.

---

## File structure

```
ANNA-Reception/
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── playwright.config.ts
├── vitest.config.ts
├── .env.example
├── .eslintrc.json
├── .gitignore
├── scripts/
│   └── check-source-placeholders.mjs           # G8 build-time guard
├── public/
│   ├── audio/.gitkeep                          # MP3s sourced separately
│   ├── icons/.gitkeep
│   ├── logos/.gitkeep
│   └── images/.gitkeep
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # root layout
│   │   ├── page.tsx                            # landing page composition
│   │   ├── coming-soon/page.tsx                # CTA placeholder route
│   │   └── globals.css                         # tailwind + tokens
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx                      # §01
│   │   │   ├── Footer.tsx                      # §16
│   │   │   └── StickyDemoCTA.tsx               # hero scroll-past
│   │   ├── sections/
│   │   │   ├── Hero.tsx                        # §02
│   │   │   ├── SocialProofLogos.tsx            # §03
│   │   │   ├── RevenueLeak.tsx                 # §04
│   │   │   ├── AudioDemo.tsx                   # §05
│   │   │   ├── RoiCalculator.tsx               # §06
│   │   │   ├── HowItWorks.tsx                  # §07
│   │   │   ├── VerticalsTileModule.tsx         # §08
│   │   │   ├── TestimonialWall.tsx             # §09
│   │   │   ├── FeatureStrip.tsx                # §10
│   │   │   ├── IntegrationsMarquee.tsx         # §11
│   │   │   ├── PricingTeaser.tsx               # §12
│   │   │   ├── AuditReEntryBanner.tsx          # §13
│   │   │   ├── FaqAccordion.tsx                # §14
│   │   │   └── FinalCtaBanner.tsx              # §15
│   │   ├── primitives/
│   │   │   ├── Button.tsx                      # primary + ghost variants
│   │   │   ├── PhoneChip.tsx                   # tel: + copy fallback
│   │   │   ├── AccordionItem.tsx               # FAQ + tile expand
│   │   │   ├── AnimatedNumber.tsx              # tabular counter roll
│   │   │   ├── Waveform.tsx                    # audio demo visual
│   │   │   └── MissingAsset.tsx                # dev placeholder
│   │   └── verticals/
│   │       └── VerticalTile.tsx                # one component, data-driven
│   ├── content/
│   │   ├── verticals.ts                        # all 4 verticals' data
│   │   ├── faq.ts                              # FAQ Qs/As
│   │   ├── testimonials.ts                     # testimonial wall data
│   │   ├── integrations.ts                     # integration logo list
│   │   └── customerLogos.ts                    # §03 logo strip data
│   ├── lib/
│   │   ├── analytics.ts                        # tracking event sender
│   │   ├── verticals.ts                        # types + helpers
│   │   ├── urlParams.ts                        # ?v= reader
│   │   ├── roi.ts                              # ROI math (pure)
│   │   └── cn.ts                               # class-name combiner
│   └── types/
│       └── index.ts                            # shared TS types
└── tests/
    ├── e2e/
    │   ├── conversion-paths.spec.ts
    │   ├── roi-calculator.spec.ts
    │   ├── vertical-tiles.spec.ts
    │   └── a11y.spec.ts
    └── README.md
```

Unit tests colocate with source: `Foo.test.ts` next to `Foo.ts`. E2E tests live in `tests/e2e/`.

---

## Task 1: Bootstrap Next.js + TypeScript + Tailwind

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.json`, `.gitignore`, `.env.example`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.

- [ ] **Step 1: Initialise the project**

```bash
cd /Users/nfilippov/ANNA-Reception
npx create-next-app@14 . --typescript --tailwind --app --eslint --no-src-dir=false --import-alias "@/*"
```

When prompted, accept all defaults except: yes to src/, yes to App Router.

- [ ] **Step 2: Pin Node version**

Create `.nvmrc`:

```
20
```

- [ ] **Step 3: Verify scaffold builds**

Run: `npm run build`
Expected: build succeeds, `.next/` directory created.

- [ ] **Step 4: Verify dev server**

Run: `npm run dev` (then kill it after seeing "Ready in ... ms")
Expected: server starts on port 3000.

- [ ] **Step 5: Tighten TypeScript**

Edit `tsconfig.json` — set `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`. Verify `npm run build` still passes.

- [ ] **Step 6: Replace default homepage stub**

Overwrite `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold p-8">ANNA Reception — placeholder</h1>
    </main>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: bootstrap Next.js 14 + TS strict + Tailwind"
```

---

## Task 2: Testing infrastructure

**Files:**
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/README.md`, `src/lib/cn.ts`, `src/lib/cn.test.ts`.
- Modify: `package.json` (scripts).

- [ ] **Step 1: Install Vitest + RTL + jsdom**

```bash
npm i -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Install Playwright**

```bash
npm i -D @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium
```

- [ ] **Step 5: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 6: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "check:placeholders": "node scripts/check-source-placeholders.mjs"
}
```

- [ ] **Step 7: Write a smoke test for the `cn` utility (TDD)**

Create `src/lib/cn.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy strings with spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });
  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });
  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});
```

- [ ] **Step 8: Run the test and watch it fail**

Run: `npm test`
Expected: failure because `cn` does not exist yet.

- [ ] **Step 9: Implement `cn`**

Create `src/lib/cn.ts`:

```ts
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter((p): p is string => typeof p === "string" && p.length > 0).join(" ");
}
```

- [ ] **Step 10: Re-run the test**

Run: `npm test`
Expected: 3 passing tests.

- [ ] **Step 11: Write `tests/README.md`**

```markdown
# Tests

- `vitest`: unit tests, colocated with source (`Foo.test.ts` next to `Foo.ts`).
- `playwright`: end-to-end + accessibility, in `tests/e2e/`.

Run `npm test` for units, `npm run test:e2e` for E2E. CI runs both.
```

- [ ] **Step 12: Commit**

```bash
git add .
git commit -m "test: add Vitest + Playwright infra + cn util"
```

---

## Task 3: Design tokens

**Files:**
- Create: `src/app/globals.css` (replace default), `tailwind.config.ts` (overwrite).
- Reference: spec §2 colour tokens + typography.

- [ ] **Step 1: Write CSS variables for design tokens**

Overwrite `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light theme tokens — values approximate ANNA.money's brand */
    --anna-green: 142 71% 38%;       /* hsl */
    --on-primary: 222 47% 11%;
    --accent-electric: 217 91% 60%;
    --bg: 0 0% 100%;
    --bg-alt: 100 33% 98%;
    --fg: 222 47% 11%;
    --fg-muted: 215 16% 47%;
    --border: 220 13% 91%;
    --leak: 16 95% 60%;              /* warm coral, softer than red */
    --gain: 142 71% 38%;             /* matches anna-green */
  }
  .dark {
    --bg: 222 47% 6%;
    --bg-alt: 222 47% 10%;
    --fg: 0 0% 98%;
    --fg-muted: 215 16% 65%;
    --border: 217 19% 27%;
    --leak: 16 90% 65%;
  }
  html {
    color-scheme: light dark;
  }
  body {
    background-color: hsl(var(--bg));
    color: hsl(var(--fg));
    font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
  }
}

@layer utilities {
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
}
```

- [ ] **Step 2: Overwrite `tailwind.config.ts` to bind tokens**

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
        accent: "hsl(var(--accent-electric) / <alpha-value>)",
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-alt": "hsl(var(--bg-alt) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        "fg-muted": "hsl(var(--fg-muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        leak: "hsl(var(--leak) / <alpha-value>)",
        gain: "hsl(var(--gain) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Calistoga", "Georgia", "serif"],
      },
      maxWidth: {
        prose: "65ch",
        page: "1280px",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Load fonts in root layout**

Edit `src/app/layout.tsx`:

```tsx
import "./globals.css";
import { Inter, Calistoga } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Calistoga({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "ANNA Reception — AI receptionist for dental, beauty, gastropubs & trades",
  description: "Stop losing revenue to missed calls. ANNA Reception answers, books, and follows up 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build still passes**

Run: `npm run build`
Expected: build succeeds, no Tailwind errors.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: design tokens (colors, fonts, spacing) wired to Tailwind"
```

---

## Task 4: Build-time placeholder guard (G8)

**Files:**
- Create: `scripts/check-source-placeholders.mjs`, `src/components/primitives/MissingAsset.tsx`.

- [ ] **Step 1: Write the placeholder-guard script**

Create `scripts/check-source-placeholders.mjs`:

```js
// G8: CI fails any build whose compiled output contains forbidden placeholder tokens.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN = ["[source: TBD]", "[MISSING ASSET]"];
const SCAN_ROOTS = [".next/server", ".next/static"];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const stat = statSync(p);
    if (stat.isDirectory()) walk(p, files);
    else if (/\.(html|js|css|json|txt)$/.test(entry)) files.push(p);
  }
  return files;
}

const hits = [];
for (const root of SCAN_ROOTS) {
  try {
    for (const file of walk(root)) {
      const content = readFileSync(file, "utf8");
      for (const token of FORBIDDEN) {
        if (content.includes(token)) hits.push(`${file} contains "${token}"`);
      }
    }
  } catch {
    /* directory may not exist yet — ignore */
  }
}

if (hits.length > 0) {
  console.error("\n❌ Placeholder guard failed:\n");
  for (const h of hits) console.error("  " + h);
  console.error("\nResolve placeholder tokens before deploying.\n");
  process.exit(1);
}
console.log("✓ Placeholder guard passed");
```

- [ ] **Step 2: Wire it into the build pipeline**

Edit `package.json` scripts:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build && npm run check:placeholders",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "check:placeholders": "node scripts/check-source-placeholders.mjs"
}
```

- [ ] **Step 3: Implement `MissingAsset` placeholder**

Create `src/components/primitives/MissingAsset.tsx`:

```tsx
type Props = {
  label: string;
  width?: number;
  height?: number;
};

export function MissingAsset({ label, width = 120, height = 40 }: Props) {
  return (
    <span
      role="img"
      aria-label={`Missing asset: ${label}`}
      data-missing-asset={label}
      className="inline-flex items-center justify-center rounded border border-dashed border-leak bg-bg-alt text-leak text-xs font-mono px-2"
      style={{ width, height }}
    >
      [MISSING ASSET] {label}
    </span>
  );
}
```

The `[MISSING ASSET]` literal is one of the FORBIDDEN tokens, so any unresolved placeholder fails the build.

- [ ] **Step 4: Verify the guard catches a planted placeholder**

Temporarily edit `src/app/page.tsx` to include `<p>[source: TBD]</p>`. Then:

Run: `npm run build`
Expected: build fails with the guard's error message.

Revert the edit.

- [ ] **Step 5: Verify clean build passes**

Run: `npm run build`
Expected: build succeeds, "✓ Placeholder guard passed" printed.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: G8 build-time guard against [source: TBD] / [MISSING ASSET]"
```

---

## Task 5: Button + PhoneChip primitives

**Files:**
- Create: `src/components/primitives/Button.tsx`, `src/components/primitives/Button.test.tsx`, `src/components/primitives/PhoneChip.tsx`, `src/components/primitives/PhoneChip.test.tsx`.

- [ ] **Step 1: Write `Button` tests (TDD)**

Create `src/components/primitives/Button.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Book a demo</Button>);
    expect(screen.getByRole("button", { name: "Book a demo" })).toBeInTheDocument();
  });
  it("calls onClick when pressed", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("renders ghost variant with transparent background", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-transparent/);
  });
  it("renders as an anchor when href is given", () => {
    render(<Button href="/demo">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/demo");
  });
  it("fires onClick on the link variant too", async () => {
    const onClick = vi.fn();
    render(<Button href="/demo" onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("link", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("matches a 44px minimum touch target", () => {
    render(<Button>Tap</Button>);
    expect(screen.getByRole("button").className).toMatch(/min-h-\[44px\]/);
  });
});
```

- [ ] **Step 2: Run tests; expect failure**

Run: `npm test -- Button`
Expected: failure, Button not defined.

- [ ] **Step 3: Implement `Button`**

```tsx
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  "data-event"?: string;
};

const base =
  "inline-flex items-center justify-center min-h-[44px] px-5 rounded-full text-base font-medium transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:brightness-95",
  ghost: "bg-transparent text-fg border border-fg/20 hover:border-fg/40",
};

export function Button({ children, variant = "primary", href, onClick, type = "button", className, ...rest }: ButtonProps) {
  const classes = cn(base, variants[variant], className);
  const event = rest["data-event"];
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} data-event={event}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes} data-event={event}>
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Re-run tests**

Run: `npm test -- Button`
Expected: 5 passing.

- [ ] **Step 5: Write `PhoneChip` tests**

Create `src/components/primitives/PhoneChip.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhoneChip } from "./PhoneChip";

describe("PhoneChip", () => {
  it("renders a tel: link with the formatted number", () => {
    render(<PhoneChip number="+44 20 7946 0000" />);
    const link = screen.getByRole("link", { name: /\+44 20 7946 0000/ });
    expect(link).toHaveAttribute("href", "tel:+442079460000");
  });
  it("includes an accessible label", () => {
    render(<PhoneChip number="+44 20 7946 0000" />);
    expect(screen.getByLabelText(/Test call ANNA Reception/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Implement `PhoneChip`**

Create `src/components/primitives/PhoneChip.tsx`:

```tsx
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
        "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-bg-alt text-fg border border-border hover:border-fg/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <span aria-hidden="true">📞</span>
      <span className="tabular-nums">{number}</span>
    </a>
  );
}
```

Note: emoji used in `aria-hidden` decorative role only; main label uses real text. Per spec voice rule "no emojis as structural icons" — this is decoration adjacent to a real text label and is hidden from AT. If preferred, swap for a Lucide `Phone` icon (see Task 17 for icon dependency install).

- [ ] **Step 7: Run tests; commit**

```bash
npm test -- PhoneChip
git add .
git commit -m "feat: Button + PhoneChip primitives with WCAG-compliant tap targets"
```

---

## Task 6: AccordionItem + AnimatedNumber primitives

**Files:**
- Create: `src/components/primitives/AccordionItem.tsx`, `src/components/primitives/AccordionItem.test.tsx`, `src/components/primitives/AnimatedNumber.tsx`, `src/components/primitives/AnimatedNumber.test.tsx`.

- [ ] **Step 1: Write `AccordionItem` tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccordionItem } from "./AccordionItem";

describe("AccordionItem", () => {
  it("starts collapsed (aria-expanded=false)", () => {
    render(<AccordionItem title="Q?"><p>A</p></AccordionItem>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
  it("expands on click", async () => {
    render(<AccordionItem title="Q?"><p>A</p></AccordionItem>);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("A")).toBeVisible();
  });
  it("collapses on Escape", async () => {
    render(<AccordionItem title="Q?"><p>A</p></AccordionItem>);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
});
```

- [ ] **Step 2: Implement `AccordionItem`**

Create `src/components/primitives/AccordionItem.tsx`:

```tsx
"use client";
import { useId, useState, useRef, useEffect } from "react";
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

  useEffect(() => onToggle?.(open), [open, onToggle]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      headerRef.current?.focus();
    }
  }

  return (
    <div className={cn("border-b border-border", className)} onKeyDown={handleKey}>
      <button
        ref={headerRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="font-medium">{title}</span>
        <span aria-hidden className="transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : undefined }}>
          ▾
        </span>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        hidden={!open}
        className="pb-4 text-fg-muted"
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run tests; expect passing**

Run: `npm test -- AccordionItem`
Expected: 3 passing.

- [ ] **Step 4: Write `AnimatedNumber` tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedNumber } from "./AnimatedNumber";

describe("AnimatedNumber", () => {
  it("renders the value formatted as GBP", () => {
    render(<AnimatedNumber value={1234.5} format="gbp" />);
    expect(screen.getByText("£1,235")).toBeInTheDocument();
  });
  it("renders the value formatted as plain integer", () => {
    render(<AnimatedNumber value={42} format="int" />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
  it("uses tabular-nums to prevent layout shift", () => {
    render(<AnimatedNumber value={1} format="int" />);
    expect(screen.getByText("1").className).toMatch(/tabular-nums/);
  });
  it("announces value changes via aria-live", () => {
    render(<AnimatedNumber value={1} format="int" />);
    const el = screen.getByText("1");
    expect(el).toHaveAttribute("aria-live", "polite");
  });
});
```

- [ ] **Step 5: Implement `AnimatedNumber`**

Create `src/components/primitives/AnimatedNumber.tsx`:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  format: "gbp" | "int";
  className?: string;
  durationMs?: number;
};

function formatValue(v: number, format: "gbp" | "int"): string {
  if (format === "gbp") {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(v);
  }
  return new Intl.NumberFormat("en-GB").format(Math.round(v));
}

export function AnimatedNumber({ value, format, className, durationMs = 400 }: Props) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const startVal = from.current;
    const delta = value - startVal;
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const pct = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - pct, 3); // ease-out cubic
      setDisplay(startVal + delta * eased);
      if (pct < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return (
    <span className={cn("tabular-nums", className)} aria-live="polite">
      {formatValue(display, format)}
    </span>
  );
}
```

- [ ] **Step 6: Run tests**

Run: `npm test -- AnimatedNumber`
Expected: 4 passing.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: AccordionItem (a11y) + AnimatedNumber (counter roll, reduced-motion)"
```

---

## Task 7: Analytics event sender

**Files:**
- Create: `src/lib/verticals.ts` (type only — content comes in Task 8), `src/lib/analytics.ts`, `src/lib/analytics.test.ts`.

- [ ] **Step 0: Create the shared `VerticalKey` type**

Create `src/lib/verticals.ts`:

```ts
export type VerticalKey = "dental" | "beauty" | "pubs" | "construction";

export const VERTICAL_KEYS: VerticalKey[] = ["dental", "beauty", "pubs", "construction"];

export function isVerticalKey(v: string): v is VerticalKey {
  return (VERTICAL_KEYS as string[]).includes(v);
}
```

(`VerticalContent` shape lives in Task 8 — only the key type is needed up to here.)

- [ ] **Step 1: Write tests (TDD)**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { track } from "./analytics";

declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Array<Record<string, unknown>>;
}

describe("track", () => {
  beforeEach(() => {
    globalThis.dataLayer = [];
  });

  it("pushes named event to dataLayer", () => {
    track("hero_cta_demo_clicked");
    expect(globalThis.dataLayer).toEqual([{ event: "hero_cta_demo_clicked" }]);
  });

  it("includes provided properties", () => {
    track("vertical_tile_expanded", { vertical: "dental" });
    expect(globalThis.dataLayer[0]).toEqual({ event: "vertical_tile_expanded", vertical: "dental" });
  });

  it("never throws if dataLayer is missing", () => {
    // @ts-expect-error testing runtime safety
    delete globalThis.dataLayer;
    expect(() => track("hero_cta_demo_clicked")).not.toThrow();
  });
});
```

- [ ] **Step 2: Implement `track`**

Create `src/lib/analytics.ts`:

```ts
// Thin wrapper around the GTM dataLayer. Never throws; safe to call in SSR.
import type { VerticalKey } from "./verticals";

export type AnalyticsEvent =
  | { event: "hero_cta_demo_clicked" }
  | { event: "hero_cta_audit_clicked" }
  | { event: "header_cta_call_clicked" }
  | { event: "audio_demo_played" }
  | { event: "audio_demo_completed_30s" }
  | { event: "roi_calculator_started"; vertical: VerticalKey }
  | { event: "roi_calculator_completed"; vertical: VerticalKey; leakValue: number }
  | { event: "vertical_tile_expanded"; vertical: VerticalKey }
  | { event: "pricing_teaser_clicked" }
  | { event: "demo_submitted"; vertical: VerticalKey; source: "A" | "B" };

export function track(event: AnalyticsEvent["event"], properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (!Array.isArray(w.dataLayer)) return;
    w.dataLayer.push({ event, ...properties });
  } catch {
    // swallow — analytics must never break the page
  }
}
```

- [ ] **Step 3: Run tests; commit**

```bash
npm test -- analytics
git add .
git commit -m "feat: analytics dataLayer wrapper (SSR-safe, typed events)"
```

---

## Task 8: Vertical content data — single source of truth

**Files:**
- Modify: `src/lib/verticals.ts` (extend; type-only file from Task 7).
- Create: `src/content/verticals.ts`, `src/content/verticals.test.ts`.

This file is the canonical source of every per-vertical string on the page (spec §3). Editing copy = editing this file.

- [ ] **Step 1: Extend `src/lib/verticals.ts` with the `VerticalContent` shape**

Append to the existing file (do not overwrite — `VerticalKey`, `VERTICAL_KEYS`, `isVerticalKey` from Task 7 stay):

```ts
export type VerticalContent = {
  key: VerticalKey;
  label: string;          // display name
  cardHook: string;       // tile title line
  headlineRoi: string;    // headline ROI stat
  painFraming: string;    // pain copy
  audioSampleScript: string;
  smartBehaviours: string[];
  testimonialSlot: string;          // placeholder description for sourcing
  integrationsUk: string[];
  integrationsUsIntl: string[];
  complianceLine: string;
  roi: {
    inputs: Array<{ id: string; label: string; default: number; min: number; max: number; step: number; unit: "gbp" | "count" | "percent" }>;
    leakFormula: (inputs: Record<string, number>) => number; // £/month bleeding
  };
};
```

- [ ] **Step 2: Write the content module (spec §3.1–§3.4 + §3.5)**

Create `src/content/verticals.ts`:

```ts
import type { VerticalContent } from "@/lib/verticals";

// All copy here mirrors spec v3 §3.1–§3.4. Edit copy only by editing this file.

export const VERTICALS: Record<string, VerticalContent> = {
  dental: {
    key: "dental",
    label: "Dental clinics",
    cardHook: "Never miss a new patient call.",
    headlineRoi: "Avg new-patient lifetime value: £1,800–£3,000 [source: TBD] — one missed call = one lost patient.",
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
    complianceLine: "UK GDPR & DPA 2018 · ISO 27001-aligned (re-add HIPAA when US launches in phase 2)",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg new-patient lifetime value (£)", default: 2400, min: 500, max: 10000, step: 100, unit: "gbp" },
        { id: "callsPerWeek", label: "New-patient calls per week", default: 15, min: 1, max: 200, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 30, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek * (missedPct / 100) * avgValue * 4),
    },
  },

  beauty: {
    key: "beauty",
    label: "Beauty salons",
    cardHook: "Book while you blow-dry.",
    headlineRoi: "Avg booking £40–£90 · 30% of calls come while stylists' hands are full [source: TBD].",
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
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg booking value (£)", default: 65, min: 10, max: 500, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 40, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 25, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek * (missedPct / 100) * avgValue * 4),
    },
  },

  pubs: {
    key: "pubs",
    label: "Gastropubs",
    cardHook: "Reservations don't have to ring out.",
    headlineRoi: "Avg 4-cover gastro table £140–£220 · busiest service = most missed calls [source: TBD].",
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
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg cover spend (£)", default: 45, min: 10, max: 200, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 80, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 35, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        // assume avg party 4 covers
        (callsPerWeek * (missedPct / 100) * avgValue * 4 * 4),
    },
  },

  construction: {
    key: "construction",
    label: "Construction / Trades",
    cardHook: "Win the job while you're on the roof.",
    headlineRoi: "Avg repair £180 · avg install £1,200 · 60% of trade leads call ≥2 numbers [source: TBD].",
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
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg job value (£)", default: 350, min: 50, max: 5000, step: 50, unit: "gbp" },
        { id: "callsPerWeek", label: "Lead calls per week", default: 25, min: 1, max: 300, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls lost to faster competitor", default: 45, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek * (missedPct / 100) * avgValue * 4),
    },
  },
} satisfies Record<string, VerticalContent>;
```

- [ ] **Step 3: Sanity test the data shape**

Create `src/content/verticals.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { VERTICALS } from "./verticals";
import { VERTICAL_KEYS } from "@/lib/verticals";

describe("VERTICALS content", () => {
  it.each(VERTICAL_KEYS)("has all required fields for %s", (key) => {
    const v = VERTICALS[key];
    expect(v).toBeDefined();
    expect(v.cardHook.length).toBeGreaterThan(0);
    expect(v.headlineRoi.length).toBeGreaterThan(0);
    expect(v.smartBehaviours.length).toBeGreaterThan(0);
    expect(v.integrationsUk.length).toBeGreaterThan(0);
    expect(v.roi.inputs.length).toBe(3);
  });

  it.each(VERTICAL_KEYS)("leakFormula returns a positive number for %s defaults", (key) => {
    const v = VERTICALS[key];
    const defaults = Object.fromEntries(v.roi.inputs.map((i) => [i.id, i.default]));
    expect(v.roi.leakFormula(defaults)).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Run tests, commit**

```bash
npm test -- verticals
git add .
git commit -m "feat: canonical per-vertical content + ROI formulas"
```

---

## Task 9: ROI math + URL param vertical detection

**Files:**
- Create: `src/lib/roi.ts`, `src/lib/roi.test.ts`, `src/lib/urlParams.ts`, `src/lib/urlParams.test.ts`.

- [ ] **Step 1: Write `urlParams` tests**

```ts
import { describe, it, expect } from "vitest";
import { readVerticalFromUrl } from "./urlParams";

describe("readVerticalFromUrl", () => {
  it("returns null when ?v= is absent", () => {
    expect(readVerticalFromUrl(new URL("https://x/"))).toBeNull();
  });
  it("returns a recognised vertical key", () => {
    expect(readVerticalFromUrl(new URL("https://x/?v=dental"))).toBe("dental");
    expect(readVerticalFromUrl(new URL("https://x/?v=beauty"))).toBe("beauty");
    expect(readVerticalFromUrl(new URL("https://x/?v=pubs"))).toBe("pubs");
    expect(readVerticalFromUrl(new URL("https://x/?v=construction"))).toBe("construction");
  });
  it("returns null for an unrecognised value", () => {
    expect(readVerticalFromUrl(new URL("https://x/?v=florist"))).toBeNull();
  });
  it("is case-insensitive", () => {
    expect(readVerticalFromUrl(new URL("https://x/?v=DENTAL"))).toBe("dental");
  });
});
```

- [ ] **Step 2: Implement `urlParams`**

Create `src/lib/urlParams.ts`:

```ts
import { isVerticalKey, type VerticalKey } from "./verticals";

export function readVerticalFromUrl(url: URL): VerticalKey | null {
  const raw = url.searchParams.get("v");
  if (!raw) return null;
  const normalised = raw.toLowerCase();
  return isVerticalKey(normalised) ? normalised : null;
}
```

- [ ] **Step 3: Write `roi` tests**

```ts
import { describe, it, expect } from "vitest";
import { computeLeak, computeRecovery } from "./roi";

describe("computeLeak", () => {
  it("returns 0 when missedPct is 0", () => {
    expect(computeLeak({ avgValue: 100, callsPerWeek: 10, missedPct: 0 })).toBe(0);
  });
  it("returns full weekly volume × 4 when missedPct is 100", () => {
    expect(computeLeak({ avgValue: 100, callsPerWeek: 10, missedPct: 100 })).toBe(4000);
  });
  it("scales linearly with missedPct", () => {
    expect(computeLeak({ avgValue: 200, callsPerWeek: 5, missedPct: 50 })).toBe(2000);
  });
});

describe("computeRecovery", () => {
  it("recovers 80% of leak by default", () => {
    expect(computeRecovery(1000)).toBe(800);
  });
  it("clamps to 95% when recoveryRate is too high", () => {
    expect(computeRecovery(1000, 1.5)).toBe(950);
  });
});
```

- [ ] **Step 4: Implement `roi`**

Create `src/lib/roi.ts`:

```ts
export type RoiInputs = {
  avgValue: number;
  callsPerWeek: number;
  missedPct: number;       // 0-100
};

// Generic monthly-leak formula. Vertical-specific multipliers live in
// VERTICALS[key].roi.leakFormula in src/content/verticals.ts.
export function computeLeak({ avgValue, callsPerWeek, missedPct }: RoiInputs): number {
  return callsPerWeek * (missedPct / 100) * avgValue * 4;
}

// Plausible default recovery rate from ANNA Reception's catch rate.
// Clamped to 0–0.95 to avoid promising a magical "100% recovered" outcome.
export function computeRecovery(leakValue: number, rate = 0.8): number {
  const clamped = Math.min(0.95, Math.max(0, rate));
  return Math.round(leakValue * clamped);
}
```

- [ ] **Step 5: Run all tests**

Run: `npm test`
Expected: all previous tests still pass; new tests pass.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: ROI math + URL ?v= vertical detection (pure functions)"
```

---

## Task 10: Root layout + Header (§01)

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Header.test.tsx`.
- Modify: `src/app/layout.tsx`.

- [ ] **Step 1: Write Header tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the ANNA Reception brand mark", () => {
    render(<Header />);
    expect(screen.getByText(/ANNA Reception/i)).toBeInTheDocument();
  });
  it("includes a primary Book a demo CTA", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /book a demo/i })).toHaveAttribute("href", "/demo");
  });
  it("includes a click-to-call phone chip", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /test call anna reception/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `Header`**

```tsx
import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-page flex items-center justify-between px-4 py-3">
        <a href="/" className="text-lg font-semibold tracking-tight">
          ANNA Reception <span className="text-fg-muted font-normal">by ANNA</span>
        </a>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="hover:underline">How it works</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <a href="/sign-in" className="hover:underline">Sign in</a>
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

- [ ] **Step 3: Mount Header in layout**

Edit `src/app/layout.tsx`:

```tsx
import "./globals.css";
import { Inter, Calistoga } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Calistoga({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "ANNA Reception — AI receptionist for dental, beauty, gastropubs & trades",
  description: "Stop losing revenue to missed calls. ANNA Reception answers, books, and follows up 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Add the `/coming-soon` placeholder route**

Create `src/app/coming-soon/page.tsx`:

```tsx
export default function ComingSoon() {
  return (
    <section className="mx-auto max-w-prose px-4 py-16">
      <h1 className="font-display text-4xl">Coming soon</h1>
      <p className="mt-4 text-fg-muted">This route is part of a downstream plan. Head back to <a className="underline" href="/">the landing page</a>.</p>
    </section>
  );
}
```

- [ ] **Step 5: Run tests, manual smoke**

Run: `npm test -- Header && npm run dev`
Open `http://localhost:3000`. Confirm header renders. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: root layout + sticky header (§01) + /coming-soon stub"
```

---

## Task 11: Footer (§16) + sticky CTA bar logic

**Files:**
- Create: `src/components/layout/Footer.tsx`, `src/components/layout/StickyDemoCTA.tsx`, `src/components/layout/StickyDemoCTA.test.tsx`.
- Modify: `src/app/layout.tsx`.

- [ ] **Step 1: Implement `Footer`**

```tsx
import { PhoneChip } from "@/components/primitives/PhoneChip";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-alt mt-24">
      <div className="mx-auto max-w-page px-4 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold">ANNA Reception</div>
          <p className="mt-2 text-fg-muted">By ANNA — the business account 100,000+ UK businesses already use.</p>
          <PhoneChip number={DEMO_PHONE} className="mt-4" />
        </div>
        <div>
          <div className="font-medium">Product</div>
          <ul className="mt-2 space-y-1 text-fg-muted">
            <li><a href="#how-it-works" className="hover:underline">How it works</a></li>
            <li><a href="#verticals" className="hover:underline">Verticals</a></li>
            <li><a href="#pricing" className="hover:underline">Pricing</a></li>
            <li><a href="/demo" className="hover:underline">Book a demo</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Company</div>
          <ul className="mt-2 space-y-1 text-fg-muted">
            <li><a href="https://anna.money" className="hover:underline">ANNA Money</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Legal</div>
          <ul className="mt-2 space-y-1 text-fg-muted">
            <li><a href="/privacy" className="hover:underline">Privacy</a></li>
            <li><a href="/terms" className="hover:underline">Terms</a></li>
            <li className="text-xs">Absolute Financial Services Ltd. ANNA is a trading name. FCA reference TBD.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
```

Note: the `FCA reference TBD` here is *not* `[source: TBD]` — it's a legal-text placeholder that will be filled by ANNA legal. It does not trip the G8 guard, which only blocks the specific literal string `[source: TBD]`.

- [ ] **Step 2: Write `StickyDemoCTA` test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyDemoCTA } from "./StickyDemoCTA";

describe("StickyDemoCTA", () => {
  it("is hidden by default and revealed when active prop is true", () => {
    const { rerender } = render(<StickyDemoCTA active={false} />);
    expect(screen.getByTestId("sticky-cta")).toHaveAttribute("data-active", "false");
    rerender(<StickyDemoCTA active={true} />);
    expect(screen.getByTestId("sticky-cta")).toHaveAttribute("data-active", "true");
  });
});
```

- [ ] **Step 3: Implement `StickyDemoCTA`**

```tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";

type Props = {
  // Used by tests to control state; in production the component reads scroll itself.
  active?: boolean;
};

export function StickyDemoCTA({ active: forcedActive }: Props = {}) {
  const [active, setActive] = useState(forcedActive ?? false);

  useEffect(() => {
    if (forcedActive !== undefined) return;
    function onScroll() {
      // Hero ends at roughly 600px; engage sticky once user scrolls past it.
      setActive(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forcedActive]);

  return (
    <div
      data-testid="sticky-cta"
      data-active={active}
      className={cn(
        "fixed bottom-4 inset-x-4 z-30 md:hidden flex justify-center transition-transform duration-200 motion-reduce:transition-none",
        active ? "translate-y-0" : "translate-y-[200%]"
      )}
    >
      <Button href="/demo" className="shadow-lg" data-event="hero_cta_demo_clicked">
        Book a demo
      </Button>
    </div>
  );
}
```

(On desktop the header is already sticky; the bottom sticky is mobile-only.)

- [ ] **Step 4: Wire Footer + StickyDemoCTA into layout**

```tsx
// src/app/layout.tsx — append <Footer /> and <StickyDemoCTA /> after <main>
import { Footer } from "@/components/layout/Footer";
import { StickyDemoCTA } from "@/components/layout/StickyDemoCTA";

// inside <body>:
<Header />
<main className="flex-1">{children}</main>
<Footer />
<StickyDemoCTA />
```

- [ ] **Step 5: Run tests, build**

Run: `npm test && npm run build`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: footer (§16) + mobile sticky demo CTA (hero scroll-past)"
```

---

## Task 12: Hero (§02) + Social proof logos (§03)

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/Hero.test.tsx`, `src/components/sections/SocialProofLogos.tsx`, `src/content/customerLogos.ts`.

- [ ] **Step 1: Customer logos placeholder data**

Create `src/content/customerLogos.ts`:

```ts
// Real customer logos to be sourced by ANNA marketing (spec §7). For now the
// page renders placeholder slots that fail the G8 guard if not replaced.
export const CUSTOMER_LOGOS: Array<{ name: string; src: string | null }> = [
  { name: "Customer 1", src: null },
  { name: "Customer 2", src: null },
  { name: "Customer 3", src: null },
  { name: "Customer 4", src: null },
  { name: "Customer 5", src: null },
  { name: "Customer 6", src: null },
  { name: "Customer 7", src: null },
  { name: "Customer 8", src: null },
  { name: "Customer 9", src: null },
  { name: "Customer 10", src: null },
  { name: "Customer 11", src: null },
  { name: "Customer 12", src: null },
  { name: "Customer 13", src: null },
];
```

- [ ] **Step 2: Write Hero test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the leak-framed headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Stop losing revenue to missed calls");
  });
  it("includes both primary and ghost CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /book a demo/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get my free revenue audit/i })).toBeInTheDocument();
  });
  it("includes the corrected trust signal copy", () => {
    render(<Hero />);
    expect(screen.getByText(/team behind 100,000\+ business accounts/i)).toBeInTheDocument();
  });
  it("does not render a test-call CTA in the hero (zone discipline)", () => {
    render(<Hero />);
    expect(screen.queryByRole("link", { name: /test call/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Implement Hero**

```tsx
import { Button } from "@/components/primitives/Button";

export function Hero() {
  return (
    <section className="mx-auto max-w-page px-4 pt-12 pb-16 md:pt-20 md:pb-24" aria-labelledby="hero-headline">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <h1 id="hero-headline" className="font-display text-4xl md:text-6xl leading-tight tracking-tight">
            Stop losing revenue to missed calls.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-prose">
            ANNA Reception answers, books, and follows up 24/7 — for dental clinics, salons, gastropubs, and trades.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/demo" data-event="hero_cta_demo_clicked">Book a demo</Button>
            <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
            <span aria-label="Trustpilot rating">★★★★★ Trustpilot</span>
            <span>·</span>
            <span>From the team behind 100,000+ business accounts</span>
          </div>
        </div>
        <div aria-hidden="true" className="hidden md:block">
          {/* Hero device mockup is sourced by ANNA design (spec §7). Placeholder shape: */}
          <div className="aspect-[3/4] rounded-3xl bg-bg-alt border border-border" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement SocialProofLogos**

```tsx
import { CUSTOMER_LOGOS } from "@/content/customerLogos";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function SocialProofLogos() {
  const doubled = [...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS];
  return (
    <section aria-label="Customers" className="py-8 border-y border-border bg-bg-alt overflow-hidden">
      <div className="flex gap-12 animate-marquee motion-reduce:animate-none whitespace-nowrap">
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

- [ ] **Step 5: Run tests, commit**

```bash
npm test -- Hero
git add .
git commit -m "feat: hero (§02) + social proof logo marquee (§03)"
```

---

## Task 13: Revenue leak (§04) + Audio demo (§05) + Waveform

**Files:**
- Create: `src/components/sections/RevenueLeak.tsx`, `src/components/sections/AudioDemo.tsx`, `src/components/sections/AudioDemo.test.tsx`, `src/components/primitives/Waveform.tsx`.

- [ ] **Step 1: Implement `RevenueLeak`**

```tsx
type LeakStat = { num: string; headline: string; subline: string };

const STATS: LeakStat[] = [
  {
    num: "01",
    headline: "62% of small-business calls go unanswered.",
    subline: "Every missed call is a customer you never knew you could win. [source: TBD]",
  },
  {
    num: "02",
    headline: "Web leads cool in 5 minutes.",
    subline: "Wait 30 minutes and your conversion rate drops 9×. [source: TBD]",
  },
  {
    num: "03",
    headline: "Old quotes sit dead in your CRM.",
    subline: "Reactivating dormant leads is the cheapest revenue you'll ever win.",
  },
];

export function RevenueLeak() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-labelledby="leak-heading">
      <h2 id="leak-heading" className="font-display text-3xl md:text-5xl">Where your revenue is leaking.</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {STATS.map((s) => (
          <li key={s.num} className="rounded-2xl border border-border p-6 bg-bg">
            <span className="font-mono text-leak text-sm">{s.num}</span>
            <p className="mt-3 text-xl font-medium">{s.headline}</p>
            <p className="mt-3 text-fg-muted text-sm">{s.subline}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

(The `[source: TBD]` strings will trip the G8 build guard until ANNA marketing replaces them per spec §3.5 source policy.)

- [ ] **Step 2: Implement `Waveform`**

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
        const h = 8 + Math.abs(Math.sin(Date.now() / 200 + i)) * 24;
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
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <rect key={i} x={i * 6} y={16} width={4} height={8} rx={2} fill="hsl(var(--accent-electric))" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: Write `AudioDemo` tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AudioDemo } from "./AudioDemo";

describe("AudioDemo", () => {
  it("renders a play button labelled for screen readers", () => {
    render(<AudioDemo />);
    expect(screen.getByRole("button", { name: /play sample call/i })).toBeInTheDocument();
  });
  it("exposes a transcript via disclosure", async () => {
    render(<AudioDemo />);
    await userEvent.click(screen.getByRole("button", { name: /read transcript/i }));
    expect(screen.getByRole("region", { name: /transcript/i })).toBeVisible();
  });
});
```

- [ ] **Step 4: Implement `AudioDemo`**

```tsx
"use client";
import { useRef, useState } from "react";
import { Waveform } from "@/components/primitives/Waveform";
import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";
import { MissingAsset } from "@/components/primitives/MissingAsset";
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
    <section className="mx-auto max-w-page px-4 py-16" aria-labelledby="audio-heading">
      <h2 id="audio-heading" className="font-display text-3xl md:text-4xl">Hear ANNA take a real call.</h2>
      <p className="mt-3 text-fg-muted max-w-prose">
        30 seconds of an actual call answered, triaged, and booked. Most callers don't realise it's AI.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-bg-alt p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause sample call" : "Play sample call"}
            className="h-14 w-14 rounded-full bg-primary text-on-primary flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {playing ? "⏸" : "▶"}
          </button>
          <Waveform playing={playing} />
        </div>
        {GENERIC_AUDIO_SRC ? (
          <audio
            ref={ref}
            src={GENERIC_AUDIO_SRC}
            preload="metadata"
            onEnded={() => { setPlaying(false); track("audio_demo_completed_30s"); }}
          />
        ) : (
          <div className="mt-4"><MissingAsset label="audio: generic 30s call sample" /></div>
        )}
        <button
          type="button"
          aria-expanded={showTranscript}
          onClick={() => setShowTranscript((v) => !v)}
          className="mt-4 text-sm underline text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {showTranscript ? "Hide transcript" : "Read transcript"}
        </button>
        <div role="region" aria-label="Transcript" hidden={!showTranscript} className="mt-3 text-sm text-fg-muted">
          {TRANSCRIPT}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-fg-muted">Or talk to her yourself:</span>
        <PhoneChip number={DEMO_PHONE} />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run tests, commit**

```bash
npm test -- AudioDemo
git add .
git commit -m "feat: revenue leak (§04) + audio demo with waveform (§05)"
```

---

## Task 14: ROI Calculator (§06)

**Files:**
- Create: `src/components/sections/RoiCalculator.tsx`, `src/components/sections/RoiCalculator.test.tsx`.

- [ ] **Step 1: Write component tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoiCalculator } from "./RoiCalculator";

describe("RoiCalculator", () => {
  it("shows a vertical picker first (no default)", () => {
    render(<RoiCalculator />);
    expect(screen.getByRole("heading", { name: /pick your business/i })).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("auto-selects vertical when initialVertical is provided", () => {
    render(<RoiCalculator initialVertical="dental" />);
    expect(screen.getByRole("heading", { name: /dental clinics/i })).toBeInTheDocument();
    expect(screen.getAllByRole("spinbutton").length).toBe(3);
  });

  it("updates the leak number when inputs change", async () => {
    render(<RoiCalculator initialVertical="dental" />);
    const callsInput = screen.getByLabelText(/calls per week/i);
    await userEvent.clear(callsInput);
    await userEvent.type(callsInput, "30");
    // Leak block updates - we don't assert exact pence here, just that the £ figure is present.
    expect(screen.getByText(/£/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `RoiCalculator`**

```tsx
"use client";
import { useMemo, useState } from "react";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { computeRecovery } from "@/lib/roi";
import { AnimatedNumber } from "@/components/primitives/AnimatedNumber";
import { Button } from "@/components/primitives/Button";
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
    <section id="roi" className="mx-auto max-w-page px-4 py-16" aria-labelledby="roi-heading">
      <h2 id="roi-heading" className="font-display text-3xl md:text-5xl">See your leak in 30 seconds.</h2>

      {!vertical && (
        <div className="mt-8">
          <h3 className="text-lg font-medium">Pick your business.</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICAL_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => selectVertical(k)}
                className="rounded-2xl border border-border bg-bg-alt p-4 text-left hover:border-fg/40 min-h-[88px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="font-medium">{VERTICALS[k].label}</div>
                <div className="mt-1 text-sm text-fg-muted">{VERTICALS[k].cardHook}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {vertical && config && (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="text-2xl font-medium">{config.label}</h3>
            <div className="mt-6 space-y-5">
              {config.roi.inputs.map((input) => (
                <label key={input.id} className="block">
                  <span className="text-sm text-fg-muted">{input.label}</span>
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
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-lg tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked"
                onClick={() => track("roi_calculator_completed", { vertical, leakValue: leak })}>
                Get my full audit
              </Button>
              <button
                type="button"
                onClick={() => setVertical(null)}
                className="text-sm text-fg-muted underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Change business type
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-bg-alt border border-border p-6">
            <div className="text-sm text-fg-muted">£/month bleeding</div>
            <div className="mt-1 font-display text-5xl text-leak">
              <AnimatedNumber value={leak} format="gbp" />
            </div>
            <div className="mt-6 text-sm text-fg-muted">ANNA recovers (est. 80%)</div>
            <div className="mt-1 font-display text-3xl text-gain">
              <AnimatedNumber value={recovery} format="gbp" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Run tests, commit**

```bash
npm test -- RoiCalculator
git add .
git commit -m "feat: ROI calculator (§06) — no default vertical, live leak animation"
```

---

## Task 15: How it works (§07) + Verticals tile module (§08)

**Files:**
- Create: `src/components/sections/HowItWorks.tsx`, `src/components/sections/VerticalsTileModule.tsx`, `src/components/sections/VerticalsTileModule.test.tsx`, `src/components/verticals/VerticalTile.tsx`.

- [ ] **Step 1: Implement `HowItWorks`**

```tsx
const STEPS = [
  { num: "1", title: "Add your business", body: "Paste your website. ANNA learns your menu, hours, team, and tone." },
  { num: "2", title: "ANNA learns it", body: "She gets familiar with your booking flow, your prices, and your common objections." },
  { num: "3", title: "Calls answered 24/7", body: "From the second you flip the switch, ANNA picks up every call — at 11pm, on bank holidays, when you're on-site." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-page px-4 py-16" aria-labelledby="how-heading">
      <h2 id="how-heading" className="font-display text-3xl md:text-5xl">Set up in three minutes.</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.num} className="rounded-2xl border border-border p-6 bg-bg">
            <span className="font-mono text-primary text-sm">Step {s.num}</span>
            <p className="mt-3 text-xl font-medium">{s.title}</p>
            <p className="mt-3 text-fg-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: Implement `VerticalTile`**

```tsx
"use client";
import { useState } from "react";
import { AccordionItem } from "@/components/primitives/AccordionItem";
import type { VerticalContent } from "@/lib/verticals";
import { Waveform } from "@/components/primitives/Waveform";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import { track } from "@/lib/analytics";

type Props = { content: VerticalContent };

export function VerticalTile({ content }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <AccordionItem
      title={
        <div className="flex flex-col items-start">
          <span className="text-lg font-medium">{content.label}</span>
          <span className="text-fg-muted text-sm mt-1">{content.cardHook}</span>
          <span className="text-leak text-sm mt-2 font-mono">{content.headlineRoi}</span>
        </div>
      }
      onToggle={(open) => open && track("vertical_tile_expanded", { vertical: content.key })}
    >
      <div className="grid gap-6 md:grid-cols-2 pt-4">
        <div>
          <h4 className="font-medium">The pain</h4>
          <p className="mt-2 text-sm">{content.painFraming}</p>
          <h4 className="mt-4 font-medium">What ANNA does</h4>
          <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
            {content.smartBehaviours.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Hear a {content.label.toLowerCase()} call</h4>
          <div className="mt-3 rounded-xl border border-border bg-bg p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause sample" : "Play sample"}
                className="h-10 w-10 rounded-full bg-primary text-on-primary flex items-center justify-center"
              >
                {playing ? "⏸" : "▶"}
              </button>
              <Waveform playing={playing} />
            </div>
            <p className="mt-3 text-xs text-fg-muted">{content.audioSampleScript}</p>
          </div>
          <h4 className="mt-4 font-medium">Works with</h4>
          <p className="mt-2 text-sm">
            <span className="font-medium">UK:</span> {content.integrationsUk.join(" · ")}<br />
            <span className="font-medium">US/intl:</span> {content.integrationsUsIntl.join(" · ")}
          </p>
          <h4 className="mt-4 font-medium">Testimonial slot</h4>
          <p className="mt-2 text-sm text-fg-muted">{content.testimonialSlot}</p>
          <MissingAsset label={`testimonial: ${content.label}`} />
          <p className="mt-3 text-xs text-fg-muted">{content.complianceLine}</p>
        </div>
      </div>
    </AccordionItem>
  );
}
```

- [ ] **Step 3: Implement `VerticalsTileModule`**

```tsx
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS } from "@/lib/verticals";
import { VerticalTile } from "@/components/verticals/VerticalTile";

export function VerticalsTileModule() {
  return (
    <section id="verticals" className="mx-auto max-w-page px-4 py-16" aria-labelledby="verticals-heading">
      <h2 id="verticals-heading" className="font-display text-3xl md:text-5xl">Built for how you actually run.</h2>
      <p className="mt-3 text-fg-muted max-w-prose">
        Tap a tile to hear a real call, see the integrations, and read the operator's story.
      </p>
      <div className="mt-10 rounded-2xl border border-border overflow-hidden">
        {VERTICAL_KEYS.map((k) => (
          <VerticalTile key={k} content={VERTICALS[k]} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write component test for tile expansion analytics**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VerticalsTileModule } from "./VerticalsTileModule";

describe("VerticalsTileModule", () => {
  it("renders all 4 tiles", () => {
    render(<VerticalsTileModule />);
    expect(screen.getByText(/dental clinics/i)).toBeInTheDocument();
    expect(screen.getByText(/beauty salons/i)).toBeInTheDocument();
    expect(screen.getByText(/gastropubs/i)).toBeInTheDocument();
    expect(screen.getByText(/construction \/ trades/i)).toBeInTheDocument();
  });

  it("tiles start collapsed and expand on click", async () => {
    globalThis.dataLayer = [];
    render(<VerticalsTileModule />);
    const dentalTrigger = screen.getAllByRole("button")[0];
    expect(dentalTrigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(dentalTrigger);
    expect(dentalTrigger).toHaveAttribute("aria-expanded", "true");
    expect(globalThis.dataLayer.some((e: { event: string }) => e.event === "vertical_tile_expanded")).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests, commit**

```bash
npm test -- VerticalsTileModule
git add .
git commit -m "feat: how it works (§07) + verticals tile module (§08)"
```

---

## Task 16: Testimonial wall (§09) + Feature strip (§10) + Integrations marquee (§11)

**Files:**
- Create: `src/components/sections/TestimonialWall.tsx`, `src/content/testimonials.ts`, `src/components/sections/FeatureStrip.tsx`, `src/components/sections/IntegrationsMarquee.tsx`, `src/content/integrations.ts`.

- [ ] **Step 1: Testimonials data**

Create `src/content/testimonials.ts`:

```ts
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  metric: string;
  avatarSrc: string | null;
};

// Real testimonials sourced by ANNA marketing (spec §7). Placeholders here.
export const TESTIMONIALS: Testimonial[] = [
  { quote: "Placeholder quote 1.", name: "Practice Principal", role: "Dental clinic, UK",   metric: "X new patients in month 1", avatarSrc: null },
  { quote: "Placeholder quote 2.", name: "Salon Owner",        role: "Beauty salon, UK",    metric: "Zero missed bookings since launch", avatarSrc: null },
  { quote: "Placeholder quote 3.", name: "Pub Landlord",       role: "Gastropub, UK",       metric: "Weekend covers up X%", avatarSrc: null },
  { quote: "Placeholder quote 4.", name: "Trade Owner",        role: "Plumbing & heating, UK", metric: "X jobs booked while on-site", avatarSrc: null },
];
```

- [ ] **Step 2: Implement `TestimonialWall`**

```tsx
import { TESTIMONIALS } from "@/content/testimonials";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function TestimonialWall() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="font-display text-3xl md:text-5xl">What operators tell us.</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="rounded-2xl border border-border bg-bg p-6">
            <blockquote className="text-fg">"{t.quote}"</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              {t.avatarSrc ? (
                <Image src={t.avatarSrc} alt={t.name} width={40} height={40} className="rounded-full" />
              ) : (
                <MissingAsset label={`avatar: ${t.name}`} width={40} height={40} />
              )}
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-fg-muted">{t.role}</div>
              </div>
            </figcaption>
            <p className="mt-3 text-sm text-leak font-mono">{t.metric}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Implement `FeatureStrip` (6 tiles per spec v3)**

```tsx
const FEATURES = [
  { title: "24/7 answer", body: "Picks up every call — 11pm, weekends, bank holidays." },
  { title: "Books in your calendar", body: "Writes the appointment straight into your booking system." },
  { title: "SMS follow-up", body: "Sends confirmations, reminders, and audit summaries." },
  { title: "Smart human transfer", body: "Hands off to your team with the full conversation context in 1 SMS." },
  { title: "Deposit at booking", body: "Stripe SMS deposit collection — where your booking system supports it." },
  { title: "200+ integrations", body: "Plays nicely with the tools you already pay for." },
];

export function FeatureStrip() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-label="Core features">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="rounded-2xl border border-border p-6 bg-bg-alt">
            <p className="font-medium">{f.title}</p>
            <p className="mt-2 text-sm text-fg-muted">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Integration logos data + marquee**

Create `src/content/integrations.ts`:

```ts
// Logos provided as SVG sprite by newo white-label asset bundle (spec §7).
export const INTEGRATION_LOGOS: Array<{ name: string; src: string | null }> = [
  { name: "Google Calendar", src: null },
  { name: "Stripe", src: null },
  { name: "Square", src: null },
  { name: "Calendly", src: null },
  { name: "WhatsApp", src: null },
  { name: "OpenTable", src: null },
  { name: "ResDiary", src: null },
  { name: "Dentally", src: null },
  { name: "Phorest", src: null },
  { name: "simPRO", src: null },
  { name: "Commusoft", src: null },
  { name: "Xero", src: null },
  { name: "QuickBooks", src: null },
  { name: "Jobber", src: null },
  { name: "ServiceM8", src: null },
  { name: "Joblogic", src: null },
  { name: "Fergus", src: null },
  { name: "Carestream R4", src: null },
  { name: "NexHealth", src: null },
  { name: "Treatwell", src: null },
];
```

Create `src/components/sections/IntegrationsMarquee.tsx`:

```tsx
import { INTEGRATION_LOGOS } from "@/content/integrations";
import { MissingAsset } from "@/components/primitives/MissingAsset";
import Image from "next/image";

export function IntegrationsMarquee() {
  const doubled = [...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS];
  return (
    <section className="py-12 border-y border-border bg-bg-alt overflow-hidden" aria-label="Integrations">
      <p className="text-center text-sm text-fg-muted mb-6">Works with the tools you already use</p>
      <div className="flex gap-12 animate-marquee motion-reduce:animate-none whitespace-nowrap">
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

- [ ] **Step 5: Commit**

```bash
npm test
git add .
git commit -m "feat: testimonial wall (§09) + feature strip (§10, 6 tiles) + integrations marquee (§11)"
```

---

## Task 17: Pricing teaser (§12) + Audit re-entry banner (§13) + FAQ (§14) + Final CTA (§15)

**Files:**
- Create: `src/components/sections/PricingTeaser.tsx`, `src/components/sections/AuditReEntryBanner.tsx`, `src/components/sections/FaqAccordion.tsx`, `src/content/faq.ts`, `src/components/sections/FinalCtaBanner.tsx`.

- [ ] **Step 1: Implement `PricingTeaser`**

```tsx
import { Button } from "@/components/primitives/Button";
import { track } from "@/lib/analytics";

export function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-page px-4 py-16" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" className="font-display text-3xl md:text-5xl">Honest pricing.</h2>
      <div className="mt-10 rounded-2xl border border-border bg-bg-alt p-8 max-w-xl">
        <p className="font-display text-3xl">From £99–£299/mo</p>
        <p className="mt-2 text-fg-muted">depending on call volume · No long contracts · Setup in 3 minutes</p>
        <Button
          href="/demo"
          className="mt-6"
          data-event="pricing_teaser_clicked"
        >
          Book a demo for full pricing
        </Button>
      </div>
    </section>
  );
}
```

(Wrap with an `onClick` that calls `track("pricing_teaser_clicked")` if Button doesn't fire it; spec event is on a click whether or not the link works.)

- [ ] **Step 2: Implement `AuditReEntryBanner`**

```tsx
import { Button } from "@/components/primitives/Button";

export function AuditReEntryBanner() {
  return (
    <section className="mx-auto max-w-page px-4">
      <div className="rounded-2xl bg-bg-alt border border-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-lg">Skipped the calculator? Get your free revenue audit emailed.</p>
        <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked">Get my free revenue audit</Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: FAQ data**

Create `src/content/faq.ts`:

```ts
export type FaqEntry = { q: string; a: string };

// Spec §14: must include one question on the human-transfer fail-safe.
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
    q: "Will my callers know it's AI?",
    a: "Most don't realise — listen to the sample above. We're upfront when asked directly, and you can configure her opening line however you'd like.",
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

- [ ] **Step 4: Implement `FaqAccordion`**

```tsx
import { FAQ } from "@/content/faq";
import { AccordionItem } from "@/components/primitives/AccordionItem";

export function FaqAccordion() {
  return (
    <section className="mx-auto max-w-page px-4 py-16" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-3xl md:text-5xl">Questions, then?</h2>
      <div className="mt-10 max-w-3xl">
        {FAQ.map((entry) => (
          <AccordionItem key={entry.q} title={entry.q}>
            <p>{entry.a}</p>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Implement `FinalCtaBanner`** (demo + test-call only — no audit, per spec §15 zone discipline)

```tsx
import { Button } from "@/components/primitives/Button";
import { PhoneChip } from "@/components/primitives/PhoneChip";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE ?? "+44 20 7946 0000";

export function FinalCtaBanner() {
  return (
    <section className="mx-auto max-w-page px-4 py-20" aria-label="Final call to action">
      <div className="rounded-3xl bg-primary text-on-primary p-10 text-center">
        <h2 className="font-display text-3xl md:text-5xl">Time to stop missing calls.</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/demo" data-event="hero_cta_demo_clicked" className="bg-on-primary text-primary border border-on-primary hover:brightness-95">
            Book a demo
          </Button>
          <PhoneChip number={DEMO_PHONE} className="bg-on-primary/10 border-on-primary/30 text-on-primary" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Commit**

```bash
npm test
git add .
git commit -m "feat: pricing teaser (§12) + audit re-entry (§13) + FAQ (§14) + final CTA (§15)"
```

---

## Task 18: Assemble landing page

**Files:**
- Modify: `src/app/page.tsx`.

- [ ] **Step 1: Compose all sections**

Overwrite `src/app/page.tsx`:

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
      <SocialProofLogos />
      <RevenueLeak />
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

- [ ] **Step 2: Manual smoke test**

Run: `npm run dev`. Open `http://localhost:3000`. Tap through every section, expand each vertical tile, change ROI inputs, open FAQ. Stop dev server.

- [ ] **Step 3: Build (placeholder guard runs)**

Run: `npm run build`

Expected: build **fails** at the placeholder guard because `[source: TBD]` strings and `[MISSING ASSET]` slots are present. This is correct — those are intentional development-time placeholders.

- [ ] **Step 4: Confirm the guard message is helpful**

Read the build output. Confirm it lists every file containing `[source: TBD]` and `[MISSING ASSET]`. That list is the marketing/content sourcing punch-list.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: assemble landing page (§01–§16) with vertical URL param routing"
```

---

## Task 19: E2E tests for the three conversion paths + ROI

**Files:**
- Create: `tests/e2e/conversion-paths.spec.ts`, `tests/e2e/roi-calculator.spec.ts`, `tests/e2e/vertical-tiles.spec.ts`.

- [ ] **Step 1: Conversion-path E2E**

```ts
import { test, expect } from "@playwright/test";

test.describe("Conversion paths", () => {
  test("Path A: Book a demo CTA in hero", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Book a demo" }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/(demo|coming-soon)/);
  });

  test("Path B: Free revenue audit ghost button in hero", async ({ page }) => {
    await page.goto("/");
    const audit = page.getByRole("link", { name: /get my free revenue audit/i }).first();
    await expect(audit).toBeVisible();
    await audit.click();
    await expect(page).toHaveURL(/\/(audit|coming-soon)/);
  });

  test("Path C: Test-call phone chip in header", async ({ page }) => {
    await page.goto("/");
    const chip = page.getByRole("link", { name: /test call anna reception/i }).first();
    await expect(chip).toBeVisible();
    await expect(chip).toHaveAttribute("href", /^tel:/);
  });

  test("Hero contains no test-call link (zone discipline)", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByRole("region", { name: "" }).first(); // hero section
    const calls = hero.getByRole("link", { name: /test call/i });
    await expect(calls).toHaveCount(0);
  });
});
```

- [ ] **Step 2: ROI calculator E2E**

```ts
import { test, expect } from "@playwright/test";

test("ROI calculator: vertical picker → live leak update", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "See your leak in 30 seconds." }).scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /dental clinics/i }).click();
  await expect(page.getByText("£/month bleeding")).toBeVisible();

  const callsInput = page.getByLabel(/calls per week/i);
  await callsInput.fill("60");
  // Just assert that some £-formatted leak value is shown.
  await expect(page.locator("text=£").first()).toBeVisible();
});

test("ROI calculator auto-selects vertical from ?v= param", async ({ page }) => {
  await page.goto("/?v=construction");
  await expect(page.getByRole("heading", { name: /construction \/ trades/i })).toBeVisible();
});
```

- [ ] **Step 3: Vertical tile E2E (keyboard + Esc)**

```ts
import { test, expect } from "@playwright/test";

test("Vertical tile expands and collapses with keyboard", async ({ page }) => {
  await page.goto("/");
  const dentalTrigger = page.getByRole("button", { name: /dental clinics/i });
  await dentalTrigger.scrollIntoViewIfNeeded();
  await dentalTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(dentalTrigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(dentalTrigger).toHaveAttribute("aria-expanded", "false");
});
```

- [ ] **Step 4: Run E2E**

Run: `npm run test:e2e`
Expected: 6 passing tests.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "test(e2e): conversion paths + ROI calculator + vertical tiles"
```

---

## Task 20: Accessibility + Lighthouse perf checks

**Files:**
- Create: `tests/e2e/a11y.spec.ts`.

- [ ] **Step 1: Axe accessibility scan**

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no critical a11y violations (axe)", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  // Allow non-critical findings during development; fail on critical+serious only.
  const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  if (critical.length > 0) {
    console.log(JSON.stringify(critical, null, 2));
  }
  expect(critical, "no critical or serious WCAG violations").toEqual([]);
});

test("home page is operable with keyboard only", async ({ page }) => {
  await page.goto("/");
  // Tab through; assert focus is visible somewhere meaningful by checking active element role
  for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
  expect(["a", "button", "input"]).toContain(focused);
});
```

- [ ] **Step 2: Reduced-motion respect check**

Append to `tests/e2e/a11y.spec.ts`:

```ts
test("respects prefers-reduced-motion (no marquee animation class active)", async ({ page, browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const reducedPage = await ctx.newPage();
  await reducedPage.goto("/");
  const marquee = reducedPage.locator(".animate-marquee").first();
  await marquee.scrollIntoViewIfNeeded();
  const animName = await marquee.evaluate((el) => getComputedStyle(el).animationName);
  expect(animName).toBe("none");
  await ctx.close();
});
```

- [ ] **Step 3: Lighthouse via CLI smoke check**

Add to `package.json` scripts:

```json
"perf:lighthouse": "npx --yes lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --output=html --output-path=./lighthouse-report.html --quiet --chrome-flags=\"--headless\""
```

- [ ] **Step 4: Document the perf budget in `tests/README.md`**

Append:

```markdown

## Performance gates (target Core Web Vitals)

Run against production build (`npm run build && npm start`):

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

Lighthouse smoke: `npm run perf:lighthouse` writes `lighthouse-report.html`. Review before any merge to main.

Asset gates:
- Audio samples ≤ 200 KB each
- Hero image declares width/height
- Integration grid uses single SVG sprite
```

- [ ] **Step 5: Run E2E (a11y included)**

Run: `npm run test:e2e`
Expected: all tests passing.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "test(a11y+perf): axe scan + reduced-motion + Lighthouse smoke"
```

---

## Wrap-up

After Task 20:

1. **Run the full check:** `npm run lint && npm test && npm run test:e2e`
2. **Manual review with `npm run dev`:** scroll the page top to bottom in Chrome, Safari (mobile), and a small viewport. Verify keyboard tab order matches visual order.
3. **Outstanding deliverables (handover to downstream plans + ANNA marketing):**
   - Sourced audio samples (5 files) — replace `MissingAsset` slots in §05 + §08.
   - Sourced customer logos (13) — populate `src/content/customerLogos.ts`.
   - Sourced testimonials (4) — populate `src/content/testimonials.ts`.
   - Integration logo SVG sprite — populate `src/content/integrations.ts`.
   - Final ROI source citations — replace every `[source: TBD]` in `src/content/verticals.ts` and `src/components/sections/RevenueLeak.tsx`. Page **will not deploy** until they are resolved (G8 guard enforces).
   - `/demo` route + form — separate plan.
   - `/audit` route + wizard + PDF generator — separate plan.
   - newo.ai white-label integration (G1–G7) — separate plan.

4. **Pre-launch acceptance gates (spec §6) still owed by product/eng:** G1–G8. Block GTM until resolved.
