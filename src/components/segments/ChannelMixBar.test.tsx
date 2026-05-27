import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneIncoming, PhoneOutgoing, MessageCircle } from "lucide-react";
import { ChannelMixBar } from "./ChannelMixBar";

const SLICES = [
  { key: "inbound" as const, label: "Inbound", pct: 71, icon: PhoneIncoming },
  { key: "outbound" as const, label: "Outbound", pct: 18, icon: PhoneOutgoing },
  { key: "whatsapp" as const, label: "WhatsApp", pct: 11, icon: MessageCircle },
];

describe("ChannelMixBar", () => {
  it("renders one legend row per non-zero slice", () => {
    render(<ChannelMixBar slices={SLICES} />);
    expect(screen.getByText("Inbound")).toBeInTheDocument();
    expect(screen.getByText("Outbound")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
  });

  it("renders the percentage for each non-zero slice", () => {
    render(<ChannelMixBar slices={SLICES} />);
    expect(screen.getByText("71%")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText("11%")).toBeInTheDocument();
  });

  it("omits zero-pct slices from the legend", () => {
    const withZero = [
      ...SLICES,
      { key: "instagram" as const, label: "Instagram", pct: 0, icon: MessageCircle },
    ];
    render(<ChannelMixBar slices={withZero} />);
    expect(screen.queryByText("Instagram")).not.toBeInTheDocument();
  });
});
