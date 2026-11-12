import type { Billing } from '../data/plans';
import './billing.css';

export function BillingToggle({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  const opts: Billing[] = ['monthly', 'annual'];
  return (
    <div
      className="billing"
      role="radiogroup"
      aria-label="Billing period"
      onKeyDown={(e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          const next = value === 'monthly' ? 'annual' : 'monthly';
          onChange(next);
          (e.currentTarget.querySelector(`[data-v="${next}"]`) as HTMLElement | null)?.focus();
        }
      }}
    >
      {opts.map((b) => (
        <button
          key={b}
          type="button"
          role="radio"
          data-v={b}
          aria-checked={value === b}
          tabIndex={value === b ? 0 : -1}
          className="billing__opt"
          onClick={() => onChange(b)}
        >
          {b === 'monthly' ? 'Monthly' : 'Annual'}
          {b === 'annual' && <span className="billing__save">2 months free</span>}
        </button>
      ))}
      <span className="billing__thumb" data-pos={value} aria-hidden="true" />
    </div>
  );
}
