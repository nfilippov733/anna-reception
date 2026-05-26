import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyDemoCTA } from "./StickyDemoCTA";

describe("StickyDemoCTA", () => {
  it("is hidden by default and revealed when active prop is true", () => {
    const { rerender } = render(<StickyDemoCTA active={false} />);
    expect(screen.getByTestId("sticky-cta")).toHaveAttribute("data-active", "false");
    rerender(<StickyDemoCTA active={true} />);
    expect(screen.getByTestId("sticky-cta")).toHaveAttribute("data-active", "true");
  });
});
