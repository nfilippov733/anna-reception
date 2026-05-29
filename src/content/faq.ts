export type FaqEntry = { q: string; a: string };

// Spec v3 §9.8: 8 entries; new questions on WhatsApp/DMs and outbound.
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
    q: "Do callers know it's ANNA?",
    a: "Most don't ask. ANNA introduces herself by your business name, books the appointment, and SMSes a confirmation. If a caller asks directly, she's straightforward about being your automated reception.",
  },
  {
    q: "Can ANNA sound like me?",
    a: "ANNA learns your business name, your booking flow, and your tone. On the demo call we capture a 60-second sample of you talking through your top three booking scenarios — ANNA mirrors phrasing, pace, and any specific language you use (e.g. 'mate', 'love', clinical terminology). She's never trying to impersonate you — just to sound like she works for you.",
  },
  {
    q: "What about WhatsApp and Instagram DMs?",
    a: "ANNA handles WhatsApp Business threads and Instagram DMs the same way she handles calls — answers, books, follows up. WhatsApp Business needs a verified business number; we walk you through it on the demo call.",
  },
  {
    q: "Does ANNA do outbound calls?",
    a: "Yes. No-show recovery, dormant quote chase, appointment confirmations — opt-in per campaign. You stay in control of who she calls and when.",
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
