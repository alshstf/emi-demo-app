import { config } from '../config';
import type { ThemeId } from './types';

export type ThemeSource = 'env' | 'host' | 'query' | 'storage' | 'default';

export interface ResolvedTheme {
  id: ThemeId;
  source: ThemeSource;
  /** True when APP_THEME pins the theme and no runtime override is possible. */
  locked: boolean;
}

const THEME_IDS: ThemeId[] = ['burger', 'gis'];
const STORAGE_KEY = 'emi_demo_theme';
export const DEFAULT_THEME: ThemeId = 'burger';

function asThemeId(value: string | null | undefined): ThemeId | undefined {
  const v = (value ?? '').trim().toLowerCase();
  return (THEME_IDS as string[]).includes(v) ? (v as ThemeId) : undefined;
}

/**
 * Parse APP_THEME_HOSTS: `host=theme` pairs separated by `,` or `;`.
 * A host may start with `*.` to match any subdomain, e.g. `*.gis.example.ru=gis`.
 */
function themeForHost(rules: string, hostname: string): ThemeId | undefined {
  const host = hostname.toLowerCase();
  for (const raw of rules.split(/[,;]/)) {
    const [pattern, value] = raw.split('=').map((s) => s.trim().toLowerCase());
    const theme = asThemeId(value);
    if (!pattern || !theme) continue;
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(1); // ".gis.example.ru"
      if (host.endsWith(suffix) || host === pattern.slice(2)) return theme;
    } else if (host === pattern) {
      return theme;
    }
  }
  return undefined;
}

/**
 * Decide which skin to render. Resolution order:
 *   1. APP_THEME = burger | gis      → pinned for the whole deployment (no override)
 *   2. APP_THEME_HOSTS               → by the hostname the app is opened on
 *   3. ?theme=… / localStorage       → only when APP_THEME_SWITCH=true (dev / mixed stands)
 *   4. default (burger)
 *
 * Runs synchronously at startup so every screen (incl. splash and error pages)
 * is rendered in the right skin from the first frame.
 */
export function resolveTheme(): ResolvedTheme {
  const pinned = asThemeId(config.theme);
  if (pinned) return { id: pinned, source: 'env', locked: true };

  const mode = config.theme.trim().toLowerCase();
  if (mode && mode !== 'auto') {
    console.warn(`[theme] unknown APP_THEME="${config.theme}", falling back to auto`);
  }

  if (typeof window !== 'undefined') {
    if (config.theme_hosts) {
      const byHost = themeForHost(config.theme_hosts, window.location.hostname);
      if (byHost) return { id: byHost, source: 'host', locked: false };
    }

    if (config.theme_switch) {
      const fromQuery = asThemeId(new URLSearchParams(window.location.search).get('theme'));
      if (fromQuery) {
        try {
          localStorage.setItem(STORAGE_KEY, fromQuery);
        } catch {
          /* ignore */
        }
        return { id: fromQuery, source: 'query', locked: false };
      }
      try {
        const stored = asThemeId(localStorage.getItem(STORAGE_KEY));
        if (stored) return { id: stored, source: 'storage', locked: false };
      } catch {
        /* ignore */
      }
    }
  }

  return { id: DEFAULT_THEME, source: 'default', locked: false };
}
