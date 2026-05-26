/**
 * Dev/test affordance. Surfaces missing assets visibly during development.
 * Do not use in new code; replace with real assets or semantic placeholders.
 * Currently used in: SocialProofLogos (customer logos), IntegrationsMarquee
 * (integration logos), AudioDemo (audio sample), TestimonialWall (avatars).
 * Replace each as ANNA marketing ships real assets.
 */
type Props = {
  label: string;
  width?: number;
  height?: number;
};

export function MissingAsset({ label, width = 120, height = 40 }: Props) {
  return (
    <span
      role="img"
      aria-label={`Missing asset: ${label}`}
      data-missing-asset={label}
      className="inline-flex items-center justify-center rounded border border-dashed border-leak bg-bg-alt text-leak text-xs font-mono px-2"
      style={{ width, height }}
    >
      [MISSING ASSET] {label}
    </span>
  );
}
