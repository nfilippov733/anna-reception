# Lighthouse baseline — pre-v4 channel demos

**Captured:** 2026-05-28 (post-Sprint-C, before v4 implementation begins)
**Commit:** `e47bc09e013a249b2141825762d3a6b1a5884ab2`

## Desktop (pre-v4)
- Performance: **100**
- Accessibility: **100**
- Best-Practices: **96**
- SEO: **100**
- LCP: **594 ms**
- CLS: **0.012**
- TBT: **0 ms**

## Mobile (pre-v4)
- Performance: **95**
- Accessibility: **100**
- Best-Practices: **93**
- SEO: **100**
- LCP: **2988 ms**
- CLS: **0.000**
- TBT: **0 ms**

## Gate thresholds (each phase re-runs Lighthouse; regression >5 points fails)
- Desktop Performance: must stay ≥ baseline − 5 (≥ 95)
- Mobile Performance: must stay ≥ baseline − 5 (≥ 90)
- CLS: must stay < 0.1 in both
- TBT: must stay ≤ baseline + 50 ms in both (≤ 50 ms desktop, ≤ 50 ms mobile)
- A11y, BP, SEO: must not regress below baseline

## v4 results
(Filled in by Phase 6.)
