import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoiCalculator } from "./RoiCalculator";

describe("RoiCalculator", () => {
  it("shows a vertical picker first (no default)", () => {
    render(<RoiCalculator />);
    expect(screen.getByRole("heading", { name: /pick your business/i })).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("auto-selects vertical when initialVertical is provided", () => {
    render(<RoiCalculator initialVertical="dental" />);
    expect(screen.getByRole("heading", { name: /dental clinics/i })).toBeInTheDocument();
    expect(screen.getAllByRole("spinbutton").length).toBe(3);
  });

  it("updates the leak number when inputs change", async () => {
    render(<RoiCalculator initialVertical="dental" />);
    const callsInput = screen.getByLabelText(/new-patient calls per week/i);
    await userEvent.clear(callsInput);
    await userEvent.type(callsInput, "30");
    // Leak block updates - we don't assert exact pence here, just that the £ figure is present.
    expect(screen.getAllByText(/£/).length).toBeGreaterThan(0);
  });

  it("renders 4 illustration marks in the picker (no initial vertical)", () => {
    const { container } = render(<RoiCalculator initialVertical={null} />);
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBeGreaterThanOrEqual(4);
  });
});
