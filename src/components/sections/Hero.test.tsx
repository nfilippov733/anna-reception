import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the v3 kicker, headline, and sub", () => {
    render(<Hero />);
    expect(screen.getByText(/Front desk · 24\/7 · UK/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /Your missed calls are now revenue\./i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/answers every call, returns every web lead, and chases every dormant quote/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Pays for itself in the first week/i)).toBeInTheDocument();
  });

  it("does not contain the word 'AI'", () => {
    const { container } = render(<Hero />);
    expect(container.textContent ?? "").not.toMatch(/\bAI\b/);
  });

  it("renders both primary and secondary CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /Book a demo/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /See your revenue leak/i })).toHaveAttribute("href", "#roi");
  });
});
