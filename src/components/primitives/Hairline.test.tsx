import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Hairline } from "./Hairline";

describe("Hairline", () => {
  it("renders an <hr> with sage colour when horizontal (default)", () => {
    const { container } = render(<Hairline />);
    const hr = container.querySelector("hr");
    expect(hr).toBeInTheDocument();
    expect(hr!.className).toMatch(/border-sage/);
  });

  it("renders a vertical divider when orientation=vertical", () => {
    const { container } = render(<Hairline orientation="vertical" />);
    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
    expect(div!.getAttribute("role")).toBe("separator");
    expect(div!.getAttribute("aria-orientation")).toBe("vertical");
  });
});
