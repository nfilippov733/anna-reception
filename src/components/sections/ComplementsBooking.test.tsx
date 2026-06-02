import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ComplementsBooking } from "./ComplementsBooking";

describe("ComplementsBooking", () => {
  it("keeps its headline", () => {
    render(<ComplementsBooking />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Keeps your booking system/i })
    ).toBeInTheDocument();
  });

  it("shows the folded-in integrations strip", () => {
    render(<ComplementsBooking />);
    expect(screen.getByText(/Works with the tools you already use/i)).toBeInTheDocument();
    // A chip name that does NOT appear in the intro paragraph copy.
    expect(screen.getByText("QuickBooks")).toBeInTheDocument();
  });
});
