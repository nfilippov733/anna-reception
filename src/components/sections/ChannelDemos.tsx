"use client";
import { useRef } from "react";
import { PhoneIncoming, MessageCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { MessagingThread } from "@/components/channels/MessagingThread";
import { PhoneDemoPanel } from "@/components/channels/PhoneDemoPanel";
import { CHANNEL_DEMOS, type DemoChannel } from "@/content/channelDemos";
import { useChannelTab } from "@/lib/useChannelTab";
import { useSegmentParam } from "@/lib/useSegmentParam";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { VerticalKey } from "@/lib/verticals";

type Props = { initialSegment: VerticalKey };

// Two demos: the voice call, and one chat (WhatsApp-styled) standing in for
// every messaging channel.
const VISIBLE_CHANNELS: DemoChannel[] = ["phone", "whatsapp"];

const TAB_META: Record<"phone" | "whatsapp", { icon: LucideIcon; label: string }> = {
  phone: { icon: PhoneIncoming, label: "Phone" },
  whatsapp: { icon: MessageCircle, label: "Chat" },
};

export function ChannelDemos({ initialSegment }: Props) {
  const [activeSegment] = useSegmentParam(initialSegment);
  const [activeChannel, selectChannel] = useChannelTab("phone");
  const tabRefs = useRef<Record<DemoChannel, HTMLButtonElement | null>>({} as Record<DemoChannel, HTMLButtonElement | null>);
  const activeIndex = VISIBLE_CHANNELS.indexOf(activeChannel);

  const handleSelect = (k: DemoChannel) => {
    selectChannel(k);
    track("channel_tab_changed", { segment: activeSegment, channel: k });
  };

  const moveTo = (idx: number) => {
    const k = VISIBLE_CHANNELS[(idx + VISIBLE_CHANNELS.length) % VISIBLE_CHANNELS.length] as DemoChannel;
    handleSelect(k);
    tabRefs.current[k]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveTo(0);
        break;
      case "End":
        e.preventDefault();
        moveTo(VISIBLE_CHANNELS.length - 1);
        break;
    }
  };

  const panelId = `channel-panel-${activeChannel}`;
  const tabId = `channel-tab-${activeChannel}`;

  return (
    <section
      className="mx-auto max-w-page px-4 py-16 md:py-20"
      aria-labelledby="channel-demos-heading"
    >
      <Kicker number="06" label="Channel demos" />
      <h2
        id="channel-demos-heading"
        className="mt-6 font-display text-display-lg text-ink text-balance"
      >
        See it on every channel.
      </h2>
      <p className="mt-4 text-lg text-fg-muted max-w-prose leading-[1.55]">
        Hear ANNA take a call, or watch her handle a booking by message — WhatsApp,
        Instagram DMs, and web chat all work the same way.
      </p>

      <div
        role="tablist"
        aria-label="Channel selector"
        onKeyDown={handleKeyDown}
        className="mt-10 grid grid-cols-2 gap-2 max-w-md"
      >
        {VISIBLE_CHANNELS.map((c) => {
          const { icon: Icon, label } = TAB_META[c as "phone" | "whatsapp"];
          const isActive = c === activeChannel;
          return (
            <button
              key={c}
              ref={(el) => {
                tabRefs.current[c] = el;
              }}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`channel-panel-${c}`}
              id={`channel-tab-${c}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(c)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "border-primary bg-cream-deep text-ink"
                  : "border-sage/40 text-fg-muted hover:border-sage hover:text-ink"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        tabIndex={0}
        className="mt-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      >
        {activeChannel === "phone" ? (
          <PhoneDemoPanel segment={activeSegment} />
        ) : (
          <MessagingThread thread={CHANNEL_DEMOS[activeSegment].whatsapp} />
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button
          href={`/demo?v=${activeSegment}`}
          data-event="channel_demos_demo_clicked"
          onClick={() =>
            track("channel_demos_demo_clicked", { segment: activeSegment, channel: activeChannel })
          }
        >
          Book a demo
        </Button>
        <Button
          variant="ghost"
          href={`/audit?v=${activeSegment}`}
          data-event="channel_demos_audit_clicked"
          onClick={() =>
            track("channel_demos_audit_clicked", { segment: activeSegment, channel: activeChannel })
          }
        >
          Get my free revenue audit
        </Button>
      </div>
    </section>
  );
}
