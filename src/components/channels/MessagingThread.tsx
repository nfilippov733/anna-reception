import { MessageCircle, Instagram, MessagesSquare, type LucideIcon } from "lucide-react";
import type { Thread } from "@/content/channelDemos";
import { cn } from "@/lib/cn";

type Channel = "whatsapp" | "instagram" | "web";

type Props = {
  thread: Thread;
  channel: Channel;
};

const CHANNEL_META: Record<Channel, { icon: LucideIcon; label: string; caption: string; iconColor: string; incomingBg: string }> = {
  whatsapp: {
    icon: MessageCircle,
    label: "WhatsApp",
    caption: "Business booking thread",
    iconColor: "text-sage",
    incomingBg: "bg-sage-soft",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram",
    caption: "Direct message",
    iconColor: "text-terracotta",
    incomingBg: "bg-terracotta-soft",
  },
  web: {
    icon: MessagesSquare,
    label: "Web chat",
    caption: "Web chat",
    iconColor: "text-ink",
    incomingBg: "bg-ink-soft",
  },
};

export function MessagingThread({ thread, channel }: Props) {
  const { icon: Icon, label, caption, iconColor, incomingBg } = CHANNEL_META[channel];
  const lastTurn = thread[thread.length - 1];
  const meta = lastTurn?.meta;

  return (
    <div aria-label="Messaging thread">
      <div className="flex items-center gap-3 pb-4 border-b border-sage/30">
        <Icon className={cn("h-6 w-6", iconColor)} aria-hidden="true" />
        <div>
          <p className="font-medium text-ink">{label}</p>
          <p className="text-xs text-fg-muted">{caption}</p>
        </div>
      </div>
      <ol role="list" aria-label="Booking conversation" className="mt-6 flex flex-col gap-3">
        {thread.map((turn, i) => {
          const isCaller = turn.from === "caller";
          const bubbleRole = isCaller ? "caller-bubble" : "anna-bubble";
          const speakerLabel = isCaller ? "Customer" : "ANNA";
          return (
            <li key={i} className="flex">
              <div
                data-role={bubbleRole}
                aria-label={`${speakerLabel}: ${turn.text}`}
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-[80%] leading-snug text-ink",
                  isCaller ? cn(incomingBg, "mr-auto") : "bg-cream-deep ml-auto"
                )}
              >
                {turn.text}
              </div>
            </li>
          );
        })}
      </ol>
      {meta && (
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-mono-label">
          <span className="sr-only">Status: </span>
          {meta}
        </p>
      )}
    </div>
  );
}
