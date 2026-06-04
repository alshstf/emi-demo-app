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
  redirect_uri: string;
  post_logout_redirect_uri: string;
  scope: string;
  roles_claim: string;
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

const origin = typeof window !== 'undefined' ? window.location.origin : '';

export const config: AppConfig = {
  authority: resolve('OIDC_AUTHORITY', import.meta.env.VITE_OIDC_AUTHORITY, ''),
  client_id: resolve('OIDC_CLIENT_ID', import.meta.env.VITE_OIDC_CLIENT_ID, ''),
  redirect_uri: resolve('OIDC_REDIRECT_URI', import.meta.env.VITE_OIDC_REDIRECT_URI, `${origin}/callback`),
  post_logout_redirect_uri: resolve(
    'OIDC_POST_LOGOUT_REDIRECT_URI',
    import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI,
    `${origin}/`,
  ),
  scope: resolve('OIDC_SCOPE', import.meta.env.VITE_OIDC_SCOPE, 'openid profile'),
  roles_claim: resolve('OIDC_ROLES_CLAIM', import.meta.env.VITE_OIDC_ROLES_CLAIM, 'roles'),
};

/** The app cannot start the OIDC flow without at least an issuer and a client_id. */
export const isConfigured = Boolean(config.authority && config.client_id);
