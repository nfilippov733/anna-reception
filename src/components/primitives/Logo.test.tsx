import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders Reception text + ANNA wordmark image", () => {
    render(<Logo />);
    expect(screen.getByText("Reception")).toBeInTheDocument();
    expect(screen.getByAltText("ANNA")).toBeInTheDocument();
  });

  it("has accessible name 'Reception, by ANNA'", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: /reception, by anna/i })).toBeInTheDocument();
  });

  it("renders only the wordmark when variant=mark", () => {
    render(<Logo variant="mark" />);
    expect(screen.queryByText("Reception")).not.toBeInTheDocument();
    expect(screen.getByAltText("ANNA")).toBeInTheDocument();
  });
});
