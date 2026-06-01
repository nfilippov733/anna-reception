export type FaqEntry = { q: string; a: string };

// Spec v3 §9.8: 8 entries; new questions on WhatsApp/DMs and outbound.
export const FAQ: FaqEntry[] = [
  {
    q: "What happens if ANNA can't answer a caller's question?",
    a: "She apologises briefly, transfers the call live to your nominated number with a one-sentence handover, and SMSes the full transcript so your team has the written record. If no human picks up, she books a callback and texts the caller.",
  },
  {
    q: "What if ANNA mishears or books the wrong thing?",
    a: "Two safety nets catch it before it matters. First, ANNA reads the key details back on the call and sends a written confirmation (SMS or WhatsApp) for every booking — so the customer spots anything off straight away. Second, every booking lands in your own system with a full transcript attached, so your team sees it before the appointment. And if she isn't confident she's understood — a bad line, an unusual request — she doesn't guess: she asks again, or transfers to a human with the context.",
  },
  {
    q: "Will ANNA cope with strong accents or a flustered caller?",
    a: "Yes — she's tuned for UK accents and real, messy calls: background noise, people talking over themselves, changing their mind halfway through. When something's genuinely unclear she asks a short clarifying question rather than guessing, and falls back to a live transfer or a callback if needed. On the demo we'll run your hardest call types so you can hear how she handles them before you commit.",
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
    a: "ANNA handles WhatsApp Business threads and Instagram DMs the same way she handles calls — answers, books, follows up. Your existing WhatsApp Business number stays yours — ANNA replies under your verified business account, not a new number. Customers see your salon, clinic, or pub on the thread, never ANNA. We walk you through the WhatsApp Business setup on the demo call.",
  },
  {
    q: "How fast does ANNA reply to WhatsApp and DMs?",
    a: "Under a minute, day or night. A first reply within 60 seconds is what tips a DM lead from window-shopping to booked — by the time most operators check their phone between clients, ANNA has already confirmed the slot and sent the calendar invite.",
  },
  {
    q: "Will ANNA's WhatsApp and DM replies sound like a robot?",
    a: "No. ANNA uses the same tone and phrasing she learned for your phone script — same business name, same booking flow, same warmth. A customer who messages on Instagram on Tuesday and calls on Thursday gets a consistent experience, because it's one conversation memory across every channel.",
  },
  {
    q: "Does ANNA give clinical advice?",
    a: "No. ANNA triages — she asks structured questions (e.g. 'Is the stop-tap off?', 'Any blood or unusual food intake?') and routes the call. Clinical decisions stay with your team. We've built this into the script so ANNA never crosses the line, including in dental and vet contexts where it matters most.",
  },
  {
    q: "Who's responsible if ANNA gets something wrong?",
    a: "You stay in control. ANNA books, triages and routes — she never makes clinical or professional decisions; those stay with your team by design. You set what she can and can't do, every conversation is logged with a transcript, and every booking lands in your system for your team to oversee. On the demo we walk through the guardrails, the data handling, and your sign-off — nothing goes live until you're happy with how she behaves.",
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
