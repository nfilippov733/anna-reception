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
