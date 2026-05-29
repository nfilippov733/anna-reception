import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";

const SIGNALS = [
  { stat: "100,000+", label: "UK SMBs on ANNA" },
  { stat: "★★★★★", label: "Trustpilot · Excellent" },
  { stat: "24/7", label: "24/7 reception" },
  { stat: "200+", label: "200+ tools integrated" },
];

export function SocialProofLogos() {
  return (
    <section aria-label="Trust signals" className="border-y border-sage/30 bg-cream-deep">
      <div className="mx-auto max-w-page px-4 py-10 md:py-12">
        <Eyebrow className="text-center">By the team behind ANNA — 100,000+ UK SMBs</Eyebrow>
        <Reveal>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
            {SIGNALS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl text-ink tabular-nums leading-none">
                  {s.stat}
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-mono-label">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
