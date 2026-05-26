import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the leak-framed headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Stop losing revenue to missed calls");
  });
  it("includes both primary and ghost CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /book a demo/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get my free revenue audit/i })).toBeInTheDocument();
  });
  it("includes the corrected trust signal copy", () => {
    render(<Hero />);
    expect(screen.getByText(/team behind 100,000\+ business accounts/i)).toBeInTheDocument();
  });
  it("does not render a test-call CTA in the hero (zone discipline)", () => {
    render(<Hero />);
    expect(screen.queryByRole("link", { name: /test call/i })).not.toBeInTheDocument();
  });
});
