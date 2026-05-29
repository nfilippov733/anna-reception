import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhoneChip } from "./PhoneChip";

describe("PhoneChip", () => {
  it("renders a tel: link with the formatted number", () => {
    render(<PhoneChip number="+44 20 7946 0000" />);
    const link = screen.getByRole("link", { name: /\+44 20 7946 0000/ });
    expect(link).toHaveAttribute("href", "tel:+442079460000");
  });
  it("includes an accessible label", () => {
    render(<PhoneChip number="+44 20 7946 0000" />);
    expect(screen.getByLabelText(/Try a sample call to ANNA on/i)).toBeInTheDocument();
  });
  it("renders an SVG phone icon, not the 📞 emoji", () => {
    const { container } = render(<PhoneChip number="+44 20 7946 0000" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.textContent).not.toContain("📞");
  });

  it("uses sage-tinted border", () => {
    const { container } = render(<PhoneChip number="+44 20 7946 0000" />);
    const link = container.querySelector("a")!;
    expect(link.className).toMatch(/border-sage/);
  });
});
