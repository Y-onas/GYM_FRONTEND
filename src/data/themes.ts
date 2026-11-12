/** Brand identities. Colours live only in src/styles/themes.css; this is naming and copy. */
export const THEMES = [
  { id: 'basalt', name: 'Basalt', concept: 'Volcanic · ink, limestone, sulfur' },
  { id: 'atelier', name: 'Atelier', concept: 'Refined luxury · midnight, ivory, champagne' },
  { id: 'grove', name: 'Grove', concept: 'Natural strength · moss, oat, terracotta' },
  { id: 'concrete', name: 'Concrete', concept: 'Architectural · grey, plaster, safety orange' },
  { id: 'volt', name: 'Volt', concept: 'Futurist · ultramarine, chalk, volt lime' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];
export const DEFAULT_THEME: ThemeId = 'basalt';
export const isThemeId = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);
