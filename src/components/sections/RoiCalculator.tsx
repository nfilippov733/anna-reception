"use client";
import { useMemo, useState } from "react";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { computeRecovery } from "@/lib/roi";
import { AnimatedNumber } from "@/components/primitives/AnimatedNumber";
import { Kicker } from "@/components/primitives/Kicker";
import { LinkArrow } from "@/components/primitives/LinkArrow";
import { Reveal } from "@/components/primitives/Reveal";
import { VerticalMark } from "@/components/primitives/VerticalMark";
import { track } from "@/lib/analytics";

type Props = {
  initialVertical?: VerticalKey | null;
};

export function RoiCalculator({ initialVertical = null }: Props) {
  const [vertical, setVertical] = useState<VerticalKey | null>(initialVertical);
  const config = vertical ? VERTICALS[vertical] : null;
  const [values, setValues] = useState<Record<string, number>>(() =>
    config ? Object.fromEntries(config.roi.inputs.map((i) => [i.id, i.default])) : {}
  );

  function selectVertical(key: VerticalKey) {
    setVertical(key);
    const defaults = Object.fromEntries(VERTICALS[key].roi.inputs.map((i) => [i.id, i.default]));
    setValues(defaults);
    track("roi_calculator_started", { vertical: key });
  }

  const leak = useMemo(() => (config ? config.roi.leakFormula(values) : 0), [config, values]);
  const recovery = useMemo(() => computeRecovery(leak), [leak]);

  return (
    <section id="roi" className="mx-auto max-w-page px-4 py-24 md:py-32" aria-labelledby="roi-heading">
      <Kicker number="04" label="See your leak in 30 seconds" />
      <h2 id="roi-heading" className="mt-6 font-display text-display-lg text-ink text-balance">
        See your leak in 30 seconds.
      </h2>

      {!vertical && (
        <div className="mt-12">
          <h3 className="font-medium text-lg">Pick your business.</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICAL_KEYS.map((k, i) => (
              <Reveal key={k} delayMs={i * 60}>
                <button
                  type="button"
                  onClick={() => selectVertical(k)}
                  className="group flex flex-col items-start gap-4 rounded-2xl border border-sage-mute p-6 text-left min-h-[120px] transition-colors duration-150 hover:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full"
                >
                  <VerticalMark vertical={k} variant="illustration" className="h-14 w-14 text-primary group-hover:scale-105 transition-transform duration-150 motion-reduce:transition-none" />
                  <div>
                    <div className="font-medium text-ink">{VERTICALS[k].label}</div>
                    <div className="mt-1 text-sm text-fg-muted">{VERTICALS[k].cardHook}</div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {vertical && config && (
        <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <VerticalMark vertical={vertical} variant="illustration" className="h-14 w-14 text-primary" />
              <h3 className="font-display text-display-md text-ink">{config.label}</h3>
            </div>
            <div className="mt-8 space-y-6">
              {config.roi.inputs.map((input) => (
                <label key={input.id} className="block">
                  <span className="font-mono text-xs uppercase tracking-wider text-mono-label">{input.label}</span>
                  <input
                    type="number"
                    role="spinbutton"
                    inputMode="numeric"
                    aria-label={input.label}
                    value={values[input.id] ?? input.default}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [input.id]: Number(e.target.value) || 0 }))
                    }
                    className="mt-1 w-full border-0 border-b-2 border-sage/30 bg-transparent px-0 py-3 font-display text-3xl text-ink tabular-nums focus:border-primary focus:outline-none transition-colors"
                  />
                </label>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-6 items-center">
              <LinkArrow
                href="/audit"
                data-event="hero_cta_audit_clicked"
              >
                Get my full audit
              </LinkArrow>
              <button
                type="button"
                onClick={() => setVertical(null)}
                className="font-mono text-xs uppercase tracking-wider text-mono-label hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                Change business type
              </button>
            </div>
          </div>
          <aside className="rounded-2xl border border-sage-mute p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-mono-label">£/month bleeding</p>
            <p className="mt-2 font-display text-display-xl text-leak leading-none tabular-nums">
              <AnimatedNumber value={leak} format="gbp" />
            </p>
            <p className="mt-8 font-mono text-xs uppercase tracking-wider text-mono-label">ANNA recovers (est. 80%)</p>
            <p className="mt-2 font-display text-display-md text-primary leading-none tabular-nums">
              <AnimatedNumber value={recovery} format="gbp" />
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
