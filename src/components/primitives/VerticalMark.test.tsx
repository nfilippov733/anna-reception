import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { VerticalMark } from "./VerticalMark";
import { VERTICAL_KEYS } from "@/lib/verticals";

describe("VerticalMark", () => {
  it.each(VERTICAL_KEYS)("renders an SVG for %s", (key) => {
    const { container } = render(<VerticalMark vertical={key} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });
});
