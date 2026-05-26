import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayButton } from "./PlayButton";

describe("PlayButton", () => {
  it("renders SVG icon (not unicode glyph)", () => {
    const { container } = render(<PlayButton playing={false} onToggle={() => {}} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.textContent).not.toContain("▶");
    expect(container.textContent).not.toContain("⏸");
  });

  it("has different aria-label when playing vs paused", () => {
    const { rerender } = render(<PlayButton playing={false} onToggle={() => {}} />);
    expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
    rerender(<PlayButton playing={true} onToggle={() => {}} />);
    expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();
    render(<PlayButton playing={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByLabelText(/play/i));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
