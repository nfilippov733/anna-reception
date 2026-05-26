import { describe, it, expect } from "vitest";
import { readVerticalFromUrl } from "./urlParams";

describe("readVerticalFromUrl", () => {
  it("returns null when ?v= is absent", () => {
    expect(readVerticalFromUrl(new URL("https://x/"))).toBeNull();
  });
  it("returns a recognised vertical key", () => {
    expect(readVerticalFromUrl(new URL("https://x/?v=dental"))).toBe("dental");
    expect(readVerticalFromUrl(new URL("https://x/?v=beauty"))).toBe("beauty");
    expect(readVerticalFromUrl(new URL("https://x/?v=pubs"))).toBe("pubs");
    expect(readVerticalFromUrl(new URL("https://x/?v=construction"))).toBe("construction");
  });
  it("returns null for an unrecognised value", () => {
    expect(readVerticalFromUrl(new URL("https://x/?v=florist"))).toBeNull();
  });
  it("is case-insensitive", () => {
    expect(readVerticalFromUrl(new URL("https://x/?v=DENTAL"))).toBe("dental");
  });
});
