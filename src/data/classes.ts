import type { Pillar } from './brand';
import type { CoachId } from './coaches';
import { addDays, clubNow, formatDate, toMinutes, weekdayOf } from '../lib/time';

export type ClassTypeId = 'forge' | 'groundwork' | 'engine' | 'draft' | 'sprint' | 'foundry' | 'kiln' | 'flow' | 'breath';

export type ClassType = {
  id: ClassTypeId;
  name: string;
  pillar: Pillar;
  minutes: number;
  room: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  capacity: number;
  description: string;
};

export const CLASS_TYPES: Record<ClassTypeId, ClassType> = {
  forge: {
    id: 'forge',
    name: 'Forge',
    pillar: 'pressure',
    minutes: 50,
    room: 'The Hall',
    intensity: 4,
    capacity: 12,
    description: 'Coached barbell strength in a group of twelve. Squat, press and pull from a written block, with a coach moving between racks.',
  },
  groundwork: {
    id: 'groundwork',
    name: 'Groundwork',
    pillar: 'pressure',
    minutes: 45,
    room: 'The Hall',
    intensity: 2,
    capacity: 10,
    description: 'Technique for the big lifts, from your first empty bar to your first plates. The class we suggest to every new member.',
  },
  engine: {
    id: 'engine',
    name: 'Engine',
    pillar: 'heat',
    minutes: 45,
    room: 'The Deck',
    intensity: 5,
    capacity: 16,
    description: 'Rower, ski and bike intervals, scored and posted on the board. Hard, measurable and finished in forty-five minutes.',
  },
  draft: {
    id: 'draft',
    name: 'Draft',
    pillar: 'heat',
    minutes: 40,
    room: 'Studio Draft',
    intensity: 4,
    capacity: 28,
    description: 'Cycle intervals in a dark studio, paced by power rather than volume. Your watts are yours; nobody else sees them.',
  },
  sprint: {
    id: 'sprint',
    name: 'Sprint',
    pillar: 'heat',
    minutes: 45,
    room: 'Turf Track',
    intensity: 4,
    capacity: 14,
    description: 'Acceleration drills, sled pushes and timed sixty-metre efforts. Speed is a skill, and it is coached like one.',
  },
  foundry: {
    id: 'foundry',
    name: 'Foundry',
    pillar: 'heat',
    minutes: 50,
    room: 'The Deck',
    intensity: 3,
    capacity: 16,
    description: 'Kettlebells, carries and sleds. Functional strength-endurance that transfers to everything outside the building.',
  },
  kiln: {
    id: 'kiln',
    name: 'Kiln',
    pillar: 'time',
    minutes: 55,
    room: 'Studio Kiln · 32°C',
    intensity: 2,
    capacity: 20,
    description: 'A slow, strong mobility flow in a studio heated to 32°C. The house’s most-booked class, by some distance.',
  },
  flow: {
    id: 'flow',
    name: 'Long Flow',
    pillar: 'time',
    minutes: 75,
    room: 'Studio Floor',
    intensity: 1,
    capacity: 24,
    description: 'Seventy-five unhurried minutes of yoga-based mobility and breath. Phones stay in the lockers.',
  },
  breath: {
    id: 'breath',
    name: 'Breath & Cold',
    pillar: 'time',
    minutes: 30,
    room: 'The Vault',
    intensity: 1,
    capacity: 8,
    description: 'Guided breathing, then the 6°C plunge with a coach beside you. Eight places, so book early.',
  },
};

type Slot = [string, ClassTypeId, CoachId];

