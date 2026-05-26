import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders the label in sage, uppercased mono", () => {
    render(<Eyebrow>trusted by uk smbs</Eyebrow>);
    const el = screen.getByText("TRUSTED BY UK SMBS");
    expect(el).toBeInTheDocument();
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/text-sage/);
  });
});
