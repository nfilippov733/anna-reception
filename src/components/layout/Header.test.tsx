import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the Reception brand mark", () => {
    render(<Header />);
    expect(screen.getByRole("img", { name: /reception, by anna/i })).toBeInTheDocument();
  });
  it("includes a primary Book a demo CTA", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /book a demo/i })).toHaveAttribute("href", "/demo");
  });
  it("renders the ANNA wordmark image in the Logo", () => {
    render(<Header />);
    expect(screen.getByAltText("ANNA")).toBeInTheDocument();
  });
});
