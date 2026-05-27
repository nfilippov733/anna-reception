# Redesign assets

| File | Source | Replacement plan |
|---|---|---|
| `hero-illustration.png` | image-gen v2 (`gemini-3-pro-image`, hero-v2 candidate `hero-a` selected) — 66.9 KB optimized (≤80 KB ceiling) | Replace with hand-illustrated SVG before public launch |
| `hero-illustration-v1.png` | image-gen v1 (kept for A/B fallback) | Remove once v2 is brand-approved |
| `dental.png` | image-gen vertical candidate `dental-b` selected — 25.3 KB optimized (≤30 KB ceiling) | TODO: replace with marketing-approved asset |
| `beauty.png` | image-gen vertical candidate `beauty-a` selected — 22.5 KB optimized (≤30 KB ceiling) | TODO: replace with marketing-approved asset |
| `gastro.png` | image-gen vertical candidate `gastro-a` selected — 29.0 KB optimized (≤30 KB ceiling) | TODO: replace with marketing-approved asset |
| `trades.png` | image-gen vertical candidate `trades-a` selected — 19.1 KB optimized (≤30 KB ceiling) | TODO: replace with marketing-approved asset |
| `squiggle.svg` | hand-coded | Keep — small, vector, recolourable |

**Not in this folder (sourced externally by ANNA marketing):**
- Customer logos (referenced in `src/content/customerLogos.ts` but not currently rendered)
- Integration logos (`src/content/integrations.ts` — currently rendered as mono text chips)
- Testimonial avatars (`src/content/testimonials.ts` — placeholder initials render)
- Trustpilot 5-star badge (download from Trustpilot brand kit)
- Audio samples (generic + 4 vertical)

**Replaced by SVG primitives, not stored as files:**
- Logo (AR monogram + wordmark) — `src/components/primitives/Logo.tsx`
- FeatureIcon × 6 — Lucide icons via `src/components/primitives/FeatureIcon.tsx`
- VerticalMark in collapsed/expanded VerticalTile — Lucide icons via `src/components/primitives/VerticalMark.tsx` (default `variant="icon"`)
- VerticalMark in RoiCalculator picker + selected-state header — PNG illustrations via `<VerticalMark variant="illustration" />`
