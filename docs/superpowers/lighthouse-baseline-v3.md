# Lighthouse baseline — pre-v3 segments + channels pass

**Captured:** 2026-05-27 (post-v2 milestone tag `v2-motion-illustrations`)
**Commit:** `c39d3dbc3d5ed7f05e8b9184f4d90608741081ca`

## Desktop (pre-v3)
- Performance: **100**
- Accessibility: **100**
- Best-Practices: **96**
- SEO: **100**
- LCP: **569 ms**
- CLS: **0.012**
- TBT: **0 ms**

## Mobile (pre-v3)
- Performance: **96**
- Accessibility: **100**
- Best-Practices: **93**
- SEO: **100**
- LCP: **2757 ms**
- CLS: **0.000**
- TBT: **0 ms**

## Gate thresholds (each phase re-runs Lighthouse; regression >5 points fails)
- Desktop Performance: must stay ≥ baseline − 5 (≥ 95)
- Mobile Performance: must stay ≥ baseline − 5 (≥ 91)
- CLS: must stay < 0.1 in both
- TBT: must stay ≤ baseline + 50ms in both (≤ 50 ms desktop, ≤ 50 ms mobile)
- A11y, BP, SEO: must not regress below baseline

## v3 results

**Captured:** 2026-05-27 post-implementation
**Commit:** `f99fa3dd763042f5571539c11b86931c974cb47e`

### Desktop v3
- Performance: **100** (Δ = 0 vs baseline 100)
- Accessibility: **100** (= 100)
- Best-Practices: **96** (= 96)
- SEO: **100** (= 100)
- LCP: **580 ms** (Δ +11 ms vs baseline 569 ms — noise-level)
- CLS: **0.012** (= 0.012)
- TBT: **0 ms** (= 0)

### Mobile v3
- Performance: **95** (Δ -1 vs baseline 96 — within ±5 gate)
- Accessibility: **100** (= 100)
- Best-Practices: **93** (= 93)
- SEO: **100** (= 100)
- LCP: **2990 ms** (Δ +233 ms vs baseline 2757 ms — noise-level, within gate)
- CLS: **0.000** (= 0.000)
- TBT: **1 ms** (Δ +1 ms vs baseline 0 ms — noise-level)

### Gate verdict
- ✅ Desktop Performance: 100 ≥ 95 (baseline 100 − 5)
- ✅ Mobile Performance: 95 ≥ 91 (baseline 96 − 5)
- ✅ CLS: 0.012 / 0.000 both < 0.1
- ✅ TBT: 0 ms / 1 ms both ≤ baseline + 50 ms (≤ 50 ms)
- ✅ A11y, BP, SEO: no regression vs baseline
