import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { PageHero } from '../components/PageHero';
import { Arrow, OpenStatus, Reveal, RevealText, SectionHead } from '../components/primitives';
import { useToast } from '../components/Toast';
import { TLink } from '../components/Transition';
import { BRAND } from '../data/brand';
import { useClubNow, usePageMeta } from '../lib/hooks';
import { addDays, formatDate, HOURS } from '../lib/time';
import './visit.css';

const SUBJECTS = [
  { id: 'tour', label: 'Book a tour' },
  { id: 'daypass', label: 'Day pass (£35)' },
  { id: 'membership', label: 'Membership question' },
  { id: 'pt', label: 'Personal training' },
  { id: 'corporate', label: 'Corporate membership' },
  { id: 'press', label: 'Press & partnerships' },
];

const TRAVEL = [
  { mode: 'King’s Cross St Pancras', detail: 'Six lines · 7 min walk', mins: 7 },
  { mode: 'Caledonian Road', detail: 'Piccadilly line · 9 min walk', mins: 9 },
  { mode: 'Cycle', detail: '40 covered spaces on Kiln Street', mins: 0 },
  { mode: 'Car', detail: 'No parking — Q-Park N1C, 4 min walk', mins: 4 },
];

export default function Visit() {
  usePageMeta('Visit', 'Find BASALT at The Old Ironworks, 41 Kiln Street, Kings Cross. Hours, directions and enquiries.');
  const now = useClubNow();
  return (
    <div className="page visit">
      <PageHero
        idx="05"
        label="Visit"
        title="Seven minutes | from *King’s Cross.*"
        lede="Walk up from the station along the canal, turn left at the gasholders and look for the chimney. The door is the one with chalk on the handle."
        meta={[
          { k: 'Weekdays', v: '05:00 — 23:00' },
          { k: 'Weekends', v: '07:00 — 21:00' },
          { k: 'Tours', v: 'Daily, on the hour' },
        ]}
      >
        <OpenStatus withLoad className="visit__status" />
      </PageHero>

      <section className="find tone-deep section--tight" aria-labelledby="find-title">
        <div className="wrap find__grid">
          <Reveal className="find__map">
            <MapDrawing />
          </Reveal>
          <div className="find__info">
            <h2 id="find-title" className="sr-only">
              Address, hours and travel
            </h2>
            <div className="find__block">
              <span className="t-label t-label--muted">Address</span>
              <address className="t-h3">
                {BRAND.address.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
              <a className="btn btn--small" href={BRAND.mapsHref} target="_blank" rel="noreferrer">
                <span>Directions in Google Maps</span>
                <Arrow dir="ne" />
              </a>
            </div>
            <div className="find__block">
              <span className="t-label t-label--muted">Hours</span>
              <dl className="find__hours">
                {HOURS.map((h) => {
                  const today = h.weekdays.includes(now.weekday);
                  return (
                    <div key={h.days} className={today ? 'is-today' : ''}>
                      <dt>
                        {h.days}
                        {today && <span className="find__today t-label">Today</span>}
                      </dt>
                      <dd className="t-num">
                        {h.open} — {h.close}
                      </dd>
                    </div>
                  );
                })}
                <div>
                  <dt>Bank holidays</dt>
                  <dd className="t-num">08:00 — 18:00</dd>
                </div>
              </dl>
            </div>
            <div className="find__block">
              <span className="t-label t-label--muted">Getting here</span>
              <ul className="find__travel">
                {TRAVEL.map((t) => (
                  <li key={t.mode}>
                    <span className="find__mode">{t.mode}</span>
                    <span className="find__detail">{t.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Enquiry />
    </div>
  );
}

function MapDrawing() {
  return (
    <svg className="map" viewBox="0 0 600 520" role="img" aria-label="Map: BASALT on Kiln Street, north of King’s Cross St Pancras station and the Regent’s Canal">
      <rect width="600" height="520" className="map__bg" />
      {/* blocks */}
      {[
        [40, 40, 140, 90],
        [210, 30, 120, 110],
        [360, 40, 190, 70],
        [40, 170, 100, 120],
        [380, 140, 170, 120],
        [40, 330, 120, 150],
        [420, 300, 140, 80],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} className="map__block" />
      ))}
      {/* streets */}
      <path d="M0 155 H600" className="map__street" />
      <path d="M190 0 V520" className="map__street" />
      <path d="M350 0 L370 520" className="map__street map__street--minor" />
      <path d="M0 305 C 150 300, 250 330, 600 290" className="map__street map__street--minor" />
      {/* canal */}
      <path d="M-10 250 C 120 230, 220 280, 330 262 S 520 220, 610 240" className="map__canal" />
      <text x="430" y="226" className="map__label map__label--italic">
        Regent’s Canal
      </text>
      {/* gasholders */}
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={250 + k * 34} cy={205} r="15" className="map__gas" />
      ))}
      {/* station */}
      <rect x="170" y="400" width="220" height="70" className="map__station" />
      <text x="280" y="440" textAnchor="middle" className="map__label">
        KING’S CROSS ST PANCRAS
      </text>
      {/* route */}
      <path d="M280 400 L 270 320 L 230 300 L 210 200 L 200 120 L 250 95" className="map__route" />
      {/* club */}
      <g transform="translate(262 88)">
        <circle r="22" className="map__pulse" />
        <rect x="-10" y="-10" width="20" height="20" className="map__pin" />
      </g>
      <text x="292" y="80" className="map__label map__label--club">
        BASALT
      </text>
      <text x="292" y="96" className="map__label">
        41 Kiln Street
      </text>
      <text x="200" y="150" className="map__label" transform="rotate(-90 200 150)">
        YORK WAY
      </text>
      <text x="16" y="148" className="map__label">
        KILN STREET
      </text>
      <text x="300" y="370" className="map__label map__label--muted">
        7 MIN WALK
      </text>
      {/* north arrow */}
      <g transform="translate(560 480)" className="map__north">
        <path d="M0 -18 L7 6 L0 0 L-7 6 Z" />
        <text y="22" textAnchor="middle">
          N
        </text>
      </g>
    </svg>
  );
}

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'date' | 'message', string>>;

