import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ChannelDemos } from "./ChannelDemos";

describe("ChannelDemos", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });

  it("renders 4 tabs (Phone / WhatsApp / Instagram / Web chat)", () => {
    render(<ChannelDemos initialSegment="dental" />);
    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(screen.getByRole("tab", { name: /Phone/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /WhatsApp/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Web chat/i })).toBeInTheDocument();
  });

  it("selects Phone tab initially", () => {
    render(<ChannelDemos initialSegment="dental" />);
    expect(screen.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
  });

  it("clicking a tab updates aria-selected and swaps panel content", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="beauty" />);
    const whatsappTab = screen.getByRole("tab", { name: /WhatsApp/i });
    await user.click(whatsappTab);
    expect(whatsappTab).toHaveAttribute("aria-selected", "true");
    // Beauty WhatsApp turn 1: "I'm booked 15:00 today but stuck at work — can I push it?"
    expect(screen.getByText(/can I push it/i)).toBeInTheDocument();
  });

  it("ArrowRight from Phone moves to WhatsApp", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const phone = screen.getByRole("tab", { name: /Phone/i });
    phone.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /WhatsApp/i })).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowLeft from Phone wraps to Web chat", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const phone = screen.getByRole("tab", { name: /Phone/i });
    phone.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Web chat/i })).toHaveAttribute("aria-selected", "true");
  });

  it("Home jumps to Phone, End jumps to Web chat", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="dental" />);
    const instagram = screen.getByRole("tab", { name: /Instagram/i });
    instagram.focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Web chat/i })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
  });

  it("panel content uses the initialSegment prop", () => {
    render(<ChannelDemos initialSegment="construction" />);
    // Construction phone turn 1: "Boiler's pouring water, the kitchen's flooding."
    expect(screen.getByText(/Boiler's pouring water/i)).toBeInTheDocument();
  });

  it("footer CTAs carry ?v=<segment> in href", () => {
    render(<ChannelDemos initialSegment="vet" />);
    const demoCta = screen.getByRole("link", { name: /Book a demo/i });
    const auditCta = screen.getByRole("link", { name: /Get my free revenue audit/i });
    expect(demoCta).toHaveAttribute("href", "/demo?v=vet");
    expect(auditCta).toHaveAttribute("href", "/audit?v=vet");
  });

  it("clicking a tab fires channel_tab_changed with { segment, channel } payload", async () => {
    const user = userEvent.setup();
    render(<ChannelDemos initialSegment="fitness" />);
    const dataLayer = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const beforeLen = dataLayer.length;
    await user.click(screen.getByRole("tab", { name: /Instagram/i }));
    const fired = dataLayer.slice(beforeLen).find((e) => e.event === "channel_tab_changed");
    expect(fired).toBeTruthy();
    expect(fired).toMatchObject({ event: "channel_tab_changed", segment: "fitness", channel: "instagram" });
  });
});
