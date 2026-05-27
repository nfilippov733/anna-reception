import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SegmentPanel } from "./SegmentPanel";
import { VERTICALS } from "@/content/verticals";

describe("SegmentPanel", () => {
  it("renders the outcome stat headline and attribution", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    expect(screen.getByText("£401K recovered")).toBeInTheDocument();
    expect(screen.getByText(/Image Orthodontics|industry estimate/i)).toBeInTheDocument();
  });

  it("renders the pain framing", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    expect(screen.getByText(/New-patient enquiries spike outside 9–5/i)).toBeInTheDocument();
  });

  it("renders the customer story quote and attribution", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    expect(screen.getByText(/47 new patients in month 1\./)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Patel/)).toBeInTheDocument();
  });

  it("renders the segment CTA link with correct href", () => {
    render(
      <SegmentPanel
        content={VERTICALS.dental}
        panelId="segment-panel-dental"
        labelledBy="segment-tab-dental"
        kickerLetter="a"
      />
    );
    const cta = screen.getByRole("link", { name: /Book a dental demo/i });
    expect(cta).toHaveAttribute("href", "/demo?v=dental");
  });

  it("has correct ARIA tabpanel wiring", () => {
    const { container } = render(
      <SegmentPanel
        content={VERTICALS.beauty}
        panelId="segment-panel-beauty"
        labelledBy="segment-tab-beauty"
        kickerLetter="b"
      />
    );
    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("id", "segment-panel-beauty");
    expect(panel).toHaveAttribute("aria-labelledby", "segment-tab-beauty");
  });
});
