import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Dialog } from '../components/Dialog';
import { PageHero } from '../components/PageHero';
import { Arrow, Img, PillarTag } from '../components/primitives';
import { useToast } from '../components/Toast';
import { TLink } from '../components/Transition';
import type { Pillar } from '../data/brand';
import { findSession, sessionsFor, TIMES_OF_DAY, upcomingDays, type Session } from '../data/classes';
import { COACHES, coachById, type CoachId } from '../data/coaches';
import { downloadIcs } from '../lib/ics';
import { useClubNow, usePageMeta } from '../lib/hooks';
import { BRAND } from '../data/brand';
import { formatDate, toMinutes } from '../lib/time';
import { useBookings, type BookingState } from '../state/bookings';
import './timetable.css';

type TimeId = (typeof TIMES_OF_DAY)[number]['id'];

export default function Timetable() {
  usePageMeta('Timetable', 'Book BASALT group classes for the next seven days.');
  const days = useMemo(() => upcomingDays(7), []);
  const [params, setParams] = useSearchParams();
  const now = useClubNow();
  const { bookings, book, cancel } = useBookings();
  const toast = useToast();

  const dayParam = params.get('day');
  const day = days.some((d) => d.date === dayParam) ? dayParam! : days[0].date;
  const coachParam = params.get('coach') as CoachId | null;
  const coach = COACHES.some((c) => c.id === coachParam) ? coachParam : null;
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [times, setTimes] = useState<TimeId[]>([]);
  const [expanded, setExpanded] = useState<string | null>(params.get('session'));
  const [drawer, setDrawer] = useState(false);

  const update = (k: string, v: string | null) =>
    setParams(
      (p) => {
        if (v) p.set(k, v);
        else p.delete(k);
        if (k === 'day') p.delete('session');
        return p;
      },
      { replace: true, preventScrollReset: true },
    );

  useEffect(() => {
    const s = params.get('session');
    if (!s) return;
    const t = window.setTimeout(() => document.getElementById(`s-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const all = useMemo(() => sessionsFor(day), [day]);
  const list = all.filter(
    (s) =>
      (!pillars.length || pillars.includes(s.type.pillar)) &&
      (!times.length || times.some((t) => TIMES_OF_DAY.find((x) => x.id === t)!.test(toMinutes(s.start)))) &&
      (!coach || s.coach === coach),
  );
  const filtered = pillars.length + times.length + (coach ? 1 : 0);
  const myIds = Object.keys(bookings).filter((id) => findSession(id) && findSession(id)!.date >= now.isoDate);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const onBook = (s: Session, state: BookingState) => {
    book(s.id, state);
    toast(state === 'booked' ? `${s.type.name} booked — ${formatDate(s.date, { weekday: 'short' })} ${s.start}.` : `On the waitlist for ${s.type.name}. We’ll text you if a place opens.`, {
      label: 'Undo',
      run: () => cancel(s.id),
    });
  };
  const onCancel = (s: Session) => {
    const prev = bookings[s.id];
    cancel(s.id);
    toast(`${s.type.name} at ${s.start} cancelled.`, { label: 'Undo', run: () => book(s.id, prev) });
  };

  return (
    <div className="page tt">
      <PageHero
        idx="03"
        label="Timetable"
        title="Fifty-six classes. | *Pick yours.*"
        lede="Nine formats across three pillars, coached by the people who designed them. Book up to seven days ahead; cancel up to two hours before without losing the credit."
        meta={[
          { k: 'This week', v: '56 classes' },
          { k: 'Formats', v: '9' },
          { k: 'Booking', v: '7 days out' },
        ]}
      />

      <section className="tt__board tone-light" aria-label="Class schedule">
        <div className="tt__controls">
          <div className="wrap">
            <div className="tt__days" role="tablist" aria-label="Choose a day">
              {days.map((d) => {
                const sessions = sessionsFor(d.date);
                const mine = sessions.filter((s) => bookings[s.id]).length;
                return (
                  <button
                    key={d.date}
                    type="button"
                    role="tab"
                    aria-selected={day === d.date}
                    aria-controls="tt-list"
                    className="tt__day"
                    onClick={() => {
                      update('day', d.date);
                      setExpanded(null);
                    }}
                  >
                    <span className="t-label">{d.dow}</span>
                    <span className="tt__date t-num">{d.day}</span>
                    <span className="tt__dots" aria-hidden="true">
                      {sessions.map((s) => (
                        <i key={s.id} className={`tt__dot tt__dot--${s.type.pillar} ${bookings[s.id] ? 'is-mine' : ''}`} />
                      ))}
                    </span>
                    {mine > 0 && <span className="sr-only">, {mine} booked</span>}
                  </button>
                );
              })}
            </div>

            <div className="tt__filters">
              <div className="tt__fgroup" role="group" aria-label="Pillar">
                {(['pressure', 'heat', 'time'] as Pillar[]).map((p) => (
                  <button key={p} type="button" className="chip" aria-pressed={pillars.includes(p)} onClick={() => setPillars((x) => toggle(x, p))}>
                    <span className={`tag tag--${p}`} aria-hidden="true" />
                    {p}
                  </button>
                ))}
              </div>
              <div className="tt__fgroup" role="group" aria-label="Time of day">
                {TIMES_OF_DAY.map((t) => (
                  <button key={t.id} type="button" className="chip" aria-pressed={times.includes(t.id)} onClick={() => setTimes((x) => toggle(x, t.id))}>
                    {t.label}
                  </button>
                ))}
              </div>
              <label className="tt__coach">
                <span className="sr-only">Coach</span>
                <select className="field__input" value={coach ?? ''} onChange={(e) => update('coach', e.target.value || null)}>
                  <option value="">All coaches</option>
                  {COACHES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              {filtered > 0 && (
                <button
                  type="button"
                  className="tt__clear t-label ulink"
                  onClick={() => {
                    setPillars([]);
                    setTimes([]);
                    update('coach', null);
                  }}
                >
                  Clear {filtered} filter{filtered > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="wrap tt__main">
          <div className="tt__caption">
            <h2 className="t-h3">{formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            <p className="t-label t-label--muted" aria-live="polite">
              {list.length} of {all.length} classes
            </p>
          </div>

          <ol id="tt-list" className="tt__list" key={`${day}-${pillars.join()}-${times.join()}-${coach}`}>
            {list.map((s, i) => (
              <SessionRow
                key={s.id}
                s={s}
                i={i}
                state={bookings[s.id]}
                past={day === now.isoDate && toMinutes(s.start) <= now.minutes}
                open={expanded === s.id}
                onToggle={() => setExpanded((e) => (e === s.id ? null : s.id))}
                onBook={onBook}
                onCancel={onCancel}
              />
            ))}
          </ol>
          {list.length === 0 && (
            <div className="tt__empty">
              <p className="t-h3">
                Nothing matches <em>those filters</em> on this day.
              </p>
              <p className="t-body">Try another day, or widen the time of day.</p>
            </div>
          )}
        </div>
      </section>

      <div className={`tt__bar ${myIds.length ? 'is-on' : ''}`}>
        <button type="button" className="tt__barbtn" onClick={() => setDrawer(true)} aria-haspopup="dialog" tabIndex={myIds.length ? 0 : -1}>
          <span className="tt__count t-num">{myIds.length}</span>
          <span>{myIds.length === 1 ? 'session' : 'sessions'} booked this week</span>
          <span className="t-label">View</span>
          <Arrow className="tt__bararrow" dir="up" />
        </button>
      </div>

      <Dialog open={drawer} onClose={() => setDrawer(false)} label="My bookings" variant="drawer">
        <MyBookings ids={myIds} onCancel={onCancel} />
      </Dialog>
    </div>
  );
}

function SessionRow({
  s,
  i,
  state,
  past,
  open,
  onToggle,
  onBook,
  onCancel,
}: {
  s: Session;
  i: number;
  state?: BookingState;
  past: boolean;
  open: boolean;
  onToggle: () => void;
  onBook: (s: Session, st: BookingState) => void;
  onCancel: (s: Session) => void;
}) {
  const coach = coachById(s.coach);
  const taken = s.taken + (state === 'booked' ? 1 : 0);
  const left = s.type.capacity - taken;
  const full = s.taken >= s.type.capacity;

  let action;
  if (past) action = <span className="tt__status t-label">Finished</span>;
  else if (state)
    action = (
      <button type="button" className="btn btn--small tt__act is-booked" onClick={() => onCancel(s)} aria-label={`Cancel ${s.type.name} at ${s.start}`}>
        <span className="tt__actmain">{state === 'booked' ? 'Booked' : 'Waitlisted'}</span>
        <span className="tt__acthover">Cancel</span>
      </button>
    );
  else
    action = (
      <button
        type="button"
        className={`btn btn--small tt__act ${full ? '' : 'btn--solid'}`}
        onClick={() => onBook(s, full ? 'waitlist' : 'booked')}
        aria-label={`${full ? 'Join waitlist for' : 'Book'} ${s.type.name} at ${s.start}`}
      >
        <span>{full ? 'Waitlist' : 'Book'}</span>
      </button>
    );

  return (
    <li id={`s-${s.id}`} className={`ses ${open ? 'is-open' : ''} ${past ? 'is-past' : ''} ${state ? 'is-mine' : ''}`} style={{ '--i': i } as React.CSSProperties}>
      <div className="ses__row">
        <button type="button" className="ses__toggle" aria-expanded={open} aria-controls={`sd-${s.id}`} onClick={onToggle}>
          <span className="ses__time t-num">{s.start}</span>
          <span className="ses__name">
            <span className="ses__cls">{s.type.name}</span>
            <span className="ses__sub">
              {s.type.room} · {s.type.minutes} min
            </span>
          </span>
          <span className="ses__coach">{coach.name}</span>
          <PillarTag pillar={s.type.pillar} />
          <span className="ses__int" aria-label={`Intensity ${s.type.intensity} of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <i key={n} className={n <= s.type.intensity ? 'on' : ''} />
            ))}
          </span>
        </button>
        <span className="ses__cap" aria-label={full ? 'Class full' : `${left} places left of ${s.type.capacity}`}>
          <span className="ses__meter" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.min(1, taken / s.type.capacity)})` }} />
          </span>
          <span className={`t-label ${left <= 3 ? 'is-low' : ''}`}>{full ? 'Full' : `${left} left`}</span>
        </span>
        <span className="ses__action">{action}</span>
      </div>
      <div id={`sd-${s.id}`} className="ses__detail" hidden={!open}>
        <div className="ses__detail-in">
          <p className="ses__desc">{s.type.description}</p>
          <div className="ses__who">
            <span className="ses__avatar">
              <Img name={coach.image} alt="" sizes="64px" focal={coach.focal} />
            </span>
            <span>
              <span className="t-h4">{coach.name}</span>
              <span className="t-label t-label--muted">{coach.role}</span>
            </span>
          </div>
          <dl className="ses__facts">
            <div>
              <dt className="t-label t-label--muted">Runs</dt>
              <dd>
                {s.start} — {s.end}
              </dd>
            </div>
            <div>
              <dt className="t-label t-label--muted">Capacity</dt>
              <dd>{s.type.capacity} places</dd>
            </div>
            <div>
              <dt className="t-label t-label--muted">Bring</dt>
              <dd>{s.type.pillar === 'time' ? 'Nothing — mats & towels provided' : 'Flat shoes, water'}</dd>
            </div>
          </dl>
          <TLink to={`/training?coach=${coach.id}#coaches`} className="ulink t-label">
            About {coach.name.split(' ')[0]}
          </TLink>
        </div>
      </div>
    </li>
  );
}

