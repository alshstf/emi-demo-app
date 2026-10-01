// Runtime + build-time configuration for the OIDC public client.
//
// Priority for each value:
//   1. window.__APP_CONFIG__[KEY]  — injected at container start (Docker)
//   2. import.meta.env.VITE_OIDC_* — local dev via .env
//   3. sensible default
//
// This lets the SAME Docker image be reconfigured per environment purely via
// environment variables, while local dev keeps working without a container.

export interface AppConfig {
  authority: string;
  client_id: string;
  /** Optional confidential-client secret (demo-only: it is exposed in the browser). */
  client_secret: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  scope: string;
  /** Flat roles claim name (fallback). */
  roles_claim: string;
  /** Dot-path to the roles claim; `{client_id}` is substituted with the client_id. */
  roles_claim_path: string;
  /** Route the OIDC back-channel through a same-origin reverse proxy to avoid CORS. */
  proxy: boolean;
  /** Whether to call the userinfo endpoint after login (extra cross-origin XHR). */
  load_user_info: boolean;

  // ── Skin / theme ──────────────────────────────────────────────────────────
  /** `burger` | `gis` | `gocloud` pin the skin for the deployment; `auto` (or empty) enables host/query rules (default skin: `gocloud`). */
  theme: string;
  /** `host=theme` rules (`,`/`;`-separated), e.g. `gis.demo.ru=gis,*.burger.demo.ru=burger`. */
  theme_hosts: string;
  /** Allow `?theme=…` (persisted in localStorage) when the theme is not pinned. Dev only. */
  theme_switch: boolean;

  // ── «Типовая ГИС» branding (gis skin only) ────────────────────────────────
  /** Short system name shown in the header, e.g. «ГИС Реестр». */
  gis_name: string;
  /** Full official name shown on the landing page and in the footer. */
  gis_full_name: string;
  /** Operator (owner) of the system, shown in the footer. */
  gis_operator: string;

  // ── Conference branding (gocloud skin only) ───────────────────────────────
  /** Event name shown in the header, on the badge and in the browser tab, e.g. «GoCloud Tech 2026». */
  event_name: string;
  /** Event date as free text, e.g. «15 октября 2026». */
  event_date: string;
  /** Venue as free text. */
  event_place: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: Record<string, string | undefined>;
  }
}

/** Returns the runtime value if it is set and not a leftover `${PLACEHOLDER}`. */
function runtime(key: string): string | undefined {
  const value = typeof window !== 'undefined' ? window.__APP_CONFIG__?.[key] : undefined;
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('${') || trimmed.startsWith('<')) return undefined;
  return trimmed;
}

function resolve(key: string, viteValue: string | undefined, fallback: string): string {
  return runtime(key) ?? (viteValue && viteValue.trim()) ?? fallback;
}

function resolveBool(key: string, viteValue: string | undefined, fallback: boolean): boolean {
  const raw = (runtime(key) ?? viteValue ?? '').trim().toLowerCase();
  if (raw === '') return fallback;
  return raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on';
}

const origin = typeof window !== 'undefined' ? window.location.origin : '';

export const config: AppConfig = {
  authority: resolve('OIDC_AUTHORITY', import.meta.env.VITE_OIDC_AUTHORITY, ''),
  client_id: resolve('OIDC_CLIENT_ID', import.meta.env.VITE_OIDC_CLIENT_ID, ''),
  client_secret: resolve('OIDC_CLIENT_SECRET', import.meta.env.VITE_OIDC_CLIENT_SECRET, ''),
  redirect_uri: resolve('OIDC_REDIRECT_URI', import.meta.env.VITE_OIDC_REDIRECT_URI, `${origin}/callback`),
  post_logout_redirect_uri: resolve(
    'OIDC_POST_LOGOUT_REDIRECT_URI',
    import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI,
    `${origin}/`,
  ),
  scope: resolve('OIDC_SCOPE', import.meta.env.VITE_OIDC_SCOPE, 'openid profile'),
  roles_claim: resolve('OIDC_ROLES_CLAIM', import.meta.env.VITE_OIDC_ROLES_CLAIM, 'roles'),
  roles_claim_path: resolve(
    'OIDC_ROLES_CLAIM_PATH',
    import.meta.env.VITE_OIDC_ROLES_CLAIM_PATH,
    'resource_access.%%OIDC_CLIENT_ID%%.roles',
  ),
  proxy: resolveBool('OIDC_PROXY', import.meta.env.VITE_OIDC_PROXY, false),
  load_user_info: resolveBool('OIDC_LOAD_USERINFO', import.meta.env.VITE_OIDC_LOAD_USERINFO, false),

  theme: resolve('APP_THEME', import.meta.env.VITE_APP_THEME, 'auto'),
  theme_hosts: resolve('APP_THEME_HOSTS', import.meta.env.VITE_APP_THEME_HOSTS, ''),
  theme_switch: resolveBool('APP_THEME_SWITCH', import.meta.env.VITE_APP_THEME_SWITCH, false),

  gis_name: resolve('GIS_NAME', import.meta.env.VITE_GIS_NAME, 'Типовая ГИС'),
  gis_full_name: resolve(
    'GIS_FULL_NAME',
    import.meta.env.VITE_GIS_FULL_NAME,
    'Типовая государственная информационная система учёта и обработки заявлений',
  ),
  gis_operator: resolve('GIS_OPERATOR', import.meta.env.VITE_GIS_OPERATOR, 'Уполномоченный орган — оператор системы'),

  event_name: resolve('EVENT_NAME', import.meta.env.VITE_EVENT_NAME, 'GoCloud Tech 2026'),
  event_date: resolve('EVENT_DATE', import.meta.env.VITE_EVENT_DATE, '15 октября 2026'),
  event_place: resolve('EVENT_PLACE', import.meta.env.VITE_EVENT_PLACE, 'Москва, ДК завода «Серп и Молот»'),
};

/** True when the optional confidential-client mode is active (client_secret provided). */
export const isConfidential = Boolean(config.client_secret);

/** The app cannot start the OIDC flow without at least an issuer and a client_id. */
export const isConfigured = Boolean(config.authority && config.client_id);
