import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Dialog } from '../components/Dialog';
import { CtaBand, PageHero } from '../components/PageHero';
import { Arrow, ButtonLink, Img, Odometer, PillarTag, Reveal, RevealText, SectionHead } from '../components/primitives';
import { TLink } from '../components/Transition';
import { COACHES, coachById, type Coach, type CoachId } from '../data/coaches';
import { PROGRAMS, PT_PACKS, PT_TIERS } from '../data/programs';
import { usePageMeta } from '../lib/hooks';
import './training.css';

export default function Training() {
  usePageMeta('Training', 'Programmes, personal training and the coaches of BASALT.');
  return (
    <div className="page training">
      <PageHero
        idx="02"
        label="Training"
        title="A plan, *written* | for you."
        lede="Every member starts with a movement assessment and leaves with a programme. Follow it alone, in a coached block, or one-to-one with the person who wrote it."
        image="spotting"
        imageAlt="A coach spots a member through a heavy bench press"
        meta={[
          { k: 'Programmes', v: '6 tracks' },
          { k: 'Coaches', v: '14 full-time' },
          { k: '1:1 from', v: '£85' },
        ]}
      />
      <Programs />
      <PersonalTraining />
      <CoachGrid />
      <CtaBand title="Start with *Foundations.* | Six weeks, three days.">
        <ButtonLink to="/join" variant="solid">
          Apply for membership
        </ButtonLink>
        <ButtonLink to="/timetable">See classes</ButtonLink>
      </CtaBand>
    </div>
  );
}

