import Image from "next/image";
import {
  PhoneIncoming,
  PhoneOutgoing,
  MessageCircle,
  Instagram,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Kicker } from "@/components/primitives/Kicker";
import { ChannelMixBar, type Slice } from "@/components/segments/ChannelMixBar";
import type { VerticalContent, ChannelKey } from "@/lib/verticals";

const CHANNEL_ICONS: Record<ChannelKey, LucideIcon> = {
  inbound: PhoneIncoming,
  outbound: PhoneOutgoing,
  whatsapp: MessageCircle,
  instagram: Instagram,
  web: MessagesSquare,
};

type Props = {
  content: VerticalContent;
  panelId: string;
  labelledBy: string;
  kickerLetter: string;
};

export function SegmentPanel({ content, panelId, labelledBy, kickerLetter }: Props) {
  const slices: Slice[] = content.channelMix.map((c) => ({
    key: c.key,
    label: c.label,
    pct: c.pct,
    icon: CHANNEL_ICONS[c.key],
  }));

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={labelledBy}
      tabIndex={0}
      className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 min-h-[640px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <div className="relative">
        <Image
          src={`/assets/redesign/segments/${content.key}.png`}
          alt=""
          width={720}
          height={900}
          aria-hidden="true"
          loading="lazy"
          className="w-full h-auto"
        />
      </div>
      <div>
        <Kicker number={`04${kickerLetter}`} label={content.label} />

        <p className="mt-6 font-display text-display-xl text-ink leading-none tabular-nums">
          {content.outcomeStat.headline}
        </p>
        <p className="mt-3 text-fg-muted">{content.outcomeStat.attribution}</p>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">The pain</p>
        <p className="mt-3 text-ink leading-[1.55]">{content.painFraming}</p>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Channel mix here</p>
        <div className="mt-3">
          <ChannelMixBar slices={slices} />
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Sample call</p>
        <p className="mt-3 text-fg-muted text-sm leading-[1.55]">{content.audioSampleScript}</p>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mono-label">Works with</p>
        <p className="mt-3 text-ink leading-[1.55]">
          <span className="font-medium">UK:</span> {content.integrationsUk.join(" · ")}
        </p>
        <p className="mt-2 text-ink leading-[1.55]">
          <span className="font-medium">US/intl:</span> {content.integrationsUsIntl.join(" · ")}
        </p>

        <blockquote className="mt-8 border-l-2 border-sage pl-4">
          <p className="text-ink text-lg leading-snug">&ldquo;{content.customerStory.quote}&rdquo;</p>
          <footer className="mt-2 text-sm text-fg-muted">— {content.customerStory.attribution}</footer>
        </blockquote>

        <Button href={`/demo?v=${content.key}`} className="mt-8">
          {content.demoCtaLabel}
        </Button>
      </div>
    </div>
  );
}
