/** Brand identities. Colours and type live in src/styles/themes.css; layouts in skins.css. */
export const THEMES = [
  { id: 'basalt', name: 'Basalt', concept: 'Volcanic editorial · ink, limestone, sulfur' },
  { id: 'atelier', name: 'Atelier', concept: 'Refined luxury · espresso, cream, bronze' },
  { id: 'grove', name: 'Grove', concept: 'Natural strength · oat, sage, forest' },
  { id: 'pulse', name: 'Pulse', concept: 'Athletic energy · cobalt, signal orange' },
  { id: 'velvet', name: 'Velvet', concept: 'Members’ club · oxblood, blush, cream' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];
export const DEFAULT_THEME: ThemeId = 'basalt';
export const isThemeId = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);
