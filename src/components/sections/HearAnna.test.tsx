import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HearAnna } from "./HearAnna";

describe("HearAnna", () => {
  it("renders the heading", () => {
    render(<HearAnna />);
    expect(screen.getByRole("heading", { level: 2, name: /Call ANNA/i })).toBeInTheDocument();
  });

  it("shows an honest 'launching soon' state, not a fake number", () => {
    render(<HearAnna />);
    expect(screen.getByText(/launching soon/i)).toBeInTheDocument();
    // No tel: link is rendered while the demo line is unset.
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
  });

  it("links the demo CTA and the sample-call anchor", () => {
    render(<HearAnna />);
    expect(screen.getByRole("link", { name: /Book a demo/i })).toHaveAttribute("href", "/demo");
    expect(screen.getByRole("link", { name: /hear a sample call/i })).toHaveAttribute(
      "href",
      "#channel-demos"
    );
  });
});
