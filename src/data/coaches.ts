import type { ImageName } from '../lib/images';
import type { Pillar } from './brand';

export type CoachId = 'ade' | 'mara' | 'ilan' | 'noor' | 'teo' | 'sade';

export type Coach = {
  id: CoachId;
  name: string;
  role: string;
  pillar: Pillar;
  years: number;
  image: ImageName;
  focal?: string;
  quote: string;
  bio: string;
  credentials: string[];
  specialties: string[];
  hours: string;
  tier: 'Head coach' | 'Senior coach' | 'Coach';
};

export const COACHES: Coach[] = [
  {
    id: 'ade',
    name: 'Ade Okafor',
    role: 'Head of Strength',
    pillar: 'pressure',
    years: 14,
    image: 'coach-ade',
    quote: 'Most plateaus are scheduling problems.',
    bio: 'Ade lifted for Great Britain for six seasons before he started coaching. He built the Hall’s programming system and still writes every Forge block by hand on Sunday nights.',
    credentials: ['Former GB weightlifter', 'UKSCA accredited', 'MSc Strength & Conditioning'],
    specialties: ['Olympic lifting', 'Powerlifting', 'Returning to the barbell'],
    hours: 'Mon — Thu, 06:00 — 14:00',
    tier: 'Head coach',
  },
  {
    id: 'mara',
    name: 'Mara Lindqvist',
    role: 'Conditioning Lead',
    pillar: 'heat',
    years: 11,
    image: 'coach-mara',
    quote: 'Fitness you can measure is fitness you can keep.',
    bio: 'A former Swedish national squad rower, Mara runs the Deck. Her Engine sessions are scored, posted and quietly competitive — and her rowing clinics have a waiting list.',
    credentials: ['Swedish national rowing squad', 'NSCA-CSCS', 'BSc Exercise Physiology'],
    specialties: ['Aerobic engine', 'Rowing technique', 'Hybrid racing'],
    hours: 'Mon — Fri, 06:00 — 13:00',
    tier: 'Head coach',
  },
  {
    id: 'ilan',
    name: 'Ilan Brenner',
    role: 'Hypertrophy & Body Composition',
    pillar: 'pressure',
    years: 9,
    image: 'coach-ilan',
    quote: 'Eat, train, sleep. Repeat with intent.',
    bio: 'Ilan pairs training blocks with plain-spoken nutrition coaching. Members come to him to build muscle; most stay because he makes the process feel sustainable.',
    credentials: ['BSc Sport Science', 'Precision Nutrition Level 2', 'NASM-CPT'],
    specialties: ['Muscle gain', 'Body recomposition', 'Nutrition coaching'],
    hours: 'Tue — Sat, 07:00 — 15:00',
    tier: 'Senior coach',
  },
  {
    id: 'noor',
    name: 'Noor Haddad',
    role: 'Head of Recovery',
    pillar: 'time',
    years: 12,
    image: 'coach-noor',
    quote: 'Rest isn’t the opposite of training. It’s the second half of it.',
    bio: 'Noor leads the Vault’s physiotherapy team. She assesses every new Private member and designs the contrast protocols posted by the sauna door.',
    credentials: ['Chartered Physiotherapist, MCSP', 'HCPC registered', 'MSc Sports Medicine'],
    specialties: ['Injury rehabilitation', 'Load management', 'Breath & cold exposure'],
    hours: 'Mon — Fri, 10:00 — 20:00',
    tier: 'Head coach',
  },
  {
    id: 'teo',
    name: 'Teo Marchetti',
    role: 'Functional & Mobility',
    pillar: 'heat',
    years: 8,
    image: 'coach-teo',
    focal: '62% 30%',
    quote: 'Move well first. Then move a lot.',
    bio: 'Teo coaches kettlebells, sleds and the unglamorous mobility work that keeps the rest of your training possible. He teaches Foundry and most of the weekend Kiln flows.',
    credentials: ['FRC Mobility Specialist', 'Kettlebell Sport — Master of Sport', 'Level 4 PT'],
    specialties: ['Kettlebells', 'Movement quality', 'Athletic conditioning'],
    hours: 'Wed — Sun, 08:00 — 19:00',
    tier: 'Senior coach',
  },
  {
    id: 'sade',
    name: 'Sade Williams',
    role: 'Foundations & Pre/Postnatal',
    pillar: 'time',
    years: 10,
    image: 'coach-sade',
    focal: '50% 35%',
    quote: 'Everyone starts somewhere. Start properly.',
    bio: 'Sade runs Foundations, the six-week entry programme every new member is offered, and coaches women through pregnancy and back to full training.',
    credentials: ['Level 4 Pre & Postnatal', 'Pilates matwork', 'BSc Physiotherapy'],
    specialties: ['New lifters', 'Pre & postnatal', 'Core rehabilitation'],
    hours: 'Mon — Fri, 07:00 — 15:00',
    tier: 'Coach',
  },
];

export const coachById = (id: CoachId) => COACHES.find((c) => c.id === id)!;
