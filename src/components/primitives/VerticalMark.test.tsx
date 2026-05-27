import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VerticalMark } from "./VerticalMark";
import { VERTICAL_KEYS } from "@/lib/verticals";

describe("VerticalMark", () => {
  it("renders an icon for every vertical key in the icon variant", () => {
    for (const k of VERTICAL_KEYS) {
      const { container, unmount } = render(<VerticalMark vertical={k} />);
      const svg = container.querySelector("svg");
      expect(svg, `icon should render for ${k}`).not.toBeNull();
      unmount();
    }
  });

  it("renders an image for every vertical key in the illustration variant", () => {
    for (const k of VERTICAL_KEYS) {
      const { container, unmount } = render(<VerticalMark vertical={k} variant="illustration" />);
      const img = container.querySelector("img");
      expect(img, `image should render for ${k}`).not.toBeNull();
      unmount();
    }
  });
});
