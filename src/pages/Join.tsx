import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { BillingToggle } from '../components/BillingToggle';
import { Arrow, Img, Mark, Odometer } from '../components/primitives';
import { TLink } from '../components/Transition';
import { BRAND } from '../data/brand';
import { COACHES } from '../data/coaches';
import { JOINING_FEE, PLANS, planById, priceFor, type Billing, type PlanId } from '../data/plans';
import { downloadIcs } from '../lib/ics';
import { useClubNow, usePageMeta } from '../lib/hooks';
import { addDays, formatDate, toMinutes, weekdayOf } from '../lib/time';
import './join.css';

const STEPS = ['Plan', 'About you', 'Induction', 'Review'] as const;
const GOALS = ['Get stronger', 'Build muscle', 'Improve fitness', 'Lose body fat', 'Train for an event', 'Recover from injury', 'Move better', 'Feel calmer'];
const LEVELS = [
  { id: 'new', label: 'New to training', note: 'We’ll start you on Foundations' },
  { id: 'some', label: 'Some experience', note: 'You know your way round a gym' },
  { id: 'trained', label: 'Experienced', note: 'Years of structured training' },
];
const SLOTS = ['07:00', '08:30', '10:00', '12:30', '15:00', '17:30', '19:00'];

type Draft = {
  plan: PlanId;
  billing: Billing;
  first: string;
  last: string;
  email: string;
  phone: string;
  dob: string;
  goals: string[];
  level: string;
  date: string;
  slot: string;
  coach: string;
  terms: boolean;
  health: boolean;
};
type Errs = Partial<Record<keyof Draft, string>>;

const KEY = 'basalt.join.draft';

