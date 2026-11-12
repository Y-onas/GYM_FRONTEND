# Valiant Fitness

Marketing site and membership experience for Valiant Fitness, a fictional members' training house in a converted 1871 ironworks in Kings Cross, London.

## Stack

- React 19 + TypeScript, Vite 8, React Router 8
- No UI or animation libraries: motion is CSS plus small hooks (`IntersectionObserver`, `requestAnimationFrame`)
- Self-hosted fonts via Fontsource: Archivo (variable width axis), Instrument Serif, Fraunces, IBM Plex Mono
- Photography in `public/img` is stored in natural colour as responsive WebP and graded per theme in CSS

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
  state/       class bookings (localStorage) and the active brand theme
  styles/      themes.css (all colour), global.css (roles + type), skins.css (per-theme layouts)
  components/  primitives, page transition, loader, nav/menu, footer, dialog, toast,
               building cross-section, coach index, billing toggle, page hero, theme switcher
  pages/       one module (and stylesheet) per route, lazy-loaded
```

## Brand identities

Five complete identities are selectable from the swatches in the top-right corner. The choice is remembered and applied before first paint.

| Theme | Direction | Character |
| --- | --- | --- |
| Valiant (default) | Signature strength | Charcoal, limestone, yellow · monochrome photography · serif + wide grotesque · sharp edges |
| Atelier | Refined luxury | Espresso, cream, bronze · warm-graded photos · arched frames · spaced small caps |
| Grove | Natural strength | Oat, sage, forest · daylight photos in organic blobs · soft serif · rounded panels |
| Pulse | Athletic energy | Cobalt, signal orange · screen-blended athlete poster · condensed heavy caps · hard shadows |
| Velvet | Members' club | Oxblood, blush, cream · rose-toned photo half-frame · heavy lowercase grotesque with serif italics · small radii |

- `src/styles/themes.css` is the only file with raw colour values. Each theme decides what every section role looks like (`tone-hero`, `tone-deep`, `tone-deep2`, `tone-base`, `tone-raised`, `tone-accent`, `tone-footer`), so one theme can be light-led and another fully dark. It also sets typography, shape, button and photo-grade tokens.
- `src/styles/global.css` maps roles to the semantic tokens components read (`--bg`, `--fg`, `--muted`, `--accent`, `--cta`, `--surface` …).
- `src/styles/skins.css` holds per-theme compositions: hero layouts, framed page heroes, plan emphasis, eyebrows, buttons and decoration.

## Notes

- Opening hours, "open now", floor occupancy and the timetable all run on Europe/London time.
- Bookings, the application draft and form submissions are client-side only; there is no backend.
- Photography: Unsplash (Unsplash License), regraded for this project.

## Logo

The Valiant Fitness mark pairs a double V with barbell-inspired shoulders. The responsive SVG is shared by the navigation, introduction and membership confirmation; `public/valiant-favicon.svg` uses the same silhouette and stays consistent across themes. `public/valiant-fitness-logo.svg` is the standalone gold-and-ivory lockup. Internal `basalt` theme IDs and storage keys are retained for existing saved preferences and bookings.
