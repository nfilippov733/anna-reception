"use client";
import { useRef } from "react";
import {
  PhoneIncoming,
  MessageCircle,
  Instagram,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { MessagingThread } from "@/components/channels/MessagingThread";
import { PhoneDemoPanel } from "@/components/channels/PhoneDemoPanel";
import { CHANNEL_DEMOS, DEMO_CHANNELS, type DemoChannel } from "@/content/channelDemos";
import { useChannelTab } from "@/lib/useChannelTab";
import { useSegmentParam } from "@/lib/useSegmentParam";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { VerticalKey } from "@/lib/verticals";

type Props = { initialSegment: VerticalKey };

const TAB_META: Record<DemoChannel, { icon: LucideIcon; label: string }> = {
  phone: { icon: PhoneIncoming, label: "Phone" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp" },
  instagram: { icon: Instagram, label: "Instagram" },
  web: { icon: MessagesSquare, label: "Web chat" },
};

export function ChannelDemos({ initialSegment }: Props) {
  const [activeSegment] = useSegmentParam(initialSegment);
  const [activeChannel, selectChannel] = useChannelTab("phone");
  const tabRefs = useRef<Record<DemoChannel, HTMLButtonElement | null>>({} as Record<DemoChannel, HTMLButtonElement | null>);
  const activeIndex = DEMO_CHANNELS.indexOf(activeChannel);

  const handleSelect = (k: DemoChannel) => {
    selectChannel(k);
    track("channel_tab_changed", { segment: activeSegment, channel: k });
  };

  const moveTo = (idx: number) => {
    const k = DEMO_CHANNELS[(idx + DEMO_CHANNELS.length) % DEMO_CHANNELS.length] as DemoChannel;
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
        moveTo(DEMO_CHANNELS.length - 1);
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
        Booking-ready conversations on phone, WhatsApp, Instagram, and your website.
      </p>

      <div
        role="tablist"
        aria-label="Channel selector"
        onKeyDown={handleKeyDown}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
      >
        {DEMO_CHANNELS.map((c) => {
          const { icon: Icon, label } = TAB_META[c];
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
                "flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive ? "text-ink" : "text-fg-muted hover:text-ink"
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="font-display text-lg">{label}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-0.5 w-12 transition-colors duration-200 motion-reduce:transition-none",
                  isActive ? "bg-sage" : "bg-transparent"
                )}
              />
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
          <MessagingThread
            thread={CHANNEL_DEMOS[activeSegment][activeChannel]}
            channel={activeChannel}
          />
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
