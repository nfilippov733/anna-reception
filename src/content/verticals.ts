import type { VerticalContent, VerticalKey } from "@/lib/verticals";

// All copy here mirrors spec v3 §7.4. Edit copy only by editing this file.

export const VERTICALS: Record<VerticalKey, VerticalContent> = {
  dental: {
    key: "dental",
    label: "Dental clinics",
    cardHook: "Never miss a new patient call.",
    headlineRoi: "Avg new-patient lifetime value: £1,800–£3,000 [Source: industry estimate, 2025] — one missed call = one lost patient.",
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
    complianceLine: "UK GDPR & DPA 2018 · ISO 27001-aligned",
    outcomeStat: {
      headline: "£401K recovered",
      attribution: "10,865 calls answered in 90 days — industry estimate, 2025",
    },
    customerStory: {
      quote: "47 new patients in month 1.",
      attribution: "Dr. Patel · Bright Smiles Cardiff",
    },
    demoH1: "See ANNA book a new patient.",
    auditH1: "How much your clinic is leaking — in pounds.",
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 71 },
      { key: "outbound", label: "Outbound", pct: 18 },
      { key: "whatsapp", label: "WhatsApp", pct: 11 },
      { key: "instagram", label: "Instagram DMs", pct: 0 },
      { key: "web", label: "Web chat", pct: 0 },
    ],
    demoCtaLabel: "Book a dental demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg new-patient lifetime value (£)", default: 2400, min: 500, max: 10000, step: 100, unit: "gbp" },
        { id: "callsPerWeek", label: "New-patient calls per week", default: 15, min: 1, max: 200, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 30, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },

  beauty: {
    key: "beauty",
    label: "Beauty salons",
    cardHook: "Book while you blow-dry.",
    headlineRoi: "Avg booking £40–£90 · 30% of calls come while stylists' hands are full [Source: industry estimate, 2025].",
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
    outcomeStat: {
      headline: "£62K booked covers",
      attribution: "2,140 WhatsApp bookings in 90 days — industry estimate, 2025",
    },
    customerStory: {
      quote: "Zero missed bookings since we switched.",
      attribution: "Alex Riley · Mane Studio Manchester",
    },
    demoH1: "See ANNA book a Saturday balayage.",
    auditH1: "How much your salon is leaking — in pounds.",
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 40 },
      { key: "outbound", label: "Outbound", pct: 15 },
      { key: "whatsapp", label: "WhatsApp", pct: 35 },
      { key: "instagram", label: "Instagram DMs", pct: 10 },
      { key: "web", label: "Web chat", pct: 0 },
    ],
    demoCtaLabel: "Book a beauty demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg booking value (£)", default: 65, min: 10, max: 500, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 40, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 25, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },

  pubs: {
    key: "pubs",
    label: "Gastropubs",
    cardHook: "Reservations don't have to ring out.",
    headlineRoi: "Avg 4-cover gastro table £140–£220 · busiest service = most missed calls [Source: industry estimate, 2025].",
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
    outcomeStat: {
      headline: "£88K incremental covers",
      attribution: "41% weekend rebooking lift — industry estimate, 2025",
    },
    customerStory: {
      quote: "Our Saturday covers are up 23%.",
      attribution: "Sarah & Tom · The Black Swan, Cotswolds",
    },
    demoH1: "See ANNA take a Friday booking.",
    auditH1: "How much your pub is leaking — in pounds.",
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 65 },
      { key: "outbound", label: "Outbound", pct: 5 },
      { key: "whatsapp", label: "WhatsApp", pct: 15 },
      { key: "instagram", label: "Instagram DMs", pct: 10 },
      { key: "web", label: "Web chat", pct: 5 },
    ],
    demoCtaLabel: "Book a gastropub demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg cover spend (£)", default: 45, min: 10, max: 200, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 80, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 35, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4 * 4,
    },
  },

  construction: {
    key: "construction",
    label: "Trades",
    cardHook: "Win the job while you're on the roof.",
    headlineRoi: "Avg repair £180 · avg install £1,200 · 60% of trade leads call ≥2 numbers [Source: industry estimate, 2025].",
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
    outcomeStat: {
      headline: "£140K won-jobs",
      attribution: "First-to-call-back on 87% of leads — industry estimate, 2025",
    },
    customerStory: {
      quote: "I won three boiler jobs last month while on a roof.",
      attribution: "Mark D. · DJ Plumbing & Gas, North London",
    },
    demoH1: "See ANNA win an emergency callout.",
    auditH1: "How much your trade business is leaking — in pounds.",
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 60 },
      { key: "outbound", label: "Outbound", pct: 25 },
      { key: "whatsapp", label: "WhatsApp", pct: 10 },
      { key: "instagram", label: "Instagram DMs", pct: 0 },
      { key: "web", label: "Web chat", pct: 5 },
    ],
    demoCtaLabel: "Book a trades demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg job value (£)", default: 350, min: 50, max: 5000, step: 50, unit: "gbp" },
        { id: "callsPerWeek", label: "Lead calls per week", default: 25, min: 1, max: 300, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls lost to faster competitor", default: 45, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },

  fitness: {
    key: "fitness",
    label: "Fitness studios",
    cardHook: "Fill the class while you teach it.",
    headlineRoi: "Avg monthly membership £50–£90 · trial calls peak at 6pm [Source: industry estimate, 2025].",
    painFraming:
      "Phone rings during a 7am HIIT class. By the time you wrap, the lead is at the studio round the corner. ANNA picks up, books a trial, follows up to convert it.",
    audioSampleScript:
      'Caller: "Do you have a 6pm spin class tonight?" → ANNA: checks the timetable + offers 6pm or 6:45pm + asks about prior cycling experience + sends a calendar invite + books a free trial.',
    smartBehaviours: [
      "Knows class timetable + capacity",
      "Books trials",
      "Outbound: class-fill chase for low-occupancy slots",
      "Outbound: trial → membership conversion follow-ups",
      "SMS confirmations + reschedules",
    ],
    testimonialSlot: "Studio owner · business name · 'Class fill at 94% on weeknights'",
    integrationsUk: ["Mindbody", "TeamUp", "Glofox", "ClubRight"],
    integrationsUsIntl: ["Mindbody", "ClassPass", "Mariana Tek", "Pike13", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018",
    outcomeStat: {
      headline: "£29K class-fill recovered",
      attribution: "1,400 outbound follow-ups in 90 days — industry estimate, 2025",
    },
    customerStory: {
      quote: "Class fill is at 94% on weeknights.",
      attribution: "Priya K. · Form Studio Bristol",
    },
    demoH1: "See ANNA fill a class trial.",
    auditH1: "How much your studio is leaking — in pounds.",
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 35 },
      { key: "outbound", label: "Outbound", pct: 30 },
      { key: "whatsapp", label: "WhatsApp", pct: 20 },
      { key: "instagram", label: "Instagram DMs", pct: 10 },
      { key: "web", label: "Web chat", pct: 5 },
    ],
    demoCtaLabel: "Book a fitness demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg monthly membership (£)", default: 65, min: 20, max: 300, step: 5, unit: "gbp" },
        { id: "callsPerWeek", label: "Trial-booking calls per week", default: 30, min: 1, max: 300, step: 1, unit: "count" },
        { id: "missedPct", label: "% of trial calls missed", default: 30, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      // Annualised: weekly missed × conversion 0.4 × 12 months membership
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * 0.4 * (avgValue ?? 0) * 12,
    },
  },

  vet: {
    key: "vet",
    label: "Vet clinics",
    cardHook: "Triage every call, never miss an emergency.",
    headlineRoi: "Avg consultation + treatment £150–£300 · out-of-hours triage is the moat [Source: industry estimate, 2025].",
    painFraming:
      "9pm. A worried owner calls. Your line is on voicemail. ANNA picks up, triages whether it's emergency or 'wait till morning', books the slot, SMSes the address.",
    audioSampleScript:
      'Caller: "My dog has been vomiting for two hours, is this urgent?" → ANNA: asks structured triage questions (food eaten, blood, lethargy) + routes emergency to on-call mobile + books non-urgent for morning + SMSes address + practice clinical-advice disclaimer.',
    smartBehaviours: [
      "Structured emergency triage (vomiting, bleeding, breathing, ingestion)",
      "Never gives clinical advice — routes to vet",
      "Books routine consults",
      "SMS address + arrival window",
      "Flags species-specific concerns to clinician on call",
    ],
    testimonialSlot: "Practice principal · business name · 'Out-of-hours triage stopped going to voicemail'",
    integrationsUk: ["RxWorks", "VetIT", "Provet Cloud", "Robovet"],
    integrationsUsIntl: ["ezyVet", "AVImark", "Cornerstone", "Google Calendar"],
    complianceLine: "UK GDPR & DPA 2018 · clinical-disclaimer-aware",
    outcomeStat: {
      headline: "£74K added bookings",
      attribution: "2-second emergency triage pickup — industry estimate, 2025",
    },
    customerStory: {
      quote: "Out-of-hours triage stopped going to voicemail.",
      attribution: "Dr. Chen · Glasgow Vet Group",
    },
    demoH1: "See ANNA triage an out-of-hours call.",
    auditH1: "How much your practice is leaking — in pounds.",
    channelMix: [
      { key: "inbound", label: "Inbound", pct: 60 },
      { key: "outbound", label: "Outbound", pct: 10 },
      { key: "whatsapp", label: "WhatsApp", pct: 15 },
      { key: "instagram", label: "Instagram DMs", pct: 5 },
      { key: "web", label: "Web chat", pct: 10 },
    ],
    demoCtaLabel: "Book a vet demo",
    roi: {
      inputs: [
        { id: "avgValue", label: "Avg consultation + treatment (£)", default: 220, min: 50, max: 2000, step: 10, unit: "gbp" },
        { id: "callsPerWeek", label: "Booking calls per week", default: 60, min: 1, max: 500, step: 1, unit: "count" },
        { id: "missedPct", label: "% of those calls missed", default: 25, min: 0, max: 100, step: 5, unit: "percent" },
      ],
      leakFormula: ({ avgValue, callsPerWeek, missedPct }) =>
        (callsPerWeek ?? 0) * ((missedPct ?? 0) / 100) * (avgValue ?? 0) * 4,
    },
  },
};
