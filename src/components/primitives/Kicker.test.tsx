import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kicker } from "./Kicker";

describe("Kicker", () => {
  it("renders number + label as a mono kicker", () => {
    render(<Kicker number="01" label="Why ANNA Reception" />);
    expect(screen.getByText(/01 — WHY ANNA RECEPTION/i)).toBeInTheDocument();
  });

  it("has aria-hidden so it stays out of the heading hierarchy", () => {
    const { container } = render(<Kicker number="01" label="Why" />);
    expect(container.firstElementChild!.getAttribute("aria-hidden")).toBe("true");
  });

  it("uppercases the label and applies mono font + tracking", () => {
    const { container } = render(<Kicker number="01" label="lowercase label" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/uppercase/);
    expect(el.className).toMatch(/tracking-/);
  });

  it("renders without a number when only a label is given", () => {
    render(<Kicker label="Standalone" />);
    expect(screen.getByText("STANDALONE")).toBeInTheDocument();
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });
});