/** Weekly template, Monday first. */
const WEEK: Slot[][] = [
  [['06:15', 'forge', 'ade'], ['07:00', 'draft', 'mara'], ['07:30', 'kiln', 'sade'], ['12:15', 'engine', 'mara'], ['12:30', 'groundwork', 'ilan'], ['17:30', 'forge', 'ade'], ['18:00', 'foundry', 'teo'], ['18:30', 'draft', 'mara'], ['19:30', 'flow', 'sade'], ['20:15', 'breath', 'noor']],
  [['06:15', 'engine', 'mara'], ['06:30', 'kiln', 'teo'], ['07:15', 'forge', 'ilan'], ['12:15', 'draft', 'teo'], ['13:00', 'flow', 'sade'], ['17:45', 'sprint', 'mara'], ['18:15', 'forge', 'ade'], ['19:00', 'kiln', 'sade'], ['20:00', 'breath', 'noor']],
  [['06:15', 'forge', 'ade'], ['07:00', 'foundry', 'teo'], ['07:30', 'draft', 'mara'], ['12:15', 'kiln', 'sade'], ['12:30', 'forge', 'ilan'], ['17:30', 'engine', 'mara'], ['18:15', 'groundwork', 'ilan'], ['18:30', 'draft', 'teo'], ['19:30', 'flow', 'noor']],
  [['06:15', 'draft', 'mara'], ['06:45', 'groundwork', 'ade'], ['07:30', 'kiln', 'sade'], ['12:15', 'foundry', 'teo'], ['17:30', 'forge', 'ade'], ['18:00', 'sprint', 'mara'], ['18:45', 'kiln', 'teo'], ['20:00', 'breath', 'noor']],
  [['06:15', 'forge', 'ilan'], ['07:00', 'engine', 'mara'], ['07:30', 'flow', 'sade'], ['12:15', 'draft', 'teo'], ['17:30', 'foundry', 'teo'], ['18:15', 'forge', 'ade'], ['19:00', 'flow', 'noor']],
  [['08:00', 'engine', 'mara'], ['08:30', 'forge', 'ade'], ['09:30', 'draft', 'teo'], ['10:00', 'kiln', 'sade'], ['11:00', 'foundry', 'teo'], ['12:00', 'groundwork', 'ilan'], ['16:00', 'breath', 'noor']],
  [['09:00', 'flow', 'sade'], ['09:30', 'forge', 'ilan'], ['10:30', 'draft', 'mara'], ['11:00', 'kiln', 'teo'], ['16:00', 'breath', 'noor'], ['17:00', 'flow', 'sade']],
];

export type Session = {
  id: string;
  date: string;
  start: string;
  end: string;
  type: ClassType;
  coach: CoachId;
  /** places taken by other members (deterministic per session) */
  taken: number;
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export function sessionsFor(date: string): Session[] {
  return WEEK[weekdayOf(date)].map(([start, typeId, coach]) => {
    const type = CLASS_TYPES[typeId];
    const id = `${date}_${start}_${typeId}`;
    const popular = type.id === 'kiln' || type.id === 'breath' ? 0.35 : 0;
    const r = Math.min(1, hash(id) * 0.95 + popular);
    return {
      id,
      date,
      start,
      end: fmt(toMinutes(start) + type.minutes),
      type,
      coach,
      taken: Math.min(type.capacity, Math.round(type.capacity * (0.35 + r * 0.7))),
    };
  });
}

/** Rolling seven days starting today in London. */
export function upcomingDays(count = 7) {
  const today = clubNow().isoDate;
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(today, i);
    return {
      date,
      isToday: i === 0,
      dow: i === 0 ? 'Today' : formatDate(date, { weekday: 'short' }),
      day: formatDate(date, { day: 'numeric' }),
      month: formatDate(date, { month: 'short' }),
    };
  });
}

export function findSession(id: string): Session | undefined {
  const date = id.split('_')[0];
  return sessionsFor(date).find((s) => s.id === id);
}

export const TIMES_OF_DAY = [
  { id: 'morning', label: 'Before 10', test: (m: number) => m < 600 },
  { id: 'midday', label: '10 — 16', test: (m: number) => m >= 600 && m < 960 },
  { id: 'evening', label: 'After 16', test: (m: number) => m >= 960 },
] as const;
