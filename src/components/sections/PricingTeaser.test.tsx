import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PricingTeaser } from "./PricingTeaser";

describe("PricingTeaser", () => {
  it("renders the three tiers", () => {
    render(<PricingTeaser />);
    expect(screen.getByRole("button", { name: /Solo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Standard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Multi-site/i })).toBeInTheDocument();
  });

  it("opens the Standard tier by default", () => {
    render(<PricingTeaser />);
    expect(screen.getByRole("button", { name: /Standard/i })).toHaveAttribute("aria-expanded", "true");
    // A Standard-only feature is visible.
    expect(screen.getByText(/Outbound recovery/i)).toBeInTheDocument();
  });

  it("expands a tier on click, revealing its features and CTA", async () => {
    const user = userEvent.setup();
    render(<PricingTeaser />);
    const solo = screen.getByRole("button", { name: /Solo/i });
    expect(solo).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: /Start with Solo/i })).not.toBeInTheDocument();

    await user.click(solo);
    expect(solo).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Start with Solo/i })).toHaveAttribute("href", "/demo?plan=solo");
  });
});
