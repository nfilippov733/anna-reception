export type VerticalKey = "dental" | "beauty" | "pubs" | "construction";

export const VERTICAL_KEYS: VerticalKey[] = ["dental", "beauty", "pubs", "construction"];

export function isVerticalKey(v: string): v is VerticalKey {
  return (VERTICAL_KEYS as string[]).includes(v);
}

export type VerticalContent = {
  key: VerticalKey;
  label: string;          // display name
  cardHook: string;       // tile title line
  headlineRoi: string;    // headline ROI stat
  painFraming: string;    // pain copy
  audioSampleScript: string;
  smartBehaviours: string[];
  testimonialSlot: string;          // placeholder description for sourcing
  integrationsUk: string[];
  integrationsUsIntl: string[];
  complianceLine: string;
  roi: {
    inputs: Array<{ id: string; label: string; default: number; min: number; max: number; step: number; unit: "gbp" | "count" | "percent" }>;
    leakFormula: (inputs: Record<string, number>) => number; // £/month bleeding
  };
};
