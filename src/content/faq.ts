export type FaqEntry = { q: string; a: string };

// Spec §14: must include one question on the human-transfer fail-safe.
export const FAQ: FaqEntry[] = [
  {
    q: "What happens if ANNA can't answer a caller's question?",
    a: "She apologises briefly, transfers the call live to your nominated number with a one-sentence handover, and SMSes the full transcript so your team has the written record. If no human picks up, she books a callback and texts the caller.",
  },
  {
    q: "How does setup work?",
    a: "Paste your website on the demo call; ANNA learns your menu, hours, and tone in about three minutes. We'll have her live on a test number within the same call.",
  },
  {
    q: "Will my callers know it's AI?",
    a: "Most don't realise — listen to the sample above. We're upfront when asked directly, and you can configure her opening line however you'd like.",
  },
  {
    q: "Does ANNA write to my calendar / PMS / CRM?",
    a: "Yes, where the integration supports it. See the full list — 200+ integrations including Dentally, Phorest, simPRO, OpenTable, Xero, Google Calendar.",
  },
  {
    q: "What about my data?",
    a: "ANNA Reception is built on a UK GDPR / DPA 2018 footing. Conversation data is stored encrypted; you control retention.",
  },
  {
    q: "Can I cancel?",
    a: "Any time. No long contracts. Cancel from the dashboard.",
  },
];
