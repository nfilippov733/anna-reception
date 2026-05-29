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
  it("renders one bubble per turn", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} />);
    const bubbles = container.querySelectorAll('[data-role$="-bubble"]');
    expect(bubbles).toHaveLength(4);
  });

  it("aligns caller (incoming) left and ANNA (outgoing) right", () => {
    const { container } = render(<MessagingThread thread={SAMPLE} />);
    const callerBubble = container.querySelector('[data-role="caller-bubble"]');
    const annaBubble = container.querySelector('[data-role="anna-bubble"]');
    expect(callerBubble?.className).toMatch(/mr-auto/);
    expect(annaBubble?.className).toMatch(/ml-auto/);
  });

  it("renders meta status when present, omits when absent", () => {
    const { container: withMeta } = render(<MessagingThread thread={SAMPLE} />);
    expect(within(withMeta).getByText(/SMS sent/i)).toBeInTheDocument();
    const without: Thread = [{ from: "caller", text: "Hi" }];
    const { container: withoutMeta } = render(<MessagingThread thread={without} />);
    expect(within(withoutMeta).queryByText(/SMS sent/i)).not.toBeInTheDocument();
  });
});