function slotTaken(date: string, slot: string) {
  let h = 2166136261;
  for (const c of `${date}|${slot}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967295 < 0.22;
}

export default function Join() {
  usePageMeta('Apply', 'Apply for Valiant Fitness membership and book your induction.');
  const [params] = useSearchParams();
  const now = useClubNow();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errs>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [appNo, setAppNo] = useState('');
  const headRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const [d, setD] = useState<Draft>(() => {
    let saved: Partial<Draft> = {};
    try {
      saved = JSON.parse(sessionStorage.getItem(KEY) || '{}');
    } catch {
      /* ignore corrupt draft */
    }
    const qp = planById(params.get('plan'))?.id;
    const qb = params.get('billing') === 'annual' ? 'annual' : params.get('billing') === 'monthly' ? 'monthly' : undefined;
    return {
      plan: 'house',
      billing: 'monthly',
      first: '',
      last: '',
      email: '',
      phone: '',
      dob: '',
      goals: [],
      level: '',
      date: '',
      slot: '',
      coach: '',
      terms: false,
      health: false,
      ...saved,
      ...(qp ? { plan: qp } : {}),
      ...(qb ? { billing: qb } : {}),
    };
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(d));
    } catch {
      /* storage unavailable */
    }
  }, [d]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, status]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const plan = planById(d.plan)!;
  const monthly = priceFor(plan, d.billing);
  const dueToday = d.billing === 'annual' ? monthly * 12 : monthly + JOINING_FEE;
  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(now.isoDate, i + 1)), [now.isoDate]);

  const validate = (s: number): Errs => {
    const e: Errs = {};
    if (s === 1) {
      if (d.first.trim().length < 2) e.first = 'Enter your first name.';
      if (d.last.trim().length < 2) e.last = 'Enter your last name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Enter a valid email address.';
      if (!/^[+\d][\d\s()-]{6,}$/.test(d.phone.trim())) e.phone = 'Enter a phone number we can call.';
      if (!d.dob) e.dob = 'Enter your date of birth.';
      else {
        const age = (Date.now() - new Date(d.dob).getTime()) / (365.25 * 864e5);
        if (age < 18) e.dob = 'Members must be 18 or over.';
        else if (age > 110) e.dob = 'Please check the year.';
      }
      if (!d.level) e.level = 'Choose the option closest to you.';
    }
    if (s === 2) {
      if (!d.date) e.date = 'Choose a day for your induction.';
      if (!d.slot) e.slot = 'Choose a time.';
    }
    if (s === 3) {
      if (!d.terms) e.terms = 'Please accept the membership terms.';
      if (!d.health) e.health = 'Please confirm the health declaration.';
    }
    return e;
  };

  const next = (ev?: FormEvent) => {
    ev?.preventDefault();
    const e = validate(step);
    setErrors(e);
    const firstErr = Object.keys(e)[0];
    if (firstErr) {
      document.getElementById(`j-${firstErr}`)?.focus();
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      setStatus('sending');
      window.setTimeout(() => {
        setAppNo(`${d.plan.slice(0, 1).toUpperCase()}${String(Date.now()).slice(-6)}`);
        setStatus('done');
        try {
          sessionStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
      }, 1400);
    }
  };

  const goTo = (s: number) => {
    if (s < step) setStep(s);
  };

  if (status === 'done') {
    return (
      <div className="page join join--done tone-deep">
        <div className="wrap jdone">
          <div className="jdone__mark" aria-hidden="true">
            <Mark />
          </div>
          <p className="t-label t-label--muted">Application {appNo}</p>
          <h1 ref={headRef} tabIndex={-1} className="t-h1">
            Welcome to the house, <em>{d.first.trim()}.</em>
          </h1>
          <p className="t-lede jdone__lede">
            Your {plan.name} application is in. Your induction is booked for {formatDate(d.date, { weekday: 'long', day: 'numeric', month: 'long' })} at {d.slot} — membership starts that day, so nothing is charged until then.
          </p>
          <ol className="jdone__steps">
            <li>
              <span className="t-label">Within a working day</span>A coach calls you on {d.phone.trim()} to talk through your goals.
            </li>
            <li>
              <span className="t-label">Induction day</span>60-minute movement assessment and a tour of all four floors.
            </li>
            <li>
              <span className="t-label">Within a week</span>Your written programme arrives, signed by the coach who assessed you.
            </li>
          </ol>
          <div className="jdone__ctas">
            <button
              type="button"
              className="btn btn--signal"
              onClick={() =>
                downloadIcs({
                  title: 'Valiant Fitness induction',
                  date: d.date,
                  start: d.slot,
                  minutes: 60,
                  location: BRAND.address.join(', '),
                  description: `Movement assessment and tour. Bring training kit and water. Application ${appNo}.`,
                })
              }
            >
              <span>Add induction to calendar</span>
              <Arrow dir="down" />
            </button>
            <TLink to="/timetable" className="btn">
              <span>Explore the timetable</span>
              <Arrow />
            </TLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page join">
      <aside className="jsum tone-deep" aria-label="Your membership summary">
        <div className="jsum__img" aria-hidden="true">
          <Img name="rack-bw" alt="" sizes="40vw" priority />
        </div>
        <div className="jsum__in">
          <p className="t-label t-label--muted">Application · {STEPS[step]}</p>
          <p className="jsum__plan t-wide">{plan.name}</p>
          <p className="jsum__line">{plan.line}</p>
          <dl className="jsum__rows">
            <div>
              <dt>Monthly</dt>
              <dd>
                <Odometer value={monthly} prefix="£" className="t-num" />
              </dd>
            </div>
            <div>
              <dt>Billing</dt>
              <dd>{d.billing === 'annual' ? 'Annual, upfront' : 'Rolling monthly'}</dd>
            </div>
            <div>
              <dt>Joining fee</dt>
              <dd>{d.billing === 'annual' ? <s>£{JOINING_FEE}</s> : `£${JOINING_FEE}`}</dd>
            </div>
            <div>
              <dt>Induction</dt>
              <dd>{d.date && d.slot ? `${formatDate(d.date, { weekday: 'short', day: 'numeric', month: 'short' })}, ${d.slot}` : '—'}</dd>
            </div>
            <div className="jsum__total">
              <dt>Due on induction day</dt>
              <dd>
                <Odometer value={dueToday} prefix="£" className="t-num" />
              </dd>
            </div>
          </dl>
          <p className="jsum__fine t-label t-label--muted">Nothing is charged until your induction.</p>
        </div>
      </aside>

      <div className="jform tone-base">
        <nav className="jsteps" aria-label="Application progress">
          <ol>
            {STEPS.map((s, i) => (
              <li key={s} className={`jsteps__i ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}>
                <button type="button" onClick={() => goTo(i)} disabled={i >= step} aria-current={i === step ? 'step' : undefined}>
                  <span className="t-label">0{i + 1}</span>
                  <span>{s}</span>
                </button>
              </li>
            ))}
          </ol>
          <span className="jsteps__bar" style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} aria-hidden="true" />
        </nav>

        <form className="jform__form" onSubmit={next} noValidate>
          <div className="jstep" key={step}>
            {step === 0 && (
              <>
                <h1 ref={headRef} tabIndex={-1} className="t-h2">
                  Choose your <em>plan.</em>
                </h1>
                <BillingToggle value={d.billing} onChange={(b) => set('billing', b)} />
                <div className="jplans" role="radiogroup" aria-label="Membership plan">
                  {PLANS.map((p) => (
                    <label key={p.id} className={`jplan ${d.plan === p.id ? 'is-on' : ''}`}>
                      <input type="radio" name="plan" value={p.id} checked={d.plan === p.id} onChange={() => set('plan', p.id)} className="sr-only" />
                      <span className="jplan__radio" aria-hidden="true" />
                      <span className="jplan__name t-wide">{p.name}</span>
                      <span className="jplan__line">{p.line}</span>
                      <span className="jplan__price t-num">£{priceFor(p, d.billing)}</span>
                      <ul className="jplan__list">
                        {p.highlights.slice(0, 3).map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </label>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 ref={headRef} tabIndex={-1} className="t-h2">
                  A little <em>about you.</em>
                </h1>
                <div className="jgrid">
                  <JField id="first" label="First name" error={errors.first}>
                    <input id="j-first" className="field__input" autoComplete="given-name" value={d.first} onChange={(e) => set('first', e.target.value)} aria-invalid={!!errors.first} />
                  </JField>
                  <JField id="last" label="Last name" error={errors.last}>
                    <input id="j-last" className="field__input" autoComplete="family-name" value={d.last} onChange={(e) => set('last', e.target.value)} aria-invalid={!!errors.last} />
                  </JField>
                  <JField id="email" label="Email" error={errors.email}>
                    <input id="j-email" type="email" className="field__input" autoComplete="email" value={d.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} />
                  </JField>
                  <JField id="phone" label="Mobile" error={errors.phone}>
                    <input id="j-phone" type="tel" className="field__input" autoComplete="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} />
                  </JField>
                  <JField id="dob" label="Date of birth" error={errors.dob}>
                    <input id="j-dob" type="date" className="field__input" autoComplete="bday" value={d.dob} max={now.isoDate} onChange={(e) => set('dob', e.target.value)} aria-invalid={!!errors.dob} />
                  </JField>
                </div>

                <fieldset className="jset">
                  <legend className="field__label">Your training experience</legend>
                  <div className="jlevels" id="j-level" tabIndex={-1}>
                    {LEVELS.map((l) => (
                      <label key={l.id} className={`jlevel ${d.level === l.id ? 'is-on' : ''}`}>
                        <input type="radio" name="level" value={l.id} checked={d.level === l.id} onChange={() => set('level', l.id)} className="sr-only" />
                        <span className="jlevel__name">{l.label}</span>
                        <span className="t-label t-label--muted">{l.note}</span>
                      </label>
                    ))}
                  </div>
                  {errors.level && <p className="field__error">{errors.level}</p>}
                </fieldset>

                <fieldset className="jset">
                  <legend className="field__label">What are you training for? (choose any)</legend>
                  <div className="jgoals">
                    {GOALS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        className="chip"
                        aria-pressed={d.goals.includes(g)}
                        onClick={() => set('goals', d.goals.includes(g) ? d.goals.filter((x) => x !== g) : [...d.goals, g])}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 2 && (
              <>
                <h1 ref={headRef} tabIndex={-1} className="t-h2">
                  Book your <em>induction.</em>
                </h1>
                <p className="t-body">Sixty minutes with a coach: a movement assessment, your first programme conversation and a tour of all four floors.</p>
                <fieldset className="jset">
                  <legend className="field__label">Day</legend>
                  <div className="jdates" id="j-date" tabIndex={-1}>
                    {dates.map((x) => (
                      <label key={x} className={`jdate ${d.date === x ? 'is-on' : ''} ${weekdayOf(x) >= 5 ? 'is-weekend' : ''}`}>
                        <input
                          type="radio"
                          name="date"
                          value={x}
                          checked={d.date === x}
                          onChange={() => {
                            set('date', x);
                            if (d.slot && slotTaken(x, d.slot)) set('slot', '');
                          }}
                          className="sr-only"
                        />
                        <span className="t-label">{formatDate(x, { weekday: 'short' })}</span>
                        <span className="t-num jdate__n">{formatDate(x, { day: 'numeric' })}</span>
                        <span className="t-label t-label--muted">{formatDate(x, { month: 'short' })}</span>
                      </label>
                    ))}
                  </div>
                  {errors.date && <p className="field__error">{errors.date}</p>}
                </fieldset>
                <fieldset className="jset" disabled={!d.date}>
                  <legend className="field__label">Time {d.date ? `· ${formatDate(d.date, { weekday: 'long', day: 'numeric', month: 'long' })}` : '· choose a day first'}</legend>
                  <div className="jslots" id="j-slot" tabIndex={-1}>
                    {SLOTS.filter((s) => weekdayOf(d.date || now.isoDate) < 5 || (toMinutes(s) >= 480 && toMinutes(s) <= 1020)).map((s) => {
                      const taken = d.date ? slotTaken(d.date, s) : false;
                      return (
                        <label key={s} className={`jslot ${d.slot === s ? 'is-on' : ''} ${taken ? 'is-taken' : ''}`}>
                          <input type="radio" name="slot" value={s} checked={d.slot === s} disabled={taken || !d.date} onChange={() => set('slot', s)} className="sr-only" />
                          <span className="t-num">{s}</span>
                          <span className="t-label t-label--muted">{taken ? 'Taken' : 'Free'}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.slot && <p className="field__error">{errors.slot}</p>}
                </fieldset>
                <div className="jgrid">
                  <JField id="coach" label="Coach preference (optional)">
                    <select id="j-coach" className="field__input" value={d.coach} onChange={(e) => set('coach', e.target.value)}>
                      <option value="">Whoever is on the floor</option>
                      {COACHES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.role}
                        </option>
                      ))}
                    </select>
                  </JField>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 ref={headRef} tabIndex={-1} className="t-h2">
                  Check, then <em>apply.</em>
                </h1>
                <dl className="jreview">
                  <ReviewRow label="Plan" value={`${plan.name} · £${monthly}/month · ${d.billing === 'annual' ? 'annual' : 'monthly'}`} onEdit={() => setStep(0)} />
                  <ReviewRow label="Member" value={`${d.first} ${d.last}`} onEdit={() => setStep(1)} />
                  <ReviewRow label="Contact" value={`${d.email} · ${d.phone}`} onEdit={() => setStep(1)} />
                  <ReviewRow label="Goals" value={d.goals.length ? d.goals.join(', ') : 'Not specified'} onEdit={() => setStep(1)} />
                  <ReviewRow
                    label="Induction"
                    value={`${formatDate(d.date, { weekday: 'long', day: 'numeric', month: 'long' })} at ${d.slot}${d.coach ? ` with ${COACHES.find((c) => c.id === d.coach)?.name}` : ''}`}
                    onEdit={() => setStep(2)}
                  />
                </dl>
                <div className="jchecks">
                  <label className="check">
                    <input id="j-terms" type="checkbox" checked={d.terms} onChange={(e) => set('terms', e.target.checked)} aria-invalid={!!errors.terms} />
                    <span>
                      I accept the membership terms: {d.billing === 'annual' ? 'twelve months paid upfront, non-refundable after induction' : 'rolling monthly with one month’s notice'}.
                    </span>
                  </label>
                  {errors.terms && <p className="field__error">{errors.terms}</p>}
                  <label className="check">
                    <input id="j-health" type="checkbox" checked={d.health} onChange={(e) => set('health', e.target.checked)} aria-invalid={!!errors.health} />
                    <span>I have no medical condition that prevents me from exercising, or I will discuss it with a coach at my induction.</span>
                  </label>
                  {errors.health && <p className="field__error">{errors.health}</p>}
                </div>
              </>
            )}
          </div>

          <div className="jnav">
            {step > 0 ? (
              <button type="button" className="btn" onClick={() => setStep(step - 1)}>
                <Arrow dir="left" />
                <span>Back</span>
              </button>
            ) : (
              <TLink to="/membership" className="btn">
                <Arrow dir="left" />
                <span>Plans</span>
              </TLink>
            )}
            <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
              <span>{step === STEPS.length - 1 ? (status === 'sending' ? 'Submitting…' : 'Submit application') : `Continue to ${STEPS[step + 1].toLowerCase()}`}</span>
              {status === 'sending' ? <span className="spinner" aria-hidden="true" /> : <Arrow />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JField({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="field" data-invalid={!!error}>
      <label className="field__label" htmlFor={`j-${id}`}>
        {label}
      </label>
      {children}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="jreview__row">
      <dt className="t-label t-label--muted">{label}</dt>
      <dd>{value}</dd>
      <dd>
        <button type="button" className="ulink t-label" onClick={onEdit} aria-label={`Edit ${label.toLowerCase()}`}>
          Edit
        </button>
      </dd>
    </div>
  );
}
