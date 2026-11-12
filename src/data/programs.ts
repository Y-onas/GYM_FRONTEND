import type { ImageName } from '../lib/images';
import type { Pillar } from './brand';
import type { CoachId } from './coaches';

export type Program = {
  id: string;
  name: string;
  pillar: Pillar;
  length: string;
  frequency: string;
  forWhom: string;
  outcome: string;
  includes: string[];
  lead: CoachId;
  image: ImageName;
};

export const PROGRAMS: Program[] = [
  {
    id: 'foundations',
    name: 'Foundations',
    pillar: 'time',
    length: '6 weeks',
    frequency: '3 × week',
    forWhom: 'New to structured training, or coming back after a long break.',
    outcome: 'Squat, hinge, press and pull with confidence — and a plan you actually understand.',
    includes: ['Movement assessment', 'Six coached technique sessions', 'Written three-day plan'],
    lead: 'sade',
    image: 'overhead',
  },
  {
    id: 'strength',
    name: 'Strength Blocks',
    pillar: 'pressure',
    length: '12 weeks',
    frequency: '3 — 4 × week',
    forWhom: 'Lifters who want measurable progress on squat, bench and deadlift.',
    outcome: 'Periodised blocks with tested maxes in weeks 0 and 12. Members add 11% to their total on average.',
    includes: ['Hand-written programme', 'Fortnightly technique review', 'Test-day with a coach'],
    lead: 'ade',
    image: 'squat',
  },
  {
    id: 'build',
    name: 'Build',
    pillar: 'pressure',
    length: '10 weeks',
    frequency: '4 — 5 × week',
    forWhom: 'Anyone whose goal is more muscle, or a different shape at the same weight.',
    outcome: 'Hypertrophy splits paired with practical nutrition coaching and monthly body-composition scans.',
    includes: ['DEXA scan in weeks 0 and 10', 'Nutrition targets', 'Weekly check-in'],
    lead: 'ilan',
    image: 'curl',
  },
  {
    id: 'engine',
    name: 'Engine',
    pillar: 'heat',
    length: '8 weeks',
    frequency: '3 × week',
    forWhom: 'Runners, rowers, racers — and anyone who gets out of breath on the stairs.',
    outcome: 'Zone-based aerobic work and intervals, tested with a 2 km row before and after.',
    includes: ['Heart-rate zone testing', 'Erg technique clinic', 'Scored benchmark sessions'],
    lead: 'mara',
    image: 'running',
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    pillar: 'heat',
    length: '16 weeks',
    frequency: '5 × week',
    forWhom: 'Members training for a fitness race, a triathlon or simply both ends of fitness.',
    outcome: 'Strength and engine developed together, with a race simulation every four weeks.',
    includes: ['Race-specific plan', 'Sled & carry technique', 'Race-week taper'],
    lead: 'teo',
    image: 'kettlebell',
  },
  {
    id: 'longevity',
    name: 'Longevity',
    pillar: 'time',
    length: 'Ongoing',
    frequency: '2 — 3 × week',
    forWhom: 'Members over forty who want strength, balance and bone density for decades.',
    outcome: 'Strength, mobility and Vault protocols with a physiotherapist reviewing progress quarterly.',
    includes: ['Quarterly physio review', 'Grip & balance testing', 'Contrast-therapy plan'],
    lead: 'noor',
    image: 'yoga-bw',
  },
];

export const PT_TIERS = [
  { id: 'coach', name: 'Coach', rate: 85, note: 'Sade, and our coaching team' },
  { id: 'senior', name: 'Senior coach', rate: 110, note: 'Ilan, Teo' },
  { id: 'head', name: 'Head coach', rate: 140, note: 'Ade, Mara, Noor' },
] as const;

export const PT_PACKS = [
  { sessions: 1, discount: 0, validity: '30 days' },
  { sessions: 10, discount: 0.08, validity: '4 months' },
  { sessions: 20, discount: 0.15, validity: '7 months' },
] as const;
