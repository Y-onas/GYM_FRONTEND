import type { ImageName } from '../lib/images';

export const BRAND = {
  name: 'BASALT',
  descriptor: 'Athletic House',
  established: 2014,
  address: ['The Old Ironworks', '41 Kiln Street', 'London N1C 4BT'],
  phone: '+44 20 7946 0811',
  phoneHref: 'tel:+442079460811',
  email: 'house@basalt.club',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Kings+Cross+London+N1C',
};

export type Pillar = 'pressure' | 'heat' | 'time';

export const PILLARS: Record<Pillar, { n: string; name: string; domain: string; line: string; body: string; facts: string[]; image: ImageName; href: string; cta: string }> = {
  pressure: {
    n: '01',
    name: 'Pressure',
    domain: 'Strength',
    line: 'Load is the oldest teacher.',
    body: 'A double-height hall of competition racks and calibrated iron, programmed in twelve-week blocks and coached at every platform.',
    facts: ['14 Eleiko competition racks', 'Plates calibrated to 0.25 kg', 'Dumbbells 2 — 60 kg'],
    image: 'squat',
    href: '/training',
    cta: 'Strength programmes',
  },
  heat: {
    n: '02',
    name: 'Heat',
    domain: 'Conditioning',
    line: 'Work that leaves a mark on the board.',
    body: 'Rowers, sleds and a 60-metre turf track. Two studios under the original sawtooth roof — one heated to 32°C, one kept dark.',
    facts: ['56 classes every week', '60 m turf sprint track', 'Power meters on every bike'],
    image: 'ropes',
    href: '/timetable',
    cta: 'See the timetable',
  },
  time: {
    n: '03',
    name: 'Time',
    domain: 'Recovery',
    line: 'Adaptation happens when you stop.',
    body: 'Below the hall, the Vault: a Finnish sauna, a cold plunge held at 6°C, an eighteen-metre salt-water pool and four physiotherapy suites.',
    facts: ['Sauna at 90°C', 'Cold plunge at 6°C', 'Chartered physiotherapists'],
    image: 'pool',
    href: '/house#vault',
    cta: 'Inside the Vault',
  },
};

export const NAV = [
  { to: '/house', label: 'The House', blurb: 'Four floors of an 1871 ironworks', image: 'hall-industrial' as ImageName },
  { to: '/training', label: 'Training', blurb: 'Programmes, coaches, 1:1', image: 'spotting' as ImageName },
  { to: '/timetable', label: 'Timetable', blurb: 'Book this week’s classes', image: 'class-bands' as ImageName },
  { to: '/membership', label: 'Membership', blurb: 'Three ways to belong', image: 'rack-window' as ImageName },
  { to: '/visit', label: 'Visit', blurb: 'Kings Cross, London N1C', image: 'running' as ImageName },
];

export const ROUTE_LABELS: Record<string, string> = {
  '/': 'Basalt',
  '/house': 'The House',
  '/training': 'Training',
  '/timetable': 'Timetable',
  '/membership': 'Membership',
  '/visit': 'Visit',
  '/join': 'Apply',
};
