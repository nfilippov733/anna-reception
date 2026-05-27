# ANNA Reception

UK SMB front-desk landing page — Next.js 14 + Tailwind, editorial design system.

> **Positioning:** inbound + outbound calls, WhatsApp, and DMs — answered, booked, and chased. From £99/mo.

## Status

| Layer | State |
|---|---|
| v1 landing (editorial redesign) | shipped, tag `v1-redesign` |
| v2 motion + illustrations | shipped, tag `v2-motion-illustrations` |
| v3 segments + channels + no-AI | design spec approved ([docs/superpowers/specs/2026-05-27-anna-reception-v3-segments-channels-design.md](docs/superpowers/specs/2026-05-27-anna-reception-v3-segments-channels-design.md)) |

## Tech stack

- **Framework:** Next.js 14.2 (App Router) · React 18.3 · TypeScript 5.5
- **Styling:** Tailwind 3.4 · custom token system (`--ink` / `--cream-deep` / `--sage`)
- **Fonts:** Calistoga (display) · Inter (body) · JetBrains Mono (label) — via `next/font/google`
- **Icons:** lucide-react
- **Testing:** Vitest 4.1 · @testing-library/react (jsdom) · Playwright 1.60 · axe-core
- **Images:** sharp (palette PNG pipeline in `scripts/optimize-asset.mjs`)

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

Node version pinned via `.nvmrc`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with HMR |
| `npm run build` | Production build + placeholder check |
| `npm run start` | Serve the production build |
| `npm run lint` | Next/ESLint |
| `npm test` | Vitest run (117+ cases) |
| `npm run test:watch` | Vitest watch |
| `npm run test:e2e` | Playwright (32 specs: axe, visual regression, motion, deep links) |
| `npm run check:placeholders` | Verifies no `[source: TBD]` / `MISSING ASSET` strings in source |
| `npm run perf:lighthouse` | Local Lighthouse run against `localhost:3000` |

## Project structure

```
src/
  app/                  Next.js App Router pages
  components/
    layout/             Header, Footer, StickyDemoCTA, SectionShell
    primitives/         Button, Kicker, Reveal, NumberMarker, FeatureIcon, …
    sections/           Hero, RevenueLeak, AudioDemo, RoiCalculator, …
    segments/           (v3) SegmentPanel, ChannelMixBar
    verticals/          VerticalTile (v2; replaced in v3)
  content/              verticals.ts, faq.ts, testimonials.ts, integrations.ts
  lib/                  analytics, cn, roi, urlParams, useScrollReveal, verticals
public/
  assets/redesign/      compressed PNGs (hero illustration + per-segment marks)
docs/
  superpowers/specs/    design specs (v1, v2, v3)
  superpowers/plans/    implementation plans (v1, v2; v3 next)
tests/
  e2e/                  Playwright (axe, visual regression, motion, ROI, tabs)
scripts/                optimize-asset.mjs, check-source-placeholders.mjs, audit.mjs
```

## Testing

```bash
npm test                       # Vitest — fast feedback loop
npm run test:e2e               # Playwright — axe, visual regression, motion
npm run perf:lighthouse        # Lighthouse vs localhost (manual baseline)
```

Visual regression baselines emulate `prefers-reduced-motion: reduce` for determinism (see `tests/e2e/visual.spec.ts`).

## Deployment

### Vercel (recommended)

Vercel auto-detects Next.js — no `vercel.json` needed.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnfilippov733%2Fanna-reception)

Manual: visit https://vercel.com/new → Import Git repository → select `nfilippov733/anna-reception` → Deploy.

- Production branch: `main`
- Preview deploys: every PR + every non-main branch
- Build command: `npm run build` (auto-detected)
- Output: `.next` (auto-detected)

### Cloudflare Pages (alternative)

Cloudflare needs the Next.js-on-Pages adapter:

```bash
npm install --save-dev @cloudflare/next-on-pages
```

Then in the Pages dashboard:
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output: `.vercel/output/static`
- Compatibility flags: `nodejs_compat`

Free tier covers ~10× the requests of Vercel Hobby; needs slightly more config.

## Branches and tags

- `main` — deploy target; tracks the latest shipped milestone
- `feat/landing-v1` — active feature branch (v1 → v2 → v3 work)
- Tags: `v1-redesign`, `v2-motion-illustrations`
- v3 work lands on a new branch (TBD), PR'd to `main`

## Documentation

- [v1 design spec](docs/superpowers/specs/2026-05-26-anna-reception-redesign-design.md)
- [v2 motion + illustrations spec](docs/superpowers/specs/2026-05-27-anna-reception-v2-motion-illustrations-design.md)
- [v3 segments + channels spec](docs/superpowers/specs/2026-05-27-anna-reception-v3-segments-channels-design.md)
- [v2 implementation plan](docs/superpowers/plans/2026-05-27-anna-reception-v2-motion-illustrations-plan.md)
- [Lighthouse baseline (v2)](docs/superpowers/lighthouse-baseline-v2.md)

## License

Proprietary — © ANNA. All rights reserved.
