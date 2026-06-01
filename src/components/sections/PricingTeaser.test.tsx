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

  it("shows VAT, the every-plan trial, and a trial CTA on every tier", () => {
    render(<PricingTeaser />);
    expect(screen.getAllByText(/\+ VAT/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/14-day free trial on every plan/i)).toBeInTheDocument();
    const ctas = screen.getAllByRole("link", { name: /Book a demo and start a trial/i });
    expect(ctas).toHaveLength(3);
    const hrefs = ctas.map((c) => c.getAttribute("href"));
    expect(hrefs).toEqual(
      expect.arrayContaining(["/demo?plan=sole", "/demo?plan=business", "/demo?plan=big"])
    );
  });

  it("opens the Business tier by default", () => {
    render(<PricingTeaser />);
    expect(screen.getByRole("button", { name: /^Business/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Outbound recovery/i)).toBeInTheDocument();
  });

  it("expands the Sole Trader tier on click, revealing its features", async () => {
    const user = userEvent.setup();
    render(<PricingTeaser />);
    const sole = screen.getByRole("button", { name: /Sole Trader/i });
    expect(sole).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/SMS confirmations/i)).not.toBeInTheDocument();
    await user.click(sole);
    expect(sole).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/SMS confirmations/i)).toBeInTheDocument();
  });
});
