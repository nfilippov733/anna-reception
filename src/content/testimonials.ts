export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  metric: string;
  avatarSrc: string | null;
  /** Marketing replaces these with real customer testimonials before launch. */
  illustrative?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "She picked up at 11pm on a bank holiday. Booked an emergency exam for the next morning. The patient still talks about it.",
    name: "Practice principal",
    role: "Dental clinic, Manchester",
    metric: "First-call booking, 11pm Sunday",
    avatarSrc: null,
    illustrative: true,
  },
  {
    quote: "Hands in someone's hair on a Saturday afternoon and the phone goes. I used to lose those calls. Now she takes the booking and texts me when I'm done.",
    name: "Salon owner",
    role: "Beauty salon, Brighton",
    metric: "Zero missed bookings since launch",
    avatarSrc: null,
    illustrative: true,
  },
  {
    quote: "7pm Friday is the busiest service we run. ANNA takes the bookings, checks the floor plan, asks about allergens. We finally stopped letting the phone ring out.",
    name: "Landlord",
    role: "Gastropub, Cotswolds",
    metric: "Weekend covers up across the board",
    avatarSrc: null,
    illustrative: true,
  },
  {
    quote: "First to call back wins the job in this trade. I'm on a roof; she's the receptionist. Quoted three boilers last week from up there.",
    name: "Trade owner",
    role: "Plumbing & heating, Leeds",
    metric: "Captured 3 new install jobs from-the-roof in week 1",
    avatarSrc: null,
    illustrative: true,
  },
];
