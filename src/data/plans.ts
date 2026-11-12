export type PlanId = 'base' | 'house' | 'private';
export type Billing = 'monthly' | 'annual';

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number;
  line: string;
  highlights: string[];
  featured?: string;
};

export const PLANS: Plan[] = [
  {
    id: 'base',
    name: 'Base',
    monthly: 129,
    line: 'The Hall and the Deck, on your own schedule.',
    highlights: ['Strength Hall & Conditioning Deck', 'Eight classes a month', 'Vault access, weekdays 10:00 — 16:00', 'Induction & movement assessment'],
  },
  {
    id: 'house',
    name: 'House',
    monthly: 189,
    line: 'Every floor, every class, every day.',
    highlights: ['Everything in Base', 'Unlimited classes, booked 7 days ahead', 'Full Vault access, all hours', 'Quarterly review with a coach', 'Towel & kit laundry'],
    featured: 'Chosen by 61% of members',
  },
  {
    id: 'private',
    name: 'Private',
    monthly: 390,
    line: 'A coach, a physio and a locker with your name on it.',
    highlights: ['Everything in House', 'Four 1:1 sessions every month', 'Physiotherapy assessment each quarter', 'Private locker & 14-day booking', 'Two guest passes a month'],
  },
];

export const planById = (id: string | null | undefined) => PLANS.find((p) => p.id === id);

/** Annual billing: twelve months for the price of ten. */
export const priceFor = (plan: Plan, billing: Billing) => (billing === 'annual' ? Math.round((plan.monthly * 10) / 12) : plan.monthly);
export const JOINING_FEE = 95;

type Cell = boolean | string;
export const COMPARISON: { group: string; rows: { label: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    group: 'Training',
    rows: [
      { label: 'Strength Hall & Conditioning Deck', values: [true, true, true] },
      { label: 'Group classes', values: ['8 / month', 'Unlimited', 'Unlimited'] },
      { label: 'Booking window', values: ['3 days', '7 days', '14 days'] },
      { label: 'Personal training', values: ['From £85', 'From £85', '4 sessions / month'] },
      { label: 'Programme review with a coach', values: [false, 'Quarterly', 'Monthly'] },
    ],
  },
  {
    group: 'Recovery',
    rows: [
      { label: 'Sauna, plunge & pool', values: ['Weekdays 10 — 16', 'All hours', 'All hours'] },
      { label: 'Physiotherapy assessment', values: [false, false, 'Quarterly'] },
      { label: 'Sports massage', values: ['£85', '£75', '£60'] },
    ],
  },
  {
    group: 'The house',
    rows: [
      { label: 'Towel & kit laundry', values: [false, true, true] },
      { label: 'Private named locker', values: [false, false, true] },
      { label: 'Guest passes', values: [false, '1 / quarter', '2 / month'] },
      { label: 'Membership freeze', values: ['1 month / yr', '2 months / yr', '3 months / yr'] },
    ],
  },
];

export const ADDONS = [
  { name: 'Nutrition coaching', price: '£60', unit: 'per month', note: 'Fortnightly check-ins with Ilan’s team' },
  { name: 'Physiotherapy', price: '£75', unit: 'per session', note: '45 minutes in the Vault suites' },
  { name: 'DEXA body scan', price: '£95', unit: 'per scan', note: 'Bone, fat and lean mass, mapped' },
  { name: 'Day pass', price: '£35', unit: 'per visit', note: 'Credited if you join within 14 days' },
];

export const FAQ = [
  {
    q: 'Why is membership capped at 1,200?',
    a: 'Because a rack should be free when you arrive. We count the floor every hour, and the cap is the number that keeps peak times civilised. When we are full, applications join a short waiting list — usually two to four weeks.',
  },
  {
    q: 'Is there a minimum term?',
    a: 'Monthly memberships roll month to month with one month’s notice and a £95 joining fee. Annual memberships are paid upfront, cost the equivalent of ten months and carry no joining fee.',
  },
  {
    q: 'Can I try the house before applying?',
    a: 'Yes. A day pass is £35 and includes one class and the Vault. If you join within fourteen days, we credit it against your first month.',
  },
  {
    q: 'What happens after I apply?',
    a: 'A coach calls within one working day, then we book your induction — a 60-minute movement assessment and tour. Your membership starts on the day of your induction, not before.',
  },
  {
    q: 'Can I freeze or change my plan?',
    a: 'You can move between plans at any time from the following billing date. Freezes are available for injury, travel or parental leave, with allowances by plan.',
  },
  {
    q: 'Do you offer corporate memberships?',
    a: 'We hold a small number of corporate places for teams of five or more in N1C. Get in touch through the Visit page and choose “Corporate”.',
  },
];
