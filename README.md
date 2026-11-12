# BASALT — Athletic House

Marketing site and membership experience for BASALT, a fictional members' training house in a converted 1871 ironworks in Kings Cross, London.

## Stack

- React 19 + TypeScript, Vite 8, React Router 8
- No UI or animation libraries: motion is CSS plus small hooks (`IntersectionObserver`, `requestAnimationFrame`)
- Self-hosted fonts via Fontsource: Archivo (variable width axis), Instrument Serif, IBM Plex Mono
- Photography in `public/img` is graded to one warm-monochrome house look and served as responsive WebP

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
```

The app is a single-page app with client-side routes (`/house`, `/training`, `/timetable`, `/membership`, `/visit`, `/join`). Hosts must rewrite unknown paths to `index.html`.

## Structure

```
src/
  data/        content model: brand, floors & equipment, coaches, programmes, classes, plans
  lib/         London-time logic, hooks, image registry, .ics export
  state/       class bookings (persisted to localStorage)
  components/  primitives, page transition, loader, nav/menu, footer, dialog, toast,
               building cross-section, coach index, billing toggle, page hero
  pages/       one module (and stylesheet) per route, lazy-loaded
```

## Notes

- Opening hours, "open now", floor occupancy and the timetable all run on Europe/London time.
- Bookings, the application draft and form submissions are client-side only; there is no backend.
- Photography: Unsplash (Unsplash License), regraded for this project.
