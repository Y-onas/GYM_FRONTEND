import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { DEFAULT_THEME, isThemeId, type ThemeId } from '../data/themes';

type Origin = { x: number; y: number };
type Ctx = { theme: ThemeId; setTheme: (id: ThemeId, origin?: Origin) => void };

const KEY = 'basalt.theme';
const ThemeCtx = createContext<Ctx>({ theme: DEFAULT_THEME, setTheme: () => {} });
export const useTheme = () => useContext(ThemeCtx);

const root = () => document.documentElement;

function initialTheme(): ThemeId {
  const attr = root().dataset.theme;
  return isThemeId(attr) ? attr : DEFAULT_THEME;
}

/** Browser chrome (address bar colour, favicon) follows the active tokens. */
function syncChrome() {
  const cs = getComputedStyle(root());
  const v = (name: string) => cs.getPropertyValue(name).trim();
  const [dark, signal, light] = [v('--sw-a'), v('--sw-b'), v('--sw-c')];
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${dark}"/><g fill="${light}"><rect x="7" y="11" width="5" height="14"/><rect x="13.5" y="7" width="5" height="18"/><rect x="20" y="14" width="5" height="11"/></g><rect x="20" y="11" width="5" height="2" fill="${signal}"/></svg>`;
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (icon) icon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Holds `el` at viewport offset `top` for ~0.9s; any user scroll input releases it. */
function pinScroll(el: Element, top: number) {
  const end = performance.now() + 900;
  let raf = 0;
  const release = () => {
    cancelAnimationFrame(raf);
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.removeEventListener(t, release));
  };
  const step = () => {
    const delta = el.getBoundingClientRect().top - top;
    if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, behavior: 'instant' });
    if (performance.now() < end) raf = requestAnimationFrame(step);
    else release();
  };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.addEventListener(t, release, { passive: true }));
  step();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setState] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    syncChrome();
  }, [theme]);

  // Warm the other identities' hero photographs so a switch never flashes an empty frame.
  useEffect(() => {
    const warm = () =>
      ['hero-deadlift-1400', 'hero-atelier-800', 'hero-grove-1400', 'hero-pulse-1400', 'hero-velvet-1400'].forEach((n) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = `/img/${n}.webp`;
      });
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
    const id = ric(warm);
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, []);

  const setTheme = useCallback(
    (id: ThemeId, origin?: Origin) => {
      if (id === theme) return;
      const apply = () => {
        // Themes change section spacing and load different fonts, so keep whatever
        // sits mid-screen at the same position until layout settles.
        const probe = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        const anchor = probe?.closest('section, header, footer') ?? null;
        const target = anchor?.getBoundingClientRect().top ?? 0;
        root().dataset.theme = id;
        flushSync(() => setState(id));
        if (anchor) pinScroll(anchor, target);
        try {
          localStorage.setItem(KEY, id);
        } catch {
          /* private mode: theme lasts for this page view */
        }
      };

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        apply();
        return;
      }

      if (typeof document.startViewTransition === 'function') {
        const x = origin?.x ?? window.innerWidth;
        const y = origin?.y ?? 0;
        const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        const s = root().style;
        s.setProperty('--vt-x', `${x}px`);
        s.setProperty('--vt-y', `${y}px`);
        s.setProperty('--vt-r', `${Math.ceil(r)}px`);
        document.startViewTransition(apply);
        return;
      }

      root().classList.add('is-retheming');
      apply();
      window.setTimeout(() => root().classList.remove('is-retheming'), 600);
    },
    [theme],
  );

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
