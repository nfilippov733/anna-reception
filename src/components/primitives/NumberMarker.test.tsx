import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NumberMarker } from "./NumberMarker";

describe("NumberMarker", () => {
  it("renders the number in display-italic green", () => {
    render(<NumberMarker>01</NumberMarker>);
    const el = screen.getByText("01");
    expect(el.className).toMatch(/font-display/);
    expect(el.className).toMatch(/italic/);
    expect(el.className).toMatch(/text-primary/);
  });

  it("accepts an alternate tone (leak coral) for revenue-loss accent", () => {
    render(<NumberMarker tone="leak">01</NumberMarker>);
    const el = screen.getByText("01");
    expect(el.className).toMatch(/text-leak/);
  });
});
