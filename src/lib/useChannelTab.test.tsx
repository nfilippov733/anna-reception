import { render, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect } from "react";
import { useChannelTab } from "./useChannelTab";
import type { DemoChannel } from "@/content/channelDemos";

function Probe({
  initial,
  onState,
}: {
  initial?: DemoChannel;
  onState: (active: DemoChannel, select: (k: DemoChannel) => void) => void;
}) {
  const [active, select] = useChannelTab(initial);
  useEffect(() => {
    onState(active, select);
  });
  return null;
}

describe("useChannelTab", () => {
  it("defaults to 'phone' when no initial is provided", () => {
    let lastActive: DemoChannel | undefined;
    render(<Probe onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("phone");
  });

  it("accepts an explicit initial value", () => {
    let lastActive: DemoChannel | undefined;
    render(<Probe initial="whatsapp" onState={(a) => (lastActive = a)} />);
    expect(lastActive).toBe("whatsapp");
  });

  it("select() updates state", () => {
    let lastActive: DemoChannel | undefined;
    let lastSelect: ((k: DemoChannel) => void) | undefined;
    render(
      <Probe
        onState={(a, s) => {
          lastActive = a;
          lastSelect = s;
        }}
      />
    );
    act(() => lastSelect!("instagram"));
    expect(lastActive).toBe("instagram");
  });
});
