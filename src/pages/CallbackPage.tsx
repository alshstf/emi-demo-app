import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { theme } from '../theme';
import { markJustLoggedIn } from '../auth/loginFlag';

// Lands here after the IdP redirect. react-oidc-context exchanges the code for
// tokens automatically; we just wait, then route to "/" for role dispatch.
export function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading) return;
    if (auth.isAuthenticated) {
      markJustLoggedIn();
      navigate('/', { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  if (auth.error) {
    return <theme.AuthError error={auth.error} onHome={() => navigate('/', { replace: true })} />;
  }

  return <theme.Splash label={theme.splash.auth} />;
}
