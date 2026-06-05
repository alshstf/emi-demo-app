import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { config } from '../config';

/**
 * RP-initiated logout via the IdP end_session endpoint.
 *
 * Sends `client_id` explicitly (some IdPs — incl. Evolution MI — require it and
 * otherwise reject with "Client id parameter is empty") alongside the default
 * `id_token_hint` and `post_logout_redirect_uri`. Falls back to a local
 * sign-out if the IdP has no end_session endpoint.
 */
export function useLogout() {
  const auth = useAuth();
  const navigate = useNavigate();

  return useCallback(async () => {
    try {
      await auth.signoutRedirect({
        post_logout_redirect_uri: config.post_logout_redirect_uri,
        extraQueryParams: { client_id: config.client_id },
      });
    } catch {
      await auth.removeUser();
      navigate('/', { replace: true });
    }
  }, [auth, navigate]);
}
