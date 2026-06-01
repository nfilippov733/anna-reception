import {
  PhoneIncoming,
  PhoneOutgoing,
  MessageCircle,
  Instagram,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker";
import { Reveal } from "@/components/primitives/Reveal";

type Channel = { icon: LucideIcon; label: string; sub: string };

const CHANNELS: Channel[] = [
  { icon: PhoneIncoming, label: "Inbound calls", sub: "Answered 24/7" },
  { icon: PhoneOutgoing, label: "Outbound calls", sub: "No-show recovery · Dormant lead chase · Opt-in per campaign" },
  { icon: MessageCircle, label: "WhatsApp", sub: "WhatsApp Business booking threads" },
  { icon: Instagram, label: "Instagram DMs", sub: "Salon & aesthetics booking" },
  { icon: MessagesSquare, label: "Web chat", sub: "Embeddable widget" },
];

export function ChannelsRibbon() {
  return (
    <section id="channels" className="bg-cream-deep border-y border-sage/30 scroll-mt-20" aria-labelledby="channels-heading">
      <div className="mx-auto max-w-page px-4 py-16 md:py-20">
        <Kicker number="02" label="Channels" />
        <h2
          id="channels-heading"
          className="mt-6 font-display text-display-md text-ink text-balance max-w-2xl"
        >
          Wherever they reach you. Answered. Booked. Chased.
        </h2>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {CHANNELS.map(({ icon: Icon, label, sub }, i) => (
            <Reveal as="li" key={label} delayMs={i * 40}>
              <Icon className="h-6 w-6 text-sage" aria-hidden="true" />
              <p className="mt-3 font-medium text-ink">{label}</p>
              <p className="mt-1 text-sm text-fg-muted leading-snug">{sub}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 font-display italic text-sage text-lg">
          One conversation memory across every channel.
        </p>
      </div>
    </section>
  );
}
