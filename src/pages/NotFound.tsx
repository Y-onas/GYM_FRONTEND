import { ButtonLink, FitText, Reveal } from '../components/primitives';
import { usePageMeta } from '../lib/hooks';

export default function NotFound() {
  usePageMeta('Not found');
  return (
    <div className="page tone-dark" style={{ minHeight: '100vh', display: 'grid', alignContent: 'end', paddingTop: 'calc(var(--nav-h) + 48px)' }}>
      <div className="wrap" style={{ display: 'grid', gap: 28, paddingBottom: 48 }}>
        <p className="t-label t-label--muted">Error 404 · Level unknown</p>
        <h1 className="t-h1" style={{ maxWidth: '14ch' }}>
          This room was <em style={{ color: 'var(--signal)' }}>never built.</em>
        </h1>
        <Reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <ButtonLink to="/" variant="sulfur">
            Back to the house
          </ButtonLink>
          <ButtonLink to="/timetable">Today’s classes</ButtonLink>
        </Reveal>
      </div>
      <FitText className="t-wide" label="404">
        <span style={{ color: 'var(--dark-3)', lineHeight: 0.74, display: 'block', paddingInline: 'calc(var(--pad) * 0.5)' }}>404</span>
      </FitText>
    </div>
  );
}
