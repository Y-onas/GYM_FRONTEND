import type { ReactNode } from 'react';
import type { ImageName } from '../lib/images';
import { useScrollProgress } from '../lib/hooks';
import { Img, Reveal, RevealText } from './primitives';
import './page-hero.css';

/** Shared opening for inner pages: index, headline, lede and an optional photograph. */
export function PageHero({
  idx,
  label,
  title,
  lede,
  image,
  imageAlt = '',
  meta,
  children,
}: {
  idx: string;
  label: string;
  title: string;
  lede: string;
  image?: ImageName;
  imageAlt?: string;
  meta?: { k: string; v: string }[];
  children?: ReactNode;
}) {
  const ref = useScrollProgress<HTMLElement>('--p', 'exit');
  return (
    <header ref={ref} className={`phero tone-hero ${image ? 'phero--img' : ''}`}>
      {image && (
        <div className="phero__media">
          <Img name={image} alt={imageAlt} priority sizes="100vw" />
        </div>
      )}
      <div className="phero__in wrap">
        <Reveal className="phero__top t-label">
          <span>
            <span className="phero__idx">{idx}</span> {label}
          </span>
          <span className="phero__crumb">Basalt / {label}</span>
        </Reveal>
        <RevealText as="h1" className="phero__title t-h1" text={title} delay={120} />
        <div className="phero__foot">
          <Reveal as="p" className="t-lede phero__lede" delay={360}>
            {lede}
          </Reveal>
          {meta && (
            <Reveal as="dl" className="phero__meta" delay={480}>
              {meta.map((m) => (
                <div key={m.k}>
                  <dt className="t-label t-label--muted">{m.k}</dt>
                  <dd>{m.v}</dd>
                </div>
              ))}
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}

/** Closing call-to-action band shared by inner pages. */
export function CtaBand({ title, children, theme = 'tone-accent' }: { title: string; children: ReactNode; theme?: string }) {
  return (
    <section className={`ctaband ${theme}`}>
      <div className="wrap ctaband__in">
        <RevealText className="t-h2" text={title} />
        <Reveal className="ctaband__actions" delay={200}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
