import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PricingTeaser } from "./PricingTeaser";

describe("PricingTeaser", () => {
  it("renders the three ANNA-style tiers", () => {
    render(<PricingTeaser />);
    expect(screen.getByRole("button", { name: /Sole Trader/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Business/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Big Business/i })).toBeInTheDocument();
  });

  it("shows VAT and the 14-day trial", () => {
    render(<PricingTeaser />);
    expect(screen.getAllByText(/\+ VAT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/14-day free trial/i).length).toBeGreaterThan(0);
  });

  it("opens the Business tier by default with the trial CTA", () => {
    render(<PricingTeaser />);
    expect(screen.getByRole("button", { name: /^Business/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Outbound recovery/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start 14-day free trial/i })).toHaveAttribute("href", "/demo?plan=business");
  });

  it("expands the Sole Trader tier on click, revealing its CTA", async () => {
    const user = userEvent.setup();
    render(<PricingTeaser />);
    const sole = screen.getByRole("button", { name: /Sole Trader/i });
    expect(sole).toHaveAttribute("aria-expanded", "false");
    await user.click(sole);
    expect(sole).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Start with Sole Trader/i })).toHaveAttribute("href", "/demo?plan=sole");
  });
});
