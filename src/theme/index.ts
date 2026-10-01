import { burgerTheme } from '../themes/burger';
import { gisTheme } from '../themes/gis';
import { gocloudTheme } from '../themes/gocloud';
import { resolveTheme, type ResolvedTheme } from './resolve';
import type { Theme, ThemeId } from './types';

export type { Theme, ThemeId, AuthErrorProps } from './types';

const THEMES: Record<ThemeId, Theme> = { burger: burgerTheme, gis: gisTheme, gocloud: gocloudTheme };

/** Resolved once at startup — the skin never changes while the app is open. */
export const resolved: ResolvedTheme = resolveTheme();
export const theme: Theme = THEMES[resolved.id];

/** Apply document-level bits of the skin: title, favicon, fonts, `html[data-theme]`. */
export function applyThemeMeta() {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme.id;
  document.title = theme.meta.title;

  const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (desc) desc.content = theme.meta.description;

  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (icon) icon.href = theme.meta.favicon;

  for (const href of theme.meta.fontLinks ?? []) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  console.info(`[theme] ${theme.id} (source: ${resolved.source}${resolved.locked ? ', locked' : ''})`);
}
