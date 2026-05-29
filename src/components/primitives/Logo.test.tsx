import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders wordmark text + ANNA image", () => {
    render(<Logo />);
    expect(screen.getByText(/ANNA Reception/)).toBeInTheDocument();
    expect(screen.getByAltText("ANNA")).toBeInTheDocument();
  });

  it("has accessible name 'ANNA Reception, by ANNA'", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: /anna reception, by anna/i })).toBeInTheDocument();
  });

  it("renders only the mark when variant=mark", () => {
    render(<Logo variant="mark" />);
    expect(screen.queryByText(/ANNA Reception/)).not.toBeInTheDocument();
    expect(screen.getByAltText("ANNA")).toBeInTheDocument();
  });
});
