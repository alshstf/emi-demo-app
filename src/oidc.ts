import type { AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore, type OidcMetadata } from 'oidc-client-ts';
import { config } from './config';

// Path prefix served by the optional same-origin reverse proxy (see
// docker/render-proxy.sh + nginx). The browser talks only to this origin, so
// the OIDC back-channel never triggers CORS.
const PROXY_PREFIX = '/oidc';

// Endpoints the browser reaches via XHR/fetch — these must be same-origin when
// the proxy is on. Navigational endpoints (authorize / end_session) are left
// untouched: they are top-level redirects and are not subject to CORS.
const BACK_CHANNEL_ENDPOINTS = [
  'token_endpoint',
  'userinfo_endpoint',
  'jwks_uri',
  'revocation_endpoint',
  'introspection_endpoint',
] as const;

/** Map a real IdP endpoint URL onto the same-origin reverse-proxy path. */
function toProxyUrl(realUrl: string): string {
  const u = new URL(realUrl);
  return `${window.location.origin}${PROXY_PREFIX}${u.pathname}${u.search}`;
}

/** Same-origin discovery URL: /oidc/<authority-path>/.well-known/openid-configuration */
function proxyDiscoveryUrl(): string {
  const authorityPath = new URL(config.authority).pathname.replace(/\/$/, '');
  return `${window.location.origin}${PROXY_PREFIX}${authorityPath}/.well-known/openid-configuration`;
}

/**
 * Fetch discovery through the proxy (same-origin → no CORS) and rewrite only
 * the back-channel endpoints to same-origin proxy paths.
 */
async function buildProxiedMetadata(): Promise<Partial<OidcMetadata>> {
  const res = await fetch(proxyDiscoveryUrl(), { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`OIDC discovery через прокси недоступен (${res.status} ${res.statusText}).`);
  }
  const real = (await res.json()) as Record<string, unknown>;
  const proxied: Record<string, unknown> = { ...real };
  for (const key of BACK_CHANNEL_ENDPOINTS) {
    const value = real[key];
    if (typeof value === 'string') proxied[key] = toProxyUrl(value);
  }
  return proxied as Partial<OidcMetadata>;
}

/**
 * Build the AuthProvider settings. Async because, in proxy mode, discovery is
 * fetched up front so we can hand oidc-client-ts pre-rewritten metadata.
 *
 * Authorization Code Flow + PKCE for a public client (oidc-client-ts enables
 * PKCE automatically for response_type "code"). When client_secret is set, the
 * client runs in the optional confidential mode (demo-only).
 */
export async function buildOidcSettings(): Promise<AuthProviderProps> {
  const metadata = config.proxy ? await buildProxiedMetadata() : undefined;

  const settings = {
    authority: config.authority,
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    post_logout_redirect_uri: config.post_logout_redirect_uri,
    scope: config.scope,
    response_type: 'code',
    loadUserInfo: config.load_user_info,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    onSigninCallback: () => {
      // Strip ?code & ?state from the URL after the redirect callback.
      window.history.replaceState({}, document.title, window.location.pathname);
    },
    ...(config.client_secret ? { client_secret: config.client_secret } : {}),
    ...(metadata ? { metadata } : {}),
  };

  return settings as AuthProviderProps;
}
