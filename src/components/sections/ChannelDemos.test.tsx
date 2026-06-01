import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { ChannelDemos } from "./ChannelDemos";

describe("ChannelDemos", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });

  it("renders 2 tabs (Phone / Chat)", () => {
    render(<ChannelDemos initialSegment="dental" />);
    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(screen.getByRole("tab", { name: /Phone/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Chat/i })).toBeInTheDocument();
  });

  it("selects Phone tab initially", () => {
    render(<ChannelDemos initialSegment="dental" />);
    expect(screen.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
  });

  it("clicking Chat updates aria-selected and shows the WhatsApp conversation", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="beauty" />);
    const chatTab = screen.getByRole("tab", { name: /Chat/i });
    await user.click(chatTab);
    expect(chatTab).toHaveAttribute("aria-selected", "true");
    // Beauty WhatsApp turn 1: "I'm booked 15:00 today but stuck at work — can I push it?"
    expect(screen.getByText(/can I push it/i)).toBeInTheDocument();
  });

  it("ArrowRight from Phone moves to Chat", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const phone = screen.getByRole("tab", { name: /Phone/i });
    phone.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Chat/i })).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowLeft from Phone wraps to Chat", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const phone = screen.getByRole("tab", { name: /Phone/i });
    phone.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Chat/i })).toHaveAttribute("aria-selected", "true");
  });

  it("Home jumps to Phone, End jumps to Chat", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const chat = screen.getByRole("tab", { name: /Chat/i });
    chat.focus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Chat/i })).toHaveAttribute("aria-selected", "true");
  });

  it("panel content uses the initialSegment prop", () => {
    render(<ChannelDemos initialSegment="construction" />);
    // Construction phone turn 1 (transcript is sr-only but present in the DOM).
    expect(screen.getByText(/Boiler's pouring water/i)).toBeInTheDocument();
  });

  it("footer CTAs: demo carries ?v=<segment>; leak CTA scrolls to the calculator", () => {
    render(<ChannelDemos initialSegment="vet" />);
    const demoCta = screen.getByRole("link", { name: /Book a demo/i });
    const leakCta = screen.getByRole("link", { name: /See your revenue leak/i });
    expect(demoCta).toHaveAttribute("href", "/demo?v=vet");
    expect(leakCta).toHaveAttribute("href", "#roi");
  });

  it("clicking Chat fires channel_tab_changed with { segment, channel } payload", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="fitness" />);
    const dataLayer = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const beforeLen = dataLayer.length;
    await user.click(screen.getByRole("tab", { name: /Chat/i }));
    const fired = dataLayer.slice(beforeLen).find((e) => e.event === "channel_tab_changed");
    expect(fired).toBeTruthy();
    expect(fired).toMatchObject({ event: "channel_tab_changed", segment: "fitness", channel: "whatsapp" });
  });
});
