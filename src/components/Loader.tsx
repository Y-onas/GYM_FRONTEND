import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useBodyLock } from '../lib/hooks';
import { BRAND } from '../data/brand';
import { Mark } from './primitives';
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

/** First-visit warm-up: the Valiant mark rises as training readiness reaches 100%. */
export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
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
      setProgress(Math.round(100 * eased));
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
  return (
    <div className={`loader tone-hero ${out ? 'is-out' : ''}`} role="status" aria-label="Loading Valiant Fitness">
      <div className="loader__core">
        <Mark className="loader__mark" />
        <p className="loader__name">{BRAND.name}</p>
        <div className="loader__meta t-label" aria-hidden="true">
          <span>Warming up</span>
          <span className="loader__progress">{progress}%</span>
        </div>
      </div>
      <div className="loader__foot t-label" aria-hidden="true">
        <span>{BRAND.name}</span>
        <span>Kings Cross, London</span>
      </div>
    </div>
  );
}
