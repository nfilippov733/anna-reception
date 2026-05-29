import type { VerticalKey } from "@/lib/verticals";

export type DemoChannel = "phone" | "whatsapp" | "instagram" | "web";

export const DEMO_CHANNELS: DemoChannel[] = ["phone", "whatsapp", "instagram", "web"];

export type ThreadTurn = {
  from: "caller" | "anna";
  text: string;
  meta?: string;
};

export type Thread = ThreadTurn[];

// 24 threads — each shows a realistic curveball (price worry, no availability,
// out-of-area, nervousness, lock-in, big group) and ANNA handling it, with
// varied outcomes (book / triage-route / referral / waitlist / flexible hold) —
// not a linear "book → confirmed". Phone threads drive the audio in
// public/assets/audio/<segment>.mp3, so keep those two in sync.

export const CHANNEL_DEMOS: Record<VerticalKey, Record<DemoChannel, Thread>> = {
  dental: {
    phone: [
      { from: "caller", text: "My crown's come off — and I'm not even registered with you." },
      { from: "anna", text: "No problem, we take new patients. Any pain right now?" },
      { from: "caller", text: "Some. And honestly I'm worried what it'll cost." },
      { from: "anna", text: "Straight answer: the emergency exam's £65, and a re-cement is often nothing on top. Shall I hold 16:30 with Dr. Patel?" },
      { from: "caller", text: "Go on then." },
      { from: "anna", text: "Booked. I'll text the address and the price up front — no surprises.", meta: "SMS sent ✓" },
    ],
    whatsapp: [
      { from: "caller", text: "Any NHS spaces? Everywhere near me is full." },
      { from: "anna", text: "We've a short NHS waitlist — but I can see you privately this week, exam £65. Want me to hold a private slot and keep you on the NHS list too?" },
      { from: "caller", text: "Can you do both?" },
      { from: "anna", text: "Done — provisional private Thu 16:30, and you're #3 on the NHS list. If an NHS space opens first, I'll move you and refund the difference." },
      { from: "caller", text: "That's brilliant, thanks" },
      { from: "anna", text: "Sorted. Confirmation + both details on their way.", meta: "SMS confirmation ✓" },
    ],
    instagram: [
      { from: "caller", text: "Saw your Invisalign reel — but I had braces as a teen, would it even work for me?" },
      { from: "anna", text: "Often yes, even after old braces — the consult checks exactly that. It's free, 20 min, no obligation." },
      { from: "caller", text: "I really don't want a hard sell though" },
      { from: "anna", text: "No sell — Dr. Patel just tells you if you're a candidate and the cost. Wednesday 14:00 or 16:00?" },
      { from: "caller", text: "14:00" },
      { from: "anna", text: "Booked. Calendar invite + what to bring in your DMs.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Comparing a few dentists — what makes you different on price?" },
      { from: "anna", text: "Fair question. We're not the cheapest; we're transparent — every treatment's quoted before we start, and exams are £65 flat. No 'consultation then surprise'." },
      { from: "caller", text: "Okay. Any new-patient slots this week?" },
      { from: "anna", text: "Wed 08:30 or Thu 10:30 with Dr. Patel." },
      { from: "caller", text: "Wed 08:30" },
      { from: "anna", text: "Booked. I'll text the address and a quick health form.", meta: "SMS sent ✓" },
    ],
  },

  beauty: {
    phone: [
      { from: "caller", text: "Can I get a balayage Saturday — but only if it's with Jess?" },
      { from: "anna", text: "Jess is in Saturday — 11:00 or 15:00, both 3 hrs." },
      { from: "caller", text: "15:00. It's for a wedding, actually." },
      { from: "anna", text: "Lovely — for events Jess usually adds a gloss so it photographs well, £25. Want it in?" },
      { from: "caller", text: "Ooh, yes." },
      { from: "anna", text: "Added. A £40 deposit holds it — link incoming.", meta: "Deposit link sent ✓" },
    ],
    whatsapp: [
      { from: "caller", text: "I'm booked 15:00 today but stuck at work — can I push it?" },
      { from: "anna", text: "No problem. Jess has 16:30 today, or Sat 11:00. Which suits?" },
      { from: "caller", text: "16:30 today, if she can still do the full balayage" },
      { from: "anna", text: "She can — 3 hrs, you'll be out by 19:30. Moved you, and your deposit carries straight over." },
      { from: "caller", text: "You're a star" },
      { from: "anna", text: "See you 16:30. Message me if the train runs late again.", meta: "Rebooked ✓" },
    ],
    instagram: [
      { from: "caller", text: "Your bridal trials look incredible — bit scared of the price though." },
      { from: "anna", text: "Trial's £85, day-of from £230 — and the trial comes off the total if you book the day. Date in mind?" },
      { from: "caller", text: "Sat 13 June" },
      { from: "anna", text: "13:00 or 16:00 for the trial that day?" },
      { from: "caller", text: "16:00" },
      { from: "anna", text: "Held. I'll send the full breakdown so there's no surprise before you commit.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "First time here — do I have to commit to a colour over the phone?" },
      { from: "anna", text: "Not at all. Book a free 15-min colour consult with Maya first; you decide after. Wed 14:00 or Thu 10:00?" },
      { from: "caller", text: "Wed 14:00" },
      { from: "anna", text: "Name for the consult? No deposit needed for the consult itself." },
      { from: "caller", text: "Lisa K" },
      { from: "anna", text: "Booked, Lisa — Wed 14:00. No commitment till you're happy.", meta: "Confirmation emailed ✓" },
    ],
  },

  pubs: {
    phone: [
      { from: "caller", text: "Table for 6, Friday 19:30?" },
      { from: "anna", text: "19:30's fully committed I'm afraid — but I've 19:00, or a quieter 20:15. Either work?" },
      { from: "caller", text: "20:15. One of us is coeliac, is that okay?" },
      { from: "anna", text: "Absolutely — I'll flag coeliac to the kitchen now for separate prep. Booked for 6 at 20:15.", meta: "Table confirmed ✓" },
    ],
    whatsapp: [
      { from: "caller", text: "Can we do 12 for a birthday Sat night?" },
      { from: "anna", text: "We can — for 8+ we take a £10pp deposit, redeemed against the bill. Works?" },
      { from: "caller", text: "Bit much for a casual thing tbh" },
      { from: "anna", text: "Understood — it only holds the table and comes straight off your final bill, nothing extra. Or I can seat up to 6 with no deposit. Your call." },
      { from: "caller", text: "Ok, the 12 with deposit is fine" },
      { from: "anna", text: "Booked, 12 at 19:30. Deposit link + allergen form sent.", meta: "The Black Swan, Cotswolds" },
    ],
    instagram: [
      { from: "caller", text: "Following you for ages! Do you do a veggie Sunday roast?" },
      { from: "anna", text: "We do — full veggie roast with all the trimmings. 4 covers? 13:30 or 15:00?" },
      { from: "caller", text: "13:30 — and one of us is vegan, possible?" },
      { from: "anna", text: "Yes, a proper vegan roast, no booking surcharge. Names?" },
      { from: "caller", text: "Tom + 3" },
      { from: "anna", text: "Booked, Tom. Veggie + vegan both flagged to the kitchen.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Looking at the snug for 14 in June — but our numbers might change." },
      { from: "anna", text: "No problem — I can hold it on a flexible head-count up to 7 days before. Set menu from £42pp, final numbers then. Sat 14 or 21 Jun?" },
      { from: "caller", text: "Sat 14" },
      { from: "anna", text: "Reserved flexibly. £150 holds it, fully redeemable. Confirm numbers by 7 Jun." },
      { from: "caller", text: "Perfect" },
      { from: "anna", text: "Link + set-menu options sent by email.", meta: "Email confirmation ✓" },
    ],
  },

  construction: {
    phone: [
      { from: "caller", text: "Boiler's pouring water, the kitchen's flooding." },
      { from: "anna", text: "First — is the stop-tap off? Usually under the kitchen sink." },
      { from: "caller", text: "Hang on… okay, off now. It's slowing." },
      { from: "anna", text: "Good, that's the worst stopped. Mark's two streets away — I can have him there by 14:00. Call-out's £89, quoted before any work." },
      { from: "caller", text: "Do it." },
      { from: "anna", text: "Holding him now. He'll text his ETA and his Gas Safe ID.", meta: "Engineer en route ✓" },
    ],
    whatsapp: [
      { from: "caller", text: "Need a leak fixed today — do you cover Camden?" },
      { from: "anna", text: "Camden's just outside our patch, I won't pretend otherwise. But I can text you two Gas Safe firms we trust who do — want them?" },
      { from: "caller", text: "Yeah, that'd actually be really helpful" },
      { from: "anna", text: "Sent. If they can't make today, message me back and I'll see what I can pull together." },
      { from: "caller", text: "Top service, cheers" },
      { from: "anna", text: "Anytime. Stay dry.", meta: "Trusted referrals sent ✓" },
    ],
    instagram: [
      { from: "caller", text: "Saw your kitchen refit reel — roughly what's a full refit run to?" },
      { from: "anna", text: "Ballpark £8–14k depending on units and worktop — but I'd rather quote properly than guess. Free site visit? Postcode?" },
      { from: "caller", text: "NW1. That range is a bit above us though." },
      { from: "anna", text: "Understood — we also do 'facelift' refits (doors, worktop, splashback) from ~£3k. Want the visit to price both?" },
      { from: "caller", text: "Yes — Thu morning?" },
      { from: "anna", text: "Booked. Mark'll be there 09:30 with the survey kit.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Bathroom rip-out + retile — can you ballpark from photos?" },
      { from: "anna", text: "Yes — drop 4–6 photos or a Drive link, and the rough room size." },
      { from: "caller", text: "Sent 5. It's about 2×2m." },
      { from: "anna", text: "Cheers — that's a £4,200–5,800 job, full fixed quote inside 24h. Best email?" },
      { from: "caller", text: "rob.t@email.com" },
      { from: "anna", text: "Got it, Rob. Fixed quote by Thursday, no obligation.", meta: "Quote ETA confirmed ✓" },
    ],
  },

  fitness: {
    phone: [
      { from: "caller", text: "Any space in the 6pm spin tonight?" },
      { from: "anna", text: "6pm's full — but 18:45 has 4 bikes, or I can waitlist you for 6pm." },
      { from: "caller", text: "I've never actually spun before, bit nervous." },
      { from: "anna", text: "Then 18:45's perfect — it's our beginner-friendly ride, and your first class is free. Shall I hold a bike?" },
      { from: "caller", text: "Go on then." },
      { from: "anna", text: "Held. Doors at 18:30 — just bring water, we sort the rest.", meta: "Spot held — first class free ✓" },
    ],
    whatsapp: [
      { from: "caller", text: "How much are classes? Saw £18 drop-in — bit steep." },
      { from: "anna", text: "Drop-in's £18, but the £65/mo membership is unlimited — pays off at about 4 classes. And the first week's free either way." },
      { from: "caller", text: "Tempting. Can I try before committing?" },
      { from: "anna", text: "That's the free week — no card needed. Want me to start it with tonight's 18:45?" },
      { from: "caller", text: "Yes please" },
      { from: "anna", text: "Booked into the free week. No charge unless you choose to stay.", meta: "Form Studio Bristol" },
    ],
    instagram: [
      { from: "caller", text: "My mate trains with you — what's good for a total beginner?" },
      { from: "anna", text: "Mon 19:00 or Wed 07:00 are our beginner classes. Either fit?" },
      { from: "caller", text: "Mornings are hard with the kids, honestly" },
      { from: "anna", text: "Mon 19:00 it is — and we run a Saturday crèche if that ever helps. First class free. In?" },
      { from: "caller", text: "Didn't know about the crèche — yes!" },
      { from: "anna", text: "Booked Mon 19:00. Trainers + water, that's it.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Comparing gyms — what's your contract like? Hate being locked in." },
      { from: "anna", text: "No lock-in. Monthly rolling, cancel anytime from the app — and a free trial week first." },
      { from: "caller", text: "Refreshing. What's on tomorrow?" },
      { from: "anna", text: "07:00 spin, 12:15 HIIT, 18:00 yoga — pick one to start the free week?" },
      { from: "caller", text: "12:15 HIIT" },
      { from: "anna", text: "Booked. Welcome email + timetable incoming. Cancel anytime, genuinely.", meta: "Email confirmation ✓" },
    ],
  },

  vet: {
    phone: [
      { from: "caller", text: "My dog's been vomiting for two hours and now she's shaking." },
      { from: "anna", text: "Okay — has she eaten anything unusual, or is there any blood?" },
      { from: "caller", text: "No blood. She did chew a houseplant earlier." },
      { from: "anna", text: "Thank you, that matters. I'm routing you to Dr. Chen on call right now — don't try to make her sick. Stay on the line." },
      { from: "caller", text: "Okay, please hurry." },
      { from: "anna", text: "Connecting you now. I've texted our address in case she asks you to come in.", meta: "Emergency triage — routed" },
    ],
    whatsapp: [
      { from: "caller", text: "Cat's off her food 2 days, not herself. Urgent, or can it wait?" },
      { from: "anna", text: "Could be minor, but two days off food warrants a look. Any vomiting, hiding, or litter-tray changes?" },
      { from: "caller", text: "Hiding a lot, no vomiting" },
      { from: "anna", text: "Noted for the vet. Not a blue-light emergency, but let's see her today — 16:40 with Dr. Chen?" },
      { from: "caller", text: "Yes please, thank you" },
      { from: "anna", text: "Booked. If she worsens before then, message me and I'll escalate.", meta: "SMS sent ✓" },
    ],
    instagram: [
      { from: "caller", text: "New to the area — Mittens needs her booster. Taking new pets?" },
      { from: "anna", text: "We are. Cat's name, age, and your postcode?" },
      { from: "caller", text: "Mittens, 4, EH3 — her records are at our old vet though." },
      { from: "anna", text: "No problem — with your okay I'll request them directly so nothing's missed. Sat 11:00 or Tue 17:00 for the booster?" },
      { from: "caller", text: "Sat 11:00" },
      { from: "anna", text: "Booked. Bring her card if it's handy; I'll chase the rest.", meta: "Calendar invite ↗" },
    ],
    web: [
      { from: "caller", text: "Just moved here, registering 2 cats — and bracing for the cost." },
      { from: "anna", text: "The new-pet exam's £45 each, and that's the full health check — nothing sprung on you after. Want both seen together?" },
      { from: "caller", text: "Yes. Records are at West End Vets." },
      { from: "anna", text: "I'll request them. Earliest joint slot's Wed 15:30 with Dr. Chen." },
      { from: "caller", text: "Book it" },
      { from: "anna", text: "Booked, Jen. Confirmation + new-pet form on their way.", meta: "Email confirmation ✓" },
    ],
  },
};
