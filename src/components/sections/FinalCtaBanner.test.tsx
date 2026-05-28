import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FinalCtaBanner } from "./FinalCtaBanner";

describe("FinalCtaBanner", () => {
  it("renders both demo and audit CTAs", () => {
    render(<FinalCtaBanner />);
    expect(screen.getByRole("link", { name: /Book a demo/i })).toHaveAttribute("href", "/demo");
    expect(screen.getByRole("link", { name: /Get my free revenue audit/i })).toHaveAttribute("href", "/audit");
  });
});
