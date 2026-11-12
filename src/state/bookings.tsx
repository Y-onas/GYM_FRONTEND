import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type BookingState = 'booked' | 'waitlist';
type Ctx = {
  bookings: Record<string, BookingState>;
  book: (id: string, state: BookingState) => void;
  cancel: (id: string) => void;
};

const KEY = 'basalt.bookings.v1';
const BookingCtx = createContext<Ctx>({ bookings: {}, book: () => {}, cancel: () => {} });
export const useBookings = () => useContext(BookingCtx);

function load(): Record<string, BookingState> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(bookings));
    } catch {
      /* private mode: bookings last for the session only */
    }
  }, [bookings]);

  const book = useCallback((id: string, state: BookingState) => setBookings((b) => ({ ...b, [id]: state })), []);
  const cancel = useCallback(
    (id: string) =>
      setBookings((b) => {
        const next = { ...b };
        delete next[id];
        return next;
      }),
    [],
  );
  const value = useMemo(() => ({ bookings, book, cancel }), [bookings, book, cancel]);
  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}
