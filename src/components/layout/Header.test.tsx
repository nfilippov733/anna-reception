import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the ANNA Reception brand mark", () => {
    render(<Header />);
    expect(screen.getByText(/ANNA Reception/i)).toBeInTheDocument();
  });
  it("includes a primary Book a demo CTA", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /book a demo/i })).toHaveAttribute("href", "/demo");
  });
  it("includes a click-to-call phone chip", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /test call anna reception/i })).toBeInTheDocument();
  });
});
