import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MessagingThread } from "./MessagingThread";
import type { Thread } from "@/content/channelDemos";

const SAMPLE: Thread = [
  { from: "caller", text: "Hi, can I book?" },
  { from: "anna", text: "Sure — 11am works." },
  { from: "caller", text: "Yes please" },
  { from: "anna", text: "Booked.", meta: "SMS sent ✓" },
];

describe("MessagingThread", () => {
  it("renders one list item per turn", () => {
    render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });

  it("applies bg-sage-soft for whatsapp incoming bubbles", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    const incoming = container.querySelectorAll('[data-role="caller-bubble"]');
    expect(incoming.length).toBeGreaterThan(0);
    expect(incoming[0].className).toMatch(/bg-sage-soft/);
  });

  it("applies bg-terracotta-soft for instagram incoming bubbles", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="instagram" />);
    const incoming = container.querySelector('[data-role="caller-bubble"]');
    expect(incoming?.className).toMatch(/bg-terracotta-soft/);
  });

  it("applies bg-ink-soft for web incoming bubbles", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="web" />);
    const incoming = container.querySelector('[data-role="caller-bubble"]');
    expect(incoming?.className).toMatch(/bg-ink-soft/);
  });

  it("renders meta line when present, omits when absent", () => {
    const { container: withMeta } = render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    expect(within(withMeta).getByText(/SMS sent/i)).toBeInTheDocument();
    const without: Thread = [{ from: "caller", text: "Hi" }];
    const { container: withoutMeta } = render(<MessagingThread thread={without} channel="whatsapp" />);
    expect(within(withoutMeta).queryByText(/SMS sent/i)).not.toBeInTheDocument();
  });

  it("aligns caller bubbles left (mr-auto) and ANNA bubbles right (ml-auto)", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} channel="whatsapp" />);
    const callerBubble = container.querySelector('[data-role="caller-bubble"]');
    const annaBubble = container.querySelector('[data-role="anna-bubble"]');
    expect(callerBubble?.className).toMatch(/mr-auto/);
    expect(annaBubble?.className).toMatch(/ml-auto/);
  });
});
