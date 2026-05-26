import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AudioDemo } from "./AudioDemo";

describe("AudioDemo", () => {
  it("renders a play button labelled for screen readers", () => {
    render(<AudioDemo />);
    expect(screen.getByRole("button", { name: /play sample call/i })).toBeInTheDocument();
  });
  it("exposes a transcript via disclosure", async () => {
    render(<AudioDemo />);
    await userEvent.click(screen.getByRole("button", { name: /read transcript/i }));
    expect(screen.getByRole("region", { name: /transcript/i })).toBeVisible();
  });
});