function Enquiry() {
  const [params] = useSearchParams();
  const initialSubject = SUBJECTS.some((s) => s.id === params.get('subject')) ? params.get('subject')! : 'tour';
  const detail = params.get('detail');
  const now = useClubNow();
  const dates = useMemo(() => Array.from({ length: 10 }, (_, i) => addDays(now.isoDate, i + 1)), [now.isoDate]);
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject,
    date: '',
    message: detail ? `I’d like to ask about: ${detail}.` : '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [ref, setRef] = useState('');
  const needsDate = form.subject === 'tour' || form.subject === 'daypass';

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k as keyof Errors]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (form.phone && !/^[+\d][\d\s()-]{6,}$/.test(form.phone.trim())) e.phone = 'That phone number doesn’t look right.';
    if (needsDate && !form.date) e.date = 'Choose a day for your visit.';
    if (!needsDate && form.message.trim().length < 10) e.message = 'A sentence or two helps us route this to the right person.';
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(`enq-${first}`)?.focus();
      return;
    }
    setState('sending');
    window.setTimeout(() => {
      setRef(`BSL-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
      setState('sent');
      toast('Enquiry received. A coach will reply within one working day.');
    }, 1100);
  };

  const subjectLabel = SUBJECTS.find((s) => s.id === form.subject)!.label;

  return (
    <section id="enquire" className="enq tone-base section" aria-labelledby="enq-title">
      <div className="wrap enq__grid">
        <div className="enq__side">
          <SectionHead idx="A" label="Enquire" />
          <RevealText id="enq-title" className="t-h2" text="Talk to a *coach,* | not a call centre." />
          <Reveal as="p" className="t-body" delay={150}>
            Every message is read by someone who works on the floor. We reply within one working day — usually the same morning.
          </Reveal>
          <Reveal className="enq__direct" delay={220}>
            <a className="ulink" href={BRAND.phoneHref}>
              {BRAND.phone}
            </a>
            <a className="ulink" href={`mailto:${BRAND.email}`}>
              {BRAND.email}
            </a>
          </Reveal>
        </div>

        {state === 'sent' ? (
          <div className="enq__done" role="status">
            <span className="t-label t-label--muted">Reference {ref}</span>
            <p className="t-h2">
              Thank you, <em>{form.name.trim().split(' ')[0]}.</em>
            </p>
            <p className="t-body">
              We’ve logged your request — <strong>{subjectLabel.toLowerCase()}</strong>
              {needsDate && form.date ? ` on ${formatDate(form.date, { weekday: 'long', day: 'numeric', month: 'long' })}` : ''}. A confirmation is on its way to {form.email.trim()}.
            </p>
            <div className="enq__done-ctas">
              <TLink to="/timetable" className="btn btn--solid">
                <span>Browse the timetable</span>
                <Arrow />
              </TLink>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setState('idle');
                  setForm((f) => ({ ...f, message: '', date: '' }));
                }}
              >
                <span>Send another</span>
                <Arrow />
              </button>
            </div>
          </div>
        ) : (
          <form className="enq__form" onSubmit={submit} noValidate>
            <fieldset className="enq__subjects">
              <legend className="field__label">What can we help with?</legend>
              <div className="enq__chips">
                {SUBJECTS.map((s) => (
                  <label key={s.id} className={`chip ${form.subject === s.id ? 'is-on' : ''}`}>
                    <input type="radio" name="subject" value={s.id} checked={form.subject === s.id} onChange={set('subject')} className="sr-only" />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <Field id="name" label="Full name" error={errors.name}>
              <input id="enq-name" className="field__input" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'enq-name-err' : undefined} />
            </Field>
            <div className="enq__row">
              <Field id="email" label="Email" error={errors.email}>
                <input id="enq-email" type="email" className="field__input" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'enq-email-err' : undefined} />
              </Field>
              <Field id="phone" label="Phone (optional)" error={errors.phone}>
                <input id="enq-phone" type="tel" className="field__input" autoComplete="tel" value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'enq-phone-err' : undefined} />
              </Field>
            </div>

            {needsDate && (
              <fieldset className="enq__dates" aria-describedby={errors.date ? 'enq-date-err' : undefined}>
                <legend className="field__label">Preferred day</legend>
                <div className="enq__datelist" id="enq-date" tabIndex={-1}>
                  {dates.map((d) => (
                    <label key={d} className={`enq__date ${form.date === d ? 'is-on' : ''}`}>
                      <input type="radio" name="date" value={d} checked={form.date === d} onChange={set('date')} className="sr-only" />
                      <span className="t-label">{formatDate(d, { weekday: 'short' })}</span>
                      <span className="t-num enq__dnum">{formatDate(d, { day: 'numeric' })}</span>
                      <span className="t-label t-label--muted">{formatDate(d, { month: 'short' })}</span>
                    </label>
                  ))}
                </div>
                {errors.date && (
                  <p id="enq-date-err" className="field__error">
                    {errors.date}
                  </p>
                )}
              </fieldset>
            )}

            <Field id="message" label={needsDate ? 'Anything we should know? (optional)' : 'Message'} error={errors.message}>
              <textarea id="enq-message" className="field__input" rows={4} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'enq-message-err' : undefined} />
            </Field>

            <div className="enq__submit">
              <button type="submit" className="btn btn--solid" disabled={state === 'sending'}>
                <span>{state === 'sending' ? 'Sending…' : 'Send enquiry'}</span>
                {state === 'sending' ? <span className="spinner" aria-hidden="true" /> : <Arrow />}
              </button>
              <p className="t-label t-label--muted">We never share your details.</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="field" data-invalid={!!error}>
      <label className="field__label" htmlFor={`enq-${id}`}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`enq-${id}-err`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
