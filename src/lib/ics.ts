/** Builds and downloads a single-event iCalendar file. Times are London local. */
export function downloadIcs(opts: { title: string; date: string; start: string; minutes: number; location: string; description: string }) {
  const [y, m, d] = opts.date.split('-');
  const [hh, mm] = opts.start.split(':').map(Number);
  const endTotal = hh * 60 + mm + opts.minutes;
  const pad = (n: number) => String(n).padStart(2, '0');
  const dt = (h: number, min: number) => `${y}${m}${d}T${pad(h)}${pad(min)}00`;
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Valiant Fitness//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@valiant-fitness`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/London:${dt(hh, mm)}`,
    `DTEND;TZID=Europe/London:${dt(Math.floor(endTotal / 60), endTotal % 60)}`,
    `SUMMARY:${esc(opts.title)}`,
    `LOCATION:${esc(opts.location)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${opts.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
