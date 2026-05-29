export type Testimonial = {
  vertical: "dental" | "beauty" | "pubs" | "construction" | "fitness" | "vet";
  quote: string;
  attribution: string;     // "Name · Business, City"
  hero?: boolean;          // set true for the one visually-dominant quote
};

// v3 §7.4 + §9.5: hero quote is a Trades operator.
export const TESTIMONIALS: Testimonial[] = [
  {
    vertical: "construction",
    quote: "I won three boiler jobs last month while on a roof.",
    attribution: "James W. · Westfield Plumbing & Heating, North London",
    hero: true,
  },
  {
    vertical: "dental",
    quote: "47 new patients in month 1.",
    attribution: "Dr. Patel · Bright Smiles Cardiff",
  },
  {
    vertical: "beauty",
    quote: "Zero missed bookings since we switched.",
    attribution: "Charlie R. · Mane Studio Manchester",
  },
  {
    vertical: "pubs",
    quote: "Our Saturday covers are up 23%.",
    attribution: "Emma & Joe · The Black Swan, Cotswolds",
  },
  {
    vertical: "fitness",
    quote: "Class fill is at 94% on weeknights.",
    attribution: "Maya R. · Form Studio Bristol",
  },
  {
    vertical: "vet",
    quote: "Out-of-hours triage stopped going to voicemail.",
    attribution: "Dr. Macleod · Glasgow Vet Group",
  },
];
