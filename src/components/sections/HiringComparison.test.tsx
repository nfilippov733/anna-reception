import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { HiringComparison } from "./HiringComparison";

describe("HiringComparison", () => {
  beforeEach(() => {
    // Force reduced-motion so AnimatedNumber snaps to its value synchronously.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
  });

  it("renders the comparison heading", () => {
    render(<HiringComparison />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Cheaper than the front desk/i })
    ).toBeInTheDocument();
  });

  it("computes savings from the salary input", () => {
    render(<HiringComparison />);
    // Default £28,000 → loaded £35,000 → savings £35,000 - £2,148 = £32,852
    expect(screen.getByText(/£32,852/)).toBeInTheDocument();

    const input = screen.getByLabelText(/Receptionist salary per year/i);
    fireEvent.change(input, { target: { value: "40000" } });
    // £40,000 → loaded £50,000 → savings £47,852
    expect(screen.getByText(/£47,852/)).toBeInTheDocument();
  });

  it("shows ANNA's fixed annual cost", () => {
    render(<HiringComparison />);
    expect(screen.getByText(/£2,148/)).toBeInTheDocument();
  });
});
