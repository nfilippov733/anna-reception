"use client";
import { useState } from "react";
import { DEMO_CHANNELS, type DemoChannel } from "@/content/channelDemos";

export function useChannelTab(
  initial: DemoChannel = "phone"
): [DemoChannel, (k: DemoChannel) => void] {
  const [active, setActive] = useState<DemoChannel>(initial);

  const select = (k: DemoChannel) => {
    if (!DEMO_CHANNELS.includes(k)) return;
    setActive(k);
  };

  return [active, select];
}
