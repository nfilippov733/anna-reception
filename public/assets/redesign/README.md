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
