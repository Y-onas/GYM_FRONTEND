import { useState } from 'react';
import { BuildingSection } from '../components/BuildingSection';
import { CtaBand, PageHero } from '../components/PageHero';
import { ButtonLink, Img, MaskImg, Reveal, RevealText, SectionHead } from '../components/primitives';
import { EQUIPMENT, FLOORS, TIMELINE, type FloorId } from '../data/house';
import { useMediaQuery, usePageMeta } from '../lib/hooks';
import './house.css';

export default function House() {
  usePageMeta('The House', 'Four floors of a listed 1871 ironworks in Kings Cross: the Studios, the Deck, the Hall and the Vault.');
  return (
    <div className="page house">
      <PageHero
        idx="01"
        label="The House"
        title="Built in *1871.* | Rebuilt for *strength.*"
        lede="A listed ironworks on Kiln Street, cast for the railways and quiet for half a century. Today: four floors, 3,650 square metres, and nine metres of air above the lifting platforms."
        image="hall-industrial"
        imageAlt="The restored Strength Hall beneath the original trusses and skylights"
        meta={[
          { k: 'Floor area', v: '3,650 m²' },
          { k: 'Levels', v: 'L2 — B1' },
          { k: 'Hall height', v: '9.1 m' },
        ]}
      />
      <Story />
      <Floors />
      <Inventory />
      <Vault />
      <CtaBand title="See it at *six* in the morning.">
        <ButtonLink to="/visit?subject=tour" variant="solid">
          Book a tour
        </ButtonLink>
        <ButtonLink to="/membership">Membership</ButtonLink>
      </CtaBand>
    </div>
  );
}

