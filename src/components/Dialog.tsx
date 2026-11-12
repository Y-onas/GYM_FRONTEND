import { useEffect, useRef, type ReactNode } from 'react';
import './dialog.css';

/** Native modal dialog: focus trap, Esc and top-layer come from the platform. */
export function Dialog({
  open,
  onClose,
  label,
  children,
  variant = 'sheet',
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  variant?: 'sheet' | 'drawer';
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.body.classList.add('is-locked');
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) document.body.classList.remove('is-locked');
  }, [open]);

  useEffect(() => () => document.body.classList.remove('is-locked'), []);

  return (
    <dialog
      ref={ref}
      className={`dialog dialog--${variant}`}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog__body">
        <button type="button" className="dialog__close" onClick={onClose}>
          <span className="t-label">Close</span>
          <svg viewBox="0 0 20 20" width="18" height="18" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        </button>
        {open && children}
      </div>
    </dialog>
  );
}
