import { Fragment, useState } from 'react';
import { BillingToggle } from '../components/BillingToggle';
import { CtaBand, PageHero } from '../components/PageHero';
import { ButtonLink, Odometer, Reveal, RevealText, SectionHead } from '../components/primitives';
import { ADDONS, COMPARISON, FAQ, JOINING_FEE, PLANS, priceFor, type Billing, type PlanId } from '../data/plans';
import { usePageMeta } from '../lib/hooks';
import './membership.css';

export default function Membership() {
  usePageMeta('Membership', 'Base, House and Private membership at BASALT. Monthly or annual, capped at 1,200 members.');
  const [billing, setBilling] = useState<Billing>('monthly');
  const [focus, setFocus] = useState<PlanId | null>(null);
  return (
    <div className="page mem">
      <PageHero
        idx="04"
        label="Membership"
        title="Three ways | to *belong.*"
        lede="Every plan includes an induction, a movement assessment and a written programme. The difference is how much of the house — and how much of our coaches — you want."
        image="rack-window"
        imageAlt="A lifting rack framed against a window at dusk"
        meta={[
          { k: 'Members', v: '1,200 cap' },
          { k: 'Current wait', v: '≈ 2 weeks' },
          { k: 'Annual', v: '2 months free' },
        ]}
      />

      <section className="plans tone-deep2 section" aria-labelledby="plans-title">
        <div className="wrap">
          <div className="plans__head">
            <SectionHead idx="A" label="Plans" />
            <h2 id="plans-title" className="sr-only">
              Plans and prices
            </h2>
            <BillingToggle value={billing} onChange={setBilling} />
            <p className="t-label t-label--muted plans__note" aria-live="polite">
              {billing === 'monthly' ? `Rolling monthly · £${JOINING_FEE} joining fee · one month’s notice` : 'Paid yearly · no joining fee · twelve months for the price of ten'}
            </p>
          </div>
          <div className="plans__grid" onMouseLeave={() => setFocus(null)}>
            {PLANS.map((p, i) => {
              const price = priceFor(p, billing);
              return (
                <Reveal
                  key={p.id}
                  className={`plan ${p.featured ? 'is-featured' : ''} ${focus && focus !== p.id ? 'is-dim' : ''}`}
                  delay={i * 90}
                >
                  <div onMouseEnter={() => setFocus(p.id)} className="plan__in">
                    <div className="plan__top">
                      <span className="t-label t-label--muted">0{i + 1}</span>
                      {p.featured && <span className="plan__flag t-label">{p.featured}</span>}
                    </div>
                    <h3 className="plan__name t-wide">{p.name}</h3>
                    <p className="plan__line">{p.line}</p>
                    <div className="plan__price">
                      <Odometer value={price} prefix="£" className="t-num" />
                      <span className="t-label t-label--muted">per month</span>
                    </div>
                    <p className="plan__year t-label t-label--muted">
                      {billing === 'annual' ? `£${(price * 12).toLocaleString('en-GB')} billed today · save £${p.monthly * 12 - price * 12}` : `£${(p.monthly * 12).toLocaleString('en-GB')} a year`}
                    </p>
                    <ul className="plan__list">
                      {p.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                    <ButtonLink to={`/join?plan=${p.id}&billing=${billing}`} variant={p.featured ? 'signal' : 'line'} className="btn--block">
                      Apply for {p.name}
                    </ButtonLink>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Compare />
      <Addons />
      <Faq />

      <CtaBand title="Not sure yet? | Train with us *for a day.*">
        <ButtonLink to="/visit?subject=daypass" variant="solid">
          Book a £35 day pass
        </ButtonLink>
        <ButtonLink to="/visit?subject=tour">Book a tour</ButtonLink>
      </CtaBand>
    </div>
  );
}

function Compare() {
  const [diffOnly, setDiffOnly] = useState(false);
  const [col, setCol] = useState<number | null>(1);
  const render = (v: boolean | string) =>
    v === true ? (
      <span className="cmp__yes" aria-label="Included" />
    ) : v === false ? (
      <span className="cmp__no" aria-label="Not included">
        —
      </span>
    ) : (
      v
    );
  return (
    <section className="cmp tone-base section" aria-labelledby="cmp-title">
      <div className="wrap">
        <div className="cmp__head">
          <SectionHead idx="B" label="Compare" />
          <RevealText id="cmp-title" className="t-h2" text="Every detail, | *side by side.*" />
          <label className="check cmp__toggle">
            <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
            <span className="t-label">Show differences only</span>
          </label>
        </div>
        <div className="cmp__scroll">
          <table className="cmp__table" data-col={col ?? ''} onMouseLeave={() => setCol(1)}>
            <caption className="sr-only">Membership plan comparison</caption>
            <thead>
              <tr>
                <td />
                {PLANS.map((p, i) => (
                  <th key={p.id} scope="col" className={col === i ? 'is-col' : ''} onMouseEnter={() => setCol(i)}>
                    <span className="t-wide">{p.name}</span>
                    <span className="t-label t-label--muted">£{p.monthly}/mo</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((g) => {
                const rows = g.rows.filter((r) => !diffOnly || new Set(r.values.map(String)).size > 1);
                if (!rows.length) return null;
                return (
                  <Fragment key={g.group}>
                    <tr className="cmp__group">
                      <th scope="colgroup" colSpan={4} className="t-label">
                        {g.group}
                      </th>
                    </tr>
                    {rows.map((r) => (
                      <tr key={r.label} className="cmp__row">
                        <th scope="row">{r.label}</th>
                        {r.values.map((v, i) => (
                          <td key={i} className={col === i ? 'is-col' : ''} onMouseEnter={() => setCol(i)}>
                            {render(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Addons() {
  return (
    <section className="addons tone-raised section--tight" aria-labelledby="addons-title">
      <div className="wrap addons__grid">
        <div>
          <SectionHead idx="C" label="Add-ons" />
          <RevealText id="addons-title" as="h2" className="t-h3 addons__title" text="For any plan, | *whenever you need them.*" />
        </div>
        <ul className="addons__list">
          {ADDONS.map((a, i) => (
            <Reveal as="li" key={a.name} className="addon" delay={i * 70}>
              <span className="addon__name">{a.name}</span>
              <span className="addon__note">{a.note}</span>
              <span className="addon__price">
                <span className="t-num">{a.price}</span>
                <span className="t-label t-label--muted">{a.unit}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq tone-base section" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <div className="faq__side">
          <SectionHead idx="D" label="Questions" />
          <RevealText id="faq-title" className="t-h2" text="Before | you *apply.*" />
        </div>
        <ul className="faq__list">
          {FAQ.map((f, i) => (
            <li key={f.q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
              <h3>
                <button type="button" className="faq__q" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                  <span>{f.q}</span>
                  <span className="prog__plus faq__plus" aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-${i}`} className="faq__a" role="region" aria-label={f.q}>
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
