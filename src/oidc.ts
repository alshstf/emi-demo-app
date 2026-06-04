import type { AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import { config } from './config';

// Authorization Code Flow + PKCE for a public client (no client_secret).
// oidc-client-ts enables PKCE automatically for response_type "code".
export const oidcConfig: AuthProviderProps = {
  authority: config.authority,
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  post_logout_redirect_uri: config.post_logout_redirect_uri,
  scope: config.scope,
  response_type: 'code',
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // After the redirect callback is processed, strip ?code & ?state from the URL.
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
