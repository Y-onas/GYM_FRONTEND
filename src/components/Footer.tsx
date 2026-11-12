import { useState, type FormEvent } from 'react';
import { useLocation } from 'react-router';
import { BRAND, NAV } from '../data/brand';
import { HOURS } from '../lib/time';
import { Arrow, FitText, OpenStatus } from './primitives';
import { TLink } from './Transition';
import { useToast } from './Toast';
import './footer.css';

export function Footer() {
  const { pathname } = useLocation();
  return (
    <footer className="footer tone-dark">
      <div className="wrap">
        <div className="footer__top" hidden={pathname === '/join'}>
          <p className="footer__pitch t-h2">
            Membership is capped at <em>1,200.</em>
            <br />
            There’s usually room for one more.
          </p>
          <div className="footer__cta">
            <TLink to="/join" className="btn btn--signal">
              <span>Apply for membership</span>
              <Arrow />
            </TLink>
            <TLink to="/visit" className="btn">
              <span>Book a tour</span>
              <Arrow />
            </TLink>
          </div>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h2 className="t-label t-label--muted">The House</h2>
            <address>
              {BRAND.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <a className="ulink footer__map" href={BRAND.mapsHref} target="_blank" rel="noreferrer">
              Open in Maps <Arrow className="footer__ne" dir="ne" />
            </a>
          </div>
          <div className="footer__col">
            <h2 className="t-label t-label--muted">Hours</h2>
            <dl className="footer__hours">
              {HOURS.map((h) => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd>
                    {h.open} — {h.close}
                  </dd>
                </div>
              ))}
            </dl>
            <OpenStatus />
          </div>
          <nav className="footer__col" aria-label="Footer">
            <h2 className="t-label t-label--muted">Explore</h2>
            <ul>
              {NAV.map((n) => (
                <li key={n.to}>
                  <TLink className="ulink ulink--in" to={n.to}>
                    {n.label}
                  </TLink>
                </li>
              ))}
              <li>
                <TLink className="ulink ulink--in" to="/join">
                  Apply
                </TLink>
              </li>
            </ul>
          </nav>
          <div className="footer__col footer__col--wide">
            <h2 className="t-label t-label--muted">The Ledger</h2>
            <p className="footer__ledger">One letter a month from the coaching floor. Programming notes, no promotions.</p>
            <Newsletter />
            <div className="footer__contact">
              <a className="ulink" href={BRAND.phoneHref}>
                {BRAND.phone}
              </a>
              <a className="ulink" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <FitText className="footer__word t-wide" label="BASALT">
        Basalt
      </FitText>

      <div className="wrap footer__legal t-label">
        <span>© {new Date().getFullYear()} Basalt Athletic House Ltd</span>
        <span>Est. {BRAND.established} in a listed 1871 ironworks</span>
        <button type="button" className="ulink ulink--in" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'sending' | 'done'>('idle');
  const toast = useToast();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState('error');
      return;
    }
    setState('sending');
    window.setTimeout(() => {
      setState('done');
      toast('You’re on the Ledger. First letter arrives on the 1st.');
    }, 700);
  };
  if (state === 'done')
    return (
      <p className="footer__done" role="status">
        <span className="footer__tick" aria-hidden="true" /> Subscribed as {email.trim()}
      </p>
    );
  return (
    <form className="footer__form" onSubmit={submit} noValidate>
      <div className="field" data-invalid={state === 'error'}>
        <label className="sr-only" htmlFor="ledger-email">
          Email address
        </label>
        <input
          id="ledger-email"
          className="field__input"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? 'ledger-err' : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
        />
        <button type="submit" className="footer__submit" aria-label="Subscribe" disabled={state === 'sending'}>
          {state === 'sending' ? <span className="spinner" aria-hidden="true" /> : <Arrow className="footer__arrow" />}
        </button>
      </div>
      {state === 'error' && (
        <p id="ledger-err" className="field__error">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
}
