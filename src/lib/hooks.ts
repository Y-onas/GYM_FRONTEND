import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { clubNow, openStatus } from './time';

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Adds `is-in` once the element enters the viewport. */
export function useInView<T extends Element>(opts: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = opts;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView] as const;
}

/**
 * Scroll progress of an element through the viewport, 0 → 1.
 * Written to a CSS custom property to avoid React re-renders per frame.
 */
export function useScrollProgress<T extends HTMLElement>(
  prop = '--p',
  range: 'through' | 'enter' | 'exit' = 'through',
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (range === 'enter') p = (vh - r.top) / (vh * 0.9);
      else if (range === 'exit') p = -r.top / Math.max(1, r.height);
      else p = (vh - r.top) / (vh + r.height);
      el.style.setProperty(prop, Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [prop, range]);
  return ref;
}

export function useClubStatus() {
  const [status, setStatus] = useState(() => openStatus());
  useEffect(() => {
    const id = window.setInterval(() => setStatus(openStatus()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

export function useClubNow() {
  const [now, setNow] = useState(() => clubNow());
  useEffect(() => {
    const id = window.setInterval(() => setNow(clubNow()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — Valiant Fitness` : 'Valiant Fitness, Kings Cross';
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}

let lockCount = 0;
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount++;
    document.body.classList.add('is-locked');
    return () => {
      lockCount--;
      if (lockCount === 0) document.body.classList.remove('is-locked');
    };
  }, [active]);
}

/** Keeps keyboard focus inside `container` while active; Esc calls onEscape. */
export function useFocusTrap(container: React.RefObject<HTMLElement | null>, active: boolean, onEscape: () => void) {
  const escRef = useRef(onEscape);
  escRef.current = onEscape;
  useEffect(() => {
    if (!active) return;
    const el = container.current;
    if (!el) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'),
      ).filter((n) => n.offsetParent !== null);
    const first = focusables()[0];
    window.setTimeout(() => (first ?? el).focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        escRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (!list.length) return;
      const a = list[0];
      const z = list[list.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [active, container]);
}
