import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { Footer } from './components/Footer';
import { IntroProvider, Loader, shouldPlayIntro } from './components/Loader';
import { Nav } from './components/Nav';
import { ToastProvider } from './components/Toast';
import { TransitionProvider } from './components/Transition';
import { BookingProvider } from './state/bookings';

const pages = {
  home: () => import('./pages/Home'),
  house: () => import('./pages/House'),
  training: () => import('./pages/Training'),
  timetable: () => import('./pages/Timetable'),
  membership: () => import('./pages/Membership'),
  visit: () => import('./pages/Visit'),
  join: () => import('./pages/Join'),
  notFound: () => import('./pages/NotFound'),
};

const Home = lazy(pages.home);
const House = lazy(pages.house);
const Training = lazy(pages.training);
const Timetable = lazy(pages.timetable);
const Membership = lazy(pages.membership);
const Visit = lazy(pages.visit);
const Join = lazy(pages.join);
const NotFound = lazy(pages.notFound);

function Shell() {
  const [playIntro] = useState(shouldPlayIntro);
  const [introDone, setIntroDone] = useState(!playIntro);
  const location = useLocation();

  // Warm every route chunk once the first page is idle so transitions never wait on the network.
  useEffect(() => {
    const warm = () => Object.values(pages).forEach((load) => load());
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = ric(warm);
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, []);

  return (
    <IntroProvider value={introDone}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {playIntro && <Loader onDone={() => setIntroDone(true)} />}
      <Nav />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--ink)' }} />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/house" element={<House />} />
            <Route path="/training" element={<Training />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/join" element={<Join />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </IntroProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <BookingProvider>
          <TransitionProvider>
            <Shell />
          </TransitionProvider>
        </BookingProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
