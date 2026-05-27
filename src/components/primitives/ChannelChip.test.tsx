import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhoneIncoming } from "lucide-react";
import { ChannelChip } from "./ChannelChip";

describe("ChannelChip", () => {
  it("renders icon and label", () => {
    render(<ChannelChip icon={PhoneIncoming} label="Inbound calls" />);
    expect(screen.getByText("Inbound calls")).toBeInTheDocument();
  });

  it("renders trailing value when provided", () => {
    render(<ChannelChip icon={PhoneIncoming} label="Inbound calls" value="71%" />);
    expect(screen.getByText("71%")).toBeInTheDocument();
  });

  it("applies small size variant", () => {
    const { container } = render(<ChannelChip icon={PhoneIncoming} label="WhatsApp" size="sm" />);
    expect(container.firstChild).toHaveClass("text-sm");
  });
});
