import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

    const input = screen.getByLabelText(/Front-desk salary per year/i);
    fireEvent.change(input, { target: { value: "40000" } });
    // £40,000 → loaded £50,000 → savings £47,852
    expect(screen.getByText(/£47,852/)).toBeInTheDocument();
  });

  it("shows ANNA's fixed annual cost", () => {
    render(<HiringComparison />);
    expect(screen.getByText(/£2,148/)).toBeInTheDocument();
  });

  it("switches to the answering-service comparison", async () => {
    const user = userEvent.setup();
    render(<HiringComparison />);
    await user.click(screen.getByRole("button", { name: /Answering service/i }));
    expect(screen.getByLabelText("Calls per month")).toBeInTheDocument();
    expect(screen.getByText(/ANNA books the appointment/i)).toBeInTheDocument();
    // 150 calls × £1.20 × 12 = £2,160
    expect(screen.getByText(/£2,160/)).toBeInTheDocument();
  });
});
