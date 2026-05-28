import type { VerticalKey } from "@/lib/verticals";

export type DemoChannel = "phone" | "whatsapp" | "instagram" | "web";

export const DEMO_CHANNELS: DemoChannel[] = ["phone", "whatsapp", "instagram", "web"];

export type ThreadTurn = {
  from: "caller" | "anna";
  text: string;
  meta?: string;
};

export type Thread = ThreadTurn[];

// All 24 threads mirror spec v4 §7.1–§7.6 verbatim. Edit copy here only.

export const CHANNEL_DEMOS: Record<VerticalKey, Record<DemoChannel, Thread>> = {
  dental: {
    phone: [
      { from: "caller", text: "Hi, my crown fell out yesterday." },
      { from: "anna", text: "I can fit you in at 16:30 with Dr. Patel." },
      { from: "caller", text: "Yes please." },
      { from: "anna", text: "Booked. SMS on its way.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Hi, my crown fell out yesterday. Can someone see me today?" },
      { from: "anna", text: "I can fit you in at 16:30 with Dr. Patel — does that work?" },
      { from: "caller", text: "Yes please" },
      { from: "anna", text: "Booked. Are you Denplan or NHS?" },
      { from: "caller", text: "NHS Band 2" },
      { from: "anna", text: "Noted. Address + 30-min arrival window sent to your phone.", meta: "SMS confirmation ✓" },
    ],
    instagram: [
      { from: "caller", text: "Hey, saw your reel on Invisalign. Do you do free consults?" },
      { from: "anna", text: "We do — 20-min consult, no charge. Any preferred day?" },
      { from: "caller", text: "Wednesday afternoon?" },
      { from: "anna", text: "14:00 or 16:00 with Dr. Patel?" },
      { from: "caller", text: "14:00" },
      { from: "anna", text: "Booked. Calendar invite + clinic address in DMs.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Looking for a new dentist — do you take new NHS patients?" },
      { from: "anna", text: "We do — taking new NHS patients. Earliest exam is Thu 10:30 with Dr. Patel." },
      { from: "caller", text: "Anything earlier in the morning?" },
      { from: "anna", text: "Wed 08:30 just opened — yours if you'd like." },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Booked. I'll text the address and a quick health-form link.", meta: "SMS sent ✓" },
    ],
  },

  beauty: {
    phone: [
      { from: "caller", text: "Can I book a balayage with Jess for Saturday?" },
      { from: "anna", text: "11:00 or 15:00 — both 3 hrs." },
      { from: "caller", text: "15:00 please." },
      { from: "anna", text: "Booked. Deposit link incoming.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Hi, can I book a balayage with Jess for Saturday?" },
      { from: "anna", text: "Jess has 11:00 or 15:00 Saturday — both 3 hrs. Add a toner?" },
      { from: "caller", text: "15:00 with toner please" },
      { from: "anna", text: "Booked. £40 deposit holds it — link?" },
      { from: "caller", text: "Yep" },
      { from: "anna", text: "Sent. See you Sat at 15:00 ✓", meta: "Mane Studio Manchester" },
    ],
    instagram: [
      { from: "caller", text: "Saw your reel of the bridal trial yesterday — do you do those?" },
      { from: "anna", text: "We do! Trial £85, day-of from £230. Date in mind?" },
      { from: "caller", text: "Saturday 13 June afternoon" },
      { from: "anna", text: "Trial available 13:00 or 16:00 Sat 13 Jun. Which?" },
      { from: "caller", text: "16:00 please" },
      { from: "anna", text: "Held. Sending confirmation + day-of quote.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Hi — looking for partial highlights this week" },
      { from: "anna", text: "Welcome. Wed 14:00 or Thu 10:00 with Maya — both 90 min, £120." },
      { from: "caller", text: "Wed 14:00" },
      { from: "anna", text: "Name for the booking + a small deposit?" },
      { from: "caller", text: "Lisa K, yes" },
      { from: "anna", text: "Booked Lisa — see you Wed at 14:00.", meta: "Confirmation emailed ✓" },
    ],
  },

  pubs: {
    phone: [
      { from: "caller", text: "Table for 6 Friday around 19:30?" },
      { from: "anna", text: "19:00 or 20:00 — kitchen's slammed at 19:30." },
      { from: "caller", text: "20:00." },
      { from: "anna", text: "Booked. Allergens to flag?", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Table for 6 Friday around 19:30?" },
      { from: "anna", text: "19:00 or 20:00 Friday works — kitchen's slammed at 19:30. Allergens?" },
      { from: "caller", text: "20:00. One gluten-free" },
      { from: "anna", text: "Got it — flagged to the chef. High chair?" },
      { from: "caller", text: "Yes, one" },
      { from: "anna", text: "Booked. Confirmation + cancellation link sent.", meta: "The Black Swan, Cotswolds" },
    ],
    instagram: [
      { from: "caller", text: "Hi! Following you for ages. Any chance of 4 covers Sunday roast?" },
      { from: "anna", text: "Roast service runs 12:00–17:00. 13:30 or 15:00 — which?" },
      { from: "caller", text: "13:30" },
      { from: "anna", text: "Names for the booking?" },
      { from: "caller", text: "Tom + 3" },
      { from: "anna", text: "Booked Tom. See you 13:30 Sunday.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Hi, looking to book a private dining room for 14 people in June." },
      { from: "anna", text: "Sat 14 Jun or Sat 21 Jun both have the snug free. Set menu from £42pp." },
      { from: "caller", text: "Sat 14 Jun please" },
      { from: "anna", text: "Reserved. £150 holds it — payment link?" },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Sent. Set-menu options follow by email.", meta: "Email confirmation ✓" },
    ],
  },

  construction: {
    phone: [
      { from: "caller", text: "Boiler leaking, water everywhere." },
      { from: "anna", text: "Is the stop-tap off?" },
      { from: "caller", text: "Just turned it." },
      { from: "anna", text: "Mark D in your postcode 14:00 — holding the slot.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Boiler leaking, water everywhere. Can you come today?" },
      { from: "anna", text: "First — is the stop-tap off?" },
      { from: "caller", text: "Just turned it" },
      { from: "anna", text: "Mark D is in your postcode at 14:00. I'm holding the slot — confirm?" },
      { from: "caller", text: "Yes please" },
      { from: "anna", text: "Held. Mark will text his ETA. Address + plate ID sent.", meta: "DJ Plumbing & Gas" },
    ],
    instagram: [
      { from: "caller", text: "Hi, saw your kitchen refit reel. Do you quote for similar?" },
      { from: "anna", text: "We do — full-day site visit, no charge. Postcode?" },
      { from: "caller", text: "NW1" },
      { from: "anna", text: "In your area. Thu morning or Fri afternoon?" },
      { from: "caller", text: "Thu morning" },
      { from: "anna", text: "Booked. Mark will arrive 09:30 with the survey kit.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Looking for a quote on a bathroom rip-out + retile" },
      { from: "anna", text: "Happy to. Photos help — drop 4–6 here or a Drive link?" },
      { from: "caller", text: "Sent 5 photos" },
      { from: "anna", text: "Cheers — quoting £4,200–£5,800 ballpark, full quote inside 24h. Best email?" },
      { from: "caller", text: "rob.t@email.com" },
      { from: "anna", text: "Got it Rob. Full quote by Thursday.", meta: "Quote ETA confirmed ✓" },
    ],
  },

  fitness: {
    phone: [
      { from: "caller", text: "Do you have a 6pm spin tonight?" },
      { from: "anna", text: "18:00 full, 18:45 has 4 bikes left." },
      { from: "caller", text: "Yes." },
      { from: "anna", text: "Held. First class is free.", meta: "Audio sample available at launch" },
    ],
    whatsapp: [
      { from: "caller", text: "Do you have a 6pm spin class tonight?" },
      { from: "anna", text: "Tonight's 18:00 is full — 18:45 has 4 bikes left. Want one?" },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Held. First class is free. Any cycling experience?" },
      { from: "caller", text: "Some" },
      { from: "anna", text: "Noted. Studio doors open 18:30. See you tonight.", meta: "Form Studio Bristol" },
    ],
    instagram: [
      { from: "caller", text: "Hey — friend keeps recommending you. When's the next beginner class?" },
      { from: "anna", text: "Mon 19:00 and Wed 07:00 are beginner-friendly. Either work?" },
      { from: "caller", text: "Mon 19:00" },
      { from: "anna", text: "Booked your free trial. Bring water, trainers, that's it." },
      { from: "caller", text: "Mat?" },
      { from: "anna", text: "We supply mats. See you Mon 19:00.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Hi, comparing memberships. Got a list of class times?" },
      { from: "anna", text: "Membership £65/mo — unlimited classes, free trial week. Want me to book yours?" },
      { from: "caller", text: "Yes — what's available tomorrow?" },
      { from: "anna", text: "07:00 spin, 12:15 HIIT, 18:00 yoga. Pick one?" },
      { from: "caller", text: "12:15 HIIT" },
      { from: "anna", text: "Booked. Welcome email + timetable on its way.", meta: "Email confirmation ✓" },
    ],
  },

  vet: {
    phone: [
      { from: "caller", text: "My dog's been vomiting two hours." },
      { from: "anna", text: "Any blood? Anything unusual she ate?" },
      { from: "caller", text: "No blood, chewed a plant." },
      { from: "anna", text: "Routing now to Dr. Chen on call.", meta: "Emergency triage — routed" },
    ],
    whatsapp: [
      { from: "caller", text: "My dog's been vomiting two hours, won't drink. Is this urgent?" },
      { from: "anna", text: "Routing to Dr. Chen on call — quick, has she eaten anything unusual or shown any blood?" },
      { from: "caller", text: "No blood, but she chewed a plant earlier" },
      { from: "anna", text: "Got it. She'll ring you back in under 5 min." },
      { from: "caller", text: "Thank you" },
      { from: "anna", text: "Address sent for if she asks you to come in.", meta: "SMS sent ✓" },
    ],
    instagram: [
      { from: "caller", text: "Hi, our neighbour swears by you. Mittens needs her booster — when's available?" },
      { from: "anna", text: "Happy to check. Cat's name + your postcode?" },
      { from: "caller", text: "Mittens, EH3" },
      { from: "anna", text: "Mittens is due her 3-year booster. Sat 11:00 or Tue 17:00?" },
      { from: "caller", text: "Sat 11:00" },
      { from: "anna", text: "Booked. Bring her vaccination card if you have it.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "We just moved — registering 2 cats with a new practice. Process?" },
      { from: "anna", text: "Welcome — new-pet exam is £45 each. Email + previous vet name to request records?" },
      { from: "caller", text: "jen@email.com, prev vet was West End Vets" },
      { from: "anna", text: "I'll request records. Earliest joint exam: Wed 15:30." },
      { from: "caller", text: "Yes" },
      { from: "anna", text: "Booked Jen. Confirmation + new-pet form link sent.", meta: "Email confirmation ✓" },
    ],
  },
};