function MyBookings({ ids, onCancel }: { ids: string[]; onCancel: (s: Session) => void }) {
  const sessions = ids
    .map((id) => findSession(id)!)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const { bookings } = useBookings();
  return (
    <div className="mybk tone-light">
      <p className="t-label t-label--muted">Your week</p>
      <h2 className="t-h2">My bookings</h2>
      {sessions.length === 0 && <p className="t-body">No sessions booked yet. Choose a class and press Book.</p>}
      <ul className="mybk__list">
        {sessions.map((s) => (
          <li key={s.id} className="mybk__item">
            <div>
              <span className="t-label t-label--muted">
                {formatDate(s.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {s.start}
              </span>
              <span className="mybk__name">{s.type.name}</span>
              <span className="mybk__sub">
                {s.type.room} · {coachById(s.coach).name}
                {bookings[s.id] === 'waitlist' && ' · waitlist'}
              </span>
            </div>
            <div className="mybk__acts">
              <button
                type="button"
                className="t-label ulink"
                onClick={() =>
                  downloadIcs({
                    title: `${s.type.name} at BASALT`,
                    date: s.date,
                    start: s.start,
                    minutes: s.type.minutes,
                    location: `${BRAND.address.join(', ')}`,
                    description: `${s.type.room} with ${coachById(s.coach).name}.`,
                  })
                }
              >
                Add to calendar
              </button>
              <button type="button" className="t-label ulink" onClick={() => onCancel(s)}>
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
