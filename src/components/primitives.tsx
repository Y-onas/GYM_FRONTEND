import { createElement, Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { imageSet, type ImageName } from '../lib/images';
import { useInView } from '../lib/hooks';
import { useClubStatus } from '../lib/hooks';
import { TLink } from './Transition';
import './primitives.css';

/* ---------- Img ---------- */
type ImgProps = {
  name: ImageName;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  focal?: string;
  style?: CSSProperties;
};

export function Img({ name, alt, sizes = '100vw', priority, className = '', focal, style }: ImgProps) {
  const { src, srcSet, width, height } = imageSet(name);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    setLoaded(Boolean(ref.current?.complete && ref.current.naturalWidth));
  }, [name]);
  return (
    <img
      ref={ref}
      className={`img ${loaded ? 'is-loaded' : ''} ${className}`}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onLoad={() => setLoaded(true)}
      style={{ objectPosition: focal, ...style }}
    />
  );
}

/** Image that settles from a slight zoom as it scrolls into view. */
export function MaskImg({ className = '', ...img }: ImgProps & { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div ref={ref} className={`img-mask ${inView ? 'is-in' : ''} ${className}`}>
      <Img {...img} />
    </div>
  );
}

/* ---------- Reveal ---------- */
type RevealProps = { as?: ElementType; className?: string; delay?: number; children?: ReactNode; style?: CSSProperties; id?: string };

export function Reveal({ as = 'div', className = '', delay = 0, children, style, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();
  return createElement(
    as,
    { ref, className: `reveal ${inView ? 'is-in' : ''} ${className}`, style: { '--d': `${delay}ms`, ...style }, ...rest },
    children,
  );
}

/**
 * Word-by-word masked rise. `*word*` renders italic serif; `|` forces a line break.
 */
export function RevealText({ as = 'h2', text, className = '', delay = 0, id, trigger }: { as?: ElementType; text: string; className?: string; delay?: number; id?: string; trigger?: boolean }) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 });
  const active = trigger ?? inView;
  let i = 0;
  let inItalic = false;
  const lines = text.split('|');
  return createElement(
    as,
    { ref, id, className: `rt ${active ? 'is-in' : ''} ${className}`, style: { '--d': `${delay}ms` }, 'aria-label': text.replace(/[*|]/g, '').replace(/\s+/g, ' ').trim() },
    lines.map((line, li) => (
      <span key={li} aria-hidden="true">
        {line
          .trim()
          .split(/\s+/)
          .map((word, wi) => {
            if (word.startsWith('*') || word.startsWith('“*')) inItalic = true;
            const italic = inItalic;
            if (/\*[.,!?”]?$/.test(word)) inItalic = false;
            const clean = word.replace(/\*/g, '');
            const idx = i++;
            const last = wi === line.trim().split(/\s+/).length - 1;
            return (
              <Fragment key={wi}>
              <span className="rt__w">
                <span className="rt__i" style={{ '--i': idx } as CSSProperties}>
                  {italic ? <em>{clean}</em> : clean}
                </span>
              </span>
              {last ? '' : ' '}
              </Fragment>
            );
          })}
        {li < lines.length - 1 && <br />}
      </span>
    )),
  );
}

/* ---------- icons ---------- */
export function Arrow({ className = 'btn__arrow', dir = 'right' }: { className?: string; dir?: 'right' | 'down' | 'up' | 'left' | 'ne' }) {
  const rot = { right: 0, down: 90, left: 180, up: -90, ne: -45 }[dir];
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" style={{ rotate: `${rot}deg` }}>
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

/** Three basalt columns: the house mark. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 22 22" aria-hidden="true">
      <rect className="mark__c mark__c--1" x="1" y="6" width="5.5" height="16" />
      <rect className="mark__c mark__c--2" x="8.25" y="1" width="5.5" height="21" />
      <rect className="mark__c mark__c--3" x="15.5" y="9" width="5.5" height="13" />
      <rect className="mark__heat" x="15.5" y="5.5" width="5.5" height="2" />
    </svg>
  );
}

/* ---------- buttons ---------- */
type BtnProps = { to: string; children: ReactNode; variant?: 'solid' | 'sulfur' | 'line'; small?: boolean; className?: string; arrow?: boolean };

export function ButtonLink({ to, children, variant = 'line', small, className = '', arrow = true }: BtnProps) {
  return (
    <TLink to={to} className={`btn ${variant !== 'line' ? `btn--${variant}` : ''} ${small ? 'btn--small' : ''} ${className}`}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </TLink>
  );
}

/* ---------- FitText: scales a single line to fill its container ---------- */
export function FitText({ children, className = '', as = 'div', label }: { children: ReactNode; className?: string; as?: ElementType; label?: string }) {
  const outer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const o = outer.current;
    const n = inner.current;
    if (!o || !n) return;
    const fit = () => {
      n.style.fontSize = '100px';
      const w = n.getBoundingClientRect().width;
      const cs = getComputedStyle(o);
      const target = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (w > 0) n.style.fontSize = `${(100 * target) / w}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  return createElement(
    as,
    { ref: outer, className: `fit ${className}`, 'aria-label': label },
    <span ref={inner} className="fit__in" aria-hidden={label ? true : undefined}>
      {children}
    </span>,
  );
}

/* ---------- Odometer ---------- */
export function Odometer({ value, prefix = '', className = '' }: { value: number; prefix?: string; className?: string }) {
  const digits = String(value).split('');
  return (
    <span className={`odo ${className}`} aria-label={`${prefix}${value}`} role="text">
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {digits.map((d, i) => (
        <span className="odo__col" key={`${digits.length}-${i}`} aria-hidden="true">
          <span className="odo__strip" style={{ transform: `translateY(${-Number(d) * 10}%)`, transitionDelay: `${i * 60}ms` }}>
            {'0123456789'.split('').map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ---------- live club status ---------- */
export function OpenStatus({ withLoad = false, className = '' }: { withLoad?: boolean; className?: string }) {
  const s = useClubStatus();
  return (
    <span className={`status ${s.open ? 'is-open' : ''} ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      <span>
        {s.text} <span className="status__detail">· {s.detail}</span>
        {withLoad && s.open && <span className="status__detail"> · floor {s.occupancy}% full</span>}
      </span>
    </span>
  );
}

export function SectionHead({ idx, label, className = '' }: { idx: string; label: string; className?: string }) {
  return (
    <Reveal className={`eyebrow ${className}`}>
      <span className="eyebrow__idx">{idx}</span>
      <span>{label}</span>
    </Reveal>
  );
}

export function PillarTag({ pillar }: { pillar: 'pressure' | 'heat' | 'time' }) {
  return <span className={`tag tag--${pillar}`}>{pillar}</span>;
}
