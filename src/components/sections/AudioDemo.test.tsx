import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AudioDemo } from "./AudioDemo";

describe("AudioDemo", () => {
  it("renders a play button labelled for screen readers", () => {
    render(<AudioDemo />);
    expect(screen.getByRole("button", { name: /play sample call/i })).toBeInTheDocument();
  });
  it("shows the sample transcript by default when no audio source is configured", () => {
    render(<AudioDemo />);
    expect(screen.getByText(/sample transcript/i)).toBeInTheDocument();
    expect(screen.getByText(/do you have any availability tomorrow/i)).toBeInTheDocument();
  });
  it("does not render the ▶/⏸ unicode glyphs anywhere", () => {
    const { container } = render(<AudioDemo />);
    expect(container.textContent).not.toContain("▶");
    expect(container.textContent).not.toContain("⏸");
  });
});
