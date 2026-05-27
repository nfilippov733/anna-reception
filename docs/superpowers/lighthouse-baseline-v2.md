# Lighthouse baseline — pre-v2 motion pass

**Captured:** 2026-05-27T11:37:11Z
**Commit:** `2e796d0bf944e59ee285e90f2db379427d15acd4` (`docs: v2 motion+illustrations implementation plan`)

## Desktop
- Performance: **92**
- Accessibility: **100**
- Best-Practices: **96**
- SEO: **100**
- LCP: **1,501 ms**
- CLS: **0.012**
- TBT: **0 ms**

## Mobile
- Performance: **96**
- Accessibility: **100**
- Best-Practices: **93**
- SEO: **100**
- LCP: **2,845 ms**
- CLS: **0.000**
- TBT: **14 ms**

## Gate thresholds (each phase re-runs Lighthouse; regression >5 points fails)
- Desktop Performance: must stay **≥ 87**
- Mobile Performance: must stay **≥ 91**
- CLS: must stay **< 0.1** in both
- TBT: must stay **≤ 50 ms** desktop, **≤ 64 ms** mobile (baseline + 50)
- A11y, BP, SEO: must not regress below baseline

## v2 results

**Captured:** 2026-05-27 post-implementation
**Commit:** post-Phase 7 (Phase 8 verification commit)

### Desktop v2
- Performance: **100** (Δ +8 from baseline 92)
- Accessibility: **100** (= 100)
- Best-Practices: **96** (= 96)
- SEO: **100** (= 100)
- LCP: **662 ms** (Δ -839 ms from baseline 1,501 — hero illustration optimization 686KB → 67KB)
- CLS: **0.012** (= 0.012)
- TBT: **0 ms** (= 0)

### Mobile v2
- Performance: **95** (Δ -1 from baseline 96, within ±5 gate)
- Accessibility: **100** (= 100)
- Best-Practices: **93** (= 93)
- SEO: **100** (= 100)
- LCP: **2,860 ms** (Δ +15 ms, noise-level)
- CLS: **0.000** (= 0.000)
- TBT: **0 ms** (Δ -14 ms from baseline 14)

### Gate verdict
- ✅ Desktop Performance: 100 ≥ 87
- ✅ Mobile Performance: 95 ≥ 91
- ✅ CLS: 0.012 / 0.000 both < 0.1
- ✅ TBT: 0 ms / 0 ms both ≤ baseline + 50ms
- ✅ A11y, BP, SEO: no regression

All v2 motion + illustration changes shipped without measurable regression; significant desktop perf improvement (LCP cut in half) from the hero illustration compression.
