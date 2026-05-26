import { describe, it, expect, vi } from "vitest";
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
  it("does not call onToggle on mount but fires on click", async () => {
    const onToggle = vi.fn();
    render(<AccordionItem title="Q?" onToggle={onToggle}><p>A</p></AccordionItem>);
    expect(onToggle).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledWith(true);
    await userEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenLastCalledWith(false);
  });
});
