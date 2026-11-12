import { createContext, useContext, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useBodyLock } from '../lib/hooks';
import { BRAND } from '../data/brand';
import { Mark } from './primitives';
import './loader.css';

const IntroCtx = createContext(true);
export const useIntro = () => useContext(IntroCtx);
export const IntroProvider = IntroCtx.Provider;

const KEY = 'valiant.intro.v2';

export function shouldPlayIntro() {
  try {
    return sessionStorage.getItem(KEY) !== '1' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** First-visit intro: the Valiant mark fills with molten gold, then cools and sets. */
export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;
  useBodyLock(!gone);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 1800;
    let raf = 0;
    let exitTimer: number | undefined;
    let removeTimer: number | undefined;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      const eased = p * p * (3 - 2 * p);
      setProgress(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem(KEY, '1');
        } catch {
          /* storage unavailable: intro simply replays */
        }
        exitTimer = window.setTimeout(() => {
          setOut(true);
          done.current();
          removeTimer = window.setTimeout(() => setGone(true), 900);
        }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (gone) return null;
  return (
    <div className={`loader tone-hero ${out ? 'is-out' : ''}`} role="status" aria-label="Loading Valiant Fitness">
      <div className="loader__core">
        <div
          className="loader__forge"
          aria-hidden="true"
          style={{ '--unfilled': `${(1 - progress) * 100}%`, '--heat': 1 - progress } as CSSProperties}
        >
          <Mark className="loader__outline" />
          <div className="loader__fill"><Mark /></div>
        </div>
        <p className="loader__name">{BRAND.name}</p>
      </div>
      <div className="loader__foot t-label" aria-hidden="true">
        <span>{BRAND.name}</span>
        <span>Kings Cross, London</span>
      </div>
    </div>
  );
}
