import { describe, it, expect, beforeEach } from "vitest";
import { track } from "./analytics";

declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Array<Record<string, unknown>>;
}

describe("track", () => {
  beforeEach(() => {
    globalThis.dataLayer = [];
  });

  it("pushes named event to dataLayer", () => {
    track("hero_cta_demo_clicked");
    expect(globalThis.dataLayer).toEqual([{ event: "hero_cta_demo_clicked" }]);
  });

  it("includes provided properties", () => {
    track("vertical_tile_expanded", { vertical: "dental" });
    expect(globalThis.dataLayer[0]).toEqual({ event: "vertical_tile_expanded", vertical: "dental" });
  });

  it("never throws if dataLayer is missing", () => {
    // @ts-expect-error testing runtime safety
    delete globalThis.dataLayer;
    expect(() => track("hero_cta_demo_clicked")).not.toThrow();
  });
});
