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
