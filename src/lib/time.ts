/** All club logic runs on London time, regardless of the visitor's zone. */
export const CLUB_TZ = 'Europe/London';

export type ClubNow = {
  /** 0 = Monday … 6 = Sunday */
  weekday: number;
  minutes: number;
  isoDate: string;
};

const weekdayIndex: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

export function clubNow(date = new Date()): ClubNow {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLUB_TZ,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return {
    weekday: weekdayIndex[get('weekday')] ?? 0,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    isoDate: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

export const HOURS: { days: string; open: string; close: string; weekdays: number[] }[] = [
  { days: 'Monday — Friday', open: '05:00', close: '23:00', weekdays: [0, 1, 2, 3, 4] },
  { days: 'Saturday — Sunday', open: '07:00', close: '21:00', weekdays: [5, 6] },
];

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function hoursFor(weekday: number) {
  return HOURS.find((h) => h.weekdays.includes(weekday)) ?? HOURS[0];
}

export type OpenStatus = { open: boolean; text: string; detail: string; occupancy: number };

/** Typical floor load by hour — the curve members see on the app. */
const LOAD = [0, 0, 0, 0, 0, 18, 46, 71, 58, 34, 26, 29, 48, 44, 27, 24, 33, 62, 84, 77, 55, 36, 22, 12];

export function openStatus(now = clubNow()): OpenStatus {
  const h = hoursFor(now.weekday);
  const open = now.minutes >= toMinutes(h.open) && now.minutes < toMinutes(h.close);
  const hour = Math.floor(now.minutes / 60);
  const weekendDamp = now.weekday >= 5 ? 0.8 : 1;
  const occupancy = open ? Math.round(LOAD[hour] * weekendDamp) : 0;
  if (open) return { open, text: 'Open now', detail: `until ${h.close}`, occupancy };
  const opensToday = now.minutes < toMinutes(h.open);
  const next = opensToday ? h : hoursFor((now.weekday + 1) % 7);
  return { open, text: 'Closed', detail: `opens ${opensToday ? '' : 'tomorrow '}${next.open}`, occupancy };
}

export function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts }).format(new Date(`${iso}T12:00:00Z`));
}

export function weekdayOf(iso: string) {
  return (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7;
}
