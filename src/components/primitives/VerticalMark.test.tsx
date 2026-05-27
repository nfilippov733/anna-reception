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

  it.each(VERTICAL_KEYS)("renders an <img> when variant=illustration for %s", (key) => {
    const { container } = render(<VerticalMark vertical={key} variant="illustration" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img!.getAttribute("alt")).toBe("");
  });

  it("defaults to variant=icon (renders Lucide SVG, no <img>)", () => {
    const { container } = render(<VerticalMark vertical="dental" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
