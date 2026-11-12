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
  const [dark, light, signal] = [v('--dark'), v('--light'), v('--signal')];
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${dark}"/><g fill="${light}"><rect x="7" y="11" width="5" height="14"/><rect x="13.5" y="7" width="5" height="18"/><rect x="20" y="14" width="5" height="11"/></g><rect x="20" y="11" width="5" height="2" fill="${signal}"/></svg>`;
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (icon) icon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setState] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    syncChrome();
  }, [theme]);

  const setTheme = useCallback(
    (id: ThemeId, origin?: Origin) => {
      if (id === theme) return;
      const apply = () => {
        flushSync(() => setState(id));
        root().dataset.theme = id;
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
