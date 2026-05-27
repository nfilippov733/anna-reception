import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OutcomeStrip } from "./OutcomeStrip";

describe("OutcomeStrip", () => {
  it("renders 4 outcomes", () => {
    render(<OutcomeStrip />);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });

  it("renders each outcome headline", () => {
    render(<OutcomeStrip />);
    expect(screen.getByText("More booked appointments.")).toBeInTheDocument();
    expect(screen.getByText("Faster than your competitor.")).toBeInTheDocument();
    expect(screen.getByText("Recovered dormant revenue.")).toBeInTheDocument();
    expect(screen.getByText("Off your phone, in your work.")).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<OutcomeStrip />);
    expect(
      screen.getByRole("heading", { level: 2, name: /What you actually get\./i })
    ).toBeInTheDocument();
  });
});
