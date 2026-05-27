import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SquiggleDivider } from "./SquiggleDivider";

describe("SquiggleDivider", () => {
  it("renders an aria-hidden SVG inside an aria-hidden wrapper (no role='separator')", () => {
    const { container } = render(<SquiggleDivider />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.getAttribute("role")).toBeNull();

    const svg = wrapper.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses sage tone (text-sage with alpha)", () => {
    const { container } = render(<SquiggleDivider />);
    const svg = container.querySelector("svg")!;
    expect(svg.className.baseVal || svg.getAttribute("class") || "").toMatch(/text-sage/);
  });
});
