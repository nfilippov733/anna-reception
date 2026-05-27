import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChannelsRibbon } from "./ChannelsRibbon";

describe("ChannelsRibbon", () => {
  it("renders all 5 channels with labels", () => {
    render(<ChannelsRibbon />);
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(screen.getByText("Inbound calls")).toBeInTheDocument();
    expect(screen.getByText("Outbound calls")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Instagram DMs")).toBeInTheDocument();
    expect(screen.getByText("Web chat")).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<ChannelsRibbon />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Wherever they reach you/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the closing line", () => {
    render(<ChannelsRibbon />);
    expect(
      screen.getByText(/One conversation memory across every channel/i)
    ).toBeInTheDocument();
  });
});
