import type { LucideIcon } from "lucide-react";
import { ChannelChip } from "@/components/primitives/ChannelChip";

export type Slice = {
  key: string;
  label: string;
  pct: number;
  icon: LucideIcon;
};

type Props = { slices: Slice[] };

// Sage-tone gradient applied in slice order so the visual rhythm matches the legend order.
const BAR_COLORS = ["bg-ink", "bg-primary", "bg-sage", "bg-sage/40", "bg-sage-mute"];

export function ChannelMixBar({ slices }: Props) {
  const nonZero = slices.filter((s) => s.pct > 0);
  return (
    <div>
      <div
        aria-hidden="true"
        className="flex h-3 w-full overflow-hidden rounded-full border border-sage/30"
      >
        {nonZero.map((s, i) => (
          <div
            key={s.key}
            style={{ width: `${s.pct}%` }}
            className={BAR_COLORS[i] ?? "bg-sage-mute"}
          />
        ))}
      </div>
      <dl className="mt-3 space-y-1.5">
        {nonZero.map((s) => (
          <div key={s.key} className="flex items-center justify-between">
            <dt>
              <ChannelChip icon={s.icon} label={s.label} size="sm" />
            </dt>
            <dd className="font-mono text-xs tabular-nums text-mono-label">{s.pct}%</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