function Programs() {
  const [open, setOpen] = useState<string>(PROGRAMS[1].id);
  const current = PROGRAMS.find((p) => p.id === open) ?? PROGRAMS[0];
  return (
    <section className="progs tone-light section" aria-labelledby="progs-title">
      <div className="wrap">
        <div className="progs__head">
          <SectionHead idx="A" label="Programmes" />
          <RevealText id="progs-title" className="t-h2" text="Six tracks. | *One* question: what for?" />
        </div>
        <div className="progs__body">
          <ul className="progs__list">
            {PROGRAMS.map((p, i) => {
              const isOpen = open === p.id;
              const lead = coachById(p.lead);
              return (
                <Reveal as="li" key={p.id} className={`prog ${isOpen ? 'is-open' : ''}`} delay={i * 60}>
                  <h3>
                    <button type="button" className="prog__btn" aria-expanded={isOpen} aria-controls={`prog-${p.id}`} onClick={() => setOpen(p.id)}>
                      <span className="prog__n t-label">0{i + 1}</span>
                      <span className="prog__name">{p.name}</span>
                      <span className="prog__len t-label t-label--muted">{p.length}</span>
                      <span className="prog__plus" aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`prog-${p.id}`} className="prog__panel" role="region" aria-label={p.name} hidden={!isOpen}>
                    <div className="prog__inner">
                      <div className="prog__img">
                        <Img name={p.image} alt="" sizes="100vw" />
                      </div>
                      <p className="prog__for">
                        <span className="t-label t-label--muted">For</span> {p.forWhom}
                      </p>
                      <p className="prog__out">{p.outcome}</p>
                      <ul className="prog__inc">
                        {p.includes.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                      <div className="prog__foot">
                        <PillarTag pillar={p.pillar} />
                        <span className="t-label t-label--muted">{p.frequency}</span>
                        <span className="t-label t-label--muted">Led by {lead.name}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
          <div className="progs__aside" aria-hidden="true">
            <div className="progs__frame" key={current.id}>
              <Img name={current.image} alt="" sizes="40vw" />
            </div>
            <p className="progs__caption">
              <span className="t-wide">{current.name}</span>
              <span className="t-label t-label--muted">
                {current.length} · {current.frequency}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalTraining() {
  const [tier, setTier] = useState<(typeof PT_TIERS)[number]['id']>('senior');
  const [packIdx, setPackIdx] = useState(1);
  const t = PT_TIERS.find((x) => x.id === tier)!;
  const pack = PT_PACKS[packIdx];
  const per = Math.round(t.rate * (1 - pack.discount));
  const total = per * pack.sessions;
  const saved = t.rate * pack.sessions - total;

  return (
    <section className="pt tone-dark section" aria-labelledby="pt-title">
      <div className="wrap pt__grid">
        <div className="pt__intro">
          <SectionHead idx="B" label="Personal training" />
          <RevealText id="pt-title" className="t-h2" text="One coach. | *Your* hour." />
          <Reveal as="p" className="t-body" delay={120}>
            One-to-one sessions are 55 minutes, booked directly with your coach and logged against your programme. Packs are shared with nobody and pause when you freeze your membership.
          </Reveal>
          <Reveal className="pt__img" delay={200}>
            <Img name="cable" alt="A member works through a cable row under a coach’s eye" sizes="(max-width: 900px) 100vw, 40vw" />
          </Reveal>
        </div>

        <Reveal className="calc" delay={100}>
          <fieldset className="calc__group">
            <legend className="t-label t-label--muted">1 — Coach level</legend>
            <div className="calc__opts calc__opts--3">
              {PT_TIERS.map((x) => (
                <label key={x.id} className={`calc__opt ${tier === x.id ? 'is-on' : ''}`}>
                  <input type="radio" name="tier" value={x.id} checked={tier === x.id} onChange={() => setTier(x.id)} className="sr-only" />
                  <span className="calc__optname">{x.name}</span>
                  <span className="t-label t-label--muted">£{x.rate} / session</span>
                  <span className="calc__note">{x.note}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="calc__group">
            <legend className="t-label t-label--muted">2 — Sessions</legend>
            <div className="calc__opts calc__opts--3">
              {PT_PACKS.map((p, i) => (
                <label key={p.sessions} className={`calc__opt ${packIdx === i ? 'is-on' : ''}`}>
                  <input type="radio" name="pack" value={p.sessions} checked={packIdx === i} onChange={() => setPackIdx(i)} className="sr-only" />
                  <span className="calc__optname">
                    {p.sessions} {p.sessions === 1 ? 'session' : 'sessions'}
                  </span>
                  <span className="t-label t-label--muted">{p.discount ? `Save ${Math.round(p.discount * 100)}%` : 'Pay as you go'}</span>
                  <span className="calc__note">Valid {p.validity}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="calc__out" aria-live="polite">
            <div>
              <span className="t-label t-label--muted">Per session</span>
              <Odometer value={per} prefix="£" className="t-num calc__per" />
            </div>
            <div>
              <span className="t-label t-label--muted">Total</span>
              <Odometer value={total} prefix="£" className="t-num calc__total" />
              <span className="calc__saved t-label">{saved > 0 ? `You save £${saved}` : 'No commitment'}</span>
            </div>
          </div>
          <ButtonLink to={`/visit?subject=pt&detail=${encodeURIComponent(`${pack.sessions} × ${t.name}`)}`} variant="signal" className="btn--block">
            Request this pack
          </ButtonLink>
          <p className="calc__fine t-label t-label--muted">Private members: four sessions a month are included.</p>
        </Reveal>
      </div>
    </section>
  );
}

function CoachGrid() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('coach') as CoachId | null;
  const coach = selected ? COACHES.find((c) => c.id === selected) : undefined;

  const openCoach = (id: CoachId) => setParams((p) => (p.set('coach', id), p), { replace: true, preventScrollReset: true });
  const close = () =>
    setParams(
      (p) => {
        p.delete('coach');
        return p;
      },
      { replace: true, preventScrollReset: true },
    );

  useEffect(() => {
    if (selected && !coach) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <section id="coaches" className="cgrid tone-light section" aria-labelledby="cgrid-title">
      <div className="wrap">
        <div className="progs__head">
          <SectionHead idx="C" label="Coaches" />
          <RevealText id="cgrid-title" className="t-h2" text="The heads | *of each floor.*" />
        </div>
        <ul className="cgrid__list">
          {COACHES.map((c, i) => (
            <Reveal as="li" key={c.id} className={`cgrid__item cgrid__item--${i}`} delay={(i % 3) * 90}>
              <button type="button" className="cgrid__btn" onClick={() => openCoach(c.id)} aria-haspopup="dialog">
                <span className="cgrid__img">
                  <Img name={c.image} alt={`Portrait of ${c.name}`} sizes="(max-width: 700px) 50vw, 30vw" focal={c.focal} />
                  <span className="cgrid__quote">“{c.quote}”</span>
                </span>
                <span className="cgrid__meta">
                  <span className="cgrid__name">{c.name}</span>
                  <span className="t-label t-label--muted">{c.role}</span>
                </span>
                <span className="cgrid__view t-label">
                  Profile <Arrow className="cgrid__arrow" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
      <Dialog open={Boolean(coach)} onClose={close} label={coach ? `${coach.name}, ${coach.role}` : 'Coach profile'}>
        {coach && <CoachProfile coach={coach} onNavigate={close} />}
      </Dialog>
    </section>
  );
}

function CoachProfile({ coach, onNavigate }: { coach: Coach; onNavigate: () => void }) {
  return (
    <article className="profile">
      <div className="profile__img">
        <Img name={coach.image} alt={`Portrait of ${coach.name}`} sizes="(max-width: 640px) 100vw, 45vw" focal={coach.focal} />
      </div>
      <div className="profile__body">
        <div className="profile__top">
          <PillarTag pillar={coach.pillar} />
          <span className="t-label t-label--muted">
            {coach.tier} · {coach.years} years coaching
          </span>
        </div>
        <h2 className="t-h2">{coach.name}</h2>
        <p className="t-label">{coach.role}</p>
        <blockquote className="profile__quote">“{coach.quote}”</blockquote>
        <p className="profile__bio">{coach.bio}</p>
        <dl className="profile__facts">
          <div>
            <dt className="t-label t-label--muted">Credentials</dt>
            <dd>
              <ul>
                {coach.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="t-label t-label--muted">Coaches</dt>
            <dd>
              <ul>
                {coach.specialties.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="t-label t-label--muted">On the floor</dt>
            <dd>{coach.hours}</dd>
          </div>
        </dl>
        <div className="profile__ctas">
          <TLink to={`/visit?subject=pt&detail=${encodeURIComponent(`Intro session with ${coach.name}`)}`} className="btn btn--solid" onClick={onNavigate}>
            <span>Book an intro session</span>
            <Arrow />
          </TLink>
          <TLink to={`/timetable?coach=${coach.id}`} className="btn" onClick={onNavigate}>
            <span>{coach.name.split(' ')[0]}’s classes</span>
            <Arrow />
          </TLink>
        </div>
      </div>
    </article>
  );
}
