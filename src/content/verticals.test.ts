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
