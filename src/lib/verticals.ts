export type VerticalKey = "dental" | "beauty" | "pubs" | "construction" | "fitness" | "vet";

export const VERTICAL_KEYS: VerticalKey[] = ["dental", "beauty", "pubs", "construction", "fitness", "vet"];

export function isVerticalKey(v: string): v is VerticalKey {
  return (VERTICAL_KEYS as string[]).includes(v);
}

export type ChannelKey = "inbound" | "outbound" | "whatsapp" | "instagram" | "web";

export type OutcomeStat = {
  headline: string;          // e.g. "£401K recovered"
  attribution: string;       // e.g. "10,865 calls answered in 90 days — Image Orthodontics, Chicago"
};

export type CustomerStory = {
  quote: string;             // e.g. "47 new patients in month 1."
  attribution: string;       // e.g. "Dr. Patel · Bright Smiles Cardiff"
};

export type ChannelMixSlice = {
  key: ChannelKey;
  label: string;             // display label, e.g. "Inbound"
  pct: number;               // 0-100
};

export type VerticalContent = {
  key: VerticalKey;
  label: string;
  cardHook: string;
  headlineRoi: string;
  painFraming: string;
  audioSampleScript: string;
  smartBehaviours: string[];
  testimonialSlot: string;
  integrationsUk: string[];
  integrationsUsIntl: string[];
  complianceLine: string;
  // v3 additions
  outcomeStat: OutcomeStat;
  customerStory: CustomerStory;
  // v4 Sprint E: 2-3 short feature chips shown above the channel mix bar.
  featureChips?: string[];
  // v4 Sprint D: per-segment H1s that read naturally as a sentence.
  demoH1: string;
  auditH1: string;
  channelMix: ChannelMixSlice[];
  demoCtaLabel: string;
  // v4 Sprint F: short noun for what the missed-£ figure represents (e.g. "patient bookings", "covers").
  // Shown as a secondary line on the RoiCalculator output.
  outcomeUnit: string;
  roi: {
    inputs: Array<{
      id: string;
      label: string;
      default: number;
      min: number;
      max: number;
      step: number;
      unit: "gbp" | "count" | "percent";
    }>;
    leakFormula: (inputs: Record<string, number>) => number;
  };
};
