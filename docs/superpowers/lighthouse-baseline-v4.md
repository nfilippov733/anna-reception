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

**Captured:** 2026-05-28 post-implementation
**Commit:** `184c512f374157f871db43ee804230bbf542d31b`

### Desktop v4
- Performance: **100** (Δ +0 vs pre-v4)
- Accessibility: **100**
- Best-Practices: **96**
- SEO: **100**
- LCP: **586 ms** (Δ −8 ms vs pre-v4)
- CLS: **0.012**
- TBT: **0 ms**

### Mobile v4
- Performance: **95** (Δ +0 vs pre-v4)
- Accessibility: **100**
- Best-Practices: **93**
- SEO: **100**
- LCP: **2935 ms** (Δ −53 ms vs pre-v4)
- CLS: **0.000**
- TBT: **0 ms**

### Bundle delta
- Pre-v4 static-chunk total: 721,492 bytes
- Post-v4 static-chunk total: 721,492 bytes
- Delta: 0 bytes (target ≤ 5120 gzipped ≈ 15000 raw)

### Gate verdict
- ✅ Desktop Performance: 100 ≥ 95 (baseline − 5)
- ✅ Mobile Performance: 95 ≥ 90 (baseline − 5)
- ✅ CLS: 0.012 / 0.000 both < 0.1
- ✅ TBT: 0 ms / 0 ms both ≤ 50 ms (baseline + 50)
- ✅ Bundle delta: 0 bytes ≤ 15000 raw target
- ✅ A11y, BP, SEO: no regression vs baseline (all equal or better)
