import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VerticalsTileModule } from "./VerticalsTileModule";

declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Array<Record<string, unknown>>;
}

describe("VerticalsTileModule", () => {
  it("renders all 4 tiles", () => {
    render(<VerticalsTileModule />);
    expect(screen.getAllByText(/dental clinics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/beauty salons/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/gastropubs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/construction \/ trades/i).length).toBeGreaterThan(0);
  });

  it("tiles start collapsed and expand on click", async () => {
    globalThis.dataLayer = [];
    render(<VerticalsTileModule />);
    const dentalTrigger = screen.getAllByRole("button")[0];
    if (!dentalTrigger) throw new Error("No dental trigger");
    expect(dentalTrigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(dentalTrigger);
    expect(dentalTrigger).toHaveAttribute("aria-expanded", "true");
    expect(globalThis.dataLayer.some((e) => e.event === "vertical_tile_expanded")).toBe(true);
  });
});
