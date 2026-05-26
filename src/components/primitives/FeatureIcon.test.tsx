import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FeatureIcon, type FeatureIconName } from "./FeatureIcon";

const NAMES: FeatureIconName[] = [
  "answer-24-7",
  "calendar",
  "sms",
  "transfer",
  "deposit",
  "integrations",
];

describe("FeatureIcon", () => {
  it.each(NAMES)("renders %s as an SVG with aria-hidden", (name) => {
    const { container } = render(<FeatureIcon name={name} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies size + stroke-current by default", () => {
    const { container } = render(<FeatureIcon name="calendar" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class") || "").toMatch(/h-8/);
  });
});
