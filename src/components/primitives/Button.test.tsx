import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Book a demo</Button>);
    expect(screen.getByRole("button", { name: "Book a demo" })).toBeInTheDocument();
  });
  it("calls onClick when pressed", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("renders ghost variant with transparent background", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-transparent/);
  });
  it("renders as an anchor when href is given", () => {
    render(<Button href="/demo">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/demo");
  });
  it("fires onClick on the link variant too", async () => {
    const onClick = vi.fn();
    render(<Button href="/demo" onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("link", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("matches a 44px minimum touch target", () => {
    render(<Button>Tap</Button>);
    expect(screen.getByRole("button").className).toMatch(/min-h-\[44px\]/);
  });
});
