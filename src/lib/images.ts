/** Locally graded photography (see public/img). Widths are the files that exist on disk. */
const IMAGES = {
  'hero-deadlift': { w: [800, 1400, 2400], ratio: 1600 / 2400 },
  'hero-atelier': { w: [800, 1400, 2000], ratio: 1335 / 2000 },
  'hero-grove': { w: [800, 1400, 2000], ratio: 1333 / 2000 },
  'hero-pulse': { w: [800, 1400, 2000], ratio: 1333 / 2000 },
  'hero-velvet': { w: [800, 1400, 2000], ratio: 1335 / 2000 },
  'hero-floor': { w: [900, 1800], ratio: 1200 / 1800 },
  'hall-industrial': { w: [1000, 2000], ratio: 1333 / 2000 },
  'rack-window': { w: [700, 1400], ratio: 1987 / 1400 },
  'rack-bw': { w: [700, 1400], ratio: 1897 / 1400 },
  dumbbells: { w: [800, 1600], ratio: 1067 / 1600 },
  'dumbbell-rows': { w: [800, 1600], ratio: 1067 / 1600 },
  'cardio-floor': { w: [900, 1800], ratio: 1202 / 1800 },
  'spin-room': { w: [800, 1600], ratio: 1067 / 1600 },
  ropes: { w: [800, 1600], ratio: 1069 / 1600 },
  kettlebell: { w: [800, 1600], ratio: 1280 / 1600 },
  'class-flow': { w: [800, 1600], ratio: 1067 / 1600 },
  'class-bands': { w: [800, 1600], ratio: 1067 / 1600 },
  'yoga-bw': { w: [800, 1600], ratio: 1067 / 1600 },
  bath: { w: [800, 1600], ratio: 1067 / 1600 },
  massage: { w: [800, 1600], ratio: 1067 / 1600 },
  oil: { w: [700, 1400], ratio: 933 / 1400 },
  pool: { w: [800, 1600], ratio: 1067 / 1600 },
  curl: { w: [800, 1600], ratio: 1067 / 1600 },
  squat: { w: [800, 1600], ratio: 1068 / 1600 },
  pullup: { w: [700, 1400], ratio: 2100 / 1400 },
  running: { w: [800, 1600], ratio: 1067 / 1600 },
  spotting: { w: [700, 1400], ratio: 2100 / 1400 },
  cable: { w: [700, 1400], ratio: 935 / 1400 },
  overhead: { w: [700, 1400], ratio: 935 / 1400 },
  back: { w: [800, 1600], ratio: 1062 / 1600 },
  'coach-ade': { w: [500, 1000], ratio: 1.5 },
  'coach-mara': { w: [500, 1000], ratio: 1.5 },
  'coach-ilan': { w: [500, 1000], ratio: 1.5 },
  'coach-noor': { w: [500, 1000], ratio: 1.5 },
  'coach-teo': { w: [500, 1000], ratio: 667 / 1000 },
  'coach-sade': { w: [500, 1000], ratio: 1.5 },
} as const;

export type ImageName = keyof typeof IMAGES;

export function imageSet(name: ImageName) {
  const meta = IMAGES[name];
  const widths = meta.w as readonly number[];
  const src = `/img/${name}-${widths[Math.min(1, widths.length - 1)]}.webp`;
  const srcSet = widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
  const max = widths[widths.length - 1];
  return { src, srcSet, width: max, height: Math.round(max * meta.ratio) };
}

export const imageUrl = (name: ImageName, size: 'sm' | 'lg' = 'sm') => {
  const w = IMAGES[name].w as readonly number[];
  return `/img/${name}-${size === 'sm' ? w[0] : w[w.length - 1]}.webp`;
};
