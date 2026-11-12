import { useEffect, useRef, useState } from 'react';
import { COACHES } from '../data/coaches';
import { useMediaQuery } from '../lib/hooks';
import { Arrow, Img, PillarTag, Reveal } from './primitives';
import { TLink } from './Transition';
import './coach-index.css';

/** Typographic coach list; on pointer devices the portrait trails the cursor. */
export function CoachIndex() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const wrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!fine) return;
    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.14;
      pos.current.y += (target.current.y - pos.current.y) * 0.14;
      const el = floatRef.current;
      if (el) {
        const vx = target.current.x - pos.current.x;
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotate(${Math.max(-8, Math.min(8, vx * 0.05))}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fine]);

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div className="cidx" ref={wrapRef} onMouseMove={fine ? onMove : undefined} onMouseLeave={() => setActive(null)}>
      <ul className="cidx__list">
        {COACHES.map((c, i) => (
          <Reveal as="li" key={c.id} delay={i * 60} className={`cidx__row ${active === i ? 'is-active' : ''} ${active !== null && active !== i ? 'is-dim' : ''}`}>
            <TLink
              to={`/training?coach=${c.id}#coaches`}
              className="cidx__link"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className="cidx__thumb" aria-hidden="true">
                <Img name={c.image} alt="" sizes="80px" focal={c.focal} />
              </span>
              <span className="cidx__n t-label">0{i + 1}</span>
              <span className="cidx__name">{c.name}</span>
              <span className="cidx__role">{c.role}</span>
              <span className="cidx__meta">
                <PillarTag pillar={c.pillar} />
                <span className="t-label t-label--muted">{c.years} yrs</span>
              </span>
              <Arrow className="cidx__arrow" />
            </TLink>
          </Reveal>
        ))}
      </ul>
      {fine && (
          <div ref={floatRef} className={`cidx__float ${active !== null ? 'is-on' : ''}`} aria-hidden="true">
            {COACHES.map((c, i) => (
              <div key={c.id} className={`cidx__frame ${active === i ? 'is-active' : ''}`}>
                <Img name={c.image} alt="" sizes="300px" focal={c.focal} />
              </div>
            ))}
            <span className="cidx__quote">{active !== null ? `“${COACHES[active].quote}”` : ''}</span>
        </div>
      )}
    </div>
  );
}
