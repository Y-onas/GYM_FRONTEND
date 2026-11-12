import { createContext, useCallback, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTE_LABELS } from '../data/brand';
import './transition.css';

type Phase = 'idle' | 'covering' | 'revealing';
type Ctx = { go: (to: string) => void; phase: Phase };

const TransitionCtx = createContext<Ctx>({ go: () => {}, phase: 'idle' });
export const useTransitionNav = () => useContext(TransitionCtx);

const COLUMNS = 7;
const COVER_MS = 640;
const REVEAL_MS = 760;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollToHash(hash: string, smooth: boolean) {
  const el = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' });
}

function focusMain() {
  const main = document.getElementById('main');
  main?.focus({ preventScroll: true });
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const go = useCallback(
    (to: string) => {
      const url = new URL(to, window.location.origin);
      const samePage = url.pathname === location.pathname && url.search === location.search;
      if (samePage) {
        if (url.hash !== location.hash) navigate(to, { replace: true });
        scrollToHash(url.hash, !reduced());
        return;
      }
      if (busy.current) return;
      if (reduced()) {
        navigate(to);
        requestAnimationFrame(() => {
          scrollToHash(url.hash, false);
          focusMain();
        });
        return;
      }
      busy.current = true;
      setLabel(ROUTE_LABELS[url.pathname] ?? 'Basalt');
      setPhase('covering');
      timers.current.push(
        window.setTimeout(() => {
          navigate(to);
          window.scrollTo({ top: 0, behavior: 'instant' });
          timers.current.push(
            window.setTimeout(() => {
              if (url.hash) scrollToHash(url.hash, false);
              setPhase('revealing');
              focusMain();
              timers.current.push(
                window.setTimeout(() => {
                  setPhase('idle');
                  busy.current = false;
                }, REVEAL_MS),
              );
            }, 120),
          );
        }, COVER_MS),
      );
    },
    [location.pathname, location.search, location.hash, navigate],
  );

  return (
    <TransitionCtx.Provider value={{ go, phase }}>
      {children}
      <div className="curtain" data-phase={phase} aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span key={i} className="curtain__col" style={{ '--i': [3, 1, 5, 0, 4, 2, 6][i] } as React.CSSProperties} />
        ))}
        <span className="curtain__label">
          <span className="curtain__idx t-label">Entering</span>
          <span className="curtain__name">{label}</span>
        </span>
      </div>
    </TransitionCtx.Provider>
  );
}

type TLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode };

/** Internal link that plays the column transition. Modified clicks fall back to the browser. */
export function TLink({ to, children, onClick, ...rest }: TLinkProps) {
  const { go } = useTransitionNav();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
