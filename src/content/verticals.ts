import type { VerticalContent, VerticalKey } from "@/lib/verticals";

// All copy here mirrors spec v3 §3.1–§3.4. Edit copy only by editing this file.

export const VERTICALS: Record<VerticalKey, VerticalContent> = {
  dental: {
    key: "dental",
    label: "Dental clinics",
    cardHook: "Never miss a new patient call.",
    headlineRoi: "Avg new-patient lifetime value: £1,800–£3,000 [source: TBD] — one missed call = one lost patient.",
    painFraming:
      "New-patient enquiries spike outside 9–5. Your reception is closed; your competitors' aren't. ANNA answers at 11pm, triages urgency, books an exam.",
    audioSampleScript:
      'Caller: "Hi, my crown fell out, can someone see me tomorrow?" → ANNA: empathy + triage urgency + offers same-day emergency slot + collects DOB + confirms payment route (NHS band + exemption status / Denplan or Practice Plan / private / US insurance) + SMSes the address.',
    smartBehaviours: [
      "Distinguishes emergency vs routine",
      "Confirms payment route",
      "Routes after-hours vs in-hours overflow differently",
      "Takes deposit at booking via Stripe SMS (where your booking system supports it)",
      "Never gives clinical advice",
    ],
    testimonialSlot: "Practice principal · business name · 'X new patients captured in month 1'",
    integrationsUk: ["Dentally", "SOE/EXACT", "Carestream R4", "Systems for Dentists", "Cliniko"],
    integrationsUsIntl: ["Dentrix", "Open Dental", "NexHealth", "Curve", "Practice-Web", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018 · ISO 27001-aligned (re-add HIPAA when US launches in phase 2)",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg new-patient lifetime value (£)", default: 2400, min: 500, max: 10000, step: 100, unit: "gbp" },
        { id: "callsPerWeek", label: "New-patient calls per week", default: 15, min: 1, max: 200, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 30, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: (inputs) => {
        const avgValue = inputs.avgValue ?? 0;
        const callsPerWeek = inputs.callsPerWeek ?? 0;
        const missedPct = inputs.missedPct ?? 0;
        return callsPerWeek * (missedPct / 100) * avgValue * 4;
      },
    },
  },

  beauty: {
    key: "beauty",
    label: "Beauty salons",
    cardHook: "Book while you blow-dry.",
    headlineRoi: "Avg booking £40–£90 · 30% of calls come while stylists' hands are full [source: TBD].",
    painFraming:
      "Phone rings mid-colour. You can't pick up. By the time you call back, she booked round the corner. ANNA knows your menu, your stylists, your slots.",
    audioSampleScript:
      'Caller: "Can I book a balayage with Jess for Saturday?" → ANNA: checks Jess\'s calendar, offers 11am or 3pm, confirms add-on toner question, sends a calendar invite.',
    smartBehaviours: [
      "Knows service menu + price list",
      "Knows which stylist does what",
      "Takes deposit at booking via Stripe SMS for colour/extension services (where your booking system supports it)",
      "SMS confirmations",
    ],
    testimonialSlot: "Salon owner · business name · 'Zero missed bookings since [month]'",
    integrationsUk: ["Phorest", "Timely", "Treatwell", "Fresha", "Booksy"],
    integrationsUsIntl: ["Square Appointments", "Vagaro", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018-compliant client data handling",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg booking value (£)", default: 65, min: 10, max: 500, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 40, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 25, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: (inputs) => {
        const avgValue = inputs.avgValue ?? 0;
        const callsPerWeek = inputs.callsPerWeek ?? 0;
        const missedPct = inputs.missedPct ?? 0;
        return callsPerWeek * (missedPct / 100) * avgValue * 4;
      },
    },
  },

  pubs: {
    key: "pubs",
    label: "Gastropubs",
    cardHook: "Reservations don't have to ring out.",
    headlineRoi: "Avg 4-cover gastro table £140–£220 · busiest service = most missed calls [source: TBD].",
    painFraming:
      "7pm Saturday. Phone rings. Floor is in the weeds. ANNA takes the booking, checks the floor plan, confirms allergens, asks about high chairs. Reservation-led gastropubs only — not wet-led.",
    audioSampleScript:
      'Caller: "Table for 6 Friday, 7:30?" → ANNA: checks availability + offers 7pm or 8pm + flags dietary requirements for the kitchen + SMS confirmation. For 8+ covers or private hire she adds: "We take a small deposit via SMS to hold the booking — alright?"',
    smartBehaviours: [
      "Reservations",
      "Private hire enquiries",
      "Flags dietary requirements (FSA 14-allergen) at booking; confirmed at service",
      "Deposit via Stripe SMS for private hire / 8+ covers",
      "Routes media/press calls to landlord",
    ],
    testimonialSlot: "Pub landlord · business name · 'Weekend covers up X%'",
    integrationsUk: ["OpenTable", "ResDiary", "SevenRooms"],
    integrationsUsIntl: ["Toast", "Square for Restaurants", "Tock"],
    complianceLine: "PCI-compliant deposit handling via Stripe",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg cover spend (£)", default: 45, min: 10, max: 200, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 80, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 35, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: (inputs) => {
        const avgValue = inputs.avgValue ?? 0;
        const callsPerWeek = inputs.callsPerWeek ?? 0;
        const missedPct = inputs.missedPct ?? 0;
        // assume avg party 4 covers
        return callsPerWeek * (missedPct / 100) * avgValue * 4 * 4;
      },
    },
  },

  construction: {
    key: "construction",
    label: "Construction / Trades",
    cardHook: "Win the job while you're on the roof.",
    headlineRoi: "Avg repair £180 · avg install £1,200 · 60% of trade leads call ≥2 numbers [source: TBD].",
    painFraming:
      "Hands full. Drill running. Boots in mud. ANNA picks up first, captures the job, books the diary, SMSes a quote ETA.",
    audioSampleScript:
      'Caller: "My boiler is leaking, can you come today?" → ANNA: "Is the stop-tap off? Is water reaching the boiler housing?" — triages emergency vs non-urgent + checks diary + offers afternoon slot + SMSes address-confirmation + flags emergency to mobile.',
    smartBehaviours: [
      "Emergency triage (stop-tap, isolation, safety qs)",
      "Postcode/territory check",
      "Quote-ETA promise",
      "SMS with address + arrival window",
      "First to call back advantage",
      "Captures Gas Safe / NICEIC number on quote enquiries",
      "Clean handoff to Xero/QuickBooks",
    ],
    testimonialSlot: "Trade owner · business name · 'X jobs booked while on-site last month'",
    integrationsUk: ["simPRO", "Commusoft", "Joblogic", "Fergus", "Powered Now", "Tradify"],
    integrationsUsIntl: ["Jobber", "Housecall Pro", "ServiceM8", "Xero", "ServiceTitan (enterprise — not £99/mo persona)"],
    complianceLine: "UK GDPR & DPA 2018",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg job value (£)", default: 350, min: 50, max: 5000, step: 50, unit: "gbp" },
        { id: "callsPerWeek", label: "Lead calls per week", default: 25, min: 1, max: 300, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls lost to faster competitor", default: 45, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: (inputs) => {
        const avgValue = inputs.avgValue ?? 0;
        const callsPerWeek = inputs.callsPerWeek ?? 0;
        const missedPct = inputs.missedPct ?? 0;
        return callsPerWeek * (missedPct / 100) * avgValue * 4;
      },
    },
  },
};
