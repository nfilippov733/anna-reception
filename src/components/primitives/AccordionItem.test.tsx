import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccordionItem } from "./AccordionItem";

describe("AccordionItem", () => {
  it("starts collapsed (aria-expanded=false)", () => {
    render(<AccordionItem title="Q?"><p>A</p></AccordionItem>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
  it("expands on click", async () => {
    render(<AccordionItem title="Q?"><p>A</p></AccordionItem>);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("A")).toBeVisible();
  });
  it("collapses on Escape", async () => {
    render(<AccordionItem title="Q?"><p>A</p></AccordionItem>);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
});
