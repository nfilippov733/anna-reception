import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders text in mono with sage border and tabular numerics", () => {
    render(<Tag>00:23</Tag>);
    const el = screen.getByText("00:23");
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/border-sage/);
    expect(el.className).toMatch(/tabular-nums/);
  });
});
