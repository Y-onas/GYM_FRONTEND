import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { THEMES, type ThemeId } from '../data/themes';
import { useTheme } from '../state/theme';
import './theme-switcher.css';

/** Five miniature identity chips. Each chip renders its own palette via a local data-theme. */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [flash, setFlash] = useState<ThemeId | null>(null);
  const [announce, setAnnounce] = useState('');
  const timer = useRef(0);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (id: ThemeId, el: HTMLElement) => {
    if (id === theme) return;
    const r = el.getBoundingClientRect();
    setTheme(id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    const t = THEMES.find((x) => x.id === id)!;
    setAnnounce(`Colour theme: ${t.name}`);
    // Name stays visible briefly after a tap, since touch has no hover tooltip.
    setFlash(id);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(null), 1600);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + THEMES.length) % THEMES.length;
    const btn = groupRef.current?.querySelectorAll<HTMLButtonElement>('.swatch')[next];
    btn?.focus();
    if (btn) choose(THEMES[next].id, btn);
  };

  return (
    <div ref={groupRef} className="swatches" role="radiogroup" aria-label="Brand colour theme">
      {THEMES.map((t, i) => {
        const active = t.id === theme;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${t.name} — ${t.concept}`}
            tabIndex={active ? 0 : -1}
            className={`swatch ${flash === t.id ? 'is-flash' : ''}`}
            onClick={(e) => choose(t.id, e.currentTarget)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="swatch__chip" data-theme={t.id} aria-hidden="true">
              <i className="swatch__dark" />
              <i className="swatch__signal" />
              <i className="swatch__light" />
            </span>
            <span className="swatch__tip" aria-hidden="true">
              <span className="swatch__n">0{i + 1}</span>
              <span className="swatch__name">{t.name}</span>
              <span className="swatch__concept">{t.concept}</span>
            </span>
          </button>
        );
      })}
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}
