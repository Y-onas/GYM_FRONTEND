import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { BillingToggle } from '../components/BillingToggle';
import { CoachIndex } from '../components/CoachIndex';
import { useIntro } from '../components/Loader';
import { Arrow, ButtonLink, FitText, Img, MaskImg, Odometer, OpenStatus, PillarTag, Reveal, RevealText, SectionHead } from '../components/primitives';
import { TLink } from '../components/Transition';
import { PILLARS, type Pillar } from '../data/brand';
import { sessionsFor } from '../data/classes';
import { coachById } from '../data/coaches';
import { FLOORS } from '../data/house';
import { PLANS, priceFor, type Billing } from '../data/plans';
import { useClubNow, useInView, useMediaQuery, usePageMeta, useReducedMotion, useScrollProgress } from '../lib/hooks';
import { addDays, formatDate, toMinutes } from '../lib/time';
import { useBookings } from '../state/bookings';
import './home.css';

export default function Home() {
  usePageMeta('');
  return (
    <div className="page home">
      <Hero />
      <Manifesto />
      <Pillars />
      <FloorsTour />
      <Numbers />
      <Coaches />
      <Today />
      <MembershipTeaser />
      <Voice />
    </div>
  );
}

/* ---------------------------------------------------------------- hero */
function Hero() {
  const ready = useIntro();
  const ref = useScrollProgress<HTMLElement>('--p', 'exit');
  return (
    <section ref={ref} className={`hero tone-hero ${ready ? 'is-ready' : ''}`} aria-labelledby="hero-title">
      <div className="hero__media">
        <Img name="hero-deadlift" priority sizes="100vw" alt="A lifter braces over a loaded barbell beneath a single overhead light" focal="50% 40%" />
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__grid wrap">
        <div className="hero__top t-label">
          <span>Athletic House — Est. 2014</span>
          <span className="hero__coords">51.5362° N · 0.1233° W</span>
        </div>

        <RevealText as="h1" id="hero-title" className="hero__title t-display" text="Pressure, heat | *&* time." trigger={ready} delay={250} />

        <div className="hero__aside">
          <p className="hero__lede">
            A members’ training house in a converted Kings Cross ironworks. Four floors of serious equipment, coaches who write your plan by hand, and a recovery level that takes rest as
            seriously as work.
          </p>
          <div className="hero__ctas">
            <ButtonLink to="/join" variant="signal">
              Apply for membership
            </ButtonLink>
            <ButtonLink to="/house">Tour the house</ButtonLink>
          </div>
          <OpenStatus withLoad className="hero__status" />
        </div>
      </div>

      <FitText as="p" className="hero__word t-wide" label="Basalt">
        {'Basalt'.split('').map((ch, i) => (
          <span key={i} className="hero__ch" style={{ '--i': i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </FitText>

      <a href="#manifesto" className="hero__scroll t-label" aria-label="Scroll to introduction">
        <span className="hero__scroll-line" aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}

/* ---------------------------------------------------------------- manifesto */
const MANIFESTO =
  'Basalt is what molten rock becomes when it is given time to cool. Dense. Unhurried. Nearly impossible to break. We think strength is made the same way — under pressure, with heat, over time. Not in thirty-day challenges. In years.';

function Manifesto() {
  const ref = useScrollProgress<HTMLDivElement>('--p', 'through');
  const words = MANIFESTO.split(' ');
  return (
    <section id="manifesto" className="manifesto tone-base section">
      <div className="wrap manifesto__grid">
        <SectionHead idx="01" label="The idea" className="manifesto__eyebrow" />
        <div ref={ref} className="manifesto__text" style={{ '--n': words.length } as CSSProperties}>
          <p className="t-h2">
            {words.map((w, i) => (
              <span key={i} className={`manifesto__w ${/Pressure|heat|time|years/i.test(w) ? 'is-key' : ''}`} style={{ '--i': i } as CSSProperties}>
                {w}{' '}
              </span>
            ))}
          </p>
        </div>
        <Reveal className="manifesto__aside">
          <MaskImg name="oil" alt="Close-up of hands working oil into a palm before a massage" sizes="(max-width: 900px) 60vw, 22vw" className="manifesto__img" />
          <p className="t-body">
            Founded by a weightlifter and a physiotherapist in 2014. Still owned by them, still capped at 1,200 members, still open at five every weekday morning.
          </p>
          <TLink to="/house" className="ulink t-label">
            Read the house story
          </TLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pillars */
const PILLAR_THEMES: Record<Pillar, string> = { pressure: 'tone-deep2', heat: 'tone-accent', time: 'tone-raised' };

function Pillars() {
  return (
    <section className="pillars" aria-label="Pressure, heat and time">
      {(Object.keys(PILLARS) as Pillar[]).map((key, i) => {
        const p = PILLARS[key];
        return (
          <article key={key} className={`pillar ${PILLAR_THEMES[key]}`} style={{ '--i': i } as CSSProperties} aria-labelledby={`pillar-${key}`}>
            <div className="pillar__in wrap">
              <div className="pillar__meta t-label">
                <span>{p.n} / 03</span>
                <span>{p.domain}</span>
              </div>
              <h2 id={`pillar-${key}`} className="pillar__name t-wide">
                {p.name}
              </h2>
              <div className="pillar__body">
                <RevealText as="p" className="pillar__line t-h3" text={`*${p.line}*`} />
                <Reveal as="p" className="t-body" delay={120}>
                  {p.body}
                </Reveal>
                <Reveal as="ul" className="pillar__facts" delay={200}>
                  {p.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </Reveal>
                <Reveal delay={260}>
                  <ButtonLink to={p.href} variant={key === 'heat' ? 'solid' : 'line'}>
                    {p.cta}
                  </ButtonLink>
                </Reveal>
              </div>
              <div className="pillar__img">
                <MaskImg name={p.image} alt="" sizes="(max-width: 900px) 100vw, 45vw" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/* ---------------------------------------------------------------- floors tour (pinned horizontal) */
function FloorsTour() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const wide = useMediaQuery('(min-width: 901px)');
  const reduced = useReducedMotion();
  const pinned = wide && !reduced;

  useEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t) return;
    if (!pinned) {
      t.style.transform = '';
      s.style.height = '';
      return;
    }
    let raf = 0;
    const size = () => {
      const distance = t.scrollWidth - window.innerWidth;
      s.style.height = `${window.innerHeight + distance}px`;
    };
    const update = () => {
      raf = 0;
      const r = s.getBoundingClientRect();
      const distance = t.scrollWidth - window.innerWidth;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      t.style.transform = `translate3d(${-p * distance}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      size();
      update();
    };
    size();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [pinned]);

  return (
    <section ref={section} className={`tour tone-deep ${pinned ? 'is-pinned' : ''}`} aria-labelledby="tour-title">
      <div className="tour__sticky">
        <div className="tour__head wrap">
          <SectionHead idx="02" label="The house" />
          <RevealText id="tour-title" className="t-h2 tour__title" text="Four floors of an | *1871 ironworks.*" />
          <Reveal className="tour__hint t-label t-label--muted" delay={200}>
            {pinned ? 'Keep scrolling — top floor to basement' : 'Swipe — top floor to basement'}
          </Reveal>
        </div>
        <div className="tour__viewport">
          <div ref={track} className="tour__track">
            {FLOORS.map((f, i) => (
              <TLink key={f.id} to="/house#floors" className={`tour__card tour__card--${i}`} aria-label={`${f.name}, level ${f.level}: ${f.summary}`}>
                <div className="tour__img">
                  <Img name={f.image} alt="" sizes="(max-width: 900px) 80vw, 40vw" />
                </div>
                <div className="tour__cap">
                  <span className="tour__lvl t-wide">{f.level}</span>
                  <div>
                    <h3 className="t-h3">{f.name}</h3>
                    <p className="tour__sum">{f.summary}</p>
                  </div>
                  <div className="tour__stat">
                    <span className="t-num">{f.stat.value}</span>
                    <span className="t-label t-label--muted">{f.stat.label}</span>
                  </div>
                </div>
              </TLink>
            ))}
            <TLink to="/house" className="tour__end">
              <span className="t-label t-label--muted">Section drawing, inventory & history</span>
              <span className="t-h2">
                Walk the <em>whole</em> house
              </span>
              <Arrow className="tour__end-arrow" />
            </TLink>
          </div>
        </div>
        <div className="tour__progress wrap" aria-hidden="true">
          <span ref={bar} />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- numbers */
const NUMBERS = [
  { value: 1200, suffix: '', label: 'Members. A hard cap we have never raised.' },
  { value: 14, suffix: '', label: 'Full-time coaches. No freelancers, no sales targets.' },
  { value: 6, suffix: '°C', label: 'The plunge, every single day of the year.' },
  { value: 5, prefix: '0', suffix: ':00', label: 'Doors open on weekdays. Coffee at 05:01.' },
];

function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.6 });
  const [n, setN] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);
  return (
    <span ref={ref} aria-label={`${prefix}${to.toLocaleString('en-GB')}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {n.toLocaleString('en-GB')}
        {suffix}
      </span>
    </span>
  );
}

function Numbers() {
  return (
    <section className="numbers tone-base section--tight" aria-label="BASALT in numbers">
      <div className="wrap">
        <ul className="numbers__list">
          {NUMBERS.map((n, i) => (
            <Reveal as="li" key={n.label} className="numbers__item" delay={i * 90}>
              <span className="numbers__v t-num">
                <CountUp to={n.value} prefix={n.prefix} suffix={n.suffix} />
              </span>
              <span className="numbers__l">{n.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- coaches */
function Coaches() {
  return (
    <section className="coaches tone-deep section" aria-labelledby="coaches-title">
      <div className="wrap">
        <div className="coaches__head">
          <SectionHead idx="03" label="The coaches" />
          <RevealText id="coaches-title" className="t-h2" text="People who notice | when you *don’t* turn up." />
          <Reveal as="p" className="t-body coaches__intro" delay={160}>
            Fourteen full-time coaches, every one of them salaried and none of them on commission. These are the heads of each floor.
          </Reveal>
        </div>
        <CoachIndex />
        <Reveal className="coaches__more">
          <ButtonLink to="/training#coaches">Personal training & all coaches</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- today */
function Today() {
  const now = useClubNow();
  const { bookings } = useBookings();
  const { day, list } = useMemo(() => {
    const todays = sessionsFor(now.isoDate).filter((s) => toMinutes(s.start) > now.minutes);
    if (todays.length) return { day: now.isoDate, list: todays.slice(0, 5) };
    const tomorrow = addDays(now.isoDate, 1);
    return { day: tomorrow, list: sessionsFor(tomorrow).slice(0, 5) };
  }, [now.isoDate, now.minutes]);
  const isToday = day === now.isoDate;

  return (
    <section className="today tone-raised section" aria-labelledby="today-title">
      <div className="wrap today__grid">
        <div className="today__head">
          <SectionHead idx="04" label="On the board" />
          <RevealText id="today-title" className="t-h2" text={isToday ? 'Still to come *today.*' : 'First thing *tomorrow.*'} />
          <Reveal as="p" className="t-label t-label--muted" delay={120}>
            {formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })} · London time
          </Reveal>
          <Reveal delay={200}>
            <ButtonLink to="/timetable">Full timetable</ButtonLink>
          </Reveal>
        </div>
        <ol className="today__list">
          {list.map((s, i) => {
            const left = s.type.capacity - s.taken - (bookings[s.id] === 'booked' ? 1 : 0);
            const coach = coachById(s.coach);
            return (
              <Reveal as="li" key={s.id} delay={i * 70}>
                <TLink to={`/timetable?day=${s.date}&session=${encodeURIComponent(s.id)}`} className="today__row">
                  <span className="today__time t-num">{s.start}</span>
                  <span className="today__name">
                    <span className="today__cls">{s.type.name}</span>
                    <span className="today__sub">
                      {s.type.room} · {coach.name.split(' ')[0]} · {s.type.minutes} min
                    </span>
                  </span>
                  <PillarTag pillar={s.type.pillar} />
                  <span className={`today__left t-label ${left <= 0 ? 'is-full' : left <= 3 ? 'is-low' : ''}`}>
                    {bookings[s.id] ? (bookings[s.id] === 'booked' ? 'Booked' : 'Waitlisted') : left <= 0 ? 'Waitlist' : `${left} left`}
                  </span>
                  <Arrow className="today__arrow" />
                </TLink>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- membership teaser */
function MembershipTeaser() {
  const [billing, setBilling] = useState<Billing>('monthly');
  return (
    <section className="mteaser tone-deep2 section" aria-labelledby="mteaser-title">
      <div className="wrap">
        <div className="mteaser__head">
          <SectionHead idx="05" label="Membership" />
          <RevealText id="mteaser-title" className="t-h2" text="Three ways | to *belong.*" />
          <BillingToggle value={billing} onChange={setBilling} />
        </div>
        <div className="mteaser__cols">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} className={`mteaser__col ${p.featured ? 'is-featured' : ''}`} delay={i * 90}>
              <div className="mteaser__top">
                <h3 className="t-wide mteaser__name">{p.name}</h3>
                {p.featured && <span className="mteaser__flag t-label">{p.featured}</span>}
              </div>
              <p className="mteaser__price">
                <Odometer value={priceFor(p, billing)} prefix="£" className="t-num" />
                <span className="t-label t-label--muted">/ month{billing === 'annual' ? ', billed yearly' : ''}</span>
              </p>
              <p className="mteaser__line">{p.line}</p>
              <ul className="mteaser__list">
                {p.highlights.slice(0, 4).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <ButtonLink to={`/join?plan=${p.id}&billing=${billing}`} variant={p.featured ? 'signal' : 'line'} className="btn--block">
                Apply for {p.name}
              </ButtonLink>
            </Reveal>
          ))}
        </div>
        <Reveal className="mteaser__foot">
          <TLink to="/membership" className="ulink t-label">
            Compare every detail
          </TLink>
          <span className="t-label t-label--muted">Annual billing: twelve months for the price of ten, no joining fee.</span>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- voice */
function Voice() {
  return (
    <section className="voice tone-base section" aria-label="A member on BASALT">
      <div className="wrap voice__grid">
        <MaskImg name="back" alt="A member rests between sets in the Hall" sizes="(max-width: 900px) 100vw, 40vw" className="voice__img" />
        <figure className="voice__fig">
          <RevealText as="blockquote" className="t-h2 voice__q" text="“I came for the racks. I stayed because someone noticed when I *didn’t* turn up.”" />
          <Reveal as="figcaption" className="voice__cap" delay={300}>
            <span className="t-h4">Hanna Reyes</span>
            <span className="t-label t-label--muted">House member since 2016 · Deadlift 185 kg</span>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