function Story() {
  return (
    <section className="story theme-paper section" aria-labelledby="story-title">
      <div className="wrap">
        <div className="story__head">
          <SectionHead idx="A" label="History" />
          <RevealText id="story-title" className="t-h2" text="Cast, cooled, | and *reopened.*" />
          <Reveal as="p" className="t-body" delay={150}>
            We kept the trusses, the crane rails and the scorch marks on the brick. Everything else was rebuilt around one idea: a building should make you want to train in it.
          </Reveal>
        </div>
        <ol className="story__line">
          {TIMELINE.map((t, i) => (
            <Reveal as="li" key={t.year} className="story__item" delay={i * 90}>
              <span className="story__year t-num">{t.year}</span>
              <span className="story__t t-h4">{t.title}</span>
              <p className="t-body">{t.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Floors() {
  return (
    <section id="floors" className="floors theme-ink section" aria-labelledby="floors-title">
      <div className="wrap">
        <div className="floors__head">
          <SectionHead idx="B" label="Section drawing" />
          <RevealText id="floors-title" className="t-h2" text="Read the building | *floor by floor.*" />
          <Reveal as="p" className="t-body" delay={150}>
            Select a level on the drawing or from the list. Everything you see is open to every member — except the Vault on Base plans, which opens weekdays from ten to four.
          </Reveal>
        </div>
        <Reveal>
          <BuildingSection />
        </Reveal>
      </div>
    </section>
  );
}

function Inventory() {
  const [filter, setFilter] = useState<FloorId | 'all'>('all');
  const [hover, setHover] = useState(0);
  const fine = useMediaQuery('(hover: hover) and (min-width: 1001px)');
  const items = EQUIPMENT.filter((e) => filter === 'all' || e.floor === filter);
  const current = items[Math.min(hover, items.length - 1)] ?? items[0];

  return (
    <section id="inventory" className="inv theme-paper section" aria-labelledby="inv-title">
      <div className="wrap">
        <div className="inv__head">
          <SectionHead idx="C" label="Inventory" />
          <RevealText id="inv-title" className="t-h2" text="What’s *on the floor.*" />
          <div className="inv__filters" role="group" aria-label="Filter equipment by level">
            {(['all', ...FLOORS.map((f) => f.id)] as const).map((id) => {
              const f = FLOORS.find((x) => x.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  aria-pressed={filter === id}
                  onClick={() => {
                    setFilter(id);
                    setHover(0);
                  }}
                >
                  {f ? `${f.level} ${f.name.replace('The ', '')}` : `All · ${EQUIPMENT.length}`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="inv__body">
          <table className="inv__table">
            <caption className="sr-only">Equipment by level</caption>
            <thead>
              <tr className="t-label t-label--muted">
                <th scope="col">Equipment</th>
                <th scope="col">Maker</th>
                <th scope="col">Spec</th>
                <th scope="col">Level</th>
                <th scope="col" className="inv__qty">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody key={filter}>
              {items.map((e, i) => (
                <tr
                  key={e.name}
                  className={`inv__row ${fine && current === e ? 'is-on' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                  onMouseEnter={() => setHover(i)}
                >
                  <th scope="row">{e.name}</th>
                  <td>{e.maker}</td>
                  <td className="inv__spec">{e.spec}</td>
                  <td className="t-label">{FLOORS.find((f) => f.id === e.floor)!.level}</td>
                  <td className="inv__qty t-num">{e.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {fine && current && (
            <div className="inv__preview" aria-hidden="true">
              <div className="inv__frame" key={current.name}>
                <Img name={current.image} alt="" sizes="30vw" />
              </div>
              <p className="t-label">
                {current.maker} — {current.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const PROTOCOLS = {
  first: { label: 'First visit', rounds: 2, heat: 8, cold: 0.5, rest: 8, note: 'Short heat, a half-minute plunge, long rests. Leave wanting more.' },
  regular: { label: 'Regular', rounds: 3, heat: 12, cold: 2, rest: 6, note: 'Noor’s standard contrast protocol, posted by the sauna door.' },
  athlete: { label: 'After a heavy day', rounds: 4, heat: 15, cold: 3, rest: 5, note: 'For the evening after a test day. Hydrate before you begin.' },
};
type ProtoKey = keyof typeof PROTOCOLS;

function Vault() {
  const [key, setKey] = useState<ProtoKey>('regular');
  const p = PROTOCOLS[key];
  const total = p.rounds * (p.heat + p.cold + p.rest);
  const steps = Array.from({ length: p.rounds }).flatMap((_, r) => [
    { kind: 'heat', min: p.heat, r },
    { kind: 'cold', min: p.cold, r },
    { kind: 'rest', min: p.rest, r },
  ]);
  return (
    <section id="vault" className="vault theme-ink-2 section" aria-labelledby="vault-title">
      <div className="wrap vault__grid">
        <div className="vault__media">
          <MaskImg name="bath" alt="A stone bath in a quiet treatment room in the Vault" sizes="(max-width: 900px) 100vw, 40vw" />
          <MaskImg name="massage" alt="A therapist works on a member’s back" sizes="(max-width: 900px) 50vw, 20vw" className="vault__small" />
        </div>
        <div className="vault__text">
          <SectionHead idx="D" label="The Vault · B1" />
          <RevealText id="vault-title" className="t-h2" text="Heat, cold, | *and nothing else.*" />
          <Reveal as="p" className="t-body" delay={120}>
            The old coal store sits below street level, so it is the quietest room in Kings Cross. Phones stay upstairs. Choose a protocol and we’ll show you the session.
          </Reveal>

          <Reveal className="proto" delay={200}>
            <div className="proto__tabs" role="radiogroup" aria-label="Contrast protocol">
              {(Object.keys(PROTOCOLS) as ProtoKey[]).map((k) => (
                <button key={k} type="button" role="radio" aria-checked={key === k} className="chip" onClick={() => setKey(k)}>
                  {PROTOCOLS[k].label}
                </button>
              ))}
            </div>
            <div className="proto__bar" aria-hidden="true" key={key}>
              {steps.map((s, i) => (
                <span key={i} className={`proto__seg proto__seg--${s.kind}`} style={{ flexGrow: s.min, '--i': i } as React.CSSProperties} />
              ))}
            </div>
            <dl className="proto__stats">
              <div>
                <dt className="t-label t-label--muted">Rounds</dt>
                <dd className="t-num">{p.rounds}</dd>
              </div>
              <div>
                <dt className="t-label t-label--muted">Sauna 90°C</dt>
                <dd className="t-num">{p.heat}′</dd>
              </div>
              <div>
                <dt className="t-label t-label--muted">Plunge 6°C</dt>
                <dd className="t-num">{p.cold < 1 ? '30″' : `${p.cold}′`}</dd>
              </div>
              <div>
                <dt className="t-label t-label--muted">Total</dt>
                <dd className="t-num">{Math.round(total)}′</dd>
              </div>
            </dl>
            <p className="proto__note" aria-live="polite">
              {p.note}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
