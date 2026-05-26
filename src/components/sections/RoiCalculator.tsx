"use client";
import { useMemo, useState } from "react";
import { VERTICALS } from "@/content/verticals";
import { VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";
import { computeRecovery } from "@/lib/roi";
import { AnimatedNumber } from "@/components/primitives/AnimatedNumber";
import { Button } from "@/components/primitives/Button";
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
    <section id="roi" className="mx-auto max-w-page px-4 py-16" aria-labelledby="roi-heading">
      <h2 id="roi-heading" className="font-display text-3xl md:text-5xl">See your leak in 30 seconds.</h2>

      {!vertical && (
        <div className="mt-8">
          <h3 className="text-lg font-medium">Pick your business.</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICAL_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => selectVertical(k)}
                className="rounded-2xl border border-border bg-bg-alt p-4 text-left hover:border-fg/40 min-h-[88px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="font-medium">{VERTICALS[k].label}</div>
                <div className="mt-1 text-sm text-fg-muted">{VERTICALS[k].cardHook}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {vertical && config && (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="text-2xl font-medium">{config.label}</h3>
            <div className="mt-6 space-y-5">
              {config.roi.inputs.map((input) => (
                <label key={input.id} className="block">
                  <span className="text-sm text-fg-muted">{input.label}</span>
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
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-lg tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="ghost" href="/audit" data-event="hero_cta_audit_clicked"
                onClick={() => track("roi_calculator_completed", { vertical, leakValue: leak })}>
                Get my full audit
              </Button>
              <button
                type="button"
                onClick={() => setVertical(null)}
                className="text-sm text-fg-muted underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Change business type
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-bg-alt border border-border p-6">
            <div className="text-sm text-fg-muted">£/month bleeding</div>
            <div className="mt-1 font-display text-5xl text-leak">
              <AnimatedNumber value={leak} format="gbp" />
            </div>
            <div className="mt-6 text-sm text-fg-muted">ANNA recovers (est. 80%)</div>
            <div className="mt-1 font-display text-3xl text-gain">
              <AnimatedNumber value={recovery} format="gbp" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
