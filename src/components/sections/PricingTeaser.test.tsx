import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PricingTeaser } from "./PricingTeaser";

describe("PricingTeaser", () => {
  it("renders the three ANNA-style tiers", () => {
    render(<PricingTeaser />);
    expect(screen.getByText("Sole Trader")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Big Business")).toBeInTheDocument();
  });

  it("shows VAT, the every-plan trial, and a trial CTA on every tier", () => {
    render(<PricingTeaser />);
    expect(screen.getAllByText(/\+ VAT/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/14 days free on any plan/i)).toBeInTheDocument();
    const ctas = screen.getAllByRole("link", { name: /Book a demo and start a trial/i });
    expect(ctas).toHaveLength(3);
    const hrefs = ctas.map((c) => c.getAttribute("href"));
    expect(hrefs).toEqual(
      expect.arrayContaining(["/demo?plan=sole", "/demo?plan=business", "/demo?plan=big"])
    );
  });

  it("shows every tier's features without interaction (always expanded)", () => {
    render(<PricingTeaser />);
    // One feature unique to each tier is visible with no clicks — no accordion.
    expect(screen.getByText(/SMS confirmations/i)).toBeInTheDocument(); // Sole Trader
    expect(screen.getByText(/Outbound recovery/i)).toBeInTheDocument(); // Business
    expect(screen.getByText(/Multi-location call routing/i)).toBeInTheDocument(); // Big Business
  });
});
