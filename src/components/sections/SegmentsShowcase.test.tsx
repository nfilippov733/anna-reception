import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { SegmentsShowcase } from "./SegmentsShowcase";

describe("SegmentsShowcase", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders 6 tabs", () => {
    render(<SegmentsShowcase initialSegment="dental" />);
    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(6);
  });

  it("marks the initial segment tab as selected", () => {
    render(<SegmentsShowcase initialSegment="beauty" />);
    const tab = screen.getByRole("tab", { name: /Beauty salons/i });
    expect(tab).toHaveAttribute("aria-selected", "true");
  });

  it("clicking a tab updates active state and URL", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="dental" />);
    const fitnessTab = screen.getByRole("tab", { name: /Fitness studios/i });
    await user.click(fitnessTab);
    expect(fitnessTab).toHaveAttribute("aria-selected", "true");
    expect(window.location.search).toBe("?v=fitness");
  });

  it("ArrowRight from active tab moves selection forward", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="dental" />);
    const dental = screen.getByRole("tab", { name: /Dental clinics/i });
    dental.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Beauty salons/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowLeft from first tab wraps to last", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="dental" />);
    const dental = screen.getByRole("tab", { name: /Dental clinics/i });
    dental.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Vet clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("Home jumps to first, End jumps to last", async () => {
    const user = userEvent.setup();
    render(<SegmentsShowcase initialSegment="pubs" />);
    const pubs = screen.getByRole("tab", { name: /Gastropubs/i });
    pubs.focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Vet clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /Dental clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("renders only the active tab's panel", () => {
    render(<SegmentsShowcase initialSegment="construction" />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "segment-panel-construction");
    // Trades outcome stat
    expect(screen.getByText("£140K won-jobs")).toBeInTheDocument();
  });
});
