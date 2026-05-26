import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PullQuote } from "./PullQuote";

describe("PullQuote", () => {
  it("renders quote text, attribution, role/business, and metric", () => {
    render(
      <PullQuote
        quote="Zero missed bookings since March."
        attribution="Sarah Owen"
        role="Salon owner"
        business="Glow Lounge"
        metric="+18% Saturday covers"
      />
    );
    expect(screen.getByText(/zero missed bookings/i)).toBeInTheDocument();
    expect(screen.getByText("Sarah Owen")).toBeInTheDocument();
    expect(screen.getByText(/glow lounge/i)).toBeInTheDocument();
    expect(screen.getByText("+18% Saturday covers")).toBeInTheDocument();
  });

  it("renders an open-quote glyph that is aria-hidden", () => {
    const { container } = render(
      <PullQuote quote="x" attribution="x" role="x" business="x" metric="x" />
    );
    const aria = container.querySelector('[aria-hidden="true"]');
    expect(aria).toBeInTheDocument();
    expect(aria!.textContent).toMatch(/[“”"]/);
  });
});
