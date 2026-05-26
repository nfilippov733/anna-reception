export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  metric: string;
  avatarSrc: string | null;
};

// Real testimonials sourced by ANNA marketing (spec §7). Placeholders here.
export const TESTIMONIALS: Testimonial[] = [
  { quote: "Placeholder quote 1.", name: "Practice Principal", role: "Dental clinic, UK",   metric: "X new patients in month 1", avatarSrc: null },
  { quote: "Placeholder quote 2.", name: "Salon Owner",        role: "Beauty salon, UK",    metric: "Zero missed bookings since launch", avatarSrc: null },
  { quote: "Placeholder quote 3.", name: "Pub Landlord",       role: "Gastropub, UK",       metric: "Weekend covers up X%", avatarSrc: null },
  { quote: "Placeholder quote 4.", name: "Trade Owner",        role: "Plumbing & heating, UK", metric: "X jobs booked while on-site", avatarSrc: null },
];
