import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useBodyLock } from '../lib/hooks';
import './loader.css';

const IntroCtx = createContext(true);
export const useIntro = () => useContext(IntroCtx);
export const IntroProvider = IntroCtx.Provider;

const KEY = 'basalt.intro';

export function shouldPlayIntro() {
  try {
    return sessionStorage.getItem(KEY) !== '1' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * First-visit loader: molten rock cooling from 1,200°C to room temperature
 * while the three columns of the mark set.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [temp, setTemp] = useState(1200);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;
  useBodyLock(!gone);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      setTemp(Math.round(1200 - (1200 - 21) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem(KEY, '1');
        } catch {
          /* storage unavailable: intro simply replays */
        }
        window.setTimeout(() => {
          setOut(true);
          done.current();
          window.setTimeout(() => setGone(true), 900);
        }, 180);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  const glow = Math.max(0, (temp - 21) / 1179);
  return (
    <div className={`loader ${out ? 'is-out' : ''}`} role="status" aria-label="Loading BASALT">
      <div className="loader__core">
        <div className="loader__cols" aria-hidden="true">
          <span style={{ '--h': '62%', '--d': '0ms' } as React.CSSProperties} />
          <span style={{ '--h': '100%', '--d': '120ms' } as React.CSSProperties} />
          <span style={{ '--h': '48%', '--d': '240ms' } as React.CSSProperties} />
        </div>
        <div className="loader__meta t-label" aria-hidden="true">
          <span>Cooling</span>
          <span className="loader__temp" style={{ color: `color-mix(in oklab, var(--signal) ${Math.round(glow * 100)}%, var(--light))` }}>
            {temp.toLocaleString('en-GB')}°C
          </span>
        </div>
      </div>
      <div className="loader__foot t-label" aria-hidden="true">
        <span>Basalt — Athletic House</span>
        <span>Kings Cross, London</span>
      </div>
    </div>
  );
}
