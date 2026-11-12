import type { ImageName } from '../lib/images';
import type { Pillar } from './brand';

export type FloorId = 'l2' | 'l1' | 'l0' | 'b1';

export type Floor = {
  id: FloorId;
  level: string;
  name: string;
  pillar: Pillar;
  stat: { value: string; label: string };
  area: string;
  summary: string;
  features: string[];
  image: ImageName;
};

/** Top to bottom, as the building stands. */
export const FLOORS: Floor[] = [
  {
    id: 'l2',
    level: 'L2',
    name: 'The Studios',
    pillar: 'heat',
    stat: { value: '32°C', label: 'Studio Kiln' },
    area: '640 m²',
    summary: 'Three studios under the original sawtooth roof — one heated, one dark, one quiet.',
    features: ['Studio Kiln — infrared heat, 32°C', 'Studio Draft — 28 Stages SC3 bikes', 'Studio Floor — sprung oak, 24 mats'],
    image: 'class-flow',
  },
  {
    id: 'l1',
    level: 'L1',
    name: 'The Deck',
    pillar: 'heat',
    stat: { value: '60 m', label: 'Turf track' },
    area: '910 m²',
    summary: 'The conditioning floor. Everything here is measured, logged and posted on the board.',
    features: ['Woodway Curve treadmills', 'Concept2 Row, Ski & BikeErg', 'Sleds, prowlers & battle ropes'],
    image: 'cardio-floor',
  },
  {
    id: 'l0',
    level: 'L0',
    name: 'The Hall',
    pillar: 'pressure',
    stat: { value: '14', label: 'Competition racks' },
    area: '1,320 m²',
    summary: 'The old casting floor, nine metres to the trusses. Iron, chalk and a coach at every platform.',
    features: ['Eleiko racks & lifting platforms', 'Dumbbells to 60 kg', 'Hammer Strength plate-loaded line'],
    image: 'hall-industrial',
  },
  {
    id: 'b1',
    level: 'B1',
    name: 'The Vault',
    pillar: 'time',
    stat: { value: '6°C', label: 'Cold plunge' },
    area: '780 m²',
    summary: 'The former coal store, now the quietest room in Kings Cross. Heat, cold, water and hands.',
    features: ['Finnish sauna at 90°C', '18 m salt-water lap pool', 'Four physiotherapy suites'],
    image: 'pool',
  },
];

export type Equipment = {
  name: string;
  maker: string;
  qty: string;
  floor: FloorId;
  spec: string;
  image: ImageName;
};

export const EQUIPMENT: Equipment[] = [
  { name: 'Competition racks', maker: 'Eleiko', qty: '14', floor: 'l0', spec: 'IWF-certified bars, calibrated plates', image: 'rack-bw' },
  { name: 'Dumbbells', maker: 'Eleiko', qty: '58 pr', floor: 'l0', spec: '2 — 60 kg, 1 kg steps to 10 kg', image: 'dumbbells' },
  { name: 'Plate-loaded line', maker: 'Hammer Strength', qty: '12', floor: 'l0', spec: 'Iso-lateral press, row, pulldown, leg press', image: 'dumbbell-rows' },
  { name: 'Cable stations', maker: 'Gym80', qty: '6', floor: 'l0', spec: 'Dual-adjustable, 1.25 kg micro-loading', image: 'cable' },
  { name: 'Curved treadmills', maker: 'Woodway', qty: '8', floor: 'l1', spec: 'Non-motorised, self-paced', image: 'cardio-floor' },
  { name: 'Row, Ski & BikeErg', maker: 'Concept2', qty: '24', floor: 'l1', spec: 'PM5 monitors, logged to your profile', image: 'running' },
  { name: 'Turf track & sleds', maker: 'Torque', qty: '60 m', floor: 'l1', spec: 'Sleds, prowlers, battle ropes', image: 'ropes' },
  { name: 'Kettlebells', maker: 'Eleiko', qty: '4 — 48 kg', floor: 'l1', spec: 'Competition-size steel', image: 'kettlebell' },
  { name: 'Indoor cycles', maker: 'Stages SC3', qty: '28', floor: 'l2', spec: 'Power meter on every bike', image: 'spin-room' },
  { name: 'Mobility studio', maker: 'Sprung oak', qty: '24 mats', floor: 'l2', spec: 'Heated to 32°C for Kiln', image: 'yoga-bw' },
  { name: 'Sauna & plunge', maker: 'Tylö', qty: '90° / 6°', floor: 'b1', spec: 'Fourteen seats, two plunge pools', image: 'bath' },
  { name: 'Lap pool', maker: 'Salt-water', qty: '18 m', floor: 'b1', spec: 'Three lanes, 29°C', image: 'pool' },
  { name: 'Treatment suites', maker: 'In-house', qty: '4', floor: 'b1', spec: 'Physiotherapy, massage, assessment', image: 'massage' },
];

export const TIMELINE = [
  { year: '1871', title: 'Cast', body: 'Kiln Street Ironworks opens beside the Regent’s Canal, casting railway fittings for the new northern lines.' },
  { year: '1968', title: 'Cooled', body: 'The furnaces go out. For forty years the building stores paper for the printers on York Way.' },
  { year: '2014', title: 'Reopened', body: 'BASALT opens the Hall with six racks, two coaches and a membership cap we have never raised.' },
  { year: '2019', title: 'Raised', body: 'The Studios open beneath the restored sawtooth roof. Kiln becomes the most booked class in the house.' },
  { year: '2023', title: 'Deepened', body: 'The old coal store becomes the Vault: sauna, plunge, pool and a physiotherapy team of four.' },
];
