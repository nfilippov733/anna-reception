import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LinkArrow } from "./LinkArrow";

describe("LinkArrow", () => {
  it("renders a link with arrow icon", () => {
    render(<LinkArrow href="/audit">Get my audit</LinkArrow>);
    const link = screen.getByRole("link", { name: /get my audit/i });
    expect(link).toHaveAttribute("href", "/audit");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });

  it("uses sage hover styling", () => {
    render(<LinkArrow href="/x">Test</LinkArrow>);
    const link = screen.getByRole("link");
    expect(link.className).toMatch(/hover:text-/);
  });
});
