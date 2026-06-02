import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TestimonialWall } from "./TestimonialWall";

describe("TestimonialWall", () => {
  it("keeps the heading and the honesty note", () => {
    render(<TestimonialWall />);
    expect(
      screen.getByRole("heading", { level: 2, name: /What operators tell us/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Illustrative scenarios/i)).toBeInTheDocument();
  });

  it("shows the folded-in trust stats", () => {
    render(<TestimonialWall />);
    expect(screen.getByText("100,000+")).toBeInTheDocument();
    expect(screen.getByText(/Trustpilot/i)).toBeInTheDocument();
  });

  it("renders in-brand initial avatars for the secondary quotes", () => {
    render(<TestimonialWall />);
    // "Dr. Patel · Bright Smiles Cardiff" → initials DP
    expect(screen.getByText("DP")).toBeInTheDocument();
  });
});
