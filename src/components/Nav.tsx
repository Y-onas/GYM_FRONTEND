import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { BRAND, NAV } from '../data/brand';
import { useBodyLock, useFocusTrap } from '../lib/hooks';
import { isPinningScroll } from '../state/theme';
import { Arrow, Img, Mark, OpenStatus } from './primitives';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TLink } from './Transition';
import './nav.css';

export function Nav() {
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(y > 40);
      if (isPinningScroll()) {
        last = y;
        return;
      }
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 320);
        last = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className={`nav tone-hero ${solid || pathname === '/join' ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-menu' : ''}`}>
        <div className="nav__in">
          <TLink to="/" className="nav__brand" aria-label={`${BRAND.name}, home`}>
            <Mark />
            <span className="nav__word">{BRAND.shortName}<span className="nav__fitness">Fitness</span></span>
          </TLink>

          <nav className="nav__links" aria-label="Primary">
            {NAV.map((item, i) => {
              const active = pathname.startsWith(item.to);
              return (
                <TLink key={item.to} to={item.to} className={`nav__link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                  <span className="nav__idx">0{i + 1}</span>
                  <span className="nav__label">{item.label}</span>
                </TLink>
              );
            })}
          </nav>

          <div className="nav__right">
            <OpenStatus className="nav__status" />
            <TLink to="/join" className="btn btn--signal btn--small nav__apply">
              <span>Apply</span>
              <Arrow />
            </TLink>
            <ThemeSwitcher />
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="nav__toggle-text">{open ? 'Close' : 'Menu'}</span>
              <span className="nav__burger" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>
      <Menu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}

function Menu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(0);
  useBodyLock(open);
  useFocusTrap(ref, open, onClose);

  return (
    <div
      id="site-menu"
      ref={ref}
      className={`menu tone-deep2 ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="menu__grid">
        <nav className="menu__nav" aria-label="Menu">
          <ol>
            {NAV.map((item, i) => (
              <li key={item.to} style={{ '--i': i } as React.CSSProperties}>
                <TLink
                  to={item.to}
                  className={`menu__link ${pathname.startsWith(item.to) ? 'is-active' : ''}`}
                  onMouseEnter={() => setPreview(i)}
                  onFocus={() => setPreview(i)}
                  onClick={onClose}
                >
                  <span className="menu__idx t-label">0{i + 1}</span>
                  <span className="menu__label">{item.label}</span>
                  <span className="menu__blurb t-label">{item.blurb}</span>
                </TLink>
              </li>
            ))}
          </ol>
          <TLink to="/join" className="btn btn--signal menu__apply" onClick={onClose}>
            <span>Apply for membership</span>
            <Arrow />
          </TLink>
        </nav>

        <div className="menu__preview" aria-hidden="true">
          {NAV.map((item, i) => (
            <div key={item.to} className={`menu__shot ${preview === i ? 'is-active' : ''}`}>
              <Img name={item.image} alt="" sizes="40vw" />
            </div>
          ))}
        </div>

        <div className="menu__foot">
          <OpenStatus withLoad />
          <address>
            {BRAND.address.join(', ')}
          </address>
          <div className="menu__contact">
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
  );
}
