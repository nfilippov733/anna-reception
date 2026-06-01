import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FinalCtaBanner } from "./FinalCtaBanner";

describe("FinalCtaBanner", () => {
  it("renders the demo CTA and the calculator (leak) CTA", () => {
    render(<FinalCtaBanner />);
    expect(screen.getByRole("link", { name: /Book a demo/i })).toHaveAttribute("href", "/demo");
    expect(screen.getByRole("link", { name: /See your revenue leak/i })).toHaveAttribute("href", "#roi");
  });
});
