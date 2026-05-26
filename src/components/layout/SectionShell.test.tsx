import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionShell } from "./SectionShell";

describe("SectionShell", () => {
  it("renders kicker, heading, subhead, and children when all provided", () => {
    render(
      <SectionShell
        kicker={{ number: "01", label: "why" }}
        heading={<h2>Headline</h2>}
        subhead="Subhead text"
      >
        <p>Body</p>
      </SectionShell>
    );
    expect(screen.getByText("01 — WHY")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Headline" })).toBeInTheDocument();
    expect(screen.getByText("Subhead text")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders without a kicker when omitted", () => {
    render(<SectionShell heading={<h2>X</h2>}>body</SectionShell>);
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });

  it("wraps in <section> with max-w-page and section padding", () => {
    const { container } = render(<SectionShell heading={<h2>X</h2>}>body</SectionShell>);
    const section = container.querySelector("section")!;
    expect(section.className).toMatch(/max-w-page/);
    expect(section.className).toMatch(/py-/);
  });
});
