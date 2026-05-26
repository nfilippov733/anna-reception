import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedNumber } from "./AnimatedNumber";

describe("AnimatedNumber", () => {
  it("renders the value formatted as GBP", () => {
    render(<AnimatedNumber value={1234.5} format="gbp" />);
    expect(screen.getByText("£1,235")).toBeInTheDocument();
  });
  it("renders the value formatted as plain integer", () => {
    render(<AnimatedNumber value={42} format="int" />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
  it("uses tabular-nums to prevent layout shift", () => {
    render(<AnimatedNumber value={1} format="int" />);
    expect(screen.getByText("1").className).toMatch(/tabular-nums/);
  });
  it("announces value changes via aria-live", () => {
    render(<AnimatedNumber value={1} format="int" />);
    const el = screen.getByText("1");
    expect(el).toHaveAttribute("aria-live", "polite");
  });
});
